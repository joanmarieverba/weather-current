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
    let date = new Date(timestamp*1000);
    // Hours part from the timestamp
    let hours24 = date.getHours();
    let hoursNumber = parseInt(hours24,10);
    if (hoursNumber > 12) {hoursNumber = hoursNumber - 12;}
    let hours12 = hoursNumber.toString();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    let formattedTime = `${hours12}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    return formattedTime;
}

function ampm(timestamp) {
  let am = true;
  let date = new Date(timestamp*1000);
  // Hours part from the timestamp
  let hours24 = date.getHours();
  let hoursNumber = parseInt(hours24,10);
  if (hoursNumber > 12) {am = false;}
  return am;
}

/////////////
function locationButtonClick (){
  console.log ("button was clicked", $("#zip").val());
  getWeatherData($("#zip").val());
  $(".displayCondition").show();
}

$("#btn").on("click",locationButtonClick);

function getWeatherData (zipCode){
  let url = "http://api.openweathermap.org/data/2.5/weather?q=" + zipCode + "&APPID=2ab5a5b18737e945b5af9cae2e8e1ffe";

$.ajax({

  url: url,
  success: function(result){
    console.log(result);

  let cityName = result.name;
  displayCityName = `for ${cityName}`;
  $("#weather_place").text(displayCityName);

  let cloudiness = `${result.weather[0].description}, cloudiness: ${result.clouds.all}%`
  $("#weather_desc").text(cloudiness);

  let iconUrl = 'http://openweathermap.org/img/w/'+result.weather[0].icon+'.png'
  $("#weather_img_icon").attr("src", iconUrl);

  if("rain" in result && !isNaN(result.rain["1h"])) {
    $("#rain").text(`Rain in the last hour: ${result.rain["1h"]} inches`);
  }
  if("snow" in result && !isNaN(result.snow["1h"])) {
    $("#snow").text(`Snow in the last hour: ${result.snow["1h"]}`);
  }

  let currentTemp = kelvinToFahrenheit(result.main.temp);
  let displayTemp = `${currentTemp}&#176;F`;
  $("#weather_tempNow").html(displayTemp);

  let windSpeed = mpsToMph(result.wind.speed);
  let displayWindSpeed = `wind ${windSpeed} mph`;
  $("#weather_wind").text(displayWindSpeed);

  var displayHumidity = `Humidity ${result.main.humidity}%`;
  $("#weather_humidity").text(displayHumidity);

  // var onlyTime = unixToTime(result.dt);
  // var amOrPm = ampm(result.dt);
  // var displayTime = ""
  // if (amOrPm) {
  //   displayTime =   "Current time: " + onlyTime + " a.m.";
  // } else {
  //   displayTime =   "Current time: " + onlyTime + " p.m.";
  // }
  // $("#weather_time").text(displayTime);
  //
  // var sunrise = unixToTime(result.sys.sunrise);
  // var displaySunrise = "Sunrise: " + sunrise + " a.m.";
  // $("#weather_sunrise").text(displaySunrise);
  //
  // var sunset = unixToTime(result.sys.sunset);
  // var displaySunset = "Sunset: " + sunset + " p.m.";
  // $("#weather_sunset").text(displaySunset);

  if (result.main.temp_max !== result.main.temp_min){
    let highTemp = kelvinToFahrenheit(result.main.temp_max);
    let displayHigh = `High: ${highTemp}&#176;F`;
    $("#high").html(displayHigh);

    let lowTemp= kelvinToFahrenheit(result.main.temp_min);
    let displayLow = `Low: ${lowTemp}&#176;F`;
    $("#low").html(displayLow);
  }
}
});
};
