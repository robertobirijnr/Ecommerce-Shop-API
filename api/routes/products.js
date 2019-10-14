const express = require('express');
const router = express.Router();
const multer = require('multer');
const check_auth = require('../middleware/check-auth');
const productController = require('../controller/productController')

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

router.get('/',productController.products_get_all);

router.post("/",upload.single('productImage'),check_auth,productController.products_create_product);

 router.get('/:productId',productController.products_get_product);

 router.patch('/:productId',productController.products_update_product);

 router.delete('/:productId',productController.products_delete_product);

 module.exports = router