const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

// Swagger/OpenAPI
const swaggerDocument = YAML.load(__dirname + '/docs/openapi.yaml');
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Montar rutas versionadas
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/players', require('./routes/players'));
app.use('/api/v1', require('./routes/images'));
app.use('/api/v1', require('./routes/profiles'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));