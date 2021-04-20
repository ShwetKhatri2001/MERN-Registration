import React,{useState,useEffect,useContext} from 'react';
import {useHistory,Link} from 'react-router-dom';
import { ToastContainer,toast} from 'react-toastify';
import { UserContext } from "../App";
import axios from "axios";

const EditProfile= () => {

    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [userData,setUserData] = useState({
        firstname:'',lastname:'',email:'',phone:'',gender:'Male',age:'' 
    })

    const {firstname,lastname,email,phone,gender,age} = userData;

    let name,value;
    const handleFormChange = (e) => {

        name = e.target.name;
        value = e.target.value;
        setUserData({...userData,[name]:value})
    }

    useEffect( ()=>{
     
        const authUserProfile = async () => {
            try{
                const res = await axios({
                    url:`/contact`,
                    validateStatus: function (status) {
                        return status < 500; 
                    },
                    method: 'GET',
                    headers:{
                        accept: 'application/json',
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                })
                
                if(res.data.authUser)
                {   
                    const userInfo = res.data.authUser;
                    dispatch({type:'user', payload:true});
                    setUserData({firstname:userInfo.firstname,lastname:userInfo.lastname,
                        email:userInfo.email,phone:userInfo.phone,age:userInfo.age,gender:'Male'});
                }
                else if(res.data.errors || !res.data.authUser)
                {
                    dispatch({type:'user', payload:false});
                    history.push('/signin');
                    toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
                }   
            }
            catch(err){console.log(err);}
             
            }
        return authUserProfile();
    },[history,dispatch])

    const sendNewUserData = async (e) =>{
        e.preventDefault();

        try{
            const res = await axios({
               url:`${process.env.REACT_APP_URL}/edituser`,
               validateStatus: function (status) {
                   return status < 500; 
                 },
               method: 'POST',
               headers:{
                   "Content-Type": "application/json"
               },
               data: JSON.stringify({
                  firstname,lastname,email,phone,gender,age
               }),
               withCredentials: true
           })
           
           if(res.data.user){
               history.push('/userprofile')
               toast.success('Your Profile Details has been edited and saved',{position: toast.POSITION.TOP_CENTER});
              
           }
           else if(res.data.errors){
              toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
           }

          }
          catch(err){console.log(err);}
        
    } 

    return (
        <>
        <div className="outer-container" id="outer-container">
           <div className="container right-panel-active" id="container">
            {(!state) ? <ToastContainer/> : null}
            <div className="form-container sign-up-container"></div>
            <div className="form-container sign-up-container"> 
                <form method="POST">
                <h1>Edit Profile</h1>
                <span>Enter new details for your profile</span>
                <div>
                    <input type="text" name="firstname" className="sm_input" placeholder="First Name" value={firstname} onChange={handleFormChange}/>
                    <input type="text" name="lastname" className="sm_input" placeholder="Last Name" value={lastname} onChange={handleFormChange}/>
                </div>
                <input type="email" name="email" className="lg_input" placeholder="Email Address" value={email} onChange={handleFormChange}/>
                <div className="radiobtns">
                    <input type="radio" name="gender" value="Male" id="Male" defaultChecked onChange={handleFormChange}/>
                      <label htmlFor="Male">Male</label>
                    <input type="radio" name="gender" value="Female" id="Female" onChange={handleFormChange}/>
                      <label htmlFor="Female">Female</label>
                </div>
                <div>
                    <input type="phone" name="phone" className="sm_input" placeholder="Phone number" value={phone} onChange={handleFormChange}/>
                    <input type="number" name="age" className="sm_input" placeholder="Age" value={age} onChange={handleFormChange} />
                </div>
                <button className="formbtn" type="submit" onClick={sendNewUserData}>Save Profile</button>
                </form>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                 <div className="overlay-panel overlay-left">
                    <h1> Hey {firstname}!</h1>
                    <p>
                        To make your connection stronger than what today ,update us about new yourself</p>
                    <Link to="/userprofile" ><button className="panelbtn" id="signIn">Current Profile</button></Link>
                </div>
              </div>
            </div>
          </div>
         </div>
        </>
    )
}

export default EditProfile;