import { usePlayer } from '../../utils/usePlayer'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../board/Board'
import "./GameBoard.css"
import { useSocket } from '../../utils/socketContext'
import PropTypes from 'prop-types'

const propTypes = {
  msg: PropTypes.string,
  closeGame: PropTypes.func
}

const GameBoard = ({ msg, closeGame }) => {
  const socket = useSocket();
  const { playerName, isLoggedIn, roomCode } = usePlayer();
  const [gameReady, setGameReady] = useState(false)
  const [message, setMessage] = useState(msg || "");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState("")
  const [host, setHost] = useState("")
  const [guest, setGuest] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("game_start", ({ board, currentTurn, host, guest }) => {
      setBoard(board);
      setTurn(currentTurn);
      setGuest(guest)
      setHost(host)
      setGameReady(false)
      setMessage(`${host}'s Turn`);
    });

    socket.on("game_ready", ({ host }) => {
      if(host === playerName) setGameReady(true)
    })

    socket.on("game_not_ready", () => {
      setGameReady(false)
    })

    socket.on("game_update", ({ board, currentTurn, winner, draw }) => {
      setBoard(board);
      setTurn(currentTurn);
      if(winner) {
        setWinner(winner)
        setMessage(`${winner} won`)
      } else if(draw) {
        setWinner("DRAW")
        setMessage("DRAW");

      } else {
        setMessage(`${currentTurn}'s turn`);
      }
    });

    return () => {
      socket.off("game_start");
      socket.off("game_update");
    };
  }, [socket, isLoggedIn]);

  useEffect(() => {
    if(!isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const onCellClicked = (index) => {
    if(winner) return;
    if (board[index]) return;
    if(turn !== playerName) return;
    socket.emit('make_move', { roomCode, index });
  }

  const handleStartGame = () => {
    socket.emit('start_game', { roomCode });
  }

  const handleCloseGame = () => {
    closeGame({ roomCode })
  }

  return (
    <div className="game-room-modal">
      <div className="game-room-container animate">
        <div className="game-room-header">
          <h2 className="game-board-msg">{message}</h2>
          <button onClick={handleCloseGame}>X</button>
        </div>

        <div className="game-board-info">
          <div className="host-name">
            <h3>{host}</h3>
          </div>
          <div className="game-room-info">
            Room ID: { roomCode }
          </div>
          <div className="guest-name">
            <h3>{guest}</h3>
          </div>
        </div>
        { gameReady && <div className="start-game"> <button onClick={handleStartGame}>START</button></div> }
        <Board board={board} onCellClick={onCellClicked}/>
      </div>
    </div>
  );
};

GameBoard.propTypes = propTypes;
export default GameBoard;