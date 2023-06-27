const fs = require('fs');
const express = require('express');
const app = express();

// app.get('/' , (req,res)=>{
//     res.status(200).send("Hello from server");
// })

// Reading File in Synchronous way and not in callback as it may block the event loop
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours' , (req,res)=>{
    res.status(200).json({
        'status' : 'success',
        'result' : tours.length,
        data:{
            tours
        }
})
});



const port = 3000;
app.listen(port, (req,res)=>{
    console.log(`Listining on port ${port}`);
});