import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      Navbar
      <Link to={"./"}>
        <button>Home</button>
      </Link>
      <Link to={"./doctors"}>
        <button>Doctors</button>
      </Link>
    </div>
  );
};

export default Navbar;
