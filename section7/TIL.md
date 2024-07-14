# 리액트앱 디버깅하기

## 리액트 오류 메시지 이해하기

- 대부분 리액트 메시지는 도움됨.

```
Results.jsx:11 Uncaught
TypeError: Cannot read properties of undefined (reading 'valueEndOfYear')
    at Results (Results.jsx:11:16)
    at renderWithHooks (react-dom_client.js?v=db7e5ceb:11566:26)
    at updateFunctionComponent (react-dom_client.js?v=db7e5ceb:14600:28)
    at beginWork (react-dom_client.js?v=db7e5ceb:15942:22)
    at HTMLUnknownElement.callCallback2 (react-dom_client.js?v=db7e5ceb:3672:22)
    at Object.invokeGuardedCallbackDev (react-dom_client.js?v=db7e5ceb:3697:24)
    at invokeGuardedCallback (react-dom_client.js?v=db7e5ceb:3731:39)
    at beginWork$1 (react-dom_client.js?v=db7e5ceb:19791:15)
    at performUnitOfWork (react-dom_client.js?v=db7e5ceb:19224:20)
    at workLoopSync (react-dom_client.js?v=db7e5ceb:19163:13)

- valueEndOfYear 가 undefined 인 거 확인 Results 확인 이런 식으로 접근하면 됨.
```

## 코드 흐름 및 경고 분석

- 에러가 안뜨는 오류들 있음. -> 크롬 inspect 들어가서 sources 들어가면 파일 구조 나오는데 특정 파일 찍고 줄 찍으면 breakpoint 가능 그리고 페이지에서 직접 조작하면 breakpoint 있는 부분에서 멈춤.
- 문자열에 + 해주면 숫자가 될 수 있는 거면 숫자로 변환해줌. 아닌 거면 NaN. let str ="123" let num= +str console.log(num) -> 123 나옴 "123" 아님.

## 리액트의 Strict Mode 이용하기

- Strict Mode는 리액트에서 import 하는 컴포넌트 import {StrictMode} from 'react';

```jsx
//index.jsx
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- 위와 같이 써줌. StrictMode가 하는 중요한 일은 컴포넌트 함수를 두번씩 실행한다는 것. -> 개발 단계에서만 그렇게 함. 이렇게 함으로서 에러를 발견하기 쉬움.

## 리액트 DevTools

- React Developer Tools 를 크롬 익스텐션에 받음.
- Profiler 페이지 옆에 non-private 창에 들어가면 component 트리 확인 가능. 복잡한 UI에서 분석하고 이해하는 데 유용함. 개발자 툴의 외관도 제어 가능
- 컴포넌트 하나 누르면 그 컴포넌트에 대해서 배울 수 있음. 다양한 속성 및 변수 값 확인 가능.
- state 관리 같은거는 밑에 hook 에서 확인 가능함. UI들의 어떤 부분들이 어떤 컴포넌트에 의해 관리되는지 이해 가능, 트리 수정하는데 사용도 가능, prop state 변화가 UI에 어떻게 반영되는지도 확인 가능
