import React from "react";
import styles from "./Quarter.module.css";
import Field from "../Field/Field";
import { field } from "../../interfaces";

type Props = {
  top: boolean;
  quarter: field[];
};

const Quarter = (props: Props) => {
  const quarter = [];
  const q = props.quarter;
  for (let i = 0; i < 6; i++) {
    let classes;
    if (props.top)
      classes = i % 2 === 1 ? "arrow-down red" : "arrow-down black";
    else classes = i % 2 === 1 ? "arrow-up black" : "arrow-up red";

    quarter.push(
      <Field top={props.top} chips={q[i]} key={i} className={classes} />
    );
  }

  return (
    <div className={styles.Quarter} data-testid="Quarter">
      {quarter}
    </div>
  );
};

export default Quarter;
