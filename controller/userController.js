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
            let validationError
            if (oldUser) {
                validationError = ["User already exists. Please login."]
                req.flash('validationError', validationError);
                return res.redirect('/register');
                // return res.status(409).send("User already exists. Please login.");
            }else {
                return bcrypt.hash(password, 10);
            }
        }).then((hash) => {``
            return User.create({ username, password: hash });
        }).then((user) => {
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                { expiresIn: "2h" }
            );
            user.token = token;
            // res.status(201).json(user);
            res.redirect('/login');
        }).catch((err) => {
            let validationError = ["Please procide username and password"];
            req.flash('validationError', validationError);
            res.redirect('/register');
            console.log(err)
        });
        
    }


    // static login(req, res, next) {
    //     const { username, password } = req.body;

    //     User.findOne({ username: username }).then((user) => {
    //         let validationError
    //         if (user) {
    //             bcrypt.compare(password, user.password).then((match) => {
    //                 if (match) {
    //                     const token = jwt.sign(
    //                         { user_id: user._id, username },
    //                         process.env.TOKEN_KEY,
    //                         { expiresIn: "2h" }
    //                     );
    //                     user.token = token;
    //                     req.session.regenerate((err) => {
    //                         if (err) {
    //                           // Handle the error
    //                           console.error('Failed to regenerate session:', err);
    //                           return res.redirect('/login');
    //                         }
    //                         req.session.userId = user._id;
    //                         req.session.token = user.token;
    //                         console.log("Login successful");
    //                         res.redirect('/home');
    //                     });
    //                     // res.status(200).json(user);
    //                 } else {
    //                     validationError = ["Password is incorrect."]
    //                     req.flash('validationError', validationError);
    //                     res.redirect('/login')
    //                     // res.status(400).send("Invalid credentials");
    //                 }
    //             });
    //         } else {
    //             validationError = ["Not found Username."]
    //             req.flash('validationError', validationError);
    //             res.redirect('/login')
    //             // res.status(400).send("Invalid credentials");
    //         }
    //     }).catch((err) => {
    //         validationError = ["Not found Username."]
    //         req.flash('validationError', validationError);
    //         res.redirect('/login')
    //     });
    // }

    static login(req, res, next) {
        const { username, password } = req.body;

        User.findOne({ username: username }).then((user) => {
            let validationError
            if (user) {
                bcrypt.compare(password, user.password).then((match) => {
                    if (match) {
                        const token = jwt.sign(
                            { user_id: user._id, username },
                            process.env.TOKEN_KEY,
                            { expiresIn: "2h" }
                        );
                        user.token = token;
                        req.session.regenerate((err) => {
                            if (err) {
                                console.error('Failed to regenerate session:', err);
                                return res.redirect('/login');
                            }
                            req.session.userId = user._id;
                            req.session.token = token; // Store the token in the session
                            console.log("Login successful");
                            res.redirect('/home');
                        });
                        
                        // res.status(200).json(user);
                    } else {
                        validationError = ["Password is incorrect."]
                        req.flash('validationError', validationError);
                        res.redirect('/login')
                        // res.status(400).send("Invalid credentials");
                    }
                });
            } else {
                validationError = ["Not found Username."]
                req.flash('validationError', validationError);
                res.redirect('/login')
                // res.status(400).send("Invalid credentials");
            }
        }).catch((err) => {
            validationError = ["Not found Username."]
            req.flash('validationError', validationError);
            res.redirect('/login')
        });
    }

    static logout(req,res,next){
        req.session.destroy(() => {
            res.redirect('/')
        })
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
