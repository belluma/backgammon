import React from "react";
import styles from "./Chip.module.css";

type Props = {
  className?: string;
  position: number;
  top: boolean;
};

const Chip: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (
  props
) => (
  <button
    className={props.className}
    style={
      props.top
        ? { top: props.position * 55 }
        : { top: 245 - props.position * 55 }
    }
    data-testid="Chip"
  ></button>
);

export default Chip;
