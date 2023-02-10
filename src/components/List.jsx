import { useAuth } from "./Context";
const url = "https://todoo.5xcamp.us";


function List({ todo, setTodo, data, setData }) {
  const { token } = useAuth();

  const getApi = async () => {
    await fetch(`${url}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        // 使用 fetch ，若伺服器有正確回應，不管甚麼狀態碼，res 都會進入 then
        // 因此透過 res 中的 ok 來判斷狀態碼是否正確，如果是 true，狀態碼會在 200-209之間
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        console.log(res);
        // 轉換成 JSON 再傳入下一個 then 中處理
        return res.json();
      })
      .then((res) => {
        console.log(res);
        // TODO : 取得 todo 列表
        setTodo(res.todos);
        setData(res.todos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO : 刪除 Todo(按下刪除 -> 打api -> 渲染)
  const delTodo = (id) => {
    const newTodo = [...todo].filter((newItem) => newItem.id !== id);
    setTodo(newTodo);
    getApi();
  };
  const delApi = async (id) => {
    await fetch(`${url}/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res); // 物件
        console.log(todo);
        delTodo(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO : 更改完成狀態(按下勾勾 -> 打api -> 渲染)
  const todoStatus = (id) => {
    const newTodo = [...data];
    newTodo.map((newItem) => {
      if (id === newItem.id) {
        newItem.completed_at = !newItem.completed_at;
      }
      return newItem;
    });
    setData(newTodo);
    getApi();
  };

  const todoStatusApi = async (id) => {
    await fetch(`${url}/todos/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res); // 物件
        console.log(todo);
        todoStatus(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ul className="space-y-4 overflow-y-auto h-80">
        {todo.map(({ id, content, completed_at }) => {
          return (
            <li
              className="flex items-center justify-between px-8 py-4 bg-white border border-black rounded-lg"
              key={id}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4"
                  checked={!completed_at ? "" : "checked"}
                  onChange={() => {
                    todoStatusApi(id);
                  }}
                />
                <span
                  className={
                    completed_at ? "text-gray-400 line-through" : "text-black"
                  }
                >
                  {content}
                </span>
              </div>
              <a
                className="flex items-center cursor-pointer"
                onClick={(e) => {
                  delApi(id);
                }}
              >
                <span className="material-icons">delete_outline</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default List;
