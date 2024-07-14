# Refs & Portals 활용하기

## Refs(참조 소개): Refs(참조)로 HTML 요소 연결 및 접근

```jsx
// 수정전
import { useState } from "react";

export default function Player() {
  const [enteredPlayerName, setEnteredPlayerName] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    setSubmitted(false);
    setEnteredPlayerName(event.target.value);
  }

  function handleClick() {
    setSubmitted(true);
  }

  return (
    <section id="player">
      <h2>Welcome {submitted ? enteredPlayerName : "unknown entity"}</h2>
      <p>
        <input type="text" onChange={handleChange} value={enteredPlayerName} />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}

// 수정후
import { useState, useRef } from "react";

export default function Player() {
  const playerName = useRef();
  const [enteredPlayerName, setEnteredPlayerName] = useState(null);

  function handleClick() {
    setEnteredPlayerName(playerName.current.value);
	// playerName.current.value = "";
  }

  return (
    <section id="player">
      <h2>
        Welcome {enteredPlayerName ? enteredPlayerName : "unknown entity"}
      </h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}

```

- 기존에는 텍스트 바꾸기만 해도 Welcome 부분이 바뀌었는데 이제 버튼 눌러야만 바뀜.
- const playerName = useRef(); 이렇게 참조 값을 생성했으면 그것을 상수나 변수 안에 저장할 수 있음.
- 참조로 가장 많이 할 수 있는 부분이 JSX 요소들과 바로 연결할 수 있다는 거임. 요소들은 ref 속성을 가짐. input요소가 playerName과 연결되어있음. 그래서 접근 가능.
- 그리고 참조값들은 항상 current 속성 값을 가짐. current에 value로 접근하여 값을 변경했음.
- playerName.current.value = ""; ->> 이 코드를 씀으로서 input 요소를 클릭하면 지워줄 수 있음.
  - 리액트는 선언적인 코드를 쓴다는 개념
  - DOM을 직접 조작하는 게 아님. But 위에 부분은 직접 조작함. 코드를 많이 줄여주기 때문에 쓸 수 밖에 없음.

## Refs(참조) VS State(상태) 값

- Welcome {enteredPlayerName ? enteredPlayerName : "unknown entity"} 이 부분에서 enteredPlayerName 대신 playerName을 써주면 안될까?
- 컴포넌트가 처음 렌더링 될때 playerName는 정의 안돼서 안됨.
- 참조가 바뀔 때마다 컴포넌트 함수 재실행되지 않음. but 상태는 업데이트하면 컴포넌트 함수 재실행됨.
- 상태는 바로 UI에 업데이트되야하는 value 있을때 씀. 그리고 시스템 내부에 보이지 않는 쪽에서 다루는 값들이나 UI에 직접적인 영향을 끼치지 않는 값들 갖고 있을 때 쓰면 안됨.
- refs는 DOM 요소에 바로 접근하고 싶으때 씀. browser APIS 등등
- setTimeout은 timer의 포인터를 반환함. clearTimeout(timer 포인터) 하면 타이머 멈춤,

```jsx
import { useState, useRef } from "react";

export default function TimerChallenge({ title, targetTime }) {
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const timer = useRef(null);

  function handleStart() {
    setTimerStarted(true);
    timer.current = setTimeout(() => {
      setTimerExpired(true);
    }, targetTime * 1000);
  }

  function handleStop() {
    clearTimeout(timer.current);
  }
  return (
    <section className="challenge">
      <h2>{title}</h2>
      {timerExpired && <p>You lost!</p>}
      <p className="challenge-time">
        {targetTime} second{targetTime > 1 ? "s" : ""}
      </p>
      <p>
        <button onClick={timerStarted ? handleStop : handleStart}>
          {timerStarted ? "Stop" : "Start"} Challenge
        </button>
      </p>
      <p className={timerStarted ? "active" : undefined}>
        {timerStarted ? "Time is running...':" : "Timer inactive"}
      </p>
    </section>
  );
}
```

- 위에 보면 timer 할때 useRef를 이용했음. 컴포넌트가 재사용될때 참조는 초기화되거나 지워지지 않음. 상태 값들처럼 리액트가 그 timer 값들을 저장함. 함수가 재실행될 때마다 유실되지 않도록 함.
- 컴포넌트 함수 내에 저장되어 있기 때문에 특정 컴포넌트 인스턴스에만 할당됨.
- ref를 받는 쪽에서 forwardRef를 이용해서 받을 수 있음. 두번째 인자로 ref 들어감.

```jsx
import { forwardRef } from "react";

const ResultModal = forwardRef(function ResultModal(
  { result, targetTime },
  ref
) {
  return (
    <dialog ref={ref} className="result-modal">
      <h2>You {result}</h2>
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>X seconds left.</strong>
      </p>
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  );
});

export default ResultModal;
```

- useImperativeHandle는 컴포넌트에서 자신의 함수를 노출하도록 구축하여 컴포넌트 외부에서 ref의 도움으로 호출될 수 잇도록 함. 거의 forwardRef랑 쓰임. 코드보면서 이해하셈.
- setTimeout은 정해진 시간 지나면 함수실행하는거지만 setInterval은 인터벌마다 실행함.

## Portals(포탈) 소개 및 이해하기.

- HTML 구조의 해당 위치에 매핑할 수 있음.
- react-dom 에 있는 createPortal 을 이용, 렌더링이 될 HTML 코드를 DOM 내에 다른 곳으로 옮기는 것

```jsx
//ResultModal.jsx  id modal 인 곳으로 렌더링 됨.
return createPortal(
    <dialog ref={dialog} className="result-modal" onClose={onReset}>
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with{" "}
        <strong>{formattedRemainingTime} seconds left.</strong>
      </p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById("modal")
  );
});


//index.html
<div id="modal"></div>
```

- 모달, 툴팁, 드롭다운, 알림 등 다른 요소들 위에 떠있어야할때 유용함. 이 중첩된 컴포넌트가 상위 컴포넌트의 스타일에 영향을 받지 않고 특정 위치에 고정되어야 할 때 쓸 수 있음.
