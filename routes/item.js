const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");

router.get("/", (req, res, next) => {
  res.redirect("/items");
});

router.get("/create", item_controller.item_create_get);
router.post("/create", item_controller.item_create_post);

router.get("/:id/delete", item_controller.item_delete_get);
router.post("/:id/delete", item_controller.item_delete_post);

router.get("/:id/update", item_controller.item_update_get);
router.post("/:id/update", item_controller.item_update_post);

/* GET Request for specific Item */
router.get("/:id", item_controller.item_detail);

module.exports = router;
