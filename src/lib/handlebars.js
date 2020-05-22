const { format } = require('timeago.js');//obtenemos la instanacia timeago

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;
