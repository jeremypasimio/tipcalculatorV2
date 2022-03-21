'use strict'

/**
 * Disburse various cash/coin denominations based on payout value.
 * @param {The sorted list of payouts with their correspnding row indices} payList
 */
module.exports.disburse = function (payList, tips) {

    payList = payList.sort(compareByPayout);

    //Number of partners is equal to payList.length
    var partnerOver5 = 0;
    var partnerOver10 = 0; //only partners with a payout over $10 get coin rolls
    var partnerOver20 = 0;

    for (var i = 0; i < payList.length; i++) {
        if (payList[i].payout >= 10) {
            partnerOver10 += 1;
        }

        if (payList[i].payout > 20) {
            partnerOver20 += 1;
        }

        if (payList[i].payout > 5) {
            partnerOver5 += 1;
        }
    }

    //get quantity of each denomination
    var hundreds = tips.hundreds;
    var fifties = tips.fifties;
    var twenties = tips.twenties;
    var tens = tips.tens;
    var fives = tips.fives;
    var quarters = tips.quarters;
    var dimes = tips.dimes;
    var nickels = tips.nickels;

    /**
     * for each denomination, calculate the base number of each unit
     * that each partner will receive using qtyOfDenomination/numPartners.
     * This base number is how far through the paylist to iterate.  To
     * calculate how many partners will receive the base amount +1, use
     * qtyOfDenomiation mod numPartners.  This is how far to to iterate through
     * the payList for baseQty+1.
     *  */

    var numCoins = quarters + dimes + nickels;

    var baseCoin = Math.floor(numCoins / partnerOver10);
    var basePlusOne = numCoins % partnerOver10;

    var base20s = Math.floor(twenties / partnerOver20);
    var base20PlusOne = twenties % partnerOver20;

    var base10s = Math.floor(tens / partnerOver10);
    var base10PlusOne = tens % partnerOver10;

    var base5s = Math.floor(fives / partnerOver5);
    var base5PlusOne = fives % partnerOver5;

    for (var i = 0; i < payList.length; i++) {
        var currentPayout = payList[i].payout;
        const initPayout = currentPayout;

        //hundreds
        if (hundreds > 0) {
            if (currentPayout - 100 >= 0) {
                currentPayout -= 100;
                hundreds -= 1;
                payList[i].hundreds += 1;
            }
        }

        //fifties
        if (fifties > 0) {
            if (currentPayout - 50 >= 0) {
                currentPayout -= 50;
                fifties -= 1;
                payList[i].fiftys += 1;
            }
        }

        //twenties
        if (twenties > 0) {
            if (twenties >= base20s) {
                if (currentPayout - (20 * base20s) >= 0) {
                    currentPayout -= (20 * base20s);
                    twenties -= base20s;
                    if (i < base20PlusOne && base20PlusOne > 0 && currentPayout - 20 >= 0) {
                        currentPayout -= 20;
                        twenties -= 1;
                        payList[i].twenties += base20s;
                        payList[i].twenties += 1;
                    } else {
                        payList[i].twenties += base20s;
                    }
                } else {
                    var x = Math.floor(currentPayout / 20);
                    currentPayout -= 20 * x;
                    twenties -= x;
                    payList[i].twenties += x;
                }
            }
        }

        //tens
        if (tens > 0) {
            if (tens >= base10s) {
                if (currentPayout - (10 * base10s) >= 0) {
                    currentPayout -= (10 * base10s);
                    tens -= base10s;
                    if (i < base10PlusOne && base10PlusOne > 0 && currentPayout - 10 >= 0) {
                        currentPayout -= 10;
                        tens -= 1;
                        payList[i].tens += base10s;
                        payList[i].tens += 1;
                    } else {
                        payList[i].tens += base10s;
                    }

                } else {
                    var x = Math.floor(currentPayout / 10);
                    currentPayout -= 10 * x;
                    tens -= x;
                    payList[i].tens += x;
                }
            }
        }

        //fives
        if (fives > 0) {
            if (fives >= base5s) {
                if (currentPayout - (5 * base5s) >= 0) {
                    currentPayout -= (5 * base5s);
                    fives -= base5s;
                    if (i < base5PlusOne && base5PlusOne > 0 && currentPayout - 5 >= 0) {
                        currentPayout -= 5;
                        fives -= 1;
                        payList[i].fives += base5s;
                        payList[i].fives += 1;
                    } else {
                        payList[i].fives += base5s;
                    }

                } else {
                    var x = Math.floor(currentPayout / 5);
                    currentPayout -= 5 * x;
                    fives -= x;
                    payList[i].fives += x;
                }
            }
        }

        //Coins
        if (i < partnerOver10) {
            var q = 0,
                d = 0,
                n = 0;

            for (var j = 0; j < baseCoin; j++) {
                if (initPayout > 20 && quarters > 0 && currentPayout - 10 > 0) {
                    currentPayout -= 10;
                    quarters -= 1;
                    q += 1;
                } else if (dimes > 0 && currentPayout - 5 > 0) {
                    currentPayout -= 5;
                    dimes -= 1;
                    d += 1;
                } else if (nickels > 0 && currentPayout - 2 > 0) {
                    currentPayout -= 2;
                    nickels -= 1;
                    n += 1;
                }
            }

            if (i < basePlusOne) {
                if (quarters > 0 && currentPayout - 10 >= 0) {
                    currentPayout -= 10;
                    quarters -= 1;
                    q += 1;
                } else if (dimes > 0 && currentPayout - 5 > 0) {
                    currentPayout -= 5;
                    dimes -= 1;
                    d += 1;
                } else if (nickels > 0 && currentPayout - 2 > 0) {
                    currentPayout -= 2;
                    nickels -= 1;
                    n += 1;
                }
            }

            if (q > 0) {
              payList[i].quarters += q;
            }

            if (d > 0) {
                payList[i].dimes += d;
            }

            if (n > 0) {
                payList[i].nickels += n;
            }


        }//end coins

        //Ones
        payList[i].ones += currentPayout;
    }//end for

    payList = payList.sort(compareByIndex);

    return payList;
}

/**
 * Iterate through the table and calculate each individual payout by multiplying
 * the dollar per hour (dph) value by the current row hour value.
 *
 * After each calculation, log the payout value and the current row index as an
 * object {"payout": x, "index": i} into an array.  After iterating through the
 * table, sort the array by "payout".
 */
module.exports.calcPayout = function (partners, dph) {

    var roundedTotal = 0;
    var roundError = 0;

    partners.forEach(function(partner){
      partner.payout = Math.round(partner.hours*dph);
    });

    return partners;
}

/**
 * Helper function to sort the array of payout objects.
 * @param {*} a
 * @param {*} b
 */
function compareByPayout(a, b) {
    const varA = a.payout;
    const varB = b.payout;
    var result = 0;

    if (varA > varB) {
        result = -1;
    } else if (varA < varB) {
        result = 1;
    }

    return result;
}

/**
 * Helper function to sort the array of payout objects.
 * @param {*} a
 * @param {*} b
 */
function compareByIndex(a, b) {
    const varA = a.index;
    const varB = b.index;
    var result = 0;

    if (varA > varB) {
        result = 1;
    } else if (varA < varB) {
        result = -1;
    }

    return result;
}
