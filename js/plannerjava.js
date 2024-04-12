let selectedRecipes = []; 
let selectedMealsByDay = {};
let mealCounter = 0;
var undoStack = [];
var redoStack = [];
let fetchedRecipes = [];
let selectedMeals = {
    'Breakfast': null,
    'Lunch': null,
    'Dinner': null
};


const appId = 'a6db65af'; 
const appKey = '7fd93bc864f525bed3a4cb9c18c9e31e'; 


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

// Function to clear meal planner for a specific day
function clearMealPlannerForDay(day) {
    selectedMealsByDay[day] = []; // Clear meal plan for the selected day
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
// Function to toggle active day
function toggleActive(element) {
    const dayButtons = document.querySelectorAll('.day');
    dayButtons.forEach(button => {
        button.classList.remove('active');
        button.style.opacity = '0.6';
    });

    element.classList.add('active');
    element.style.opacity = '1.0';

    const activeDay = element.textContent;
    displaySelectedMeals(activeDay); // Display selected meals for the newly active day
}

//show meal sidebaar when adding meal
document.getElementById('addMealBtn').addEventListener('click', function () {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.right = '0'; // Show the sidebar
    sidebar.style.transition = 'right 0.5s ease'; // Add transition effect
    sidebar.style.zIndex = '9999'; // Set highest z-index relative to its parent
});

//add "x" to close sidebar
document.getElementById('closeSidebar').addEventListener('click', function () {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.right = '-300px'; // Hide the sidebar
});



/*
// Function to save the current state of the meal planner
function saveState() {
    var mealPlanner = document.querySelector('.meal-planner').innerHTML;
    undoStack.push(mealPlanner);
}

// Function to undo the last action
// Function to undo the last action
function undo() {
    if (undoStack.length > 1) { // Check if undoStack has at least 2 elements
        var currentState = undoStack.pop(); // Get the current state
        redoStack.push(currentState); // Push current state to redo stack

        // Apply the previous state
        var previousState = undoStack[undoStack.length - 1];
        document.querySelector('.meal-planner').innerHTML = previousState;
    } else {
        console.log("Nothing to undo.");
    }
}

// Function to redo the undone action
function redo() {
    if (redoStack.length > 0) { // Check if redoStack is not empty
        var nextState = redoStack.pop(); // Get the next state
        undoStack.push(nextState); // Push next state to undo stack

        // Apply the next state
        document.querySelector('.meal-planner').innerHTML = nextState;
    } else {
        console.log("Nothing to redo.");
    }
}




// Function to clear both undo and redo stacks
function clearStacks() {
    undoStack = [];
    redoStack = [];
}
*/

// Function to open the meal sidebar
function openMealSidebar() {
    document.getElementById("mealSidebar").style.width = "500px";
    document.getElementById("main").style.marginRight = "500px";
}

// Function to close the meal sidebar
function closeMealSidebar() {
    document.getElementById("mealSidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

// Function to handle the selection of a meal option
function selectMeal(element, mealType) {
    const mealOption = document.querySelector('.meal-option.selected');
    if (mealOption && mealOption.textContent === mealType) {
        // Meal already selected, do nothing
        return;
    }

    // Remove selected class from all meal options
    document.querySelectorAll('.meal-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Add selected class to the clicked meal option
    element.classList.add('selected');

    // Fetch and display recipes based on the selected meal type
    fetchRecipesByType(mealType);
}

// Function to fetch recipes from Edamam API based on meal type
function fetchRecipesByType(mealType) {
    let query = ''; // Define query based on the mealType

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
        default:
            query = ''; // Handle other meal types if needed
            break;
    }


    
    // Function to fetch recipes from Edamam API based on the provided query
    fetchRecipes(query, appId, appKey);
}

// Function to add selected recipe to the array
function addSelectedRecipe(recipe) {
    selectedRecipes.push(recipe);
    if (selectedRecipes.length === 3) {
        calculateTotalNutrition();
    }
}

// Function to remove selected recipe from the array
function removeSelectedRecipe(recipe) {
    const index = selectedRecipes.indexOf(recipe);
    if (index !== -1) {
        selectedRecipes.splice(index, 1);
        removeMealAndUpdateCounter();
    }
}

function calculateTotalNutrition() {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    // Iterate through selected recipes
    selectedRecipes.forEach(recipe => {
        if (recipe && recipe.recipe) { // Check if recipe and recipe.recipe are defined
            // Calculate total nutritional values based on servings
            const servings = recipe.servings || 1; // Default to 1 serving if servings are not specified
            totalCalories += (recipe.recipe.calories / recipe.recipe.yield) * servings;
            totalProtein += (recipe.recipe.totalNutrients.PROCNT.quantity / recipe.recipe.yield) * servings;
            totalFat += (recipe.recipe.totalNutrients.FAT.quantity / recipe.recipe.yield) * servings;
            totalCarbs += (recipe.recipe.totalNutrients.CHOCDF.quantity / recipe.recipe.yield) * servings;
        }
    });

    // Display total nutritional values
    const totalNutritionElement = document.getElementById('totNutrition');
    totalNutritionElement.innerHTML = `
        <p>Macros:   Kcal: ${totalCalories.toFixed(2)} Protein: ${totalProtein.toFixed(2)}
        Fat: ${totalFat.toFixed(2)} Carbs: ${totalCarbs.toFixed(2)}</p>
    `;
}

// Function to fetch recipes from Edamam API
function fetchRecipes(query, appId, appKey) {
    let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display recipes in the recipes container
            displayRecipes(data.hits);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

// Function to display recipes in the recipes container

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const servings = 1; // Set servings to 1
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
                <p>Protein: ${(recipeProteinPerServing).toFixed(2)} ${recipe.recipe.totalNutrients.PROCNT.unit}
                    
                </p>
                <p class="hidden-info" style="display: none;">Fat: ${(recipeFatPerServing).toFixed(2)} ${recipe.recipe.totalNutrients.FAT.unit}</p>
                <p class="hidden-info" style="display: none;">Carbs: ${(recipeCarbsPerServing).toFixed(2)} ${recipe.recipe.totalNutrients.CHOCDF.unit}</p>
                <button class="add-button" onclick="addRecipeToMealPlanner('${recipe.recipe.label}')">Add</button> <span class="lighter-color">per serving</span>
            </div>
        `;
        recipesContainer.appendChild(recipeCard);
    });
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

// Function to remove a meal and update the meal counter
function removeMealAndUpdateCounter(mealItem) {
    const mealContainer = document.querySelector('.meal-container');

    // Update the meal counter only if it's greater than 0
    if (mealCounter > 0) {
        // Update the meal counter
        mealCounter--;
        const mealCountElement = document.getElementById('mealCounter');
        mealCountElement.textContent = `${mealCounter}/3`;
    }

    // Remove the meal item from the DOM
    mealContainer.removeChild(mealItem.parentNode);

    // Recalculate total nutrition after removing the meal
    calculateTotalNutrition();

    // Check if the meal counter is less than 3 and update the message accordingly
    if (mealCounter < 3) {
        const addMealButton = document.querySelector('.add-meal-button');
        if (addMealButton) {
            mealContainer.appendChild(addMealButton);
        }
    }
}

// Function to add selected recipe to the array
function addSelectedRecipe(recipe) {
    selectedRecipes.push(recipe);
    if (selectedRecipes.length === 3) {
        calculateTotalNutrition();
    }
}
function removeSelectedRecipe(recipe) {
    const index = selectedRecipes.findIndex(selectedRecipe => selectedRecipe.recipe.label === recipe.recipe.label);
    if (index !== -1) {
        selectedRecipes.splice(index, 1);
        removeMealAndUpdateCounter();
    }
}


// Function to add selected recipe to the meal planner
function addRecipeToMealPlanner(recipe) {
    const mealContainer = document.querySelector('.meal-container');

    // Check if the maximum limit of 3 meals is reached
    if (mealCounter >= 3) {
        alert('You have reached the maximum number of meals (3).');
        return; // Exit the function if the maximum limit is reached
    }

    // Create a div to hold the meal information
    const mealItem = document.createElement('div');
    mealItem.classList.add('meal-item');

    // Set the inner HTML of the meal item with the selected recipe's nutritional information
    mealItem.innerHTML = `
        <div class="recipe-details">
        <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 20px;">
        <div>
            <h4>${recipe.recipe.label}</h4>
            <p>Calories: ${(recipe.recipe.calories / recipe.recipe.yield).toFixed(2)}
            Protein: ${(recipe.recipe.totalNutrients.PROCNT.quantity / recipe.recipe.yield).toFixed(2)} ${recipe.recipe.totalNutrients.PROCNT.unit}
            Fat: ${(recipe.recipe.totalNutrients.FAT.quantity / recipe.recipe.yield).toFixed(2)} ${recipe.recipe.totalNutrients.FAT.unit}
            Carbs: ${(recipe.recipe.totalNutrients.CHOCDF.quantity / recipe.recipe.yield).toFixed(2)} ${recipe.recipe.totalNutrients.CHOCDF.unit}</p>
           
        </div>
        </div>
        <button class="delete-button" onclick="removeMealAndUpdateCounter(this)">Remove</button>
    `;

     // Apply styling to the meal item
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

    // Append the meal item to the meal container
    mealContainer.appendChild(mealItem);
    
    addSelectedRecipe(recipe);

    // Increment the meal counter
    mealCounter++;
    const mealCountElement = document.getElementById('mealCounter');
    mealCountElement.textContent = `${mealCounter}/3`;

    // Remove other elements from the meal container
    const startPlanningText = document.querySelector('.start-planning-text');
    const addMealButton = document.querySelector('.add-meal-button');
    if (startPlanningText) {
        mealContainer.removeChild(startPlanningText);
    }
    if (addMealButton) {
        mealContainer.removeChild(addMealButton);
    }

    // Show the smaller "Add meals" button
    document.getElementById('smallerBTN').style.display = 'block';

    // Recalculate total nutrition
    calculateTotalNutrition();
}

// Functin to fetch recipes from Edamam API
function fetchRecipes(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Store fetched recipes in the array
            fetchedRecipes = data.hits;
            // Display recipes in the recipes container
            displayRecipes(fetchedRecipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}




// Function to display recipes in the recipes container
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        // Add a button to add the recipe to the meal planner
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.classList.add('add-button');
        addButton.addEventListener('click', function() {
            addRecipeToMealPlanner(recipe);
        });

        const servings = 1; // Set servings to 1
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
        // Append the button to the recipe card
        recipeCard.appendChild(addButton);
        recipesContainer.appendChild(recipeCard);
    });
}



// Function to fetch recipes from Edamam API based on the provided query
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




