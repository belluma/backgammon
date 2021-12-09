import React from "react";
import styles from "./Quarter.module.css";
import Field from "../Field/Field";
import Edge from "../Edge/Edge";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectField, selectedChip} from "../../slicer/boardSlice";

type Props = {
    top: boolean;
    quarter: number[][];
    id: number;
    className?: string;
    kickedChips?: number;
};

const Quarter = ({top, quarter, id, className, kickedChips}: Props) => {
    const getClassName = (i: number) => {
        const topColor = i % 2 ? 'red' : 'black';
        const bottomColor = i % 2 ? 'black' : 'red';
        return top ? `arrow-down ${topColor}` : `arrow-up ${bottomColor}`
    };
    const fields = quarter.map((field, index) => {
        const i = top ? 5 - index : index;
        return <Field top={top} chips={quarter[i]} key={i} className={getClassName(i)} index={id * 6 + i}
                      />
    })
    return (
        <div className={styles.Quarter} data-testid="Quarter">
            <div className={className}>{fields}
                {id % 3 && <Edge top={top} chips={kickedChips} key={6}/>}</div>
        </div>
    );
};

export default Quarter;
