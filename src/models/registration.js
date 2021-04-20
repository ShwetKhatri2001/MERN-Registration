const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true,"Please fiil your firstname "]
    },
    lastname : {
        type:String,
        required: [true,"Please fiil your lastname "]
    },
    email: {
        type:String,
        required: [true,"Please fiil your email "],
        unique: true,
        lowercase: true,
        validate:[isEmail,"Please enter a valid Email"]
    },
    gender: {
        type: String,
        required: [true,"Please select your gender "]
    },
    phone: {
        type: Number,
        required: [true,"Please fiil your phone no. "],
        unique: true,
    },
    age: {
        type: Number,
        required: [true,"Please fiil your age "]
    },
    password: {
        type: String,
        required: [true,"Please fiil a secured password"],
        minlength:[6,"Minimum 6 characters required in password"]
    },
    confirmpassword: {
        type: String,
        required: [true,"Please fiil your password again to confirm"],
        minlength:[6,"Minimum 6 characters required in password"]
    },
    activated:{
        type: Boolean,
    },
    messages:[{
        subject:{
            type: String,
             
        },
        message:{
            type: String,
             
        }
    }],
    tokens:[{
        token:{
            type: String,
            
        },
        created_at:{
           type: String,
           
        }
    }]
})

// Generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        // console.log(token);
        this.tokens = this.tokens.concat([{token:token,created_at:new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}]);
        await this.save();
        return token;
    }catch(err){
    }
}

// Add Message sent by User
employeeSchema.methods.addMessage = async function(subject,message){
    try{
        this.messages = this.messages.concat([{subject,message}]);
        await this.save();
        return message;
    }catch(err){
    }
}

//Edit User Profile Details
employeeSchema.methods.editUser = async function(firstname,lastname,email,phone,age,gender){
    try{
        this.firstname = firstname;this.lastname=lastname;this.email = email;this.phone=phone;this.age=age;this.gender=gender;
        await this.save();
        return this;
    }catch(err){
    }
}

// Activating NewUser via Email
employeeSchema.methods.activateUser = async function(){
    try{
        this.activated = true;
        await this.save();
        return this;
        
    }catch(err){
          
    }
}

//Reseting RegistredUser's Password
employeeSchema.methods.resetPass = async function(password){
    try{
        this.password = password;
        await this.save();
        return this;
        
    }catch(err){
          console.log(err);
    }
}

//Converting password into hash
employeeSchema.pre("save",async function(next){

    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword,10);
    }

    next();
})

const Registration = new mongoose.model("registration",employeeSchema);

module.exports = Registration;