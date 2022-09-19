"use strict"

//server
require('dotenv').config();
const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const algorithm = require(__dirname + "/algorithm.js")

const app = express();
// let port = process.env.PORT;
//
// if(port === null || port === ""){
//   port = 3000;
// }

//${process.env.DB_PASS}

//Mongodb connect
 mongoose.connect(`mongodb+srv://jpadmin:B3r3leo@storedb.z9oc3.mongodb.net/StoreDB?retryWrites=true&w=majority`, {
   useNewUrlParser: true
 });

//Mongodb connect local for local testing
//mongoose.connect("mongodb://localhost:27017/tipCalcDB",{useNewUrlParser:true});

//Mongodb Schema
const storeSchema = new mongoose.Schema({
  storeNum: Number,
  storeName: String,
  partners: {
    type: Array,
    "default": []
  }
});

//Mongodb Model
const Store = mongoose.model("store", storeSchema);

//view engine, using ejs for templating
app.set('view engine', 'ejs');

//access static files
app.use(express.static("public"));

//body-parser setup
app.use(bp.urlencoded({
  extended: true
}));
app.use(bp.json());

//global app variables
//N/A

//app routes
//Home page
app.get("/", (req, res) => {
  //gets store list from DB and send list to page
  //to populate dropdown list
  Store.find(function(err, stores) {
    if (err) {
      console.log(err);
    } else {

      let storeList = [];
      stores.forEach(store => {
        let storeData = `${store.storeNum} - ${store.storeName}`;
        console.log(storeData);
        storeList.push(storeData);
      });

      res.render("index", {
        storeList: storeList
      });
    }
  });
});

//addstore routes
//get
app.get("/addstore", (req, res) => {
  res.render("addstore");
});

//post
app.post("/addstore", (req, res) => {

  let addStoreNum = parseInt(req.body.storeNumber);

  //adds new store to DB
  const store = new Store({
    storeNum: addStoreNum,
    storeName: req.body.storeName,
    partners: []
  });

  store.save();

  res.redirect("/addstore");
});

//moneyEntry routes
//get
app.get("/moneyentry", (req, res) => {
  res.render("moneyentry");
});

//partnerentry routes
//get
app.get("/partnerentry/:storeNum", (req, res) => {

  let storeNum = parseInt(req.params.storeNum);

  //get the partner list and send back to page to render
  Store.findOne({
    storeNum: storeNum
  }, 'partners', function(err, obj) {
    res.render("partnerentry", {
      partnerList: obj.partners
    });
  }).lean();
});

//post
app.post("/partnerentry/:storeNum", (req, res) => {
  let storeNum = parseInt(req.params.storeNum);
  res.redirect("/partnerentry/" + storeNum);
});

//addpartner routes
//get
app.get("/addpartner", (req, res) => {
  res.render("addpartner", {
    borrowedPartner: {}
  });
});

//post
app.post("/addpartner", (req, res) => {

  //If added partner is a borrowed partner,
  //Don't save to DB, just send value back
  //to page to be saved into sessionStorage
  if (req.body.borrowed === "true") {
    console.log("borrowed partner");
    let borrowedPartner = {
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      partnerNumber: req.body.partnerNumber
    }

    res.render("addpartner", {
      borrowedPartner: borrowedPartner
    });

  } else {
    //If added partner is not borrowed, add to store document
    Store.updateOne({
      storeNum: parseInt(req.body.storeNum)
    }, {
      $push: {
        partners: {
          $each: [{
            partnerNumber: parseInt(req.body.partnerNumber),
            lastName: req.body.lastName,
            firstName: req.body.firstName
          }],
          $sort: {
            lastName: 1
          }
        }
      }
    }, function(err, docs) {
      if (err) {
        console.log(err);
      } else {
        if (docs.acknowledged === true && docs.modifiedCount === 1) {
          console.log("Saved Entry");
        }
        res.render("addpartner", {
          borrowedPartner: {}
        });
      }
    });
  }
});

//delete partner routes
//get
app.get("/deletepartner/:storeNum", (req, res) => {
  let storeNum = parseInt(req.params.storeNum);

  //get partner list from db and send to page to render
  Store.findOne({
    storeNum: storeNum
  }, 'partners', function(err, obj) {
    res.render("deletepartner", {
      partnerList: obj.partners
    });
  }).lean();
});

//post
app.post("/deletepartner/:storeNum", (req, res) => {
  //parameter placeholder for items to delete
  let deleteParam = [];

  //Selecting a single partner sends a string
  if (typeof(req.body.checkbox) === 'string') {
    deleteParam.push(parseInt(req.body.checkbox));
  } else if (typeof(req.body.checkbox) === 'object') { //Selecting multiple partners sends an array of strings
    req.body.checkbox.forEach(function(item) {
      deleteParam.push(parseInt(item));
    });
  }

  Store.findOneAndUpdate({
    storeNum: req.params.storeNum
  }, {
    $pull: {
      "partners": {
        "partnerNumber": {
          $in: deleteParam
        }
      }
    }
  }, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/deletepartner/" + req.params.storeNum);
    }
  });
});

//calculate payouts and disbursement
app.post("/calculate", (req, res) => {
  console.log(req.body);

  let paidPartners = algorithm.calcPayout(JSON.parse(req.body.partners), JSON.parse(req.body.dph));

  let disbursedPartners = algorithm.disburse(paidPartners, JSON.parse(req.body.tips));

  console.log(disbursedPartners);

  let roundedTotal = 0;

  disbursedPartners.forEach(function(partner) {
    roundedTotal += partner.payout;
  });

  let roundingError = JSON.parse(req.body.moneyTotal) - roundedTotal;

  console.log("roundedTotal = " + roundedTotal);

  res.render("results",{partners: JSON.stringify(disbursedPartners), roundingError: roundingError});
});

app.get("/results", (req, res)=> {
  res.render("results");
})

//Server listen
app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening");
});
