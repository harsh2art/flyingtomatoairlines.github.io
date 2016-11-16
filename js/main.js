var destinationCity;
var fromCity = {id: "HKG", name: "Hong Kong HKG"};
var dates = {
  startDate: {
    day: "17",
    month: "11",
    year: "2016"
  },
  endDate : {
    day: "24",
    month: "11",
    year: "2016"
  }
}
var oneWay = false;
var budgetMax;
var outBoundSelected = false;
var returnSelected = false;
var resultsFound = false;

var outBoundDepart, outBoundArrive, outBoundPrice, returnDepart, returnArrive, returnPrice;

$(function(){

  // Set map dimensions
  var viewportHeight = $("body").innerHeight();
  var viewportWidth = $("body").innerWidth();
  if (viewportWidth < 768) {
    $("#map").css({"height" : (viewportHeight-109)*0.8+"px"});
  } else {
    $("#map-area").css({"height" : (viewportHeight-214)*0.95+"px"});
  }

  // Close tab when clicked

  $('#tabs a').click(function (e) {
      var tab = $(this);
      if(tab.parent('li').hasClass('active')){
          window.setTimeout(function(){
              $(".tab-pane").removeClass('active');
              tab.parent('li').removeClass('active');
          },1);
      }
  });

  // Close tab on scroll

  $('body').on({
      'touchmove': function(e) {
        if ($("body").scrollTop() > 50) {
          $("body").addClass("scroll");
        } else {
          $("body").removeClass("scroll");
        }
      }
  });

  // Destination and from

  var $inputDestination = $('#typeahead-destination');
  $inputDestination.typeahead({
    source: [{id: "HKG", name: "Hong Kong HKG"}, {id: "NRT", name: "Tokyo NRT"}, {id: "SIN", name: "Singapore SIN"}]
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
    source: [{id: "HKG", name: "Hong Kong HKG"}, {id: "NRT", name: "Tokyo NRT"}, {id: "SIN", name: "Singapore SIN"}]
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
    if ((destinationCity.id != null && fromCity.id != null) && (destinationCity.id != fromCity.id)) {
      for (var i = 0; i < flights["from"].length; i++) {
        var from = Object.keys(flights["from"][i])[0];
        // Outbound
        if (fromCity.id == from) {
          resultsFound = true;
          $("#info-content").html("");
          var backToExplore = $("<a href='index.html' class='btn btn-default' role='button'><i class='fa fa-chevron-left' aria-hidden='true'></i> Back to explore</a>");
          $("#info-content").append(backToExplore);
          var outboundContainer = $("<div></div>").attr({
            "id" : "outbound"
          });
          var resultsOutboundHeader = $("<h1></h1>").text("Outbound flight");
          outboundContainer.append(resultsOutboundHeader);
          for (var j = 0; j < flights["from"][i][fromCity.id].length; j++) {
            if (destinationCity.id == flights["from"][i][fromCity.id][j].id) {
              var flight = flights["from"][i][fromCity.id][j];
              var container = $("<a></a>").attr({
                "href" : "#",
                "class" : "flightItem",
                "data-from" : fromCity.id,
                "data-destination" : destinationCity.id,
                "data-index" : j
              });
              var title = $("<h2></h2>").text(fromCity.id + " - " + flight.id);
              // var titleDepart = $("<span></span>").attr({"class":"bold"}).text(flight.depart);
              var date = $("<p></p>").text(dates.startDate.month + "/" + dates.startDate.day + "/" + dates.startDate.year);
              var time = $("<p></p>").text(flight.depart + " to " + flight.arrive);
              var price = $("<p></p>").text("$" + flight.price);
              outboundContainer.append(container);
              container.append(title,date,time,price);
              $("#info-content").append(outboundContainer);
              $("#infoButton").removeClass("buttonHidden");
            } else {
              console.log("No flights from this location.")
            }
          }
        }
        // Return
        if (destinationCity.id == from && !oneWay) {
          var returnContainer = $("<div></div>").attr({
            "id" : "return"
          });
          var resultsOutboundHeader = $("<h1></h1>").text("Return flight");
          returnContainer.append(resultsOutboundHeader);
          for (var j = 0; j < flights["from"][i][destinationCity.id].length; j++) {
            if (fromCity.id == flights["from"][i][destinationCity.id][j].id) {
              var flight = flights["from"][i][destinationCity.id][j];
              var container = $("<a></a>").attr({
                "href" : "#",
                "class" : "flightItem",
                "data-from" : fromCity.id,
                "data-destination" : destinationCity.id,
                "data-index" : j
              });
              var title = $("<h2></h2>").text(destinationCity.id + " - " + flight.id);
              var date = $("<p></p>").text(dates.endDate.month + "/" + dates.endDate.day + "/" + dates.endDate.year);
              var time = $("<p></p>").text(flight.depart + " to " + flight.arrive);
              var price = $("<p></p>").text("$" + flight.price);
              returnContainer.append(container);
              container.append(title,date,time,price);
              $("#info-content").append(returnContainer);
              resultsFound = true;
            } else {
              console.log("No flights from this location.")
            }
          }
        }
        // End return
        if (resultsFound) {
          if (fromCity.id == "HKG" && destinationCity.id == "SIN") {
            $("#map").attr({
              "class" : "hkgsin"
            });
          } else if (fromCity.id == "HKG" && destinationCity.id == "NRT") {
            $("#map").attr({
              "class" : "hkgnrt"
            });
          }
        }
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

  $("#info-content").on("click", "#outbound a.flightItem", function(){
    $("#info-content #outbound .flightItem").removeClass("selected");
    $(this).addClass("selected");
    outBoundSelected = true;
    outBoundDepart = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].depart;
    outBoundArrive = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].arrive;
    outBoundPrice = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].price;
    console.log(outBoundDepart, outBoundArrive, outBoundPrice);
    updateButton();
    event.preventDefault();
  });

  // console.log(flights["from"][0][$(".selected").attr("data-from")][0]);
  console.log($(".selected").attr("data-from"));

  $("#info-content").on("click", "#return a.flightItem", function(){
    $("#info-content #return .flightItem").removeClass("selected");
    $(this).addClass("selected");
    returnSelected = true;
    returnDepart = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].depart;
    returnArrive = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].arrive;
    returnPrice = flights["from"][0][$(this).attr("data-from")][$(this).attr("data-index")].price;
    console.log(outBoundDepart, outBoundArrive, outBoundPrice);
    updateButton();
    event.preventDefault();
  });

  function updateButton() {
    console.log("update button");
    if (outBoundSelected && !returnSelected && !oneWay) {
      $("#bookButton").text("Choose return flight");
      $(".bookingTotal").text(parseInt(outBoundPrice));
    } else if (!outBoundSelected && returnSelected && !oneWay) {
      $("#bookButton").text("Choose outbound flight");
      $(".bookingTotal").text(parseInt(returnPrice));
    } else if (outBoundSelected && oneWay) {
      $("#bookButton").text("Book flight");
      $("#bookButton").addClass("activeButton");
      $(".bookingTotal").text(parseInt(outBoundPrice));
    } else if (outBoundSelected && returnSelected && !oneWay) {
      $("#bookButton").text("Book flights");
      $("#bookButton").addClass("activeButton");
      $(".bookingTotal").text(parseInt(outBoundPrice) + parseInt(returnPrice));
    }
  }

  $("#bookButton").on("click", function(){
    if (outBoundSelected && oneWay || outBoundSelected && returnSelected && !oneWay) {
      $("body").removeClass("search");
      $("body").addClass("book");
      $("body").addClass("booking1");
    }
    window.scrollTo(0, 0);
    event.preventDefault();
  });

  $("#detailsButton").on("click", function(){
    $("body").removeClass("booking1");
    $("body").addClass("booking2");
    $("#bookingProgress *").removeClass("active");
    $("#stagePayment").addClass("active");
    event.preventDefault();
  });

  $("#paymentButton").on("click", function(){
    $("body").removeClass("booking2");
    $("body").addClass("booking3");
    $("#bookingProgress *").removeClass("active");
    $("#stageConfirm").addClass("active");
    event.preventDefault();
  });

  // dates

  if (dates.startDate.month == dates.endDate.month) {
    $("#datesTab").html(dates.startDate.day + "-" + dates.endDate.day + "." + dates.endDate.month);
  } else {
    $("#datesTab").html(dates.startDate.day + "." + dates.startDate.month + "-" + dates.endDate.day + "." + dates.endDate.month);
  }


  var $datepicker = $("#dates .input-daterange");
  var $datepickerStart = $("#dates .input-daterange .dateStart");
  var $datepickerEnd = $("#dates .input-daterange .dateEnd");

  $datepickerStart.attr({"value": dates.startDate.month + "/" + dates.startDate.day + "/" + dates.startDate.year});
  $datepickerEnd.attr({"value": dates.endDate.month + "/" + dates.endDate.day + "/" + dates.endDate.year});

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
    updateResults();
  });
  $datepickerEnd.on("changeDate", function() {
    dates.endDate.day = $datepickerEnd.datepicker('getFormattedDate').split("/")[1];
    dates.endDate.month = $datepickerEnd.datepicker('getFormattedDate').split("/")[0];
    dates.endDate.year = $datepickerEnd.datepicker('getFormattedDate').split("/")[2];
    $("#booking-dateEnd").html(dates.endDate.day);
    dateTab();
    updateResults();
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
    updateResults();
  });

  // Budget

  var changeValue = function() {
    var budget = value.getValue();
    if (budget == 2000) {
      budget = "2000+";
    } else if (budget < 1000) {
      $("#map").addClass("under1000");
    } else if (budget >= 1000) {
      $("#map").removeClass("under1000");
    }
    $(".budgetvalue").text(budget);
  };

  var value = $('#budget-slider').slider().on('slide',changeValue).data('slider');

  // Update map

  $("#info-layer a.beaches").on("click", function(){
    $("#map").attr({
      "class" : "explore beaches"
    });
    window.scrollTo(0, 0);
    event.preventDefault();
  });

  $("#info-layer a.cities").on("click", function(){
    $("#map").attr({
      "class" : "explore cities"
    });
    window.scrollTo(0, 0);
    event.preventDefault();
  });

  $("#info-layer a.outdoors").on("click", function(){
    $("#map").attr({
      "class" : "explore outdoors"
    });
    window.scrollTo(0, 0);
    event.preventDefault();
  });

  $("#info-layer a.adventure").on("click", function(){
    $("#map").attr({
      "class" : "explore adventure"
    });
    window.scrollTo(0, 0);
    event.preventDefault();
  });

  $("#map.explore").on("click", function(){
    destinationCity = {id: "SIN", name: "Singapore (SIN)"};
    $inputDestination.attr({"value" : "Singapore (SIN)"});
    updateResults();
    window.scrollTo(0, 0);
    event.preventDefault();
  });

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
