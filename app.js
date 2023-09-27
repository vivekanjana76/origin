//jshint esversion:6
require('dotenv').config();
const express = require('express'); //importing the express module.
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);




app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
    .then(() => {
        res.render("secrets");
    })
    .catch((err) => {
        console.error(err);
    });

    // try {                               //you can also use this in place of above .then & .catch but 
    //     await newUser.save();           //don't forget to add async before the function
    //     res.redirect("secrets");
    // } catch (err) {
    //     console.error(err);
    // }
    
});

app.post("/login", async function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    try {
        const foundUser = await User.findOne({ email: username });
    
        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        } else {
            console.log("Authentication failed");
            // Handle the case when the user is not found or the password is incorrect
        }
    } catch (err) {
        console.error(err);
        // Handle any potential errors that occur during the database query
    }
    
});






app.listen(3000, function() {
    console.log("Server started on port 3000");
});
