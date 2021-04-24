$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
    var highscores = [['2021/02/17', '2:21'], ['2021/01/11', '3:10'], ['2021/02/01', '5:10']];
    function createScoreTable(){
        // function creates table based on the values in highscore array
        var scoreTable = document.createElement('table');
        var tableHead = document.createElement('thead');
        var tableBody = document.createElement('tbody');
        $(scoreTable).attr('id', 'scores-table');
        $(scoreTable).attr('class', 'table')
        scoreTable.appendChild(tableHead);
        scoreTable.appendChild(tableBody);
        var row = tableHead.insertRow(0);
        var cellDate = row.insertCell(0);
        var cellDuration = row.insertCell(1);
        cellDate.innerHTML = '<b>Date</b>';
        cellDuration.innerHTML = '<b>Duration</b>';
        for (let i = 0; i < highscores.length; i++){
            var row = tableBody.insertRow(i);
            for (let j = 0; j < 2; j++){
                var cell = row.insertCell(j);
                row.appendChild(cell);
                console.log(highscores[i][j])
                cell.innerText = highscores[i][j];
            }
        }
        return scoreTable;
    }
    document.getElementById('content-body-score').appendChild(createScoreTable());

});
  