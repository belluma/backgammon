import React from "react";
import styles from "./Edge.module.css";
import Chip from "../Chip/Chip";

type Props = {
  chips: number | undefined;
  top: boolean;
};

const Edge = (props: Props) => {
  const chips = [];
  const classNames = props.top
    ? ["chip", "chip-black"]
    : ["chips", "chip-white"];
  if (props.chips !== undefined)
    for (let i = 0; i < props.chips; i++) {
      chips.push(
        <Chip
          top={props.top}
          className={classNames.join(" ")}
          position={i}
          key={i}
        />
      );
    }
  return <div className={styles.Edge}>Edge Component</div>;
};

export default Edge;
