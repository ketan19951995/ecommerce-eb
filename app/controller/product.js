const { Product } = require('../models/product');
const mongoose = require('mongoose');
const helper = require('../common/helper')
exports.createProduct = async (req, res) => {
    let { name, category, brand } = req.body;
    let newProduct = {
        name,
        category,
        brand
    }
    let productRecord = new Product(newProduct)
    try {
        let result = await productRecord.save();
        res.send(helper.respondWithResult(200, { message: "product added successfully", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
};

exports.deleteProduct = async (req, res) => {
    let { id: productId } = req.params;
    if (mongoose.Types.ObjectId.isValid(productId)) {
        try {
            let productRecord = await Product.findById(productId).exec();;
            if (productRecord) {
                let result = await Product.findOneAndRemove({ _id: productId });
                res.send(helper.respondWithResult(200, { message: "product deleted successfully", result }));
            } else {
                res.send(helper.respondWithResult(404, { message: "No product found", "result": "" }));
            }
        } catch (err) {
            res.send(helper.handleError(err));
        }
    } else {
        res.send(helper.respondWithResult(404, { message: "productID not valid", "result": "" }));
    }
}

exports.updateProduct = async (req, res) => {
    let { id: productId } = req.params;
    let { name } = req.body;
    try {
        let result = await Product.findOneAndUpdate({ _id: productId }, { name });
        res.send(helper.respondWithResult(200, { message: "product updated successfully", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        let result = await Product.find({});
        res.send(helper.respondWithResult(200, { message: "List of all products", result }));
    } catch (err) {
        res.send(helper.handleError(err));
    }
};

