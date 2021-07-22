'use strict';
class Score {
    constructor(round, player, score) {
        this.round = round.id || round;
        this.player = player.id || player;
        this.score = score || 0;
    }

    greaterThan(other, orEquals = false) {
        let cmp = this.compareTo(other)
        if (orEquals) {
            return cmp >= 0
        } 
        return cmp > 0;
    }

    lessThan(other, orEquals = false) {
        let cmp = this.compareTo(other)
        if (orEquals) {
            return cmp <= 0;
        }

        return cmp < 0;
    }
    
    compareTo(other) {
        if (!other) {
            return 1;
        }
        
        if (this.score > other.score) {
            return 1;
        }

        if (this.score < other.score) {
            return -1
        }

        return 0;
    }

    static empty(round, player) {        
        return new Score(round, player, 0);
    }
}

export default Score;