import {
    elements
} from './base';

export const getInput = () => elements.searchField.value;

export const clearInput = () => {
    elements.searchField.value = '';
}

export const clearResults = () => {
    elements.recipeList.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {
    if(title.length > limit) {
        const titleArr = [];
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                titleArr.push(cur);
            }
            return acc + cur.length;
        }, 0)
        console.log(`${titleArr.join(' ')} ...`);
        return `${titleArr.join(' ')} ...`;
    } else {
        return title;
    }

}

const renderRecipe = recipe => {
    const markup = `<li>
    <a class="results__link results__link--active" href="${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
    elements.recipeList.insertAdjacentHTML('beforeend', markup);
}

export const renderResults = (recipes) => {
    recipes.forEach(renderRecipe);
}