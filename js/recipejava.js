
let mealCounter = 0;
var undoStack = [];
var redoStack = [];
let selectedMeals = {
    'Breakfast': null,
    'Lunch': null,
    'Dinner': null
};

const appId = 'a6db65af';
const appKey = '7fd93bc864f525bed3a4cb9c18c9e31e';


// ------------------- adding a scroll function that makes my header(height & logo) smaller when user scrolls ------------
window.addEventListener("scroll", function () {
    var header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);

    var logoImg = document.querySelector(".logo img");

    var scaleFactor = 1 - window.scrollY / 1000;

    scaleFactor = Math.max(0.9, scaleFactor);

    logoImg.style.transform = "scale(" + scaleFactor + ")";
});


// ---------------------------- RECIPE PAGE / API  ----------------------------
function searchRecipes() {
    const query = document.getElementById('query').value;
    const mealType = document.getElementById('meal-type').value;
    const dietType = document.getElementById('diet-type').value; // Change this to healthType
    let url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;
    if (mealType) {
        url += `&mealType=${mealType}`;
    }

    //add health type to the URL if selected
    if (dietType) {
        url += `&health=${dietType}`; // Change this to health
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.hits);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}



function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-card');
        recipeDiv.innerHTML = `
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <div class="recipe-card-content">
                <h2>${recipe.recipe.label}</h2>
                <p>Calories: ${recipe.recipe.calories.toFixed(2)}</p>
                <p>Servings: ${recipe.recipe.yield}</p>
                <p><a href="${recipe.recipe.url}" target="_blank">View Recipe</a></p>
            </div>
        `;
        resultsDiv.appendChild(recipeDiv);
    });
}
