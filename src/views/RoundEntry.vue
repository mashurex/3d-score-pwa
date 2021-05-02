<template>
  <v-container> 
    <v-row
      v-for="(player) in players"
      :key="`${player.name}_${currentRound}`"
    >            
      <v-col
        cols="8"
        offset="2"
      >
        <v-subheader>{{ `${player.name}` }} {{ totalScoreOf(player) }} [{{ scoreOf(player) }}]</v-subheader>
        <v-btn-toggle>
          <v-btn
            :disabled="scoreOf(player) === 12"
            @click="setScore(player, 12)"
          >
            12
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 10"
            @click="setScore(player, 10)"
          >
            10
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 8"
            @click="setScore(player, 8)"
          >
            8
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 5"
            @click="setScore(player, 5)"
          >
            5
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 0"
            @click="setScore(player, 0)"
          >
            0
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="8"
        offset="2"
      >              
        <div class="v-btn-group text-center">                    
          <v-btn
            :disabled="currentRound < 2"
            @click="previousRound"
          >
            <v-icon>mdi-skip-backward</v-icon> Back
          </v-btn>
          <v-btn
            :disabled="currentRound >= totalRounds"
            @click="nextRound"
          >
            Next <v-icon>mdi-skip-forward</v-icon>
          </v-btn>                    
        </div>                
      </v-col>
    </v-row>      
    <v-row>
      <v-col>
        <v-btn
          v-if="currentRound === totalRounds"
          class="mt-4"
          color="success"
          block
          @click="finish"
        >
          Finish
        </v-btn>
      </v-col>
    </v-row> 
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'RoundEntry',    
    data() {
        return {
            totalScoresEntered: 0,
            scores: {},
            scoreChanges: false,
        }
    },
    computed: {
        ...mapGetters(['playerCount', 'players', 'currentRound', 'totalRounds', 'currentRoundData']),
        allScoresEntered() {
            return this.totalScoresEntered === this.playerCount
        }
    },    
    watch: {
        currentRoundData(v) {
            this.resetInternal(v);
        },        
    },
    methods: {
        setScore(player, score) {            
            const newScore = parseInt(score, 10);
            if (this.scores[player.name]) {
                this.scores[player.name] = newScore;
            } else {
                this.$set(this.scores, player.name, newScore);
                this.totalScoresEntered = this.totalScoresEntered + 1;
            }
            this.scoreChanges = true;            
        },
        totalScoreOf(player) {            
            return player.score;
        },
        scoreOf(player) {
            const score =  this.scores[player.name]
            if (score || score === 0) {
                return score;
            } else {
                return '--';
            }
        },
        previousRound() {
            this.$store.dispatch("previousRound").then((r) => {
                this.resetInternal(r);
            })
        },
        nextRound() {
            if(this.scoreChanges) {
                this.$store.dispatch('setRoundScores', {
                    round: this.currentRound,
                    scores: this.scores
                }).then(() => {
                    this.$store.dispatch('nextRound').then((r) => {
                        this.resetInternal(r);
                    });
                })
            } else {
                this.$store.dispatch('nextRound').then((r) => {
                    this.resetInternal(r);
                });
            }            
        },
        finish() {
            this.$store.dispatch('setRoundScores', {
                round: this.currentRound,
                scores: this.scores
            }).then(() => {                
                this.$store.dispatch('proceedToFinish');
            });
        },
        resetInternal(incomingRound) {            
            this.totalScoresEntered = 0;
            this.scoreChanges = false;
            if (!incomingRound) {
                this.scores = {};
            } else {
                this.scores = JSON.parse(JSON.stringify(incomingRound.scores || {}));
            }
            
        }
    }
}
</script>
<style lang="scss">
.v-btn-group {
  border-radius: 4px;
  display: inline-flex;  
  width: 100%;
  justify-content: center;
  
  .v-btn {
    border-radius: 0;
    justify-content: center;
    margin: 0;
    min-width: auto;    
    padding: 0 12px;
    width: auto;
    
    &:not(:last-child) {
      border-radius: 0;
    }
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      margin-left: auto;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      margin-right: auto;
    }
  }
}
</style>