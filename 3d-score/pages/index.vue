<template>
<div>
  <v-row>
    <v-col>
      <h1 class="text-center">3D Score</h1>
    </v-col>
  </v-row>  
  <v-row v-if="roundInProgress" justify="center" align="center">
    <v-col>
      <v-btn block large color="primary" @click="goResume">Resume</v-btn>      
    </v-col>
  </v-row>
  <v-row justify="center" align="center">
    <v-col>
      <v-btn block large color="success" @click="goSetup">Start New Round</v-btn>      
    </v-col>
  </v-row>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Index',
  data() {
    return {

    }
  },
  head() {
    return {
      title: '3D Score'
    }
  },
  computed: {
    ...mapGetters(['lastRound', 'roundInProgress', 'rounds']),
  },
  methods: {
    goResume() {
      this.$router.push({path: `/round/${this.lastRound.roundNumber || 1}`})
    },
    goSetup() {
      this.$router.push({path: '/setup'})
    }
  }
}
</script>
