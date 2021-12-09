import React from "react";
import styles from "./Dice.module.css";
import one from "../../img/dado-1.svg";
import two from "../../img/dado-2.svg";
import three from "../../img/dado-3.svg";
import four from "../../img/dado-4.svg";
import five from "../../img/dado-5.svg";
import six from "../../img/dado-6.svg";

type Props = {
  num: number;
};

const Dice = (props: Props) => {

  const points = [one, two, three, four, five, six];
  let topSide = points[props.num - 1];
  return (
    <div className={styles.Dice}>
      <img src={topSide} alt="one" style={{ width: "100px" }} />
    </div>
  );
};

export default Dice;
