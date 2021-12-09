import {useState} from "react";


const useBoard = () => {
    const boardSetup: number[][] = [...Array(24)].map((a) => [0, 0]);
    const chips = [
        { pos: 0, amount: 2 },
        { pos: 11, amount: 5 },
        { pos: 16, amount: 3 },
        { pos: 18, amount: 5 },
    ];
    boardSetup.forEach((field, i) => {
        field[0] = field[1] = 0;
        chips.forEach((a) => {
            if (i === a.pos) field[0] = a.amount;
            else if (23 - i === a.pos) field[1] = a.amount;
        });
    });
    const resetBoard = () => {
        setBoard(boardSetup)
    };
    const [kickedChips, setKickedChips] = useState([0, 0]);
    const [board, setBoard] = useState(boardSetup);

    return {board, setBoard, resetBoard, kickedChips, setKickedChips};
}

export default useBoard
