import React from "react";
import styles from "./Field.module.css";
import Chip from "../Chip/Chip";

type Props = {
  className?: string;
  chips: number[];
  top: boolean;
  selected?: boolean;
  selectField: () => void;
};

const Field: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (
  props
) => {
  const chips = [];
  const amount = props.chips.reduce((a, b) => a + b);
  for (let i = 0; i < amount; i++) {
    const classNames = ["chip"];
    props.chips[0] > 0
      ? classNames.push("chip-white")
      : classNames.push("chip-black");
    if (props.selected && i === amount - 1) classNames.push("selected");
    chips.push(
      <Chip
        top={props.top}
        position={i}
        className={classNames.join(" ")}
        key={i}
      />
    );
  }

  return (
    <section
      className={styles.Field}
      data-testid="Field"
      onClick={() => props.selectField()}
    >
      <div className={props.className}></div>
      {chips}
    </section>
  );
};

export default Field;
