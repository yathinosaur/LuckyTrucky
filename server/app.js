var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var fml_data = {
    "nirosh": {
        "username": "nirosh",
        //"password": "nirosh1",
        "items": {
            "cargo1" : {
                "name": "cargo1",
                "lat": "47.8813",
                "long": "43.5513",
                "onTrack": true
            },
            "cargo2" : {
                "name": "cargo2",
                "lat": "45.3332",
                "long": "39.4444",
                "onTrack": true
            }
        }
    }
}

app.post('/newUser', function(req, res) {
    fml_data[req.body.username] = {
        "username": req.body.username,
        //"password": req.body.password,
        "items": {}
    }
    for(var cargo in req.body.items){
        fml_data[req.body.username].items[cargo] = {
            "name": cargo,
            "lat": req.body.items[cargo].lat,
            "long": req.body.items[cargo].long,
            "onTrack": true
        }
    }
    res.end(JSON.stringify(fml_data[req.body.username]))
})

app.get('/:id/listCargo', function(req, res) {
    var output= {};
    for (var cargo in fml_data[req.params.id].items){
        output[cargo]= {
            "name": cargo
        }
    }
    res.end(JSON.stringify(output));
})

app.get('/:id/:item', function(req, res) {
    res.end(JSON.stringify({"lat": fml_data[req.params.id].items[req.params.item].lat, "long": fml_data[req.params.id].items[req.params.item].long}));
})


var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})