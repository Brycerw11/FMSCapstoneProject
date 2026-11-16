// Wait for jQuery to be ready
$(function (){

    // #region Load Shape Drawing (e1) Metrics

    // #endregion
    
    // #region Load Cooking (e2) Metrics

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
        $(".e4-high-score-value").text(`${bestRoundProg}% of Round ${bestRound}`);
        $(".e4-avg-score-value").text(`${(sumScore / e4GameList.length).toFixed(2)}`);
	}
    // #endregion


    // Function to reset metric after pressing reset metrics button
    $("#reset-metrics-button").on("click", function(){
        if(confirm("Are you sure that you want to clear your metrics. This action cannot be undone!")){
            let storedSettings = localStorage.getItem("settings");
            localStorage.clear();
            localStorage.setItem("settings", storedSettings);

            window.location.reload();
        }
    });
});