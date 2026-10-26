// Wait until jQuery is ready
$(document).ready(function(){
    // Set the height of the nav bar show / hide button
    if(document.getElementsByTagName("header").length != 0){
        $("#nav-bar-show-button").css("top", (document.getElementsByTagName("header")[0].clientHeight + 16) + "px");
    }

    // Start with the navbar hidden
    let navBarWidth = $("#nav-bar-contents").outerWidth();
    let navBarVisible = false;

    $("#nav-bar-contents").css("left", "-" + numToPxStr(navBarWidth));

    // Wait 100ms then reupdate the position of the navbar
    setTimeout(() => {
        navBarWidth = $("#nav-bar-contents").outerWidth();
        $("#nav-bar-contents").css("left", "-" + numToPxStr(navBarWidth));
    }, 100);

    // Update navBarWidth when the window changes size
    window.addEventListener("resize", () => {
        navBarWidth = $("#nav-bar-contents").outerWidth();
        if(!navBarVisible){
            // Keep the navbar off screen
            $("#nav-bar-contents").css("left", "-" + numToPxStr(navBarWidth));
        }
        else{
            // Make sure that the navbar show/hide button moves with the navbar
            $("#nav-bar-show-button").css("left", numToPxStr(navBarWidth - 40));
        }
    });

    // Open / close the nav bar when the show/hide nav bar button is pressed
    $("#nav-bar-show-button").on("click", function(){
        navBarWidth = $("#nav-bar-contents").outerWidth();

        if( !navBarVisible ){
            // Open the nav bar
            $("#nav-bar-contents").animate({left: numToPxStr(0)});
            $("#nav-bar-show-button").animate({left: numToPxStr(navBarWidth - 40)});
            $("#nav-bar-show-button").text("<");
            navBarVisible = true;
        }
        else{
            // Close the nav bar
            $("#nav-bar-contents").animate({left: "-" + numToPxStr(navBarWidth)});
            $("#nav-bar-show-button").animate({left: numToPxStr(-40)});
            $("#nav-bar-show-button").text(">");
            navBarVisible = false;
        }
    });
});


// Functions for converting between numbers and strings in terms of pixels
function pxStrToNum(pxString){
    if(typeof pxString != "string"){
        return 0;
    }

    let pxNum = Number(pxString.slice(0, pxString.length -2));
    
    if(isNaN(pxNum)){
        return 0;
    }
    else{
        return pxNum;
    }
}

function numToPxStr(num){
    if(typeof num != "number"){
        return "0px";
    }

    return num + "px";
}