const nodeGeocoder = require("node-geocoder");


const options = {
    provider: process.env.GEO_LOCATION_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEO_LOCATION_API,
    formatter: null
}

const geocoder = nodeGeocoder(options)

module.exports = geocoder;