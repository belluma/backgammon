import React from "react";
import styles from "./Board.module.css";
import Quarter from "../Quarter/Quarter";
import { field } from "../../interfaces";

type Props = {
  className?: string;
};

const Board = (props: any) => {
  const quarter1: field[] = props.board.slice(0, 6);
  const quarter2: field[] = props.board.slice(6, 12);
  const quarter3: field[] = props.board.slice(12, 18);
  const quarter4: field[] = props.board.slice(18);
  const top = [
    <Quarter quarter={quarter1} top={true} key={1} />,
    <Quarter quarter={quarter2} top={true} key={2} />,
  ];
  const bottom = [
    <Quarter quarter={quarter3} top={false} key={3} />,
    <Quarter quarter={quarter4} top={false} key={4} />,
  ];

  return (
    <section>
      <section>{top}</section>
      <section>{bottom}</section>
    </section>
  );
};

export default Board;
