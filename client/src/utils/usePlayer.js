import React, { createContext, useContext, useState } from 'react'

const PlayerContext = createContext("");

export const PlayerProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roomCode, setRoomCode] = useState(null);

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName, isLoggedIn, setIsLoggedIn, roomCode, setRoomCode}}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);