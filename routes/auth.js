const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // Validate Data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if user already on the database.
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // HASH passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch(err) {
        res.status(400).send(err);
    }

});

//LOGIN
router.post('/login', async (req, res) => {
    const{ error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if user already on the database.
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send('Email is not exists!');

    // PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Create and assign a token.
    const token = jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})

module.exports = router;