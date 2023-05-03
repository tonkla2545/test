const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { TOKEN_KEY } = process.env

class Users {

    static index(req, res, next) {
        User.find().then(user => {
            res.json(user)
        }).catch(err => {
            next(err)
        })
    }

    static register(req, res, next) {
        const { username, password } = req.body;

        // if (!(username && password)) {
        //     return res.status(400).send("All input is required");
        // }

        User.findOne({ username }).then((oldUser) => {
            if (oldUser) {
                const validationError = ["User already exists. Please login."]
                req.flash('validationError', validationError);
                res.redirect("/login");
                return res.status(409).send("User already exists. Please login.");
            }
            return bcrypt.hash(password, 10);
        }).then((hash) => {
            return User.create({ username, password: hash });
        }).then((user) => {
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                { expiresIn: "2h" }
            );
            user.token = token;
            res.status(201).json(user);
        }).catch((err) => {
            let validationError;
            if (err) {
                validationError = ["Please procide username and password"];
                req.flash('validationError', validationError);
                res.redirect("/register");
            } 
            console.log(err)
        });
        
    }


    static login(req, res, next) {
        const { username, password } = req.body;

        User.findOne({ username: username }).then((user) => {
            if (user) {
                bcrypt.compare(password, user.password).then((match) => {
                    if (match) {
                        const token = jwt.sign(
                            { user_id: user._id, username },
                            process.env.TOKEN_KEY,
                            { expiresIn: "2h" }
                        );
                        user.token = token;
                        res.status(200).json(user);
                        console.log("Login successful");
                    } else {
                        res.status(400).send("Invalid credentials");
                    }
                });
            } else {
                res.status(400).send("Invalid credentials");
            }
        })
            .catch((err) => {
                next(err);
            });
    }


    static changePassword(req, res, next) {
        const { username, password, Cpassword } = req.body

        User.findOne({ username: username }, { new: true, password: 1 }).then((user) => {
            if (!user) {
                res.status(400).send('User not found')
            }
            bcrypt.compare(password, user.password).then((match) => {
                if (!match) {
                    if (password === Cpassword) {
                        bcrypt.hash(password, 10, (err, hashedPassword) => {
                            if (err) {
                                next(err)
                                res.status(500).send('Internal server error');
                            }

                            User.findOneAndUpdate({ username: username }, { password: hashedPassword }, { new: true }).then((updateUser) => {
                                if (!updateUser) {
                                    res.status(404).send('User not found');
                                }
                                // res.status(200).send('Change password successfully')
                                res.status(200).json(updateUser);
                            }).catch((err => {
                                next(err)
                            }))
                        })
                    } else {
                        res.status(400).send('รหัสผ่านไม่ตรงกัน')
                    }
                } else {
                    res.status(400).send('รหัสผ่านนี้เป็นรหัสผ่านเดิม')
                }
            }).catch(err => {
                next(err)
            })

        }).catch(err => {
            next(err)
        })
    }

    static deleteUser(req, res, next) {
        User.findByIdAndDelete(req.params.id).then(post => {
            res.json(post)
        }).catch(err => {
            next(err)
        })
    }

    static editProfile(req,res,next){
        const address = req.body.address
        User.findByIdAndUpdate(req.params.id,{address : address}).then((post) =>{
            res.json(post)
        }).catch(err => {
            next(err)
        })
    }

    static welcome(req,res,next){
        res.status(200).send('Welcome')
    }
}



module.exports = Users
