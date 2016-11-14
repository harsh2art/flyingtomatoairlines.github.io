var destinationCity;
var fromCity;
var dates = {
  startDate: {
    day: "",
    month: "",
    year: ""
  },
  endDate : {
    day: "",
    month: "",
    year: ""
  }
}
var oneWay = false;
var budgetMax;
var outBoundSelected = false;
var returnSelected = false;
var resultsFound = false;

var outBoundDepart, outBoundArrive, outBoundPrice, returnDepart, returnArrive, returnPrice;

$(function(){

  // Destination and from

  var $inputDestination = $('#typeahead-destination');
  $inputDestination.typeahead({
    source: [{id: "HKG", name: "Hong Kong"}, {id: "KIX", name: "Osaka"}, {id: "HND", name: "Tokyo"}, {id: "PVG", name: "Shanghai"}, {id: "SIN", name: "Singapore"}]
  });

  $inputDestination.change(function() {
    var current = $inputDestination.typeahead("getActive");
    destinationCity = current;
    $("#booking-destination").html(destinationCity.id);
    $("#destinationTab").html(destinationCity.id);
    buildTrip();
  });

  var $inputFrom = $('#typeahead-from');
  $inputFrom.typeahead({
    source: [{id: "HKG", name: "Hong Kong"}, {id: "KIX", name: "Osaka"}, {id: "HND", name: "Tokyo"}, {id: "PVG", name: "Shanghai"}, {id: "SIN", name: "Singapore"}]
  });

  $inputFrom.change(function() {
    var current = $inputFrom.typeahead("getActive");
    fromCity = current;
    $("#booking-from").html(fromCity.id);
    $("#fromTab").html(fromCity.id);
    buildTrip();
  });

  function buildTrip() {
    if (destinationCity != null) {
      console.log("Destination: " + destinationCity.id);
    }
    if (fromCity != null) {
      console.log("From: " + fromCity.id);
    }
    if (destinationCity != null && fromCity != null) {
      updateResults();
    }
  }

  function updateResults() {
    resultsFound = false;
    $("#outbound").html("");
    $("#return").html("");
    if ((destinationCity.id != null && fromCity.id != null) && (destinationCity.id != fromCity.id)) {
      for (var i = 0; i < flights["from"].length; i++) {
        var from = Object.keys(flights["from"][i])[0];
        // Outbound
        if (fromCity.id == from) {
          var resultsOutboundHeader = $("<h1></h1>").text("Outbound flight: " + fromCity.name + " to " + destinationCity.name);
          $("#outbound").append(resultsOutboundHeader);
          for (var j = 0; j < flights["from"][i][fromCity.id].length; j++) {
            if (destinationCity.id == flights["from"][i][fromCity.id][j].id) {
              var flight = flights["from"][i][fromCity.id][j];
              var container = $("<div class='flight-result'></div>").attr({
                "data-from" : fromCity.id,
                "data-destination" : destinationCity.id,
                "data-index" : j
              });
              var title = $("<h2></h2>").text(fromCity.id + " - " + flight.id);
              var time = $("<p></p>").text(flight.depart + " to " + flight.arrive);
              var price = $("<p></p>").text("$" + flight.price)
              $("#outbound").append(container);
              container.append(title,time,price);
              resultsFound = true;
            } else {
              console.log("No flights from this location.")
            }
          }
        }
        // Return
        if (destinationCity.id == from && !oneWay) {
          var resultsOutboundHeader = $("<h1></h1>").text("Return flight: " + destinationCity.name + " to " + fromCity.name);
          $("#return").append(resultsOutboundHeader);
          for (var j = 0; j < flights["from"][i][destinationCity.id].length; j++) {
            if (fromCity.id == flights["from"][i][destinationCity.id][j].id) {
              var flight = flights["from"][i][destinationCity.id][j];
              var container = $("<div class='flight-result'></div>").attr({
                "data-from" : fromCity.id,
                "data-destination" : destinationCity.id,
                "data-index" : j
              });
              var title = $("<h2></h2>").text(destinationCity.id + " - " + flight.id);
              var time = $("<p></p>").text(flight.depart + " to " + flight.arrive);
              var price = $("<p></p>").text("$" + flight.price)
              $("#return").append(container);
              container.append(title,time,price);
              resultsFound = true;
            } else {
              console.log("No flights from this location.")
            }
          }
        }
        // End return
      }
    }

    if (resultsFound) {
      $("#flight-results").removeClass("resultsHidden");
      $("#bookButton").removeClass("resultsHidden");
    } else {
      $("#flight-results").addClass("resultsHidden");
      $("#bookButton").addClass("resultsHidden");
    }

  }

  // Select flights

  $("#outbound").on("click", "div.flight-result", function(){
    $("#outbound .flight-result").removeClass("selected");
    $(this).addClass("selected");
    outBoundSelected = true;
    outBoundDepart = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].depart;
    outBoundArrive = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].arrive;
    outBoundPrice = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].price;
    console.log(outBoundDepart, outBoundArrive, outBoundPrice);
    updateButton();
  });

  // console.log(flights["from"][0][$(".selected").attr("data-from")][0]);
  console.log($(".selected").attr("data-from"));

  $("#return").on("click", "div.flight-result", function(){
    $("#return .flight-result").removeClass("selected");
    $(this).addClass("selected");
    returnSelected = true;
    returnDepart = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].depart;
    returnArrive = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].arrive;
    returnPrice = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].price;
    console.log(outBoundDepart, outBoundArrive, outBoundPrice);
    updateButton();
  });

  function updateButton() {
    console.log("update button");
    if (outBoundSelected && !returnSelected && !oneWay) {
      $("#bookButton p").text("Choose return flight");
      $("#bookButton").removeClass("buttonActive");
    } else if (!outBoundSelected && returnSelected && !oneWay) {
      $("#bookButton p").text("Choose outbound flight");
      $("#bookButton").removeClass("buttonActive");
    } else if (outBoundSelected && oneWay) {
      $("#bookButton p").text("Book flight");
      $("#bookButton").addClass("buttonActive");
    } else if (outBoundSelected && returnSelected && !oneWay) {
      $("#bookButton p").text("Book flights");
      $("#bookButton").addClass("buttonActive");
    }
  }

  $("#bookButton").on("click", function(){
    if ((outBoundSelected && returnSelected && !oneWay) || (outBoundSelected && oneWay)) {
      $("#book").removeClass("bookHidden");
      $(this).addClass("resultsHidden");
      $("#flight-results").addClass("resultsHidden");
    }
  });

  // dates

  var $datepicker = $("#dates .input-daterange");
  var $datepickerStart = $("#dates .input-daterange .dateStart");
  var $datepickerEnd = $("#dates .input-daterange .dateEnd");
  $datepicker.datepicker({
    autoclose: true,
    todayHighlight: true
  });
  $datepickerStart.on("changeDate", function() {
    dates.startDate.day = $datepickerStart.datepicker('getFormattedDate').split("/")[1];
    dates.startDate.month = $datepickerStart.datepicker('getFormattedDate').split("/")[0];
    dates.startDate.year = $datepickerStart.datepicker('getFormattedDate').split("/")[2];
    dates.endDate.day = $datepickerStart.datepicker('getFormattedDate').split("/")[1];
    dates.endDate.month = $datepickerStart.datepicker('getFormattedDate').split("/")[0];
    dates.endDate.year = $datepickerStart.datepicker('getFormattedDate').split("/")[2];
    $("#booking-dateStart").html(dates.startDate.day);
    dateTab();
  });
  $datepickerEnd.on("changeDate", function() {
    dates.endDate.day = $datepickerEnd.datepicker('getFormattedDate').split("/")[1];
    dates.endDate.month = $datepickerEnd.datepicker('getFormattedDate').split("/")[0];
    dates.endDate.year = $datepickerEnd.datepicker('getFormattedDate').split("/")[2];
    $("#booking-dateEnd").html(dates.endDate.day);
    dateTab();
  });

  // Return vs Oneway
  $("input[name=optradio]:radio").change(function () {
    if (oneWay) {
      oneWay = false;
      $(".dateEnd").prop('disabled', false);
    } else {
      oneWay = true;
      $(".dateEnd").prop('disabled', true);
    }
    dateTab();
  });

  // Budget

  var changeValue = function() {
    $("#budgetvalue").text(value.getValue());
  };

  var value = $('#budget-slider').slider().on('slide',changeValue).data('slider');

});

function dateTab() {
  if (oneWay) {
    $("#datesTab").html(dates.startDate.day + "." + dates.startDate.month);
  } else {
    if (dates.startDate.month ==
      dates.endDate.month) {
      $("#datesTab").html(dates.startDate.day + "-" + dates.endDate.day + "." + dates.endDate.month);
    } else {
      $("#datesTab").html(dates.startDate.day + "." + dates.startDate.month + "-" + dates.endDate.day + "." + dates.endDate.month);
    }
  }
}

// Google Maps

var geocoder;

//Get the latitude and the longitude;
function successFunction(position) {
    $("#spinner").removeClass("visible-inline");
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng)
}

function errorFunction(){
    alert("Geocoder failed");
}

function getLocation() {
  $("#spinner").addClass("visible-inline");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }

  geocoder = new google.maps.Geocoder();
}

function codeLatLng(lat, lng) {

  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    // console.log(results)
      if (results[1]) {
       //formatted address
      //  alert(results[0].formatted_address)
      //find country name
           for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  city= results[0].address_components[i];
                  break;
              }
          }
      }
      //city data
      // alert(city.short_name + " " + city.long_name)
      console.log(city.short_name);
      $("#typeahead-from").val(city.short_name);

      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });
}
