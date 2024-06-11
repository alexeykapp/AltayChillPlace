const blogService = require('./blogService');
const sequelize = require('../db')
const { reservation_request, house, client, application_payment_status, booking_request_status_name, payment_status_name, composition_of_application_additional_services, additional_service, reservation_application_status } = require('../models/models');

class AdminService {
    async getAllReservations() {
        try {
            const query = `
            WITH ranked_statuses AS (
    SELECT
        rr.id_reservation_request,
        rr.date_of_application,
        rr.arrival_date,
        rr.date_of_departure,
        rr.number_of_persons,
        rr.fk_client,
        rr.fk_house,
        h.id_house,
        h.house_number,
        h.house_name,
        h.price_per_day,
        h.max_number_of_people,
        h.room_size,
        h.room_description,
        h.fk_type_of_number,
        h.additional_characteristic1,
        h.additional_characteristic2,
        c.id_client,
        c.first_name,
        c.last_name,
        c.phone_number_client,
        c.mail_client,
        aps.id_application_payment_status,
        aps.date_of_payment,
        aps.payment_time,
        aps.fk_payment_state,
        aps.fk_reservation_request AS aps_fk_reservation_request,
        psn.id_payment_status_name,
        psn.name_payment_status,
        ras.id_reservation_application_status,
        ras.application_update_date,
        ras.application_update_time,
        ras.fk_application_status,
        ras.fk_reservation_request AS ras_fk_reservation_request,
        brsn.id_booking_request_status_name,
        brsn.name_booking_request_status_name,
        coas.id_composition_of_application_additional_services,
        coas.fk_additional_service,
        coas.fk_reservation_request AS coas_fk_reservation_request,
        ads.id_additional_service,
        ads.name_of_additional_service,
        ads.additional_service_price,
        ROW_NUMBER() OVER(PARTITION BY rr.id_reservation_request ORDER BY ras.application_update_date DESC, ras.application_update_time DESC) AS rn
    FROM
        reservation_request AS rr
    LEFT OUTER JOIN
        house AS h ON rr.fk_house = h.id_house AND h."deletedAt" IS NULL
    LEFT OUTER JOIN
        client AS c ON rr.fk_client = c.id_client
    LEFT OUTER JOIN
        application_payment_status AS aps ON rr.id_reservation_request = aps.fk_reservation_request
    LEFT OUTER JOIN
        payment_status_name AS psn ON aps.fk_payment_state = psn.id_payment_status_name
    LEFT OUTER JOIN
        reservation_application_status AS ras ON rr.id_reservation_request = ras.fk_reservation_request
    LEFT OUTER JOIN
        booking_request_status_name AS brsn ON ras.fk_application_status = brsn.id_booking_request_status_name
    LEFT OUTER JOIN
        composition_of_application_additional_services AS coas ON rr.id_reservation_request = coas.fk_reservation_request
    LEFT OUTER JOIN
        additional_service AS ads ON coas.fk_additional_service = ads.id_additional_service
),
additional_services_sum AS (
    SELECT
        coas_fk_reservation_request AS fk_reservation_request, -- Используйте псевдоним, определенный в CTE ranked_statuses
        SUM(additional_service_price) AS total_additional_services_price
    FROM
        ranked_statuses
    WHERE
        coas_fk_reservation_request IS NOT NULL
    GROUP BY
        coas_fk_reservation_request
)
SELECT
    rs.*,
    ass.total_additional_services_price,
    ((rs.date_of_departure - rs.arrival_date + 1) * rs.price_per_day) + COALESCE(ass.total_additional_services_price, 0) AS total_reservation_price
FROM
    ranked_statuses AS rs
LEFT JOIN
    additional_services_sum AS ass ON rs.id_reservation_request = ass.fk_reservation_request
WHERE
    rs.rn = 1;
`;

            const [results, metadata] = await sequelize.query(query);

            // Структурируем данные
            const reservationsMap = {};

            results.forEach(row => {
                if (!reservationsMap[row.id_reservation_request]) {
                    reservationsMap[row.id_reservation_request] = {
                        reservationRequest: {
                            requestBooking: {
                                id: row.id_reservation_request,
                                dateOfApplication: row.date_of_application,
                                arrivalDate: row.arrival_date,
                                dateOfDeparture: row.date_of_departure,
                                numberOfPersons: row.number_of_persons,
                                totalPrice: row.total_reservation_price,
                            },
                            client: {
                                id: row.id_client,
                                firstName: row.first_name,
                                lastName: row.last_name,
                                phoneNumber: row.phone_number_client,
                                email: row.mail_client
                            },
                            house: {
                                id: row.id_house,
                                number: row.house_number,
                                name: row.house_name,
                                pricePerDay: row.price_per_day,
                                maxNumberOfPeople: row.max_number_of_people,
                                roomSize: row.room_size,
                                roomDescription: row.room_description,
                                typeOfNumber: row.fk_type_of_number,
                                additionalCharacteristics: [
                                    row.additional_characteristic1,
                                    row.additional_characteristic2
                                ]
                            },
                            paymentStatus: {
                                id: row.id_application_payment_status,
                                dateOfPayment: row.date_of_payment,
                                paymentTime: row.payment_time,
                                paymentState: row.fk_payment_state,
                                paymentStatusName: row.name_payment_status
                            },
                            applicationStatus: {
                                id: row.id_reservation_application_status,
                                updateDate: row.application_update_date,
                                updateTime: row.application_update_time,
                                applicationStatus: row.fk_application_status,
                                statusName: row.name_booking_request_status_name
                            },
                            additionalServices: []
                        }
                    };
                }

                if (row.id_additional_service) {
                    reservationsMap[row.id_reservation_request].reservationRequest.additionalServices.push({
                        id: row.id_composition_of_application_additional_services,
                        serviceId: row.fk_additional_service,
                        serviceName: row.name_of_additional_service
                    });
                }
            });

            const structuredResults = Object.values(reservationsMap).map(item => item.reservationRequest);

            console.log(JSON.stringify(structuredResults, null, 2)); // Добавьте это для отладки

            return structuredResults;
        } catch (error) {
            console.error("Error fetching reservations:", error);
            throw new Error("Error fetching reservations");
        }
    }

    async updateReservationStatus(reservationId, statusData) {
        const reservation = await reservation_request.findByPk(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }

        await reservation.update(statusData);

        return reservation;
    }
    async creteNewReservationStatus(reservationId, statusId) {
        const reservation = await reservation_request.findByPk(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        const newReservationStatus = await reservation_application_status.create({
            fk_application_status: statusId,
            fk_reservation_request: reservationId
        });
        return newReservationStatus;
    }
    async getAllStatus() {
        const statuses = await booking_request_status_name.findAll();
        return statuses;
    }
    async createNewPaymentStatus(reservationId, payment_status_id) {
        const paymentNewStatus = await application_payment_status.create({
            fk_payment_state: payment_status_id,
            fk_reservation_request: reservationId
        });
        return paymentNewStatus;
    }
}

module.exports = new AdminService();