import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../components/Context";
import logo from "../images/title.png";
import empty from "../images/empty.svg";

const url = "https://todoo.5xcamp.us";

function App() {
  return <TodoPage />;
}

function TodoPage() {
  return (
    <div className="container h-full">
      <Header />
      <TodoContainer />
    </div>
  );
}

function Header() {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between my-8 ">
      <img src={logo} alt="logo" width="300" />
      <div className="flex space-x-8 text-primary">
        <span>Hello,王曉明！</span>
        <NavLink to="/">登出</NavLink>
      </div>
    </nav>
  );
}

function TodoContainer() {
  const [todo, setTodo] = useState([]);
  const { token } = useAuth();

  const getTodo = async () => {
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
        setTodo(res.todos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTodo();
  }, []);

  return (
    <div className="container">
      <AddTodo todo={todo} setTodo={setTodo} />
      <TodoContent todo={todo} setTodo={setTodo} />

      {/* {todo.length === 0 ? (
        <TodoEmpty />
      ) : (
        <TodoContent todo={todo} setTodo={setTodo} />
      )} */}
    </div>
  );
}

function AddTodo({ todo, setTodo }) {
  const [value, setValue] = useState("");
  const { token } = useAuth();

  // TODO : 新增 todo
  const addItem = (res) => {
    if (value === "") {
      return alert("請確實輸入內容");
    }
    setValue("");
    setTodo([...todo, res]);
  };

  const addTodo = () => {
    fetch(`${url}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        content: value,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res); // 物件
        console.log(token);
        console.log(todo);
        addItem(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="新增待辦事項"
        className="placeholder-white/50 h-12 rounded-lg pl-4 w-full bg-primary text-white focus:outline-none focus:border-black focus:ring-black focus:ring-2"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />

      <a
        type="button"
        onClick={() => {
          addTodo();
        }}
        className="w-10 h-10 rounded-lg text-black bg-white absolute right-1 top-1 hover:bg-pink-200 hover:text-white p-2 cursor-pointer"
      >
        <span className="material-icons">add</span>
      </a>
    </div>
  );
}

function TodoEmpty() {
  return (
    <div>
      <div className="text-center py-10">目前無待辦事項</div>
      <img src={empty} alt="empty" className="mx-auto" />
    </div>
  );
}

function TodoContent({ todo, setTodo }) {
  const { token } = useAuth();

  // TODO : Tab CSS 狀態切換
  const [tab, setTab] = useState([
    {
      content: "全部",
      className: "tabActive",
    },
    {
      content: "待完成",
      className: "tabNormal",
    },
    {
      content: "已完成",
      className: "tabNormal",
    },
  ]);
  const tabClass = (index) => {
    const newTab = [...tab];
    newTab.map((newItem, newIndex) => {
      if (index === newIndex) {
        newItem.className = "tabActive";
      } else {
        newItem.className = "tabNormal";
      }
    });
    setTab(newTab);
  };

  // TODO : 刪除 Todo
  const delItem = (id) => {
    const newTodo = todo.filter((newItem) => {
      return newItem.id !== id;
    });
    setTodo(newTodo);
  };
  const delTodo = (id) => {
    fetch(`${url}/todos/${id}`, {
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
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        console.log(todo);
        delItem(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO : 更改完成狀態
  const comItemStatus = (id) => {
    const newTodo = [...todo];
    newTodo.map((newItem) => {
      if (id === newItem.id) {
        newItem.completed_at = !newItem.completed_at;
      }
    });
    setTodo(newTodo);
  };
  const comTodoStatus = (id) => {
    fetch(`${url}/todos/${id}/toggle`, {
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
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        console.log(todo);
        comItemStatus(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO : 清除已完成項目
  // const cleanItem = (id) => {
  //   const newTodo = todo.filter((newItem) => {
  //     return newItem.completed_at === null;
  //   });
  //   setTodo(newTodo);
  // };
  const cleanTodo = () => {
    const compTodo = todo.filter((item, index) => {
      return item.completed_at === null;
    });

    fetch(`${url}/todos/${compTodo[index].id}`, {
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
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        console.log(todo);
        setTodo(compTodo);
      })
      .catch((err) => {
        console.log(err);
        console.log(compTodo);
      });
  };

  return (
    <div>
      <ul className="flex text-center mb-6">
        {tab.map((item, index) => {
          return (
            <li key={index} className={item.className}>
              <a
                className="block cursor-pointer"
                onClick={() => {
                  tabClass(index);
                }}
              >
                {item.content}
              </a>
            </li>
          );
        })}
      </ul>

      <ul className="space-y-4 overflow-y-auto h-80">
        {/* 全部 */}
        {tab[0].className === "tabActive" &&
          todo?.map(({ id, content, completed_at }) => {
            return (
              <li
                className="flex items-center justify-between px-8 py-4 bg-white border border-black rounded-lg"
                key={id}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={completed_at === null ? null : "checked"}
                    onChange={() => {
                      comTodoStatus(id);
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
                    delTodo(id);
                  }}
                >
                  <span className="material-icons">delete_outline</span>
                </a>
              </li>
            );
          })}
        {/* 待完成 */}
        {tab[1].className === "tabActive" &&
          todo
            ?.filter((item) => item.completed_at === null)
            .map(({ id, content, completed_at }) => {
              return (
                <li
                  className="flex items-center justify-between px-8 py-4 bg-white border border-black rounded-lg"
                  key={id}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 w-4 h-4"
                      checked={completed_at === null ? null : "checked"}
                      onChange={() => {
                        comTodoStatus(id);
                      }}
                    />
                    <span
                      className={
                        completed_at
                          ? "text-gray-400 line-through"
                          : "text-black"
                      }
                    >
                      {content}
                    </span>
                  </div>
                  <a
                    className="flex items-center cursor-pointer"
                    onClick={(e) => {
                      delTodo(id);
                    }}
                  >
                    <span className="material-icons">delete_outline</span>
                  </a>
                </li>
              );
            })}
        {/* 已完成 */}
        {tab[2].className === "tabActive" &&
          todo
            ?.filter((item) => item.completed_at !== null)
            .map(({ id, content, completed_at }) => {
              return (
                <li
                  className="flex items-center justify-between px-8 py-4 bg-white border border-black rounded-lg"
                  key={id}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 w-4 h-4"
                      checked={completed_at === null ? null : "checked"}
                      onChange={() => {
                        comTodoStatus(id);
                      }}
                    />
                    <span
                      className={
                        completed_at
                          ? "text-gray-400 line-through"
                          : "text-black"
                      }
                    >
                      {content}
                    </span>
                  </div>
                  <a
                    className="flex items-center cursor-pointer"
                    onClick={(e) => {
                      delTodo(id);
                    }}
                  >
                    <span className="material-icons">delete_outline</span>
                  </a>
                </li>
              );
            })}
      </ul>
      <div className="flex items-center justify-between px-8 py-4">
        <span>
          {todo?.filter((item) => item.completed_at === null).length}{" "}
          個待完成項目
        </span>
        <a
          className="block hover:text-primary cursor-pointer"
          onClick={(e) => {
            cleanTodo();
          }}
        >
          清除已完成項目
        </a>
      </div>
    </div>
  );
}

export default App;
