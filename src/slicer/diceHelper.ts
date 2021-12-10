import {RootState} from "../app/store";

const jumpout = (fieldId:number) => fieldId === -1 || fieldId === 24;
const oneDieExact = (dice: number[], stepsTaken: number) => dice.indexOf(stepsTaken) >= 0;
const removeOneDie = (dice: number[], stepsTaken: number) =>{
    console.log('removeone')
    return dice.splice(dice.indexOf(stepsTaken), 1);}
const noChipNeedsBiggerDie = ({chips, round}:RootState) => {
    const {activePlayer} = round;
    const highestDieNeeded = (chips.board.reduce((a, b, i) => {
        if (activePlayer) return (a < i + 1 && b[activePlayer]) ? i + 1: a;
        else return (a < 24 - i && b[activePlayer]) ? 24 - i : a;
    },0));
    console.log(highestDieNeeded)
    const biggestDie = Math.max(...round.diceRoll);
    console.log(biggestDie)
    console.log(highestDieNeeded < biggestDie)
    return highestDieNeeded <= biggestDie;
}
const removeWhenJumpingOut = (fieldId: number, dice:number[], stepsTaken:number) => {
    console.log('test')
    dice.splice(dice.indexOf(dice.filter(die => die > stepsTaken).sort((a, b) => a - b)[0]), 1);
}
const removeWhenUsingMultipleDice = (dice:  number[], stepsTaken: number) => {
    console.log("removemultiple")
    let counter = 0
    while (dice.slice(0, counter).reduce((a, b) => a + b, 0) < stepsTaken) {
        counter++;
        if (dice.slice(0, counter).reduce((a, b) => a + b, 0) === stepsTaken) {
            dice.splice(0, counter);
            break;
        }
    }
}

export const removeDiceUsed = ({chips, round}: RootState, fieldId: number) => {
    const dice = [...round.diceRoll];
    //@ts-ignore gets executed only after check for selectedChip
    const stepsTaken = Math.abs(fieldId - chips.selectedChip)
    if (oneDieExact(dice, stepsTaken)) removeOneDie(dice, stepsTaken);
    else if (jumpout(fieldId) && noChipNeedsBiggerDie({chips, round})) {
        console.log('123')
        removeWhenJumpingOut(fieldId, dice, stepsTaken);
    } else if (!jumpout(fieldId)) {
        removeWhenUsingMultipleDice(dice, stepsTaken)
    }
    return dice;
}
