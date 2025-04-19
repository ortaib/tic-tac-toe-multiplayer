import Login from './components/login/Login'
import { PlayerProvider } from './utils/usePlayer'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './utils/socketContext'
import GameLobby from './components/gameLobby/GameLobby'
import GameBoard from './components/./gameBoard/GameBoard'
import NavBar from './components/nav_bar/NavBar'


function App() {
  return (
    <PlayerProvider>
      <SocketProvider>
        <NavBar/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/lobby" element={<GameLobby />} />
            {/*<Route path="/game" element={<GameBoard />} />*/}
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </PlayerProvider>

  );
}

export default App;
