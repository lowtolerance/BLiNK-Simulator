/* eslint-env Paho */
/* eslint-env io */

var client = new Paho.MQTT.Client('espie.duckdns.org', 1884, 'client_id')
var socket = io('192.168.1.35:5000')

socket.on('example-pong', (data) => {
  console.log(data)
  stringParser(data['BLiNKString'])
})

window.onload = function () {
  var blocks = document.getElementsByTagName('td')
  console.log(blocks.length)
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].addEventListener('click', bindClick(i))
  }
}

function bindClick (i) {
  return function () {
    console.log('you clicked block number ' + i)
  }
}

window.addEventListener('load', function () {
  var button = document.getElementById('hello')

  button.addEventListener('click', function () {
    console.log('ping')
    socket.emit('example-ping', { BLiNKString: '@0#0!@1#1!@2#2!@3#3!@4#4!@5#5!@6#6!@7#7!' })
  })
})

client.onMessageArrived = onMessageArrived

var BLiNK = {
  'active': [],
  'color': '#000',
  'draw': function () {
    var td = document.getElementsByTagName('td')
    for (var i = 0; i < this.active.length; i++) {
      td[this.active[i]].setAttribute('bgcolor', this.color)
    }
    this.active = []
  }
}

var stringParser = function stringParser (b) {
  var i = 0
  while (i < b.length) {
    var c = b.charAt(i)
    if (c === '@') {
      i++
      c = b.charAt(i)
      while (c >= 0 && c <= 7 && i < b.length) {
        BLiNK.active.push(c)
        i++
        c = b.charAt(i)
      }
      i--
    } else if (c === '#') {
      var colors = ['#000', '#F00', '#F53', '#FF3', '#0F0', '#00F', '#63F', '#C3F']
      i++
      BLiNK.color = colors[b.charAt(i)]
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
    } else if (c === '.') {
      // Not implemented yet
    } else if (c === '!') {
      BLiNK.draw()
    }
    i++
  }
}

function onMessageArrived (message) {
  console.log(message.payloadString)
  stringParser(message.payloadString)
}

client.connect({onSuccess: onConnect})

function onConnect () {
  console.log('onConnect')
  client.subscribe('livingRoomTV')
}
