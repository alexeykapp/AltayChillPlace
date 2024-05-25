const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter');
const houseRouter = require('./houseRouter');
const serviceRouter = require('./servicesRouter');
const profileRouter = require('./profileRouter');
const blogRouter = require('./blogRouter');
const authMiddleware = require('../middleware/auth-middleware');

router.use('/user', userRouter);
router.use('/houses', houseRouter);
router.use('/service', serviceRouter);
router.use('/blog', blogRouter)
router.use('/profile', authMiddleware, profileRouter);

module.exports = router