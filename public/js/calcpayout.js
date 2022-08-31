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
  let table = document.getElementById("entryForm");

  for (var i = 0; i < partnerList.length; i++) {
    let name = partnerList[i].lastName + ', ' + partnerList[i].firstName;

    table.insertAdjacentHTML('beforeend', `<div class="row row-cols-2 justify-content-center">

      <div class="col">
        <h4 class="nameHeading">${name}</h4>
      </div>

      <div class="col">
        <input class="hoursInput" type="text" inputmode="decimal" placeholder="Enter Hours" onchange="sumHours()">
      </div>

    </div>
    <hr>`);
  }
  let dph = sessionStorage.getItem("dph");
  let tips = sessionStorage.getItem("tips");
  console.log("tips: "+ tips);
  let moneyTotal = sessionStorage.getItem("moneyTotal");
  table.insertAdjacentHTML('beforeend', `<input name="tips" type="text" value=${tips} hidden>
    <input name="moneyTotal" type="text" value="${moneyTotal}" hidden>
    <input id="partners" name="partners" type="text" value="" hidden>
    <input id="dph" name="dph" type="text" value="${dph}" hidden>
    <div class="col-4 align-self-center">
    <button class="btn btn-lg btn-success" type="button" onClick="postData()">Calculate Payout</button>
  </div>`)

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
      <input class="hoursInput" type="text" inputmode="decimal" placeholder="Enter Hours" onchange="sumHours()">
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

  let dph = sessionStorage.getItem("dph");
  $("#dph").val(dph);
  $("#partners").val(JSON.stringify(partners));
  console.log($("#partners").val());
  $("#entryForm").submit();
}
