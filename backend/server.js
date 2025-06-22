const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const PORT = process.env.PORT || 6100;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
