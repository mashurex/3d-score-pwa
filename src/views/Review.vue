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
              v-for="(player, idx) in sortedPlayers"
              :key="player.name"
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
                    v-for="(stat, idx) in tensOrBetter"
                    :key="stat.key"
                  >
                    <v-col cols="8">
                      {{ idx + 1 }}. {{ stat.name }}
                    </v-col>
                    <v-col cols="4">
                      {{ stat.count }}
                    </v-col>
                  </v-row>                                                                                                                    
                </v-col>
              </v-row>
            </v-sheet>                        
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet
              color="red lighten-2"
              height="100%"
            >
              <v-row
                class="fill-height pl-2 pr-2 pt-2"
                justify="center"
              >
                <v-col>
                  <v-row><v-col><h1>Misses</h1></v-col></v-row>
                  <v-row
                    v-for="(stat, idx) in misses"
                    :key="stat.key"
                  >
                    <v-col cols="8">
                      {{ idx + 1 }}. {{ stat.name }}
                    </v-col>
                    <v-col cols="4">
                      {{ stat.count }}
                    </v-col>
                  </v-row>                                      
                </v-col>
              </v-row>   
            </v-sheet>                     
          </v-carousel-item>
        </v-carousel>                
      </v-col>
    </v-row>       
    <v-row>
      <v-col>
        <v-btn
          block
          @click="$store.dispatch('previousRound')"
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
    name: 'Overview',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['players', 'rounds']),
        sortedPlayers() {
            return JSON.parse(JSON.stringify((this.players||[]))).sort((a, b) => {
                if (b.score > a.score) {
                    return 1
                } else if(a.score > b.score) {
                    return -1;
                } else {
                    return 0;
                }
            });
        },
        playerNames() {
            return (this.players||[]).map((p) => p.name);
        },
        carouselHeight() {
            return (this.playerNames.length * 60) + 120;
        },
        tensOrBetter() {
            var stats = {};
            this.playerNames.forEach((name) => stats[name] = 0);            
            (this.rounds||[]).forEach((round) => {
                Object.entries(round.scores).forEach((entry) => {
                    const score = entry[1];
                    if (score >= 10) {
                        stats[entry[0]] = stats[entry[0]] + 1;
                    }
                })
            });

            return Object.keys(stats).map((key) => {
                return {
                    key: `${key}_10s`,
                    name: key,
                    count: stats[key]
                }
            });
        },
        misses() {
            var stats = {};
            this.playerNames.forEach((name) => stats[name] = 0);            
            (this.rounds||[]).forEach((round) => {
                Object.entries(round.scores).forEach((entry) => {
                    const score = entry[1];
                    if (score === 0) {
                        stats[entry[0]] = stats[entry[0]] + 1;
                    }
                })
            });

            return Object.keys(stats).map((key) => {
                return {
                    key: `${key}_zeroes`,
                    name: key,
                    count: stats[key]
                }
            });
        }
    },    
}
</script>