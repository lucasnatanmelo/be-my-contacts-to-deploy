const express = require('express');
require('express-async-errors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const routes = require('./routes');
const cors = require('./app/middlewares/cors');
const error = require('./app/middlewares/error');

const app = express();

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(error);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// O cors define os headers de resposta para todas as rotas - Aula Cross-Origin Resource Sharing
