# 리액트 라우터가 있는 SPA 다중 페이지 구축하기

## 라우팅: 싱글 페이지 애플리케이션에서 다수의 페이지 보여주기

- 주소에 따라 웹사이트에 표시되는 콘텐츠 변경 -> 라우팅이 하는 일
- 지금까지 단순히 다른 경로에 대해 다른 콘텐츠를 로딩하는 방식으로 라우팅을 구현함. -> 새로운 HTTP 요청 전송하고 새로운 응답을 받는 과정에서 사용자의 흐름 중단될 수 있음.
- 싱글페이지 애플리케이션도 라우팅 사용 가능 사용중인 URL 감시하다가 변경될때마다 작동해서 변경되면 화면에 다른 콘텐츠 표시.
- npm install react-router-dom 패키지에서 리액트 라우터 툴 다운.
- 이 패키지로 URL 변경을 감시하고 다양한 콘텐츠를 로딩할 수 있게 됨.
  1.  지원하려는 라우터 정의 필요 (URL과 경로, 다양한 경로에 대해 어떤 컴포넌트가 로딩되어야 하는지 정의해야함.)
  2.  우리의 라우터를 활성화하고 첫번째 라우트 정의를 로딩하는 단계
  3.  컴포넌트들이 있는지 확인하고 이동할 수단을 제공했는지 확인하는 단계

## 라우트 정의하기

- createBrowserRouter -> 패키지에서 제공하는 함수 지원하려는 라우터 정의 가능. 경로 추가 컴포넌트 추가 변수 반환된거 받아야함.
- 이 반환 변수를 사용해야한다고 리액트에게 알리기 위해 RouterProvider 컴포넌트 import

```js
//App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Homepage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductsPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


//Homepage.js
export default function Homepage() {
  return <h2>HomePage</h2>;
}

// Products.js
function ProductsPage() {
  return <h1>The Products page </h1>;
}

export default ProductsPage;


```

## 라우트를 정의하는 다른 방법들

- 예전 버전임. 이런 코드가 있다는 정도 알아두기.

```js
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
const routeDefinitions = createRoutesFromElements(
  <Route>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductsPage />} />
  </Route>
);

const router = createBrowserRouter(routeDefinitions);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

## Link로 페이지들 간에 이동하기.

```js
export default function Homepage() {
  return (
    <>
      <h1>My Home Page</h1>
      <p>
        Go to <a href="/products">the list of products</a>
      </p>
    </>
  );
}
```

- 위와 같은 방식으로 링크 줄 수 있음. 그러나 위의 같은 경우 서버에 새로운 요청을 함. 리액트 애플리케이션 자체를 다시 로딩함. 성능에 많은 영향 미칭. 싱글 페이지 어플리케이션의 장점이 없어짐.
- Link 이용 -> 링크를 클릭했을때 새로운 HTTP 요청을 날리지 않고 라우터에 따른 적절한 페이지 업데이트.

```js
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <>
      <h1>My Home Page</h1>
      <p>
        Go to <Link to="/products">the list of products</Link>
      </p>
    </>
  );
}
```

## 레이아웃 및 중첩된 라우트

- 보통의 페이지 같이 네비게이션바 만들기.

```js
// Root.js
import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import classes from "./Root.module.css";

export default function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main className={classes.content}>
        <Outlet />
      </main>
    </>
  );
}
// Outlet이 children 이 들어올 부분임.

//MainNavigation.js
import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";

export default function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

// App.js
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
    ],
  },
]);

```

## errorElement 로 오류 표시하기.

- 기본 오류 메시지는 react-router-dom 패키지가 생성한 것임.
- 기본 오류 페이지 만들 수 있음.

```js
// Errors.js
import MainNavigation from "../components/MainNavigation";

export default function ErrorPage() {
  return (
    <>
      <MainNavigation />
      <main>
        <h1>An error occured!!</h1>
        <p>Could not find this page!</p>
      </main>
    </>
  );
}

