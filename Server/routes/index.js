const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter');
const houseRouter = require('./houseRouter');

router.use('/user', userRouter);
router.use('/houses', houseRouter);

module.exports = router