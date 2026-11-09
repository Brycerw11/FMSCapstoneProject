/*
    The Javascript that goes with the settings page of the website
*/

// Wait for jQuery to be ready
$(function(){
    // get initial state from local storage
    let settingsObj = JSON.parse(localStorage.getItem("settings"));

    console.log(settingsObj);
    
    if(settingsObj === null || settingsObj.audioToggle == undefined || settingsObj.volume == undefined){
        setDefaultSettings();
    }
    
    // Update settings inputs to match inital state
    $("#volume-range").val(settingsObj.volume);
    $("#volume-range").prop("disabled", !settingsObj.audioToggle);

    if(!settingsObj.audioToggle){
        $("#audio-toggle-slider").removeClass("slider-on");
    }

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
    let settingsStr = JSON.stringify({
        "audioToggle": true,
        "volume": 75,
    });

    localStorage.setItem("settings", settingsStr);
}
