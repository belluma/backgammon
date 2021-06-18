import React, { useCallback } from "react";
import styles from "./Board.module.css";
import Quarter from "../Quarter/Quarter";

type Props = {
  className?: string;
  board: number[][];
  selectField: (id: number) => void;
};

const Board = (props: Props) => {
  const quarter1: number[][] = props.board.slice(0, 6);
  const quarter2: number[][] = props.board.slice(6, 12);
  const quarter3: number[][] = props.board.slice(12, 18);
  const quarter4: number[][] = props.board.slice(18);
  const top = [
    <Quarter
      quarter={quarter2}
      id={1}
      top={true}
      key={2}
      selectField={props.selectField}
    />,
    <Quarter
      quarter={quarter1}
      id={0}
      top={true}
      key={1}
      selectField={props.selectField}
    />,
  ];
  const bottom = [
    <Quarter
      quarter={quarter3}
      id={2}
      top={false}
      key={3}
      selectField={props.selectField}
    />,
    <Quarter
      quarter={quarter4}
      id={3}
      top={false}
      key={4}
      selectField={props.selectField}
    />,
  ];

  return (
    <section>
      <section style={{ margin: "0", paddingBottom: "0!important" }}>
        {top}
      </section>
      <section>{bottom}</section>
    </section>
  );
};

export default Board;
