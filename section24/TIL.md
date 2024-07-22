# 리액트 쿼리/Tanstack 쿼리: 간단하게 HTTP 요청 처리

## 리액트 쿼리: 소개 및 이점

- Tanstack 쿼리는 HTTP 요청을 전송하고 프론트엔드 사용자 인터페이스를 백엔드 데이터와 동기화된 상태로 유지하는데 이용하는 라이브러리
- useEffect fetch 함수로도 수행가능하지만 코드가 매우 간결해짐.
- 캐시 처리, 자체적으로 처리되는 데이터 가져오기뿐 아니라 앱을 더 효율적으로 만들어줄 모든 기능 사용할 수 있음.

## Tanstack 쿼리를 설치하고 사용하는 방법과 유용한 이점

- Tanstack 쿼리에는 HTTP 요청을 전송하는 로직이 내장되어 있지 않음. 대신 요청을 관리하는 로직을 제공함.
- 전송하는 모든 GET HTTP 요청에는 쿼리 키 있음. Tanstack 쿼리는 내부에서 이 쿼리 키를 이용해 요청으로 생성된 데이터를 캐시 처리함. 그래서 나중에 동일한 요청을 전송하면 이런 요청의 응답을 재사용함.
- queryKey 는 배열임. 이 값의 배열을 리액트 쿼리는 내부적으로 저장하고 유사한 값으로 이루어진 유사한 배열 사용할 때마다 배열 확인 후 기존 데이터를 재사용함.
- useQuery가 실행되면 객체 얻을 수 있는데 객체에서 구조 분해를 사용해 가장 중요한 요소 추출할 수 있음.
- npm install @tanstack/react-query

```jsx
// newEvents.jsx
import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
```

- data, isPending, isError, error 보면 isPending은 상태 불러오고 있을때 isError는 에러 있으면 throw 에러 있어야함. error는 에러 메세지.

```js
// 여기다가 받아오는거 담아뒀음.
export async function fetchEvents() {
  const response = await fetch("http://localhost:3000/events");

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
```

- 그러나 몇가지 더해줘야함. RouterProvider를 Tanstack 쿼리의 다른 프로바이더 컴포넌트와 래핑해야함.
- import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

```jsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

- 이제 데이터베이스에서 데이터 변경된경우 실시간으로 바로 바뀐거 반영됨.
