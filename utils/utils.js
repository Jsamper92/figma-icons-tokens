let { red } = require('colors');

const alert = (message) => {
    console.log("");
    console.log("-".repeat(message.length));
    console.log(message.toUpperCase());
    console.log("-".repeat(message.length));
    console.log("");
  };
const error = (message) => console.log(red(message));
const success = (message) => console.log(green(message));
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
const chunk = (arr, size) =>
    arr.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size));
        return acc;
    }, []);

module.exports = {
    alert,
    error,
    timer,
    chunk,
    success,
};
