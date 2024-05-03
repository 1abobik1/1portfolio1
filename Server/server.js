const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 9000;

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Feedback',
  password: 'Zopa_kek12',
  port: 5432, 
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Обработчик POST-запроса для сохранения данных в базе данных
app.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    const client = await pool.connect();
    const query = `
      INSERT INTO Feedback (firstName, lastName, email, phoneNumber, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [firstName, lastName, email, phoneNumber, message];
    const result = await client.query(query, values);
    client.release();
    console.log('Data inserted:', result.rows[0]);
    res.status(201).json({ message: 'Data inserted successfully!' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});

// Запуск сервера на указанном порту
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
