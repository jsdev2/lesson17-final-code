var token;
var currentUser;

// Our main state variable -- structured the same
// way as the messages object that gets returned
// from calls to the Firebase db
var messages = {};

var firebaseAuth;
var firebaseDB;

initFirebase();
login();
setMessageCreationListener();
setMessagesChangeListener();
setUpvotingListener();
setDeletionListener();

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
    messages = results.val() || {};

    // Sort weirdIds by the descending vote count 
    // of their corresponding messages
    var unsortedWeirdIds = Object.keys(messages);
    var weirdIds = _.sortBy(unsortedWeirdIds, function(weirdId) {
      return messages[weirdId].votes;
    }).reverse();

    // Render messages in the DOM
    weirdIds.forEach(renderMessage);
  });
}

function renderMessage(weirdId) {
  var message = messages[weirdId].message
  var votes = messages[weirdId].votes;

  // Make votes span and message li
  var $votesSpan = $('<span>').addClass('votes').html(votes);
  var $messageLi = $('<li>').html(message).append($votesSpan);

  // Store the right weirdId on the li element itself
  $messageLi.attr('data-weird-id', weirdId);

  // Add them to the DOM
  $('.message-board').append($messageLi);
}

// Delegated listener on all "votes spans"
function setUpvotingListener() {
  $('.message-board').on('click', 'span.votes', function(event) {
    var weirdId = $(this).parent().attr('data-weird-id');
    var votes = messages[weirdId].votes;
    var msgInFirebase = firebaseDB.ref('messages/' + weirdId);
    msgInFirebase.update({
      votes: votes + 1
    });
  });
}

// Delegated listener on all message lis
function setDeletionListener() {
  $('.message-board').on('dblclick', 'li', function(event) {
    var weirdId = $(this).attr('data-weird-id');
    var msgInFirebase = firebaseDB.ref('messages/' + weirdId);
    msgInFirebase.remove();
  });
}

