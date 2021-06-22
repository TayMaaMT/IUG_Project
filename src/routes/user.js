const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

const { creat, genarateAuthToken, getuser, findByCredentials, find} = require('../models/user');

router.get('/users', auth,async(req, res) => {
    try {
        const users = await find('users');
        res.status(200).json({ users });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})
router.get('/notification', auth,async(req, res) => {
    try {
        const id =req.id;
        const notification = await find('notification',{user_id:id,all_user:true},'or');
        res.status(200).json({ notification });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})
router.get('/users', auth,async(req, res) => {
    try {
        const users = await find('notification',{});
        res.status(200).json({ users });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})
router.post('/signup', async(req, res) => {
    try {
        const { name, email,idIug , password,department,specialization } = req.body;
        console.log(name, email,idIug , password,department,specialization)
        const hashPassword = await bcrypt.hash(password, 8);
        const user_id = await creat('users', { name, email,idIug ,department,specialization, password: hashPassword });
        const token = genarateAuthToken(user_id);
        res.status(200).json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err });
    }
})

router.post('/login', async(req, res) => {
    try {
        const { idIug , password } = req.body;
        console.log(idIug , password)
        const user_id = await findByCredentials(idIug , password);
        const token = genarateAuthToken(user_id);
        res.status(200).json({ token: token });
    } catch (err) {
        res.status(400).json({ Error: "Unable to login" })
    }
})


module.exports = router;