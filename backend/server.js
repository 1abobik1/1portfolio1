const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 9000;

console.log("create db");

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
    const response = await axios.post('http://database_service:9001/insert', {
      firstName,
      lastName,
      email,
      phoneNumber,
      message
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});

// Запуск сервера на указанном порту
app.listen(port, () => {
  console.log(`HTTP Server is running on http://localhost:${port}`);
});
