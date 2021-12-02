const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validate = require("./validation/validate")
const User = require("../models/User")
const Role = require("../models/Role")
const issueJWT = require("../public/js/issueJWT")
const passport = require("passport")
const cookieParser = require("cookie-parser")


const validateForm = form_type => {
    return (req, res, next) => {
        if(form_type == 'register') {
            const {error} = validate.registerValidation(req.body)
            if (error) {
                return res.json({
                    status: 'error',
                    error: error.details[0].message
                })
            }
            next()         
        }else if(form_type == 'login') {
            const {error} = validate.loginValidation(req.body)
            if(error) {
                return res.json({
                    status: 'error',
                    error: error.details[0].message
                })
            }
            next()
        }else {
            next()
        }
    }
}

const checkUnique = async (req, res, next) => {
    try{
        const emailExists = await User.findOne({email: req.body.reg_email})
        if(emailExists) {
            res.json({
                status: 'error',
                error: 'User with that email already exists',
                user: req.body
            })
                      
        }
        next()
    }catch(err) {
        res.json({
            status: 'error',
            error: 'There was a fatal error, try again later',
            user: req.body
        })
    }
}

const authUser = (req, res, next) => {

    if (req.cookies.token) {
        const token = req.cookies.token
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.redirect("/")
            }

            req.user = user;
            next();
        });
    } else {
        res.redirect("/")
    }

}

router.post("/users/register", validateForm('register'), checkUnique , async (req, res, next) => {
    
    //Already validated and unique user
    try {

        const role = await Role.findOne({name: "User"})
        const salt = await bcrypt.genSalt(10)
        const hashedPWD = await bcrypt.hash(req.body.reg_password, salt)

        const newUser = new User({
            name: req.body.reg_name,
            surname: req.body.reg_surname,
            email: req.body.reg_email,
            role: role._id,
            password: hashedPWD
        })

        newUser.save().then(async (user) => {
            const jwt = await issueJWT.issueJWT(user)
            
            return res.json({
                status: 'success',
                data: {
                    token: jwt.token,
                    expiresIn: jwt.expires
                }
            })
        })
    }catch(err) {
        res.json({
            status: 'error',
            error: `Fatal error: ${err}`,
            user: req.body
        })
    } 
})

router.get("/profile", authUser, (req, res) => {
    res.send("testing")
})

router.post("/users/login", validateForm('login'), async (req, res, next) => {
    try {
        User.findOne({email: req.body.log_email}).then(async (user) => {
            if(!user) {
                return res.status(401).json({
                    status: 'error',
                    error: 'Email or password is invalid'
                })
            }
    
            const validPassword = await bcrypt.compare(req.body.log_password, user.password)
    
            if(validPassword) {
                issueJWT.issueJWT(user).then((data => {
                    res.json({
                        status: 'success',
                        data: {
                            token: data.token,
                            expiresIn: data.expires
                        }
                    })
                }))
                
            }else {
                res.json({
                    status: 'error',
                    error: 'Email or password is invalid'
                })
            }
        })
    
    }catch(error) {
        return res.json({
            status: 'error',
            error: `| Fatal | : ${error}`
        })
    }
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