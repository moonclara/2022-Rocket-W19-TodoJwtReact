import { useAuth } from "../components/Context";
import { useEffect, useState } from "react";
import AddTodo from "../components/AddTodo";
import TodoList from "./TodoList";

const url = "https://todoo.5xcamp.us";


function Content() {
  const [todo, setTodo] = useState([]); // !初始資料
  const [data, setData] = useState(todo); // !拿來渲染用
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
  useEffect(() => {
    getApi();
  }, []);

  return (
    <div className="container">
      <AddTodo todo={todo} setTodo={setTodo} data={data} setData={setData} />
      <TodoList
        todo={todo}
        setTodo={setTodo}
        data={data}
        setData={setData}
      />
    </div>
  );
}

export default Content;
