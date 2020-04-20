const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const orderRouters = require('./routes/orders');
const authRouters = require('./routes/auth');
const User = require('./models/user');
const mongo_url = require('./keys');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5e998ace63102f10582396ca');
        req.user = user;
        next()
    } catch (e) {
        console.log(e);
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
})); // можем обращаться к Request session

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRouters);
app.use('/auth', authRouters);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'user@mail.ru',
                name: 'UserName',
                cart: {items: []}
            });
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();

