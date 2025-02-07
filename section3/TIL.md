# 리액트 핵심 - 컴포넌트, JSX, 속성, 상태 등

## 컴포넌트의 모든 것

- 리액트 애플리케이션은 컴포넌트의 모음
- 장점 3가지
  - Reusable building blocks
  - Related code lives together
  - Separation of concerns

## JSX와 리액트 컴포넌트

- JSX 는 자바스크립트 확장 문법. 개발자가 자바스크립트 파일 내에 HTML 마크업 코드를 작성하여 HTML 요소를 설명하고 생성할 수 있게 함.
- 이런 코드들은 브라우저에 가기전 개발 서버에서 변환됨
- 리액트에서 컴포넌트로 인식되기 위한 2가지 규칙
  - 함수의 제목이 대문자로 시작되어야함
  - 함수에서 렌더링 가능한 값이 반환되어야 함.
- 리액트와 자바스크립트 코드의 HTML인 JSX의 강점은 JSX 코드 안에 일반 HTML 코드 같이 컴포넌트 함수를 사용할 수 있다는 점임

```jsx
// 옆에 <Header /> 있는 것 확인
function Header() {
  return (
    <header>
      <img src="src/assets/react-core-concepts.png" alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        Fundamental React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}

export default App;
```

## 리액트의 컴포넌트 처리 과정 & 컴포넌트 트리 생성법

- 웹사이트 정보보면 index.jsx script문으로 감싸져있는거 확인가능
- index.jsx 보면 App.jsx 컴포넌트 가져옴
- index.jsx는 html 파일에 가장 먼저 로딩되는 파일로 리액트 앱의 입구로 작용함. 이 위치에서 리액트 앱 부팅됨.
- 리액트 DOM 라이브러리에 앱컴포넌트가 결과적으로 렌더링됨.

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(\<App />);

- 컴포넌트와 중첩 컴포넌트의 모든 내용을 div안으로 렌더링함.
- 컴포넌트 트리는 리액트가 분석함. 모든 JSX코드를 결합하여 전반적인 DOM 을 형성하고 화면에 띄움.
- head, image, div 등과 같은 내장 컴포넌트는 리액트에서 DOM노드로서 렌더링됨. 반면에, 헤더와 같은 커스텀 컴포넌트는 단순한 함수이므로 리액트에서 함수로서 실행됨.

## 동적 값 출력 및 활용

- 동적 값 추가위해 {} 사용

```jsx
function Header() {
  const description = reactDescriptions[genRandomInt(2)];
  return (
    <header>
      <img src="src/assets/react-core-concepts.png" alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {/* 밑에 description만 보셈 */}
        {description} React concepts you will need for almost any app you are going
        to build!
      </p>
    </header>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}

export default App;
```

## 동적 HTML Attributes 설정 & 이미지 파일 로딩

- 배포 과정에서 \<img src="src/assets/react-core-concepts.png" alt="Stylized atom" /> 이런 코드 없어질 수 있음.

```jsx
import reactImg from "./assets/react-core-concepts.png"
<img src={reactImg}>
{/* 이런 식으로 하면 됨. */}
```

- JSX 코드를 작동하게 만드는 동일한 빌드 과정으로 인해 가능한 방법
- 동적인 값 사용할때 따옴표 쓰지 않음.

## Props 속성으로 컴포넌트 재사용

```jsx
function CoreConcept(props) {
  return (
    <li>
      <img src={props.image} />
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </li>
  );
}

function App() {
  return (
    <CoreConcept
      title="Components"
      description="The core UI building block."
      image={componentImg}
    />
  );
}
```

- 이런 느낌. prop들 이름은 자기가 설정 가능

```js
export const CORE_CONCEPTS = [
  {
    image: componentsImg,
    title: "Components",
    description:
      "The core UI building block - compose the user interface by combining multiple components.",
  },
  {
    image: jsxImg,
    title: "JSX",
    description:
      "Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.",
  },
  {
    image: propsImg,
    title: "Props",
    description:
      "Make components configurable (and therefore reusable) by passing input data to them.",
  },
  {
    image: stateImg,
    title: "State",
    description:
      "React-managed data which, when changed, causes the component to re-render & the UI to update.",
  },
];
```

- 이런 식으로 데이터 구성이 되어있을 때 밑에처럼 가능함. 이름은 근데 다 같아야함.

```jsx
import { CORE_CONCEPTS } from "./data.js";

function CoreConcept({ image, title, description }) {
  return (
    <li>
      <img src={image} />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}

<CoreConcept
  title={CORE_CONCEPTS[0].title}
  description={CORE_CONCEPTS[0].description}
  image={CORE_CONCEPTS[0].image}
/>
<CoreConcept {...CORE_CONCEPTS[1]} />
<CoreConcept {...CORE_CONCEPTS[2]} />
<CoreConcept {...CORE_CONCEPTS[3]} />
```

- 보통 components 라는 폴더에 컴포넌트들 넣음.
- 별도의 컴포넌트는 별도의 파일에 저장하는 것이 좋음. 한 파일에 넣는 것은 매우 드물음. 연관성이 있거나 두 개의 컴포넌트가 함께 있어야 작동하는 경우
- 나중에 css 코드를 컴포넌트별 css 파일로 구분하여 어떤 스타일이 어떤 컴포넌트에 적용되게 할 수 있음.

## 컴포넌트 구성: 특별한 children Prop

- 컴포넌트 열림과 닫힘 텍스트 사이에 무언가를 전달하면 리액트가 출력할 위치를 모르기 때문에 자동적으로 내용 출력되지 않음.
- 속성 안써줘도 항상 받는 속성인 children prop 이용
- attributes도 쓸수 있는데 선호하는거 쓰면 됨.

