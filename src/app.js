const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');


app.use("/admin", adminAuth);

app.use("/user", userAuth, (req, res) => {
    res.send({
        message: 'welcome user'
    })
})

app.get('/admin/details', (req, res) => {
    res.send('details fetched succesfully');
})

app.get('/admin/deleteUser', (req, res) => {
    res.send("User deleted Successfully");
})


app.listen(3000, () => {
    console.log('server is runnnign at this port');
})