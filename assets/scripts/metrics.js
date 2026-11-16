// Wait for jQuery to be ready
$(function (){

    // Load Shape Balancing (e4) Metrics
    let e4MetricsListObj = JSON.parse(localStorage.getItem("Shape Balancing Metrics"));
    
    if(e4MetricsListObj !== null){
        let e4GameList = e4MetricsListObj.gameList;
        console.log(e4GameList);

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

            console.log(`This round's score: ${bestRound + (game.finalRoundProgress / 100)}`)
            sumScore += game.completedRounds + (game.finalRoundProgress / 100);
        }

        // Display e4 metric values
        $(".e4-high-score-value").text(`${bestRoundProg}% of Round ${bestRound}`);
        $(".e4-avg-score-value").text(`${(sumScore / e4GameList.length).toFixed(2)}`);
	}


});