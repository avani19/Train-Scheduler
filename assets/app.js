// Initialize Firebase
var config = {
    apiKey: "AIzaSyCy1Q1iV1oucAeWIJVgm-4SktuQ1YwBRxE",
    authDomain: "trainscheduler-fa326.firebaseapp.com",
    databaseURL: "https://trainscheduler-fa326.firebaseio.com",
    storageBucket: "trainscheduler-fa326.appspot.com",
    messagingSenderId: "109171932485"
};
firebase.initializeApp(config);
var database = firebase.database();


//Button for add train
$("#addTrainBtn").on("click", function() {

    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var traindestination = $("#destinationInput").val().trim();
    var trainFirstArrival = $("#firstArrivalInput").val().trim();
    var trainfrequency = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: traindestination,
        time: trainFirstArrival,
        freq: trainfrequency
    }

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.freq);

    // Alert
    alert("Train schedule successfully added");

    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstArrivalInput").val("");
    $("#frequencyInput").val("");

    // Prevents moving to new page
    return false;
});


//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
function refreshTable() {
    $("#trainData").html('');
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var traindestination = childSnapshot.val().destination;
        var trainFirstArrival = childSnapshot.val().time;
        var trainfrequency = childSnapshot.val().freq;

        // Train Info
        console.log(trainName);
        console.log(traindestination);
        console.log(trainFirstArrival);
        console.log(trainfrequency);

        // Add each train's data into the table
        var firstTimeConverted = moment(trainFirstArrival, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % trainfrequency;
        console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = trainfrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes")
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))
        nextTrainDeparture = moment(nextTrain).format("hh:mm");

        $("#trainTable > #trainData").append("<tr><td>" + trainName + "</td><td>" + traindestination + "</td><td>" + trainfrequency + "</td><td>" + nextTrainDeparture + "</td><td>" + tMinutesTillTrain + "</td><td>");

    });
}
var timeStep = setInterval(currentTime, 1000);

function currentTime() {
    var timeNow = moment().format("hh:mm:ss A");
    $("#currentTime").text("Current Time: " + timeNow);

    // Refresh the Page every minute, on the minute
    var secondsNow = moment().format("ss");

    if (secondsNow == "00") {
        refreshTable();
    }

}
