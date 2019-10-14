(function() {
    getWeatherInfo();
})();

// funcrtion to connect to the dark sky api and get weather data
function getWeatherInfo () {
    //Base-URL/APIKey/Latitute,Longitude

    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/37.8267,-122.4233", { dataType: "jsonp" })
    .done(function(data) {
        console.log(data);
    })
    .fail(function() {
        console.log(error);
    })
    .always(function() {
        console.log("Weather call Complete!");
    })
}

// function to connect to the mapquest geocoding api and get geocoding data
function geocode() {

}