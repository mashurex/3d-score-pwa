<template>
  <v-container fluid> 
    <v-row
      v-for="(player) in players"
      :key="`${player.id}_${currentRoundId}`"
    >            
      <v-col
        cols="10"
        offset="1"
      >
        <v-subheader>{{ `${player.name}` }} {{ totalScoreOf(currentRound, player) }} [{{ scoreOf(player) }}]</v-subheader>
        <v-btn-toggle>
          <v-btn
            :disabled="scoreOf(player) === 12"
            @click="setScore(currentRound, player, 12)"
          >
            12
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 10"
            @click="setScore(currentRound, player, 10)"
          >
            10
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 8"
            @click="setScore(currentRound, player, 8)"
          >
            8
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 5"
            @click="setScore(currentRound, player, 5)"
          >
            5
          </v-btn>
          <v-btn
            :disabled="scoreOf(player) === 0"
            @click="setScore(currentRound, player, 0)"
          >
            0
          </v-btn>
          <v-btn @click="showCustom(player)">
            {{ customScoreLabel(player) }}
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
            :disabled="currentRoundNumber < 2"
            @click="previousRound"
          >
            <v-icon>mdi-skip-backward</v-icon> Back
          </v-btn>
          <v-btn
            :disabled="currentRoundNumber >= totalRounds"
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
          v-if="currentRoundNumber >= totalRounds"
          class="mt-4"
          color="success"
          block
          @click="proceedToFinish"
        >
          Finish
        </v-btn>
      </v-col>
    </v-row> 
    <!-- <v-row
      v-if="showScorecard"
      class="pt-2 mb-4"
    >
      <v-col>
        <v-btn
          block                   
          @click="() => $router.push({name: 'scorecard'})"
        >
          Scorecard
        </v-btn>
      </v-col>
    </v-row> -->
    <v-dialog v-model="showCustomEntry">
      <v-card>
        <v-card-title>{{ customPlayer ? customPlayer.name : '' }}</v-card-title>
        <v-form>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="customScore"
                  type="number"
                  label="Custom Score"
                />
              </v-col>
            </v-row> 
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            @click="cancelCustomScore()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!customScore"
            @click="setCustomScoreOf(currentRound, customPlayer, customScore)"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import Score from '@/classes/Score';
import Round from '@/classes/Round';
import { Routes } from '@/constants';

export default {
  name: 'RoundEntry',    
  props: {
    round: {
      type: [Number, String],
      required: true,
      default: 1
    }
  },
  data() {
      let roundNumber = 1;
      if (this.round) {
        roundNumber = parseInt(`${this.round}`);
        if (isNaN(roundNumber)) {
          roundNumber = 1;
        }
      }

      return {          
          showCustomEntry: false,
          customPlayer: null,
          customScore: null,
          roundNumber
      }
  },
  computed: {
      ...mapGetters(['playerCount', 'players', 'rounds', 'totalRounds', 'playerScores']),  
      showScorecard() {
        return this.currentRoundNumber > 1;
      },      
      currentRoundId() {
        let currentRound = this.currentRound;
        if (!currentRound) {
          return null;
        }
        return currentRound.id;
      },
      currentRoundNumber() {
        let currentRound = this.currentRound;
        if (!currentRound) {
          return 0;
        }
        return currentRound.round + 1;
      },        
      currentRound() {
        let roundIDX = this.roundNumber > 0 ? this.roundNumber - 1 : 0;
        let roundID = `Round${roundIDX}`
        let round = this.rounds.find((rd) => rd.id === roundID);
        if (round) {
          return Round.of(round);
        } else {
          return null;
        }
      },
      roundScores() {
        if (!this.currentRound) {
          return {};
        }

        let scores = {}
        this.players.forEach((p) => {          
          scores[p.id] = this.currentRound.getPlayerScore(p);
        });

        return scores;
      }
  },    
  watch: {
    round(v) {
      let roundNumber = 1;
      if (v) {
        roundNumber = parseInt(`${v}`);
        if (isNaN(roundNumber)) {
          roundNumber = 1;
        }
      }

      this.roundNumber = roundNumber;
      this.$store.dispatch('setToolbarTitle', `Round ${roundNumber} / ${this.totalRounds}`)
    }    
  },
  mounted() {      
    let roundNumber = 1;
      if (this.round) {
        roundNumber = parseInt(`${this.round}`);
        if (isNaN(roundNumber)) {
          roundNumber = 1;
        }
      }
    this.$store.dispatch('setToolbarTitle', `Round ${roundNumber} / ${this.totalRounds}`)
    this.$store.dispatch('resetEnabled', true);
  },
  methods: {
    customScoreLabel(player) {
      let score = this.scoreOf(player)
      if (!score || score === '--' || score === 0) {
        return '...'
      } else {
        switch(score) {          
          case 0:
          case 5:
          case 8:
          case 10:
          case 12:
            return '...'
          default:
            return `[${score}]`;
        }        
      }
    },
    showCustom(player) {
      let  score = this.scoreOf(player)
      if (!score || score === '--' || score === 0) {
        score = null
      }

      this.customPlayer = player.id || player,
      this.customScore = score;
      this.showCustomEntry = true;

    },
    setCustomScoreOf(round, customPlayer, customScore) {
      this.setScore(round, customPlayer, customScore);
      this.showCustomEntry = false;
      this.customPlayer = null;
      this.customScore = null;
    },
    cancelCustomScore() {
      this.customPlayer = null;
      this.customScore = null;
      this.showCustomEntry = false;
    },
    setScore(round, player, score) {            
      if (!round) {
        return;
      }
      
      const parsedScore = parseInt(score, 10);
      let newScore = new Score(round, player, parsedScore)
      this.$store.dispatch('setPlayerScore', newScore);       
    },
    totalScoreOf(round, player) {            
        return this.playerScores[player.id || player] || 0;
    },
    scoreOf(player) {
        const score =  this.roundScores[player.id || player];
        if (score && (score.score || score.score === 0)) {
            return score.score;
        } else {
            return '--';
        }
    },
    previousRound() {
      this.$router.push({name: Routes.ROUND_ENTRY, params: { round: this.currentRoundNumber - 1}});
      /*
        this.$store.dispatch("previousRound").then((r) => {
            this.resetInternal(r);                
        })            
        */
    },
    nextRound() {
      this.$router.push({name: Routes.ROUND_ENTRY, params: { round: this.currentRoundNumber + 1}});
      /*
        if(this.scoreChanges) {
            this.$store.dispatch('setRoundScores', {
                round: this.currentRound,
                scores: this.scores
            }).then(() => {
                this.$store.dispatch('nextRound').then((r) => {
                    // this.resetInternal(r);
                    this.$route.push({name: Routes.ROUND_ENTRY})

                });
            })
        } else {
            this.$store.dispatch('nextRound').then((r) => {
                this.resetInternal(r);
            });
        }    
        */        
    },
    proceedToFinish() {
      this.$router.push({name: Routes.REVIEW});
      /*
        this.$store.dispatch('setRoundScores', {
            round: this.currentRound,
            scores: this.scores
        }).then(() => {                
            this.$store.dispatch('proceedToFinish');
        });
        */
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
