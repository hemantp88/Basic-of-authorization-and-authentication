const express = require('express');
const app = express();
const User = require('./models/user');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

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

app.use(session({ secret: 'notagoodsecret' }))


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
    req.session.user_id = user._id;
    res.redirect('/');
})



app.get('/login', (req, res) => {
    res.render("login");
})
app.post('/login', async (req, res) => {
    // res.send(req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        // res.send("try again incorrect username");
        res.redirect('/login')
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
        req.session.user_id = user._id;
        // res.send("Yay welcome   !!!");
        res.redirect('/secret')

    }
    else {
        // res.send("Try again");
        res.redirect('/login');
    }
})
app.post('/logout', (req, res) => {
    // req.session.user_id == null;
    req.session.destroy()
    res.redirect('/login')
})

app.get('/secret', (req, res) => {
    if (!req.session.user_id) {
        return res.redirect("/login")
    }
    else
        res.render('secret')
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})