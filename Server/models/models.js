const sequelize = require('../db')
const { DataTypes, TimeoutError } = require('sequelize')

const additional_service = sequelize.define('additional_service', {
    id_additional_service: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_of_additional_service: { type: DataTypes.STRING(50) },
    additional_service_price: { type: DataTypes.INTEGER },
    description_of_additional_service: { type: DataTypes.STRING }
})

const blog = sequelize.define('blog', {
    id_blog: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: true },
    publication_title: { type: DataTypes.STRING(70) },
    publication_date: { type: DataTypes.DATE },
    publication_text: { type: DataTypes.TEXT },
    image_blog: { type: DataTypes.BLOB }
})

const application_payment_status = sequelize.define('application_payment_status', {
    id_application_payment_status: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_of_payment: { type: DataTypes.DATE },
    payment_time: { type: DataTypes.TIME },
    fk_payment_state: { type: DataTypes.INTEGER },
    fk_reservation_request: { type: DataTypes.INTEGER }
})

const booking_request_status_name = sequelize.define('booking_request_status_name', {
    id_booking_request_status_name: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_booking_request_status_name: { type: DataTypes.STRING(30) }
})

const client = sequelize.define('client', {
    id_client: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name_client: { type: DataTypes.STRING(70) },
    date_of_birth_client: { type: DataTypes.DATEONLY },
    phone_number_client: { type: DataTypes.STRING(11) },
    mail_client: { type: DataTypes.STRING },
    password_client: { type: DataTypes.STRING },
    photo_avatar: { type: DataTypes.BLOB }
})

const composition_of_application_additional_services = sequelize.define('composition_of_application_additional_services', {
    id_composition_of_application_additional_services: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fk_additional_service: { type: DataTypes.INTEGER },
    fk_reservation_request: { type: DataTypes.INTEGER },
}, {
    timestamps: false,
    createdAt: false
})

const equipment_numbers = sequelize.define('equipment_numbers', {
    id_equipment_numbers: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fk_house: { type: DataTypes.INTEGER },
    fk_items: { type: DataTypes.INTEGER }
})

const house = sequelize.define('house', {
    id_house: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    house_number: { type: DataTypes.INTEGER },
    house_name: { type: DataTypes.STRING },
    price_per_day: { type: DataTypes.INTEGER },
    max_number_of_people: { type: DataTypes.INTEGER },
    room_size: { type: DataTypes.INTEGER },
    room_description: { type: DataTypes.TEXT },
    photo_of_the_room: { type: DataTypes.BLOB },
    fk_type_of_number: { type: DataTypes.INTEGER }
})

const house_item = sequelize.define('house_item', {
    id_house_item: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    item_name: { type: DataTypes.STRING(30) },
    item_characteristics: { type: DataTypes.STRING(70) },
    fk_type_items: { type: DataTypes.INTEGER }
})

const item_type = sequelize.define('item_type', {
    id_item_type: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_type: { type: DataTypes.STRING(50) }
})

const mark_reservation = sequelize.define('mark_reservation', {
    id_mark_reservation: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fk_reservation_request: { type: DataTypes.INTEGER },
    description_of_the_mark: { type: DataTypes.TEXT }
})

const payment_status_name = sequelize.define('payment_status_name', {
    id_payment_status_name: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_payment_status: { type: DataTypes.STRING }
})

const photos_in_review = sequelize.define('id_photos_in_review', {
    id_photos_in_review: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    photo_review: { type: DataTypes.BLOB },
    fk_review: { type: DataTypes.INTEGER }
})

const photos_rooms = sequelize.define('photos_rooms', {
    id_photos_rooms: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    photo_of_the_room: { type: DataTypes.BLOB },
    fk_house: { type: DataTypes.INTEGER }
})

const reservation_application_status = sequelize.define('reservation_application_status', {
    id_reservation_application_status: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    application_update_date: { type: DataTypes.DATE },
    application_update_time: { type: DataTypes.TIME },
    fk_application_status: { type: DataTypes.INTEGER },
    fk_reservation_request: { type: DataTypes.INTEGER }
})

const reservation_request = sequelize.define('reservation_request', {
    id_reservation_request: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date_of_application: { type: DataTypes.DATE },
    arrival_date: { type: DataTypes.DATE },
    date_of_departure: { type: DataTypes.DATE },
    number_of_persons: { type: DataTypes.INTEGER },
    fk_client: { type: DataTypes.INTEGER },
    fk_house: { type: DataTypes.INTEGER }
})

