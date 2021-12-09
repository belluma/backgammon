import {useState} from "react";


const useRound = () => {
    const [activePlayer, setActivePlayer] = useState<1 | 0>(0);
    const [enemyPlayer, setEnemyPlayer] = useState<1 | 0>(1);
    const [round, setRound] = useState<number>(0);
    const [diceRoll, setDiceRoll] = useState<number[]>()
    const [diceLeft, setDiceLeft] = useState<number[]>()





    return{activePlayer, enemyPlayer, round, diceRoll, diceLeft}


}


export default useRound
