/* GuessBox handles API calls to the database when:
 *      1: Entering a guess item --> confirm which fields are correct, if the item exists
 *      2: Optionally enable autocomplete pop-up under text box
 */
// 
import {useState} from 'react';

/*
interface GuessEntity {
    id: string;
    profession: string;
    season: string;
    sellPrice: number;
}*/


function GuessBox() {

    // state variables for the text within the input box 
    const [guess, setGuess] = useState("");

    function updateGuessBox(event: React.ChangeEvent<HTMLInputElement>) {
        // when the textbox value is changed, update the guess variable to whatever is inside the textbox
        // call REST GET method to fetch from database
        setGuess(event.target.value);
        console.log("Current: ", guess)
    }

    const submitHandler = () => {
        // handler that looks for a submission ==> call API to search DB for desired item
        // call REST GET API to compare values of guess item and actual item
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        let getURL = new URL("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage");
        // add parameters to the url 
        getURL.searchParams.append('id', guess);

        const requestOptions: RequestInfo = new Request(getURL, {
            method: "GET",
            headers: headers,
            redirect: 'follow'
        })

        /*  POST request includes the body
        const requestOptions: RequestInfo = new Request("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage", {
            method: "GET",
            headers: headers,
            body: JSON.stringify({"ID":guess}),
            redirect: 'follow'
        })
        */

        fetch(requestOptions)
            .then(response => {
                console.log("got response: ", response)
            })
            .catch(error => console.log("error", error));
        
        // console.log("submission: {%s}", guess);

        // call REST POST API to store guess info
        console.log("submitHandler finished");

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