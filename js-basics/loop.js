for (var i = 0; i <= 20; i++){
    console.log(i);
}

var names = ['John', 'Snow', 'Muthu', 'Venkat', 1990, 1991];
/* for (var i = 0; i<names.length; i++){
    console.log(names[i]);
} */

var i = 0;
while (i < names.length){
  // console.log(names[i]);
    if(typeof names[i] === 'string'){
        i++;
        continue;
    } else{
        console.log(names[i]);
    }
    i++;
}


for (var i = names.length-1; i >= 0; i--){
    console.log(names[i]);
}