const rollDie = () => Math.floor(Math.random() * 6) + 1;
export const rollDice = () => {
    const roll = [rollDie(), rollDie()];
    return roll[0] === roll[1] ? [...roll, ...roll] : roll
}


export const determineStartingPlayer:any = () => {
    const dice = rollDice();
    if (dice.length < 3) {
        return dice;
    }
   return  determineStartingPlayer();
}
