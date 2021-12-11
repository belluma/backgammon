import React from 'react'
import Dice from "../Dice/Dice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    beginRound, rollDiceAndCheckForKickedStones,
    selectDiceRoll,
    selectNewRound,
} from "../../slicer/roundSlice";
import {rollDice} from "../../slicer/diceHelper";

type Props = {};

function RolledDice(props: Props) {
    const diceRoll = useAppSelector(selectDiceRoll);
    const newRound = useAppSelector(selectNewRound);
    const dispatch = useAppDispatch();
    const rollTheDice = (e:React.MouseEvent) => {
        e.stopPropagation();
        if (!newRound) return;
        dispatch(beginRound);
        const dice = rollDice();
        dispatch(rollDiceAndCheckForKickedStones(dice));
    }
    return (
        <section className="vertical-align" onClick={rollTheDice}>
            {diceRoll.map((die, i) => <Dice num={die} key={i}/>)}
            {!diceRoll.length && <Dice num={1}/>}
            {!diceRoll.length && <Dice num={1}/>}
        </section>
    )
}

export default RolledDice;
