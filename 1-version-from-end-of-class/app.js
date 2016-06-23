// Initialize Firebase
var config = {
  apiKey: "AIzaSyApxANaHI176HJK8pA4aQLuOpehfzuh7Cs",
  authDomain: "harrington-test4.firebaseapp.com",
  databaseURL: "https://harrington-test4.firebaseio.com",
  storageBucket: "harrington-test4.appspot.com",
};

firebase.initializeApp(config);


// Set up auth:

var firebaseAuth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();

var token;
var currentUser;

// Log in
firebaseAuth.signInWithPopup(provider).then(function(result) {

  // This gives you a Google Access Token. 
  // You can use it to access the Google API
  // (can be useful for stuff like Google Maps).
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





var firebaseDB = firebase.database();
var messagesInFirebase = firebaseDB.ref('messages');

// CREATE a new message.
$('#message-form').on('submit', function(event) {

  // To prevent the default behavior of the form
  // element, which is refreshing the page:
  event.preventDefault();

  // Get the user's input.
  var messageText = $('#message').val();
  $('#message').val('');

  // "Create" a new message object in the database
  messagesInFirebase.push({
    message: messageText,
    votes: 0
  });

});

messagesInFirebase.on('value', function(results) {
  $('.message-board').empty();

  var messages = results.val();

  var unsortedWeirdIds = Object.keys(messages);
  var weirdIds = _.sortBy(unsortedWeirdIds, function(weirdId) {
    return messages[weirdId].votes;
  }).reverse();

  console.log(unsortedWeirdIds);
  console.log(weirdIds);

  weirdIds.forEach(function(weirdId) {
    var messageObject = messages[weirdId];
    var message = messageObject.message;
    var votes = messageObject.votes;

    var messageInFirebase = firebaseDB.ref('messages/' + weirdId);

    var $votesSpan = $('<span>').addClass('votes').html(votes);

    $votesSpan.on('click', function() {
      // console.log(messageObject);
      // console.log(weirdId);
      messageInFirebase.update({
        votes: votes + 1
      });
    });

    var $messageLi = $('<li>').html(message).append($votesSpan);

    $messageLi.on('dblclick', function() {
      messageInFirebase.remove();
    });

    $('.message-board').append($messageLi);
  });

});

