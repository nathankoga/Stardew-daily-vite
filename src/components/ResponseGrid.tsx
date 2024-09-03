// import {useState} from 'react';
// import 


type GridProps = {
    currentGuess: string; 
    previousGuesses: Array<[boolean, boolean,boolean, string]>;
    currentTurn: number;
}

type ResponseRowProps = {
    guess: [boolean, boolean,boolean, string];  // singular guess deconstructed into a tuple
    rowIndex: number;
}

function ResponseRow({guess, rowIndex}: ResponseRowProps) {
    // a singular response row for guesses, rendered at location based off of rowIndex
    // each row has 4 divs based off of each guess value
    console.log("ResponseRow rendered: ", guess, rowIndex);
    return (
        <div className="responseRow">
            <div></div>
            <div></div>
            <div></div>
            <div></div>

        </div>
    )
}



function ResponseGrid({currentGuess, previousGuesses, currentTurn}: GridProps) { 
    //{currentGuess: string, previousGuesses: Array<[]>} ) {
    // state variables for current guess
    // const [currentResponse, updateResponse] = useState([]);

    // hooks into GuessBox, and responds to the onClick
    // ResponseTable component takes all guesses from GuessBox entries, 
    // and is a container that renders each ResponseRow() object 
    console.log("ResponseGrid currentGuess: ", currentGuess);
    console.log("ResponseGrid currentTurn: ", currentTurn);
    /* function updateResponseGrid() {
    }*/

    return (
        <div>
            {previousGuesses.map((g, idx) => {
                return <ResponseRow guess={g} rowIndex = {idx}/>
            })}
        </div>
    )
}


export default ResponseGrid;