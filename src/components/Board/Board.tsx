import React from "react";
import styles from "./Board.module.css";
import Quarter from "../Quarter/Quarter";

type Props = {
  className?: string;
  board: number[][];
  selectedField: { selected: boolean; id: number };
  kickedChips: number[];
  selectField: (id: number) => void;
};

const Board = (props: Props) => {
  const selectedQuarter: number | undefined = props.selectedField.selected
    ? Math.floor(props.selectedField.id / 6)
    : undefined;
  const selectedField: number | undefined = props.selectedField.selected
    ? props.selectedField.id % 6
    : undefined;
  const quarter1: number[][] = props.board.slice(0, 6);
  const quarter2: number[][] = props.board.slice(6, 12);
  const quarter3: number[][] = props.board.slice(12, 18);
  const quarter4: number[][] = props.board.slice(18);
  const top = [
    <Quarter
      quarter={quarter2}
      id={1}
      top={true}
      key={1}
      selectField={props.selectField}
      selectedField={selectedQuarter === 1 ? selectedField : undefined}
      kickedChips={props.kickedChips[1]}
    />,
    <Quarter
      quarter={quarter1}
      id={0}
      top={true}
      key={0}
      selectField={props.selectField}
      selectedField={selectedQuarter === 0 ? selectedField : undefined}
    />,
  ];
  const bottom = [
    <Quarter
      quarter={quarter3}
      id={2}
      top={false}
      key={2}
      selectField={props.selectField}
      selectedField={selectedQuarter === 2 ? selectedField : undefined}
      kickedChips={props.kickedChips[0]}
    />,
    <Quarter
      quarter={quarter4}
      id={3}
      top={false}
      key={3}
      selectField={props.selectField}
      selectedField={selectedQuarter === 3 ? selectedField : undefined}
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
