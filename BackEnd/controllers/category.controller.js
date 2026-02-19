const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../queries/category.queries");

exports.categoryCreate = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.categoryList = async (req, res) => {
  const categories = await getAllCategories();
  res.status(200).json(categories);
};

exports.categoryShow = async (req, res) => {
  const category = await getCategoryById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json(category);
};

exports.categoryUpdate = async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  res.status(200).json(category);
};

exports.categoryDelete = async (req, res) => {
  await deleteCategory(req.params.id);
  res.status(200).json({ message: "Category deleted" });
};
