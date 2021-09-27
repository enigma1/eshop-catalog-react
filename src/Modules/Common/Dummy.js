import { useState, useEffect, useRef, useContext, useReducer } from 'react';

const initialTodos = [
  {
    id: 'a',
    task: 'Learn React',
    complete: false,
  },
  {
    id: 'b',
    task: 'Learn Firebase',
    complete: false,
  },
];


const todoReducer = (state, action) => {
  switch (action.type) {
    case 'DO_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
    case 'UNDO_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
};


const Example = () => {

  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  const handleChange = (todo) => {
    dispatch({
      type: todo.complete?'UNDO_TODO':'DO_TODO',
      id: todo.id
    });
    //e.currentTarget.checked = true;
    //e.target.checked = !e.target.checked
  };

  const [counter, setCounter] = useState(0);
  const evtCount = () => {
    setCounter((previous) => previous+1);
    console.log('result', result)
  }

  return (
  <>
    <button onClick={evtCount}>test</button>
    <p>{counter}</p>
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => handleChange(todo)}
            />
            {todo.task}
          </label>
        </li>
      ))}
    </ul>
  </>
  );
};


export default (props) => {
  console.log('Dummy properties passed', props);
  return (
    <div><Example></Example></div>
  );
}
