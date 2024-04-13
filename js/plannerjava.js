let selectedRecipes = []; //init revcipe array
var undoStack = [];
var redoStack = [];
let fetchedRecipes = [];
let mealCounter = 0; //init meal counter at 0
let activeDayNumber = 1; // Initialize active day number as 1
let prevState = null;
let selectedMealsByDay = {};
let selectedMeals = {
    'Breakfast': null,
    'Lunch': null,
    'Dinner': null
};


const appId = 'a6db65af';
const appKey = '7fd93bc864f525bed3a4cb9c18c9e31e';


//makes day one active on websote load
window.onload = function () {
    const day1 = document.getElementById('day1');
    toggleActive(day1);
};

//function to save the website state which allows undo and redo functionallity
function saveState() {
    prevState = document.querySelector('.meal-container').innerHTML;
    undoStack.push(prevState);
    // clear the redo stack whenever a new state is saved
    redoStack = [];
}


function undo() {
    if (undoStack.length > 0) {

        redoStack.push(document.querySelector('.meal-container').innerHTML);

        const prevState = undoStack.pop();
        document.querySelector('.meal-container').innerHTML = prevState;

        const mealItems = document.querySelectorAll('.meal-item');
        mealCounter = mealItems.length;
        const mealCountElement = document.getElementById('mealCounter');
        mealCountElement.textContent = `${mealCounter}/3`;
    }
}

function redo() {
    if (redoStack.length > 0) {

        undoStack.push(document.querySelector('.meal-container').innerHTML);

        const nextState = redoStack.pop();
        document.querySelector('.meal-container').innerHTML = nextState;

        const mealItems = document.querySelectorAll('.meal-item');
        mealCounter = mealItems.length;
        const mealCountElement = document.getElementById('mealCounter');
        mealCountElement.textContent = `${mealCounter}/3`;
    }
}

// ---------------------------- FUNCTION TO REVERT PLANNER TO THE ORIGINAL ----------------------------
function clearMealPlanner() {
    selectedRecipes = [];
    selectedMealsByDay = {}; // Clear meal plans for each day
    mealCounter = 0;

    const mealContainer = document.querySelector('.meal-container');
    mealContainer.innerHTML = `
        <div class="start-planning-text">Your planner looks a little empty...</div>
        <button class="add-meal-button" onclick="openMealSidebar()">Add meals</button>
        <div class="totNutrition" id="totNutrition">
            <p>Macros: </p>
        </div>
        <div class="mealCount">
            <p>Meals Added: <span id="mealCounter">0/3</span></p>
        </div>
    `;

    const totalNutrition = document.getElementById('totalNutrition');
    totalNutrition.innerHTML = '';

    document.getElementById('smallerBTN').style.display = 'none';
}





// ---------------------------- MAKE A DAY ACTIVE ----------------------------
function toggleActive(element) {
    const dayButtons = document.querySelectorAll('.day');
    dayButtons.forEach(button => {
        button.classList.remove('active');
        button.style.opacity = '0.6';
    });

    element.classList.add('active');
    element.style.opacity = '1.0';

    activeDayNumber = parseInt(element.textContent.replace('Day ', '')); // Extract and store the active day number

    // Update the text of the "Save" button
    const saveButton = document.querySelector('.saveBtn');
    saveButton.textContent = `Save Day ${activeDayNumber}`;

    // Call the function to display selected meals for the newly active day
    displaySelectedMeals(activeDayNumber);

    clearMealPlanner();
}

// Function to display selected meals for a specific day
function displaySelectedMeals(dayNumber) {
    console.log(`Displaying selected meals for Day ${dayNumber}`);
}


// ---------------------------- ADDING MEALS FUNCTIONALLITY ----------------------------
  
function openMealSidebar() {
    document.getElementById("mealSidebar").style.width = "500px";
    document.getElementById("main").style.marginRight = "500px";
}

