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
import CurrentPlayer from "./components/current-player/CurrentPlayer";
import PointsCounter from "./components/points-counter/PointsCounter";

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

    return (
        <section style={center}>
            <SwapPlayerPopper player={'test'}/>
            <NameInput/>
            <section style={{display: 'flex', justifyContent:'space-between'}}>
            <CurrentPlayer />
            <PointsCounter />
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
