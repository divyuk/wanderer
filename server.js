const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Listining on port ${port}`);
});
