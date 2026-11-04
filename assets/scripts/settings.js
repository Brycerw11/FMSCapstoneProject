/*
    The Javascript that goes with the settings page of the website
*/

// Wait for jQuery to be ready
$(function(){
    $("#audio-toggle-slider").on("click", () => {
        $("#audio-toggle-slider").toggleClass("slider-on");
    });
});

