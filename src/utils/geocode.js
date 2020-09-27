const request = require('postman-request')

const geocode = (city, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/encodeURIComponent(${city}).json?access_token=pk.eyJ1IjoibW91Y2hhbnRhZiIsImEiOiJja2VocG40b2MwenMwMnJudmdkZTE1d2lmIn0.5k_naCA93uJZSuHevDwVyw&limit=1`

    request({url:url, json:true}, (error, response) => {
        if(error){
            callback('Unable to reach location service',undefined)
        }
        else if(response.body.features.length === 0){
            callback('Unable to find location, try another search', undefined)
        }
        else {
            const data = {
                long: response.body.features[0].center[0],
                lat: response.body.features[0].center[1],
                location:  response.body.features[0].place_name
            }
            callback(undefined, data)
        }
    })
}


module.exports = geocode