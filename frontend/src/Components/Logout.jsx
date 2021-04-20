import React,{useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {UserContext} from "../App";
import { toast} from 'react-toastify';
import axios from "axios";

const Logout = () => {

    const history = useHistory();
    const {dispatch} = useContext(UserContext);

    useEffect( ()=>{
     
        const logoutUser = async () => {
            try{
                const res = await axios({
                    url:`/logout`,
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
                if(res.data.success)
                {   
                    dispatch({type:'user', payload: false});
                    history.push('/signin');
                    toast.success(res.data.success,{position: toast.POSITION.TOP_CENTER});

                }
                else if(res.data.errors || !res.data.success)
                {
                    dispatch({type:'user', payload: true});
                    toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
                }   
            }
            catch(err){console.log(err);}
             
            }
        return logoutUser();
    },[history,dispatch])

    return (
        <div>
             
        </div>
    )
}

export default Logout
