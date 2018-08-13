import uniqid from 'uniqid';

class List {
    constructor() {
        this.items = []
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deletItem(id) {
        const delIndx = this.items.findIndex(el => el.id === id);
        this.items.splice(delIndx, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}

module.exports = List;