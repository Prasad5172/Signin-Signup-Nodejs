const mongoose = require ("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required : true,
        minlength : 3
    },
    lastname: {
        type: String,
        required : true,
    },
    email: {
        type: String,
        required : true,
        unique : [true,"Email is already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter A Valid Email")
            }
        }
    },
    phone:{
        type: Number,
        required: true,
        unique : true
    },
    age : {
        type : Number,
        required : true
    },
    gender : {
        type : String,
        required : true,
    },
    password : {
        type : String ,
        required : true,
    },
    confirmpassword : {
        type : String,
        required : true,
    },
    tokens : [{
        token : {
            type: String,
            required : true
        }
    }]

})

// middle ware
employeeSchema.pre("save",async function (next){
    if(this.isModified("password")){
        const passwordHash = await bcrypt.hash(this.password,10);
        this.confirmpassword= passwordHash;
        this.password= passwordHash;
    }
    next();
} )

employeeSchema.methods.generateAuthToken = async function() {
    try {
        const newToken = await jwt.sign({_id : this._id.toString()},process.env.SCRETE_KEY)
        
        this.tokens = this.tokens.concat({token: newToken})
        await this.save();
        return newToken;
    } catch (error) {
        console.log(error) 
    }
}







const Register = new mongoose.model("Register",employeeSchema)


module.exports = Register;