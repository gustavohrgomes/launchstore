const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  create({ filename, path, product_id }) {
    const sql = `
      INSERT INTO files (
        name,
        path,
        product_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [filename, path, product_id];

    return db.query(sql, values);
  },
  async delete(id) {
    const sql = `
      DELETE FROM files
      WHERE id = $1
    `;

    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = result.rows[0];

      fs.unlinkSync(file.path);

      // Alternative in case the fs.unlinkSync() doesn't work
      // fs.unlink(file.path, err => {
      //   if (err) throw err.message;

      //   return db.query(sql, [id]);
      // });

      return db.query(sql, [id]);
    } catch (err) {
      console.error(err);
    }
  },
};
