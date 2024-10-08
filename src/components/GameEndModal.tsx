import './modal.css'

type GameEndProps = {
    turn: number;
    solution: string;
}


function GameEndModal({turn, solution}: GameEndProps) {

    return (
        <div className="gameEndModal">
            <div> 
                <h1>You Win!</h1>
                <p className="solution">{solution}</p>
                <p>You found the solution in {turn} guesses!</p>
            </div>
        </div>
    )
}

export default GameEndModal;