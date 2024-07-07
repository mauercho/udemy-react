import { useState } from 'react';
import styles from './App.module.css';
import TodoForm from './Components/TodoForm/TodoForm';
import TodoList from './Components/TodoList/TodoList';

function App() {
  // 이 컴포넌트에서 todos와 setTodos를 직접 사용하지는 않는다.
  // 하지만 하위 컴포넌트인 TodoList와 TodoForm에서 사용하기 위해 여기에 선언한다.
  // 이를 해결하기 위해 Zustand같은 상태 관리 라이브러리를 사용한다.
  const [todos, setTodos] = useState([]);
  const addTodo = (todo) => setTodos([...todos, todo]);
  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className={styles.wrapper}>
      <h1>Todo list</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        removeTodo={removeTodo}
      />
    </div>
  );
}

export default App;
