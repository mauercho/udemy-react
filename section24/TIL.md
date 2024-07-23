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

## 쿼리 동작 이해 및 구성 -> 캐시 및 만료된 데이터

- Tanstack의 중요한 기능 중 하나 캐시 처리. 리액트 쿼리는 응답 데이터를 캐시 처리함.
- 커스텀 fetch 로직을 사용할 때는 새 요청을 전송해서 다시 데이터 가져와야 했음.
- 응답 데이터를 캐시 처리하고 나중에 동일한 쿼리 키를 가진 다른 useQuery가 실행되면 이 데이터를 재사용함. 컴포넌트 함수가 다시 실행되면 리액트 쿼리가 확인후 캐시 처리된 데이터면 데이터 즉시 제공
- 동시에 내부적으로 요청 재전송해서 업데이트된 내용 있나 확인 후 교체

```jsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["events"],
  queryFn: fetchEvents,
  staleTime: 5000,
  gcTime: 30000,
});
```

- gcTime 데이터와 캐시를 얼마나 보관할지 설정. 기본은 5분임.
- staleTime: 업데이트된 데이터를 가져오기 위한 자체적인 요청을 staleTime 이후에 함.

## 동적 쿼리 함수 및 쿼리 키

```jsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["events", { search: searchTerm }],
  queryFn: () => fetchEvents(searchTerm),
});
```

- 이런 식으로 queryKey 넣어주면 입력값에 따라 중복되지 않고 다양한 입력 값에 따라 캐싱 가능함.

```jsx
export async function fetchEvents(searchTerm) {
  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += "?search=" + searchTerm;
  }
  const response = await fetch(url);

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

- fetchEvents 자체도 이런 식으로 바꿀 수 있음.

## 쿼리 구성 객체 및 요청 취소

- Network 탭 들어가면: http://localhost:3000/events?search=[object%20Object] 뜸/
- 위의 코드에서 console.log(searchTerm) 해보면 결과에 signal 있는거 확인 가능
- 리액트 쿼리는 쿼리 함수에 기본적으로 데이터를 전달함.
- 위의 예시에서는 fetchEvents에 데이터 전달. 전달되는 데이터는 쿼리에 사용된 쿼리키와 신호에 대한 정보 제공하는 객체
- 신호는 요청 취소할 때 필요함.
- 객체 구조 분해 이용해서 추출 가능
- export async function fetchEvents({ signal, searchTerm })

```jsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["events", { search: searchTerm }],
  queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
});
```

## 쿼리 활성화 및 비활성화

- useQuery 구성객체에 enabled 있음. default는 true인데 false로 설정하면 쿼리 비활성화되고 요청 전송되지 않음.
- const [searchTerm, setSearchTerm] = useState(undefined) 이런 식으로 undefined로 줘서 처음에만 enabled false로 만들 수 있음.
- isLoading과 isPending의 차이는 쿼리가 비활성화되었다고 해서 True가 되지 않음. 예제 같은 경우 비활성화되었을떄 isPending이 true 가 되어서 LoadingIndicator 컴포넌트가 실행되었었음.

## 변형을 사용하여 데이터 변경

- useQuery는 데이터 가져올 때만 씀.
- 데이터를 전송하고 POST 요청을 하려면 useMutation 사용해야함. 최적화되어있다고 보면됨.
- useMutation은 컴포넌트가 렌더링 될때 즉시 전송되지 않고 필요할때만 요청 전송되게 할 수 있음.

```jsx
export default function NewEvent() {
  const { mutate } = useMutation({
    mutationFn: createNewEvent,
  });
  function handleSubmit(formData) {
    mutate({ event: formData });
  }
}
```

- 이런 식으로 써주면 된다. data도 받을 수 있는데 여기서는 안씀
- POST 요청 보낼때는 캐시처리 안하기 때문에 보통 mutationKey 사용하지 않음.
- 렌더링 될 때 useQuery마냥 즉시 사용되는게 아니라 mutate 쓸때만 적용됨. 백엔드에 필요한 데이터의 형태에 맞춰 formData 전달함.

```jsx
export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });
  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event. Please check your input and try again."
          }
        />
      )}
    </Modal>
  );
}
```

- 최종적으로 error 까지 넣은거임.
- EventForm.jsx 파일 변경함.

## 변형 성공 시 동작 및 쿼리 무효화

```jsx
function handleSubmit(formData) {
  mutate({ event: formData });
  navigate("/events");
}
```

- 제출 할때 이렇게 써줄 수 있음. 그러나 변형의 성공 여부와 상관 없이 페이지 나가게 됨.

```jsx
const { mutate, isPending, isError, error } = useMutation({
  mutationFn: createNewEvent,
  onSuccess: () => {
    navigate("/events");
  },
});
```

- useMutation에 onSuccess 있는데 성공할때만 navigate 호출
- navigate 호출해도 변형된 정보들이 뜨지 않음. 다른 페이지로 이동했다가 다시 돌아와야함.
- 데이터가 변경된 것이 확실한 경우에 리액트 쿼리가 즉시 데이터를 가져오게 하고 싶음.
- 리액트 쿼리에서 제공하는 메소드를 이용해 하나 이상의 쿼리를 무효화 하여 데이터가 오래돼서 다시 가져와야한다는 것을 리액트 쿼리에 알려줄 수 있음.

```jsx
// 기존 App.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

// 변형
//http.js
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

// App.jsx
import { queryClient } from "./util/http.js";

// NewEvent.jsx
import { queryClient } from "../../util/http.js";
const { mutate, isPending, isError, error } = useMutation({
  mutationFn: createNewEvent,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
    navigate("/events");
  },
});
```

- queryClient.invalidateQueries({ queryKey: ["events"] }); 으로 성공했을때 'events' 가 포함된 쿼리 키를 무효화함. queryKey: ["events", { search: searchTerm }], 이것도 무효화함.
- queryClient.invalidateQueries({ queryKey: ["events"], exact:true }); 쓰면 정확히 일치하는 쿼리만 무효화됨.
- 위 같은 경우는 FindEventSection 에서 사용자가 입력한 검색어를 기준으로 이벤트를 검색하는데 당연히 새로 추가된 이벤트도 범위에 넣어야하므로 exact:true 써줄 필요 없음.

## 무효화 후 자동 다시 가져오기 비활성화

- 삭제할때 주의할점.

```jsx
const { mutate } = useMutation({
  mutationFn: deleteEvent,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["events"],
    });
    navigate("/events");
  },
});
```

- invalidateQueries 이거 할때 무효화 되므로 리액트 쿼리가 즉시 세부 정보 쿼리의 다시 가져오기 트리거함. 세부 정보 페이지에 있기 때문에 이것도 가져올라고 하는데 없어서 로그에 에러메세지를 뜸.

```jsx
const { mutate } = useMutation({
  mutationFn: deleteEvent,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["events"],
      refetchType: "none",
    });
    navigate("/events");
  },
});
```

- 이러면 기존 쿼리가 즉시 자동으로 트리거 되지 않음.

```jsx
const {
  mutate,
  isPending: isPendingDeletion,
  isError: isErrorDeleting,
  error: deleteError,
} = useMutation({
  mutationFn: deleteEvent,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["events"],
      refetchType: "none",
    });
    navigate("/events");
  },
});
```

- 이런 식으로 써줄 수 있음. 위 경우는 useQuery랑 겹쳐가지고 이름 바꿈.
