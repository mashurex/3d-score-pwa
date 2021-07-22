<template>
  <v-app> 
    <v-navigation-drawer
      v-model="navDrawer"
      app      
      temporary
    >    
      <v-list nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <router-link
                :to="{name: 'scorecard'}"
                class="nav-link"
              >
                Scorecard
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>        
      </v-list>
     
      <template #append>
        <div
          v-if="resetEnabled"
          class="pa-2"
          style="margin-bottom: 120px;"
        >
          <v-btn
            block
            color="red darken-1"            
            @click="reset()"
          >
            Reset
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>   
    <v-app-bar
      app
      dense
    >
      <v-app-bar-nav-icon
        v-show="resetEnabled"
        @click="() => navDrawer = !navDrawer"
      />
      <v-toolbar-title><h1>{{ toolbarTitle }}</h1></v-toolbar-title>
    </v-app-bar>
    <v-main>
      <transition name="fade">        
        <router-view />        
      </transition>
    </v-main>   
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { Views, Dispatch, Routes } from '@/constants';

export default {
  name: 'TheContainer',

  components: {    

  },
   data: () => ({ 
     navDrawer: false,   
  }),
  computed: {
    ...mapGetters(['toolbarTitle', 'resetEnabled']),
    playerEntryView() {
      return Views.PLAYER_ENTRY;
    },
    roundEntryView() {
      return Views.ROUND_ENTRY;
    },
    reviewView() {
      return Views.REVIEW;
    }, 
  },
  methods: {
    isActive(name) {
      return this.$router.currentRoute.name === name;
    },
    reset() {
      this.$store.dispatch(Dispatch.RESET).then(() => {
        this.$router.push({name: Routes.SETUP})
      })
    }
  },
};
</script>
<style lang="scss">
.v-list--nav {
  .nav-link {
    text-decoration: none;
    font-size: 1.125rem;      
  }
}

.theme--light {
  .v-list--nav {
    .v-list-item {
      .active {
        background-color: #F0F0F0;
      }
    }

    .nav-link {      
      color: rgba(0,0,0,0.87);
    }
  }
}

</style>