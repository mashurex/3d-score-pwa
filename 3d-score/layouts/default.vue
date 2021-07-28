<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      temporary
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />     
      <v-toolbar-title v-text="toolbarTitle" />
    </v-app-bar>
    <v-main>      
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      absolute
      app
    > 
      <span v-if="isScoringRound && currentLeader"><strong>Leader: </strong>{{currentLeader.name}} - {{currentLeader.totalScore}}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
export default {  
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  computed: {
    ...mapGetters(['lastRound', 'roundInProgress', 'rounds', 'currentLeader']),
    isScoringRound() {
      return this.$route.path.includes('round');
    },
    toolbarTitle() {
        const cur = this.$route;
        if (cur.path.includes('round')) {
            return `Scoring Round ${cur.params.round}`
        } else if(cur.path.includes('scorecard')) {
          return 'Scorecard';
        } else if(cur.path.includes('setup')) {
            return 'Setup';
        } else if(cur.path.includes('review')) {
            return 'Review';        
        } else {
            return '3D Score';
        }    
    },
    items() {
      const items = [
        {
          icon: 'mdi-chart-bubble',
          title: 'New Round',
          to: '/setup'
        },
      ];

      if (this.roundInProgress) {
        items.push({
          icon: 'mdi-apps',
          title: 'Scorecard',
          to: `/scorecard`
        });   

        const roundNumber = this.lastRound.roundNumber || 1;
        items.push({
          icon: 'mdi-pencil',
          title: 'Score Entry',
          to: `/round/${roundNumber}`
        });      
      }

      return items;
    }
  }
}
</script>
