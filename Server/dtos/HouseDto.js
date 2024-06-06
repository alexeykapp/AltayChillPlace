class HouseDto {
    constructor(house) {
        this.id_house = house.id_house;
        this.house_number = house.house_number;
        this.house_name = house.house_name;
        this.price_per_day = house.price_per_day;
        this.max_number_of_people = house.max_number_of_people;
        this.room_size = house.room_size;
        this.room_description = house.room_description;
        this.fk_type_of_number = house.fk_type_of_number;
        this.additional_characteristic1 = house.additional_characteristic1;
        this.additional_characteristic2 = house.additional_characteristic2;
    }
}

module.exports = HouseDto;