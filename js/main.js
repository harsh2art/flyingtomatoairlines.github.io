$(function(){

  var navOpen = false;

  $('#navLink').click(function () {
    if (navOpen) {
      $("body").removeClass("navOpen");
      $("body").addClass("navClosed");
      navOpen = false;
    } else {
      $("body").removeClass("navClosed");
      $("body").addClass("navOpen");
      navOpen = true;
    }
  });

});
