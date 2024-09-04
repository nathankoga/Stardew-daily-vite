// import {useState} from 'react';
import "./grid.css"; 
// compare with https://github.com/iamshaunjp/React-Wordle/blob/lesson-16/src/hooks/useWordle.js
type GridProps = {
    currentGuess: string; 
    previousGuesses: Array< {guess_num: number, values: Array<string | boolean | null>}>;
    currentTurn: number;
}

type ResponseRowProps = {
    // guess: [boolean, boolean,boolean, string];  // singular guess deconstructed into a tuple
    guess: Array<string | boolean | null>;  // singular guess deconstructed into a tuple
    rowIndex: number;
}

function ResponseRow({guess, rowIndex}: ResponseRowProps) {
    // a singular response row for guesses, rendered at location based off of rowIndex
    // each row has 4 divs based off of each guess value
    // [name, profession, season{s}, price]
    console.log("ResponseRow rendered: ", guess, rowIndex);

    if (guess) {
        return (
        <div className="responseRow">
            <div>{guess[0]?.toString()}</div>
            <div>{guess[1]?.toString()}</div>
            <div>{guess[2]?.toString()}</div>
            <div>{guess[3]}</div>
        </div>
        )
    }

    return (
        <div className="responseRow">
            <div> </div>
            <div> </div>
            <div> </div>
            <div> </div>
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
                return <ResponseRow guess={g.values} rowIndex = {idx}/>
            })}
        </div>
    )
}


export default ResponseGrid;