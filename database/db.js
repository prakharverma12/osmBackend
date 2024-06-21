const PORT = process.env.PORT
const mongoose = require('mongoose');

async function Connect() {
    await mongoose.connect(process.env.DATABASE_URL);
    
  };
module.exports = {Connect}