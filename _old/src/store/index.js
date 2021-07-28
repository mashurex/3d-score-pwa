import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist'
import Round from '@/classes/Round';
import Score from '@/classes/Score';

// Enable Vuex state persistence directly to localStorage.
const vuexPersist = new VuexPersist({
    key: '3d-score',
    storage: window.localStorage
  });
  

const state = {    
    // Total number of players in the match.
    playerCount: 2,
    // Array of active players.
    players: [],
    // The total number of rounds in the match.
    totalRounds: 18,
    // Array of rounds.
    rounds: [],
    toolbarTitle: '3D Score',
    resetEnabled: false
}

const getters = {
    resetEnabled: state => state.resetEnabled === true,
    totalRounds: state => {
        return state.totalRounds;
    },
    playerCount: state => {
        return state.playerCount;
    },
    players: state => {
        return state.players;
    },
    /**
     * 
     * @param {*} state 
     * @returns {Boolean} Returns `true` if the reset button should be shown.
     */
    canReset: state => {
        return state.players.length > 0 || state.rounds.length > 0
    },    
    rounds: state => state.rounds,   
    roundStarted: state => {
        return state.players.length > 0 && state.rounds.length > 0
    },
    playerScores: state => {
        let scores = {};
        state.players.forEach((p) => {
            scores[p.id] = 0
        });

        state.rounds.forEach((round) => {
            Object.values(round.scores).forEach((score) => {
                let prv = scores[score.player] || 0;
                scores[score.player] = prv + score.score;
            })
        });

        return scores;
    },
    toolbarTitle: state => state.toolbarTitle
}

const mutations = {    
    resetEnabled(state, resetEnabled) {
        state.resetEnabled = (resetEnabled === true);
    },
    toolbarTitle(state, toolbarTitle) {
        state.toolbarTitle = toolbarTitle
    },
    totalRounds (state, rounds) {
        state.totalRounds = rounds;
    },
    playerCount (state, players) {
        state.playerCount = players;
    },   
    players (state, players) {
        state.players = players;
    },    
    rounds (state, rounds) {
        state.rounds = rounds.map((r) => Round.of(r));
    },
    playerName(state, player) {
        let players = JSON.parse(JSON.stringify(state.players)).map((p) => {
            if (p.id === player.id) {
                p.name = player.name;
            }
            return p;
        })
        state.players = players;
    },
    playerScore(state, score) {
        let rounds = JSON.parse(JSON.stringify(state.rounds)).map((r) => {
            let round = Round.of(r);
            if (round.id === score.round) {
                round.addScore(score);
            }

            return round;
        });
        state.rounds = rounds;        
    }   
}

const actions = {
    // Reset all Vuex/localStorage data.
    reset ({commit}) {
        return new Promise((resolve) => {
            commit('totalRounds', 18);
            commit('playerCount', 2);
            commit('players', []);                  
            commit('rounds', []);
            commit('resetEnabled', false);
            commit('toolbarTitle', '3D Score');     
            resolve(true);
        })        
    },
    roundSetup({commit}, {playerCount, rounds}) {
        commit('totalRounds', rounds);
        commit('playerCount', playerCount);

        var players = [];
        for(var i = 0; i < playerCount; i++) {
            players.push({
                id: `Player${i}`,
                name: `Player ${i+1}`,
                totalScore: 0
            })
        }

        let roundEntries = [];
        for (var j = 0; j < rounds; j++) {               
            roundEntries.push(new Round(`Round${j}`, j, players));
        }

        commit('players', players);
        commit('rounds', roundEntries);
        
        return Promise.resolve(players);
    },
    setPlayerName({commit}, player) {
        commit('playerName', player);
        return Promise.resolve(true);
    },
    setPlayerScore({commit}, score) {
        commit('playerScore', score);
        return Promise.resolve(true);
    },
    setToolbarTitle({commit}, toolbarTitle) {
        commit('toolbarTitle', toolbarTitle);
        return Promise.resolve(true);
    },
    resetEnabled({commit}, enabled) {
        commit('resetEnabled', enabled);
        return Promise.resolve(true);
    }
}

Vue.use(Vuex);
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: true,
  plugins: [
      vuexPersist.plugin
  ]
});
