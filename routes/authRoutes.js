const express = require("express");
const router = new express.Router();
const  auth  = require("../middleware/auth");
const {contact_get,contact_post,logout_get,login_post,google_post,facebook_post
      ,register_post,about_get,edituser_post,activate_post,forgotpass_post,resetpass_post} = require("../controllers/authControllers");

router.get("/about",auth,about_get);
router.get("/contact",auth,contact_get);
router.get("/logout",logout_get);
router.post("/activate",activate_post);
router.post("/login",login_post);
router.post("/googlelogin",google_post);
router.post("/facebooklogin",facebook_post);
router.post("/register",register_post);
router.post("/contact",auth,contact_post);
router.post("/edituser",auth,edituser_post);
router.post("/forgotpass",forgotpass_post);
router.post("/resetpass",resetpass_post);

module.exports = router;

