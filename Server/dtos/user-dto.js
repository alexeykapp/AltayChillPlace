module.exports = class UserDto {
    id;
    email;
    constructor(user) {
        this.email = user.mail_client
        this.id = user.id_client
    }
}