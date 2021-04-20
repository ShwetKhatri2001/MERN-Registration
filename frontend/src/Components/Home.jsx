import React,{useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";
import mernimg from "../mernhome.png";
import {ToastContainer,toast} from "react-toastify";
import {UserContext} from "../App";
import axios from "axios";

const Home = () => {

   const [username,setUsername] = useState('');
   const history = useHistory();
   const {state,dispatch} = useContext(UserContext);

   useEffect(()=>{
     
      const showUsername = async () => {
          try{
              const res = await axios({
                  url:`${process.env.REACT_APP_URL}/about`,
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
                  dispatch({type:'user', payload: true});
                  setUsername(res.data.authUser.firstname + "  " + res.data.authUser.lastname);
                  toast.success(`Welcome again 👋 ${res.data.authUser.firstname + "  " + res.data.authUser.lastname}`,
                                {position: toast.POSITION.TOP_CENTER});
                 }
              else if(res.data.errors || !res.data.authUser)
              {
                  dispatch({type:'user', payload: false})
              }  
              
          }catch(err){console.log(err);}
           
          }
      return showUsername();
  },[history,dispatch])

    return (
       <>
         <div className="outer-container" id="outer-container" >
           <ToastContainer/>
           <div className="container home-container" id="container" >
              <h1 data-aos="fade-up">Welcome 👋 {(state) ?  'again'  : null} </h1>
              {(state) ? <h1 data-aos="fade-up">{username} </h1> : null}
              <h1 data-aos="fade-up">to</h1>
              <img src={mernimg} alt="mernimg" className="mernimg" data-aos="fade-up"></img>
              <h1 data-aos="fade-up">Registration</h1>
           </div>
        </div>
       </>
    )
}

export default Home;
