import {useState} from "react";


const useRound = () => {
    const [activePlayer, setActivePlayer] = useState<1 | 0>(0);
    const [enemyPlayer, setEnemyPlayer] = useState<1 | 0>(1);
    const [round, setRound] = useState<number>(0);
    const [diceRoll, setDiceRoll] = useState<number[]>([1, 1]);
    const [diceLeft, setDiceLeft] = useState<number[]>();


    return {
        activePlayer,
        setActivePlayer,
        enemyPlayer,
        setEnemyPlayer,
        round,
        setRound,
        diceRoll,
        setDiceRoll,
        diceLeft,
        setDiceLeft
    }


}


export default useRound
