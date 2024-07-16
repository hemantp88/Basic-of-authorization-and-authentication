const express = require('express');
const app = express();
const User = require('./models/user');

app.set('view engine', 'ejs')//setting up ejs engine
app.set('views', 'views');


app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/secret', (req, res) => {
    res.send('This is secret!');
})


app.listen(3000, () => {
    console.log("Listening on port 3000");
})