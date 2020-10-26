// // // function Person() {
// // //   Person.getv = function(){
// // //     console.log(1)
// // //   }
// // //   this.getv = function (){
// // //     console.log(2)
// // //   }
// // // }

// // // Person.getv = function ( ) {
// // //   console.log(10)
// // // }
 
// // // Person.prototype.getv = function () {
// // //   console.log(3)
// // // }

// // // function P2 () {

// // // }

// // // P2.prototype = new Person();
// // // let a = new P2()

// // // a.getv()

// // function A () {
// //   this.a = 1;
// // }

// // Function.prototype.print = function () {
// //   console.log(this.a)
// // }

// // A.print()

// // aa = new A();
// // aa.print()

// var aa = 1;
// function A() {
//  this.aa = 10;
// }

// Function.prototype.AA = function () {
//   console.log(111111111);
// }

// Object.prototype.AA = function () {
//   console.log(22222222222)
// }

// var a = new A()

// A.AA() //111111111 如果去掉Function.prototype.AA 输出22222222
// a.AA() //22222222222
// console.log(a.aa) //10
// console.log(aa) //1

var a = 10;
var obj = {
    a: 40
}
function fn() {
    function foo() {
        console.log(this.a);
    }
    foo();
}
 
fn.call(obj) //10
fn() //10 严格模式为undefined
