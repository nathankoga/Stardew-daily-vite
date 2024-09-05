// Admin file for many functionalities:
// determine daily stardew item?
// update database with items

import {useState} from 'react';

function AdminPostBox() {
    const [inputValues, setInputValues] = useState({
        firstBox: "",
        secondBox: "",
        thirdBox: "",
        fourthBox: "",
    });
    
    function updateBoxes(event: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

    const submitPost = () => {
        // make a POST request

        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        // create url and add parameters for API search 
        let getURL = new URL("https://pouq9pcpxk.execute-api.us-west-2.amazonaws.com/Dev-stage");

        // send a GET Request to the API  
        const requestOptions: RequestInfo = new Request(getURL, {
            method: "POST",
            headers: headers,
            redirect: 'follow',
            body: JSON.stringify({
                ID: inputValues.firstBox,
                profession: inputValues.secondBox,
                season: inputValues.thirdBox,
                sellPrice: inputValues.fourthBox
            })
        })
        fetch(requestOptions)
            .then( () => console.log("finished"))
            .catch(error => console.log("error: ", error));
    }

    return (
        <div className="adminBox">
            <input type="text" name="firstBox" placeholder="Item"  onChange={updateBoxes} />
            <input type="text" name="secondBox" placeholder="Profession"  onChange={updateBoxes} />
            <input type="text" name="thirdBox" placeholder="Season"  onChange={updateBoxes} />
            <input type="text" name="fourthBox" placeholder="sellPrice"  onChange={updateBoxes} />
            <input type="button" value="submit" onClick={submitPost}/>
        </div>
    )
}

export default AdminPostBox;