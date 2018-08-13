export const elements = {
    searchField: document.querySelector('.search__field'),
    searchButton: document.querySelector('.search__btn'),
    recipeList: document.querySelector('.results__list'),
    results: document.querySelector('.results'),
    loader: document.querySelector('.loader'),
    resultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likes: document.querySelector('.likes__list')
}

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterBegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader)
        loader.parentNode.removeChild(loader);
}