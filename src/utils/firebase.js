import * as firebase from 'firebase'
let database

export const init = () => {
  var fbConfig = {
    apiKey: "AIzaSyD3W-py1PGLjGVJiHZ3mF0CdMVy9zBLk3I",
    authDomain: "homeinsure-201323.firebaseapp.com",
    databaseURL: "https://homeinsure-201323.firebaseio.com/",
    storageBucket: "gs://homeinsure-201323.appspot.com/"
  }
  firebase.initializeApp(fbConfig);
  database = firebase.database()
}

function hash(str) {
  var hash = 5381,
      i    = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

export function writeClientData(name, username, password) {
  let tx = firebase.database().ref('clients/').push({
      username: username,
      name: name,
      password: hash(password)
  });
}

export function getClientData(clientId) {
  let clientRef = firebase.database().ref('clients/' + clientId);
  clientRef.once('value')
      .then(function (snap) {
          return snap;
      });
}

export function writeHouseData(address, city, state, zip, price, id) {
  let a = firebase.database().ref('houses/').push({
      address: address,
      city: city,
      zip: zip,
      state: state,
      price: price,
      quote: "",
      amountRemaining: price,
      daysRemaining: 30,
      status: 1,
      homeowner_id: id
  });
}

export function removeHouse(id) {
  let a = firebase.database().ref('houses/').child(id).remove()
}

export async function getHouseData() {
  let housesRef = firebase.database().ref('houses/');
  housesRef.on('value', function (snap) {
          return snap.val();
      });
}



//TODO: Function to decrement days remaining and call check_house_fully_expired on each 
