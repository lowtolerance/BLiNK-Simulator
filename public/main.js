var client = new Paho.MQTT.Client("espie.duckdns.org", 1884, "client_id");
var socket = io("ws://192.168.1.135:5000");

socket.on('example-pong', function (data) {
    socket.send("pong");
});

window.addEventListener("load", function() {
    var button = document.getElementById('hello');

    button.addEventListener('click', function() {
        console.log("ping");
        socket.emit("example-ping", { duration: 2 });
    });
});

client.onMessageArrived = onMessageArrived;

var BLiNK = {
    "active": [],
    "color": "#000",
    "draw": function() {
    td = document.getElementsByTagName("td");
    for (var i = 0; i < this.active.length; i++) {
        td[this.active[i]].setAttribute("bgcolor", this.color);
    }
    this.active = [];
    }
}

stringParser = function stringParser(b) {
    var i = 0;
    while (i < b.length) {
        var c = b.charAt(i);
        if (c == '@') {
            i++;
            c = b.charAt(i);
            while (0 <= c && c <= 7 && i < b.length) {
                BLiNK.active.push(c);
                i++;
                c = b.charAt(i);
            }
            i--;
        } else if (c == '#') {
            var colors = ["#000", "#F00", "#F53", "#FF3", "#0F0", "#00F", "#63F", "#C3F"];
            i++;
            BLiNK.color = colors[b.charAt(i)];
            // -------------------
            // | 0 | Black (off) |-------------------
            // | 1 | Dark red    | 8 | Light red    |
            // | 2 | Dark orange | 9 | Light orange |
            // | 3 | Dark yellow | A | Light yellow |
            // | 4 | Dark green  | B | Light green  |
            // | 5 | Dark blue   | C | Light blue   |
            // | 6 | Dark indigo | D | Light indigo |
            // | 7 | Dark violet | E | Light violet |
            // ------------------| F | White        |
            //                   --------------------
        } else if (c == '.') {
            //Not implemented yet
        } else if (c == '!') {
            BLiNK.draw();
        }
        i++;
    }
}

function onMessageArrived(message) {
    console.log(message.payloadString);
    stringParser(message.payloadString);
}


client.connect({onSuccess:onConnect});

function onConnect () {
    console.log("onConnect");
    client.subscribe('livingRoomTV');
}