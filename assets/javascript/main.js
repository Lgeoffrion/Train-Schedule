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

//function to determin current time
function currentTime() {
    var current = moment().format('LT');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
};



//  *****************************************************
//FIX THIS
// **********************************************
$(".form-field").on("keyup", function () {
    var traintemp = $("#train-name").val().trim();
    var citytemp = $("#destination").val().trim();
    var timetemp = $("#first-train").val().trim();
    var freqtemp = $("#frequency").val().trim();

    sessionStorage.setItem("train", traintemp);
    sessionStorage.setItem("city", citytemp);
    sessionStorage.setItem("time", timetemp);
    sessionStorage.setItem("freq", freqtemp);
});

$("#train-name").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));



// Submit Train Button Click Handler
$("#add-train").on("click", function (event) {
    event.preventDefault();
    
    if ($("#name-input").val().trim() === "" ||
        $("#destination-input").val().trim() === "" ||
        $("#firstTrain-input").val().trim() === "" ||
        $("#frequency-input").val().trim() === "") {
        alert("Please fill in all fields to add new train");
    }
    else {
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
        sessionStorage.clear();
    }
});

database.ref().on("child_added", function (childSnapshot) {
    var firstTrainConverted = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
    var timeRemain = timeDiff % childSnapshot.val().frequency;
    var minToArrival = childSnapshot.val().frequency - timeRemain;
    var nextTrain = moment().add(minToArrival, "minutes");
    var key = childSnapshot.key;

    var newrow = $("<tr>");
    newrow.append($("<td>" + childSnapshot.val().name + "</td>"));
    newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
    newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
    newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
    newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
    newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

    if (minToArrival < 6) {
        newrow.addClass("info");
    }

    //fix this in HTML
    $("#train-table-rows").append(newrow);

});