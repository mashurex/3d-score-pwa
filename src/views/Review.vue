<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          outlined
          tile
        >
          <v-card-text>
            <v-row
              v-for="(player, idx) in stats"
              :key="player.id"
            >
              <v-col
                v-if="idx > 0"
                cols="8"
              >
                <div style="display: inline-flex;">
                  <div style="width: 30px;">
                    {{ idx + 1 }}.
                  </div> {{ player.name }}
                </div>
              </v-col>
              <v-col
                v-else
                cols="8"
              >
                <div style="display: inline-flex;">
                  <div style="width: 30px;">
                    <v-icon color="yellow">
                      mdi-trophy
                    </v-icon>
                  </div> {{ player.name }}
                </div>
              </v-col>
              <v-col cols="4">
                {{ player.score }} 
                <span
                  v-if="player.penalties > 0"
                  class="penalties-label red--text"
                >{{ `(-${player.penalties})` }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
        
    <v-row class="mt-8">            
      <v-col>
        <v-carousel
          :height="carouselHeight"
          :show-arrows="false"
        >
          <v-carousel-item>
            <v-sheet
              color="success"
              height="100%"
            >
              <v-row
                class="fill-height pl-2 pr-2 pt-2"
                justify="center"
              >
                <v-col>
                  <v-row><v-col><h1>10s or better</h1></v-col></v-row>
                  <v-row
                    v-for="(stat, idx) in sortedTens"
                    :key="`tens_${stat.id}`"
                  >
                    <v-col cols="8">
                      {{ idx + 1 }}. {{ stat.name }}
                    </v-col>
                    <v-col cols="4">
                      {{ stat.tens }}
                    </v-col>
                  </v-row>                                                                                                                    
                </v-col>
              </v-row>
            </v-sheet>                        
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet
              color="orange lighten-2"
              height="100%"
            >
              <v-row
                class="fill-height pl-2 pr-2 pt-2"
                justify="center"
              >
                <v-col>
                  <v-row><v-col><h1>Misses</h1></v-col></v-row>
                  <v-row
                    v-for="(stat, idx) in sortedMisses"
                    :key="`misses_${stat.id}`"
                  >
                    <v-col cols="8">
                      {{ idx + 1 }}. {{ stat.name }}
                    </v-col>
                    <v-col cols="4">
                      {{ stat.misses }}
                    </v-col>
                  </v-row>                                      
                </v-col>
              </v-row>   
            </v-sheet>                     
          </v-carousel-item>        
          <v-carousel-item v-if="penaltiesPresent">
            <v-sheet
              color="red lighten-2"
              height="100%"
            >
              <v-row
                class="fill-height pl-2 pr-2 pt-2"
                justify="center"
              >
                <v-col>
                  <v-row><v-col><h1>Penalties</h1></v-col></v-row>
                  <v-row
                    v-for="(stat, idx) in sortedPenalties"
                    :key="`penalties${stat.id}`"
                  >
                    <v-col cols="8">
                      {{ idx + 1 }}. {{ stat.name }}
                    </v-col>
                    <v-col cols="4">
                      {{ stat.penalties }}
                    </v-col>
                  </v-row>                                      
                </v-col>
              </v-row>   
            </v-sheet>                     
          </v-carousel-item>
        </v-carousel>               
      </v-col>
    </v-row>  
    <!-- <v-row      
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
    </v-row>      -->
    <v-row>
      <v-col>
        <v-btn
          block
          @click="back()"
        >
          <v-icon>mdi-skip-backward</v-icon> Back
        </v-btn>
      </v-col>
    </v-row>        
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { Routes } from '@/constants';

export default {
    name: 'Overview',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['players', 'rounds', 'playerScores', 'totalRounds']),
        stats() {
          let entries = (this.players||[]).map((p) => {
            return {
              id: p.id,
              name: p.name,
              score: this.playerScores[p.id],
              misses: 0,
              tens: 0,
              penalties: 0        
            }
          }).reduce((prv, e) => {
            prv[e.id] = e;
            return prv;
          }, {})

          this.rounds.forEach((round) => {
            Object.values(round.scores).forEach((score) => {
              if(score.score === 0) {
                entries[score.player].misses += 1;              
              } else if(score.score >= 10) {
                entries[score.player].tens += 1;
              } else if(score.score < 0) {
                entries[score.player].penalties += Math.abs(score.score);
              }
            })
          });

          // Sort players by score descending  
          let sorted = Object.values(entries);
          sorted.sort((a, b) => {
            if (a.score > b.score) {
              return -1
            } else if(b.score > a.score) {
              return 1;
            } else if(a.tens > b.tens) {
              return -1;
            } else if(b.tens > a.tens) {
              return 1;
            } else if (a.penalties < b.penalties) {
              return -1
            } else if (a.penalties > b.penalties) {
              return 1;
            } else {
              return 0;
            }
          });

          return sorted;
        },
        playerNames() {
            return this.stats.map((p) => p.name);
        },
        // Calculate carousel height based on the number of players.
        carouselHeight() {
            return (this.playerNames.length * 60) + 120;
        },       
        penaltiesPresent() {
          return !!this.stats.find((s) => s.penalties > 0)
        },
        sortedMisses() {
          let entries = JSON.parse(JSON.stringify(this.stats));
          entries.sort((a, b) => {
            if(a.misses > b.misses) {
              return -1;
            } else if (a.misses < b.misses) {
              return 1;
            } else if(a.score > b.score) {
              return 1;
            } else if (a.score < b.score) {
              return -1;
            }
            return 0;
          });
          return entries;
        },
        sortedTens() {
          let entries = JSON.parse(JSON.stringify(this.stats));
          entries.sort((a, b) => {
            if(a.tens > b.tens) {
              return -1;
            } else if (a.tens < b.tens) {
              return 1;
            } else if(a.score > b.score) {
              return -1;
            } else if (a.score < b.score) {
              return 1;
            }
            return 0;
          });
          return entries;
        },
        sortedPenalties() {         
          if (!this.penaltiesPresent) {
            return this.stats;
          } 

          let entries = JSON.parse(JSON.stringify(this.stats));
          entries.sort((a, b) => {
            if(a.penalties > b.penalties) {
              return 1;
            } else if (a.penalties < b.penalties) {
              return 1;
            } else if(a.score > b.score) {
              return 1;
            } else if (a.score < b.score) {
              return -1;
            }
            return 0;
          });
          return entries;
        }            
    },
    mounted() {
      // this.$store.dispatch('setToolbarTitle', 'Review');
    },    
    methods: {
      back() {
        this.$router.push({name: Routes.ROUND_ENTRY, params: { round: this.totalRounds}})
      }      
    }
}
</script>
<style lang="scss">
.penalties-label {
  font-weight: bold;
}
</style>