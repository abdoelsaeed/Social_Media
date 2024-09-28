const mongoose = require('mongoose');
const db = process.env.DB ||
  "mongodb+srv://abdoelsaeed2:12345@cluster000.h7jdjme.mongodb.net/SocialMedia?retryWrites=true&w=majority&appName=Cluster000";
mongoose
  .connect(db)
  .then(() => {
    console.error("DB Connection Successful!");
  })
  .catch((err) => console.error("DB connection error:", err));
module.exports = db;