import { useAuth } from "./Context";
const url = "https://todoo.5xcamp.us";

function Footer({ todo, setTodo, data, setData }) {
  const { token, setToken } = useAuth();

  // TODO : 清除已完成項目
  const compTodo = [...data]?.filter((item) => !item.completed_at);
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
        setTodo(compTodo);
        setData(compTodo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="flex items-center justify-between px-8 py-4">
        <span>
          {todo?.filter((item) => !item.completed_at).length} 個待完成項目
        </span>
        <a
          className="block hover:text-primary cursor-pointer"
          onClick={(e) => {
            console.log(compTodo);

            cleanTodoApi();
          }}
        >
          清除已完成項目
        </a>
      </div>
    </>
  );
}

export default Footer;
