<template>
  <v-container>        
    <v-row
      v-for="(player, idx) in players"
      :key="player.id"
      align="center"
    >
      <v-col cols="12">
        <v-text-field
          :placeholder="`${player.name} Name`"
          :label="`Player ${idx + 1} Name`"
          :autofocus="idx === 0"
          @input="(event) => handleInput(player, event)"
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
import { Routes } from '@/constants';

export default {
    name: 'PlayerEntry',
    data() {
        return {            
        }
    },
    computed: {
       ...mapGetters(['players']),
       playerNames() {
         return (this.players||[]).reduce((prv, p) => {
              prv[p.id] = p.name
              return prv;
            }, {})          
       }
    },
    mounted() {
      this.$store.dispatch('resetEnabled', false);
      this.$store.dispatch('setToolbarTitle', 'Players');
    },       
    methods: {
        handleInput(player, event) {
            this.$store.dispatch('setPlayerName', {id: player.id, name: event})                        
        },
        goBack() {            
            this.$router.push({name: Routes.SETUP})
        },
        proceedToFirstRound() {                        
            this.$router.push({name: Routes.ROUND_ENTRY, params: { round: 1}})
        }        
    }
}
</script>