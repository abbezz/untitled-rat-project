import React, { useState } from "react";
import AllRats from "./AllRats";
import Shop from "./Shop";
import Jobs from "./Jobs";
import Cemetery from "./Cemetery";

function MyRats() {
  const styles = {
    section: {
      display: "flex",
    },
    aside: {
      width: "20%",
    },
  };

  const [sideMenuChoice, setMenuChoice] = useState("allRats");

  function renderMenuChoice() {
    switch (sideMenuChoice) {
//       case "allRats":
//         return <AllRats />;
//       case "shop":
//         return <Shop />;
//       case "jobs":
//         return <Jobs />;
      case 'allRats':
        return <AllRats/>;
      case 'shop':
        return <Shop/>;
      case 'jobs':
        return <Jobs/>;
      case 'cemetery':
        return <Cemetery/>
    }
  }

  function sideMenuSelection(e) {
    setMenuChoice(e.target.dataset.page);
  }

  return (
    <section style={styles.section}>
      <aside style={styles.aside}>
        <h2>User Name</h2>
        <ul>

          <li data-page="allRats" onClick={sideMenuSelection}>
            <button data-page="allRats">My Rats</button>
          </li>
          <li data-page="shop" onClick={sideMenuSelection}>
            <button data-page="shop">Shop</button>
          </li>
          <li data-page="jobs" onClick={sideMenuSelection}>
            <button data-page="jobs">Jobs</button>
          </li>
          <li>Cemetery</li>
          //<li data-page='allRats' onClick={sideMenuSelection}><button data-page='allRats'>My Rats</button></li>
          //<li data-page='shop' onClick={sideMenuSelection}><button data-page='shop'>Shop</button></li>
          //<li data-page='jobs' onClick={sideMenuSelection}><button data-page='jobs'>Jobs</button></li>
          <li data-page='cemetery' onClick={sideMenuSelection}><button data-page='cemetery'>Cemetery</button></li>
        </ul>
      </aside>
      {renderMenuChoice()}
    </section>
  );
}

export default MyRats;
