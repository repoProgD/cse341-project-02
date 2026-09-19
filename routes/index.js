const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

router.use('/countries', require('./countries'));
router.use('/users', require('./users'));

module.exports = router;
