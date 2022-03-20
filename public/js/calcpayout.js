"use strict"
$(document).ready(function() {
  let url = '/deletepartner/' + sessionStorage.getItem("storeNum");
  $("#deleteButton").attr('href', url);

  let totalMoney = sessionStorage.getItem("moneyTotal");
  $("#moneyDisplay").text(`$${totalMoney}`);

  let partnerList = JSON.parse($("#partnerListEJS").text());
  let borrowedPartnerList = JSON.parse(sessionStorage.getItem("borrowedPartnerList"));
  if (borrowedPartnerList !== null) {
    console.log("merging and sorting");
    let newList = partnerList.concat(borrowedPartnerList);
    console.log(newList);
    newList.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
    console.log(newList);
    populateTable(newList);
  } else {
    populateTable(partnerList);
  }
});

function populateTable(partnerList) {
  for (var i = 0; i < partnerList.length; i++) {
    addRow(i, partnerList[i]);
  }
}

function addRow(index, partner) {
  let table = document.getElementById('hoursEntryTable');

  let row = table.insertRow(index);
  let cell = row.insertCell(0);
  cell.innerHTML = `<div class="row pt-3 entry-row">
    <div class="col">
      <h4 class="nameHeading">${partner.lastName}, ${partner.firstName}</h4>
    </div>
    <div class="col pb-3">
      <input class="hoursInput" type="text" placeholder="Enter Hours" onchange="sumHours()">
    </div>
  </div>`
}

//Sums total hours and recalculates the dollar per hour value
function sumHours() {
  let totalHours = 0;
  let inputs = $(".hoursInput");
  let totalMoney = sessionStorage.getItem("moneyTotal");

  Array.from(inputs).forEach((input) => {
    let value = parseFloat(input.value);

    if (isNaN(value)) {
      value = 0;
    }

    totalHours += value;
    let dph = totalMoney / totalHours;
    dph = Math.round((dph + Number.EPSILON) * 100) / 100;
    totalHours = Math.round((totalHours + Number.EPSILON) * 100) / 100;

    sessionStorage.setItem("totalHours", totalHours);
    sessionStorage.setItem("dph", dph);

    $("#dollarPerHourDisplay").text(`$${dph}/hr`)
    $("#hoursDisplay").text(`${totalHours} hours`);

  });

}

/**
 *Iterates through all the rows, matching names to number of hours entered
 *Posts data to server for calculation.
 */
function postData() {
  //get names
  let names = $(".nameHeading");
  let namesArray = [];
  Array.from(names).forEach((name) => {
    namesArray.push(name.textContent);
  });

  //get corresponding hours
  let hours = $(".hoursInput");
  let hoursArray = [];
  Array.from(hours).forEach((hour) => {
    let value = parseFloat(hour.value);

    if (isNaN(value)) {
      value = 0;
    } else {
      value = Math.round((value + Number.EPSILON) * 100) / 100;
    }

    hoursArray.push(value);
  });

  //create array of objects, each object represents a partner and their payouts
  let partners = [];
  for (var i = 0; i < namesArray.length; i++) {
    let partner = {
      name: namesArray[i],
      hours: hoursArray[i],
      index: i,
      payout: 0,
      hundreds: 0,
      fiftys: 0,
      twenties: 0,
      tens: 0,
      fives: 0,
      ones: 0,
      quarters: 0,
      dimes: 0,
      nickels: 0
    }
    partners.push(partner);
  }

  //AJAX call to post data to server for calculation
  $.post("https://sbuxtipcalculator.herokuapp.com/calculate", {
    'partners': JSON.stringify(partners),
    'dph': sessionStorage.getItem("dph"),
    'tips': sessionStorage.getItem("tips"),
    'moneyTotal': sessionStorage.getItem("moneyTotal")
  }).done(response=>{
    console.log("Ajax request done");
    console.log(response);
    sessionStorage.setItem("finalPartnerList", JSON.stringify(response.partners));
    sessionStorage.setItem("roundingError", response.roundingError);
    document.getElementById("hiddenLink").click();
    //$("#roundingInput").val(response.roundingError);
    //$("#partnerInput").val(JSON.parse(response.partners));
  });
}
