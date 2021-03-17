const db = require('../../config/db');

module.exports = {
  all() {
    const selectCategories = `
      SELECT * FROM categories
    `

    return db.query(selectCategories)
  }
}