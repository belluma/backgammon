import React from 'react'
import {useAppSelector} from "../../app/hooks";
import {selectActivePlayer, selectGameEnded, selectPlayerNames, selectShowPopper} from "../../slicer/roundSlice";
import {popperHidden, popperShown} from "../../helpers/styleHelper";

type Props = {
    player: string
};

function SwapPlayerPopper(props: Props) {
    const showPopper = useAppSelector(selectShowPopper);
    const player = useAppSelector(selectActivePlayer);
    const playerNames = useAppSelector(selectPlayerNames)
    const gameEnd = useAppSelector(selectGameEnded);
    const message = gameEnd ? `${playerNames[player]} has won the round` : `It's your turn ${playerNames[player]}`

    return (
        <div style={showPopper ? popperShown : popperHidden}>
            <h1 style={{textAlign: 'center'}}>{message}</h1>
            <h2 style={{textAlign: 'center'}}>Pleas roll the dice!</h2>
        </div>
    )
}

export default SwapPlayerPopper;
