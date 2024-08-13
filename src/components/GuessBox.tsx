/* GuessBox handles API calls to the database when:
 *      1: Entering a guess item --> confirm which fields are correct, if the item exists
 *      2: Optionally enable autocomplete pop-up under text box
 */
// 
import {useState} from 'react';


function GuessBox() {

    // state variables for the text within the input box 
    const [guess, setGuess] = useState("");

    function updateGuessBox(event: React.ChangeEvent<HTMLInputElement>) {
        // when the textbox value is changed, update the guess variable to whatever is inside the textbox
        setGuess(event.target.value);
    }

    const submitHandler = () => {
        // handler that looks for a submission ==> call API to search DB for desired item
        console.log("clicked, submitting %s", guess);
    }

    return (
        <div>
            <input type="text" 
                    id="guess_box" 
                    name="guess_box" 
                    placeholder="Enter Guess..." 
                    onChange={updateGuessBox}
                    />

            <input type="button" id="submit_button" name="submit_button" value="submit" onClick={submitHandler}/>
        </div>
    )
}


export default GuessBox;