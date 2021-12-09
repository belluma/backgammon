import {useCallback, useEffect, useState} from "react";
import {rollDice} from "./rollDice";


const useRound = () => {
    const [activePlayer, setActivePlayer] = useState<1 | 0>(0);
    const [enemyPlayer, setEnemyPlayer] = useState<1 | 0>(0);
    const [round, setRound] = useState<number>(0);
    const [diceRoll, setDiceRoll] = useState<number[]>([1, 1]);
    const [newRound, setNewRound] = useState(false);

    const determineStartingPlayer = useCallback(() => {
        const dice = rollDice();
        setDiceRoll(dice);
        if (dice.length < 3) {
            setActivePlayer(dice[0] > dice[1] ? 0 : 1);
            setEnemyPlayer(dice[0] < dice[1] ? 0 : 1);
            return;
        }
        setTimeout(determineStartingPlayer, 600);
    }, [])
    useEffect(() => {
        determineStartingPlayer()
    }, [determineStartingPlayer])

    return {
        activePlayer,
        setActivePlayer,
        enemyPlayer,
        setEnemyPlayer,
        round,
        setRound,
        diceRoll,
        setDiceRoll,
        newRound,
        setNewRound
    }


}


export default useRound
