import React from "react";
import PlayerCard from "./PlayerCard";
import styles from "./GameResult.module.css";

const GameResultCard = (props) => {
  const resultCard = () => {
    const result = [];
    for (let i = 0; i < props.userLits.length; i++) {
      result.push(<PlayerCard key={i} data={props.userLits[i]} />);
    }
    return result;
  };

  return <div className={styles.result_total}>{resultCard()}</div>;
};

export default GameResultCard;
