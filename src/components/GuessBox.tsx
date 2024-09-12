/* GuessBox handles API calls to the database when:
 *      1: Entering a guess item --> confirm which fields are correct, if the item exists
 *      2: Optionally enable autocomplete pop-up under text box
 */
// 
import {useState, useEffect} from 'react';
import ResponseGrid from './ResponseGrid.tsx'
// import AdminPostBox from './admin.tsx'


function isAlpha(str:string) {
    // regex search to confirm only alpha characters (plus space)
    return /^[a-zA-Z ]+$/.test(str);
}

class GuessEntity {
    ID: string;
    profession: string;
    season: string;
    sellPrice: string;

    constructor(id: string, prof: string, seas: string, sell: string) {
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
        let priceChar = '';
        if (this.sellPrice > target.sellPrice) {
            priceChar = "greater";
            this.sellPrice = "< " + this.sellPrice;
        }
        else if (this.sellPrice < target.sellPrice) {
            priceChar = "less";
            this.sellPrice = "> " + this.sellPrice;
        }
        else {
            priceChar = "true";
        }

        // determine season string, since it may be multi-season
        let seasonStr = "false";

        if (this.season === target.season){
            seasonStr = "true";
        }
        
        // not a complete match ==> find partial match
        else if (this.season.includes(",") || target.season.includes(",")){
            const selfTokens = this.season.split(",");
            const targetTokens = target.season.split(",");
            for (let i = 0; i < selfTokens.length; i++){
                for (let j = 0; j < targetTokens.length; j++){
                    if (selfTokens[i] === targetTokens[j]){
                        seasonStr = "partial";
                    }
                }
            }
        }
        // NOTE: every season (fish / crop) is different from "none" season (ores)
        // for every/multi-season crops and fish, where that "class" of object are associated to season
        // it tokenizen on comma (,). forageables with NO inherent connection to season have "none" as season
        // 

        let ret_vals: Array<string | boolean | null> = [this.ID, this.profession, this.season, this.sellPrice.toString() + "g",
            this.ID == target.ID, this.profession == target.profession, seasonStr, priceChar];
        return ret_vals;
    }
}

function createInitialGuesses() {
    // initialize the state for the allowed num_guesses
    let num_guesses = 0;
    const initialGuesses = [];
    for (let i = 0; i < num_guesses; i++) {
        let vals: Array<string | boolean | null> = [null, null, null, null];
        initialGuesses.push({ guess_num: i, values: vals});
    }

    return initialGuesses;
}

async function getAPICall(inName: string) {
    const loweredInput = inName.toLowerCase();
    if ( !(isAlpha(loweredInput)) ) {
        console.log("ERROR: Only input alphabet characters!");
        return
    }
    
    // create header for GET request
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // create url and add parameters for API search 
    let getURL = new URL("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage");
    getURL.searchParams.append('ID', loweredInput);

    // send a GET Request to the API  
    const requestOptions: RequestInfo = new Request(getURL, {
        method: "GET",
        headers: headers,
        redirect: 'follow'
    })
    console.log("sending request:", getURL.toString())

    // wait for response
    const response = await fetch(requestOptions);
    const resultText = await response.text();
    const parsed_res = JSON.parse(resultText);
    const parsed_body = JSON.parse(parsed_res.body);
    const inner = parsed_body.Item;
    return inner;
}


function GuessBox() {

    // state variables for the text within the input box 
    const [guess, setGuess] = useState("");
    const [turn, setTurn] = useState(0);
    const [prevGuesses, setPrevGuesses] = useState(createInitialGuesses); 
    const [usedItems, setUsedItems] = useState<string[]>([]);
    const [answer, setAnswer] = useState(new GuessEntity("null", "null", "null", "null"))
    // const [matchBool, setMatchBool] = useState(false);
    
    // let answer = new GuessEntity("starfruit", "farming", "summer", "750");
    
    // figure out how to pick answer differently in future 
    // on first-render hook, choose a random item out of 155
    useEffect(() => {
        console.log("INITIAL PAGE RENDER");
        // sortKey: random num  0 ~ 154

        const asyncSetAnswer = async () => {
        try {
            const randInt = Math.floor(Math.random() * 154);
            let answerStr = ""
            // If I remade the project, I would restructure the database to use unique ID numbers as a primary key
            // Because of how the DB was created, we can't search for ID #'s, and therefore have to search through
            // A .csv instead of load whole database to memory and search.
            fetch('lookupMap.csv')
                .then( response => response.text() )
                .then( text => {
                    const inText = text.split("\r\n");
                    for (let idx = 0; idx < inText.length; idx++){
                        let inArray= inText[idx].split(",");
                        if ( idx < 10){
                            console.log(inArray);
                        }
                        if (inArray[1] == randInt.toString()){
                            answerStr = inArray[0];
                            break;
                        }

                    }
                    console.log("Determined answer:", answerStr);
                    getAPICall(answerStr)
                        .then(response => {
                            console.log("respond", response);
                            console.log(answerStr);
                            setAnswer(new GuessEntity(response.ID, response.profession, response.season, response.sellPrice.toString()));
                        });
            
                })
        }       
        catch (error) {
            console.log("Error trying to call API");
        }
        }
        asyncSetAnswer();
    }, []);

    
    function updateGuessBox(event: React.ChangeEvent<HTMLInputElement>) {
        // when the textbox value is changed, update the guess variable to whatever is inside the textbox
        // call REST GET method to fetch from database
        setGuess(event.target.value);
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
                    let guessedItem = new GuessEntity(inner.ID, inner.profession, inner.season, inner.sellPrice.toString());
                
                    console.log("Guessed item: ", guessedItem.toString());
                    
                    let correctnessArray = guessedItem.compare(answer);
                    
                    if (usedItems.includes(guessedItem.ID)) {
                        alert("already guessed, skip");
                    }                    
                    else {  // otherwise, we have a new guess

                        setPrevGuesses([{guess_num: turn, values: correctnessArray}, ...prevGuesses]);

                        // update prevGuesses with rebuilt array
                        
                        // setPrevGuesses(newGuessesArray);
                        setUsedItems([...usedItems, guessedItem.ID]);
                        console.log("previous guess items: ", usedItems);
                       
                        // correctnessArray[1] stores whether or not it's a match
                        if (correctnessArray[1] === true) {  // win condition
                            // alert("match! Game won");
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
        
        console.log("submitHandler finished");

    }  // end of submitHandler

    // <adminPostBox></AdminPostBox>
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