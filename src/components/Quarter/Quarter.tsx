import React from "react";
import styles from "./Quarter.module.css";
import Field from "../Field/Field";
import Edge from "../Edge/Edge";

type Props = {
  top: boolean;
  quarter: number[][];
  id: number;
  selectedField?: number | undefined;
  selectField: (id: number) => void;
  className?: string;
  kickedChips?: number;
};

const Quarter = (props: Props) => {
  const quarter = [];
  const q = props.quarter;
  for (let i = 0; i < 6; i++) {
    let classes;
    classes = props.top ? "arrow-down" : "arrow-up";
    classes = i % 2 === 1 ? classes + " red" : classes + " black";
    const f = (
      <Field
        top={props.top}
        chips={q[i]}
        key={i}
        className={classes}
        selectField={() => props.selectField(props.id * 6 + i)}
        selected={props.selectedField === i ? true : false}
      />
    );
    if (props.top) quarter.unshift(f);
    else quarter.push(f);
  }
  if (props.id % 3 !== 0)
    quarter.push(<Edge top={props.top} chips={props.kickedChips} />);

  return (
    <div className={styles.Quarter} data-testid="Quarter">
      <div className={props.className}>{quarter}</div>
    </div>
  );
};

export default Quarter;
