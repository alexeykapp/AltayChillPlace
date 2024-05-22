const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter');
const houseRouter = require('./houseRouter');
const serviceRouter = require('./servicesRouter');

router.use('/user', userRouter);
router.use('/houses', houseRouter);
router.use('/service', serviceRouter);

module.exports = router