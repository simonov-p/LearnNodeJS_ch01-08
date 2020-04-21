const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const csrf = require('csurf');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const orderRouters = require('./routes/orders');
const authRouters = require('./routes/auth');
const MONGODB_URI = require('./keys');
const varMiddleware = require('./middleware/variables');
const userMiddleeare = require('./middleware/user');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
})); // можем обращаться к Request session
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleeare);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/courses', coursesRoutes);
app.use('/orders', orderRouters);
app.use('/auth', authRouters);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'user@mail.ru',
        //         name: 'UserName',
        //         cart: {items: []}
        //     });
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();


