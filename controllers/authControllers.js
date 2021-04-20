const registration = require("../models/registration");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');
const { OAuth2Client } = require('google-auth-library');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const handleErrors = (err) => {
    
    let errors = {firstname:'No Error',lastname:'No Error',email:'No Error',gender:'No Error',
                  phone:'No Error',age:'No Error',password:'No Error',confirmpassword:'No Error'}

    if(err.message === 'Invalid Login Details')
      {
          errors.email = 'Some Login Details are not valid';
          errors.password = 'Some Login Details are not valid';
      }
    if(err.message === 'Passwords are not matching') 
       errors.confirmpassword = 'Passwords are not matching';

    //duplicates errors
    if(err.code === 11000){
        let errfield = Object.keys(err.keyPattern)[0];
        errors[errfield] = `This ${errfield} is already registered`;
        return errors;
    }
    
    //validation errors
    else if(err.message.includes('registration validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
        
    }

    return errors;
    
}


const about_get = (req,res) => {
    res.status(200).json({authUser : req.authUser});
}

const contact_get = (req,res) => {
    res.status(200).json({authUser : req.authUser});
}


const logout_get = async(req,res) => {
    try{

        res.clearCookie("jwt");
        res.status(200).json({success:'You are logged out now, Login again, visit again!'});

    }catch(err){
         res.status(400).json({errors:err});
    }
}

const register_post = async (req,res) => {
    try{
        const { firstname, lastname,email,gender, phone, age, password, confirmpassword} = req.body;

        if(password===confirmpassword)
          {
             const newUser = new registration({
                firstname,
                lastname,
                email,
                gender,
                phone,
                age,
                password,
                confirmpassword,
                activated:false 
             })

            const token = await newUser.generateAuthToken();
            res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
            const registeredUser = await newUser.save();

            const msg = {
              to: email, 
              from: process.env.DEVELOPER_MAIL, 
              subject: 'Account Activation Link',
              html: `
              <h1>Please use the following to activate your account</h1>
              <p>${process.env.APP_URL}/activate/${token}</p>
              <hr />
              <p>This email may containe sensetive information</p>
              <hr/>
              <p>This mail has been sent from MERN REGISTRATION Application:${process.env.APP_URL}</p>
              `
              ,
              }
            sgMail.send(msg).then(() => {
                res.status(201).json({
                    success:`Email has been sent to ${email} , Check in Mailbox and activate via email`,
                  })
                })
                .catch((err) => {
                    alert(err);
                })
              
          }
        else{
            throw Error("Passwords are not matching");
        }

    }catch(err){console.log(err);
       const errors = handleErrors(err);
       res.status(400).json({errors});
    }
}


const login_post = async (req, res) => {
    try{
        const email = req.body.emailid;
        const password = req.body.pass;
        
        const loggedUser = await registration.findOne({email: email});
        
        if(loggedUser)
        {const passwordMatch = await bcrypt.compare(password,loggedUser.password);
           
           if(passwordMatch){
               const token = await loggedUser.generateAuthToken();
               res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
               res.status(200).json({user:loggedUser});
           }
           else{
               throw Error("Invalid Login Details")
           }
            
        }
        else{
            throw Error("Invalid Login Details");
        }
        
    }catch(err){
        const errors = handleErrors(err);
         res.status(400).json({errors});
    }
}


const google_post = async (req,res) =>{
   
  try{

    const client = new OAuth2Client(process.env.GOOGLE_ID);
    const { idToken } = req.body; 

    const googleres = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_ID });
    
    const { email_verified, given_name,family_name, email,iat,exp} = googleres.payload;
      
    if (email_verified) {

      const registeredAlready = await registration.findOne({email: email});

      if(registeredAlready) {
        const token = await registeredAlready.generateAuthToken();
        res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
        res.status(200).json({user:registeredAlready});
      }
      else{
        const newUser = new registration({
          firstname:given_name,
          lastname:family_name,
          email,
          gender:'----',
          phone:0,
          age:0,
          password: JSON.stringify(iat) + process.env.SECRET_KEY  + JSON.stringify(exp),
          confirmpassword: JSON.stringify(iat) + process.env.SECRET_KEY  + JSON.stringify(exp),
          activated:true
       })
       const token = await newUser.generateAuthToken();
       res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
       const registeredUser = await newUser.save();
       res.status(200).json({user:registeredUser});
      }
   }
 else{
     throw Error("The Google account you are using is not email verified, Try to login with email.");
 }

}catch(err){
  res.status(400).json({errors:err});
}
   
}

