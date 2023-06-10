const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')

//routes
const tripRoutes = require('./routes/tripRoute')
const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const mapRoutes = require('./routes/mapRoute')

const app = express();

//cors
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.use('/trips', tripRoutes);
app.use('/map', mapRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes)

const port = process.env.PORT || 8082

const startServer = async () => {
    try {
        connectDB();
        app.listen(port, () => console.log(`Server running on port http://localhost:${port}`));
        app.get('/', (erq, res) => res.send("hello backend!"));
    } catch (error) {
        console.log(error)
    }
}

startServer();
