const { formatPrice } = require("../../lib/utils");

const Product = require("../models/Product");

module.exports = {
  async index(req, res) {
    try {
      let results,
        params = {};

      const { filter, category } = req.query;

      if (!filter) {
        return res.redirect("/");
      }

      params.filter = filter;

      if (category) {
        params.category = category;
      }

      results = await Product.search(params);

      async function getImage(productId) {
        let results = await Product.files(productId);
        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);

        return files[0];
      }

      const productPromise = results.rows.map(async product => {
        product.img = await getImage(product.id);
        product.price = formatPrice(product.price);
        product.oldPrice = formatPrice(product.old_price);
        return product;
      });

      const products = await Promise.all(productPromise);

      const search = {
        term: req.query.filter,
        total: products.length,
      };

      const categories = products
        .map(product => ({
          id: product.category_id,
          name: product.category_name,
        }))
        .reduce((categoriesFiltered, category) => {
          const found = categoriesFiltered.some(cat => cat.id == category.id);

          if (!found) {
            categoriesFiltered.push(category);
          }

          return categoriesFiltered;
        }, []);

      return res.render("search/index", { products, search, categories });
    } catch (error) {
      throw new Error(error);
    }
  },
};
