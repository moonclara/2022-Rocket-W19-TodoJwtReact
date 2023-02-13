/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useAuth } from './Context';

const url = 'https://todoo.5xcamp.us';

function Footer({
  // eslint-disable-next-line react/prop-types
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

  // TODO : 清除已完成項目
  const compTodo = [...data]?.filter((item) => item.completed_at);
  const cleanTodoApi = async () => {
    await fetch(`${url}/todos/${compTodo[0].id}`, {
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
        setTodo(compTodo);
        setData(compTodo);
        getApi();
      });
  };

  return (
    <div className="flex items-center justify-between px-8 py-4">
      <span>
        {todo?.filter((item) => !item.completed_at).length}
        {' '}
        個待完成項目
      </span>
      <a
        className="block hover:text-primary cursor-pointer"
        onClick={() => {
          cleanTodoApi();
        }}
      >
        清除已完成項目
      </a>
    </div>
  );
}

export default Footer;
