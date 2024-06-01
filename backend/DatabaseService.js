const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 9001;

const pool = new Pool({
    user: 'postgres',
    host: 'database',
    password: 'Zopa_kek12',
    port: 5432,
    database: 'Feedback'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Функция проверки наличия столбцов в таблице
async function checkColumns() {
    try {
        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'FeedbackTable' 
      AND column_name IN ('id', 'firstName', 'lastName', 'email', 'phoneNumber', 'message')
    `);

        const existingColumns = res.rows.map(row => row.column_name);
        const missingColumns = ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'message'].filter(col => !existingColumns.includes(col));

        if (missingColumns.length > 0) {
            console.log(`Missing columns: ${missingColumns.join(', ')}`);
            await createColumns(missingColumns);
        } else {
            console.log('All columns exist');
        }
    } catch (error) {
        console.error('Error checking columns:', error);
    }
}

// Функция создания отсутствующих столбцов в таблице
async function createColumns(columns) {
    try {
        for (const column of columns) {
            const dataType = column === 'id' ? 'SERIAL PRIMARY KEY' : 'VARCHAR(255)';
            await pool.query(`
        ALTER TABLE "FeedbackTable" 
        ADD COLUMN "${column}" ${dataType}
      `);
            console.log(`Column "${column}" created`);
        }
    } catch (error) {
        console.error('Error creating columns:', error);
    }
}

// Проверяем наличие столбцов при запуске приложения
checkColumns();

// Обработчик POST-запроса для вставки данных в базу данных
app.post('/insert', async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, message } = req.body;
        const query = `
      INSERT INTO "FeedbackTable" ("firstName", "lastName", "email", "phoneNumber", "message")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [firstName, lastName, email, phoneNumber, message];
        const result = await pool.query(query, values);
        console.log('Data inserted:', result.rows[0]);
        res.status(201).json({ message: 'Data inserted successfully!' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'An error occurred while inserting data.' });
    }
});

// Запуск сервера на указанном порту
app.listen(port, () => {
    console.log(`Database Service is running on http://localhost:${port}`);
});
