import express from 'express';

const app = express();
app.use(express.json()); //used to parse JSON bodies

// routes


app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081');
}) 