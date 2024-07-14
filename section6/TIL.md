# 리액트 컴포넌트 스타일링

## 바닐라 CSS로 리액트 앱 스타일링하기 - 장단점

- 장점
  - 그냥 import 하고 컴포넌트와 jsx 코드에 작업할 수 있음.
  - 다른 사람이 스타일링 작업 할 수 있고 나는 그냥 컴포넌트 작업만 할 수 있음.
- 단점
  - css 알아야함.
  - 컴포넌트 간 스타일 충돌이 발생할 수 있음.

## 바닐라 CSS 스타일이 컴포넌트에 스코핑되지 않는 이유

- css 코드를 나눠 파일 중 몇 개를 특정 컴포넌트 파일로 import 하더라도 그 파일에 css 규칙들은 그들이 속하는 컴포넌트에 스코핑되지 않음.
- 모든 스타일은 결국 vite를 통해 header 섹션으로 주입됨.

## Inline 스타일로 리액트 앱 스타일링 하기.

```jsx
<p
  style={{
    color: "red",
    textAlign: "left",
  }}
></p>

<input
            type="email"
            style={{
              backgroudColor: emailNotValid ? "#fed2d2" : "d1d5db",
            }}
            // className={emailNotValid ? 'invalid' : undefined}
            onChange={(event) => handleInputChange("email", event.target.value)}
          />
```

- 장점
  - 추가하기 쉽다
  - 다른 요소에는 적용 안된다.
- 단점
  - 모든 요소를 개별적으로 스타일 해야한다.
  - css와 jsx 코드 구분이 없다, (jsx코드에 css rk whswo)

```jsx
className={passwordNotValid ? 'invalid' : undefined}
// 3항연산자 안쓰고passNotValid && 'invalid' 이런식으로 쓰면 className이 없으면 false가 들어감. 그래서 3항연산자 써야함.

<label className={`label ${emailNotValid ? "invalid" : ""}`}>
            Email
          </label>
// 위와 같이 백틱 사용하여 문자열 만들어서 동적으로 넣기도 가능.
```

## CSS 모듈

- 빌드 프로세스에 의해 구현됨.
- 파일 당 고유한 것을 보장
- import classes from "./Header.module.css";
- 모듈 css안의 클래스 이름은 빌드 과정에서 이름이 변환이 됨. 따라서 클래스 스타일로 가져온 컴포넌트 파일로 스코핑되도록 보장함.
- className = {`${classes.paragraph}`} 이런 식으로 쓰는것도 가능

## 스타일 컴포넌트 (서드 파티 패키지)

- styled-components 패키지는 리액트 프로젝트에서 사용할 수 있는 패키지
- 해당 패키지의 도움을 받아 특별한 컴포넌트 내에서 정의
- npm install styled-components

```jsx
import { styled } from "styled-components";
const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
<ControlContainer>{/* 여기에 내용물 쓰면 적용됨. */}</ControlContainer>;

// 이런식으로 className 써줄 수도 있음.
<Label className={`label ${emailNotValid ? "invalid" : ""}`}>Email</Label>;
// 근데 이렇게 혼합해서쓰는 거 안 좋음.
//tageged templates 이용

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $invalid }) => ($invalid ? "#f87171" : "#6b7280")};
`;
<Label $invalid={emailNotValid}>Email</Label>;
// invalid 속성에 $ 붙이므로서 스타일링에 쓰이는 속성이라고 알려줌. 안쓰면 경고 뜸
```

```jsx
// 아래와 같이 가능 header 속 & img -> header 안에 있는 img들에 적용 공백 하나 넣어야함. 그냥 css 코드 쓰면 돼서 편함.
const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;

  & img {
    object-fit: contain;
    margin-bottom: 2rem;
    width: 11rem;
    height: 11rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 0.25rem;
  color: #1f2937;
  background-color: #f0b322;
  border-radius: 6px;
  border: none;

  &:hover {
    background-color: #f0920e;
  }
`;
// 위와 같이 &:hover는 button 자체에 hover 적용
```

- 스타일 컴포넌트의 장점
  - 상대적으로 빠르고 쉽게 애플리케이션에 추가할 수 있음.
  - 리액트에서만 생각하면 됨.
  - 스타일 범위가 자동으로 지정됨.
- 단점
  - css 알아야함.
  - css와 react 사이에 명확한 분리가 없음
  - wrapper 컴포넌트가 많이 생길 수 있음.
