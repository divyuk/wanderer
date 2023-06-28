const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

const app = require('./app');

const port = process.env.PORT ||  3000;
app.listen(port, (req,res)=>{
    console.log(`Listining on port ${port}`);
});