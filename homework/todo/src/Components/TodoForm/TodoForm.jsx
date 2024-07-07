import { useRef } from 'react';

export default function TodoForm({ addTodo }) {
  const textRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    addTodo(text);
    textRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="text"
        id="text"
        ref={textRef}
        placeholder="할일을 적기"
      />
      <button
        type="submit"
        onClick={handleSubmit}
      >
        추가
      </button>
    </form>
  );
}
