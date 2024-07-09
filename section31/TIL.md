# 리액트 요약 및 핵심 기능 둘러보기

## 리액트란 무엇이고 왜 쓰는가 ?

- 리액트는 UI를 만들어주는 자바스크립트 라이브러리.
- 자바스크립트는 명령형 방식, 리액트는 선언형 방식 (전자는 일련의 명령 과정 쭉 나열, 후자는 상태 정의하고 어떤 상황에서 상태 활성화 할 건지 등의 코드 추가)

## 리액트 프로젝트 생성하기

- 프로젝트를 생성할 때 필요한 기능과 도구들을 가지고 있는 도구가 create react app임. 또 다른 도구로 vite가 있음.
- node.js 깔아야함. 프로젝트 자체와 빌트인 도구들이 node.js 를 이용하기 때문임.
- npx create-react-app or npm create vite로 새 프로젝트 생성
- npm install -> 서드파티 패키지들을 설치하는데 바로 리액트 앱을 빌드하고 실행하거나 미리보기를 할 수 있게 도와주는 패키지들임.
- create vite로 설치 했다면 npm run dev 아니면 npm start로 실행

## 리액트와 컴포넌트 배우기

- main.jsx -> 파일의 진입점을 가지고 있는 전체 애플리케이션의 메인 파일. 웹사이트가 로딩될때 이 파일에 있는 코드가 제일 먼저 실행됨.
- package.json 파일은 node.js가 이용하는데 프로젝트의 의존성을 관리함. react + react dom => 리액트 라이브러리
- ReactDOM.createRoot(document.getElementById('root')).render(): root이라는 ID를 가진 요소 안에 이 리액트 코드를 렌더하라는 것
- \<React.StrictMode> \</React.StrictMode>: 우리가 작성한 코드가 최적인지 아닌지 알게 해주는 코드
- import App from './App' \<App />: App render 됨.

```jsx
function App() {
  return <h1>Hello World!</h1>;
}

export default App;
```

- 이런걸 리액트 컴포넌트라고 함. 리액트는 컴포넌트가 전부라고 해도 과언이 아님. 리액트를 빌드한다는 것은 컴포넌트를 빌드한다는 것
- render 함수에 전달한 것은 h1 요소인 거임. 컴포넌트들은 보통 jsx코드 리턴함.

## 커스텀 컴포넌트 만들어보기

- 함수 이름 첫글자는 대문자여야함. 소문자로 하면 html 요소로 인식함.
- 보통 리액트 만들때 최상위 컴포넌트 하나만 둠. main.jsx 파일안에 App 컴포넌트 하나만 있는거 확인. 따라서 App 컴포넌트의 jsx 코드에 Post 컴포넌트를 넣어야함.
- 함수인데 Post() 이런식으로 쓰는게 아니라 \<Post /> 이런 식으로 씀. 컴포넌트 함수들의 특징
- 컴포넌트 함수에 자바스크립트 코드 실행시킬 수 있음.

```jsx
const names = ["Maximilian", "Manuel"];

function Post() {
  const chosenName = Math.random() > 0.5 ? names[0] : names[1];
  return (
    <div>
      <p>{chosenName}</p>
      <p>React.js is awesome!</p>
    </div>
  );
}

export default Post;
```

- 중괄호로 감싸주면 리액트는 안에 있는 상수나 변수를 찾아서 그 안에 저장된 값을 출력해줌.

```jsx
function App() {
  return (
    <main>
      <Post />
      <Post />
      <Post />
      <Post />
    </main>
  );
}
```

- 위와 같은 방식으로 컴포넌트 재사용 가능. but 상위 컴포넌트로 감싸줘야함. 이 경우에는 main. 그냥 \<> \</> 이런 식으로 감싸줘도 됨.
- \<Post /> 이렇게 self closing 태그로 처리해도 되고 \<Post> \</Post> 이렇게 써줘도 됨.

```jsx
<Post author='Maximiliah' body='React.js is awesome!'/>
<Post author='Manuel' body='Check out the full course!'/>
```

```jsx
function Post(props) {
  return (
    <div>
      <p>{props.author}</p>
      <p>{props.body}</p>
    </div>
  );
}
```

- 이런 식으로 써줄 수 있음.
- 컴포넌트에 css 추가 할 수도 있음. 그냥 index.css에 추가해주고 \<div className="클래스이름"> 이렇게 써줄수 있음.
- jsx에서는 class 가 아니라 className으로 씀.
- 전역클래스로 쓰면 충돌이 날 확률이 큼.
- create react app 이나 vite 로 생성한 리액트 프로젝트라면 해결 방법 있음. 전용 css 파일 만들기. 보통 관련 jsx 파일 옆에 위치시킴.
- 이름을 Post.module.css 이런 식으로 써야함.
- Vite나 create react app에게 css module 기능을 쓸거라고 알려주는 거임.
- CSS에서 정의한 HTML이나 JSX에서 활용하는 클래스 이름이 알아서 자동으로 고유한 클래스 이름으로 변환되어 이름 충돌이 발생하지 않음.

