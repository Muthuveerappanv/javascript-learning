// Budget Controller

var budgetController = (function () {
    var Budget = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    }

    Budget.prototype.calculatePercentage = function (income) {
        if (income > 0) {
            this.percentage = Math.round((this.value / income) * 100);
        }
    }

    Budget.prototype.getPercentage = function () {
        return this.percentage;
    }

    var calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach(x => {
            sum += x.value;
        })
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            income: [],
            expense: []
        },
        totals: {
            income: 0,
            expense: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: (type, desc, val) => {
            var id;
            var budgeTypeArr = data.allItems[type];
            if (budgeTypeArr[budgeTypeArr.length - 1]) {
                id = budgeTypeArr[budgeTypeArr.length - 1].id + 1;
            } else {
                id = 1;
            }
            var budget = new Budget(id, desc, val);
            budgeTypeArr.push(budget);
            return budget;
        },

        calculateBudget: () => {
            // 1. Calculate Total Income & Expenses
            calculateTotal('expense');
            calculateTotal('income');

            // 2. Calcualte the budget, which is income - expenses
            data.budget = data.totals.income - data.totals.expense;

            // 3. Calculate % of income spent
            if (data.totals.income > 0)
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);

        },

        calculatePercentages: () => {
            data.allItems.expense.forEach(x => {
                x.calculatePercentage(data.totals.income);
            })
        },

        getPercentages: () => {
            var percetageArr = data.allItems.expense.map(x => x.getPercentage());
            return percetageArr;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        },

        deleteItem: (type, id) => {

            var index, ids;

            ids = data.allItems[type].map((current) => {
                return current.id;
            })

            index = ids.indexOf(parseInt(id));

            if (index >= 0) {
                data.allItems[type].splice(index, 1);
            }

        }
    }

})();


// UI Controller


var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        income: 'income',
        expenses: 'expenses',
        deleteBtn: 'ion-ios-close-outline',
        itemPercetage: '.item__percentage',
        month: '.budget__title--month'
    }

    var nodeListForEach = (fields, callback) => {
        for (i = 0; i < fields.length; i++) {
            callback(fields[i], i);
        }
    }

    var formatNumber = function (num, type) {
        num = Math.abs(num);
        var sign, numStr;

        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        });

        numStr = formatter.format(num);

        sign = (type === 'income' ? '+ ' : '- ');
        return sign + numStr;
    }

    return {
        getInput: () => ({
            type: document.querySelector(DOMStrings.inputType).value, // income or expense
            text: document.querySelector(DOMStrings.inputDesc).value, // text description
            value: parseFloat(document.querySelector(DOMStrings.inputVal).value)
        }),


        addListItem: (obj, type) => {
            // Create HTML string with placeholder text
            var html, newHtml, element;

            if (type === 'income') {
                html = '<div class="item clearfix" id="%type%-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.incomeContainer;
            } else {
                html = '<div class="item clearfix" id="%type%-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMStrings.expenseContainer;
            }

            newHtml = html.replace('%type%', type);
            newHtml = newHtml.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            console.log(element);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            // Replace the placeholder text with some actual data

            // Insert the HTML into the DOM
        },

        deleteListItem: (itemId) => {
            var element = document.getElementById(itemId);
            element.parentNode.removeChild(element);
        },

        clearFields: () => {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDesc + "," + DOMStrings.inputVal);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = '';
            });
            fieldsArr[0].focus();
        },

        displayBudget: (budget) => {

            var budgetType = (budget.budget >= 0 ? 'income' : 'expense');

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(budget.budget, budgetType);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(budget.totalIncome, 'income');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(budget.totalExpense, 'expense');
            if (budget.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = budget.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: (percentages) => {
            var fields = document.querySelectorAll(DOMStrings.itemPercetage);

            /* fields.forEach((x, i) => {
                if (percentages[i] > 0) {
                    x.textContent = percentages[i] + '%';
                } else {
                    x.textContent = '---';
                }
            }) */

            nodeListForEach(fields, (current, index) => {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })
        },

        displayMonth: () => {
            var date, locale, month;
            date = new Date();
            locale = "en-us",
                month = date.toLocaleString(locale, {
                    month: "long"
                });
            document.querySelector(DOMStrings.month).textContent = `${month} ${date.getFullYear()}`;
        },

        getDOMStrings: () => {
            return DOMStrings;
        },

        changedType: () => {
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDesc + ',' +
                DOMStrings.inputVal);
            nodeListForEach(fields, (current, index) => {
                current.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.addBtn).classList.toggle('red');
        }
    }

})();


// APP Controller

var controller = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings();
    var eventListeners = () => {
        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    var updateBudget = () => {
        // 1. calculate budget
        budgetCtrl.calculateBudget();

        // 2. return budget
        var outBudget = budgetCtrl.getBudget();

        // 3. Update in UI
        UICtrl.displayBudget(outBudget);

    }

    var updatePercentages = () => {
        // 1. Calculate percentages for all items
        budgetCtrl.calculatePercentages();

        // 2. Read purchases from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. update UI for percentages
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = () => {
        var inputObj, budget;
        // 1. Get the field input data
        inputObj = UICtrl.getInput();

        if (inputObj.desc !== '' && !isNaN(inputObj.value) && inputObj.value > 0) {
            // 2. Add the item to the budget controller
            budget = budgetCtrl.addItem(inputObj.type, inputObj.text, inputObj.value);

            // 3. Add the item to the UI

            UICtrl.addListItem(budget, inputObj.type);

            // 4. Clear the fields

            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = (event) => {
        var itemID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            itemSplit = itemID.split('-');
            type = itemSplit[0];
            id = itemSplit[1];

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, id);

            // 2. update uI
            UICtrl.deleteListItem(itemID, type);

            // 3. calculate new budget
            updateBudget();

            // 4. calculate percentages

            updatePercentages();

        }

        /* if (event.target.className === DOM.deleteBtn)
            if (event.currentTarget.firstElementChild.className === DOM.income) {

            } else if (event.currentTarget.firstElementChild.className === DOM.expenses) {

        } */

    }

    return {
        init: () => {
            console.log('Application Started');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0
            });
            UICtrl.displayMonth();
            eventListeners();

        }
    }

})(budgetController, UIController);

controller.init();