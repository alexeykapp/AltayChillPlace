const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter');
const houseRouter = require('./houseRouter');
const serviceRouter = require('./servicesRouter');
const profileRouter = require('./profileRouter');
const blogRouter = require('./blogRouter');
const authMiddleware = require('../middleware/auth-middleware');
const adminRouter = require('./adminRouter');
const adminMiddleware = require('../middleware/adminMiddleware');
const reviewsRouter = require('./reviewsRouter');
const typeHouseRouter = require('./typeHouseRouter');
const bookingRouter = require('./bookingRouter');

router.use('/user', userRouter);
router.use('/houses', houseRouter);
router.use('/service', serviceRouter);
router.use('/blog', blogRouter);
router.use('/booking', bookingRouter)
router.use('/reviews', reviewsRouter);
router.use('/admin', authMiddleware, adminMiddleware, adminRouter);
router.use('/profile', authMiddleware, profileRouter);
router.use('/typeHouse', typeHouseRouter)

module.exports = router