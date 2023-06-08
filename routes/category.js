const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");

router.get("/", (req, res, next) => {
  res.redirect("/categories");
});
/* ALL CREATE REQUESTS */
router.get("/create", category_controller.category_create_get);
router.post("/create", category_controller.category_create_post);

/* ALL DELETE REQUESTS */
router.get("/:id/delete", category_controller.category_delete_get);
router.post("/:id/delete", category_controller.category_delete_post);

/* ALL UPDATE REQUESTS */
router.get("/:id/update", category_controller.category_update_get);
router.post("/:id/update", category_controller.category_update_post);

/* GET Request for specific Item */
router.get("/:id", category_controller.category_detail);

module.exports = router;
