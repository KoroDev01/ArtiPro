const Category = require("../database/models/job_category.model");

exports.createCategory = (body) => {
  return Category.create(body);
};

exports.getAllCategories = () => {
  return Category.find().exec();
};

exports.getCategoryById = (id) => {
  return Category.findById(id).exec();
};

exports.updateCategory = (id, body) => {
  return Category.findByIdAndUpdate(id, body, { new: true }).exec();
};

exports.deleteCategory = (id) => {
  return Category.findByIdAndDelete(id).exec();
};
