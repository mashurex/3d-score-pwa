<template>
  <v-container>        
    <v-row
      v-for="(player, idx) in players"
      :key="idx"
      align="center"
    >
      <v-col cols="12">
        <v-text-field
          :placeholder="player.name"
          :label="`Player ${idx + 1}`"
          @input="(event) => handleInput(idx, event)"
        />
      </v-col>            
    </v-row>        
    <v-row>
      <v-col cols="12">
        <v-btn @click="goBack">
          Back
        </v-btn>
        <v-btn @click="proceedToFirstRound">
          Next
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'PlayerEntry',
    data() {
        return {
            playerNames: (this.players || []).map((p) => p.name)
        }
    },
    computed: {
       ...mapGetters(['players']),

    },    
    watch: {
        players(v) {
            this.playerNames = (v||[]).map((p) => p.name)
        }
    },
    methods: {
        handleInput(index, event) {            
            this.playerNames[index] = event;
        },
        goBack() {
            this.$store.dispatch('backToSetup');
        },
        proceedToFirstRound() {            
            this.$store.dispatch('proceedToFirstRound', { names: this.playerNames })
        }        
    }
}
</script>