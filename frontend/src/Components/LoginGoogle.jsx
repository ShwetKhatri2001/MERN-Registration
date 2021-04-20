import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const LoginGoogle = () => {

  const history = useHistory();

  const responseGoogle = async (response) => {

   try{
    const res = await axios({
      url:`${process.env.REACT_APP_URL}/googlelogin`,
      method: 'POST',
      validateStatus: function (status) {
        return status < 500; 
      },
      data: { idToken: response.tokenId },
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
  };
  return (
    <div className='pb-3'>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_ID}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={renderProps => (
             <i className="fab fa-google  fa-2x" onClick={renderProps.onClick}></i>
        )}
      />
    </div>
  );
};

export default LoginGoogle;