const { Rat, User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    rats: async () => {
      return Rat.find({});
    },
    users: async () => {
      return User.find()
    },
    user: async (parent ,{ _id }) => {
      return User.findOne({ _id })
    }
  },

  Mutation: {

    //register a user
    register: async (parent, {name, email, password }) => {
      // First we create the user
      const user = await User.create({ name, email, password });
      // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };


      // bcrypt.genSalt(10, (err, salt) => {
      //     bcrypt.hash(newUser.password, salt, (err, hash) => {
      //         if (err) throw err;
      //         newUser.password = hash;
      //         newUser
      //             .save()
      //             .then(user => json(user))
      //             .catch(err => console.log(err));
      //     });
      // });

    },

    //login a user
    login: async (parent, {email, password }) => {
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ email });

      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      // const correctPw = await user.isCorrectPassword(password);

      // // If the password is incorrect, return an Authentication error stating so
      // if (!correctPw) {
      //   throw new AuthenticationError('Incorrect credentials');
      // }

      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);

      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },

    addFriend: async(parent, {userID ,friendID }, userInfo) => {
      await User.findOneAndUpdate({ _id: userID }, { $addToSet: { friends: friendID }});
      return
    },
    createRat: async (parent, { name }) => {
      return await Rat.create({ name });
    }
  }
};

module.exports = resolvers;
