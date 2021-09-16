const express = require("express");
const router = express.Router()
const prodcutController = require('../controller/product');

router.post('/', prodcutController.createProduct);
router.get('/', prodcutController.getAllProducts);
router.put('/:id', prodcutController.updateProduct);
router.delete('/:id', prodcutController.deleteProduct);

module.exports = router