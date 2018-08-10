import Search from './models/Search';
import {
    elements
} from './views/base';
import * as searchView from './views/searchView';


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

        await state.search.getRecipes();
        // render results on UI

        searchView.renderResults(state.search.result);
    }
}

elements.searchButton.addEventListener('click', e => {
    e.preventDefault();
    controlSearch();
})

// api key - 048b56dc5422d165db09cb0e6f3c0a32\
// http://food2fork.com/api/search