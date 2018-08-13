import {
    elements
} from './base';
import * as searchview from './searchView';

export const toggleLikeBtn = isLiked => {
    const icon = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${icon}`);
}

export const toggleLikes = numLikes => {
    document.querySelector(`.likes__icon`).style.visibility = (numLikes > 0) ? 'visible' : 'hidden';
}

export const renderLike = like => {
    const markup = `<li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${searchview.limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>`;
    elements.likes.insertAdjacentHTML('beforeend', markup);
}

export const removeLikeFromList = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`);
    el.parentElement.removeChild(el);
}