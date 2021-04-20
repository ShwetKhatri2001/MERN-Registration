import React,{ useState} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import axios from "axios";

const ResetPass = () => {

  const {token} = useParams();
  const history = useHistory();
  const [passreset,setPassReset] = useState(true);

  const [userData,setUserData] = useState({
    password:'',confirmpassword:''
  })

  let name,value;const {password,confirmpassword} = userData;
  const handleFormChange = (e) => {

     name = e.target.name;
     value = e.target.value;
     setUserData({...userData,[name]:value})
  }
  

  const sendResetData = async(e) => {
      e.preventDefault();

      try{
          const res = await axios({
             url:`${process.env.REACT_APP_URL}/resetpass`,
             validateStatus: function (status) {
                 return status < 500; 
               },
             method: 'POST',
             headers:{
                 "Content-Type": "application/json"
             },
             data: JSON.stringify({
                 token,password,confirmpassword
             }),
             withCredentials: true
         })
 
         if(res.data.passResetUser){
             history.push("/signin");
             toast.success(`You have changed your password successfully , try to login with your new password`,{position: toast.POSITION.TOP_CENTER});
         }
         else if(res.data.errors){
            setPassReset(false);
            toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
         }
       
        }
        catch(err){console.log(err);}
      }

    return (
        <>
            <div className="outer-container" id="outer-container" >
             <div className="container" id="container" >
               {(!passreset) ? <ToastContainer/> : null}
               <div className="form-container sign-in-container">
                <form action="/users/password/forgot" method="POST">
                    <h1>Reset Password </h1>
                    <br/>
                    <span>Enter your new password here</span>
                    <input type="password" className="md_input" name="password" placeholder="Password" 
                           value={password} onChange={handleFormChange}/>
                    <input type="password" className="md_input" name="confirmpassword" placeholder="Confirm Password" 
                            value={confirmpassword} onChange={handleFormChange}/>
                    <button className="formbtn" onClick={sendResetData}>Reset Now</button>
                </form>
              </div>
              <div className="overlay-container">
                <div className="overlay">
                <div className="overlay-panel overlay-right" >  
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

export default ResetPass
