var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// var fml_data = {
//     "nirosh": {
//         "username": "nirosh",
//         //"password": "nirosh1",
//         "items": {
//             "cargo1" : {
//                 "name": "cargo1",
//                 "lat": "47.8813",
//                 "long": "43.5513",
//                 "onTrack": true
//             },
//             "cargo2" : {
//                 "name": "cargo2",
//                 "lat": "45.3332",
//                 "long": "39.4444",
//                 "onTrack": true
//             }
//         },
//         "spots": {
//             "cargo1": [
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [43.0000],
//                     "long": [43.0000],
//                     "move": false
//                 }
//             ],
//             "cargo2": [
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 },
//                 {
//                     "lat": [],
//                     "long": [],
//                     "move": false
//                 }
//             ]
//         }
//     }
// }

var fml_data = {

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

function checkGood(device, time){
    var safe = true;
    // var times = fml_data[device].times.sort();
    // var median = Math.round(times.length / 2);
    // console.log(time);
    // console.log(times[median]);
    // if(Math.abs(time - times[median]) > 3)
    //     safe = false;
    if(fml_data[device].start - time > 2)
        safe = false;
    if(fml_data[device].end > 24 && time < 12)
        time+=12;
    if(time - fml_data[device].end > 2)
        safe = false;
    fml_data[device].onTrack = safe;
}

app.post('/newDevice', function(req, res) {
    fml_data[req.body.device] = {
            "name": req.body.device,
            times: [parseFloat(req.body.time)],
            start: parseFloat(req.body.start),
            end: parseFloat(req.body.end),
            times: [],
            onTrack: true,
            lat: req.body.lat,
            long: req.body.long
        }
    if(fml_data[req.body.device].end < fml_data[req.body.device].start)
        fml_data[req.body.device].end += 24;
    res.end(JSON.stringify(fml_data))
})

app.get('/check', function(req, res) {
    res.end(JSON.stringify(fml_data))
})

app.post('/check/:device', function(req, res) {
    console.log(fml_data[req.params.device].times)
    if(req.body.type != "NoMove" && req.body.type != "NoMoveTimeout"){
        checkGood(req.params.device, req.body.time);
        fml_data[req.params.device].times.push(parseFloat(req.body.time));
        fml_data[req.params.device].lat = req.body.lat;
        fml_data[req.params.device].long = req.body.long;
    }
    res.end(JSON.stringify(fml_data[req.params.device]))
})


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

app.get('/safe', function(req, res){
    res.end("CONNECTED");
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