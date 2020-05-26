let a = [1,2,3,4];

// function h(){
// 	console.log(a.shift());
// }

// h();


const x = a[1];
console.log(x === a[1]);
a = a.filter((ele)=>{
	return ele !==x;
})
console.log(a);