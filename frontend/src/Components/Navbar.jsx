import React,{ useContext} from 'react';
import {UserContext} from "../App";
import {NavLink} from "react-router-dom";
import mernimg from "../mernhome.png";

const Navbar = () => {

  const {state} = useContext(UserContext);

  const handleNav = () => {
      var myTopnav = document.getElementById("myTopnav");
      if (myTopnav.className === "topnav") {
        myTopnav.className += " responsive";
      } else {
        myTopnav.className = "topnav";
      }
    }

    
    return (
         <div className="topnav" id="myTopnav">
            <div className="sm_nav">
              <NavLink to="/" ><img src={mernimg} alt="mernimg" className="navimg" data-aos="fade-up"></img></NavLink>
              <i className="fa fa-bars icon" onClick={handleNav}></i>
            </div>
            <div className="navitems">
            <NavLink exact to="/" className="navbtn"  onClick={handleNav}>Home</NavLink>
            <NavLink exact to="/userprofile" className="navbtn"  onClick={handleNav}>My Profile</NavLink>
            <NavLink exact to="/contact" className="navbtn"  onClick={handleNav}>Contact</NavLink>
            {(state) ? <NavLink exact to="/signout" className="navbtn"  onClick={handleNav}>Logout</NavLink> 
                     :<NavLink exact to="/signin" className="navbtn"  onClick={handleNav}>Sign in</NavLink>}
            </div>
            
        </div>
    )
}

export default Navbar;
