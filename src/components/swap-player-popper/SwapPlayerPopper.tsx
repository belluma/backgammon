import React, {useState} from 'react'
import {useAppSelector} from "../../app/hooks";
import {selectActivePlayer, selectPlayerNames, selectShowPopper} from "../../slicer/roundSlice";

//component imports

//interface imports

type Props = {
    player: string
};

function SwapPlayerPopper(props: Props) {
    const showPopper = useAppSelector(selectShowPopper);
    const player = useAppSelector(selectActivePlayer);
    const playerNames = useAppSelector(selectPlayerNames)
    const hidden = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        backgroundColor: "white",
        borderRadius: "5px",
        zIndex: 500,
        padding: "15px",
        boxShadow: "5px 5px 28px #888888",
        opacity: 0,
        transition: "opacity 1s"
    } as const
    const shown = {...hidden, opacity: 1}
    return (
        <div style={showPopper ? shown : hidden}>
            <h1 style={{textAlign: 'center'}}>It's your turn {playerNames[player]}</h1>
            <h2 style={{textAlign: 'center'}}>Pleas roll the dice!</h2>
        </div>
    )
}

export default SwapPlayerPopper;
