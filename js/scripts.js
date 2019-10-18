(function () {
    //Submit button event handler
    $("#submit").click(function () {
        //Get the value the user has entered in the search bar and store it
        const searchLocation = $("#areaInput").val();
        //Call the geocode function and pass in the value
        geocode(searchLocation);
        //Clear out the search bar
        $("#areaInput").val("");
    })

    $("#areaInput").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $("#submit").click()
            event.preventDefault();
        }
    });
    // When a button with the ID of remove is clicked, do the function
    $(document).on("click", "button#remove", function() {
        // get the parent element of the button
        let parentDiv = $(this).parent(); //This refers to the element that triggered the event handler (in this case the button that was clicked)
        // get the parent of the div containing the button
        let weatherCardContainer = parentDiv.parent();
        // Remove the container and all of its contents
        weatherCardContainer.remove();
    });
    
})();

// funcrtion to connect to the dark sky api and get weather data
function getWeatherInfo(latitude, longitude, city, state) {
    //Base-URL/APIKey/Latitute,Longitude

    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp" })
        .done(function (data) {

            // get html from the div with the ID template
            let templateHTML = $("#template").html();

            // we need to get the temperature from the dark sky api
            let temperature = data.currently.temperature;
            let conditions = data.currently.summary;
            let currentDayInfo = data.daily.data[0];
            let highTemp = currentDayInfo.temperatureHigh;
            let lowTemp = currentDayInfo.temperatureLow;
            let precipChance = currentDayInfo.precipProbability * 100;

            // Replace the string "@@city@@" with the city we pass into this function into the HTML
            templateHTML = templateHTML.replace("@@city@@", city);
            // replace the string "@@currentTemp@@" with the current temperature  get back from the API call"
            templateHTML = templateHTML.replace("@@currentTemp", Math.round(temperature));
            // replace the string "@@cityState" with the current city and state we get back from the API call 
            templateHTML = templateHTML.replace("@@cityState", city + " " + state); 
            // Replace the string for Current Conditions
            templateHTML = templateHTML.replace("@@conditions@@", conditions); 
            // Replace the current string for high temperature
            templateHTML = templateHTML.replace("@@highTemp", Math.round(highTemp)); 
            // replace the current string for low temperature
            templateHTML = templateHTML.replace("@@lowTemp", Math.round(lowTemp))
            // replace current string with precipitation chance
            templateHTML = templateHTML.replace("@@precipChance", Math.round(precipChance))

            // Add the configured template HTML to our row in the card container
            $(".row").append(templateHTML);


        })
        .fail(function () {
            console.log(error);
        })
        .always(function () {
            console.log("Weather call Complete!");
        })
}

// function to connect to the mapquest geocoding api and get geocoding data
function geocode(location) {
    //Base-URL= + APIKey + &location= + Address
    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location)
        .done(function (data) {
            //Get the lat and lng from the response
            let locations = data.results[0].locations[0];

            let lat = locations.latLng.lat;
            let lng = locations.latLng.lng;

            let city = locations.adminArea5;
            let state = locations.adminArea3;

            //Pass the lat and lng to our getWeatherInfo function
            getWeatherInfo(lat, lng, city, state);
        })
        .fail(function () {
            console.log(error);
        })
        .always(function () {
            console.log("Geocode call finished!");
        })
} 