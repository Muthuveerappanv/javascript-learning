import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeview from './views/recipeview';
import * as listview from './views/listview';
import * as likesview from './views/likesview';
import Likes from './models/Likes';


const state = {};

const controlSearch = async () => {
    // 1) Get query from view

    const query = searchView.getInput();

    if (query) {
        // new query
        state.search = new Search(query);

        // prepare UI form results
        searchView.clearInput();

        searchView.clearResults();

        renderLoader(elements.results);

        await state.search.getRecipes();
        // render results on UI

        clearLoader();

        searchView.renderResults(state.search.result);
    }
}

elements.searchButton.addEventListener('click', e => {
    e.preventDefault();
    controlSearch();
})

elements.results.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        const page = button.dataset.goto;
        typeof (page);
        searchView.clearResults();
        searchView.renderResults(state.search.result, page);
    }
})


/*
RECIPE CONTROLLER
*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeview.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight
        if (state.search)
            searchView.highlightSelect(id);

        // Create Recipe object
        state.recipe = new Recipe(id);

        try {

            await state.recipe.getRecipes();
            // get recipe data
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();

            //calculete servigns
            clearLoader();
            recipeview.recipeview(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert(error);
        }

        // render
    }
}

/*
LIST Controller
*/

const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(ing => {
        const listitem = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listview.renderItem(listitem);
    })
}

/*
Like Controller
*/



const controlLike = () => {
    const currentID = state.recipe.id;
    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {

        // add like to likes list
        const likedItem = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // toggle like button
        likesview.toggleLikeBtn(true);

        //add like to UI list
        likesview.renderLike(likedItem);
    }
    // user has liked already 
    else {
        // delete form like
        state.likes.deletLike(currentID);

        // toggle like button
        likesview.toggleLikeBtn(false);

        // remove like from uilist
        likesview.removeLikeFromList(currentID);

    }
    likesview.toggleLikes(state.likes.getNumLikes());
}



/*
List Item Events
*/

window.addEventListener('load', () => {
    if (!state.likes) {
        state.likes = new Likes();
    }

    state.likes.readStorage();

    likesview.toggleLikes(state.likes.getNumLikes());

    state.likes.likes.forEach(like => likesview.renderLike(like));
})

elements.shopping.addEventListener('click', e => {
    const itemid = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deletItem(itemid);
        listview.deleteItem(itemid);
    } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {
        const val = parseFloat(e.target.value);
        if (val > 0)
            state.list.updateCount(itemid, val);
    }
});

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.modifyServings('dec');
            recipeview.updateServingIng(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.modifyServings('inc');
        recipeview.updateServingIng(state.recipe);
    }


    if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }

})
// api key - 048b56dc5422d165db09cb0e6f3c0a32\
// http://food2fork.com/api/search