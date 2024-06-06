const bookingHouseService = require('./house-service');
const existService = require('../helpers/checkExists');
const ApiError = require('../error/api-error');
const moment = require('moment');
const sequelize = require('../db');
const { reservation_request, house, reservation_application_status, composition_of_application_additional_services, additional_service, booking_request_status_name } = require('../models/models');

class BookingService {
    async createRequest(id_client, id_house, numberOfPeople, arrivalDate, departureDate) {
        const resultCheck = await existService.existHouseAndClient(id_house, id_client);
        if (resultCheck == false) {
            throw ApiError.BadRequest("Check the transmitted IDs");
        }
        const bookingRequest = await reservation_request.create({
            arrival_date: arrivalDate,
            date_of_departure: departureDate,
            number_of_persons: numberOfPeople,
            fk_client: id_client,
            fk_house: id_house
        });
        return bookingRequest;
    }

    async getHistoryBooking(idClient) {
        const history = await getReservationHistoryByUserId(idClient);
        return history;
    }
}

function calculateDaysOfStay(arrivalDate, departureDate) {
    return moment(departureDate).diff(moment(arrivalDate), 'days');
}

function calculateStayCost(daysOfStay, pricePerDay) {
    return daysOfStay * pricePerDay;
}

function calculateAdditionalServicesCost(additionalServices) {
    return additionalServices.reduce((totalPrice, service) => {
        if (service.name_of_additional_service && service.additional_service_price) {
            return totalPrice + service.additional_service_price;
        }
        console.error('Отсутствует name_of_additional_service или additional_service_price', service);
        return totalPrice;
    }, 0);
}

function getLatestStatus(reservationApplicationStatuses) {
    const latestStatus = reservationApplicationStatuses.sort((a, b) => {
        return new Date(b.application_update_date) - new Date(a.application_update_date) ||
            new Date(`1970/01/01 ${b.application_update_time}`) - new Date(`1970/01/01 ${a.application_update_time}`);
    })[0];

    if (latestStatus && latestStatus.name_booking_request_status_name) {
        return latestStatus.name_booking_request_status_name;
    }

    console.error('Статус заявки не найден или отсутствует имя статуса:', latestStatus);
    return "Unknown Status";
}

function formatReservationRecord(record) {
    console.log('Форматирование записи бронирования:', record);
    const daysOfStay = calculateDaysOfStay(record.arrival_date, record.date_of_departure);
    const stayCost = record.price_per_day ? calculateStayCost(daysOfStay, record.price_per_day) : 0;
    const additionalServicesCost = calculateAdditionalServicesCost(record.additional_services);
    const latestStatusName = getLatestStatus(record.statuses);

    return {
        houseName: record.house_name || 'Неизвестный дом',
        arrivalDate: record.arrival_date,
        departureDate: record.date_of_departure,
        numberOfPersons: record.number_of_persons,
        totalSum: stayCost + additionalServicesCost,
        bookingStatus: latestStatusName,
        additionalServices: record.additional_services.map(service => ({
            name: service.name_of_additional_service || 'Неизвестная услуга',
            price: service.additional_service_price || 0
        }))
    };
}

// Основная функция для обращения к БД и обработки данных
async function getReservationHistoryByUserId(userId) {
    const query = `
        SELECT 
            rr.id_reservation_request,
            rr.arrival_date,
            rr.date_of_departure,
            rr.number_of_persons,
            h.price_per_day,
            h.house_name,  -- Добавляем название дома
            ras.application_update_date,
            ras.application_update_time,
            brsn.name_booking_request_status_name,
            coas.id_composition_of_application_additional_services,
            coas.fk_additional_service,
            coas.fk_reservation_request,
            ads.name_of_additional_service,
            ads.additional_service_price
        FROM reservation_request rr
        LEFT JOIN house h ON rr.fk_house = h.id_house
        LEFT JOIN reservation_application_status ras ON ras.fk_reservation_request = rr.id_reservation_request
        LEFT JOIN booking_request_status_name brsn ON ras.fk_application_status = brsn.id_booking_request_status_name
        LEFT JOIN composition_of_application_additional_services coas ON coas.fk_reservation_request = rr.id_reservation_request
        LEFT JOIN additional_service ads ON coas.fk_additional_service = ads.id_additional_service
        WHERE rr.fk_client = :userId
        ORDER BY ras.application_update_date DESC, ras.application_update_time DESC
    `;

    try {
        const reservations = await sequelize.query(query, {
            replacements: { userId: userId },
            type: sequelize.QueryTypes.SELECT
        });

        console.log('Данные бронирований:', reservations);

        // Группировка данных по reservation_request
        const groupedReservations = reservations.reduce((acc, curr) => {
            const { id_reservation_request, application_update_date, application_update_time, name_booking_request_status_name, ...rest } = curr;

            if (!acc[id_reservation_request]) {
                acc[id_reservation_request] = {
                    ...rest,
                    statuses: [],
                    additional_services: []
                };
            }

            acc[id_reservation_request].statuses.push({ application_update_date, application_update_time, name_booking_request_status_name });
            acc[id_reservation_request].additional_services.push({ name_of_additional_service: curr.name_of_additional_service, additional_service_price: curr.additional_service_price });

            return acc;
        }, {});

        console.log('Группированные данные бронирований:', groupedReservations);

        const formattedReservations = Object.values(groupedReservations).map(formatReservationRecord);

        console.log('Reservations retrieved:', JSON.stringify(formattedReservations, null, 2));

        return formattedReservations;
    } catch (error) {
        console.error('Ошибка при извлечении истории бронирования:', error);
        throw error;
    }
}

module.exports = new BookingService();