const express= require('express');
const dotenv= require('dotenv');
const mySqlPool = require('./config/db');

dotenv.config();

const app= express();
app.use(express.json());
app.use('/api/v1/benefits',require('./routes/routesbenefits'));
app.use('/api/v1/auth', require('./routes/userRoutes'));

app.use('/api/v1/user-requests', require('./routes/requestRoutes'));

app.use(express.static('../Frontend'));


const PORT = process.env.PORT || 8000;

mySqlPool.query('SELECT 1').then(() => {
    console.log('Connected to the MySQL server');

    app.listen(PORT,()=>{ 
        console.log(`Server is running on port http://localhost:${process.env.PORT}`)
    });

}).catch((err) => {
    console.error('Error connecting to the MySQL server', err); 
});




