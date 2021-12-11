import React from "react";
import styles from "./Quarter.module.css";
import Field from "../Field/Field";
import Edge from "../Edge/Edge";
import {useAppSelector} from "../../app/hooks";
import {selectBoard} from "../../slicer/boardSlice";

type Props = {
    top?: boolean;
    id: number;
    className?: string;
};

const Quarter = ({top,  id, className}: Props) => {
    const board = useAppSelector(selectBoard);
    const quarter = board.slice(id * 6, id * 6 + 6);
    const getClassName = (i: number) => {
        const topColor = i % 2 ? 'black' : 'red';
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
                {id % 3 && <Edge top={top} key={6}/>}</div>
        </div>
    );
};

export default Quarter;
