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
        },
        "spots": {
            "cargo1": [
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [43.0000],
                    "long": [43.0000],
                    "move": false
                }
            ],
            "cargo2": [
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                },
                {
                    "lat": [],
                    "long": [],
                    "move": false
                }
            ]
        }
    }
}

function checkPath (date, user, cargo, lat, long) {
    var safe = false;
    for(var coord = 0; coord < fml_data[user].spots[cargo][date].lat.length; coord++){
        var lat1 = fml_data[user].spots[cargo][date].lat[coord];
        var long1 = fml_data[user].spots[cargo][date].long[coord];
        var dist = Math.sqrt((lat - lat1)*(lat - lat1) + (long - long1)*(long - long1));
        if (dist < 0.002){
            safe = true;
        }
        console.log(dist);
    }
    return safe;
}

app.post('/newUser', function(req, res) {
    fml_data[req.body.username] = {
        "username": req.body.username,
        //"password": req.body.password,
        "items": {},
        "spots": {}
    }
    for(var cargo in req.body.items){
        fml_data[req.body.username].items[cargo] = {
            "name": cargo,
            "lat": req.body.items[cargo].lat,
            "long": req.body.items[cargo].long,
            "onTrack": true
        }
        fml_data[req.body.username].spots[cargo] = [
            {
                "lat": [],
                "long": [],
                "move": false
            },
            {
                "lat": [],
                "long": [],
                "move": false
            },
            {
                "lat": [],
                "long": [],
                "move": false
            },
            {
                "lat": [],
                "long": [],
                "move": false
            },
            {
                "lat": [],
                "long": [],
                "move": false
            },
            {
                "lat": [],
                "long": [],
                "move": false
            },
            {
                "lat": [],
                "long": [],
                "move": false
            }
        ]
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

app.post('/:id/makeSpot/:item', function(req, res) {
    fml_data[req.params.id].spots[req.params.item][parseInt(req.body.date)].lat.push(req.body.lat);
    fml_data[req.params.id].spots[req.params.item][parseInt(req.body.date)].long.push(req.body.long);
    res.end(JSON.stringify(fml_data[req.params.id].spots[parseInt(req.body.date)]))
})

app.get('/:id/:item', function(req, res) {
    res.end(JSON.stringify({
        "lat": fml_data[req.params.id].items[req.params.item].lat,
        "long": fml_data[req.params.id].items[req.params.item].long, 
        "onTrack": fml_data[req.params.id].items[req.params.item].onTrack}));
})




app.post('/:id/:item', function(req, res) {
    fml_data[req.params.id].items[req.params.item].lat = req.body.lat;
    fml_data[req.params.id].items[req.params.item].long = req.body.long;
    var d = new Date();
    fml_data[req.params.id].items[req.params.item].onTrack = checkPath(d.getDay(), req.params.id, req.params.item, parseFloat(req.body.lat), parseFloat(req.body.long))
    res.end(JSON.stringify(fml_data[req.params.id].items[req.params.item]));
})


var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})