import { useEffect, useState } from "react";

function Tab({ setTodo, data }) {
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
        setTodo(data);
        break;
      case "待完成":
        filterTodo = [...data]?.filter((item) => !item.completed_at);
        setTodo(filterTodo);
        break;
      case "已完成":
        filterTodo = [...data]?.filter((item) => item.completed_at);
        setTodo(filterTodo);
        break;
      default:
        return;
    }
  }, [tabState, data, filterTodo]);

  return (
    <>
      <ul className="flex text-center mb-6">
        {tab.map((item, index) => {
          return (
            <li key={index} className={item.className}>
              <a
                className="block cursor-pointer"
                onClick={() => {
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
    </>
  );
}

export default Tab;
