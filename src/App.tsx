import React from "react";
import "./App.css";
import Board from "./components/Board/Board";
import Dice from "./components/Dice/Dice";

function App() {
  let board: number[][] = [...Array(24)].map((a) => (a = [0, 0]));
  let setup = [
    { pos: 0, amount: 2 },
    { pos: 11, amount: 5 },
    { pos: 16, amount: 3 },
    { pos: 18, amount: 5 },
  ];
  for (let i = 0; i < setup.length; i++) {
    const position = setup[i].pos;
    board[position][0] = setup[i].amount;
    board[board.length - 1 - position][1] = setup[i].amount;
  }
  // let dieOne:number, dieTwo:number
  const rollDie = () => Math.floor(Math.random() * 6) + 1;
  const [dice, setDice] = React.useState({
    dieOne: rollDie(),
    dieTwo: rollDie(),
  });

  const rollDice = () => {
    setDice({ ...dice, dieOne: rollDie(), dieTwo: rollDie() });
    console.log(dice);
  };

  const selectField = (id: number) => {
    console.log(id);
  };
  let rolledDice = [
    <Dice num={dice.dieOne} key={0} />,
    <Dice num={dice.dieTwo} key={1} />,
  ];
  return (
    <section className={"board"}>
      <section style={{ display: "inline-block" }}>
        <Board board={board} selectField={selectField} />
      </section>
      <section className="side">
        <section className="vertical-align" onClick={rollDice}>
          {rolledDice}
        </section>
      </section>
    </section>
  );
}

export default App;
