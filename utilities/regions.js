const regions = require('country-region-data')

let us = regions.filter(country => country.countryName == 'United States')
console.log(us[0].regions)
