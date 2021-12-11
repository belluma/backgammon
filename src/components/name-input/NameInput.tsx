import React, {ChangeEvent, SyntheticEvent, useState} from 'react'
import {popperHidden, popperShown} from "../../helpers/styleHelper";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {savePlayerName, selectPlayerNames, startGame} from "../../slicer/roundSlice";


type Props = {};

function NameInput(props: Props) {
    const dispatch = useAppDispatch()
    const [player, setPlayer] = useState(0)
    const playerNames = useAppSelector(selectPlayerNames)
    const [name, setName] = useState(playerNames[player])
    const changeName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const saveName = (e: SyntheticEvent) => {
        setPlayer(player + 1);
        !player && setName(playerNames[1])
        dispatch(savePlayerName({player, name}))
        if (player) dispatch(startGame())
    }
    return (
        <section style={player < 2 ? popperShown : popperHidden}>
            <h1>please choose your name {playerNames[player]}</h1>
            <input style={{width: "80%", fontSize: "x-large"}} type="text" value={name} onChange={changeName}/>
            <button style={{fontSize: "16px", marginBottom: 15,marginLeft: 10, width: "15%"}} onClick={saveName}>Save</button>
        </section>
    )
}

export default NameInput;
