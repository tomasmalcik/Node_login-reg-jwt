const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validate = require("./validation/validate")
const User = require("../models/User")
const Role = require("../models/Role")
const issueJWT = require("../public/js/issueJWT")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const fs = require("fs")
const path = require("path")

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem')
const pub_key = fs.readFileSync(pathToKey, 'utf8')

require("../config/passport")(passport)

router.get("/register", (req, res) => {
    res.render("users/register.ejs", {user: new User()})
})

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

const validateForm = form_type => {
    return (req, res, next) => {
        if(form_type == 'register') {
            const {error} = validate.registerValidation(req.body)
            if (error) {
                return res.render("users/register", {
                    status: 'error',
                    error: error.details[0].message,
                    user: req.body
                })
            }
            next()         
        }
    }
}

const checkUnique = async (res, req, next) => {
    try{
        const emailExists = await User.findOne({email: req.email})

        if(emailExists) {
            res.render("users/register", {
                status: 'error',
                error: 'User with that email already exists',
                user: req.body
            })
                      
        }
        next()
    }catch(err) {
        res.render("users/register", {
            status: 'error',
            error: 'There was a fatal error, try again later',
            user: req.body
        })
    }
}

/*
router.post("/register", async (req, res) => {
    //Validate request
    const {error} = validate.registerValidation(req.body)
    if (error) {
        console.log("Mam tu error")
        res.render("users/register", {errorMessage: error})
    }
    //Check if email already exists
    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists)
        res.render("users/register", {errorMessage: "Email is already taken"})

    //Begin adding process
    try{
        const role = await Role.findOne({name: "User"})
        const salt = await bcrypt.genSalt(10)
        const hashedPWD = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            role: role._id,
            password: hashedPWD
        })

        await newUser.save()
        res.redirect("/")
    }catch(err) {
        res.send(`ERROR:  ${err}`)
    }

})
*/

const authUser = (req, res, next) => {

    if (req.cookies.token) {
        console.log("jsem tu")
        const token = req.cookies.token
        console.log("mám token: " + token)
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            console.log("Jsem i tady")
            if (err) {
                console.log(err)
                return res.redirect("/login")
            }

            req.user = user;
            next();
        });
    } else {
        res.redirect("/login")
    }

}

router.post("/register", validateForm('register'), checkUnique , async (req, res, next) => {
    //Already validated and unique user
    try {

        const role = await Role.findOne({name: "User"})
        const salt = await bcrypt.genSalt(10)
        const hashedPWD = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            role: role._id,
            password: hashedPWD
        })

        newUser.save().then(async (user) => {
            const jwt = await issueJWT.issueJWT(user)
            res.cookie("token", jwt.token, { maxAge: 30 * 60 * 1000, httpOnly: true, secure: true })
            console.log(jwt.token)
            res.redirect("/profile")
        })
    }catch(err) {
        res.render("users/register", {
            status: 'error',
            error: err,
            user: req.body
        })
    }
})

router.get("/profile", authUser, (req, res) => {
    res.send("testing")
})

router.post("/login", async (req, res, next) => {
    User.findOne({email: req.body.email}).then(async (user) => {
        if(!user) {
            res.status(401).json({success: false, msg: "Could not find user"})
        }

        console.log('User: ' + user)

        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if(validPassword) {
            const tokenObj = issueJWT.issueJWT(user)
            res.status(200).json({success: true, user: user, token: tokenObj.token, expiresIn: tokenObj.expires})
        }else {
            res.status(401).json({success: false, msg: "you entered wrong pwd bro"})
        }
    })
})
/*
router.post("/login", async (req, res) => {
    //Validate request body
    const {error} = await validate.loginValidation(req.body)
    if(error)
       return res.render("users/login", {errorMessage: error})

    //Check if user with that email exists
    const user = await User.findOne({email: req.body.email})
    if(!user)
        return res.render("users/login", {errorMessage: "Email or password is incorrect"})

    //Check if password is the same using bcrypt

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword)
        return res.render("users/login", {errorMessage: "Email or password is incorrect"})

    //Generate token
    const token = JWT.sign({
        _id: user._id,
        role: user.role,
        name: user.name
    }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).redirect("/")
})*/
module.exports = router