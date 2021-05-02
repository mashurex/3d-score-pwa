<template>
  <v-app>    
    <v-app-bar
      app
    >
      <v-toolbar-title><h1>{{ title }}</h1></v-toolbar-title>
    </v-app-bar>
    <v-main>
      <PlayerEntry v-if="currentView === 'PLAYER_ENTRY'" />
      <RoundEntry v-else-if="currentView === 'ROUND_ENTRY'" />
      <Review v-else-if="currentView === 'REVIEW'" />
      <Setup v-else />
    </v-main>
    <v-footer v-if="showReset">
      <v-row>
        <v-col>
          <v-btn
            block
            color="red darken-1"
            @click="reset()"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Setup from '@/views/Setup'
import PlayerEntry from '@/views/PlayerEntry'
import RoundEntry from '@/views/RoundEntry';
import Review from '@/views/Review';

import { mapGetters } from 'vuex'
export default {
  name: 'App',

  components: {    
    Setup,
    PlayerEntry,
    RoundEntry,
    Review
  },
   data: () => ({
    //
  }),
  computed: {
    ...mapGetters(['currentView', 'currentRound', 'totalRounds']),
    title() {
      switch(this.currentView) {
        case 'ROUND_ENTRY':
          return `Round ${this.currentRound} / ${this.totalRounds}`
        case 'REVIEW':
          return 'Final Scores';
        default:
          return '3D Score';
      }     
    },
    showReset() {
      return this.currentView === 'ROUND_ENTRY' || this.currentView === 'REVIEW'
    }
  },
  methods: {
    reset() {
      this.$store.dispatch('reset');
    }
  },
};
</script>
