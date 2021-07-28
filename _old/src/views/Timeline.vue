<template>
  <v-container>
    <v-row>
      <v-col>
        <v-timeline>
          <template v-for="timelineGroup in timelineGroups">
            <!-- <v-timeline-item :key="`grp_${timelineGroup.round}`">
              <template                
                #opposite
              >
                <span
                  :class="`headline font-weight-bold`"
                  v-text="`Round ${timelineGroup.round}`"
                />
              </template>
            </v-timeline-item> -->
            <v-timeline-item
              v-for="entry in timelineGroup.events"
              :key="entry.key"
              :color="entry.color"
              small
            >
              <v-row class="pt-1">
                <!-- <v-col cols="3">
                  <strong>Rd {{ entry.round }}</strong>
                </v-col> -->
                <v-col>
                  <strong>{{ entry.message }}</strong>
                  <div class="text-caption">
                    Rd {{ entry.round }}: {{ entry.player }}
                  </div>
                </v-col>
              </v-row>
            </v-timeline-item>
          </template>
        </v-timeline>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn            
          @click="() => $router.back()"
        >
          <v-icon>mdi-skip-backward</v-icon> Back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Timeline',
    data() {
        return {};
    },
    computed: {
        ...mapGetters(['players','playerScores', 'rounds']),
        totals() {
            return this.players.map((player) => {
                let score = this.playerScores[player.id] || 0;
                return {
                    id: player.id,
                    total: score
                };
            });
        },        
        timelineGroups() {
            return this.roundScores.map((round) => {
                let roundEmpty = !round.scores.find((s) => s.score > 0);
                let events = [];
                if (!roundEmpty) {                    
                    round.scores.forEach((score) => {
                        if (score.score === 0) {
                            events.push({
                                type: 'MISS',
                                round: round.round + 1,
                                player: score.player.name,
                                key: `${round.id}_miss_${score.player.id}`,
                                color: 'orange',
                                message: 'Blew it.'
                            });
                        } else if (score.score < 0) {
                            events.push({
                                type: 'PENALTY',
                                player: score.player.name,
                                round: round.round + 1,
                                key: `${round.id}_penalty_${score.player.id}`,
                                color: 'red',
                                message: 'Penalty!!'
                            });
                        } else if (score.score >= 10) {
                          events.push({
                                type: 'TENNER',
                                player: score.player.name,
                                round: round.round + 1,
                                key: `${round.id}_tenner_${score.player.id}`,
                                color: 'green',
                                message: 'Nailed it.'
                            });
                        }
                    });
                }
                return {
                    round: round.round + 1,
                    events
                };
            }).filter((round) => round.events.length > 0);
        },
        roundScores() {            
            let entries = this.rounds.map((round) => {                
                const maxScore = Object.values(round.scores).reduce((prv, cur) => {
                    if (cur.score > prv) {
                        return cur.score;
                    } else {
                        return prv;
                    }
                }, 0);

                const scores = this.players.map((player) => {
                    let playerRoundScore = round.scores[player.id];

                    return {
                        player,
                        score: playerRoundScore.score || 0,
                        key: `${round.id}_${player.id}`,
                        isMax: playerRoundScore.score >= maxScore                        
                    };
                });

                return {
                    id: round.id,
                    round: round.round,
                    scores,
                };
            });

            entries.sort((a, b) => {
                if (a.round < b.round) {
                    return -1;
                } else if(a.round > b.round) {
                    return 1;
                } else {
                    return 0;
                }
            });

            return entries;
        }
    }
}
</script>
<style lang="scss">
tfoot {
    background-color: #E0E0E0
}
</style>