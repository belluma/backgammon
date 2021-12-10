import {RootState} from "../app/store";

export const removeDiceUsed = ({board, round}: RootState, fieldId: number) => {
    const dice = [...round.diceRoll];
    //@ts-ignore gets executed only after check for selectedChip
    const stepsTaken = Math.abs(fieldId - board.selectedChip)
    const index = dice.indexOf(stepsTaken);
    if (index >= 0) dice.splice(index, 1);
    else{
        let counter = 0
        while(dice.slice(0,counter).reduce((a, b) => a + b, 0) < stepsTaken){
            counter++;
        }
        dice.splice(0, counter);
    }
    return dice;
}
