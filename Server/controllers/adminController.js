const { cast } = require('sequelize');
const blogService = require('../service/blogService');
const reservationService = require('../service/adminService');
const adminService = require('../service/adminService');

class AdminController {
    async createNewPostBlog(req, res, next) {
        try {
            const { title, description, date, photo } = req.body;
            const newPost = await blogService.createNewPost(title, description, date, photo);
            return res.json(newPost);
        }
        catch (err) {
            next();
        }
    }
    async getAllReservations(req, res) {
        try {
            const reservations = await reservationService.getAllReservations();
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateReservationStatus(req, res) {
        try {
            const { reservationId } = req.params;
            const statusData = req.body;
            const updatedReservation = await reservationService.updateReservationStatus(reservationId, statusData);
            res.status(200).json(updatedReservation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createNewReservationStatus(req, res, next) {
        try {
            const { reservationId } = req.params;
            const { status_id } = req.body;
            const updatedReservation = await reservationService.creteNewReservationStatus(reservationId, status_id);
            res.status(200).json(updatedReservation);
        } catch (error) {
            next()
        }
    }
    async getStatusReservation(req, res, next) {
        try {
            const statuses = await adminService.getAllStatus();
            return res.status(200).json(statuses);
        }
        catch (err) {
            next(err)
        }

    }
    async createNewPaymentStatus(req, res, next) {
        try {
            const { reservationId } = req.params;
            const { payment_status_id } = req.body;
            const paymentStatus = await reservationService.createNewPaymentStatus(reservationId, payment_status_id);
            return res.status(201).json(paymentStatus);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteBlogPost(req, res, next) {
        try {
            const id = req.params.idPost;
            const countPost = await blogService.deletePost(id);
            return res.status(200).json();
        }
        catch (err) {
            next(err)
        }
    }
}

module.exports = new AdminController();