import React from 'react'
import Dice from "../Dice/Dice";
import {rollDice} from "../../helpers/helper";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {beginRound, selectDiceRoll, selectNewRound, setDiceRoll as setDiceRoll} from "../../slicer/roundSlice";

//component imports

//interface imports

type Props = {};

function RolledDice(props: Props){
    const diceRoll = useAppSelector(selectDiceRoll);
    const newRound = useAppSelector(selectNewRound);
    const dispatch = useAppDispatch();
    const rollTheDice = () => {
        if(!newRound)return;
        dispatch(beginRound);
        const dice = rollDice();
        dispatch(setDiceRoll(dice));
    }
    return(
        <section className="vertical-align" onClick={rollTheDice}>
            <Dice num={diceRoll[0]} key={0}/>,
            <Dice num={diceRoll[1]} key={1}/>,
        </section>
    )
}

export default RolledDice;
