import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const LoginFacebook = () => {

  const history = useHistory();

  const responseFacebook =  async (response) => {
   console.log(response);

  try{

   const {userID,accessToken} = response;
   const facebookres = await axios.get(`https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`);

 
    const res = await axios({
      url:`${process.env.REACT_APP_URL}/facebooklogin`,
      method: 'POST',
      validateStatus: function (status) {
        return status < 500; 
      },
      data: { fbuser: facebookres.data },
      withCredentials: true
    })

    if(res.data.user){
      history.push('/');
    }
    else if(res.data.errors){console.log(res.data.errors);
      toast.error(res.data.errors,{position: toast.POSITION.TOP_CENTER});
    }
  }
  catch(err){console.log(err);}   
  }

  return (
    <div className='pb-3'>
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={renderProps => (
             <i className="fab fa-facebook  fa-2x" onClick={renderProps.onClick}></i>
        )}
      />
    </div>
  );
};

export default LoginFacebook;