import React,{useContext} from 'react';
import { Link, useParams, useHistory} from 'react-router-dom';
import {UserContext} from "../App";
import { ToastContainer,toast } from 'react-toastify';
import axios from "axios";

const Activate = () => {

    const {token} = useParams();
    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);

    const activateAccount = async(e) => {
        e.preventDefault();

        try{
            const res = await axios({
               url:`${process.env.REACT_APP_URL}/activate`,
               validateStatus: function (status) {
                   return status < 500; 
                 },
               method: 'POST',
               headers:{
                   "Content-Type": "application/json"
               },
               data: JSON.stringify({
                   token
               }),
               withCredentials: true
           })
   
           if(res.data.activatedUser){
               dispatch({type:'user', payload: true});
               history.push("/");
               toast.success(`Hey ${res.data.activatedUser.firstname} 👋 ! You have registered successfully.Start your journey with us`,{position: toast.POSITION.TOP_CENTER});
           }
           else if(res.data.errors){
              dispatch({type:'user', payload:false});
              toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
           }
         
          }
          catch(err){console.log(err);}
    }

    return (
        <>
            <div className="outer-container" id="outer-container" >
             <div className="container" id="container" >
               {(!state)?<ToastContainer/>:null}
               <div className="form-container sign-in-container">
                <form method="POST" >
                    <h1>Activate at<br/>MERN Registration</h1>
                    <br/>
                    <button className="formbtn" onClick={activateAccount}>Activate your Account</button>
                    <br/>
                    <span>or want to sign up again ?</span>
                    <Link to="/signin"><button className="formbtn" >Sign Up</button></Link>
                </form>
              </div>
              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-right">
                    <h1> Welcome Again!</h1>
                     <p>To keep connected with us please login if activated already</p>
                     <Link to="/signin"><button className="panelbtn" id="signIn" >Sign In</button></Link>
                  </div>
                </div>
              </div>
             </div>
           </div>
        </>
    )
}

export default Activate;
