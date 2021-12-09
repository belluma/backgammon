import React from 'react'
import {rollDice} from "../../helpers/rollDice";
import Dice from "../Dice/Dice";
import useRound from "../../helpers/useRound";

//component imports

//interface imports

type Props = {};

function RolledDice(props: Props){
    const {diceRoll, newRound, setNewRound, setDiceRoll, setDiceLeft} = useRound();
    const rollTheDice = () => {
        if(!newRound)return;
        setNewRound(false);
        const dice = rollDice();
        setDiceRoll(dice);
        setDiceLeft(dice);
    }
    return(
        <section className="vertical-align" onClick={rollTheDice}>
            <Dice num={diceRoll[0]} key={0}/>,
            <Dice num={diceRoll[1]} key={1}/>,
        </section>
    )
}

export default RolledDice;
