/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';

function Tab({
  // eslint-disable-next-line react/prop-types
  setTodo, data,
}) {
  // TODO : Tab CSS 狀態切換
  const [tab, setTab] = useState([
    {
      content: '全部',
      className: 'tabActive',
    },
    {
      content: '待完成',
      className: 'tabNormal',
    },
    {
      content: '已完成',
      className: 'tabNormal',
    },
  ]);
  const tabClass = (index) => {
    const newTab = [...tab];
    // eslint-disable-next-line array-callback-return
    newTab.map((newItem, newIndex) => {
      if (index === newIndex) {
        newItem.className = 'tabActive';
      } else {
        newItem.className = 'tabNormal';
      }
    });
    setTab(newTab);
  };

  // TODO : Tab 資料渲染
  const [tabState, setTabState] = useState('全部');

  let filterTodo;

  useEffect(() => {
    switch (tabState) {
      case '全部':
        setTodo(data);
        break;
      case '待完成':
        filterTodo = [...data]?.filter((item) => !item.completed_at);
        setTodo(filterTodo);
        break;
      case '已完成':
        filterTodo = [...data]?.filter((item) => item.completed_at);
        setTodo(filterTodo);
        break;
      default:
        // eslint-disable-next-line no-useless-return
        return;
    }
  }, [tabState, data, filterTodo]);

  return (
    <div>
      <ul className="flex text-center mb-6">
        {tab.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
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
        ))}
      </ul>
    </div>
  );
}

export default Tab;
