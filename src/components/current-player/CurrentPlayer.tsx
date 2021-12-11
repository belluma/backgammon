import React from 'react'
import Chip from "../Chip/Chip";
import {useAppSelector} from "../../app/hooks";
import {selectActivePlayer, selectPlayerNames} from "../../slicer/roundSlice";


type Props = {};

function CurrentPlayer(props: Props){
    const activePlayer = useAppSelector(selectActivePlayer);
    const playerNames = useAppSelector(selectPlayerNames);
    return(
        <section style={{display: 'flex'}}>
            <h1 style={{paddingRight: 50}}>It's your turn Player {playerNames[activePlayer]}</h1>
            <Chip position={1} className={`chip ${activePlayer ? "chip-black" : "chip-white"}`}/>
        </section>
    )
}

export default CurrentPlayer;
