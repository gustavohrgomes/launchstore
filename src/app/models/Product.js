const db = require("../../config/db");

const Base = require("./Base");

Base.init({ table: "products" });

module.exports = {
  ...Base,
  files(id) {
    const sql = `
      SELECT * FROM files WHERE product_id = $1
    `;

    return db.query(sql, [id]);
  },
  search(params) {
    const { filter, category } = params;

    let query = "";
    filterQuery = `WHERE`;

    if (category) {
      filterQuery = `
        ${filterQuery}
        products.category_id = ${category}
        AND 
      `;
    }

    filterQuery = `
      ${filterQuery}
      products.name ILIKE '%${filter}%'
      OR products.description ILIKE '%${filter}%'
    `;

    query = `
      SELECT products.*, categories.name as category_name
      FROM products
      LEFT JOIN categories ON (categories.id = products.category_id)
      ${filterQuery}
      GROUP BY products.id, categories.name
    `;

    return db.query(query);
  },
};

// create(product) {
//   const insertIntoProducts = `
//     INSERT INTO products (
//       category_id,
//       user_id,
//       name,
//       description,
//       old_price,
//       price,
//       quantity,
//       status
//     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING id
//   `;

//   product.price = product.price.replace(/\D/g, "");

//   const values = [
//     product.category_id,
//     product.user_id,
//     product.name,
//     product.description,
//     product.old_price || product.price,
//     product.price,
//     product.quantity,
//     product.status || 1,
//   ];

//   return db.query(insertIntoProducts, values);
// },
