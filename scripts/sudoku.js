$(document).ready(function() {
 
  var cellID;
  var activeTableID;
  var activeHotbarID;
  var activeHotbarValue;

  var errors = 0;

  var immutableCells = [];
  var highlightedRows = [];
  var highlightedCols = [];
  var highlightedBlocks = [];

  var milli = 0;
  var seconds = 0;
  var minutes = 0;
  var onOff = 0;
  var date;

  var timerLabel = document.getElementById("timer");

   // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {
       // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  function startCounting(){
    //function for game timer
    if (milli >250) { milli = 0; if (seconds <60) {seconds +=1} }
    else {milli +=1;}
    if (seconds >59) {seconds = 0; minutes += 1;}
    timerLabel.innerHTML = minutes + ' : ' + seconds;
  }

  function theTimer(){
    //initialize or pause timer
    if (onOff == 0) {
        onOff = 1;
        timer = setInterval(startCounting, 1);
    } else if (onOff == 1) {
        onOff = 0;
        clearInterval(timer);
    }
  }

  function createTable(){
    // create main table
    var tableValue = ['','1','','','','','','9','',
    '','','4','','','','2','','',
    '','','8','','','5','','','',
    '','','','','','','','3','',
    '2','','','','4','','1','','',
    '','','','','','','','','',
    '','','1','8','','','6','','',
    '','3','','','','','','8','',
    '','','6','','','','','','']
  
    var cellCounter = 0;
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    $(table).attr('id', 'table');
    $(table).attr('class', 'table is-bordered');
    table.appendChild(tableBody);
    for (let i = 0; i < 9; i++){
      var row = tableBody.insertRow(i);
      for (let j = 0; j < 9; j++){
        var cell = row.insertCell(j);
        cell.innerHTML = tableValue[cellCounter];

        var id = "t"+ i.toString() + j.toString();
        if (tableValue[cellCounter] != ''){
          $(cell).addClass('immutable');
          immutableCells.push(id);
        }
        $(cell).attr("id",id);
        $(cell).addClass('clearError')
        cellCounter++;
      }
    }
    return table;
  }
  document.getElementById('table-container').appendChild(createTable());
  
  function createHotbar(){
    //create hotbar
    var values = ['1','2','3','4','5','6','7','8','9','<img id="undo" src="images/undo.png">'];
    var cellCounter = 0;
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    $(table).attr('id','hotbar')
    $(table).attr('class','table is-bordered');
    table.appendChild(tableBody);
    var row = table.insertRow(0);
    for (let i = 0; i < 10; i++){
      var cell = row.insertCell(i)
      cell.innerHTML = values[cellCounter];
      $(cell).attr('id','h' + i.toString());
      cellCounter++

    }
    return table;
  }
  document.getElementById('table-container').appendChild(createHotbar());

  $('td').click(function(){
    //checks for mouse clicks on td table cells and differentiates between hotbar cells and table cells. takes care of hotbar selection and user input
    console.log($(this).attr('id'));
    cellID = $(this).attr('id');
    // change input colour on different hotbar cell
    if (activeHotbarID && cellID[0] === 'h'){
      $('#'+activeHotbarID).removeClass($('#'+activeHotbarID).attr('class'));
      $('#'+activeHotbarID).addClass('clearError');
    }

    if (cellID[0] === 'h'){
      if (cellID[1] === '9' && activeTableID){
        undo();
        check();
      }
      activeHotbarID = cellID;
      activeHotbarValue = document.getElementById(activeHotbarID).innerText;
      if (cellID[1] != '9'){
        $('#'+cellID).removeClass($('#'+cellID).attr('class'));
        $('#'+cellID).addClass('userInput');
      }
    } else {

      activeTableID = cellID;
      if (!immutableCells.includes(activeTableID) && activeHotbarID){
        document.getElementById(activeTableID).innerText = activeHotbarValue;
        if (!onOff){
          theTimer();
          date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        }
        CheckWin();
        check();
      }
    }
  });

  function CheckRow(){
    // check the row with respect to user input and validate user input using occurrence array 
    let occurrences = [0,0,0,0,0,0,0,0,0]
    let col = activeTableID[2];
    let result = false;
    for (let row = 0; row < 9; row++){
      let value = document.getElementById('t' + row.toString() + col).innerText;
      occurrences[value-1] += 1;
    }
    for (let x = 0; x < 9; x++){
      if (occurrences[x] > 1){
        result = true;
      }
    }
    return result;
  }

  function CheckCol(){
    // check the column with respect to user input and validate user input using occurrence array
    let occurrences = [0,0,0,0,0,0,0,0,0]
    let row = activeTableID[1];
    let result = false;
    for (let col = 0; col < 9; col++){
      let value = document.getElementById('t' + row + col.toString()).innerText;
      occurrences[value-1] += 1;
    }
    for (let x = 0; x < 9; x++){
      if (occurrences[x] > 1){
        result = true;
      }
    }
    return result;
  }

  function CheckBlock(){
    // check the 3x3 block with respect to user input and validate user input using occurrence array
    let result = false;
    let row = activeTableID[1];
    let col = activeTableID[2];
    let row_offset = Math.floor(row/3)*3;
    let col_offset = Math.floor(col/3)*3;
    let occurrences = [0,0,0,0,0,0,0,0,0];

    for ( let i = 0 + row_offset; i <= 2 + row_offset; i++ ) {
      for ( let j = 0 + col_offset; j <= 2 + col_offset; j++ ) {
        let value = document.getElementById('t' + i.toString() + j.toString()).innerText;
        occurrences[value-1] += 1;
      }
    }
    for (let x = 0; x < 9; x++){
      if (occurrences[x] > 1){
        result = true;
      }
    }
    return result;
  }

  function ChangeColour(direction, colour){
    // takes care of highlighting rows, columns and blocks for conflicts (error)
    let row = activeTableID[1];
    let col = activeTableID[2];
    let ident = activeTableID[0];
    if (direction === 'r'){
      for (let i = 0; i < 9; i++){
        if (colour === '#ffcccb'){
          highlightedRows.push(ident + i.toString() + col);
        }
        if (colour === '' && !highlightedRows.includes(ident + i.toString() + col) && !highlightedCols.includes(ident + i.toString() + col) && !immutableCells.includes(ident + i.toString() + col) && !highlightedBlocks.includes(ident + i.toString() + col)){
          $('#'+ident + i.toString() + col).removeClass($('#'+ident + i.toString() + col).attr('class'));
          $('#'+ident + i.toString() + col).addClass('clearError');
        }
        if (colour === '#ffcccb' && !immutableCells.includes(ident + i.toString() + col)){
          $('#'+ident + i.toString() + col).removeClass($('#'+ident + i.toString() + col).attr('class'));
          $('#'+ident + i.toString() + col).addClass('error');
        }
      }
    } else if (direction === 'c'){
      for (let i = 0; i < 9; i++){

        if (colour === '#ffcccb'){
          highlightedCols.push(ident + row + i.toString());
        }
        if (colour === '' && !highlightedRows.includes(ident + row + i.toString()) && !highlightedCols.includes(ident + row + i.toString()) && !immutableCells.includes(ident + row + i.toString()) && !highlightedBlocks.includes(ident + row + i.toString())){
          $('#'+ident + row + i.toString()).removeClass($('#'+ident + row + i.toString()).attr('class'));
          $('#'+ident + row + i.toString()).addClass('clearError');
        }
        if (colour === '#ffcccb' && !immutableCells.includes(ident + row + i.toString())){
          $('#'+ident + row + i.toString()).removeClass($('#'+ident + row + i.toString()).attr('class'));
          $('#'+ident + row + i.toString()).addClass('error');
        }
      }
    } else {
      let row_offset = Math.floor(row/3)*3;
      let col_offset = Math.floor(col/3)*3;
      for ( let i = 0 + row_offset; i <= 2 + row_offset; i++ ) {
        for ( let j = 0 + col_offset; j <= 2 + col_offset; j++ ) {
          if (colour === '#ffcccb'){
            highlightedBlocks.push(ident + i.toString() + j.toString());
          }
          if (colour === '' && !highlightedRows.includes(ident + i.toString() + j.toString()) && !highlightedCols.includes(ident + i.toString() + j.toString()) && !immutableCells.includes(ident + i.toString() + j.toString())  && !highlightedBlocks.includes(ident + i.toString() + j.toString())){
            $('#'+ident+i.toString()+j.toString()).removeClass($('#'+ident + i.toString() + j.toString()).attr('class'));
            $('#'+ident+i.toString()+j.toString()).addClass('clearError');
          }
          if (colour === '#ffcccb' && !immutableCells.includes(ident + i.toString() + j.toString())){
            $('#'+ident+i.toString()+j.toString()).removeClass($('#'+ident + i.toString() + j.toString()).attr('class'));
            $('#'+ident+i.toString()+j.toString()).addClass('error');
          }
        }
      }
    }
  }

  function undo(){
    // undo latest input
    if (activeTableID && !immutableCells.includes(activeTableID)){
      document.getElementById(activeTableID).innerText = '';
    }
  }

  function check(){
    // function universally checks for errors in rows, columns and blocks.
    let error = false;
    if (CheckRow()){
      ChangeColour('r','#ffcccb');
      $('#'+activeTableID).removeClass($('#'+activeTableID).attr('class'));
      $('#'+activeTableID).addClass('activeError');
      errors += 1;
      error = true;
    } else {
      highlightedRows = [];
      ChangeColour('r','');
      CheckColour();
      if (error){
        errors -= 1;
        error = false;
      }
    }
    if (CheckCol()){
      ChangeColour('c','#ffcccb');
      $('#'+activeTableID).removeClass($('#'+activeTableID).attr('class'));
      $('#'+activeTableID).addClass('activeError');
      errors += 1;
      error = true;
    } else {
      highlightedCols = [];
      ChangeColour('c','');
      CheckColour();
      if (error){
        errors -= 1;
        error = false;
      }
    }
    if (CheckBlock()){
      ChangeColour('b','#ffcccb');
      $('#'+activeTableID).removeClass($('#'+activeTableID).attr('class'));
      $('#'+activeTableID).addClass('activeError');
      errors += 1;
      error = true;
    } else {
      highlightedBlocks = [];
      ChangeColour('b','');
      CheckColour();
      if (error){
        errors -= 1;
        error = false;
      }
    }
  }
  
  function CheckWin(){
    // checks for a win, then stops timer.
    let spaceCounter = 0;
    for (let row = 0; row < 9; row++){
      for (let col = 0; col < 9; col++){
        let value = document.getElementById('t' + row.toString() + col.toString()).innerText;
        if(value === ''){
          spaceCounter += 1;
        }
      }
    }
    if (spaceCounter === 0){
      theTimer();
    }
  }

  function CheckColour(){
    // checks for cell colour
    if (!$('#'+activeTableID).hasClass('error') && !$('#'+activeTableID).hasClass('activeError')){
      $('#'+activeTableID).removeClass($('#'+activeTableID).attr('class'));
      $('#'+activeTableID).addClass('clearError');
    }
  }
});