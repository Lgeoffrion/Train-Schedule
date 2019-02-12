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



//Initial Values
var database = firebase.database();

var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;


//adding clock to the page to see the current time on the jumbotron
function currentTime() {
    var current = moment().format('LTS');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};


//calling the clock/current time function
currentTime();



//add new train to database
$("#submit").on("click", function (event) {
    event.preventDefault();

    if ($("#trainName").val().trim() === "" ||
        $("#destination").val().trim() === "" ||
        $("#firstTrain").val().trim() === "" ||
        $("#frequency").val().trim() === "") {

        alert("Please fill in all details to add new train");

    } else {

        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        startTime = $("#firstTrain").val().trim();
        frequency = $("#frequency").val().trim();

        $(".form-field").val("");

        database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            startTime: startTime,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        sessionStorage.clear();
    }

});


//generate table with firebase data
database.ref().on("child_added", function (childSnapshot) {
    var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;

    var newrow = $("<tr>");
    newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
    newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
    newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
    newrow.append($("<td class='text-center'><button class='removeButton btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

    $("#train-table-rows").append(newrow);

});


//remove child button and refresh page
$(document).on("click", ".removeButton", function () {
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    window.location.reload();
});


//refreshes the window every minute
setInterval(function () {
    window.location.reload();
}, 60000);