const fs = require('fs');
const express = require('express');
const app = express();

//! Middleware needed to access the body
app.use(express.json());

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


// POST
app.post('/api/v1/tours' , (req,res)=>{

    const newId = tours[tours.length-1].id +1;
    const newTour = Object.assign({id:newId} , req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
            res.status(201).json({
                status:'success',
                data :{
                    newTour
                }
            })
    } )

})

const port = 3000;
app.listen(port, (req,res)=>{
    console.log(`Listining on port ${port}`);
});