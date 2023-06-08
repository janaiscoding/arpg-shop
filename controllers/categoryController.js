const Item = require("../models/item");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

/*Display all categories*/
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "All Categories",
    list_categories: allCategories,
  });
});

/*Display specific category detail*/
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description").exec(),
  ]);
  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Specifics",
    category: category,
    category_items: allItemsInCategory,
  });
});

/*Display the form for creating a new category */
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

/*Handle category create on post*/
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must contain between 5 and 50 characters")
    .trim()
    .isLength({ min: 3, max: 50 })
    .escape(),
  body(
    "description",
    "Category description must contain between 5 and 200 characters"
  )
    .trim()
    .isLength({ min: 5, max: 200 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Create a category object with escaped and trimmed data.
    console.log("name:", req.body.name, "description:", req.body.description);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(category.url);
      }
    }
  }),
];
