import styles from './TodoList.module.css';

export default function TodoList({ todos = [], removeTodo }) {
  return (
    <ul className={styles.list}>
      {todos.map((todo, index) => (
        <li
          key={index}
          className={styles.item}
        >
          <button
            className={styles.remove}
            onClick={() => removeTodo(index)}
          >
            지우기
          </button>
          <span>{todo}</span>
        </li>
      ))}
    </ul>
  );
}
