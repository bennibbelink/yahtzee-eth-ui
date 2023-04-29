export interface State {
    player1: string
    player2: string
    rollsLeft: number
    dice: number[]
    selected: boolean[]
    turn: string
    player1_scores: number[]
    player2_scores: number[]
}

export interface GameOver {
    winner: string
    loser: string
    winning_score: number
    losing_score: number
}

