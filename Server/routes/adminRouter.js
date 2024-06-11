const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/adminMiddleware');

adminRouter.post('/newpost', adminController.createNewPostBlog);

// Посты
adminRouter.get('/reservations', adminController.getAllReservations);
adminRouter.put('/reservations/:reservationId/status', adminController.updateReservationStatus);
adminRouter.post('/reservations/createStatus/:reservationId', adminController.createNewReservationStatus);
adminRouter.post('/reservations/createPaymentStatus/:reservationId', adminController.createNewPaymentStatus);
adminRouter.get('/reservations/statuses', adminController.getStatusReservation);

module.exports = adminRouter;