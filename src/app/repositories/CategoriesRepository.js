require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

class CategoryRepository {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
    return rows;
  }

  async findById(id) {
    const [row] = await pool.query(`
          SELECT *
          FROM categories
          WHERE categories.id = $1
      `, [id]);

    return row;
  }

  async create({ name }) {
    const { rows } = await pool.query(`
            INSERT INTO CATEGORIES(name)
            VALUES($1)
            RETURNING *
        `, [name]);

    const row = rows[0];
    return row;
  }

  async delete(id) {
    const deleteOp = await pool.query(`
    DELETE FROM categories
    WHERE id = $1
    RETURNING *
    `, [id]);
    return deleteOp;
  }
}

module.exports = new CategoryRepository();
