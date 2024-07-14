# Side Effects 다루기 & useEffect() 훅 활용

## 부수 효과가 무엇일까?

- 앱이 제대로 동작하기 위해 실행되어야 하지만 현재의 컴포넌트 렌더링 과정에 직접적인 영향을 미치지 않는 작업.

```jsx
navigator.geolocation.getCurrentPosition((position) => {
  const sortedPlaces = sortPlacesByDistance(
    AVAILABLE_PLACES,
    position.coords.latitude,
    position.coords.longitude
  );
});

// 렌더링되는 것과 전혀 관련이 없는거. 물론 언젠가 실행이 되겠지만 렌더링 다되고 실행될거임. 브라우저에게 본인 위치를 알려주라는 명령어가 navigater.geolocation.getCurrentPosition
```

## 부수 효과의 잠재적 문제

- 무한 루프 생성 가능

```jsx
const [availablePlaces, setAvailablePlaces] = useState([]);
navigator.geolocation.getCurrentPosition((position) => {
  const sortedPlaces = sortPlacesByDistance(
    AVAILABLE_PLACES,
    position.coords.latitude,
    position.coords.longitude
  );

  setAvailablePlaces(sortedPlaces);
});
```

- 위 코드 같은 경우 setAvailablePlaces 하면 App 컴포넌트 다시 실행하고 다시 navigator 하면 다시 setAvailablePlaces 하고 무한 루프 -> useEffect 훅으로 해결 가능

## useEffect를 사용하는 부수효과

- 아래와 같이 써주면 됨.useEffect의 경우 값을 반환하지 않고 두개의 인수 필요. 부수 효과 코드를 묶어줄 함수, 의존성 배열. useEffect의 첫 인수인 함수가 리액트로 인해 실행되는 시점은 매번 컴포넌트가 실행된 이후임.
- 그리고 의존성 배열이 변화했을 경우에 한에 Effect 함수 재실행해줌.

```jsx
useEffect(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = sortPlacesByDistance(
      AVAILABLE_PLACES,
      position.coords.latitude,
      position.coords.longitude
    );

    setAvailablePlaces(sortedPlaces);
  });
}, []);
```

## 모든 부수효과가 useEffect를 사용하지 않는이유

- 훅의 규칙: 중첩된 함수나 if문 등에서 리액트 훅의 사용이 불가능함.
- useEffect 훅이 필요한 경우는 무한 루프 방지 위해서거나 컴포넌트 함수가 최소 한번 실행된 이후에 작동이 가능한 코드가 있을때 뿐임.

```jsx
// 이걸로 브라우저 localStorage 에 저장 가능함. 먼저 받아오고 selectedPlaces 가 없으면 빈배열줌,
// storeIds에 id 가 없는 것만 localStorage에 저장. 저장하기 위해서는 문자열로 바꿔야함.
const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
if (storeIds.indexOf(id) === -1) {
  localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storeIds]));
}

// 위같은 경우 useEffect 필요없음.

const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
localStorage.setItem(
  "selectedPlaces",
  JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current))
);
// 저 조건이 true인것만 필터링해줌.

const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storeIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);
// 이걸 컴포넌트 함수 밖에서 정의해서 활용함.
```

## useEffect를 활용하는 다른 적용 사례

- 컴포넌트 함수이후에 useEffect() 가 실행되기 때문에 특정 값을 동기화 시키고자 하기위해서 useEffect 쓸 수 있음.

```jsx
useEffect(() => {
  if (open) {
    dialog.current.showModal();
  } else {
    dialog.current.close();
  }
}, []);
```

- 위 상황에서 그냥 깡으로 if 먼저 썼으면 dialog 정의 안돼서 에러뜸.

## Effect Dependencis 이해하기.

-

```jsx
useEffect(() => {
  if (open) {
    dialog.current.showModal();
  } else {
    dialog.current.close();
  }
}, [open]);

// open이 바뀔때 다시 함수 실행됨.
```

```jsx
//App.jsx
<Modal open={isModalOpen} onClose={handleStopRemovePlace}>
  <DeleteConfirmation
    onCancel={handleStopRemovePlace}
    onConfirm={handleRemovePlace}
  />
</Modal>;

//DeleteConfirmation.jsx
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  setTimeout(() => {
    onConfirm();
  }, 3000);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}

// 위 같은 경우 DeleteConfirmation 컴포넌트 함수가 Modal 안에 있어 무조건 실행됨.

<Modal open={isModalOpen} onClose={handleStopRemovePlace}>
  {isModalOpen && (
    <DeleteConfirmation
      onCancel={handleStopRemovePlace}
      onConfirm={handleRemovePlace}
    />
  )}
</Modal>;
// 이렇게 해결 가능 아니면 Modal children 건드려서 해결 가능

// Modal.jsx
return createPortal(
  <dialog className="modal" ref={dialog} onClose={onClose}>
    {open ? children : null}
  </dialog>,
  document.getElementById("modal")
);
```

## useEffectd의 Cleanup 함수

- 이런 식으로 써줄 수 있음. return의 함수는 컴포넌트 함수가 사라지기 바로 전이나 effect 함수가 다시 작동하기 바로 전에 실행됨. 저 return 안써줬으면 timer가 안꺼져 모듈 껐어도 무조건 onConfirm() 함수 실행되었을거임.

```jsx
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log("Timer set");
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);
    return () => {
      console.log("Timer cleared");
      clearTimeout(timer);
    };
  }, []);

```

- useEffect는 무한루프에 빠질 위험이 항상 있음. 의존성 배열에 함수를 넣은 경우 컴포넌트가 재사용되면 함수가 재생성되는데 그 함수는 이름 같아도 다른 함수임. 그럼 useEffect 다시 실행됨.
- 이를 해결하기위에 컴포넌트를 아예 조건에 따라 지워버리는 식으로 해결할 수 있음. 또 다른 특별한 리액트 훅을 사용해서 더 안전하게 쓸 수 있음.

## useCallback 훅

- React에 함수가 항상 재생성되지 않도록 하기 위해 사용할 수 있는 hook
- useCallback은 value를 return 함. 주변 컴포넌트 함수가 다시 실행되는 경우마다 재생성되지 않는 방식으로 return. React는 메모리로서 내부에 함수 저장하고 해당 컴포넌트 함수가 다시 실행될때마다 메모리로서 저장된 함수 재사용함.
- 두번째 인자 받는 것도 종속성 바뀌었을 떄 useCallback 내 함수를 다시 만들음.

```jsx
const handleRemovePlace = useCallback(function handleRemovePlace() {
  setPickedPlaces((prevPickedPlaces) =>
    prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
  );
  setModalIsOpen(false);

  const storeIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  localStorage.setItem(
    "selectedPlaces",
    JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current))
  );
}, []);
```

```jsx
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("INTERVAL");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    console.log("Timer set");
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);
    return () => {
      console.log("Timer cleared");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress max={TIMER} value={remainingTime} />
    </div>
  );
}
```

- 위에 코드 같은 경우 setInterval() 부분에서 10ms 마다 리액트는 JSX 코드 전체 확인해야함. 최적화 가능. 시간 관련한 것을 다른 컴포넌트에 넣으면 됨.

```jsx
//ProgressBar.jsx 생성해서 넣고

import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("INTERVAL");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <progress max={timer} value={remainingTime} />;
}

//DeleteConfirmation.jsx
<ProgressBar timer={TIMER} />;

// 해주면됨.
```
