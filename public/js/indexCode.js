"use strict"
//when store is selected, change text of dropdown and enable the start tips button
$(document).ready(function() {
  $(".dropdown-menu li a").click(function() {
    $("#dropdownBtn").text($(this).text());
    $("#startBtn").prop("disabled", false);
  });
});

//logs store number into session storage for later use
function logStoreNum(inputStr) {
  let inputArr = inputStr.split(" ");
  let storeNum = parseInt(inputArr[0]);
  sessionStorage.setItem("storeNum", storeNum);
}
