'use strict';
import Score from './Score';

class Round {
    constructor(id, round, players = []) {
        this.id = id
        this.round = round

        if (!players || players.length === 0) {
            this.scores = {};        
        } else {
            this.scores = players.reduce((prv, p) => {
                prv[p.id] = Score.empty(id, p);
                return prv;
            }, {})
        }        
    }

    /**
     * 
     * @param {Score} score 
     */
    addScore(score) {
        this.scores[score.player] = new Score(this, score.player, score.score);        
    }

    setPlayerScore(player, score) {
        this.scores[player.id || player] = new Score(this, player, score)
    }
    
    getPlayerScore(player) {
        let playerId = player.id || player;
        return this.scores[playerId] || Score.empty(this.id, playerId);
    }

    static of(round) {        
        let newRound = new Round(round.id, round.round);
        Object.values(round.scores).forEach((score) => {
            newRound.setPlayerScore(score.player, score.score);
        });
        return newRound;
    }
}

export default Round;