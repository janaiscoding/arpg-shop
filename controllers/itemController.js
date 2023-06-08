const Item = require("../models/item");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
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
    title: "All Items",
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

/*Display the form for creating a new item */
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("item_form", { title: "Create Item", categories: allCategories });
});

/*Handle category create on post*/
exports.item_create_post = [
  // Validate and sanitize the name field.
  body("name", "Item name must contain between 5 and 50 characters")
    .trim()
    .isLength({ min: 5, max: 50 })
    .escape(),
  body(
    "description",
    "Item description must contain between 5 and 200 characters"
  )
    .trim()
    .isLength({ min: 5, max: 200 })
    .escape(),
  body("category", "Item category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Item price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Item stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("item_form", {
        title: "Create Item",
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const itemExists = await Item.findOne({
        name: req.body.name,
      }).exec();
      if (itemExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(item.url);
      }
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();
  if (item === null) {
    res.redirect("/items");
  }
  res.render("item_delete", {
    title: "Delete the",
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (item === null) {
    res.redirect("/items");
  } else {
    await Item.findByIdAndRemove(req.body.id);
    res.redirect("/items");
  }
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().exec(),
  ]);
  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Update item",
    item: item,
    categories: allCategories,
  });
});

exports.item_update_post = [
  // Validate and sanitize the name field.
  body("name", "Item name must contain between 5 and 50 characters")
    .trim()
    .isLength({ min: 5, max: 50 })
    .escape(),
  body(
    "description",
    "Item description must contain between 5 and 200 characters"
  )
    .trim()
    .isLength({ min: 5, max: 200 })
    .escape(),
  body("category", "Item category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Item price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Item stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("item_form", {
        title: "Update Item",
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect(item.url);
    }
  }),
];
