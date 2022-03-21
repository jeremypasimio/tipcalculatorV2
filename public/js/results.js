'use strict'
$(document).ready(function() {
  let url = '/partnerentry/' + sessionStorage.getItem("storeNum");
  $("#backToHours").attr('href', url);
  $("#hoursDisplay").text(`${sessionStorage.getItem("totalHours")} hours`);
  $("#moneyDisplay").text(`$${sessionStorage.getItem("moneyTotal")}`);
  $("#dollarPerHourDisplay").text(`$${sessionStorage.getItem("dph")}/hr`);

  let roundingError = $("#hiddenRoundingValue").val();
  if (roundingError < 0) {
    $("#roundMsg").text(`Retrieve ${Math.abs(roundingError)} dollar(s) from the tip jar to complete tip funds.`)
  } else if (roundingError > 0) {
    $("#roundMsg").text(`Put ${Math.abs(roundingError)} dollar(s) back into the tip jar for next week.`)
  } else {
    $("#roundMsg").text("You have the correct amount of money.")
  }

  populateResults();

});

function populateResults() {
  let finalPartnerList = JSON.parse($("#hiddenPartnerList").text());
  console.log(finalPartnerList);
  let div = document.getElementById("resultsDiv");

  finalPartnerList.forEach(function(partner) {
    let htmlHead = `<div class="partner">
      <div class="row row-cols-2">
        <div class="col">
          <h4>${partner.name}</h4>
        </div>
        <div class="col">
          <h4>$${partner.payout}</h4>
        </div>
      </div>`;

    let htmlBody = '<div class="row row-cols-3 mt-3">';
    if (partner.hundreds > 0) {
      htmlBody += `<div class="col">
        <h6>Hundreds: ${partner.hundreds}</h6>
      </div>`
    }
    if (partner.fiftys > 0) {
      htmlBody += `<div class="col">
        <h6>Fifties: ${partner.fiftys}</h6>
      </div>`
    }
    if (partner.twenties > 0) {
      htmlBody += `<div class="col">
        <h6>Twenties: ${partner.twenties}</h6>
      </div>`
    }
    if (partner.tens > 0) {
      htmlBody += `<div class="col">
        <h6>Tens: ${partner.tens}</h6>
      </div>`
    }
    if (partner.fives > 0) {
      htmlBody += `<div class="col">
        <h6>Fives: ${partner.fives}</h6>
      </div>`
    }
    if (partner.ones > 0) {
      htmlBody += `<div class="col">
        <h6>Ones: ${partner.ones}</h6>
      </div>`
    }
    if (partner.quarters > 0) {
      htmlBody += `<div class="col">
        <h6>Quarters: ${partner.quarters}</h6>
      </div>`
    }
    if (partner.dimes > 0) {
      htmlBody += `<div class="col">
        <h6>Dimes: ${partner.dimes}</h6>
      </div>`
    }
    if (partner.nickels > 0) {
      htmlBody += `<div class="col">
        <h6>Nickels: ${partner.nickels}</h6>
      </div>`
    }

    let htmlFoot = '</div> </div> <hr class = "mt-3" >';

    let htmlOut = htmlHead + htmlBody + htmlFoot;

    div.insertAdjacentHTML('beforeend', htmlOut);
  })
}
