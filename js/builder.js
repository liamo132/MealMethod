function calculate() {
    var age = document.getElementById("age").value;
    var height = document.getElementById("height").value;
    var weight = document.getElementById("weight").value;
    var male = document.getElementById("m").checked;
    var female = document.getElementById("f").checked;
    var goal = document.getElementById("goal").value;

    if (age === '' || height === '' || weight === '' || (!male && !female)) {
        alert("All fields are required!");
    } else {
        var bmiResult = calculateBMI(height, weight);
        var healthNote = determineHealthNote(bmiResult);
        document.getElementById("bmi").innerHTML = bmiResult.toFixed(2);
        document.getElementById("health-note").innerHTML = healthNote;

        // Calculate and display recommended nutritional values
        var nutritionalValues = calculateNutritionalValues(goal, age, height, weight, male ? "male" : "female");
        displayNutritionalValues(nutritionalValues);

        // Generate and display Fit Builder note based on the user's goal
        var fitBuilderNote = generateFitBuilderNote(goal);
        displayFitBuilderNote(fitBuilderNote);

        displayPieChart(nutritionalValues);

        displayResultSections();
    }
}

function displayResultSections() {
    var sections = document.querySelectorAll('.result-section');
    var delay = 0;

    sections.forEach(function(section) {
        setTimeout(function() {
            section.classList.add('show');
        }, delay);
        delay += 1200; // Adjust delay (in milliseconds) between each section
    });
}



function calculateBMI(height, weight) {
    var heightMeters = height / 100;
    return weight / (heightMeters * heightMeters);
}

function determineHealthNote(bmi) {
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        return 'Healthy';
    } else if (bmi >= 25 && bmi <= 29.9) {
        return 'Overweight';
    } else if (bmi >= 30 && bmi <= 34.9) {
        return 'Obese';
    } else {
        return 'Extremely obese';
    }
}



function calculateNutritionalValues(weightGoal, age, height, weight, gender) {
    // Calculate recommended nutritional values based on weight goal
    var nutritionalValues = {
        protein: 0, // Example value in grams
        carbs: 0, // Example value in grams
        fat: 0, // Example value in grams
        calories: 0 // Example value in calories
    };

    // Calculate base calorie requirement based on age, height, weight, and gender
    var baseCalories = calculateBaseCalories(age, height, weight, gender);

    // Adjust calorie requirement based on weight goal
    switch (weightGoal) {
        case "lose":
            nutritionalValues.calories = baseCalories - 500; // Deficit of 500 calories/day for weight loss
            break;
        case "gain":
            nutritionalValues.calories = baseCalories + 500; // Surplus of 500 calories/day for weight gain
            break;
        case "build":
            nutritionalValues.calories = baseCalories; // Maintenance calories for muscle building
            break;
        default:
            nutritionalValues.calories = baseCalories; // Default to maintenance calories
            break;
    }

    nutritionalValues.protein = 1.79 * weight; // 1.79 grams of protein per kg of body weight
    nutritionalValues.carbs = 3.5 * weight; // 3.5 grams of carbs per kg of body weight
    nutritionalValues.fat = 0.3 * nutritionalValues.calories / 9; // 30% of total calories from fat

    return nutritionalValues;
}

function calculateBaseCalories(age, height, weight, gender) {
    var baseCalories = 0;

    if (gender === "male") {
        baseCalories = 10 * weight + 6.25 * height - 5 * age + 5; // For males
    } else if (gender === "female") {
        baseCalories = 10 * weight + 6.25 * height - 5 * age - 161; // For females
    }

    return baseCalories;
}


function generateFitBuilderNote(weightGoal) {
    var note = "";
    switch (weightGoal) {
        case "lose":
            note = "Remember to maintain a calorie deficit to achieve your weight loss goals.";
            break;
        case "gain":
            note = "Ensure you're eating in a calorie surplus to support weight growth.";
            break;
        case "build":
            note = "Customize your workout plan and track your progress. focus on high-protein meals to support muscle gain, and train hard to achieve your muscle-building goals.";
            break;
        default:
            note = "Customize your workout plan and track your progress with Fit Builder!";
            break;
    }
    return note;
}function displayFitBuilderNote(note) {
    var fitBuilderNoteDiv = document.getElementById("builder-note");
    fitBuilderNoteDiv.innerHTML = "<h3>Fit Builder Note</h3>" +
        "<p>" + note + "</p>";
}

function displayNutritionalValues(nutritionalValues) {
    var nutritionalValuesDiv = document.getElementById("Nutritional-value");
    nutritionalValuesDiv.innerHTML = "<h3>Recommended Nutritional Values</h3>" +
        "<p>" +
        "Calories: " + nutritionalValues.calories.toFixed(0) + "kcal<br>" +
        "Protein: " + nutritionalValues.protein.toFixed(0) + "g<br>" +
        "Carbs: " + nutritionalValues.carbs.toFixed(0) + "g<br>" +
        "Fat: " + nutritionalValues.fat.toFixed(0) + "g</p>";
}

function displayPieChart(nutritionalValues) {
    var pieChartDiv = document.getElementById("pie-chart");
    pieChartDiv.innerHTML = ""; // Clear the existing content

    var canvas = document.createElement("canvas");
    canvas.id = "nutritional-chart"; // Unique ID for the canvas
    pieChartDiv.appendChild(canvas);

    var ctx = canvas.getContext("2d");

    var data = {
        labels: ["Protein", "Carbs", "Fat", "Calories"], // Include "Calories" label
        datasets: [{
            data: [nutritionalValues.protein, nutritionalValues.carbs, nutritionalValues.fat, nutritionalValues.calories], // Include calories value
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"] // Add color for "Calories"
        }]
    };

    var options = {
        responsive: false,
        maintainAspectRatio: false,
        cutoutPercentage: 50, // Adjust the size of the pie chart
        legend: {
            display: true,
            position: 'right' // You can adjust the position of the legend if needed
        }
    };

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}
