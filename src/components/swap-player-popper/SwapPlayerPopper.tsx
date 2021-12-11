import React from 'react'
import {useAppSelector} from "../../app/hooks";
import {selectActivePlayer, selectPlayerNames, selectShowPopper} from "../../slicer/roundSlice";
import {popperHidden, popperShown} from "../../helpers/styleHelper";

//component imports

//interface imports

type Props = {
    player: string
};

function SwapPlayerPopper(props: Props) {
    const showPopper = useAppSelector(selectShowPopper);
    const player = useAppSelector(selectActivePlayer);
    const playerNames = useAppSelector(selectPlayerNames)
    return (
        <div style={showPopper ? popperShown : popperHidden}>
            <h1 style={{textAlign: 'center'}}>It's your turn {playerNames[player]}</h1>
            <h2 style={{textAlign: 'center'}}>Pleas roll the dice!</h2>
        </div>
    )
}

export default SwapPlayerPopper;
