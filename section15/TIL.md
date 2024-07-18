# HTTP 요청 보내기 (데이터베이스 연결)

## HTTP 보내기

- 내장 fetch 함수로 HTTP 요청 보낼 수 있음. 브라우저에서 제공하는 함수
- Promise 반환해줌. 표준 자바스크립트 객체이며 해당 state에 따라 다른 값을 산출해냄.
- then에 전달하는 함수는 Response 받고 나서 한 번 실행됨. 즉각적인 과정 아님.
- 최신 자바스크립트에서는 await 키워드 사용해서 Responses 접근 가능 -> 비동기로 실행될때 되는데 컴포넌트 함수들에게는 허용되지 않음

```jsx
const [availablePlaces, setAvailablePlaces] = useState([]);

fetch("https://localhost:3000/places")
  .then((response) => {
    return response.json();
  })
  .then((resData) => {
    setAvailablePlaces(resData.places);
  });
```

- 이렇게만 써주면 무한루프 나옴. useEffect 쓰셈.
- 비동기(async) await 구문 쓸수도 있음. 새로운 함수 안에 쓰면 됨. ex) useEffect() 실행 함수 안에 쓰기. 정의 해주고 바로 쓰기

```jsx
const [availablePlaces, setAvailablePlaces] = useState([]);
const [isFetching, setIsFetching] = useState(false);
useEffect(() => {
  async function fetchPlaces() {
    setIsFetching(true);
    const response = await fetch("http://localhost:3000/places");
    const resData = await response.json();
    setAvailablePlaces(resData.places);
    setIsFetching(false);
  }
  fetchPlaces();
  // fetch("http://localhost:3000/places")
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((resData) => {
  //     setAvailablePlaces(resData.places);
  //   });
}, []);
// setIsFetching 이용해서 파일 로딩중일때 상태표시 따로만들수 있음.
```

## HTTP 에러 다루기.

- 두가지 있음. 요청 보내는 것에 실패하기. 백엔드가 에러 응답 보내기.
- 보통 아래처럼 로딩, 데이터, 에러 세가지를 useState 씀.

```jsx
import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        if (!response.ok) {
          const error = new Error("Failed to fetch places.");
          throw error;
        }
        setAvailablePlaces(resData.places);
      } catch (error) {
        setError({ message: error.message || "Could not fetch places" });
      } // 에러 메시지 없으면 에러 메세지 설정

      setIsFetching(false);
    }

    fetchPlaces();
    // fetch("http://localhost:3000/places")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((resData) => {
    //     setAvailablePlaces(resData.places);
    //   });
  }, []);
  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
```

```jsx
// 최종 수정 loc.js 추가 setAvailablePlaces를 geolocation 함수 실행되고 작용하고 싶어서 넣어줌. 에러가 발생하나 안하나 setIsFetching(false) 넣어줌.
import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        if (!response.ok) {
          const error = new Error("Failed to fetch places.");
          throw error;
        }
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            resData.places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({ message: error.message || "Could not fetch places" });
        setIsFetching(false);
      }
    }

    fetchPlaces();
    // fetch("http://localhost:3000/places")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((resData) => {
    //     setAvailablePlaces(resData.places);
    //   });
  }, []);
  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
```

## 코드 추출 및 코드 개선

- 외부로 코드를 옮겨서 재사용될 수 있게 할 수 있음.

```js
// http.js
export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error("Failed to fetch places.");
    throw error;
  }
  return resData.places;
}

// AvailablePlaces.jsx
const places = await fetchAvailablePlaces(); // 비동기함수 받을땐 await 써줘야함. 안 써주면 그냥 이상한 값 받을거임.
```

- POST 요청으로 데이터 전송

```js
export async function updatePlaces(places) {
  const response = fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({ places: places }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user data.");
  }
  return resData.message;
}
```

- 아래와 같은 식으로 받아옴. 형식에 맞춰서 body 에 보내줌. body: JSON.stringify({ places: places }),

```jsx
try {
  await updatePlaces([selectedPlace, ...userPlaces]);
} catch (error) {
  setUserPlaces(userPlaces);
  setErrorUpdatingPlaces({
    message: error.message || "Failed to update places.",
  });
  // 이렇게 하면 에러 났을때 예전꺼 넣어줌.
}
```

## 최적의 업데이트 방법

- const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(); 이걸 만들어서 에러 업데이트 가능하게 만들어주고

```jsx
<Modal open={errorUpdatingPlaces} onClose={handleError}>
  {errorUpdatingPlaces && (
    <Error
      title="An error occurred!"
      message={errorUpdatingPlaces.message}
      onConfirm={handleError}
    />
  )}
</Modal>
```

- 이런식으로 에러 날때마다 모달로 띄우는 방법이 있음.

## 데이터 삭제 요청

```jsx
const handleRemovePlace = useCallback(
  async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updatePlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      );
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to delete place.",
      });
    }
    setModalIsOpen(false);
  },
  [userPlaces]
);
```

- 이거 추가해서 삭제 구현 상태 업데이트 할 때와 똑같은 로직임.

- 이번 단원은 좀 어려워서 한번씩 싹 보고 이해 안되는 부분은 다시 돌려보는 식으로 하면 좋을듯.
