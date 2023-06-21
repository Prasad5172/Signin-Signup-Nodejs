const jwt = require("jsonwebtoken")
const Register = require("../models/login")

const auth = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY)
        // console.log("token")
        console.log(verifyToken)
        const user = await Register.findOne({_id : verifyToken._id})
        // console.log("user")
        // console.log(user)
        req.user = user
        req.token = token
        next();
    } catch (error) {
        res.status(401).send("You are not autheriozed or signin first")
    }
    
}


module.exports = auth;