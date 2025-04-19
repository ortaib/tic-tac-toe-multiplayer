import './Board.css';
import PropTypes from 'prop-types'

const propTypes = {
  onCellClick: PropTypes.func,
  board: PropTypes.object
}
const Board = ({ onCellClick, board }) => {

  const handleOnCellClick = (index) => () => {
    onCellClick(index)
  }

  return (
    <div className="game-board">
      {board.map((value, index) => (
        <div
          key={index}
          className="cell"
          onClick={handleOnCellClick(index)}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = propTypes
export default Board;