# 자바스크립트 새로고침

## 자바스크립트 추가하기 및 리액트 프로젝트의 차이점

- 자바스크립트는 원래 브라우저용, but node js 나 deno 덕에 밖에서도 사용 가능. capacitor이나 리액트 네이티브 같은 새로운 기술 쓰면 모바일 앱도 가능
- 두가지 방법 있음

  ```js
  <script>alert('hello')</script>
  <script src='script.js' defer type="module"></script>
  <!-- defer 붙이면 html문서 모든 읽은후 자바스크립트 실행되는 거 보장 -->
  <!-- type='module' 자바스크립트 파일을 자바스크립트 모듈로 취급함 -->
  ```

- 리액트 프로젝트를 할 떄 HTML파일에 직접 script를 추가할 일은 거의 없음. 리액트 프로젝트는 대부분 빌드 프로세스를 활용하며 빌드 프로세스의 과정에서 HTML 코드에 자동으로 script 태그를 추가하기 때문
- 리액트 프로젝트는 빌드 프로세스 사용. 작성한 코드가 그대로 브라우저에서 실행되는게 아님. 브라우저에 전달되기전 내부적으로 코드 수정
- 변환하는 이유는 두가지
  - JSX기능 사용해서 브라우저에서 실행불가능하기 때문.
  - 작성한 코드가 프로덕션을 위해 최적화되지 않았기 때문
- vite같은 툴 쓰면 자동으로 빌드 프로세스 있음.

## export 및 import

- 다른 파일과 나눠서 관리하는게 좋은 방법
- export와 import
- 리액트에서는 빌드 프로세스 있어서 import a from './app' 처럼 확장자 안써줘도 됨.
- export default "adfds" 는 파일당 하나만. import 받을때 그냥 아무 이름 써줘도 됨. import a from "./app.js"
- import \* as utils from "./app.js" 이것도 되는데 받아서 쓸때 utils.default utils.apikey 이런 식으로 쓸 수 있음.
- import {apiKey, abc as content } from "./app.js" 이것도 됨.

## 변수와 값 다시 보기

- 문자열, 숫자, 불리안, null undefined 값 등이 있음.
- 변수 이름은 camelCase로 작성
- 이름 지을때 특수문자는 \_ $ 만 넣을 수 있음.
- const 는 재할당 불가, let은 가능

## 함수

```js
// 함수 정의
function greet() {
  console.log("hello");
}

// 함수 호출 ()있어야함.
greet();

// 위처럼 default로 줄 수 있음.
function greet(userName, message = "Hello") {
  console.log(userName);
  console.log(message);
}

// 이렇게 return 줄 수도 있음.
function greet(userName, message = "Hello") {
  return userName + messge;
}

export default function () => {
	console.log("hello")
}

export default () => {
	console.log("hello")
}
```

- function 빼고 화살표로 바꿀수 있음.
- 화살표 함수 구문에서 매개변수 하나 있는 경우 소괄호 생략 가능 ex) (username) => 가 username => 이 될 수 있음. 매개변수 없거나 두개 이상이면 생략 불가능
- 함수 안에 반환문 밖에 없다면 {} 랑 return 생략 가능 ex) number => { return number _ 3} 가 number => number _ 3 이 될 수 있음.

## 객체와 클래스 다시보기

```js
// 이런 식으로 쓰고 접근
const user = {
  name: "Max",
  age: 35,
  greet() {
    console.log(this.name);
  },
};
console.log(user.name);

class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log("Hi");
  }
}

const user1 = User("Manuel", 32);
console.log(user1);
user1.greet();
```

## 배열 및 배열 메소드

- arr.push("working")
- findIndex 함수: 특정 값의 인덱스를 찾을 수 있는 메소드
  - 안에 실행될 함수를 받아야 함.

```js
const index = hobbies.findIndex((item) => {
  return item === "Sports";
});

const index = hobbies.findIndex((item) => item === "Sports");
```

- map 함수: 배열의 모든 원소를 다른 원소로 변환
  - 기존 배열을 수정하지 않고 새로운 배열 반환

```js
const editHobbies = hobbies.map((item) => item + "!");
const editHobbies = hobbies.map((item) => ({ text: item }));
// 위처럼 객체 배열 만들어줄 수 도 있음
```

## 디스트럭쳐링

```js
const userName = ["max", "eric"];
const firstName = userName[0];
const lastName = userName[1];
// 이렇게 했었는데
const [firstName, lastName] = ["max", "eric"];
// 이거 가능 객체도 가능
const { name, age } = {
  name: "max",
  age: 32,
};
// name에 max 들어가고 age에 32 들어감 이름은 같아야함.
const { name, age } = {
  name: "max",
  age: 32,
};
// 다르게 하려면 이렇게 하면됨.
const { name: userName, age } = {
  name: "max",
  age: 32,
};
console.log(userName);
<!-- 이런식으로 유용하게 쓸 수도 있다 -->
function storeOrder({id, currency}) { // 디스트럭처링
  localStorage.setItem('id', id);
  localStorage.setItem('currency', currency);
}
```

## 스프레드 연산자

```js
const hobbies = ["Reading", "Cooking"];
const user = {
  name: "max",
  age: 34,
};
const newHobbies = ["Sports"];

// 이런 식으로 가능 전개해줌
const mergedHobbies = [...hobbies, ...newHobbies];
// 객체도 가능
const extendedUser = {
  isAdmin: true,
  ...user,
};
```

## 컨트롤 구조 다시보기

- if, else if, else문
- for .. of 문

```js
const hobbies = ["Sports", "Cooking"];
for (const hobby of hobbies) {
  console.log(hobby);
}
```

## 함수를 값으로 사용하기

```js
// 함수 정의만 넣어줘야함. 함수를 값으로 사용할 떄 handleTimeout() 이런 식으로 넣어주면 안됨.
function handleTimeout() {
	console.log("Time out")
}

function handleTimeOut2() = () => {
	console.log("Time out again")
}
function handleTimeout() {
setTimeout(handleTimeout, 1500)
setTimeout(handleTimeOut2, 2000)
setTimeout(() => {
	console.log("TIME OUT")
}, 1500)

// 아래와 같이도 가능
function greater(greatFn) {
	greatFn()
}
greater(() => console.log("Hello"))
```

## 함수 내부에서 함수 정의하기.

```js
function init() {
  function greet() {
    console.log("hi");
  }
  greet();
}

// 밖에서는 greet함수 못씀. init 안에서만 사용 가능
init();
```

## 참조형과 기본 값 비교

- 스트링, 숫자형, 부울은 기본형
- 배열, 객체는 참조형
- 기본형 값은 값을 변경할수 없음. 새로운 주소로 재할당되는 거임.
- 객체나 배열은 주소를 참조하는 참조형이기 때문에 값 변경가능
- const 는 변수를 덮어쓸수 없다는 뜻. 참조형은 주소를 참조하기때문에 주소 안에 있는 값에는 접근 가능함. 따라서 상수로 선언한 배열이나 객체는 조작 가능

## 알아두면 좋은 JS function

```txt
map()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

find()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

findIndex()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

filter()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

reduce()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b

concat()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat?v=b

slice()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

splice()  => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
```
