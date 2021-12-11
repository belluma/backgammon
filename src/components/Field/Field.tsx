import React from "react";
import styles from "./Field.module.css";
import Chip from "../Chip/Chip";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {handleClickOnField, selectedChip,  selectPossibleMoves} from "../../slicer/boardSlice";

type Props = {
    className: string;
    chips: number[];
    top?: boolean;
    index: number,
};

const Field: React.FC<Props> & React.HTMLAttributes<HTMLDivElement> = (
    {className, chips, top, index}: Props) => {
    const dispatch = useAppDispatch();
    const selected = useAppSelector(selectedChip);
    const possibleMoves = useAppSelector(selectPossibleMoves)
    const possibleTarget = possibleMoves.indexOf(index) >= 0 && "possible-target";
    const selectChip = () =>  {
        dispatch(handleClickOnField(index))
    }
    const amount = chips.reduce((a, b) => a + b);
    const getClassName = (i: number) => {
        return ["chip", "chip-absolute", chips[0] > 0 ? "chip-white" : "chip-black", selected === index && i === amount - 1 && "selected"].join(' ');
    }
    const chipStack = [...Array(amount)].map((_, i) => <Chip top={top} position={i} className={getClassName(i)}
                                                             key={i}/>)
    return (
        <section
            className={styles.Field}
            data-testid="Field"
            onClick={ selectChip}
        >
            <div className={`${className} ${possibleTarget}`}/>
            {chipStack}
        </section>
    );
};

export default Field;
