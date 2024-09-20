import "./grid.css"; 
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

function CurrentResponseRow({guess, rowIndex}: ResponseRowProps) {
    console.log("ResponseRow rendered: ", guess, rowIndex);

    return (
        <div className="responseRow validResponse animated">
            <div className={`${guess[4]?.toString()} animatedBox firstBox`}> {guess[0]?.toString()}</div>
            <div className={`${guess[5]?.toString()} animatedBox secondBox`}> {guess[1]?.toString()}</div>
            <div className={`${guess[6]?.toString()} animatedBox thirdBox`}> {guess[2]?.toString().replace(/,/g, '\n')}</div>
            <div className={`${guess[7]?.toString()} animatedBox fourthBox`}> {guess[3]?.toString()}</div>
        </div>
    )
}

function ResponseRow({guess, rowIndex}: ResponseRowProps) {
    // a singular response row for guesses, rendered at location based off of rowIndex
    // each row has 4 divs based off of each guess value
    // [name, profession, season{s}, price]
    console.log("ResponseRow rendered: ", guess, rowIndex);

    return (
        <div className="responseRow validResponse">
            <div className={`${guess[4]?.toString()} firstBox`}> {guess[0]?.toString()}</div>
            <div className={`${guess[5]?.toString()} secondBox`}> {guess[1]?.toString()}</div>
            <div className={`${guess[6]?.toString()} thirdBox`}> {guess[2]?.toString().replace(/,/g, '\n')}</div>
            <div className={`${guess[7]?.toString()} fourthBox`}> {guess[3]?.toString()}</div>
        </div>
    )
}


function ResponseGrid({currentGuess, previousGuesses, currentTurn}: GridProps) { 
    // hooks into GuessBox, and responds to the onClick
    // ResponseTable component takes all guesses from GuessBox entries, 
    // and is a container that renders each ResponseRow() object 
    console.log("ResponseGrid currentGuess: ", currentGuess);

    if ( currentTurn == 0){
        return <div></div>
    }

    return (
        <div className="stardewFont">
            <div className="rowLabels"> 
                <div>Item</div>
                <div>Profession</div>
                <div>Season</div>
                <div>Price</div>
            </div> 

            {previousGuesses.map((g, idx) => {
                if (idx == 0){
                    return <CurrentResponseRow key = {currentTurn - idx} guess={g.values} rowIndex = {idx}/>
                }
                else{
                    return <ResponseRow key = {currentTurn - idx} guess={g.values} rowIndex = {idx}/>
                }
                
            })}
        </div>
    )
}


export default ResponseGrid;