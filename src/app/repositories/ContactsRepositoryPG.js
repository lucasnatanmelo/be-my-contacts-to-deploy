// Instalar uuidV4 para criação de hashs
// yarn add uuidv4

require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

class ContactsRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const contacts = await pool.query(`
        SELECT contacts.*, categories.name AS category_name
        FROM contacts
        LEFT JOIN categories ON categories.id = contacts.category_id
        ORDER BY contacts.name ${direction}
        `);

    const { rows } = contacts;

    return rows; // Em Join categories ON id = category_id -> serão unidas as duas tabelas
  }

  async findById(id) {
    const row = await pool.query(`
        SELECT contacts.*, categories.name AS category_name
        FROM contacts
        LEFT JOIN categories ON categories.id = contacts.category_id
        WHERE contacts.id = $1
        `, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await pool.query('SELECT * FROM contacts WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, phone, category_id,
  }) {
    const [row] = await pool.query(
      `
            INSERT INTO contacts(name, email, phone,category_id)
            VALUES($1, $2, $3, $4)
            RETURNING *
            `,
      [name, email, phone, category_id],
    );

    return row;
  }

  async update(id, {
    name, email, phone, category_id,
  }) {
    const [row] = await pool.query(`
            UPDATE contacts
            SET name = $1, email = $2, phone = $3, category_id = $4
            WHERE id = $5
            RETURNING *
        `, [name, email, phone, category_id, id]);
    return row;
  }

  async delete(id) {
    const deleteOp = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ContactsRepository();
