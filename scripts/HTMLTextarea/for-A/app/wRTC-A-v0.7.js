// Version: v0.7
// Date: 2020/Mar
// Tested with NodeJS: v10.16.3
// Tested in x86 PC Linux, RPI3, Armbian Bionic
//
// Need to install:
//    npm install ws
//
// Need to download SimplePeer JS lib (simplepeer.min.js)
//
//
// How to Use (need 3 terminals shell):
//    1. run: node ws-server.js
//    2. run: ./electron (on Peer B)
//    3. run: ./electron (on Peer A)
//

var Peer = require('./simplepeer.min.js')
var WebSocket = require('ws')

//const WEBSOCKET_ADDRESS = "localhost";        // all on the same machine, this is also the "ws-server.js"
const WEBSOCKET_ADDRESS = "127.0.0.1";				// all on same machine, this is also the "ws-server.js"
//const WEBSOCKET_ADDRESS = "192.168.200.200";      // use 2 machines, IP of the "ws-server.js"

var serverConn1;
serverConn1 = new WebSocket('ws://' + WEBSOCKET_ADDRESS + ':9000');
serverConn1.onmessage = gotMessageFromServer;

var peer1
peer1 = new Peer({ initiator: true, trickle: false })

function gotMessageFromServer(message) {
  var signal = JSON.parse(message.data);
  myConsoleHTML('--> Received From Server:');
  myConsoleHTML(JSON.stringify(signal.msg));  
  myConsoleHTML('');
  peer1.signal(signal.msg);
}

peer1.on('signal', data => {
  try {
    setTimeout(function() {
      serverConn1.send( JSON.stringify({'msg': data}) )
    }, 250);
  } catch (err) {
    myConsoleHTML(err)  
  }
})

peer1.on('connect', () => {
  setTimeout(function() {
    myConsoleHTML('----------');
    myConsoleHTML('----------');
    peer1.send('Hello Peer2!')
  }, 4000);
})

peer1.on('data', data => {
  myConsoleHTML('Received message from Peer2: ' + data)
  if (data == 'closeItPlease#') {
    peer1.destroy()
    serverConn1.close()
  }
})

peer1.on('close', () => {
  myConsoleHTML('')
  myConsoleHTML('Connection with Peer2 is closed...');
  myConsoleHTML('----------');
  myConsoleHTML('----------');  
})

function myConsoleHTML(textMsg) {
	document.getElementById("display").value = document.getElementById("display").value + textMsg + "\n";
}
