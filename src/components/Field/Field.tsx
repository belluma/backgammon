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
    {className, chips, top, selected, selectField}: Props) => {
    const amount = chips.reduce((a, b) => a + b);
    const getClassName = (i: number) => {
        return ["chip", chips[0] > 0 ? "chip-white" : "chip-black", selected && i === amount - 1 && "selected"].join(' ');
    }
    const chipStack = [...Array(amount)].map((_, i) => <Chip top={top} position={i} className={getClassName(i)}
                                                             key={i}/>)
    return (
        <section
            className={styles.Field}
            data-testid="Field"
            onClick={() => selectField()}
        >
            <div className={className}/>
            {chipStack}
        </section>
    );
};

export default Field;
