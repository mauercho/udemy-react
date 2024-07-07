import  { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() !== '') {
      setTodos([...todos, { text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="mainLayout">
      <div className="todoLayout">
        <div className="todoTop">
          <div className="todoTitle">To Do List</div>
          <div className="todoAdd">
            <input
              type="text"
              placeholder="할 일을 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={addTodo}>추가</button>
          </div>
        </div>
        <div className="listLayout">
          {todos.map((todo, index) => (
            <div key={index} className="todoItem">
              <span
                onClick={() => toggleComplete(index)}
                className={todo.completed ? 'completed' : ''}
              >
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(index)}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
