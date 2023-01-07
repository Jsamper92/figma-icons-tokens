let { red } = require('colors');

/**
 * @description Print message error
 * @param {String} message 
 * @returns {String}
 */
const error = (message) => console.log(red(message));
/**
 * Timer is a function that returns a promise that resolves after a given number of milliseconds.
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns {Promise<setTimeout>}
 */
const timer = (ms) => new Promise((res) => setTimeout(res, ms));


/**
 * If the index of the current element is divisible by the size, then push a new chunk into the
 * accumulator.
 * @param arr - The array to be chunked
 * @param size - The size of each chunk
 * @returns {Array<{name: string;node: string}[]>}
 */
const chunk = (arr, size) =>
    arr.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size));
        return acc;
    }, []);

module.exports = {
    error,
    timer,
    chunk,
};
