import styles from "./Game.module.css";
import GameBoard from "../components/game/gameboard/GameBoard";
import Role from "../components/game/roleDesc/Role";
import React from "react";
import { useCheckLogin } from "./../hooks/useLogin";

const GamePage = () => {
  useCheckLogin();

  return (
    <div className={styles.layout}>
      <GameBoard />
      <Role />
    </div>
  );
};

export default GamePage;
