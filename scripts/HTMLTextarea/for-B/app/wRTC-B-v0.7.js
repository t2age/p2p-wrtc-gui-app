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

var Peer = require('./simplepeer.min.js')		// file is in current folder
var WebSocket = require('ws')		// needed inside node_modules

//const WEBSOCKET_ADDRESS = "localhost";        // all on the same machine, this is also the "ws-server.js"
const WEBSOCKET_ADDRESS = "127.0.0.1";				// all on same machine, this is also the "ws-server.js"
//const WEBSOCKET_ADDRESS = "192.168.200.200";      // use 2 machines, IP of the "ws-server.js"

var serverConn2;
serverConn2 = new WebSocket('ws://' + WEBSOCKET_ADDRESS + ':9000');
serverConn2.onmessage = gotMessageFromServer2;

var peer2
peer2 = new Peer({ initiator: false, trickle: false })

function gotMessageFromServer2(message) {
  var signal = JSON.parse(message.data);
  myConsoleHTML('--> Received From Server:');
  myConsoleHTML(JSON.stringify(signal.msg));
  myConsoleHTML('');
  peer2.signal(signal.msg);
}

peer2.on('signal', data => {
  try {
    serverConn2.send( JSON.stringify({'msg': data}) )
  } catch (err) {
    myConsoleHTML(err)  
  }
})

peer2.on('connect', () => {
  setTimeout( function() {
  myConsoleHTML('----------');
  myConsoleHTML('----------');
  }, 3000);
})

peer2.on('data', data => {
  myConsoleHTML('Received message from Peer1: ' + data)
  peer2.send('Hello Peer1, how are you?')
  setTimeout( function () {
    peer2.send('closeItPlease#')
  }, 8000)
})

peer2.on('close', () => {
	myConsoleHTML('')
	myConsoleHTML('Connection with Peer1 is closed...');
  serverConn2.close();
  myConsoleHTML('----------');
  myConsoleHTML('----------'); 
})

function myConsoleHTML(textMsg) {
	document.getElementById("display").value = document.getElementById("display").value + textMsg + "\n";
}
