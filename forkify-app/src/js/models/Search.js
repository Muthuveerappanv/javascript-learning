import axios from 'axios';
import {proxy, key} from '../config';

class Search {
    constructor(query) {
        this.query = query;
    }

    async getRecipes() {
        try {
            const resp = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = resp.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}

module.exports = Search;