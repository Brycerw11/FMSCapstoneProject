/*
    The Javascript that goes with the settings page of the website
*/

// get initial state from local storage
let settingsObj = JSON.parse(localStorage.getItem("settings"));

// Wait for jQuery to be ready
$(function(){
    if(settingsObj === null || settingsObj.audioToggle == undefined || settingsObj.volume == undefined){
        setDefaultSettings();
    }
    
    // Update settings inputs to match inital state
    updateSettingsVisual();

    // Update local storage when settings are updated
    $("#audio-toggle-slider").on("click", () => {
        $("#audio-toggle-slider").toggleClass("slider-on");
        settingsObj.audioToggle = !settingsObj.audioToggle;
        updateLocalStorage();

        $("#volume-range").prop("disabled", !settingsObj.audioToggle);
    });

    $("#volume-range").on("change", function(){
        settingsObj.volume =  $("#volume-range").val();
        updateLocalStorage();
    });

    function updateLocalStorage(){
        let settingsStr = JSON.stringify(settingsObj);
        localStorage.setItem("settings", settingsStr);
    }
});

function setDefaultSettings(){
    settingsObj = {
        "audioToggle": true,
        "volume": 75,
    };
    let settingsStr = JSON.stringify(settingsObj);

    localStorage.setItem("settings", settingsStr);

    updateSettingsVisual();
}

function updateSettingsVisual(){
    $("#volume-range").val(settingsObj.volume);
    $("#volume-range").prop("disabled", !settingsObj.audioToggle);

    if(!settingsObj.audioToggle){
        $("#audio-toggle-slider").removeClass("slider-on");
    }
}