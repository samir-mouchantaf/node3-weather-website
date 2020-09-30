console.log("Js is working");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const p1 = document.querySelector("#message-1");
const p2 = document.querySelector("#message-2");

weatherForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const location = search.value
    p1.textContent = 'LOADING...'
    p2.textContent =''

    fetch(`/weather?address=${location}`).then((response) => {
	response.json().then((data) => {
        // console.log(data)
        p1.textContent = data.location
        p2.textContent = `Your forecast is: ${data.forecast.desc}, temperature is ${data.forecast.temp}f but it feels like ${data.forecast.feelslike}f and your wind speed is ${data.forecast.wind} mph. `
	});
});
})

