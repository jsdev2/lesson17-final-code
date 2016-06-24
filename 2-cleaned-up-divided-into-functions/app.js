var token;
var currentUser;

var firebaseAuth;
var firebaseDB;

initFirebase();
login();
setMessageCreationListener();
setMessagesChangeListener();

function initFirebase() {
  var config = {
    apiKey: "AIzaSyApxANaHI176HJK8pA4aQLuOpehfzuh7Cs",
    authDomain: "harrington-test4.firebaseapp.com",
    databaseURL: "https://harrington-test4.firebaseio.com",
    storageBucket: "harrington-test4.appspot.com",
  };

  firebase.initializeApp(config);
  firebaseAuth = firebase.auth();
  firebaseDB = firebase.database();
}

function login() {
  // Set up auth:

  var provider = new firebase.auth.GoogleAuthProvider();

  // Log in
  firebaseAuth.signInWithPopup(provider).then(function(result) {

    // This gives you a Google Access Token. You can use it to 
    // access the Google API (can be useful for stuff like Google Maps).
    token = result.credential.idToken;
    console.log(result);

    // The signed-in user info.
    currentUser = result.user;
    console.log(currentUser);
    // alert("Where were you on the night of June 2, 2014, " + 
    //       currentUser.displayName + "? Come on, 'fess up! We have your picture!");
    // $('body').css('background-image', 'url(' + currentUser.photoURL + ')');

  }).catch(function(error) {
    console.log(error);
  });

  // Logout, if you want to do that inside a click listener
  // when the user clicks a "logout" button:

  // firebaseAuth.signOut().then(function () {
  //    console.log('logged out');
  // }).catch(function (error) {
  //    console.log(error);
  // });
}

function setMessageCreationListener() {
  var messagesInFirebase = firebaseDB.ref('messages');

  $('#message-form').on('submit', function(event) {

    // To prevent the default behavior of the form
    // element, which is refreshing the page:
    event.preventDefault();

    // Get the user's input and clear the textarea.
    var messageText = $('#message').val();
    $('#message').val('');

    // Create a new message object in the database
    messagesInFirebase.push({
      message: messageText,
      votes: 0
    });

  });
}

function setMessagesChangeListener() {
  var messagesInFirebase = firebaseDB.ref('messages');

  messagesInFirebase.on('value', function(results) {

    // Get rid of existing DOM elements
    $('.message-board').empty();

    // Extract readable version of results
    // (or an empty object if there are no results)
    var messages = results.val() || {};

    // Sort weirdIds by the descending vote count 
    // of their corresponding messages
    var unsortedWeirdIds = Object.keys(messages);
    var weirdIds = _.sortBy(unsortedWeirdIds, function(weirdId) {
      return messages[weirdId].votes;
    }).reverse();

    // Render messages in the DOM (including their event listeners)
    weirdIds.forEach(function(weirdId) {
      renderMessage(messages[weirdId], firebaseDB.ref('messages/' + weirdId));
    });
  });
}

function renderMessage(msgObject, msgInFirebase) {
  var message = msgObject.message;
  var votes = msgObject.votes;

  // Make vote count span with upvoting listener
  var $votesSpan = $('<span>').addClass('votes').html(votes);
  $votesSpan.on('click', function() {
    msgInFirebase.update({
      votes: votes + 1
    });
  });

  // Make message li with deletion listener
  var $messageLi = $('<li>').html(message).append($votesSpan);
  $messageLi.on('dblclick', function() {
    msgInFirebase.remove();
  });

  // Add them to the DOM
  $('.message-board').append($messageLi);
}
