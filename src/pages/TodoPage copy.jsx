import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../components/Context";
import logo from "../images/title.png";
import empty from "../images/empty.svg";

const url = "https://todoo.5xcamp.us";

function App() {
  return (
    <>
      <TodoPage />
    </>
  );
}

function TodoPage() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const checkApi = async () => {
    await fetch(`${url}/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
        console.log(err);
      });
  };

  useEffect(() => {
    checkApi();
  }, []);

  return (
    <div className="container h-full">
      <Header />
      <TodoContainer />
    </div>
  );
}

function Header() {
  const nickname = localStorage.getItem("nickname");

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between my-8 ">
      <img src={logo} alt="logo" width="300" />
      <div className="flex space-x-4 text-primary items-center">
        <span>Hello , {nickname} ！</span>
        <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const logoutApi = async () => {
    await fetch(`${url}/users/sign_out`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        console.log(res);
        setToken(null);
        localStorage.removeItem("token");
        return res.json();
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "登出失敗!",
        });
      });
  };

  return (
    <a
      type="button"
      className="w-20 h-10 rounded-lg  hover:bg-primary hover:text-white p-2 cursor-pointer"
      onClick={() => {
        logoutApi();
      }}
    >
      登出
    </a>
  );
}

function TodoContainer() {
  const [todo, setTodo] = useState([]); // !初始資料
  const [data, setData] = useState(todo); // !拿來渲染用
  const { token } = useAuth();

  // TODO : 取得 todo 列表
  const getTodo = (res) => {
    setTodo(res.todos);
    setData(res.todos);
  };

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
        getTodo(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getApi();
  }, []);

  return (
    <div className="container">
      <AddTodo todo={todo} setTodo={setTodo} />
      <TodoContent
        todo={todo}
        setTodo={setTodo}
        data={data}
        setData={setData}
      />

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

  // TODO : 思考重複的 code 該如何優化
  const getTodo = (res) => {
    getApi(res)
    setTodo(res.todos);
  };

  const getApi = async () => {
    await fetch(`${url}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .catch((err) => {
        console.log(err);
      });
  };

  // TODO : 新增 todo(按下新增 -> 打api -> 渲染)
  const addTodo = (res) => {
    setValue("");
    setTodo([...todo, res]);
    getTodo();
  };

  const addApi = async () => {
    await fetch(`${url}/todos`, {
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
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "請確實輸入內容!",
          });
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        console.log(res); // 物件
        console.log(todo);
        addTodo(res);
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
          addApi();
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

function TodoContent({ todo, setTodo, data, setData }) {
  const { token } = useAuth();

  // TODO : 思考重複的 code 該如何優化
  const getTodo = (res) => {
    setTodo(res.todos);
    getApi();
  };

  const getApi = async () => {
    await fetch(`${url}/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }).catch((err) => {
      console.log(err);
    });
  };

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

  // TODO : Tab 資料渲染
  const [tabState, setTabState] = useState("全部");

  let filterTodo;

  useEffect(() => {
    switch (tabState) {
      case "全部":
        setData(todo);
        break;
      case "待完成":
        filterTodo = [...todo]?.filter((item) => !item.completed_at);
        setData(filterTodo);
        break;
      case "已完成":
        filterTodo = [...todo]?.filter((item) => item.completed_at);
        setData(filterTodo);
        break;
      default:
        return;
    }
  }, [tabState, todo, filterTodo]);

  // TODO : 刪除 Todo(按下刪除 -> 打api -> 渲染)
  // const delTodo = (id) => {
  //   const newTodo = [...todo].filter((newItem) => newItem.id !== id);
  //   delApi(id);
  //   setTodo(newTodo);
  // };
  // const delApi = async (id) => {
  //   await fetch(`${url}/todos/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: token,
  //     },
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  // TODO : 更改完成狀態(按下勾勾 -> 打api -> 渲染)
  const todoStatus = (id) => {
    const newTodo = [...data];
    newTodo.map((newItem) => {
      if (id === newItem.id) {
        newItem.completed_at = !newItem.completed_at;
      }
      return newItem;
    });
    todoStatusApi(id);
    setData(newTodo);
  };

  const todoStatusApi = async (id) => {
    await fetch(`${url}/todos/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }).catch((err) => {
      console.log(err);
    });
  };

  // TODO : 清除已完成項目
  const cleanTodoApi = async () => {
    await fetch(`${url}/todos/${compTodo[0].id}`, {
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
        setTodo(unCompTodo);
      })
      .catch((err) => {
        console.log(err);
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
                  console.log(todo);
                  console.log(data);
                  tabClass(index);
                  setTabState(item.content);
                }}
              >
                {item.content}
              </a>
            </li>
          );
        })}
      </ul>

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
                    todoStatus(id);
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
      </ul>
      <div className="flex items-center justify-between px-8 py-4">
        <span>
          {todo?.filter((item) => !item.completed_at).length} 個待完成項目
        </span>
        <a
          className="block hover:text-primary cursor-pointer"
          onClick={(e) => {
            cleanTodoApi();
          }}
        >
          清除已完成項目
        </a>
      </div>
    </div>
  );
}

export default App;
