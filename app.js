const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const nodemailer = require("nodemailer");
const { join } = require("path");
var multer = require('multer');
var upload = multer();


const app = express(); 

app.set("view engine", "hbs");
app.set("views", join(__dirname, "template/views"));

hbs.registerPartials(join(__dirname, "template/partials"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.array()); 
app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contactForm");
});
 
app.post("/contact/send", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    console.log(req.body); 

    const mailOption = {
        from: "Alqama Shuja <alqamashuja101@gmail.com>",
        to: "alqamashuja101@gmail.com",
        subject: "Form Submit",
        text: `Name: ${req.body.name} \nEmail: ${req.body.email} \nPassword: ${req.body.password} \nMessage: ${req.body.message}`, 
        html: `<p><ul><li>Name: ${req.body.name}</li> <li>Email: ${req.body.email} </li><li>Password: ${req.body.password} </li><li>Message: ${req.body.message}</li><ul></p>`
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "alqamashuja101@gmail.com",
            pass: "password"
        },
    });

    transporter.sendMail(mailOption, (error, info) => {
        if(error){
            console.log(error);
            res.redirect("/contact");
        }
        else{
            console.log("Message Send, " + info.response);
            res.redirect("/");
        }
    })
    res.redirect("/contact");
})

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log("Server is running on port " + port);
});


