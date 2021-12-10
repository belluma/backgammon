import React from 'react'
import Dice from "../Dice/Dice";
import {rollDice} from "../../helpers/helper";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    beginRound, rollDiceAndCheckForKickedStones,
    selectDiceRoll,
    selectNewRound,
    setDiceRoll as setDiceRoll
} from "../../slicer/roundSlice";

//component imports

//interface imports

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
