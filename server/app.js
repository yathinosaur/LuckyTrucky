var express = require('express');
var app = express();
var fs = require("fs");

var location = {
    "nirosh": {
        "lat": "47.881",
        "long": "43.551"
    }
}

app.get('/:id', function(req, res) {
    res.end(JSON.stringify(location[req.params.id]));
})

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})