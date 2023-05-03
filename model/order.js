const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    Pname: { type: String },
    Pprice: { type: Number },
    U_id: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model('Order', orderSchema);
