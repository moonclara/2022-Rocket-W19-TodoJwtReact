/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from './Context';

const url = 'https://todoo.5xcamp.us';
function AddTodo({
  todo, setTodo, setData,
}) {
  const [value, setValue] = useState('');
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

  // TODO : 新增 todo(按下新增 -> 打api -> 渲染)
  const addTodo = (res) => {
    setValue('');
    setTodo([...todo, res]);
    getApi();
  };

  const addApi = async () => {
    await fetch(`${url}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({
        content: value,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '請確實輸入內容!',
          });
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        addTodo(res);
        getApi();
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
          if (e.key === 'Enter') {
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
