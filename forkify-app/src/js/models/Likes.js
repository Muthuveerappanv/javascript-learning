export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);
        this.persistData();
        return like;
    }

    deletLike(id) {
        const delIndx = this.likes.findIndex(el => el.id === id);
        this.likes.splice(delIndx, 1);
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) === -1 ? false : true;

    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storagelikes = JSON.parse(localStorage.getItem('likes'));
        if (storagelikes) this.likes = storagelikes;
    }
}