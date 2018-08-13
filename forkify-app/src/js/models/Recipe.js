import axios from 'axios';
import {proxy, key} from '../config';


class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipes(id) {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        this.time = numIng * 5;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds', 'jars', 'packages' ];
        const unitShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound', 'jar', 'pack'];
        const units = [...unitShort, 'g', 'kg'];

        const newIngredients = this.ingredients.map(x => {
            let ingredient = x.toLowerCase();
            unitLong.forEach((long,i) => {
                ingredient = ingredient.replace(long, unitShort[i]);
            })

            // remove paraentehiss
            ingredient = ingredient.replace(/[\])}[{(]/g, '');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        })
        this.ingredients = newIngredients;
    }

    modifyServings(type)  {
      const newServings =   type === 'dec' ? this.servings -1 : this.servings + 1;

      this.ingredients.forEach(ing => {
          ing.count = ing.count * (newServings/this.servings);
      })

      this.servings = newServings;

    }

}



module.exports = Recipe;