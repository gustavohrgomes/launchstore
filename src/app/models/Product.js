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
  find(id) {
    const selectProduct = `
      SELECT * FROM products
      WHERE id = $1
    `;

    return db.query(selectProduct, [id]);
  },
  update(data) {
    const query = `
      UPDATE products SET
        category_id=($1),
        user_id=($2),
        name=($3),
        description=($4),
        old_price=($5),
        price=($6),
        quantity=($7),
        status=($8)
      WHERE id = $9
    `;

    const values = [
      data.category_id,
      data.user_id || 1,
      data.name,
      data.description,
      data.old_price,
      data.price,
      data.quantity,
      data.status,
      data.id,
    ];

    return db.query(query, values);
  },
  delete(id) {
    const deleteQuery = `
      DELETE FROM products
      WHERE id = $1
    `;

    return db.query(deleteQuery, [id]);
  },
};
