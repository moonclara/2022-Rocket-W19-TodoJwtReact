/* eslint-disable react/prop-types */
import React from 'react';
import Tab from '../components/Tab';
import Empty from '../components/Empty';
import List from '../components/List';
import Footer from '../components/Footer';

function TodoList({
  todo, setTodo, data, setData,
}) {
  return (
    <div>
      <Tab todo={todo} setTodo={setTodo} data={data} setData={setData} />
      {todo.length === 0 ? (
        <Empty />
      ) : (
        <List todo={todo} setTodo={setTodo} data={data} setData={setData} />
      )}
      <Footer todo={todo} setTodo={setTodo} data={data} setData={setData} />
    </div>
  );
}

export default TodoList;
