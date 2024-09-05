/* GuessBox handles API calls to the database when:
 *      1: Entering a guess item --> confirm which fields are correct, if the item exists
 *      2: Optionally enable autocomplete pop-up under text box
 */
// 
import {useState} from 'react';
import ResponseGrid from './ResponseGrid.tsx'


function isAlpha(str:string) {
    // regex search to confirm only alpha characters
    return /^[a-zA-Z]+$/.test(str);
}

class GuessEntity {
    ID: string;
    profession: string;
    season: string;
    sellPrice: number;

    constructor(id: string, prof: string, seas: string, sell: number) {
        this.ID = id;
        this.profession = prof;
        this.season = seas;
        this.sellPrice = sell;
    }

    toString() {
        return `${this.ID}: ${this.profession}, ${this.season}, ${this.sellPrice}G`;
    }

    compare(target: GuessEntity) {
        // compare this guess entity to the answer item
        // returnTuple: [boolean, boolean, boolean, string];
        let price_char = '';
        if (this.sellPrice > target.sellPrice) {
            price_char = "greater";
        }
        else if (this.sellPrice < target.sellPrice) {
            price_char = "less";
        }
        else {
            price_char = "equal";
        }
        let ret_vals: Array<string | boolean | null> = [this.ID == target.ID, 
            this.profession == target.profession, 
            this.season == target.season, price_char];
        return ret_vals;
    }
}

function createInitialGuesses() {
    // initialize the state for the allowed num_guesses
    let num_guesses = 5;
    const initialGuesses = [];
    for (let i = 0; i < num_guesses; i++) {
        let vals: Array<string | boolean | null> = [null, null, null, null];
        initialGuesses.push({ guess_num: i, values: vals});
    }

    return initialGuesses;
}


function GuessBox() {

    // figure out how to pick answer differently in future 
    const answer = new GuessEntity("starfruit", "farming", "summer", 750);

    // state variables for the text within the input box 
    const [guess, setGuess] = useState("");
    const [turn, setTurn] = useState(0);
    const [prevGuesses, setPrevGuesses] = useState(createInitialGuesses); 
    const [usedItems, setUsedItems] = useState<string[]>([]);
    // const [matchBool, setMatchBool] = useState(false);
    
    function updateGuessBox(event: React.ChangeEvent<HTMLInputElement>) {
        // when the textbox value is changed, update the guess variable to whatever is inside the textbox
        // call REST GET method to fetch from database
        setGuess(event.target.value);
        console.log("Current: ", guess);
    }

    const submitHandler = () => {
        // handler that looks for a submission ==> call API to search DB for desired item
        // call REST GET API to compare values of guess item and actual item
        const guessToLower = guess.toLowerCase();
        // prelim check for only lowercase
        if ( !(isAlpha(guess)) ) {
            alert("Only input alphabet characters!");
            return
        }
        
        // create header for GET request
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        // create url and add parameters for API search 
        let getURL = new URL("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage");
        getURL.searchParams.append('ID', guessToLower);

        // send a GET Request to the API  
        const requestOptions: RequestInfo = new Request(getURL, {
            method: "GET",
            headers: headers,
            redirect: 'follow'
        })
        console.log("sending request:", getURL.toString())

        // wait for response
        fetch(requestOptions)
            .then(response => response.text())  // pull the request response into text

            .then(result => {  // catch reponse into result
                let parsed_res = JSON.parse(result);  
                // console.log("Parsed res: ", parsed_res.toString());
                let parsed_body = JSON.parse(parsed_res.body);
                let inner = parsed_body.Item;

                // if item exists, inner is fruitful => valid guess, so move forward in game loop
                if (inner){
                    // console.log("parsed_body.Item:  ", inner.toString());
                    let guessedItem = new GuessEntity(inner.ID, inner.profession, inner.season, inner.sellPrice);
                
                    console.log("Guessed item: ", guessedItem.toString());
                    
                    let correctnessArray = guessedItem.compare(answer);
                    
                    if (usedItems.includes(guessedItem.ID)) {
                        alert("already guessed, skip");
                    }                    
                    else {  // otherwise, we have a new guess
                        // rebuild a new array (treat state objects as read only, so rebuild)
                        const newGuessesArray = prevGuesses.map(item => {
                            if (item.guess_num === turn) {
                                return {
                                    ...item,
                                    id: turn, values: correctnessArray,
                                };
                            }
                            else {
                                return item;
                            }
                        })

                        // update prevGuesses with rebuilt array
                        setPrevGuesses(newGuessesArray);
                        setUsedItems([...usedItems, guessedItem.ID]);
                        console.log("previous guess items: ", usedItems);
                       
                        if (correctnessArray[0] === true) {  // win condition
                            alert("match! Game won");
                            // figure out how to disable text box and end game
                        }

                        else if (turn === 4) {  // loss condition
                            alert("game lost.");
                        }
                        setTurn(i => i + 1);  
                        // update turn logic 
                    }
                }
                // otherwise, item was not found
                else{
                    alert(`${guess} not found.`);
                }
            })

            .catch(error => console.log('error', error));

        // call POST request for storing guess info to database
        /*  For POST requests, include the body
        const requestOptions: RequestInfo = new Request("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage", {
            method: "GET",
            headers: headers,
            body: JSON.stringify({"ID":guess}),
            redirect: 'follow'
        })
        */
        
        console.log("submitHandler finished");

    }  // end of submitHandler

    return (
        <div>
            <input type="text" 
                    id="guess_box" 
                    name="guess_box" 
                    placeholder="Enter Guess..." 
                    onChange={updateGuessBox}
                    />

            <input type="button" id="submit_button" name="submit_button" value="submit" onClick={submitHandler}/>
            <ResponseGrid currentGuess = {guess} previousGuesses = {prevGuesses} currentTurn = {turn} />
        </div>
    )
}


export default GuessBox;