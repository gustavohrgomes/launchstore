const db = require("../../config/db");
const { hash } = require("bcryptjs");

module.exports = {
  async findOne(filters) {
    let query = `SELECT * FROM users`;

    try {
      Object.keys(filters).map(key => {
        // WHERE | OR | AND
        query = `${query}
          ${key}
        `;

        Object.keys(filters[key]).map(field => {
          query = `${query} ${field} = '${filters[key][field]}'`;
        });
      });

      const results = await db.query(query);

      return results.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  async create(data) {
    try {
      const createUser = `
        INSERT INTO users (
          name,
          email,
          password,
          cpf_cnpj,
          cep,
          address
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;

      const encryptedPassword = await hash(data.password, 8);

      const values = [data.name, data.email, encryptedPassword, data.cpf_cnpj.replace(/\D/g, ""), data.cep.replace(/\D/g, ""), data.address];

      const results = await db.query(createUser, values);
      return results.rows[0].id;
    } catch (error) {
      throw new Error(error);
    }
  },
};
