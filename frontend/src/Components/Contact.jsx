import React,{useState,useEffect,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import { ToastContainer,toast} from 'react-toastify';
import {UserContext} from "../App";
import axios from "axios";
import mydp from "../mydp.jpg";


const Contact = () => {

    const history = useHistory();
    const {state,dispatch} = useContext(UserContext);
    const [userData,setUserData] = useState({
        firstname:'',lastname:'',email:'',subject:'',message:'',   
    })

    const {firstname,lastname,email,subject,message} = userData;

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
                    dispatch({type:'user', payload:true});
                    setUserData({firstname:res.data.authUser.firstname,
                                lastname:res.data.authUser.lastname,email:res.data.authUser.email,subject:'',message:''});
                }
                else if(res.data.errors || !res.data.authUser)
                {
                    history.push('/signin');
                    dispatch({type:'user', payload:false});
                    toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
                }   
            }
            catch(err){console.log(err);}
             
            }
        return authUserProfile();
    },[history,dispatch])

    const sendContactData = async (e) =>{
        e.preventDefault();

        try{
            const res = await axios({
               url:`/contact`,
               validateStatus: function (status) {
                   return status < 500; 
                 },
               method: 'POST',
               headers:{
                   "Content-Type": "application/json"
               },
               data: JSON.stringify({
                  firstname,lastname,email,subject,message
               }),
               withCredentials: true
           })
   
           if(res.data.success){
               toast.success( res.data.success,{position: toast.POSITION.TOP_CENTER});
               setUserData({...userData,subject:"",message:""})
              
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
            {(state) ? <ToastContainer/> : null}
            <div className="form-container sign-up-container"></div>
            <div className="form-container sign-up-container"> 
                <form method="POST">
                <h1>Get In Touch</h1>
                <div className="social-container">
                    <div className="social-btns"><a href="https://www.linkedin.com/in/shwet-khatri-4ab216196" target="blank"><i className="fab fa-linkedin-in  fa-2x"></i></a></div>
                    <div className="social-btns"><a href="https://github.com/ShwetKhatri2001" target="blank"><i className="fab fa-github fa-2x"></i></a></div>
                    <div className="social-btns"><a href="https://www.hackerrank.com/Shwetkhatri" target="blank"><i className="fab fa-hackerrank fa-2x"></i></a></div>
                    
                </div>
                <span>Contact me for any queries and feedback </span>
                <div>
                    <input type="text" name="firstname" className="sm_input" placeholder="First Name" value={firstname} onChange={handleFormChange}/>
                    <input type="text" name="lastname" className="sm_input" placeholder="Last Name" value={lastname} onChange={handleFormChange}/>
                </div>
                <input type="email" name="email" className="lg_input" placeholder="Email Address" value={email} onChange={handleFormChange}/>
                <input type="text" name="subject" className="lg_input" placeholder="Subject for message" value={subject} onChange={handleFormChange}/>
                <textarea name="message" className="msg_text"  placeholder="Message" value={message} onChange={handleFormChange}/>
                <button className="formbtn" type="submit" onClick={sendContactData}>Send Message</button>
                </form>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                    <div className="contact-developer" >
                       <img src={mydp} alt="mydp" className="mydp contactdp"/>
                       <div className="devprofile">
                        <div className="infobox">
                            <i className="fas fa-user usericon"></i>
                            <div className="info_keyval"><h4 className="devlabel">Developer's Name :</h4><h5>Shwet Khatri</h5></div>  
                        </div>
                        <div className="infobox devemail">
                                <i className="fas fa-envelope usericon"></i>
                                <div className="info_keyval"><h4 className="devlabel">Developer's Email :</h4><h5>shwetkhatri2001@gmail.com</h5></div>  
                        </div>
                        <div className="infobox">
                            <i className="fas fa-comment"></i>
                            <div className="info_keyval"><h4 className="devlabel">Message :</h4><h5>Hi 👋 I (Shwet Khatri) am the developer for this creation. Feel free to contact me for any queries and feedback for this web app.
                            I am open for such kind of work. Stay Happy ! Stay Safe ! 😄</h5></div>
                        </div>
                        </div>
                   </div>
              </div>
            </div>
          </div>
         </div>
        </>
    )
}

export default Contact;