```jsx
import classes from "./Post.module.css";

function Post(props) {
  return (
    <div className={classes.post}>
      <p className={classes.author}>{props.author}</p>
      <p className={classes.text}>{props.body}</p>
    </div>
  );
}

export default Post;
```

- 위 같이 쓰면 됨. classes 라는 객체의 프로퍼티에 저장된 값을 위해 표현하는 부분
- className가 class를 대신한 것처럼 htmlFor이 for을 대신함.

## 이벤트 리스너 추가하기

- 웹사이트엔 상태라는게 많이 존재함.
- 상태 등록후 이벤트리스너만들기.
- 이벤트이름은 camelCase ex)onChange

```jsx
import classes from "./NewPost.module.css";

function NewPost() {
  function changeBodyHandler(event) {
    console.log(event.target.value);
  }

  return (
    <form className={classes.form}>
      <p>
        <label htmlFor="body">Text</label>
        <textarea id="body" required rows={3} onChange={changeBodyHandler} />
      </p>
      <p>
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" required />
      </p>
    </form>
  );
}

export default NewPost;
```

## 상태 적용하기

```jsx
let enteredBody = "";

function changeBodyHandler(event) {
  enteredBody = event.target.value;
}
```

- 이런 식으로 하는 건 안됨.
- 리액트는 컴포넌트 함수를 실행하면서 함수가 반환하는 jsx 코드를 실행함. 스냅샷 찍고 콘텐츠를 화면에 뿌려야함. 컴포넌트 함수가 실행된 한번만 JSX코드 가져감.
- 그래서 리액트 기능을 이용해서 특별한 방식으로 변수 생성해야함.
- useState import 해야함. 리액트의 빌트인 함수들은 다 use로 시작함.
- 이걸 사용함으로써 제일 처음에 렌더링 된 JSX 코드의 스냅샷이랑 달라졌다면 리액트는 업데이트가 필요한 UI를 업데이트함. 바뀌기 전과 바뀌기 후의 스냅샷 차이를 비교함.

```jsx
const [enteredBody, setEnteredBody] = useState("");

function changeBodyHandler(event) {
  setEnteredBody(event.target.value);
}

<p>{enteredBody}</p>;
```

- 이런 식으로 써주면 됨.
- 뒤에는 상태를 업데이트해주는 함수, 앞에는 현재 상태 값
- 그래서 상태를 업데이트 해줌.

## 상태 올리기

- 다른 컴포넌트 요소의 값을 전달해야함. ex) NewPost 상태 값을 PostList에 전달해야함.
- 상태를 이용할 컴포넌트는 두 컴포넌트에 모두 접근 가능한 컴포넌트로 해야함. 여기서는 PostList.

## children 프로포터

- NewPost 컴포넌트에 적용된 폼 스타일을 모달처럼 보이도록 바꾸기.
- Modal로 그냥 감싸면 안됨. 리액트는 컴포넌트의 어느 위치에 래핑된 콘텐츠를 표시해야하는지 알지 못함.
- childern이란 예약된 속성 사용.
- 기존에는 props 쓰고 props.author 이런 식으로 했는데 props 쓰는 곳이 {author, book} 이런 식으로 쓰고 바로 {author} 등으로 접근 가능

```jsx
import classes from "./Modal.module.css";

function Modal({ children }) {
  return (
    <>
      <div className={classes.backdrop} />
      <dialog open className={classes.modal}>
        {children}
      </dialog>
    </>
  );
}

export default Modal;
```

- children이 참조하는 건 언제나 사용자 정의 컴포넌트의 본문 태그 안에 담겨 전달되는 콘텐츠
- 여기서는 NewPost 컴포넌트라는 콘텐츠가 Modal 컴포넌트 함수의 children 속성값으로 들어온거임.
- dialog의 open 속성을 써줘서 자동으로 켜지게 했음.

## 상태를 이용한 조건부 콘텐츠 로딩

- const [modalIsVisible, setModalIsVisible] = useState(true) 이런 식으로 주고 \<Modal onChange={hideModalHandler}> 하면됨.
- modalIsVisible을 이용한 3가지 방법

  ```jsx
  {
    modalIsVisible ? (
      <Modal onChange={hideModalHandler}>
        <NewPost
          onBodyChange={bodyChangeHandler}
          onAuthorChange={authorChangeHandler}
        />
      </Modal>
    ) : null;
  }
  ```

  ```jsx
  let modalContent;
  if (modalIsVisible) {
    modalContent = (
      <Modal onClose={hideModalHandler}>
        <NewPost
          onBodyChange={bodyChangeHandler}
          onAuthorChange={authorChangeHandler}
        />
      </Modal>
    );
  }
  return <>{modalContent}</>;
  ```

  ```jsx
  {
    modalIsVisible && (
      <Modal onClose={hideModalHandler}>
        <NewPost
          onBodyChange={bodyChangeHandler}
          onAuthorChange={authorChangeHandler}
        />
      </Modal>
    );
  }
  ```

