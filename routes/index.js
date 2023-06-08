const express = require("express");
const router = express.Router();
/* MY CONTROLLERS */
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/", item_controller.index);


// ALL READ REQUESTS
/* GET Request for ALL Categories */
router.get("/categories", category_controller.category_list);
router.get("/items", item_controller.item_list);

module.exports = router;
