/* 1. Shortest and Longest Word */

function findWords() {

    var str = document.getElementById("text").value;
    var words = str.split(" ");

    var shortest = words[0];
    var longest = words[0];

    for (var i = 0; i < words.length; i++) {

        if (words[i].length < shortest.length)
            shortest = words[i];

        if (words[i].length > longest.length)
            longest = words[i];
    }

    document.getElementById("wordResult").innerHTML =
        "Shortest: " + shortest +
        "<br>Longest: " + longest;
}


/* 2. BMI Calculator */

function calculateBMI() {

    var weight =
        parseFloat(document.getElementById("weight").value);

    var height =
        parseFloat(document.getElementById("height").value);

    var bmi = weight / (height * height);

    document.getElementById("score").innerHTML =
        bmi.toFixed(2);

    if (bmi < 18)
        document.getElementById("type").innerHTML = "Underweight";

    else if (bmi <= 25)
        document.getElementById("type").innerHTML = "Normal";

    else if (bmi <= 30)
        document.getElementById("type").innerHTML = "Overweight";

    else
        document.getElementById("type").innerHTML = "Obese";
}


/* 3. Fruit Farm */

function grow() {

    var rows =
        document.getElementById("rows").value;

    var columns =
        document.getElementById("columns").value;

    var arr = ["Apple.png", "Orange.png"];

    document.getElementById("garden").innerHTML = "";

    for (var i = 0; i < rows; i++) {

        for (var j = 0; j < columns; j++) {

            var n =
                Math.floor(Math.random() * 2);

            document.getElementById("garden").innerHTML +=
                '<img src="' + arr[n] +
                '" width="80" height="80">';
        }

        document.getElementById("garden").innerHTML += "<br>";
    }
}


/* 4. Currency Convertor */

function convert() {

    var data =
        parseFloat(document.getElementById("data").value);

    var from =
        document.getElementById("from").value;

    var to =
        document.getElementById("to").value;

    var result;

    if (from == to)
        result = data;

    else if (from == "Indian Rupee")
        result = data * 0.015;

    else
        result = data * 67.12;

    document.getElementById("answer").innerHTML =
        result.toFixed(2);
}


/* 5. Coin Flip */

var heads = 0;
var tails = 0;

document.getElementById("flip").addEventListener(
    "click", flipFunction
);

function flipFunction() {

    var n =
        Math.floor(Math.random() * 2);

    if (n == 0) {

        document.getElementById("coin").src =
            "heads.png";

        heads++;

        document.getElementById("num_heads").innerHTML =
            heads;
    }

    else {

        document.getElementById("coin").src =
            "tails.png";

        tails++;

        document.getElementById("num_tails").innerHTML =
            tails;
    }
}


/* 6. Birthday Cake Order */

document.getElementById("submit").addEventListener(
    "click", calculateOrder
);

function calculateOrder() {

    var small =
        document.getElementById("small").value;

    var medium =
        document.getElementById("medium").value;

    var large =
        document.getElementById("large").value;

    var tip =
        document.querySelector(
            'input[name="tip"]:checked'
        ).value;

    var total =
        (small * 100) +
        (medium * 200) +
        (large * 400);

    total = total + (total * 0.09);

    total = total + (total * tip / 100);

    document.getElementById("price").innerHTML =
        total.toFixed(2);
}