const facebook_post = async (req,res) => {
  
  try{
      
    if (req.body.fbuser) {

      const {id,email,name} = req.body.fbuser;
      const [firstname,lastname] = name.split(" ");

      const registeredAlready = await registration.findOne({email: email});

      if(registeredAlready) {
        const token = await registeredAlready.generateAuthToken();
        res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
        res.status(200).json({user:registeredAlready});
      }
      else{
        const newUser = new registration({
          firstname,
          lastname,
          email,
          gender:'----',
          phone:0,
          age:0,
          password: id + process.env.SECRET_KEY  + email,
          confirmpassword: id + process.env.SECRET_KEY  + email,
          activated:true
       })
       const token = await newUser.generateAuthToken();
       res.cookie("jwt", token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
       const registeredUser = await newUser.save();
       res.status(200).json({user:registeredUser});
      }
   }
 else{
     throw Error("Facebook login has failed, Try to login with email");
 }

}catch(err){
  res.status(400).json({errors:err});
}

}

const activate_post = async (req,res)=> {

    try{
        const token = req.body.token;

        if(token){
  
          jwt.verify(token,process.env.SECRET_KEY,async (err,decodedToken) => {
            if(err) {
              return res.status(400).json({errors:'Please use the same activation link provided in mail before it expires'})
             }
            else{
               const registeredUser = await registration.findOne({ _id:decodedToken._id, "tokens.token":token});
               if(registeredUser) 
               {
                 const activated = await registeredUser.activateUser();
                if(activated)
                {
                 const activatedUser = await registeredUser.save();
                 res.cookie("jwt",token, { expires: new Date(Date.now() + 3600000),sameSite: false, secure:false});
                 res.status(200).json({activatedUser:activatedUser});
                }
                else{
                  throw Error('An Error has accured, Please try to activate your account again');
                }
               }
               else{
                 throw Error('You have not registered yet')
               }
               
            }
        });

        }
        else{
            throw Error('You have not registered yet');
        }
        
    }catch(err){
        res.status(400).json({errors:err});
    }    
}

const forgotpass_post = async (req,res) =>{
   try{
        
     const email = req.body.email;
     
     if(!email)
        throw Error('Please fill your registered email');

     const registeredUser = await registration.findOne({email: email});
        
     if(registeredUser)
      {
      const token = await registeredUser.generateAuthToken();
       
      const msg = {
          to: email, 
          from: process.env.DEVELOPER_MAIL, 
          subject: 'Reset Password Link',
          html: `
          <h1>Please use the following link to reset your password</h1>
          <p>${process.env.APP_URL}/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <hr/>
          <p>This mail has been sent from MERN REGISTRATION Application:${process.env.APP_URL}</p>
           `,
          }
        sgMail.send(msg).then(() => {
            res.status(201).json({
                success:`Email has been sent to ${email} , Check in Mailbox to reset your password`,
              })
            })
            .catch((err) => {
                alert(err);
            })
      }
    else{
        throw Error("Please use valid and your registered email with us");
    }

  }catch(err){
    res.status(400).json({errors:err});
  }

}

const resetpass_post = async (req,res) => {

  try{
    const {token,password,confirmpassword} = req.body;

    if(!password || ! confirmpassword){
         res.status(400).json({errors:'Please fill all fields'});
    }

    if(password.length < 6 || confirmpassword.length < 6){
      res.status(400).json({errors:'Minimum 6 characters required in password'});
    }
       

    if(password!==confirmpassword){
      res.status(400).json({errors:'Passwords are not matching'});
    }

     if(token){

       jwt.verify(token,process.env.SECRET_KEY,async (err,decodedToken) => {
         if(err) {
          return res.status(400).json({errors:'Please use the same reset password link provided in mail before it expires'})
         }
         else{
           const registeredUser = await registration.findOne({ _id:decodedToken._id, "tokens.token":token});
           if(registeredUser) 
           {
              const passchange = await registeredUser.resetPass(password);
              if(passchange)
              {
                const passResetUser = await registeredUser.save();
                res.status(200).json({passResetUser:passResetUser});
              }
              else{
                throw Error('An Error has accured, Please try to reset your password again');
              }
           }
           else{
             throw Error('You have not registered yet')
           }
           
         }
      });

     }
     else{
        throw Error('You have not registered yet');
     }
  
  }catch(err){
      res.status(400).json({errors:err});
  }    

}

const contact_post = async (req,res) => {
  try{
        
    const { firstname,lastname,email,subject,message} = req.body;

    if(!firstname || !lastname || !email || !subject || !message)
       throw Error('Please fill all the fields');

    const contactUser = await registration.findOne({_id: req.authUserId, email:email});

    if(contactUser){
       const userMessage = await contactUser.addMessage(subject,message);

       const devmsg = {
        to: process.env.DEVELOPER_MAIL, 
        from: process.env.DEVELOPER_MAIL, 
        subject: `From Mern Registration: ${subject}`,
        html: `
        <h1>Hey Shwet ! A user has contacted you from your MERN registration web application. </h1>
        <hr />
        <h3>UserName: ${firstname} ${lastname}</h3>
        <h3>UserEmail: ${email}</h3>
        <hr />
        <h4>User Message : ${userMessage}</h4>
        <hr />
         `
        ,
      }
      sgMail.send(devmsg).then(() => {
        })
        .catch((err) => {
            throw Error(err);
        })

        const usermsg = {
          to: email, 
          from: process.env.DEVELOPER_MAIL, 
          subject: `Message from MERN Registration `,
          html: `
          <h1>Hey ${firstname} ! Hope you are doing well ! </h1>
          <hr />
          <p>This is an auto-generated mail to tell you that you have sent a message to our developer - Shwet Khatri successfully.</p>
          <p>You will be contacted soon when he will open your message</p>
          <hr />
          <h3> Keep Supporting us ! Thank You ! </h3>
          <hr />
           `
          ,
        }
        sgMail.send(usermsg).then((sentres) => {
            res.status(200).json({
               success:`Your message has been sent to our Developer, Also Check your Mailbox for a response sent by us`
            })
          })
          .catch((err) => {
              throw Error(err);
          })
    }
    else{
       throw Error('Please use your credentials registered with us')
    }

 
  }
  catch(err){
    res.status(400).json({errors:err});
  }
}

const edituser_post = async (req,res) => {
  try{

    const { firstname,lastname,email,phone,age,gender} = req.body;

    if(!firstname || !lastname || !email || !phone || !age || !gender)
       throw Error('Please fill all the fields');

    const registeredUser = await registration.findOne({_id: req.authUserId, email:email});
   
    if(registeredUser){
       const editUser = await registeredUser.editUser(firstname,lastname,email,phone,age,gender);
       res.status(200).json({user:editUser})
    }
    else{
       throw Error('Please use the email registered with us')
    }

  }
  catch(err){
    res.status(400).json({errors:err});
  }
}

module.exports = {logout_get,login_post,contact_post,google_post,facebook_post,register_post,
                   contact_get,about_get,edituser_post,activate_post,forgotpass_post,resetpass_post};
