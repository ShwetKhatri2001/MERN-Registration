const jwt = require("jsonwebtoken");
const registration = require('../models/registration');

const auth = async (req, res, next) => {
     try{
        const token = req.cookies.jwt;
        if(token )
        {
         jwt.verify(token,process.env.SECRET_KEY,async (err,decodedToken) => {
            if(err) {
               res.status(400).json({errors:'You are not logged in / have not registered / have not activated account via email'});
             }
            else{

               const authUser = await registration.findOne({ _id:decodedToken._id, "tokens.token":token});

               if(authUser && !authUser.activated)
                 {
                  res.status(400).json({errors:'You have not activated your account via email'});
                 }

               else if(authUser && authUser.activated)
                  { req.token = token;
                    req.authUser = authUser;
                    req.authUserId = authUser._id; 

                    next();
                  }
               
               else{
                   res.status(400).json({errors:'You have not registered'});
                  }
              }
            });
        }
        else{
         res.status(400).json({errors:'You are not logged in / have not registered / have not activated account via email'});
        }
    }
    catch(err){
       res.status(400).json({errors:err})
    }
  
}


module.exports = auth;