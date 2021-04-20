import React,{useState, useContext} from 'react';
import axios from "axios";
import{ Link, useHistory} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import {UserContext} from "../App";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";

const Login = () => {

    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const [userData,setUserData] = useState({
        firstname:'',lastname:'',email:'',phone:'',gender:'Male',age:'',password:'',confirmpassword:'',
        emailid:'',pass:''
    })

    let name,value;
    const handleFormChange = (e) => {

        name = e.target.name;
        value = e.target.value;
        setUserData({...userData,[name]:value})
    }

    const signin = () => document.getElementsByClassName("container")[0].classList.remove('right-panel-active');
    const signup = () => document.getElementsByClassName("container")[0].classList.add('right-panel-active');


    const showError = (errors) =>
    {
        errors.every(err => {
            if(err !== "No Error")
               {toast.error(err,{position: toast.POSITION.TOP_CENTER});return false;}

            return true;
        })
        
    }

     const {firstname,lastname,email,phone,age,gender,password,confirmpassword,emailid,pass} = userData;

     const sendLoginData = async (e) =>{
        e.preventDefault();

        try{
            const res = await axios({
               url:`${process.env.REACT_APP_URL}/login`,
               validateStatus: function (status) {
                   return status < 500; 
                 },
               method: 'POST',
               headers:{
                   "Content-Type": "application/json"
               },
               data: JSON.stringify({
                   emailid,pass
               }),
               withCredentials: true
           })
   
           if(res.data.user){
               history.push('/');
               dispatch({type:'user', payload:true});
           }
           else if(res.data.errors){
               showError(Object.values(res.data.errors));
           }

           setUserData({firstname:'',lastname:'',email:'',phone:'',gender:'Male',age:'',password:'',confirmpassword:'',emailid:'',pass:''});
           
          }
          catch(err){console.log(err);}
        
    } 

    const sendRegisterData = async (e) =>{
        e.preventDefault();

       try{
         const res = await axios({
            url:`${process.env.REACT_APP_URL}/register`,
            validateStatus: function (status) {
                return status < 500; 
              },
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                firstname,lastname,email,phone,age,gender,password,confirmpassword
            }),
            withCredentials: true
        })

        if( res.data.success){
            history.push('/');
            dispatch({type:'user', payload:true});
            toast.success(res.data.success,{position: toast.POSITION.TOP_CENTER});
            setUserData({firstname:'',lastname:'',email:'',phone:'',gender:'Male',age:'',password:'',confirmpassword:'',emailid:'',pass:''});
        }
        else if(res.data.errors ){
            dispatch({type:'user', payload:false});
            showError(Object.values(res.data.errors));
        }

       }
       catch(err){console.log(err);}
           
    } 

    return (
    <div className="outer-container" id="outer-container">
        <div className="container" id="container">
            {(!state) ? <ToastContainer/> : null}
            <div className="form-container sign-up-container"> 
                <form method="POST">
                <h1>Create Account</h1>
                <span>Sign Up using</span>
                <div className="social-container">
                    <div className="social-btns"><LoginGoogle/></div>
                    <div className="social-btns"><LoginFacebook/></div>
                </div>
                <span>or use your email for registration</span>
                <div>
                    <input type="text" name="firstname" className="sm_input" placeholder="First Name" value={firstname} onChange={handleFormChange}/>
                    <input type="text" name="lastname" className="sm_input" placeholder="Last Name" value={lastname} onChange={handleFormChange}/>
                </div>
                <input type="email" name="email" className="lg_input" placeholder="Email Address" value={email} onChange={handleFormChange}/>
                <div>
                    <input type="phone" name="phone" className="sm_input" placeholder="Phone number" value={phone} onChange={handleFormChange}/>
                    <input type="number" name="age" className="sm_input" placeholder="Age" value={age} onChange={handleFormChange} />
                </div>
                <div className="radiobtns">
                    <input type="radio" name="gender" value="Male" id="Male" defaultChecked onChange={handleFormChange}/>
                      <label htmlFor="Male">Male</label>
                    <input type="radio" name="gender" value="Female" id="Female" onChange={handleFormChange}/>
                      <label htmlFor="Female">Female</label>
                </div>
                <div>
                    <input type="password" name="password" className="sm_input"  placeholder="Password" value={password} onChange={handleFormChange} />
                    <input type="password" name="confirmpassword" className="sm_input" placeholder="Confirm Password" value={confirmpassword} onChange={handleFormChange}/>
                </div>
                <button className="formbtn" type="submit" onClick={sendRegisterData}>Sign Up</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form  method="POST">
                <h1>Sign In</h1>
                <span>Sign In using</span>
                <div className="social-container">
                    <div className="social-btns"><LoginGoogle/></div>
                    <div className="social-btns"><LoginFacebook/></div>
                </div>
                <span>or use your account</span>
                <input type="email" className="md_input" name="emailid" placeholder="Email" value={emailid} onChange={handleFormChange}/>
                <input type="password" className="md_input" name="pass" placeholder="Password" value={pass} onChange={handleFormChange}/>
                  <Link to="/password/forgot" className="forgotlink">Forgot your password?</Link>
                  <br/>
                <button className="formbtn" onClick={sendLoginData}>Sign In</button>
                </form>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1> Welcome Back!</h1>
                    <p>
                        To keep connected with us please login with your personal info registered before</p>
                    <button className="panelbtn" id="signIn" onClick={signin}>Sign In</button>
                </div>
                <div className="overlay-panel overlay-right"><br/>
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details if you have not registered yet and start journey with us </p>
                    <button className="panelbtn" id="signUp" onClick={signup}>Sign Up</button>
                </div>
              </div>
            </div>
        </div>
    </div>
    )
}

export default Login;
