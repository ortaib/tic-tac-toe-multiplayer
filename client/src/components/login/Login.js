import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { usePlayer } from '../../utils/usePlayer'
import { useNavigate } from 'react-router-dom';
import "./Login.css"
import { useSocket } from '../../utils/socketContext'


const Login = () => {
  const inputRef = useRef(null);
  const { setPlayerName, setIsLoggedIn } = usePlayer();
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    axios.get("http://localhost:3001/login_from_cookie", {
      withCredentials: true
    })
      .then(res => {
        if(res.data.name) {
          socket.disconnect();
          socket.connect();
          setIsLoggedIn(true);
          setPlayerName(res.data.name);
          navigate('/lobby');
        }
      })
      .catch(err => {
        console.error("Unexpected error:", err);
      })
  }, []);

  const handleLogin = async () => {
    const name = inputRef.current.value
    if(name === "") {
      alert("Enter your name")
      return
    }
    try {
      const res =  await axios.post("http://localhost:3001/create-session",
        { params: { name: inputRef.current.value } },
        { withCredentials: true }
      )
      socket.disconnect();
      socket.connect();
      setPlayerName(res.data.name)
      setIsLoggedIn(true)
      navigate('/lobby');
    } catch(err) {
      alert("error occurred try again")
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-msg">
          <label>Enter Your Name</label>
        </div>
        <div className="login-inputs">
          <div className="input-msg">
            <input id="input-msg" placeholder="Enter your name" ref={inputRef}/>
          </div>
          <span className="login-btn-wrapper">
            <button type="submit" id="login-btn" onClick={handleLogin}>
              LOGIN
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login;