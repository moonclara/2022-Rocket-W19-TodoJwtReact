/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from './Context';
import logo from '../images/title.png';

const url = 'https://todoo.5xcamp.us';

function Header() {
  const nickname = localStorage.getItem('nickname');
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const logoutApi = async () => {
    await fetch(`${url}/users/sign_out`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })
      .then((res) => {
        setToken(null);
        localStorage.removeItem('token');
        return res.json();
      })
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '登出失敗!',
        });
      });
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between my-8 ">
      <img src={logo} alt="logo" width="300" />
      <div className="flex space-x-4 text-primary items-center">
        <span>
          Hello ,
          {' '}
          {nickname}
          {' '}
          ！
        </span>
        <a
          type="button"
          className="w-20 h-10 rounded-lg  hover:bg-primary hover:text-white p-2 cursor-pointer"
          onClick={() => {
            logoutApi();
          }}
        >
          登出
        </a>
      </div>
    </nav>
  );
}

export default Header;
