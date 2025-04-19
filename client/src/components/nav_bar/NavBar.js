import './NavBar.scss'
import { usePlayer } from '../../utils/usePlayer'

const NavBar = () => {
  const { playerName, isLoggedIn } = usePlayer()

  return(
    <div className="navBar">
      <div className="navBarLogo">
        <label>Tic Tac Toe</label>
      </div>
      { isLoggedIn && <div className="navBarUser">
        <label>Logged in as - {playerName}</label>
      </div> }
    </div>
  )
}

export default NavBar;