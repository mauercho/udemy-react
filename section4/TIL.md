# 리액트 핵심 - 심화 단계

## JSX를 꼭 사용하지 않아도 되는 이유

- 가능은 함. 근데 굳이 그럴 필요는 없음. JSX 사용하지 않으면 빌드 과정이 필요 없음.

![alt text](image.png)

```jsx
const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
// 위 코드를 import React from 'react'한 다음
ReactDOM.createRoot(entryPoint).render(REACT.createElement(App)); //로 수정 가능
```

## Fragments 사용법

- return 할 때 상위 요소를 이용하여 하나로 묶어야함.
- div로 묶는 대신 import { Fragment } from 'react' 를 하고 \<Fragment> \</Fragment>안에 넣어주는 방법이 있음.
- \<> \</> 이걸로도 됨. 최신 리액트 버전

## 컴포넌트 분리하기

- 컴포넌트 분리 잘 안하면 불필요한 컴포넌트 함수들이 재사용되거나 하는 경우 많음.
- 기능에 따라 분리하면 좋음.

```jsx
<Header />
<main>
	<CoreConcepts />
	<Examples />
</main>
// 예전에는 App에 다 몰아주어서 App이 다시 실행되었는데 이제 각각 컴포넌트 함수를 다른 파일에 주어서 서로 영향 X
```

## 내부 요소에 Props(속성)이 전달되지 않는 경우

- 이런 식으로 넣을 수 있음.
- 다른 방법도 있음.

```jsx
//Examples.jsx
<Section title="Examples" id="examples"></Section>;

//Section.jsx
export default function Section({ title, id, children }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

## 감싸진 요소에 속성 전달하기.

```jsx
//Examples.jsx
<Section title="Examples" id="examples"></Section>;

//Section.jsx
export default function Section({ title, children, ...props }) {
  return (
    <section {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

- title, children이 아닌 {id="examples"} 이 그대로 props로 묶임. section {...props} 부분에서 풀어짐.

```jsx
<TabButton
          isSelected={selectedTopic === "state"}
          onSelect={() => handleSelect("state")}
        >
		</TabButton>

export default function TabButton({ children, onSelect, isSelected }) {
  console.log('TABBUTTON COMPONENT EXECUTING');
  return (
    <li>
      <button className={isSelected ? 'active' : undefined} onClick={onSelect}>
        {children}
      </button>
    </li>
  );
// 위는 기존인데
<TabButton
          isSelected={selectedTopic === "state"}
          onClick={() => handleSelect("state")}
        >
          State
        </TabButton>

export default function TabButton({ children, isSelected, ...props }) {
  console.log("TABBUTTON COMPONENT EXECUTING");
  return (
    <li>
      <button className={isSelected ? "active" : undefined} {...props}>
        {children}
      </button>
    </li>
  );
}
// 이런식으로 바꿀 수 있음.
```
