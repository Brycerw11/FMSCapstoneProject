// Wait until jQuery is ready
$(document).ready(function(){
    // Start with the navbar hidden
    let navBarWidth = $("#nav-bar-contents").outerWidth();
    $("#nav-bar-contents").css("left", "-" + numToPxStr(navBarWidth));

    // Wait 100ms then reupdate the position of the navbar
    setTimeout(() => {
        navBarWidth = $("#nav-bar-contents").outerWidth();
        $("#nav-bar-contents").css("left", "-" + numToPxStr(navBarWidth));
    }, 100);

    $("#nav-bar-show-button").on("click", function(){
        navBarWidth = $("#nav-bar-contents").outerWidth();
        console.log(navBarWidth);

        if( $("#nav-bar-contents").css("left") != "0px" ){
            // Open the nav bar
            $("#nav-bar-contents").animate({left: numToPxStr(0)});
            $("#nav-bar-show-button").animate({left: numToPxStr(navBarWidth - 40)});
            $("#nav-bar-show-button").text("<");
        }
        else{
            // Close the nav bar
            $("#nav-bar-contents").animate({left: "-" + numToPxStr(navBarWidth)});
            $("#nav-bar-show-button").animate({left: numToPxStr(-40)});
            $("#nav-bar-show-button").text(">");
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