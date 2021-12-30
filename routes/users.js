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
        const avatarType = "image/png"
        const avatarData = process.env.AVATAR_BASE

        const newUser = new User({
            name: req.body.reg_name,
            surname: req.body.reg_surname,
            email: req.body.reg_email,
            role: role._id,
            password: hashedPWD,
            avatarType: avatarType,
            avatar: new Buffer.from(avatarData, "base64")
        })

        newUser.save().then(async (user) => {
            const jwt = await issueJWT.issueJWT(user)
            
            return res.json({
                status: 'success',
                data: {
                    token: jwt.token,
                    expiresIn: jwt.expires,
                    user_data: {
                        username: user.name,
                        usersurname: user.surname,
                        email: user.email,
                        _id: user._id
                    }
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
                            expiresIn: data.expires,
                            user_data: {
                                username: user.name,
                                usersurname: user.surname,
                                email: user.email,
                                avatar: user.avatarPath,
                                _id: user._id
                            }
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

module.exports = router