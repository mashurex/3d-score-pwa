<template>
  <v-form v-if="showSetup">
    <v-row align="center">
      <v-col cols="6">
        <v-subheader>Players</v-subheader>
      </v-col>
      <v-col cols="6">                
        <v-text-field
          v-model="playerCount"
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
          v-model="roundCount"
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
  </v-form>
  <v-form v-else>
    <v-row v-for="(player, idx) in players" :key="player.id">
      <v-col cols="12">
        <v-text-field
          v-model="player.name"
          :placeholder="`${player.name} Name`"
          :label="`Player ${idx + 1} Name`"
          :autofocus="idx === 0"
        />
      </v-col>      
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="() => showSetup = true">
          Back
        </v-btn>
        <v-btn @click="proceedToFirstRound">
          Next
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
export default {
  name: 'Setup',
  data() {
    return {
      showSetup: true,
      playerCount: 2,
      roundCount: 18,
      players: []
    }
  },
  methods: {
    proceedToFirstRound() {
      this.$store.dispatch('initializeNewRound', { totalRounds: this.roundCount, players: this.players }).then((res) => {
        this.$router.push({path: '/round/1'});
      });
    },
    proceedToPlayerSetup() {
      const playerCount = parseInt(this.playerCount, 10);

      if (this.players.length > 0 && this.players.length >= playerCount) {
        this.players = JSON.parse(JSON.stringify(this.players)).slice(0, playerCount);
      } else {
        const startIdx = this.players.length;
        const newPlayers = JSON.parse(JSON.stringify(this.players));    
        for(let i = startIdx; i < playerCount; i++) {
          newPlayers.push({
            id: `player_${i}`,
            name: `Player ${i+1}`,
            totalScore: 0
          });
        }

        this.players = newPlayers;
      }
     
      this.showSetup = false;
    },
    incrementPlayers() {
      this.playerCount = this.increment(this.playerCount);
    },
    decrementPlayers() {
      this.playerCount = this.decrement(this.playerCount);
    },
    incrementRounds() {
      this.roundCount = this.increment(this.roundCount);
    },
    decrementRounds() {
      this.roundCount = this.decrement(this.roundCount);
    },
    increment(value) {
      return parseInt(value, 10) + 1;
    },
    decrement(value) {
      const parsed = parseInt(value, 10);
      if (parsed > 1) {
        return parsed - 1;
      } else {
        return parsed;
      }
      
    }
  }
};

</script>
