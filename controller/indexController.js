const Product = require('../model/product')
const User = require('../model/user')
const Order = require('../model/order')

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb');


class IndexController {
    static index(req, res, next) {
        Product.find().then(product => {
            res.render('index', { product: product })
        }).catch(err => {
            console.log(err);
            res.status(500).send('Error fetching items');
        });

    }

    static pageRegister(req, res, next) {
        res.render('register', {
            errors: req.flash('validationError')
        })
    }

    static pageLogin(req, res, next) {
        res.render('login', {
            errors: req.flash('validationError')
        })
    }

    static pageHome(req, res, next) {
        // User.findById(req.session.userId)
        //     .then((UserData) => {
        //         Product.find()
        //             .then((products) => {
        //                 res.render('home', { product: products, UserData: UserData });
        //                 console.log(UserData)
        //             })
        //             .catch((err) => {
        //                 console.error('Error fetching items:', err);
        //                 res.status(500).send('Error fetching items');
        //             });
        //     })
        //     .catch((err) => {
        //         console.error('Error retrieving user data:', err);
        //         res.redirect('/login');
        //     });
        const token = req.session.token;

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = decoded.user_id;

                User.findById(userId)
                    .then((userData) => {
                        Product.find()
                            .then((products) => {
                                res.render('home', { product: products, UserData: userData });
                                console.log(userData);
                            })
                            .catch((err) => {
                                console.error('Error fetching items:', err);
                                res.status(500).send('Error fetching items');
                            });
                    })
                    .catch((err) => {
                        console.error('Error retrieving user data:', err);
                        res.redirect('/login');
                    });
            });
        } else {
            res.redirect('/login');
        }

    }

    static pageOrder(req,res,next){
        const token = req.session.token;

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id); //

                Order.find({U_id : userId}).then((order) => {
                    res.render('order' ,{ order: order, UserData: data })
                    console.log(order) 
                    // return Order.aggregate([    
                    //     {
                    //         // match ID ที่รับมากับ DB
                    //         $match: { _id: userId }
                    //     },
                    //     {
                    //         $lookup: {
                    //             from: 'users',
                    //             localField: 'U_id',
                    //             foreignField: '_id',
                    //             as: 'user'
                    //         }
                    //     },
                    //     {
                    //         // กำหนดข้อมูลที่จะแสดง
                    //         $project: {
                    //             _id: 1,
                    //             U_id: 1,
                    //             Pname: 1,
                    //             Pprice: 1,
                    //             'user.username': 1,
                    //         }
                    //     }
                    // ]);
                })
                // .then((result) => {
                //     res.render('order' ,{ order: result, UserData: data })
                //     console.log(userId)
                    
                //     // res.status(200).send(result);
                // })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send({ error: 'Error retrieving order' });
                });
            });
        } else {
            res.redirect('/login');
        }

    }
}

module.exports = IndexController