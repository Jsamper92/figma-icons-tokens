let { red } = require('colors');

/**
 * @description Print message error
 * @param {String} message 
 * @returns {String}
 */
const error = (message) => console.log(red(message));

module.exports = {
    error
};
