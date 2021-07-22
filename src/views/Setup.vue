<template>
  <v-container>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>Players</v-subheader>
      </v-col>
      <v-col cols="6">                
        <v-text-field
          v-model="players"
          type="number"
          append-outer-icon="mdi-plus"
          prepend-icon="mdi-minus"
          @click:append-outer="incrementPlayers"
          @click:prepend="decrementPlayers"
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>Rounds</v-subheader>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="rounds"
          type="number"
          append-outer-icon="mdi-plus"
          prepend-icon="mdi-minus"
          @click:append-outer="incrementRounds"
          @click:prepend="decrementRounds"
        />
      </v-col>
    </v-row>        
    <v-row>
      <v-col cols="12">
        <v-btn @click="proceedToPlayerSetup">
          Next
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { Dispatch, Routes } from '@/constants';
export default {
    name: 'Setup',
    data() {
        return {
            players: 2,
            rounds: 18
        }
    },
    computed: {
       
    },
    mounted() {
      this.$store.dispatch('resetEnabled', false);
      this.$store.dispatch('setToolbarTitle', '3D Score');
    },       
    methods: {
        proceedToPlayerSetup() {            
            this.$store.dispatch(Dispatch.ROUND_SETUP,{playerCount: this.players, rounds: this.rounds}).then(() => {
              this.$router.push({name: Routes.PLAYER_ENTRY })
            })            
        },
        incrementPlayers() {
            this.players = this.increment(this.players);
        },
        decrementPlayers() {
            this.players = this.decrement(this.players);
        },
        incrementRounds() {
            this.rounds = this.increment(this.rounds);
        },
        decrementRounds() {
            this.rounds = this.decrement(this.rounds);
        },
        increment(value) {
            return parseInt(value, 10) + 1;
        },
        decrement(value) {
            return parseInt(value, 10) - 1;
        }
    }
}
</script>