```jsx
// using children
<TabButton>Components</TabButton>;

function TabButton({ children }) {
  return <button>{children}</button>;
}

// using attributes
<TabButton label="Components" />;
function TabButton({ label }) {
  return <button>{label}</button>;
}
```

## 함수를 prop인자 값으로 전달하기

```jsx
// App.jsx
function handleClick() {
  console.log("Hello World");
}
<TabButton onSelect={handleClick}>Components</TabButton>;

// TabButton.jsx
export default function TabButton({ children, onSelect }) {
  return (
    <li>
      <button onClick={onSelect}>{children}</button>
    </li>
  );
}
// 이런 식으로 접근 가능함.
```

- props에 인자 넣는 방법 -> 화살표 함수 쓰면 () 붙여도 자동으로 실행되지 않음. 함수를 다른 함수로 감싸는 느낌임.

```jsx
function handleClick(selectedButton) {
  console.log(selectedButton);
}
<TabButton onSelect={() => handleClick("component")}>Components</TabButton>;
```

## State 관리 & 훅 사용법

- 리액트는 기본적으로 컴포넌트 함수를 코드 내에서 처음 발견했을 때 한 번밖에 사용안함. 그걸 해결하기위한 State관리
- useState라는 함수는 리액트 훅 use로 시작하는 것들은 다 리액트 훅임.
- 리액트 훅은 컴포넌트 함수 또는 다른 리액트 훅 안에서 호출되어야함. 컴포넌트 함수 안에서 바로 호출해야하며 내부 함수 안에 중첩되면 안됨.
- 컴포넌트에 연결된 상태를 관리하게 함. 데이터가 변경되면 이 hook이 자기가 속한 컴포넌트 함수를 활성화하여 리액트에 의해 재검토함.

![alt text](image.png)

```jsx
import { useState } from "react";
const [selectedTopic, setSelectedTopic] = useState("Please click a button");
function handleClick(selectedButton) {
  setSelectedTopic(selectedButton);
}
```

- 상태를 업데이트하는 함수를 부를 때 리액트는 상태 업데이트 스케줄을 조정하여 컴포넌트 함수를 재실행함. (여기서는 App) 함수를 재실행하고 나서야 업데이트된 새로운 값 쓸 수 있음. console.log(selectedButton);

```jsx
const [selectedTopic, setSelectedTopic] = useState("components"); // 초기값 설정 EXAMPLES 가 객체인 점을 이용해서 이름으로 접근하는 느낌.
<div id="tab-content">
  <h3>{EXAMPLES[selectedTopic].title}</h3>
  <p>{EXAMPLES[selectedTopic].description}</p>
  <pre>
    <code>{EXAMPLES[selectedTopic].code}</code>
  </pre>
</div>;
```

## 조건적 스타일링 -> 다양한 방법 있는데 다 알아두기

```jsx
//1
const [selectedTopic, setSelectedTopic] = useState(); // 초기값을 비워두고
{
  !selectedTopic ? <p>Please select a topic.</p> : null;
}
{
  selectedTopic ? (
    <div id="tab-content">
      <h3>{EXAMPLES[selectedTopic].title}</h3>
      <p>{EXAMPLES[selectedTopic].description}</p>
      <pre>
        <code>{EXAMPLES[selectedTopic].code}</code>
      </pre>
    </div>
  ) : null;
}

//2
{
  !selectedTopic ? (
    <p>Please select a topic.</p>
  ) : (
    <div id="tab-content">
      <h3>{EXAMPLES[selectedTopic].title}</h3>
      <p>{EXAMPLES[selectedTopic].description}</p>
      <pre>
        <code>{EXAMPLES[selectedTopic].code}</code>
      </pre>
    </div>
  );
}

//3
{
  !selectedTopic && <p>Please select a topic.</p>;
}
{
  selectedTopic && (
    <div id="tab-content">
      <h3>{EXAMPLES[selectedTopic].title}</h3>
      <p>{EXAMPLES[selectedTopic].description}</p>
      <pre>
        <code>{EXAMPLES[selectedTopic].code}</code>
      </pre>
    </div>
  );
}

//4
let tabContent = <p>Please select a topic.</p>;

if (selectedTopic) {
  tabContent = (
    <div id="tab-content">
      <h3>{EXAMPLES[selectedTopic].title}</h3>
      <p>{EXAMPLES[selectedTopic].description}</p>
      <pre>
        <code>{EXAMPLES[selectedTopic].code}</code>
      </pre>
    </div>
  );
}

{
  tabContent;
}
```

## CSS 스타일링 및 동적 스타일링

```jsx
// 이런 식으로 스타일링 가능 선택적으로 스타일링
<TabButton
  isSelected={selectedTopic === "state"}
  onSelect={() => handleClick("state")}
>
  State
</TabButton>;

export default function TabButton({ children, onSelect, isSelected }) {
  return (
    <li>
      <button className={isSelected ? "active" : undefined} onClick={onSelect}>
        {children}
      </button>
    </li>
  );
}
```

## 리스트의 동적 출력

```jsx
<CoreConcept
  title={CORE_CONCEPTS[0].title}
  description={CORE_CONCEPTS[0].description}
  image={CORE_CONCEPTS[0].image}
/>
<CoreConcept {...CORE_CONCEPTS[1]} />
<CoreConcept {...CORE_CONCEPTS[2]} />
<CoreConcept {...CORE_CONCEPTS[3]} />

// 위의 부분을 아래와 같이 수정가능 이렇게 하면 배열 인덱스가 없는 부분 신경 쓸 필요 없음.
{CORE_CONCEPTS.map((conceptItem) => (
              <CoreConcept key={conceptItem.title} {...conceptItem} />
            ))}

```
