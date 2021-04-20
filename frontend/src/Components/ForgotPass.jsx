import React,{useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const ForgotPass = () => {
   
  const[email,setEmail] = useState('');

  const sendEmail = async (e) =>{

    e.preventDefault();

    try{
      const res = await axios({
         url:`${process.env.REACT_APP_URL}/forgotpass`,
         validateStatus: function (status) {
             return status < 500; 
           },
         method: 'POST',
         headers:{
             "Content-Type": "application/json"
         },
         data: JSON.stringify({
             email
         }),
         withCredentials: true
     })

     if(res.data.success){
         toast.success(res.data.success,{position: toast.POSITION.TOP_CENTER});
         setEmail('');
     }
     else if(res.data.errors ){
         toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
     }

    }
    catch(err){console.log(err);}
  }

    return (
        <>
           <div className="outer-container" id="outer-container" >
             <div className="container" id="container" >
              <ToastContainer/>
               <div className="form-container sign-in-container">
                <form action="/users/password/forgot" method="POST">
                    <h1>Forgot Password ?</h1>
                    <br/>
                    <span>Enter your registered email</span>
                    <span>to change password</span>
                    <br/>
                    <input type="email" className="md_input" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <button className="formbtn" onClick={sendEmail}>Submit</button>
                </form>
              </div>
              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-right">  
                     <h1> Welcome Back!</h1>
                     <p>
                        To keep connected with us please login with your personal info registered before</p>
                     <Link to="/signin"><button className="panelbtn" id="signIn" >Sign In</button></Link>
                  </div>
                </div>
              </div>
             </div>
           </div>
        </>
    )
}

export default ForgotPass;
