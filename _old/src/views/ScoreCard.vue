<template>
  <v-container>
    <v-row>
      <v-col>
        <v-simple-table
          fixed-header
          dense
          class="scorecard"
        >
          <template #default>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th
                  v-for="player in players"
                  :key="player.id"
                >
                  {{ player.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="round in roundScores"
                :key="round.id"
              >
                <td
                  role="rowheader"
                  class="font-weight-black"
                >
                  {{ round.round + 1 }}
                </td>
                <td
                  v-for="score in round.scores"
                  :key="score.key"
                  :class="{'font-weight-bold': score.isMax}"
                >
                  {{ score.score }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr :class="{'totals-row': true}">
                <td
                  role="rowheader"
                  class="font-weight-black"
                >
                  Total
                </td>
                <td
                  v-for="total in totals"
                  :key="`total_${total.id}`"
                  class="font-weight-bold"
                >
                  {{ total.total }}
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
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
    name: 'ScoreCard',
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
.scorecard {
    tfoot {
        background-color: #E0E0E0
    }
}
</style>