import { useEffect, useState } from "react";
import { useAuth } from "./Context";
import Swal from "sweetalert2";


const url = "https://todoo.5xcamp.us";


function AddTodo({ todo, setTodo, data, setData }) {
  const [value, setValue] = useState("");
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

  // TODO : 新增 todo(按下新增 -> 打api -> 渲染)
  const addTodo = (res) => {
    setValue("");
    setTodo([...todo, res]);
    getApi();
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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addApi();
          }
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

export default AddTodo;