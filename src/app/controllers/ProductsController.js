const { formatPrice, date } = require("../../lib/utils");

const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  create(req, res) {
    // TODO: Get categories

    Category.all()
      .then(function (results) {
        const categories = results.rows;

        return res.render("products/create.njk", { categories });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "") return res.send("Please, fill in all fields");
    }

    if (req.files.length == 0) {
      return res.send("Please, send at least 1 image");
    }

    req.body.user_id = req.session.userId;

    let results = await Product.create(req.body);
    const productId = results.rows[0].id;

    const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }));
    await Promise.all(filesPromise);

    return res.redirect(`/products/${productId}`);
  },
  async show(req, res) {
    let results = await Product.find(req.params.id);
    const product = results.rows[0];

    if (!product) return res.send("product not found");

    const { day, month, hour, minutes } = date(product.updated_at);

    product.oldPrice = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    product.published = {
      day: `${day}/${month}`,
      hour: `${hour}h${minutes}`,
    };

    results = await Product.files(product.id);
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`,
    }));

    return res.render("products/show.njk", { product, files });
  },
  async edit(req, res) {
    let results = await Product.find(req.params.id);
    const product = results.rows[0];

    if (!product) return res.send("Product not found");

    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    results = await Category.all();
    const categories = results.rows;

    results = await Product.files(product.id);
    let files = results.rows;
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`,
    }));

    return res.render("products/edit.njk", { product, categories, files });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == "" && value != "removed_files") {
        return res.send("Please, fill in all fields");
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create({ ...file, product_id: req.body.id }));

      await Promise.all(newFilesPromise);
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map(id => File.delete(id));

      await Promise.all(removedFilesPromise);
    }

    req.body.price = req.body.price.replace(/\D/g, "");

    if (req.body.old_price !== req.body.price) {
      const oldProduct = await Product.find(req.body.id);

      req.body.old_price = oldProduct.rows[0].price;
    }

    await Product.update(req.body);

    return res.redirect(`/products/${req.body.id}`);
  },
  async delete(req, res) {
    const { id } = req.body;

    await Product.delete(id);

    return res.redirect("/products/create");
  },
};
