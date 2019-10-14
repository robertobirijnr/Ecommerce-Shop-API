const express = require('express');
const app = express();
const mongoose= require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/Didwa',
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}  
)

//handling CORS
app.use((req,res,next)=>{
    res.header('Access-control-Allow-Origin','*');
    res.header('Access-control-Allow-Headers',
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
})

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');



app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/user',userRoutes);



//Error Handling 
app.use((req,res,next)=>{
   const error = new error('Not found');
   error.status =404;
   next(error);
});

app.use((error,req,res,next)=>{
    res.status(error||5000);
    res.json({
       error:{
           message:error.message
       } 
    })
})



const port = process.env.Port || 3000;
app.listen(port,()=>console.log(`App runing on port ${port}...`))
