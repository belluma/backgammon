import React, {useState, useEffect} from "react";
import "./App.css";
import Board from "./components/Board/Board";
import Dice from "./components/Dice/Dice";
import useBoard from "./helpers/useBoard";

//initial setup of the board
function App() {
    const {board, setBoard, resetBoard, kickedChips, setKickedChips} = useBoard();
    const rollDie = () => {
        return Math.floor(Math.random() * 6) + 1;
    };
    const [game, setGame] = useState({
        activePlayer: 0,
        enemyPlayer: 1,
        round: 0,
        diceRoll: [0],
        diceLeft: [0],
    });
    const [dice, setDice] = useState({
        dieOne: 1,
        dieTwo: 1,
    });
    const [selectedChip, setSelectedChip] = useState({selected: false, id: 0});
    const rollDice = () => {
        setDice({...dice, dieOne: rollDie(), dieTwo: rollDie()});
    };

    //before gamestart
    const rollDiceToDetermineStartingPlayer = () => {
        if (game.round === 0) {
            if (dice.dieOne === dice.dieTwo) rollDice();
            else
                setGame({
                    ...game,
                    activePlayer: dice.dieOne > dice.dieTwo ? 0 : 1,
                    enemyPlayer: dice.dieOne > dice.dieTwo ? 1 : 0,
                    round: game.round + 1,
                    diceLeft: saveDicerollInArrayToKeepTrackOfMovements(),
                    diceRoll: saveDicerollInArrayToKeepTrackOfMovements(),
                });
        }
    };

    //each round
    const saveDicerollInArrayToKeepTrackOfMovements = () => {
        return dice.dieOne === dice.dieTwo
            ? [...Array(4)].map((_) => dice.dieOne)
            : [dice.dieOne, dice.dieTwo];
    };
    const fieldIsFree = (field: number): boolean => {
        return field === -1 || field === 24
            ? true
            : board[field][game.enemyPlayer] <= 1;
    };
    const getTargetPosition = (startField: number, diceRoll: number): number => {
        return game.activePlayer === 0
            ? startField + diceRoll
            : startField - diceRoll;
    };

    const hasChipsOnField = (field: number, player: number): boolean =>
        board[field][player] > 0;

    const hasChipsKickedOut = (): boolean => kickedChips[game.activePlayer] > 0;

    const opponent = (player: number) => player * -1 + 1

    const removeChipFromField = (fieldIndex: number, player: number, currentBoard:number[][] ): void  => {
        currentBoard[fieldIndex][player]--;

        // const fieldWithStoneRemoved = [...currentBoard[fieldIndex]];
        // fieldWithStoneRemoved[player]--
        // return currentBoard.map((field, index) => fieldIndex === index ? fieldWithStoneRemoved : field);
    };
    const addChipToField = (fieldIndex: number, player: number, currentBoard:number[][] ): void => {
        currentBoard[fieldIndex][player]++;
        // const fieldWithStoneAdded = [...currentBoard[fieldIndex]];
        // fieldWithStoneAdded[player]++
        // return (currentBoard.map((field, index) => fieldIndex === index ? fieldWithStoneAdded : field));
    };
    const returnOnBoard = (): void => {
        kickedChips[game.activePlayer]--;
    };

    const takeEnemyStone = (field: number, currentBoard: number[][]): void => {
        currentBoard[field][game.enemyPlayer]--;
        kickedChips[game.enemyPlayer]++;
    };
    const allChipsInHomeQuarter = (): boolean => {
        const notHome =
            game.activePlayer === 0 ? board.slice(0, 18) : board.slice(6);
        if (kickedChips[game.activePlayer] > 0) return false;
        return notHome.reduce((a, b) => a + b[game.activePlayer], 0) === 0;
    };
    const allChipsJumpedOut = (): boolean =>
        board.reduce((a, b) => a + b[game.activePlayer], 0) === 0 &&
        !hasChipsKickedOut();
    const endGame = (): void => {
        resetBoard();
        alert(`Player ${game.activePlayer} won the game`);
        setGame({...game, round: 0});
    };
    const isOnBoard = (field: number): boolean => {
        return allChipsInHomeQuarter()
            ? field >= -1 && field <= 24
            : field >= 0 && field < 24;
    };

    const noChipsBehindInHomeField = (fieldId: number) => {
        return game.activePlayer === 0
            ? board
            .slice(18, fieldId)
            .reduce((a, b) => a + b[game.activePlayer], 0) === 0
            : board
            .slice(fieldId + 1, 6)
            .reduce((a, b) => a + b[game.activePlayer], 0) === 0;
    };
    const takeChipOutOfGame = (fieldId: number, player = game.activePlayer) => {
        const distance = player === 0 ? 24 - fieldId : fieldId + 1;
        for (const die of game.diceLeft) {
            if (distance === die || (distance < die && noChipsBehindInHomeField(fieldId))) {
                removeChipFromField(fieldId, player, board)
                return die
            }
        }
    };
    const getMovesForNonDoubleRoll = (
        selectedField: number,
        diceRoll: number[]
    ): number[] => {
        const freeFields = [];
        let target = getTargetPosition(selectedField, diceRoll[0]);
        if ((isOnBoard(target) && fieldIsFree(target)) || allChipsInHomeQuarter())
            freeFields.push(target);
        target = getTargetPosition(selectedField, diceRoll[1]);
        if ((isOnBoard(target) && fieldIsFree(target)) || allChipsInHomeQuarter())
            freeFields.push(target);
        target = getTargetPosition(selectedField, diceRoll[0] + diceRoll[1]);
        if (
            (freeFields.length && isOnBoard(target) && fieldIsFree(target)) ||
            allChipsInHomeQuarter()
        )
            freeFields.push(target);
        return freeFields;
    };
    const getMovesWhenChipsOut = (diceRoll: number[]): number[] => {
        const freeFields: number[] = [];
        game.activePlayer === 0
            ? diceRoll.forEach((a) => {
                if (fieldIsFree(a - 1)) freeFields.push(a - 1);
            })
            : diceRoll.forEach((a) => {
                if (fieldIsFree(24 - a)) freeFields.push(24 - a);
            });
        console.log(freeFields);
        return freeFields;
    };
    const getPossibleMoves = (
        diceRoll: number[],
        freeFields: number[] = [],
        index: number = 0,
        selectedField: number | undefined = selectedChip.id
    ): number[] => {
        if (selectedField === undefined) return [];
        if (index === diceRoll.length) return freeFields;
        let f = freeFields;
        if (hasChipsKickedOut()) {
            return getMovesWhenChipsOut(diceRoll);
        }
        if (diceRoll.length === 4) {
            const target = getTargetPosition(selectedField, diceRoll[index]);
            if (
                (isOnBoard(target) && fieldIsFree(target)) ||
                allChipsInHomeQuarter()
            ) {
                f.push(target);
                return getPossibleMoves(diceRoll, f, index + 1, target);
            }
        } else {
            return getMovesForNonDoubleRoll(selectedField, diceRoll);
        }
        return f;
    };
    const noMovesPossible = () => {
        for (let i = 0; i < board.length; i++) {
            if (getPossibleMoves(game.diceLeft, [], 0, i).length > 0) return false;
        }
        return true;
    };
    const determineWhichDiceUsed = (
        fieldId: number,
        status: "normal" | "kicked" | 'jumpout',
        dieUsed: number = 0
    ): number => {
        if (status === "normal") return Math.abs(fieldId - selectedChip.id);
        else if (status === "kicked")
            return game.activePlayer === 0 ? fieldId + 1 : 24 - fieldId;
        else return dieUsed;
    };
    const diceNotUsedYet = (diceRoll: number[], steps: number): number[] => {
        let start, end;
        if (diceRoll.indexOf(steps) === -1) {
            start = 0;
            if (diceRoll.length === 2) {
                end = 0;
            } else {
                end = diceRoll.length - steps / diceRoll[0];
                console.log(end);
                console.log(game.diceLeft.slice(start, end));
            }
        } else {
            start = diceRoll.indexOf(steps) === 0 ? 1 : 0;
            end = start === 0 ? 1 : 4;
        }
        return game.diceLeft.slice(start, end);
    };
    const updateDice = (
        fieldId: number,
        status: "normal" | "kicked" | "jumpout",
        distanceMoved: number = 0
    ): void => {
        const usedDie = determineWhichDiceUsed(fieldId, status, distanceMoved);
        console.log(usedDie);
        const unusedDice = diceNotUsedYet(game.diceLeft, usedDie);
        setGame({
            ...game,
            diceLeft: unusedDice,
        });
        setSelectedChip({...selectedChip, selected: false});
        if (allChipsJumpedOut()) endGame();
        if (unusedDice.length === 0) {
            endRound();
        }
    };
    const selectChipWhenNoneSelected = (fieldId: number): void => {
        if (
            !hasChipsKickedOut() &&
            !selectedChip.selected &&
            hasChipsOnField(fieldId, game.activePlayer) &&
            getPossibleMoves(game.diceLeft, [], 0, fieldId).length > 0
        ) {
            setSelectedChip({...selectedChip, selected: true, id: fieldId});
        }
    };
    const unselectChip = (fieldId: number): void => {
        if (selectedChip.id === fieldId && selectedChip.selected)
            setSelectedChip({...selectedChip, selected: false});
    };
    const endRound = (): void => {
        rollDice();
        setGame({
            ...game,
            activePlayer: game.enemyPlayer,
            enemyPlayer: game.activePlayer,
            round: game.round + 1,
        });
    };
    const possibleMovesLeft = (fieldId: number): boolean => getPossibleMoves(game.diceLeft).indexOf(fieldId) > 1;

    const selectField = (fieldId: number) => {
        let status: "normal" | "kicked" | "jumpout" = "normal";
        const currentBoard = [...board.map(field => [...field])];
        if (noMovesPossible()) endRound();
        if (
            allChipsInHomeQuarter() &&
            selectedChip.selected &&
            selectedChip.id === fieldId
        ) {
            const diceUsed = takeChipOutOfGame(fieldId);
            if (diceUsed) {
                updateDice(fieldId, "jumpout", diceUsed);
                return;
            }
        }
        selectChipWhenNoneSelected(fieldId);
        unselectChip(fieldId);


        if (
            (selectedChip.selected || hasChipsKickedOut()) &&
            getPossibleMoves(game.diceLeft).indexOf(fieldId) > -1
        ) {
            if (hasChipsKickedOut()) {
                status = "kicked";
                returnOnBoard();
            } else {
                removeChipFromField(selectedChip.id, game.activePlayer, currentBoard)
                // setBoard(addChipToField(fieldId, game.activePlayer, (removeChipFromField(selectedChip.id, game.activePlayer))))
            }
            if (hasChipsOnField(fieldId, game.enemyPlayer)) takeEnemyStone(fieldId, currentBoard);
            addChipToField(fieldId, game.activePlayer, currentBoard);
            updateDice(fieldId, status);
            setBoard(currentBoard)
        }
    };

    useEffect(() => {
        if (game.round === 0) rollDiceToDetermineStartingPlayer();
        else {
            const diceRoll = saveDicerollInArrayToKeepTrackOfMovements();
            setGame({
                ...game,
                diceLeft: diceRoll,
                diceRoll: diceRoll,
            });
        }
    }, [dice]);


    let rolledDice = [
        <Dice num={dice.dieOne} key={0}/>,
        <Dice num={dice.dieTwo} key={1}/>,
    ];
    return (
        <section>
            <h1>It's your turn Player {game.activePlayer}</h1>
            <section className={"board"}>
                <section style={{display: "inline-block"}}>
                    <Board
                        board={board}
                        selectField={selectField}
                        selectedField={selectedChip}
                        kickedChips={kickedChips}
                    />
                </section>
                <section className="side">
                    <section className="vertical-align" onClick={rollDice}>
                        {rolledDice}
                    </section>
                </section>
            </section>
        </section>
    );
}

export default App;
