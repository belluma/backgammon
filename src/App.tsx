import React, { useEffect} from "react";
import "./App.css";
import Board from "./components/Board/Board";
import RolledDice from "./components/rolled-dice/RolledDice";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {setDiceRoll, selectActivePlayer, swapPlayers, hidePopper} from "./slicer/roundSlice";
import {handleClickOnField} from "./slicer/boardSlice";
import {determineStartingPlayer} from "./slicer/diceHelper";
import SwapPlayerPopper from "./components/swap-player-popper/SwapPlayerPopper";
import {center} from "./helpers/styleHelper";

function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(hidePopper());
        const dice = determineStartingPlayer()
        dispatch(setDiceRoll(dice));
        if (dice[0] < dice[1]) dispatch(swapPlayers())
    }, [dispatch]);
    const jumpout = () => {
        dispatch(handleClickOnField(activePlayer ? -1 : 24))
    }
    const activePlayer = useAppSelector(selectActivePlayer);

    return (
        <section style={center}>
            <SwapPlayerPopper player={'test'} />
            <h1>It's your turn Player {activePlayer}</h1>
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
