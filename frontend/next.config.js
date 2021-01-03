const path = require("path");
const dotenv = require('dotenv')

const envFile = path.resolve(__dirname, '..', '.env')
const envConfig = dotenv.config({ path: envFile }).parsed

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    exportTrailingSlash: true,
    env: envConfig
};
