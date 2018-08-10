import axios from 'axios';

class Search {
    constructor(query) {
        this.query = query;
    }

    async getRecipes() {
        try {
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const key = '048b56dc5422d165db09cb0e6f3c0a32';
            const resp = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = resp.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}

module.exports = Search;