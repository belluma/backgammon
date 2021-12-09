import React from "react";
import styles from "./Quarter.module.css";
import Field from "../Field/Field";
import Edge from "../Edge/Edge";

type Props = {
    top: boolean;
    quarter: number[][];
    id: number;
    selectedField?: number;
    selectField: (id: number) => void;
    className?: string;
    kickedChips?: number;
};

const Quarter = ({top, quarter, id, selectedField, selectField, className, kickedChips}: Props) => {
    const getClassName = (i: number) => {
        return top ? `arrow-down ${i % 2 ? 'red' : 'black'}` : `arrow-up ${i % 2 ? 'black' : 'red'}`
    }
    const fields = quarter.map((field, index) => {
        const i = top ? 5 - index : index;
        return <Field top={top} chips={quarter[i]} key={i} className={getClassName(i)}
                      selectField={() => selectField(id * 6 + i)} selected={selectedField === i}/>
    })
    return (
        <div className={styles.Quarter} data-testid="Quarter">
            <div className={className}>{fields}
                {id % 3 && <Edge top={top} chips={kickedChips} key={6}/>}</div>
        </div>
    );
};

export default Quarter;
