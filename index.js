// var url = "http://api.openweathermap.org/data/2.5/forecast/city?id=524901&APPID=2ab5a5b18737e945b5af9cae2e8e1ffe";
var url = "http://api.openweathermap.org/data/2.5/weather?zip=55345,us&APPID=2ab5a5b18737e945b5af9cae2e8e1ffe";

var months = ["placeholder", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// This gives a "loading" icon when data is loading
$body = $("body");

$(document).bind({
   ajaxStart: function() { $body.addClass("loading");   },
   ajaxStop:  function() { $body.removeClass("loading");}
});

function kelvinToFahrenheit(kelvin) {
  return Math.round(kelvin * (9/5) - 459.67);
}

function mpsToMph(mps) {
  return Math.round(mps/.44704);
}

function unixToTime(timestamp) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp*1000);
    // Hours part from the timestamp
    var hours24 = date.getHours();
    var hoursNumber = parseInt(hours24,10);
    if (hoursNumber > 12) {hoursNumber = hoursNumber - 12;}
    var hours12 = hoursNumber.toString();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = hours12 + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

function ampm(timestamp) {
  var am = true;
  var date = new Date(timestamp*1000);
  // Hours part from the timestamp
  var hours24 = date.getHours();
  var hoursNumber = parseInt(hours24,10);
  if (hoursNumber > 12) {am = false;}
  return am;
}

/////////////
$.ajax({

  url: url,
  success: function(result){
    console.log(result);
  if("rain" in result) {
    $("#rain").text("Rain in the last 3 hours: " + result.rain["3h"]);
  }
  if("snow" in result) {
    $("#snow").text("Snow in the last 3 hours: " + result.snow["3h"]);
  }

  $("#weather_place").text(result.name);

  var cloudiness = result.weather[0].description + ", cloudiness: " + result.clouds.all +"%"
  $("#weather_desc").text(cloudiness);



  var iconUrl = 'http://openweathermap.org/img/w/'+result.weather[0].icon+'.png'

  $("#weather_img_icon").attr("src", iconUrl);

  var currentTemp = kelvinToFahrenheit(result.main.temp);
  var displayTemp = "Temperature " + currentTemp + "&#176;F";
  $("#weather_tempNow").html(displayTemp);

  var windSpeed = mpsToMph(result.wind.speed)
  var displayWindSpeed = "wind " + windSpeed + " mph";
  $("#weather_wind").text(displayWindSpeed);

  var displayHumidity = "Humidity " + result.main.humidity + "%"
  $("#weather_humidity").text(displayHumidity);

  var onlyTime = unixToTime(result.dt);
  var amOrPm = ampm(result.dt);
  var displayTime = ""
  if (amOrPm) {
    displayTime =   "Current time: " + onlyTime + " a.m.";
  } else {
    displayTime =   "Current time: " + onlyTime + " p.m.";
  }
  $("#weather_time").text(displayTime);

  var sunrise = unixToTime(result.sys.sunrise);
  var displaySunrise = "Sunrise: " + sunrise + " a.m.";
  $("#weather_sunrise").text(displaySunrise);

  var sunset = unixToTime(result.sys.sunset);
  var displaySunset = "Sunset: " + sunset + " p.m.";
  $("#weather_sunset").text(displaySunset);





}
});


// var date = result.date
// var year = date.substr(0,4);
// var monthDigit = date.substr(5,2);
// var day = date.substr(8,2);
// var monthNumber = parseInt(monthDigit,10);
// var month = months[monthNumber];
// console.log(day, monthDigit);
// var dateString = month + " " + day + ", " + year;
// $("#apod_date").text(dateString);