//App.js
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
    ],
  },
]);
```

- errorElement 프로퍼티를 라우터의 정의에서 추가해서 페이지가 오류났을 때 로딩해야할 요소를 지정할 수 있음.

## 네비게이션 링크 사용하기

- react-router-dom이 제공하는 Link 컴포넌트는 일반적인 엥커 요소를 렌더링함.

```js
.list a {
  text-decoration: none;
  color: var(--color-primary-400);
}

.list a:hover,
.list a.active {
  color: var(--color-primary-800);
  text-decoration: underline;
}
// 그래서 이런거 가능
```

- NavLink 를 쓰면 링크가 현재 활성페이지로 인도했는지 알 수 있음.
- Link와 똑같지만 특수한 동작이 하나 더 있음. className 프로퍼티를 추가하면 함수를 받는 프로퍼티가 됨.

```js
//MainNavigation.js
<NavLink
  to="/"
  className={({ isActive }) => (isActive ? classes.active : undefined)}
  end
>
  Home
</NavLink>
// isActive는 react-router-dom 에서 제공하는 프로퍼티 활성화되어 있으면 active 클래스 입힘.
```

- 위 보면 end 있는데 end를 써줌으로써 / 이 주소였을때만 isActive 됨. 기존에는 /products 써도 / active 되었음. (중첩된 자녀 라우터에 있을때도 활성화)

## 프로그래밍적으로 네비게이션 하기.

- useNavigate 이용해서 가능

```js
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  function navigateHandler() {
    navigate("/products");
  }

  return (
    <>
      <h1>My Home Page</h1>
      <p>
        Go to <Link to="/products">the list of products</Link>
      </p>
      <p>
        <button onClick={navigateHandler}>Navigate</button>
      </p>
    </>
  );
}
//button 누르면 /products 페이지로 넘어감.
```

## 동적 라우트 정의하고 사용하기.

- 대부분의 페이지에서 필요한 기능. 다양한 변수에도 동일한 페이지 생성하는 느낌.

```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:productId", element: <ProductDetail /> }, //이 부분
    ],
  },
]);

//ProductDetiail.js
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const params = useParams();

  return (
    <>
      <h1>Product Detail</h1>
      <p>{params.productId}</p>
      {/* 위의 라우터 부분에서 정의한 :productId 랑 같은거 확인 가능  */}
    </>
  );
}
```

- 보통의 상황에서는 아래와 같은 경우가 많음.

```js
import { Link } from "react-router-dom";

const PRODUCTS = [
  { id: "p1", title: "Product 1" },
  { id: "p2", title: "Product 2" },
  { id: "p3", title: "Product 3" },
];

function ProductsPage() {
  return (
    <>
      <h1>The Products page </h1>
      <ul>
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProductsPage;
```

## 절대경로와 상대경로

```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:productId", element: <ProductDetail /> },
    ],
  },
]);
// 이게 절대경로임. 루트 경로를 /root로 바꾸면 다른것들 아무것도 안나옴. /products는 /root/products 가 아닌 /products를 찾을 거임.
      { path: "", element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetail /> },
// 이러면 상대경로임.
// <Link> 도 마찬가지임. 앞에 / 있으면 절대경로. 또 Link 요소에 relative란 변수 추가 가능
// 기본값은 'route', 'path'를 써주면 상대적으로 봐줌.

//ProductDetail.js
import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const params = useParams();

  return (
    <>
      <h1>Product Detail</h1>
      <p>{params.productId}</p>
      <Link to=".." relative="path">
        Back
      </Link>
    </>
  );
} // relative 특성에 path를 줘서 Back 누르면 하나의 세그먼트를 제거해. /products 페이지로 감.


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:productId", element: <ProductDetail /> },
    ],
  },
]); // 안써주면 정의해준대로 /products/:productId 의 부모요소인 / 로 간다.


```

## 인덱스 라우트 사용하기.

- 경로가 없는 일부 라우트에 적용할 수 있음. 즉 부모 라우트에 있는 경로와 동일한 경로에 대해 로딩될때 쓸 수 있음. 여기서는 Homepage
- { index: true, element: \<HomePage /> }, 를 대신 써주면 됨. 부모라우트가 활성화 될떄 로딩되어야하는 기본 라우트인거임.
