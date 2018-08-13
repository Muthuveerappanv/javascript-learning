import {elements} from './base';

export const getInput = () => elements.searchField.value;

export const clearInput = () => {
    elements.searchField.value = '';
}

export const highlightSelect = id => {
    const results = document.querySelectorAll('.results__link');
    results.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const clearResults = () => {
    elements.recipeList.innerHTML = '';
    elements.resultPages.innerHTML = '';
}

export const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const titleArr = [];
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                titleArr.push(cur);
            }
            return acc + cur.length;
        }, 0)
        return `${titleArr.join(' ')} ...`;
    } else {
        return title;
    }

}

const renderRecipe = recipe => {
    const markup = `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
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

const createButton = (page, type) => {
    return `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
     <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
    </button>`;
}

const renderButton = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);
    page = parseInt(page);
    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons
        button = `${createButton(page, 'prev')} ${createButton(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        // only last button
        button = createButton(page, 'prev');
    }

    elements.resultPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * (resPerPage);
    recipes.slice(start, end).forEach(renderRecipe);
    renderButton(page, recipes.length, resPerPage);
}