const express = require('express');
const app = express();
const User = require('./models/user');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');


mongoose.connect('mongodb://127.0.0.1:27017/loginDemo')
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    })


app.set('view engine', 'ejs')//setting up ejs engine
app.set('views', 'views');



app.use(express.urlencoded({ extended: true }));//for getting body and param from url


app.get('/', (req, res) => {
    res.send("This is the home page")
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    // res.send(req.body);
    const { password, username } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedpassword });
    await user.save();
    res.redirect('/');
})

app.get('/secret', (req, res) => {
    res.send('This is secret!');
})

app.get('/login', (req, res) => {
    res.render("login");
})
app.post('/login', async (req, res) => {
    // res.send(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
        res.send("Yay welcome   !!!");
    }
    else {
        res.send("Try again");
    }
})


app.listen(3000, () => {
    console.log("Listening on port 3000");
})