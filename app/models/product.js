const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
}, { versionKey: false })

const Product = mongoose.model("Product", productSchema);


const productUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, { versionKey: false })

const UserProduct = mongoose.model("UserProduct", productUserSchema);



module.exports = {
    Product,
    UserProduct
}