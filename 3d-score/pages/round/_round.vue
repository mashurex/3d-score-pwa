<template>
<div>
    <h1 class="text-center">Round: {{round}} / {{ totalRounds }}</h1>
    <v-row v-for="score in scores" :key="score.key">
        <v-col cols="10" offset="1">
            <div style="display: inline-flex; width: 100%; height: 48px; align-items: center; padding: 0 16px;">
                <span style="margin-left: 0;">{{ score.player.name}}</span>
                <span style="margin-left: auto; margin-right: 0;">{{ score.prvTotalScore + score.score }} [{{ score.score }}]</span> 
            </div>
               <v-row align="center" justify="center">
                <v-col align="center" justify="center">
                    <v-btn-toggle>
                        <v-btn v-for="value in scoreValues" :key="`${score.key}_score_${value}`" :disabled="score.score === value" @click="() => {
                            score.score = value;
                            scoresHaveChanged = true;
                        }">{{value}}</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>            
        </v-col>
    </v-row>
    <v-row >
        <v-col align="center" justify="center">
            <v-btn :disabled="!previousRoundNumber" block @click="goPrevious">
                <v-icon>mdi-skip-backward</v-icon> Back
            </v-btn>
        </v-col>
        <v-col align="center" justify="center">            
            <v-btn :disabled="!nextRoundNumber" block @click="goNext">
                Next <v-icon>mdi-skip-forward</v-icon>
            </v-btn>
        </v-col>
    </v-row>
    <v-row v-if="!nextRoundNumber">
        <v-col align="center" justify="center">
            <v-btn block color="success" @click="proceedToScorecard">
                Scorecard
            </v-btn>
        </v-col>
    </v-row>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Round',
    key(route) {
        return route.fullPath;
    },    
    asyncData({ params }) {
        return { round: parseInt(params.round, 10) }
    },
    data() {
        return {
            scoresHaveChanged: false,
            scores: [],
            scoreValues: Object.freeze([12, 10, 8, 5, 0])
        }
    },   
    computed: {
        ...mapGetters(['totalRounds', 'players', 'rounds']),
        previousRoundNumber() {
            return this.round > 1 ? this.round - 1 : false
        },
        nextRoundNumber() {
            return this.round < this.totalRounds ? this.round + 1 : false
        },
        currentRoundId() {
            return `round_${this.round > 0 ? this.round - 1 : 0}`;
        },
        currentRound() {
            return this.rounds.find((rd) => rd.id === this.currentRoundId);            
        }
    },
     mounted() {
        const rd = this.currentRound
        if (rd) {
            this.$store.dispatch('setCurrentRound', rd.id);
        }
        
        this.scores = this.players.map((player) => {                
            const roundScore = rd.scores[player.id] || 0;
            return {
                key: `score_${rd.id}_${player.id}`,
                player,
                score: roundScore,
                prvTotalScore: this.computeTotal(this.currentRound, player),
                totalScore: player.totalScore
            };
        });
    },
    methods: {
        computeTotal(round, player) {
            const maxRoundNumber = round.roundNumber;
            return Object.values(player.scores).reduce((prv, rd) => {
                if (rd.roundNumber < maxRoundNumber) {
                    return prv + rd.score;
                } else {
                    return prv;
                }
            }, 0)
        },
        setRoundScores() {           
            if (this.scoresHaveChanged) { 
                return this.$store.dispatch('storeRoundScores', {
                    roundId: this.currentRoundId,
                    scores: this.scores.map((score) => {
                        return { 
                            roundId: this.currentRoundId,
                            playerId: score.player.id,
                            score: score.score,
                        }
                    })
                });
            } else {
                return Promise.resolve(true);
            }
        },
        goPrevious() {
            this.setRoundScores().then(() => {
                this.$router.push({
                    path: `/round/${this.previousRoundNumber}`
                })
            });
        },
        goNext() {
            this.setRoundScores().then(() => {
                this.$router.push({
                    path: `/round/${this.nextRoundNumber}`
                })
            });
        },
        proceedToScorecard() {
            this.setRoundScores().then(() => {
                this.$router.push({
                    path: '/scorecard'
                });
            });
        }
    },
}
</script>