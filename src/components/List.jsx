/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react';
import { useAuth } from './Context';

const url = 'https://todoo.5xcamp.us';

function List({
  todo, setTodo, data, setData,
}) {
  const { token } = useAuth();

  const getApi = async () => {
    await fetch(`${url}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
        // TODO : 取得 todo 列表
        setTodo(res.todos);
        setData(res.todos);
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
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(() => {
        delTodo(id);
      });
  };

  // TODO : 更改完成狀態(按下勾勾 -> 打api -> 渲染)
  const todoStatus = (id) => {
    const newTodo = [...data];
    newTodo.map((newItem) => {
      if (id === newItem.id) {
        // eslint-disable-next-line no-param-reassign
        newItem.completed_at = !newItem.completed_at;
      }
      return newItem;
    });
    setData(newTodo);
    getApi();
  };

  const todoStatusApi = async (id) => {
    await fetch(`${url}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(() => {
        todoStatus(id);
      });
  };

  return (
    <ul className="space-y-4 overflow-y-auto h-80">
      {todo.map(({ id, content, completed_at }) => (
        <li
          className="flex items-center justify-between px-8 py-4 bg-white border border-black rounded-lg"
          key={id}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4"
              checked={!completed_at ? '' : 'checked'}
              onChange={() => {
                todoStatusApi(id);
              }}
            />
            <span
              className={
                completed_at ? 'text-gray-400 line-through' : 'text-black'
              }
            >
              {content}
            </span>
          </div>
          <a
            className="flex items-center cursor-pointer"
            onClick={() => {
              delApi(id);
            }}
          >
            <span className="material-icons">delete_outline</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default List;
