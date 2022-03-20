//validation for number entry
$(document).ready(function() {

  let url = '/partnerentry/' + sessionStorage.getItem("storeNum");
  console.log(url);
  $("#moneyForm").attr('action', url);

  let entries = document.querySelectorAll('.moneyEntry')
  console.log(entries);

  Array.from(entries).forEach(entry => {
    entry.addEventListener('blur', event => {
      if (!entry.checkValidity()) {
        entry.classList.remove('is-valid');
        entry.classList.add('is-invalid');
      } else {
        entry.classList.remove('is-invalid');
        entry.classList.add('is-valid');
        entry.classList.add('was-validated');
      }
    }, false);
  });
});


//calculate total money and store quantities to session storage for later calculation
function calcMoney() {
  let tips = {};
  let ones = parseInt($("#dollarInput").val(), 10);
  tips.ones = ones;
  let fives = parseInt($("#fiveInput").val(), 10);
  tips.fives = fives;
  let tens = parseInt($("#tenInput").val(), 10);
  tips.tens = tens;
  let twenties = parseInt($("#twentyInput").val(), 10);
  tips.twenties = twenties;
  let fifties = parseInt($("#fiftyInput").val(), 10);
  tips.fifties = fifties;
  let hundreds = parseInt($("#hundredInput").val(), 10);
  tips.hundreds = hundreds;
  let quarters = parseInt($("#quarterInput").val(), 10);
  tips.quarters = quarters;
  let dimes = parseInt($("#dimeInput").val(), 10);
  tips.dimes = dimes;
  let nickels = parseInt($("#nickelInput").val(), 10);
  tips.nickels = nickels;

  console.log(tips);

  let total = ones + (fives * 5) + (tens * 10) + (twenties * 20) + (fifties * 50) + (hundreds * 100) + (quarters * 10) + (dimes * 5) + (nickels * 2);

  sessionStorage.setItem("moneyTotal", total);
  sessionStorage.setItem("tips", JSON.stringify(tips));
  $('#moneyOutput').val(`${total}`);
  if (total > 0) {
    $('#submitMoneyButton').prop('disabled', false);
  }
}
