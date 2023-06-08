const express = require("express");
const router = express.Router();
/* MY CONTROLLERS */
const item_controller = require("../controllers/itemController");
const category_controller = require('../controllers/categoryController')

/* GET home page. */
router.get("/", item_controller.index);

/* GET Request for ALL Categories */
router.get('/categories', category_controller.category_list)
/* GET Request for ALL Items */
router.get('/items', item_controller.item_list)
/* GET Request for specific Category */
router.get('/category/:id', category_controller.category_detail)
/* GET Request for specific Item */
router.get('/item/:id', item_controller.item_detail)

module.exports = router;
