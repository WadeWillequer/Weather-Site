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
    $(document).on("click", "button#remove", function () {
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
            let weatherIcon = data.currently.icon;


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

            templateHTML = templateHTML.replace("@@imageURL@@", getBackgroundPath(weatherIcon))

            for (var i = 0; i < 5; i++) {
                //set the date for each day
                if (i > 0) {
                    let date = new Date();
                    date.setDate(date.getDate() + i);
                    
                    // Get the month (0-11) from the date and add 1 to it for accuracy
                    let month = date.getMonth() + 1;
                    // Get the day from the date
                    let day = date.getDate();

                    // replace the placeholder text in the template for date i
                    templateHTML = templateHTML.replace("@@date" + i + "@@", month + "/" + day);
                }

                // Get the weather data for the day based on i
                let currentDayWeatherData = data.daily.data[i];

                templateHTML = templateHTML.replace("@@max" + i + "@@", Math.round(currentDayWeatherData.temperatureMax))

                templateHTML = templateHTML.replace("@@low" + i + "@@", Math.round(currentDayWeatherData.temperatureLow))

                templateHTML = templateHTML.replace("@@precip" + i + "@@", Math.round(currentDayWeatherData.precipProbability * 100))

            }

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


function getBackgroundPath(iconString) {
    //Create a switch statement that switches based on the value of iconString. For each case, it should return the path to the appropriate image for that iconString value, by default, it should return the path to the clear-day image

    switch (iconString) {
        case "clear-day":
            return "../img/clear-day.jpg";
        case "clear-night":
            return "../img/clear-night.jpg";
        case "cloudy":
            return "../img/cloudy.jpg";
        case "fog":
            return "../img/fog.jpg";
        case "partly-cloudy-day":
            return "../img/partly-cloudy-day.jpg";
        case "partly-cloudy-night":
            return "../img/partly-cloudy-night.jpg";
        case "rain":
            return "../img/rain.jpg";
        case "sleet":
            return "../img/sleet.jpg";
        case "snow":
            return "../img/snow.jpg";
        case "wind":
            return "../img/wind.jpg";
        default: 
            return "../img/clear-day.jpg";

    }
}
