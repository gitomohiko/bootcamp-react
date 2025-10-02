import { useEffect, useState } from 'react'
// import { type TodoItem, TodoApiMock, TodoApiClient } from "./api";
import { type TodoItem } from "./api";
import './App.css'
import { TodoApi } from './utils/todoApi';

// const INITIAL_TODO: TodoItem[] = [
//   {id: 1, text: "todo-item-1", done: false},
//   {id: 2, text: "todo-item-2", done: true},
// ];

// const todoApi = new TodoApiMock(INITIAL_TODO);
// const todoApi = new TodoApiClient('http://localhost:8080')
const todoApi = new TodoApi();

type TodoListItemProps = {
  item: TodoItem;
  onCheck: (checked: boolean) => void;
  onDelete: () => void;
};

function TodoListItem({item, onCheck, onDelete}: TodoListItemProps){
  return (
      <div className="TodoItem">
        <input
          type="checkbox"
          checked={item.done}
          onChange={(ev) => onCheck(ev.currentTarget.checked)}
        />
        <p style={{textDecoration: item.done ? "line-through" : "none"}}>
          {item.text}
        </p>
        <button className='button-small' onClick={() => onDelete()}>
          ×
        </button>
      </div>
    );
};

type CreateTodoFormProps = {
  onSubmit: (text: string) => void;
}

function CreateTodoForm({ onSubmit }: CreateTodoFormProps) {
  const [text, setText] = useState("");
  return (
    <div className='CreateTodoForm'>
      <input
        placeholder='新しいTodo'
        size={60}
        value={text}
        onChange={(ev) => setText(ev.currentTarget.value)}
      />
      <button onClick={() => {onSubmit(text); setText("");}}>追加</button>
    </div>
  );
}

type ValueViewerProps = {
  value: any;
};

function ValueViewer({value}: ValueViewerProps){ 
  return (
    <pre className='ValueViewer'>{JSON.stringify(value, undefined, 2)}</pre>
  );
}

// const generateId = () => Date.now();

// const useTodoState = () => {
//   const [todoItems, setTodoItems] = useState(INITIAL_TODO);
  
//   const createItem = (text: string) => {
//     setTodoItems([...todoItems, { id: generateId(), text, done: false}]);
//   };
//   const updateItem = (newItem: TodoItem) => {
//     setTodoItems(
//       todoItems.map((item) => (item.id === newItem.id ? newItem: item))
//     );
//   };
//   const deleteItem = (id: number) => {
//     if(!window.confirm('削除してもよろしいですか？')) return;
//     setTodoItems(todoItems.filter((item) => item.id !== id));
//   };
//   return [todoItems, createItem, updateItem, deleteItem] as const;
// };

export default function App(){
//  const [todoItems, createItem, updateItem, deleteItem] = useTodoState();
 const [todoItems, setTodoItems] = useState<TodoItem[] | null>(null);
 const [keyword, setKeyword] = useState("");
 const [showingDone, setShowingDone] = useState(false);
  
//  const reloadTodoItems = async (val?: string|boolean) => {
 const reloadTodoItems = async () => {
  //  if (typeof val === "string") {
  //     console.log('now keyword = ', keyword);
  //     console.log('next keyword = ', val);
  //    setKeyword(val);
  //     console.log('after keyword = ', keyword);
  //  } else if (typeof val === "boolean") {
  //     console.log('now showingDone = ', showingDone);
  //     console.log('next showingDone = ', val);
  //    setShowingDone(val);
  //     console.log('after showingDone = ', showingDone);
  //  }
   setTodoItems(await todoApi.queryItems(keyword, showingDone));
 };
 
 useEffect(() => {
  reloadTodoItems();
 }, [keyword, showingDone]);
 
//  const filteredTodoItems = todoItems.filter((item) => {
//   if (!showingDone && item.done) return false;
//   return item.text.includes(keyword);
//  });

 return (
  <div className='App'>
    <h1>ToDo</h1>
    <div className='App_todo-list-control'>
      <input 
        placeholder='キーワードフィルタ'
        value={keyword}
        onChange={(ev) => {setKeyword(ev.target.value);console.log('ev.target.value',ev.target.value);}}
      />
      <input
        id="showing-done"
        type="checkbox"
        checked={showingDone}
        onChange={(ev) => setShowingDone(ev.target.checked)/*reloadTodoItems(ev.target.checked);*/}
      />
      <label htmlFor="showing-done">完了したものも表示する</label>
    </div>
    {todoItems === null ? (
      <div className='dimmed'>データを取得中です...</div>
     ) : todoItems.length === 0 ? (
      <div className='dimmed'>該当するToDoはありません</div>
    ) : (
      <div className='App_todo-list'>
        {todoItems.map((item) => (
          <TodoListItem
           key={item.id}
           item={item}
           onCheck={async (checked) => {
              await todoApi.updateItem({...item, done: checked});
              reloadTodoItems();
            }
           }
           onDelete={async() => {
            await todoApi.deleteItem(item.id);
            reloadTodoItems();
           }}
          />
        ))}
      </div>      
    )}
    <CreateTodoForm 
      onSubmit={async (text) => {
        if(!text){
          alert('Todoを入力して下さい。')
          return;
        }
        await todoApi.createItem({text, done: false});
        reloadTodoItems();
      }} 
    />
    <ValueViewer value={todoItems} />
  </div>
 );
}
