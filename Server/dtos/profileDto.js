module.exports = class ProfileDto {
    id;
    first_name;
    middle_name;
    last_name;
    email;
    phone;
    dateOfBerth;
    isAdmin;
    constructor(user) {
        console.log(user);
        this.id = user.id_client;
        this.first_name = user.first_name;
        this.middle_name = user.middle_name;
        this.last_name = user.last_name;
        this.email = user.mail_client;
        this.phone = user.phone_number_client;
        this.dateOfBerth = user.date_of_birth_client;
        this.isAdmin = user.isAdmin;
    }
}