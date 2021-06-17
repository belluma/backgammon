import React from "react";
import styles from "./Field.module.css";
import Chip from "../Chip/Chip";
import { field } from "../../interfaces";

type Props = {
  className?: string;
  chips: field;
  top: boolean;
  // field?:field
};

const Field: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (
  props
) => {
  const chips = [];
  for (let i = 0; i < props.chips?.w; i++)
    chips.push(
      <Chip top={props.top} position={i} className="chip chip-white" key={i} />
    );
  for (let i = 0; i < props.chips?.b; i++)
    chips.push(
      <Chip top={props.top} position={i} className="chip chip-black" key={i} />
    );
  return (
    <section className={styles.Field} data-testid="Field">
      <div className={props.className}></div>
      {chips}
    </section>
  );
};

export default Field;