- 함수를 값으로 받는 프로퍼티 만들때 이름 앞에 on 붙이는게 관례임. 여기서 값으로 받은 함수는 JSX 컴포넌트 코드에 있는 이벤트 리스너와 연결되어 사용된다는 것을 명확하게 표시함.

## 이전 상태를 기반으로 상태 갱신하기.

```jsx
const [posts, setPosts] = useState([]);
function addPostHandler(postData) {
  setPosts([postData, ...posts]);
}
```

- 이런 식으로 하면 안됨. 리액트 내부에서 상태 갱신 함수를 곧바로 실행한다는 보장이 없음. 상태 갱신을 예약해둘뿐임. 여러 업데이트가 일어날때 엉킬 가능성 있음.
- 리액트가 버전을 갱신할떄 최신 버전의 유효한 상태를 가져와 제대로 갱신하기 위한 방법

```jsx
function addPostHandler(postData) {
  setPosts((existingPosts) => [postData, ...existingPosts]);
}
```

```jsx
{
  posts.length > 0 && (
    <ul className={classes.posts}>
      {posts.map((post) => (
        <Post key={post.body} author={post.author} body={post.body} />
      ))}
    </ul>
  );
}
```

- 내장 메서드 map을 이용함. 배열의 모든 항목에 대해 Post Jsx 로 바꿔줌.
- key 프로퍼티 안써주면 오류는 안나는데 경고남.

## 리액트 SPA에 백엔드 추가하기.

- 데모 웹사이트는 브라우저 내에서만 작동
- 리액트로 만드는 것은 대부분 싱글페이지어플리케이션임. html 파일 하나만 있고 화면에 있는 모든 동작들은 자바스크립트에 의한 것
- 백엔드가 있어서 요청을 보내고 응답을 받을 수 있다면, 거기에 데이터베이스를 두고 데이터를 저장할 수 있음.
- 백엔드라는 건 서버에서 구동되는 별도의 웹 애플리케이션, 웹 API, REST API 같은 걸 말합니다
- 리액트는 프론트엔트 라이브러리임. 물론 Nextjs나 Remix 같은 프레임워크를 리액트 윗단에 올려 백엔드 코드와 섞어 리액트 앱에서 쓸 수 있음.

```jsx
function addPostHandler(postData) {
  fetch("http://localhost:8080/posts", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  setPosts((existingPosts) => [postData, ...existingPosts]);
}
```

- 이런식으로 보냄. jso에 저장만 함.
- 이걸 어떻게 가져올까 ? -> get요청 보내고 응답을 받아 업데이트 하는 거임.
- async-await 보통 쓰는데 함수 앞에 async 붙이면 promise 객체 반환. 리액트는 jsx 반환해야함.

```jsx
fetch("http://localhost:8080/posts")
  .then((response) => response.json())
  .then((data) => {
    setPosts(data.posts);
  });
```

- 그냥 이렇게 쓰면 무한루프 발생함. ui 업데이트하면 컴포넌트 함수 다시 실행되고 fetch요청 다시보내고 ... 무한 반복
- useEffect 훅 사용해서 해결 가능. 두개의 인자로 함수하고 배열을 받음.
- useEffect()로 코드를 래핑하면 그 코드는 컴포넌트 함수가 실행될 때마다 매번 실행되지 않음
- useEffect 함수는 언제 실행될까 ? -> 두번째 인자로 받는 배열에 의해 결정됨. 함수 밖에 있는 그 변수 또는 함수가 변경될 때마다 실행됨. 빈 배열이여서 한번만 실행.

## 로딩 상태 관리

```jsx
const [isFetching, setIsFetching] = useState(false);
useEffect(() => {
  async function fetchPosts() {
    setIsFetching(true);
    const response = await fetch("http://localhost:8080/posts");
    const resData = await response.json();
    setPosts(resData.posts);
    setIsFetching(false);
  }
  fetchPosts();
}, []);
```

- 이런식으로 setIsFetching으로 로딩 상태때 어떻게 나올지 표시할 수 있음./

```jsx
{
  !isFetching && posts.length === 0 && (
    <div style={{ textAlign: "center", color: "white" }}>
      <h2>There are no posts yet</h2>
      <p>Start adding some!</p>
    </div>
  );
}
{
  isFetching && (
    <div style={{ textAlign: "center", color: "white" }}>
      <p>Loading posts...</p>
    </div>
  );
}
```

