const db = require("../../config/db");

module.exports = {
  create(product) {
    const insertIntoProducts = `
      INSERT INTO products (
        category_id,
        user_id,
        name,
        description,
        old_price,
        price,
        quantity,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    product.price = product.price.replace(/\D/g, "");

    const values = [
      product.category_id,
      product.user_id || 1,
      product.name,
      product.description,
      product.old_price || product.price,
      product.price,
      product.quantity,
      product.status || 1,
    ];

    return db.query(insertIntoProducts, values);
  },
};
