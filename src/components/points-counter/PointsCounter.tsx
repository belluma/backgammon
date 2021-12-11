import React from 'react'
import {useAppSelector} from "../../app/hooks";
import {selectPlayerNames, selectPoints} from "../../slicer/roundSlice";

//component imports

//interface imports

type Props = {};

function PointsCounter(props: Props) {
    const playerNames = useAppSelector(selectPlayerNames);
    const points = useAppSelector(selectPoints);
    return (
        <div style={{paddingRight: 100}}>
            <p>{playerNames[0]}: {points[0]}</p>
            <p>{playerNames[1]}: {points[1]}</p>
        </div>
    )
}

export default PointsCounter;
