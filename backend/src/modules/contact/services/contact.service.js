const mailerService = require('../../notifications/services/mailer.service');

class ContactService {
    async submitMessage(data) {
        return mailerService.sendContactMessage(data);
    }
}

module.exports = new ContactService();
