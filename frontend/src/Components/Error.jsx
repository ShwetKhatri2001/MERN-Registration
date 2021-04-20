import React from 'react';
import {Link} from "react-router-dom";

const Error = () => {
    return (
       <>
         <div className="outer-container" id="outer-container" >
           <div className="container home-container" id="container">
              <h1 data-aos="fade-up" className="_404">404</h1>
              <h1 data-aos="fade-up">Page Not Found</h1>
              <Link to="/"><button className="panelbtn" id="signIn" data-aos="fade-up">Go to Home</button></Link>
           </div>
        </div>
       </>
    )
}

export default Error
