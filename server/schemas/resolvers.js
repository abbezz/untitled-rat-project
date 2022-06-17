const { Rat, User, ShopItem, Jobs } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const populateLastFedOnRat = rat => {
  rat.lastFed = "Test";
  return rat;
}

const resolvers = {
  Query: {
    rats: async () => {
      return Rat.find({}).populate("job").map(populateLastFedOnRat);
    },
    users: async () => {
      return User.find().populate("inventory");
    },
    user: async (parent, { _id }) => {
      return User.findOne({ _id }).populate("inventory");
    },
    shopItems: async () => {
      return ShopItem.find();
    },
    shopItem: async (parent, { _id }) => {
      return ShopItem.findOne({ _id });
    },
    jobs: async () => {
      return Jobs.find();
    },
  },

  Mutation: {
    //register a user
    register: async (parent, { name, email, password }) => {
      // First we create the user
      const user = await User.create({ name, email, password });
      // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },

    //login a user
    login: async (parent, { email, password }) => {
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ email });
      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      const correctPw = await user.isCorrectPassword(password);
      // If the password is incorrect, return an Authentication error stating so
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },

    //adding a friend by id
    addFriend: async (parent, { userID, friendID }, userInfo) => {
      //finding a user by id and adding the friends id to the array in the user's model
      await User.findOneAndUpdate(
        { _id: userID },
        { $addToSet: { friends: friendID } }
      );
      return;
    },
    createRat: async (parent, { name, headIndex, bodyIndex, bumIndex }) => {
      const newRat = await Rat.create({ name, headIndex, bodyIndex, bumIndex }); 
      return newRat;
    },
  
    createShopItem: async (parent, { itemName, image, description, price }) => {
      const newItem = await ShopItem.create({
        itemName,
        image,
        description,
        price,
      });
      return newItem;
    },

    buyItem: async (parent, { userID, itemID }) => {
      const item = await ShopItem.findById(itemID);
      const user = await User.findOneAndUpdate({ _id: userID }, { new: true });
      if (user.money < item.price || user.inventory.length >= 9) {
        return user;
      }
      user.inventory.push(itemID);
      user.money = user.money - item.price;
      await user.save();
      return user;
    },

    getJob: async (parent, { jobName, image, description, wages }) => {
      const newJob = await Jobs.create({
        jobName,
        image,
        description,
        wages,
      });
      return newJob;
    },

    applyForJob: async (parent, { ratId, jobId }) => {
      const rat = await Rat.findById(ratId);
      rat.job = jobId;
      await rat.save()
      return rat
    },
  },
};

module.exports = resolvers;
