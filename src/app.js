require("dotenv").config();
const express = require("express")
require("./db/connection")
const app = express()
const path = require("path")
const port = process.env.PORT || 8000
const hbs = require("hbs")
const Register = require("./models/login")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")

const staticPath = path.join(__dirname,'../public')
const templaPath = path.join(__dirname,"../templates/views")
const partialPath = path.join(__dirname,"../templates/partials")


app.use(express.static(staticPath))
app.use(cookieParser())


hbs.registerPartials(partialPath)


app.set("view engine","hbs")
app.set("views",templaPath)


app.use(express.json())
app.use(express.urlencoded({extended : false}))


app.get("/"  ,(req,res)=> {
    res.render("login")
})
app.get("/screte" ,auth , (req,res)=> {
    // console.log(req.cookies.jwt)
    res.render("screte")
})


app.get("/login" ,(req,res)=> {
    res.render("login")
})

app.get("/logout",auth,async (req,res) => {
    try {
        
        // logout of single devise 
        req.user.tokens = req.user.tokens.filter(ele => ele.token != req.token);


        res.clearCookie("jwt")

        await req.user.save();


        res.render("login") 
    } catch (error) {
        res.status(400).send(error+ "this is error");
    }
})

app.get("/LogoutOfAll",auth,async (req,res) => {
    try {
        
        // logout of all existing accouts in database
        req.user.tokens = [];


        res.clearCookie("jwt")

        await req.user.save();


        res.render("login") 
    } catch (error) {
        res.status(400).send(error+ "this is error");
    }
})

// create new user in database
app.post("/register" , async (req,res)=> {
    try {

        const password = req.body.password
        const cpassword = req.body.checkpassword


        if(password == cpassword){
            const registerEmployee = new Register({
                firstname : req.body.first_name,
                lastname : req.body.last_name,
                email : req.body.email,
                phone : req.body.phone,
                age : req.body.age,
                gender : req.body.gender,
                password : password,
                confirmpassword : cpassword
            })

            
            // // password hash
            // // middleware
            const token = await registerEmployee.generateAuthToken();


            // The res.cookie()  function is used to set a cookie name to value.
            // The value parameter is string or object converted to JSON.

             res.cookie("jwt",token,{
                expires : new Date(Date.now()+3000),
                httpOnly : true
            })

            

            const user = await registerEmployee.save();
            res.status(200).render("index")
        }else{
            res.status(400).send("Invalid Valid Login Details")
        }
    } catch (error) {
        console.log(error)
        res.status(400).send("error"+error)
    }
})

app.post("/login", async (req,res) => {
    try {

        const email  = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({"email" : email});
        const isMatch = await bcrypt.compare(password,user.password)
        
       

        // console.log(req.cookies.jwt)

        if(isMatch){
            const token = await user.generateAuthToken();

            res.cookie("jwt",token,{
                // expires : new Date(Date.now()+3000),
                httpOnly : true
            })
            return res.render("index")
        }
        res.send("password did not match with the email")
        // res.send("login succesfully")
    } catch (error) {
        res.status(400).send("Entea a valid details")
    }
})


// const jwt = require("jsonwebtoken")
// const createToken = async () => {
//     const token = await jwt.sign({_id :"649128207c77359ada857b54"},"mynameisprasadpadalaandiamadeveloper",{
//         expiresIn : "2 seconds"
//     })
//     console.log(token)


//     const userVer = await jwt.verify(token,"mynameisprasadpadalaandiamadeveloper")
//     console.log(userVer)
// }


// createToken();


app.listen(port,() => {
    console.log(`Listening to the port No ${port}`)
})