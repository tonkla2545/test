const OrderModel = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');


class OrderController {

    static showOrder(req, res, next) {
        let id = new ObjectId(req.params.id);
        OrderModel.findById(id)
            .then((order) => {
                return OrderModel.aggregate([
                    {
                        // match ID ที่รับมากับ DB
                        $match: { _id: id }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'U_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        // กำหนดข้อมูลที่จะแสดง
                        $project: {
                            _id: 1,
                            U_id: 1,
                            Pname: 1,
                            Pprice: 1,
                            'user.username': 1,
                        }
                    }
                ]);
            })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send({ error: 'Error retrieving order' });
            });
    }
    

    // static showOrder(req, res, next) {
    //     MongoClient.connect(uri, { useUnifiedTopology: true }).then((client) => {
    //         const db = client.db('test');
    //         const collection = db.collection('orders');

    //         return collection.aggregate([
    //             {
    //                 $lookup: {
    //                     from: 'users',
    //                     localField: 'U_id',
    //                     foreignField: '_id',
    //                     as: 'ข้อมูล'
    //                 }
    //             }
    //         ]).toArray();
    //     })
    //     .then((result) => {
    //         res.status(200).send(result);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //         res.status(500).send({ error: 'Error retrieving order' });
    //     });
    // }


    // ---------------------------------------------------------------------------------------------------


    static order(req, res, next) {
        const { U_id, P_id } = req.body;

        Product.findById(P_id).then((product) => {
            if (!product) {
                return res.status(400).json({ error: 'Product not found' });
            }

            OrderModel.create({ Pname: product.name, Pprice: product.price, U_id: U_id }).then((order) => {
                res.status(200).json(order);
            }).catch((error) => {
                console.error('Error inserting item:', error);
                res.status(500).json({ error: 'Error inserting item' });
            });
        }).catch((error) => {
            console.error('Error finding product:', error);
            res.status(500).json({ error: 'Error finding product' });
        });
    }
}

module.exports = OrderController
