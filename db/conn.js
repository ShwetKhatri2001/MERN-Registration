const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USER_PASS}@registration.lnrgk.mongodb.net/${process.env.DB_NAME}`,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`connection failed : ${e}`);
});

