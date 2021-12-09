import React from "react";

type Props = {
  className?: string;
  position: number;
  top: boolean;
};

const Chip: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (
  props
) => {
  const skew = (props.position % 5) * 55 + Math.floor(props.position / 5) * 20;
  return (
    <button
      className={props.className}
      style={
        props.top
          ? {
              top: skew,
            }
          : { top: 245 - skew }
      }
      data-testid="Chip"
    ></button>
  );
};

export default Chip;
