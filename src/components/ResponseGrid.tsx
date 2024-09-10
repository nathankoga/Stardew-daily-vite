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

    // pre-define render values here??
    
    // pull out guess[1] --> we could have multi-season items

    // render past guesses automatically
    // next add conditional rendering to each inner div based off of specific rules
    // guess[0] contains name of item ==> future bitmap search --> OR we send a tuple pair of bitmap instead
    // if (guess[0]) {
        return (
        <div className="responseRow validResponse">
            <div className={guess[4]?.toString()}> {guess[0]?.toString()}</div>
            <div className={guess[5]?.toString()}> {guess[1]?.toString()}</div>
            <div className={guess[6]?.toString()}> {guess[2]?.toString()}</div>
            <div className={guess[7]?.toString()}> {guess[3]?.toString()}</div>
        </div>
        )
    // }

    // add pop-up animation when rendering current guess (possibly) 
    /*
    return (
        <div className="responseRow emptyResponse">
            <div> </div>
            <div> </div>
            <div> </div>
            <div> </div>
        </div>
    )*/
}



function ResponseGrid({currentGuess, previousGuesses, currentTurn}: GridProps) { 
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
        <div className="stardewFont">
            <div className="rowLabels"> 
                <div>Item</div>
                <div>Profession</div>
                <div>Season</div>
                <div>Price</div>
            </div> 

            {previousGuesses.map((g, idx) => {
                return <ResponseRow guess={g.values} rowIndex = {idx}/>
            })}
        </div>
    )
}


export default ResponseGrid;