const review_to_number = sequelize.define('review_to_number', {
    id_review_to_number: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    review_text: { type: DataTypes.TEXT },
    review_date: { type: DataTypes.DATE },
    review_time: { type: DataTypes.TIME },
    fk_client: { type: DataTypes.INTEGER },
    fk_house: { type: DataTypes.INTEGER }
});

const type_of_number = sequelize.define('type_of_number', {
    id_type_of_number: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room_type_name: { type: DataTypes.STRING }
})

additional_service.hasMany(composition_of_application_additional_services, {
    foreignKey: 'fk_additional_service'
})
composition_of_application_additional_services.belongsTo(additional_service, {
    foreignKey: 'fk_additional_service'
})

booking_request_status_name.hasMany(reservation_application_status, {
    foreignKey: 'fk_application_status'
})
reservation_application_status.belongsTo(booking_request_status_name, {
    foreignKey: 'fk_application_status'
})

client.hasMany(reservation_request, {
    foreignKey: 'fk_client'
})
reservation_request.belongsTo(client, {
    foreignKey: 'fk_client'
})

client.hasMany(review_to_number, {
    foreignKey: 'fk_client'
})
review_to_number.belongsTo(client, {
    foreignKey: 'fk_client'
})

house.hasMany(equipment_numbers, {
    foreignKey: 'fk_house'
})
equipment_numbers.belongsTo(house, {
    foreignKey: 'fk_house'
})

house.hasMany(photos_rooms, {
    foreignKey: 'fk_house'
})
photos_rooms.belongsTo(house, {
    foreignKey: 'fk_house'
})

house.hasMany(reservation_request, {
    foreignKey: 'fk_house'
})
reservation_request.belongsTo(house, {
    foreignKey: 'fk_house'
})

house.hasMany(review_to_number, {
    foreignKey: 'fk_house'
})
review_to_number.belongsTo(house, {
    foreignKey: 'fk_house'
})

house_item.hasMany(equipment_numbers, {
    foreignKey: 'fk_items'
})
equipment_numbers.belongsTo(house_item, {
    foreignKey: 'fk_items'
})

item_type.hasMany(house_item, {
    foreignKey: 'fk_type_items'
})
house_item.belongsTo(item_type, {
    foreignKey: 'fk_type_items'
})

payment_status_name.hasMany(application_payment_status, {
    foreignKey: 'fk_payment_state'
})
application_payment_status.belongsTo(payment_status_name, {
    foreignKey: 'fk_payment_state'
})

reservation_request.hasMany(reservation_application_status, {
    foreignKey: 'fk_reservation_request'
})
reservation_application_status.belongsTo(reservation_request, {
    foreignKey: 'fk_reservation_request'
})

reservation_request.hasMany(composition_of_application_additional_services, {
    foreignKey: 'fk_reservation_request'
})
composition_of_application_additional_services.belongsTo(reservation_request, {
    foreignKey: 'fk_reservation_request'
})

reservation_request.hasMany(mark_reservation, {
    foreignKey: 'fk_reservation_request'
})
mark_reservation.belongsTo(reservation_request, {
    foreignKey: 'fk_reservation_request'
})

reservation_request.hasMany(application_payment_status, {
    foreignKey: 'fk_reservation_request'
})
application_payment_status.belongsTo(reservation_request, {
    foreignKey: 'fk_reservation_request'
})

review_to_number.hasMany(photos_in_review, {
    foreignKey: "fk_review"
})
photos_in_review.belongsTo(review_to_number, {
    foreignKey: 'fk_review'
})

type_of_number.hasMany(house, {
    foreignKey: 'fk_type_of_number'
})
house.belongsTo(type_of_number, {
    foreignKey: 'fk_type_of_number'
})

module.exports = {
    additional_service,
    application_payment_status,
    blog,
    booking_request_status_name,
    client,
    composition_of_application_additional_services,
    equipment_numbers,
    house,
    house_item,
    item_type,
    mark_reservation,
    payment_status_name,
    photos_in_review,
    photos_rooms,
    reservation_application_status,
    reservation_request,
    review_to_number,
    type_of_number
}