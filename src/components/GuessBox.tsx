/* GuessBox handles API calls to the database when:
 *      1: Entering a guess item --> confirm which fields are correct, if the item exists
 *      2: Optionally enable autocomplete pop-up under text box
 */
// 
import {useState} from 'react';

/*
interface GuessEntity {
    ID: string;
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
        
        // create header for GET request
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        // create url and add parameters for API search 
        let getURL = new URL("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage");
        getURL.searchParams.append('ID', guess);

        // send a Request to the API  
        // NOTE: In the future, selecting "use lambda proxy integration" makes event handling easier
        //       (No?) more need to set up method and integration request formats and mappings by hand
        const requestOptions: RequestInfo = new Request(getURL, {
            method: "GET",
            headers: headers,
            redirect: 'follow'
        })
        console.log("sending request:", getURL.toString())
        /*  For POST requests, include the body
        const requestOptions: RequestInfo = new Request("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage", {
            method: "GET",
            headers: headers,
            body: JSON.stringify({"ID":guess}),
            redirect: 'follow'
        })
        */

        fetch(requestOptions)
            .then(response => response.text())
            .then(result => {
                alert(JSON.parse(result).body);
                
            })
            .catch(error => console.log('error', error));


            // .then(response => {

            //     let getResponse : ReadableStream = response.json();
            //     console.log("response.json ==>", getResponse);
            //     // figure out promise --> probably refactor code with this website (https://medium.com/@diegogauna.developer/restful-api-using-typescript-and-react-hooks-3d99bdd0cd39)
            //     // or this website (https://kentcdodds.com/blog/using-fetch-with-type-script)
            //     let item = getResponse['Item'];
            //     // console.log("fetching body: ", getResponse['body']);
            //     // console.log("got response: ", response)
            //     // console.log("body:", response.json())
            //     alert()
                
            // })
            // .catch(error => console.log("error", error));
        
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