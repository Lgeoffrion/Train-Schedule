// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAmJoMSTF3kKNxXoUM6SzReWY5fPYxNpgk",
    authDomain: "train-scheduler-4863d.firebaseapp.com",
    databaseURL: "https://train-scheduler-4863d.firebaseio.com",
    projectId: "train-scheduler-4863d",
    storageBucket: "train-scheduler-4863d.appspot.com",
    messagingSenderId: "47468175086"
  };
  firebase.initializeApp(config);


  var dataRef = firebase.database();
    // Initial Values
    var name = "";
    var destination = "";
    var firstTrain = "";
    var frequency = "";
    // Submit Train Button Click Handler
    $("#add-train").on("click", function(event) {
      event.preventDefault();
      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTrain = $("#firstTrain-input").val().trim();
      frequency = $("#frequency-input").val().trim();
      // Code for the push
      dataRef.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });