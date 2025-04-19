import { useSocket } from '../../utils/socketContext'
import axios from 'axios'
import { usePlayer } from '../../utils/usePlayer'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./GameLobby.css"
import GameBoard from '../gameBoard/GameBoard'

const GAME_DEFAULT_MSG = "Game Pending . . ."

const GameLobby = () => {
  const { playerName, isLoggedIn, setRoomCode } = usePlayer();
  const [roomReady, setRoomReady] = useState(false)
  const socket = useSocket();
  const roomInputRef = useRef(null)
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoggedIn) navigate('/')
  }, [isLoggedIn])


  const handleCreateRoom = async () => {
    try {
      const res = await axios.post('http://localhost:3001/create-room',
        { name: playerName },
        { withCredentials: true });
      setRoomCode(res.data.roomCode)
      socket.emit("join_game", { roomCode: res.data.roomCode });
      setRoomReady(true)
    } catch (err) {
     console.log(err)
    }
  };


  const handleJoinRoom = async () => {
    try {
      const res = await axios.post('http://localhost:3001/join-room',
        { name: playerName, roomCode: roomInputRef.current.value },
        { withCredentials: true });
      setRoomCode(res.data.roomCode)
      socket.emit("join_game", { roomCode: res.data.roomCode });
      setRoomReady(true)
    } catch(err) {
      alert(err?.response?.data?.error)
    }
  };

  const handleCloseModal = useCallback(({ roomCode }) => {
    setRoomReady(false)
    setRoomCode(null)
    socket.emit("leave-room", { roomCode: roomCode })
  }, [])

  return (
    <>
      <div className="board-game-container">
        <h2>Game Lobby</h2>
        <div className="actions-wrapper">
          <div className="room-actions">
            <button className="create-room-btn" onClick={handleCreateRoom}>Create Room</button>
          </div>

          <div className="join-room">
            <input
              ref={roomInputRef}
              type="text"
              placeholder="Enter Room Code"
            />
            <button className="join-room-btn" onClick={handleJoinRoom}>Join Room</button>
          </div>
        </div>
      </div>
      { roomReady && <GameBoard msg={GAME_DEFAULT_MSG} closeGame={handleCloseModal}/> }
    </>
  )
}
export default GameLobby