<template>
  <div>
    <v-row>
      <v-col>
        <h1 class="text-center">3D Score</h1>
      </v-col>
    </v-row>  
    <v-row v-if="roundInProgress" justify="center" align="center">
      <v-col>      
        <nuxt-link :to="`/round/${lastRound.roundNumber || 1}`" class="v-btn v-btn--block v-btn--is-elevated v-btn--has-bg theme--light v-size--large primary">Resume</nuxt-link>        
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col>
        <nuxt-link to="/setup" class="v-btn v-btn--block v-btn--is-elevated v-btn--has-bg theme--light v-size--large success">Start New Round</nuxt-link>  
      </v-col>
    </v-row>
    <nuxt-link v-show="false" to="/round/1" />
    <nuxt-link v-show="false" to="/scorecard" />  
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Index',
  key(route) {
      return route.fullPath;
  },  
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
