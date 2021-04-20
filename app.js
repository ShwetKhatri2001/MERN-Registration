require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./db/conn")
const Router = require("./routes/authRoutes");
const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin: [
     `${process.env.APP_URL}`,
     'http://localhost:4000',
   ],
   credentials: true
 }));
app.use(express.urlencoded({extended: false}));

app.use(Router);

if(process.env.NODE_ENV === "production"){
  app.use(express.static("frontend/build"));
}

app.listen(PORT, () => {
   console.log(`Listening to port no ${PORT}`);
})

