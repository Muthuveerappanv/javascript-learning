console.log('Muthu is Awesome!');
console.log(calcAge(1955));
function calcAge(birthYear){
    return new Date().getFullYear() - birthYear;
}

var muthu = (a, b) => {
    return a + b;
};

console.log(muthu(3 , 3));

var arr = [1, 2, 3, 4];
console.log(arr);
arr[4]=5;


arr.push(10);
arr.unshift(0);


arr.pop();
arr.shift();
console.log(arr);

var is5there = arr.indexOf(6) === -1 ? 'not there': 'there';
console.log(is5there);

/* Object Literal */
var john = {
    firstName: 'Muthu',
    lastName: 'Venkat',
    yob: 1991,
    family: ['Aarabhi', 'Athira'],
    calcAge: function() {
        this.age =  new Date().getFullYear() - this.yob;
    }
}

console.log(john.family);
console.log(JSON.stringify(john));
console.log(john['lastName']);

/* New Object method */
var jane = new Object();

john.calcAge();
console.log(john);

