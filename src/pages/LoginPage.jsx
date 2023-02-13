import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useAuth } from '../components/Context';
import title from '../images/title.png';
import login from '../images/login.svg';
import '../App.css';

const url = 'https://todoo.5xcamp.us';
function LoginPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    await fetch(`${url}/users/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '登入失敗，請重新輸入！',
          });
          throw new Error('登入失敗，請重新檢驗！');
        }
        setToken(res.headers.get('authorization'));
        localStorage.setItem('token', res.headers.authorization);
        return res.json();
      })
      .then((res) => {
        localStorage.setItem('nickname', res.nickname);
        navigate('/TodoPage');
      });
  };

  return (
    <div className="container">
      <img
        src={title}
        alt="login"
        width="300"
        className="mx-auto md:mx-[unset]"
      />
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col justify-center items-center md:flex-row">
          <img src={login} alt="login" className="w-[300px] md:w-[700px]" />
          <div className="bg-white p-6 rounded-lg">
            <h1 className="text-2xl text-left mb-4 font-bold">
              Welcome to
              <br />
              the Online Todolist！
            </h1>
            <form
              className="flex flex-col space-y-4 w-[300px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="block">
                <label htmlFor="email" className="block text-sm text-left mb-1">
                  Email
                  <input
                    type="text"
                    className="placeholder-gray-300 p-2 border border-gray-200 focus:border-pink-300 focus:border-2 focus:outline focus:outline-offset-0 focus:outline-2 focus:outline-pink-100 rounded-md w-full"
                    placeholder="請輸入 email"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('email', {
                      required: {
                        value: true,
                        message: '請輸入資料內容!',
                      },
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: '格式有誤!',
                      },
                    })}
                  />
                </label>
                <p className="text-left text-primary text-sm mt-2">
                  {errors.email?.message}
                </p>
              </div>

              <div className="block">
                <label
                  htmlFor="password"
                  className="block text-sm text-left mb-1"
                >
                  密碼
                  <input
                    type="password"
                    className="placeholder-gray-300 p-2 border border-gray-200 focus:border-pink-300 focus:border-2 focus:outline focus:outline-offset-0 focus:outline-2 focus:outline-pink-100 rounded-md w-full"
                    placeholder="請輸入密碼"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('password', {
                      required: {
                        value: true,
                        message: '請輸入資料內容!',
                      },
                      minLength: {
                        value: 6,
                        message: '密碼長度至少6位字元',
                      },
                    })}
                  />
                </label>
                <p className="text-left text-primary text-sm mt-2">
                  {errors.password?.message}
                </p>
              </div>
              <input
                type="submit"
                value="登入"
                className="bg-primary text-white hover:bg-pink-300 py-2 rounded-md text-sm cursor-pointer"
              />
              <NavLink
                to="/SignUpPage"
                className="text-sm py-2 text-pink-300 hover:bg-pink-50  hover:rounded-md cursor-pointer"
              >
                註冊帳號
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
