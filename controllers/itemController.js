const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

/* Display all count of items and categories */
exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "ARPG Shop Home",
    item_count: numItems,
    category_count: numCategories,
  });
});

/*Display all items*/
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();
  res.render("item_list", {
    title: "Item List",
    list_items: allItems,
  });
});

/*Display specific item detail*/
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  if (item === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item Details",
    item: item,
  });
});