function closeMealSidebar() {
    document.getElementById("mealSidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

function selectMeal(element, mealType) {
    const mealOption = document.querySelector('.meal-option.selected');
    if (mealOption && mealOption.textContent === mealType) {
        return;
    }

    document.querySelectorAll('.meal-option').forEach(option => {
        option.classList.remove('selected');
    });

    element.classList.add('selected');

    // Fetch and display recipes based on the selected meal type
    //fetch through brekke, lunch, dinner 
    fetchRecipesByType(mealType);
}

// function to fetch recipes from Edamam API based on meal type
function fetchRecipesByType(mealType) {
    let query = '';

    // Define the query based on the selected meal type
    switch (mealType) {
        case 'Breakfast':
            query = 'breakfast';
            break;
        case 'Lunch':
            query = 'lunch';
            break;
        case 'Dinner':
            query = 'dinner';
            break;
    }

    // Function to fetch recipes from Edamam API based on the provided query
    fetchRecipes(query, appId, appKey);
}


// ---------------------------- CALCULATE TOTAL MACROS /NUTRITIONL VALUES ----------------------------
function calculateTotalNutrition() {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    // go through selected recipes
    selectedRecipes.forEach(selectedRecipe => {
        const recipe = selectedRecipe.recipe;
        const portionCount = selectedRecipe.portionCount || 1; // default to 1 portion

        if (recipe && recipe.recipe) {
            // get total nutritional values based on portion count
            totalCalories += (recipe.recipe.calories / recipe.recipe.yield * portionCount);
            totalProtein += (recipe.recipe.totalNutrients.PROCNT.quantity / recipe.recipe.yield * portionCount);
            totalFat += (recipe.recipe.totalNutrients.FAT.quantity / recipe.recipe.yield * portionCount);
            totalCarbs += (recipe.recipe.totalNutrients.CHOCDF.quantity / recipe.recipe.yield * portionCount);
        }
    });

    // show total nutritional values inside the .totNutrition class
    const totalNutritionElement = document.getElementById('totNutrition');
    totalNutritionElement.innerHTML = `
        <p>Macros:   Kcal: ${totalCalories.toFixed(2)} Protein: ${totalProtein.toFixed(2)}
        Fat: ${totalFat.toFixed(2)} Carbs: ${totalCarbs.toFixed(2)}</p>
    `;
}

function addMealAndUpdateCounter() {
    const mealCountElement = document.getElementById('mealCounter');
    if (mealCounter < 3) {
        mealCounter++;
        mealCountElement.textContent = `${mealCounter}/3`;
        if (mealCounter === 3) {
            alert('You have reached the maximum number of meals (3).');
        }
    } else {
        alert('You have reached the maximum number of meals (3).');
    }
}

// functiom to add selected recipe to the array
function addSelectedRecipe(recipe) {
    selectedRecipes.push(recipe);
    if (selectedRecipes.length === 3) {
        calculateTotalNutrition();
    }
}


// ---------------------------- THE AREA WHERE YOU CAN CHOOSE WHAT RECIPES TO ADD TO PLANNER ----------------------------


function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.classList.add('add-button');
        addButton.addEventListener('click', function () {
            addRecipeToMealPlanner(recipe);
        });

        const servings = 1; //set servings to 1
        //make the nutrients shown be the equivelent for 1 serving
        const recipeCaloriesPerServing = recipe.recipe.calories / recipe.recipe.yield;
        const recipeProteinPerServing = recipe.recipe.totalNutrients.PROCNT.quantity / recipe.recipe.yield;
        const recipeFatPerServing = recipe.recipe.totalNutrients.FAT.quantity / recipe.recipe.yield;
        const recipeCarbsPerServing = recipe.recipe.totalNutrients.CHOCDF.quantity / recipe.recipe.yield;

        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <div class="recipe-image">
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            </div>
            <div class="recipe-details">
                <h4>${recipe.recipe.label}</h4>
                <p>Calories: ${(recipeCaloriesPerServing).toFixed(2)}</p>
                <p>Protein: ${(recipeProteinPerServing).toFixed(2)} ${recipe.recipe.totalNutrients.PROCNT.unit}</p>
                <p class="hidden-info" style="display: none;">Fat: ${(recipeFatPerServing).toFixed(2)} ${recipe.recipe.totalNutrients.FAT.unit}</p>
                <p class="hidden-info" style="display: none;">Carbs: ${(recipeCarbsPerServing).toFixed(2)} ${recipe.recipe.totalNutrients.CHOCDF.unit}</p>
            </div>
        `;

        recipeCard.appendChild(addButton);
        recipesContainer.appendChild(recipeCard);
    });
}


// ---------------------------- FUNCTION TO ADD RECIPE TO THE MEAL PLAN ----------------------------
function addRecipeToMealPlanner(recipe) {
    const mealContainer = document.querySelector('.meal-container');

    saveState();

    //  the user has to enter the portion count
    const portionCount = prompt(`Enter the portion count for ${recipe.recipe.label}:`);
    if (!portionCount || isNaN(portionCount) || portionCount <= 0) {
        alert('Please enter a valid portion count greater than 0.');
        return;
    }

    // check if the maximum limit of 3 meals is reached
    if (mealCounter >= 3) {
        alert('You have reached the maximum number of meals (3).');
        return; // stop the function if the maximum limit is reached
    }

    const mealItem = document.createElement('div');
    mealItem.classList.add('meal-item');

    // set the inner HTML of the meal item with the selected recipe's nutritional information and portion count
    mealItem.innerHTML = `
        <div class="recipe-details">
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 20px;">
            <div>
                <h4>${recipe.recipe.label}</h4>
                <p>Portions: ${portionCount}</p>
                <p>Calories: ${(recipe.recipe.calories / recipe.recipe.yield * portionCount).toFixed(2)}
                Protein: ${(recipe.recipe.totalNutrients.PROCNT.quantity / recipe.recipe.yield * portionCount).toFixed(2)} ${recipe.recipe.totalNutrients.PROCNT.unit}
                Fat: ${(recipe.recipe.totalNutrients.FAT.quantity / recipe.recipe.yield * portionCount).toFixed(2)} ${recipe.recipe.totalNutrients.FAT.unit}
                Carbs: ${(recipe.recipe.totalNutrients.CHOCDF.quantity / recipe.recipe.yield * portionCount).toFixed(2)} ${recipe.recipe.totalNutrients.CHOCDF.unit}</p>
            </div>
        </div>
    `;

    //styling to the meal item
    mealItem.style.height = 'auto';
    mealItem.style.display = 'flex';
    mealItem.style.width = '90%';
    mealItem.style.backgroundColor = '#f5f5f5';
    mealItem.style.borderRadius = '8px';
    mealItem.style.border = '1px solid #ddd';
    mealItem.style.display = 'flex';
    mealItem.style.justifyContent = 'space-between';
    mealItem.style.padding = '10px';
    mealItem.style.marginBottom = '10px';
    mealItem.style.transition = 'background-color 0.3s ease';

    mealContainer.appendChild(mealItem);


    const selectedRecipe = { recipe, portionCount };
    selectedRecipes.push(selectedRecipe);

    //increase the meal counter
    mealCounter++;
    const mealCountElement = document.getElementById('mealCounter');
    mealCountElement.textContent = `${mealCounter}/3`;

    //remove the welcooming message
    const startPlanningText = document.querySelector('.start-planning-text');
    const addMealButton = document.querySelector('.add-meal-button');
    if (startPlanningText) {
        mealContainer.removeChild(startPlanningText);
    }
    if (addMealButton) {
        mealContainer.removeChild(addMealButton);
    }

    //display a smaller add meals button as the original one will get removed if a meal is added
    document.getElementById('smallerBTN').style.display = 'block';

    //function to calc nutrition
    calculateTotalNutrition();
}








// Function to fetch recipes from Edamam API based on the provided query, appId, and appKey
function fetchRecipes(query, appId, appKey) {
    let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Store fetched recipes in the array
            fetchedRecipes = data.hits.slice(0, 10);
            // Display recipes in the recipes container
            displayRecipes(fetchedRecipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

function saveMealPlanner() {
    const mealContainer = document.querySelector('.meal-container');
    const mealPlannerName = document.getElementById('mealPlannerName').value || 'Untitled'; // Get meal planner name

    // Use html2canvas to capture the contents of the meal container
    html2canvas(mealContainer, {
        onrendered: function (canvas) {
            // Convert the canvas to a data URL representing a PNG image
            const imageData = canvas.toDataURL('image/png');

            // Create a link element to download the image
            const link = document.createElement('a');

            // Set the filename including meal planner name, day number, and meal name
            link.download = `Day${activeDayNumber}__${mealPlannerName}.png`;

            link.href = imageData;
            // Simulate a click on the link to download the image
            link.click();
        }
    });
}