## 라우팅 기능 추가

- 라우팅은 간단히 말해 여러 경로를 정의해 여러 페이지를 로드하고 해당 경로에서 다른 컴포넌트를 로드하기 위해 사용함.
- 리액트 앱이 SPA로 만들어 있다고 하더라도 이런 라우팅 동작 구현하는 방법 있음. -> 리액트 라우터 패키지 사용하면 됨.
- npm install react-router-dom 실행

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewPost from "./components/NewPost";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/create-post", element: <NewPost /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

- 이런 식으로 추가하면 됨.

## 레이아웃 라우트 사용법

- 라우트끼리 레이아웃 요소를 공유해야할 때가 있음. ex) 네비게이션 바
- 레이아웃 라우트 쓰면 됨. 내부에 다른 라우트를 포함하는 라우트
- 라우트로 사용하는 컴포넌트는 보통 routes 폴더에 넣음.

```jsx
import MainHeader from "../components/MainHeader";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export default RootLayout;
```

- 이런 식으로 라우트로 사용하는 컴포넌트만듬.
- Outlet 부분에 children이 들어가는 거임.

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewPost from "./components/NewPost";
import "./index.css";
import RootLayout from "./routes/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/create-post", element: <NewPost /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

- 위에 보면 라우터로 사용하는 RootLayout 밑에 children으로 붙은거 확인하고 있음.

## 경로 연결

- a태그를 이용하면 새로운 요청을 리액트 앱에 보냄. 싱글 페이지 어플리케이션을 쓸 때 이러면 전역으로 관리하던 상태 잃어버림. 모든 자바스크립트 코드 다운로드 다시 받음. 해결방법으로 react-router-dom 의 Link 컴포넌트 사용
- Link도 내부적으로 앵커 요소를 렌더링하지만 Link는 브라우저가 자동으로 요청을 전송하지 못 하게 막아줌.

```jsx
import classes from './Modal.module.css'
import { useNavigate } from 'react-router-dom'

function Modal({children}){
	const navigate = useNavigate()
	function closeHandler() {
		navigate('..')
	}

	return (
		<>
			<div className={classes.backdrop} onClick={closeHandler} />
			<dialog open className={classes.modal}>{children}</dialog>
		</>
	)
```

- 이런 식으로 useNavigate 훅 쓸 수도 있음. ..하면 상위라우트로 이동함.
- Link 도 to=".." 하면 상위라우트로 감.

## loader()로 데이터 가져오기.

- 리액트 6.4 버전 이상부터 있는 데이터의 전송과 회송을 도와주는 기능
- useEffect 대신 쓸수 있음.

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Posts />,
        loader: postsLoader,
        children: [{ path: "/create-post", element: <NewPost /> }],
      },
    ],
  },
]);
```

- 이런 식으로 쓰고 Posts.jsx에서

```jsx
export async function loader() {
  const response = await fetch("http://localhost:8080/posts");
  const resData = await response.json();
  return resData.posts;
}
```

- 이렇게 받을 수 있고 이 posts를 아래와 같이 받을 수 있음.

```jsx
import { useLoaderData } from "react-router-dom";

function PostList() {
  const posts = useLoaderData();
}
```

- loader가 끝나길 기다렸다가 이후에 요소를 렌더링함.

## Form

- Form 요소를 기본 내장 'form' 대신 사용하면 리액트 라우터가 폼 전송을 처리해 브라우저가 요청을 전송하지 못하게 막아줌.
- 그뿐 아니라 모든 입력 데이터를 수집하고 우리 대신 해당 데이터로 객체를 구성해줌.
- redirect를 이용해서 다른 라우트로 이동하게 만들어줄 수 있음.

```jsx
import classes from "./NewPost.module.css";
import { Link, Form, redirect } from "react-router-dom";
import Modal from "../components/Modal";

function NewPost() {
  return (
    <Modal>
      <Form method="post" className={classes.form}>
        <p>
          <label htmlFor="body">Text</label>
          <textarea id="body" name="body" required rows={3} />
        </p>
        <p>
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" name="author" required />
        </p>
        <p className={classes.actions}>
          <Link to=".." type="button">
            Cancel
          </Link>
          <button>Submit</button>
        </p>
      </Form>
    </Modal>
  );
}

export default NewPost;

export async function action({ request }) {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);
  await fetch("http://localhost:8080/posts", {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return redirect("/");
}
```

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Posts, { loader as postsLoader } from "./routes/Posts";
import NewPost, { action as newPostAction } from "./routes/NewPost";
import "./index.css";
import RootLayout from "./routes/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Posts />,
        loader: postsLoader,
        children: [
          { path: "/create-post", element: <NewPost />, action: newPostAction },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

- 동적 라우트를 이용해서 detail 페이지 구현 가능
- 너무 복잡함. 차차 공부하기.
