<template>
    <div>
        <v-row>
            <v-col>
                <v-simple-table fixed-header dense class="scorecard">
                    <template #default>
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th v-for="player in players" :key="`header_${player.id}`">{{player.name}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="round in roundScores" :key="round.id">
                                <td role="rowheader" class="font-weight-black">{{ round.roundNumber }}</td>
                                <td v-for="score in round.scores" :key="score.id" :class="{'font-weight-bold': score.isMax}">{{score.score}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr :class="{'totals-row': true}">
                                <td role="rowheader" class="font-weight-black">Total</td>
                                <td v-for="total in totals" :key="total.id" class="font-weight-bold">{{ total.total }}</td>
                            </tr>
                        </tfoot>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'ScoreCard',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['players', 'rounds']),
        playersMap() {
            return this.players.reduce((map, player) => {
                map[player.id] = player.name;
                return map;
            }, {});
        },
        totals() {
            return this.players.map((player) => {
                return {
                    id: `total_${player.id}`,
                    total: player.totalScore
                };
            });
        },
        roundScores() {            
            const rounds = JSON.parse(JSON.stringify(this.rounds)).map((round) => {
                const maxScore = Object.values(round.scores).reduce((prv, cur) => {
                    if (cur > prv) {
                        return cur;
                    } else {
                        return prv;
                    }
                }, 0);

                const scores = Object.keys(round.scores).map((playerId) => {
                    const score = round.scores[playerId];
                    const name = this.playersMap[playerId];
                    return {
                        id: `${round.id}_${playerId}`,
                        playerId,
                        name,
                        score,
                        isMax: score >= maxScore
                    }
                });
                round.scores = scores;
                return round;                
            });

            rounds.sort((a, b) => {
                if (a.roundNumber > b.roundNumber) {
                    return 1;
                } else if(a.roundNumber < b.roundNumber) {
                    return -1;
                } else {
                    return 0;
                }
            });
            return rounds;
        },
        playerScores() {
            return this.players.map((player) => {
                const scores = JSON.parse(JSON.stringify(player.scores));
                scores.sort((a, b) => {
                     if (a.roundNumber > b.roundNumber) {
                        return 1;
                    } else if(a.roundNumber < b.roundNumber) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                return {
                    id: player.id,
                    name: player.name,
                    scores
                }
            });
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