// Wait for jQuery to be ready
$(function (){

    // #region Load Shape Drawing (e1) Metrics

    // #endregion
    
    // #region Load Cooking (e2) Metrics

    // #endregion

    // #region Load Shape Drawing (e1) Metrics
    let e1Games = JSON.parse(localStorage.getItem("exercise1Attempts"));
    
    if(e1Games !== null){
		let sumDraw = 0;
		let sumDrag = 0;
        let bestDraw = 0;
        let bestDrag = 0;

        // Find metrics values
        for(let game of e1Games){
            sumDraw += game.drawAccuracy;
            sumDrag += game.dragAccuracy;
            if (game.drawAccuracy > bestDraw) bestDraw = game.drawAccuracy;
            if (game.dragAccuracy > bestDrag) bestDrag = game.dragAccuracy;
        }

        let averageDraw = sumDraw / e1Games.length;
        let averageDrag = sumDrag / e1Games.length;

        const averageDrawFormatted = Math.round(averageDraw*100*100)/100+"%";
        const averageDragFormatted = Math.round(averageDrag*100*100)/100+"%";
        const bestDrawFormatted = Math.round(bestDraw*100*100)/100+"%";
        const bestDragFormatted = Math.round(bestDrag*100*100)/100+"%";

        // Display e1 metric values
        $(".e1-best-draw-value").text(bestDrawFormatted);
        $(".e1-best-drag-value").text(bestDragFormatted);
        $(".e1-average-draw-value").text(averageDrawFormatted);
        $(".e1-average-drag-value").text(averageDragFormatted);
        $(".e1-completed-rounds-value").text(e1Games.length.toLocaleString()); // adds commas in case someone (somehow) completes thousands of games
	}
    // #endregion

    // #region Load Shape Balancing (e4) Metrics
    let e4MetricsListObj = JSON.parse(localStorage.getItem("Shape Balancing Metrics"));
    
    if(e4MetricsListObj !== null){
        let e4GameList = e4MetricsListObj.gameList;
        // console.log(e4GameList);

		let sumScore = 0;
        let bestRound = e4GameList[0].completedRounds;
        let bestRoundProg = e4GameList[0].finalRoundProgress;

        // Find metrics values
        for(let game of e4GameList){
            if(game.completedRounds > bestRound){
                bestRound = game.completedRounds;
                bestRoundProg = game.finalRoundProgress;
            }
            else if(game.completedRounds == bestRound){
                if(game.finalRoundProgress > bestRoundProg){
                    bestRoundProg = game.finalRoundProgress;
                }
            }

            sumScore += game.completedRounds + (game.finalRoundProgress / 100);
        }

        // Display e4 metric values
        $(".e4-high-score-value").text(`Completed ${(bestRound + bestRoundProg / 100).toFixed(2)} Rounds`);
        $(".e4-avg-score-value").text(`${(sumScore / e4GameList.length).toFixed(2)}`);
	}
    // #endregion


    // Function to reset metric after pressing reset metrics button
    $("#reset-metrics-button").on("click", function(){
        if(confirm("Are you sure that you want to clear your metrics. \nThis action cannot be undone!")){
            // Clear all of localStorage except the settings
            let storedSettings = localStorage.getItem("settings");
            
            localStorage.clear();
            localStorage.setItem("settings", storedSettings);

            // Reload the page to show the metrics were deleted
            window.location.reload();
        }
    });
});