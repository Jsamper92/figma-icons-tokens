const [fs, path] = [require('fs'), require('path')];

const tokens = fs.readFileSync(path.resolve(process.cwd(), 'tokens.json')).toString();


module.exports = { tokens };