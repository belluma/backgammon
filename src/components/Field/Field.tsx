import React from "react";
import styles from "./Field.module.css";
import Chip from "../Chip/Chip";

type Props = {
  className?: string;
  chips: number[];
  top: boolean;
  selectField: () => void;
};

const Field: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (
  props
) => {
  const chips = [];
  for (let i = 0; i < props.chips[0]; i++)
    chips.push(
      <Chip top={props.top} position={i} className="chip chip-white" key={i} />
    );
  for (let i = 0; i < props.chips[1]; i++)
    chips.push(
      <Chip top={props.top} position={i} className="chip chip-black" key={i} />
    );
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
