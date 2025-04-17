import { mockRecipes } from '../data/mockRecipes.js';
import { showView } from './ui.js';

export function initSearch() {
    // Ingredient Input
    document.getElementById('ingredient-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            const tag = document.createElement('span');
            tag.className = 'ingredient-tag';
            tag.innerHTML = `${sanitizeInput(this.value.trim())} <button><i class="fas fa-times"></i></button>`;
            tag.querySelector('button').addEventListener('click', () => tag.remove());
            document.getElementById('ingredient-tags').appendChild(tag);
            this.value = '';
        }
    });

    // Diet and Allergy Filters
    document.querySelectorAll('.diet-filter, .allergy-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('bg-green-500');
            btn.classList.toggle('text-white');
            btn.classList.toggle('border-green-500');
        });
    });

    // Search Button
    document.getElementById('search-btn').addEventListener('click', searchRecipes);
}

async function searchRecipes() {
    const ingredients = Array.from(document.getElementById('ingredient-tags').children)
        .map(tag => tag.textContent.trim().replace(/\s×$/, ''));
    const diets = Array.from(document.querySelectorAll('.diet-filter.bg-green-500'))
        .map(btn => btn.dataset.diet);
    const allergies = Array.from(document.querySelectorAll('.allergy-filter.bg-green-500'))
        .map(btn => btn.dataset.allergy);
    const maxCookingTime = document.getElementById('max-cooking-time').value;
    const minCalories = document.getElementById('min-calories').value || 0;
    const maxCalories = document.getElementById('max-calories').value || 10000;
    const sortBy = document.getElementById('sort-by').value;

    document.getElementById('loading').classList.remove('hide');
    document.getElementById('results-grid').innerHTML = '';
    document.getElementById('no-results').classList.add('hide');

    setTimeout(() => {
        document.getElementById('loading').classList.add('hide');
        let filteredRecipes = mockRecipes.filter(recipe => {
            const hasIngredients = ingredients.every(ing => recipe.ingredients.some(rIng => rIng.toLowerCase().includes(ing.toLowerCase())));
            const matchesDiet = diets.length === 0 || diets.some(diet => recipe.diets.includes(diet));
            const noAllergies = allergies.every(allergy => !recipe.ingredients.some(ing => ing.toLowerCase().includes(allergy.toLowerCase())));
            const withinTime = recipe.cookingTime <= maxCookingTime || !recipe.cookingTime;
            const withinCalories = (!recipe.calories || (recipe.calories >= minCalories && recipe.calories <= maxCalories));
            return hasIngredients && matchesDiet && noAllergies && withinTime && withinCalories;
        });

        if (sortBy === 'time' && filteredRecipes.some(r => r.cookingTime)) {
            filteredRecipes.sort((a, b) => (a.cookingTime || Infinity) - (b.cookingTime || Infinity));
        } else if (sortBy === 'calories' && filteredRecipes.some(r => r.calories)) {
            filteredRecipes.sort((a, b) => (a.calories || Infinity) - (b.calories || Infinity));
        } else if (sortBy === 'rating' && filteredRecipes.some(r => r.rating)) {
            filteredRecipes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        if (filteredRecipes.length === 0) {
            document.getElementById('no-results').classList.remove('hide');
            return;
        }

        displayRecipes(filteredRecipes);
        showView(document.getElementById('search-results'));
    }, 800);
}

function displayRecipes(recipes) {
    const grid = document.getElementById('results-grid');
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800">${recipe.title}</h3>
                <p class="text-sm text-gray-600">${recipe.cookingTime || 'N/A'} min | ${recipe.calories || 'N/A'} cal</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}