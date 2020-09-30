const request = require('postman-request')

const forecast = (long, lat, callback) =>{
    const url = `http://api.weatherstack.com/current?access_key=8b4cc1deea67409156311158804d1f31&query=${lat},${long}&units=f`

    request({url:url, json:true}, (error,response)=>{
        if(error){
            callback(error, undefined)
        } else if(response.body.success === false){
            callback(response.body.error.info, undefined)
        } else {
            const data = {
                time: response.body.current.observation_time,
                desc: response.body.current.weather_descriptions[0],
                wind: response.body.current.wind_speed,
                temp: response.body.current.temperature,
                feelslike: response.body.current.feelslike
            }
            callback(undefined,data)
        }
    })
}





module.exports = forecast