const {Router} = require('express');
const User = require('../models/user');

const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Авторизация",
        isLogin: true
    })
});

router.post('/login', async (req, res) => {
    const user = await User.findById('5e998ace63102f10582396ca');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
        if (err) throw err;
        else res.redirect('/');
    });
});


router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
});

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const user = new User({
                email, name, password, cart: {items: []}
            });
            await user.save();
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;