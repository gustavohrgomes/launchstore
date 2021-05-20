const db = require("../../config/db");

function find(filters, table) {
  let query = `SELECT * FROM ${table}`;

  try {
    if (filters) {
      Object.keys(filters).map(key => {
        // WHERE | OR | AND
        query += ` ${key}`;

        Object.keys(filters[key]).map(field => {
          query += ` ${field} = '${filters[key][field]}'`;
        });
      });
    }

    return db.query(query);
  } catch (error) {
    throw new Error(error);
  }
}

const Base = {
  init({ table }) {
    if (!table) throw new Error("Invalid params");

    this.table = table;

    return this;
  },
  async find(id) {
    const results = await find({ where: { id } }, this.table);
    return results.rows[0];
  },
  async findOne(filters) {
    const results = await find(filters, this.table);
    return results.rows[0];
  },
  async findAll() {
    const results = await find(filters, this.table);
    return results.rows;
  },
  async create(fields) {
    try {
      let keys = [];
      let values = [];

      Object.keys(fields).map(key => {
        keys.push(key);
        values.push(fields[key]);
      });

      keys.join(",");
      values.join(",");

      const query = `
        INSERT INTO ${this.table} (${keys}
        VALUES (${values})
        RETURNING id`;

      const results = await db.query(query);
      return results.rows[0].id;
    } catch (error) {
      console.error(error);
    }
  },
  update(id, fields) {
    try {
      let values = [];

      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`;
        values.push(line);
      });

      values.join(",");

      let query = `
        UPDATE ${this.table} 
        SET ${values}
        WHERE id = ${id}
      `;

      return db.query(query);
    } catch (error) {
      throw new Error(error);
    }
  },
  delete(id) {
    const deleteQuery = `
      DELETE FROM ${this.table}
      WHERE id = $1
    `;

    return db.query(deleteQuery, [id]);
  },
};

module.exports = Base;
