
var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var firebase = require("firebase");

const https = require("https");

var router = express.Router();
var app = express();

const gm_api_key = "AIzaSyDKxDdzzYAtOJDb-rgiJIRJy-w-Fcr1wOM";


app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/'));
app.use('/api', router);

// app.set('port', process.env.PORT || 8080);
// var listener = app.listen(app.get('port'), function() {
//   console.log( listener.address().port );
// });

app.listen(3000, () => console.log('Server running on port 3000'))

firebase.initializeApp({
  databaseURL: "https://hacktj2018.firebaseio.com",
  service_account: "service.json"
})

var db = firebase.database();
var ref = db.ref("ids");

//Not needed??
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

router.route('/ids')
  .get(function(req,res){
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  });

router.route('/:device_id/route')
  .get(function(req,res){
    ref.child(req.params.device_id).child("route").on("value", function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })
  .post(function(req,res){
    console.log(req.body);
    var usersRef = ref.child(req.params.device_id).child("route");
    usersRef.set({
      start_lat: req.body.start.lat,
      start_long: req.body.start.long,
      end_lat: req.body.end.lat,
      end_long: req.body.end.long
    });
  })
  .put(function(req, res){

  })
  .delete(function(req,res){
    // var usersRef = ref.child(req.params.name);
    // usersRef.set(null);
  });

  router.route('/:device_id/location')
    .get(function(req,res){
      ref.child(req.params.device_id).child("location").on("value", function(snapshot) {
        console.log(snapshot.val());
        res.json(snapshot.val());
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    })
    .post(function(req,res){
      console.log(req.body);
      var usersRef = ref.child(req.params.device_id).child("location");
      if(req.body == {}){
        res.error("no body");
      }
      usersRef.set({
          lat: req.body.lat,
          long: req.body.long
      });
      res.end("Success");
    })
    .put(function(req, res){

    })
    .delete(function(req,res){
      // var usersRef = ref.child(req.params.name);
      // usersRef.set(null);
    });

    router.route('/:device_id/instruction')
      .get(function(req,res){
        ref.child(req.params.device_id).child("location").on("value", function(snapshot) {
          console.log(snapshot.val());
          res.json(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      })
      .post(function(req,res){
        console.log(req.body);
        var usersRef = ref.child(req.params.device_id).child("location");
        usersRef.set({
            lat: req.body.lat,
            long: req.body.long
        });
      })
      .put(function(req, res){

      })
      .delete(function(req,res){
        // var usersRef = ref.child(req.params.name);
        // usersRef.set(null);
      });

  function google_maps_info(origin, destination){
    const url = construct_url(origin, destination);
    https.get(url, response => {
      response.setEncoding("utf8");
      var body = "";
      response.on("data", data => {
        console.log(data)
      });
    });
  }

  function construct_url(origin, destination){
      return "https://maps.googleapis.com/maps/api/directions/json?mode=driving&origin="+origin+"&destination="+destination+"&key="+gm_api_key;
  }
