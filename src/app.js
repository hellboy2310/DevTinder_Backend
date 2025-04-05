const express = require('express');

const app = express();

// app.use('/test', (req, res) => {
//     res.send('hello from test server');
// })

// app.use('/hello', (req, res) => {
//     res.send('hello from a normal user');
// })

app.get('/user', (req, res) => {
    res.send({
        firstName: 'bhavesh',
        lastName: 'purohit'
    })
})

app.post('/user', (req, res) => {
    res.send({
        message: `data saved successfully`
    })
})

app.listen(3000, () => {
    console.log('server is runnnign at this port');
})