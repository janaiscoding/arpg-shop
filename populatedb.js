#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database.'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added genre: ${name}`);
}

async function itemCreate(name, description, category, price, stock) {
  const itemdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock,
  };
  const item = new Item(itemdetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate("One-Handed Weapons", "Swords/Daggers/Wands/Sceptres and so on"),
    categoryCreate("Rings", "Very powerful item stat, you can wear up to 2 rings"),
    categoryCreate("Amulets", "Neck slot"),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(
      "Varunastra",
      "One handed sword that counts as all weapon types.",
      categories[0],
      22,
      3
    ),
    itemCreate(
      "Kalandra's Touch",
      "This ring will mirror your opposite equipped ring's stats.",
      categories[1],
      44,
      1
    ),
    itemCreate(
      "Voll's Devotion",
      "Cool amulet to wear for your amazing Discharge build.",
      categories[2],
      10,
      1
    ),
  ]);
}