import React,{useState,useEffect,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import { toast,ToastContainer} from 'react-toastify';
import {UserContext} from "../App";
import axios from "axios";
import manpic from "../manpic.png";
import womanpic from "../womanpic.png";


const UserProfile = () => {

    const history = useHistory();
    const [userData,setUserData] = useState({});
    const {state,dispatch} = useContext(UserContext);

    useEffect(()=>{
     
        const authUserProfile = async () => {
            try{
                const res = await axios({
                    url:`/about`,
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
                    dispatch({type:'user', payload: true})
                    setUserData(res.data.authUser);
                  }

                else if(res.data.errors || !res.data.authUser)
                {
                    dispatch({type:'user', payload: false})
                    history.push('/signin');
                    toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
                }  
                
            }catch(err){console.log(err);}
             
            }
        return authUserProfile();
    },[history,dispatch])

    const {firstname,lastname,email,phone,gender,age} = userData;

    return (
        <>
          <div className="outer-container" id="outer-container" >
               <div className="container user-container">
                 {(state) ? <ToastContainer/> : null }
                    <div className="user_left" data-aos="fade-up">
                        <img src={(gender==="Female") ? womanpic : manpic} alt="mydp" className="mydp"/>
                        <div className="infobox">
                            <i className="fas fa-user usericon"></i>
                            <div className="info_keyval"><h4>Name :</h4><h5>{firstname} {lastname}</h5></div>  
                        </div>
                        
                    </div>
                    <div className="user_right" data-aos="fade-up">
                        <div className="infobox">
                                <i className="fas fa-envelope usericon"></i>
                                <div className="info_keyval"><h4>Email :</h4><h5>{email}</h5></div>  
                        </div>
                        <div className="infobox">
                            <i className="fas fa-mobile-alt usericon"></i>
                            <div className="info_keyval"><h4>Phone :</h4><h5>{(phone) ? phone : 'Not Provided'}</h5></div>  
                        </div>
                        <div className="infobox">
                            <i className="far fa-user usericon"></i>
                            <div className="info_keyval"><h4>Age :</h4><h5>{(age) ? `${age} years` : 'Not Provided' } </h5></div>  
                        </div>
                        <div className="infobox">
                            <i className={(gender==="Female") ? `fas fa-female usericon` : `fas fa-male usericon`}></i>
                            <div className="info_keyval"><h4>Gender :</h4><h5>{(gender!=='----') ? gender : 'Not Provided'}</h5></div>  
                        </div>
                        <Link to="/editprofile"><button className="panelbtn editbtn" >Edit Profile</button></Link>
                    </div>
                </div>
           </div>
        </>

    )
}

export default UserProfile;