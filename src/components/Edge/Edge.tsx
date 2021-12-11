import React from "react";
import styles from "./Edge.module.css";
import Chip from "../Chip/Chip";
import {useAppSelector} from "../../app/hooks";
import {selectKickedChips} from "../../slicer/boardSlice";

type Props = {
    top?: boolean;
};

const Edge = ({top}: Props) => {
    const kickedChips = useAppSelector(selectKickedChips);
    const chips = top ? kickedChips[1] : kickedChips[0]
    const classNames = top
        ? ["chip", "chip-black"]
        : ["chip", "chip-white"];
    return <div className={styles.Edge}>
        {[...Array(chips)].map((chip, i) => <Chip
            top={top}
            className={classNames.join(" ")}
            position={i}
            key={i}
        />)}
    </div>;
};

export default Edge;
