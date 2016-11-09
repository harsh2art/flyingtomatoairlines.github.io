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

$(function(){

  // Destination and from

  var $inputDestination = $('#typeahead-destination');
  $inputDestination.typeahead({
    source: [{id: "HKG", name: "Hong Kong HKG"}, {id: "NRT", name: "Tokyo NRT"}, {id: "HND", name: "Tokyo HND"}]
  });

  $inputDestination.change(function() {
    var current = $inputDestination.typeahead("getActive");
    destinationCity = current.id;
    $("#booking-destination").html(destinationCity);
    $("#destinationTab").html(destinationCity);
    showResults();
  });

  var $inputFrom = $('#typeahead-from');
  $inputFrom.typeahead({
    source: [{id: "HKG", name: "Hong Kong HKG"}, {id: "NRT", name: "Tokyo NRT"}, {id: "HND", name: "Tokyo HND"}]
  });

  $inputFrom.change(function() {
    var current = $inputFrom.typeahead("getActive");
    fromCity = current.id;
    $("#booking-from").html(fromCity);
    $("#fromTab").html(fromCity);
    showResults();
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

function showResults() {
  console.log(destinationCity);
  console.log(fromCity);
  if ((destinationCity != "" && fromCity != "") && (destinationCity != fromCity)) {
    $("#flight-results p").html("showing results");
  } else {
    $("#flight-results p").html("No results to show");
  }
}

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
