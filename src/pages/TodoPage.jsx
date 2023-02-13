import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context";
import Header from "../components/Header";
import Content from "../containers/Content";

const url = "https://todoo.5xcamp.us";

function App() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const checkApi = async () => {
    await fetch(`${url}/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
        console.log(err);
      });
  };

  useEffect(() => {
    checkApi();
  }, []);

  return (
    <div className="container h-full">
      <Header />
      <Content />
    </div>
  );
}

export default App;
