require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes.js')
const MatchRoutes = require('./routes/MatchRoutes.js')
const searchRoutes = require('./routes/searchRoutes.js')
const refreshRoute = require('./routes/refreshRoutes.js')

const { Connect } = require('./database/db');
const PORT = process.env.PORT

Connect();
const app = express();

app.use(cookieParser());
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: false })); // url encoded

app.get('/', (req, res) => {
  res.send('APP IS WORKING!!');
});

app.use('/user',userRoutes);
app.use('/tournament',MatchRoutes);
app.use('/search', searchRoutes);
app.use("/refresh-token", refreshRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Test on http://localhost:${PORT}/`); }
);