import React from "react";
import Quarter from "../Quarter/Quarter";

type Props = {
    className?: string;
};

const Board = (props: Props) => {
    const top = [<Quarter id={1} top key={1}/>, <Quarter id={0} top key={0}/>];
    const bottom = [<Quarter id={2} key={2}/>, <Quarter id={3} key={3}/>];

    return (
        <section>
            <section style={{margin: "0", paddingBottom: "0!important"}}>
                {top}
            </section>
            <section>
                {bottom}
            </section>
        </section>
    );
};

export default Board;
