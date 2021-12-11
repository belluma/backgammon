import React, {useEffect} from "react";
import "./App.css";
import Board from "./components/Board/Board";
import RolledDice from "./components/rolled-dice/RolledDice";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {
    setDiceRoll,
    selectActivePlayer,
    swapPlayers,
    hidePopper,
    selectGameStarted,
    selectPlayerNames
} from "./slicer/roundSlice";
import {handleClickOnField} from "./slicer/boardSlice";
import {determineStartingPlayer} from "./slicer/diceHelper";
import SwapPlayerPopper from "./components/swap-player-popper/SwapPlayerPopper";
import {center} from "./helpers/styleHelper";
import NameInput from "./components/name-input/NameInput";
import Chip from "./components/Chip/Chip";

function App() {
    const dispatch = useAppDispatch();
    const gameStarted = useAppSelector(selectGameStarted)
    useEffect(() => {
        dispatch(hidePopper());
        if (!gameStarted) return;
        const dice = determineStartingPlayer()
        dispatch(setDiceRoll(dice));
        if (dice[0] < dice[1]) dispatch(swapPlayers())
    }, [dispatch, gameStarted]);
    const jumpout = () => {
        dispatch(handleClickOnField(activePlayer ? -1 : 24))
    }
    const activePlayer = useAppSelector(selectActivePlayer);
    const playerNames = useAppSelector(selectPlayerNames);

    return (
        <section style={center}>
            <SwapPlayerPopper player={'test'}/>
            <NameInput/>
            <section style={{display: 'flex'}}>
                <h1 style={{paddingRight: 50}}>It's your turn Player {playerNames[activePlayer]}</h1>
                <Chip position={1} className={`chip ${activePlayer ? "chip-black" : "chip-white"}`}/>
            </section>
            <section className={"board"}>
                <section style={{display: "inline-block"}}>
                    <Board
                    />
                </section>
                <section className="side" onClick={jumpout}>
                    <RolledDice/>
                </section>
            </section>
        </section>
    );
}

export default App;
