module.exports = class UserDto {
    id;
    email;
    isAdmin;
    constructor(user) {
        this.email = user.mail_client
        this.id = user.id_client
        this.isAdmin = user.isAdmin
    }
}