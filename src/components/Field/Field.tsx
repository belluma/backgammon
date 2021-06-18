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
  for (let i = 0; i < props.chips[0]; i++) {
    const classNames = ["chip", "chip-white"];
    if (props.selected && i === props.chips[0] - 1) classNames.push("selected");
    chips.push(
      <Chip
        top={props.top}
        position={i}
        className={classNames.join(" ")}
        key={i}
      />
    );
  }
  for (let i = 0; i < props.chips[1]; i++) {
    const classNames = ["chip", "chip-black"];
    if (props.selected && i === props.chips[1] - 1) classNames.push("selected");
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