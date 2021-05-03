import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist'
const vuexPersist = new VuexPersist({
    key: '3d-score',
    storage: window.localStorage
  });
  

const state = {
    currentView: 'SETUP',    
    playerCount: 2,
    players: [],        
    currentRound: 0,    
    totalRounds: 18,
    rounds: []
}
const getters = {
    totalRounds: state => {
        return state.totalRounds;
    },
    playerCount: state => {
        return state.playerCount;
    },
    players: state => {
        return state.players;
    },
    currentRound: state => {
        return state.currentRound;
    },
    canReset: state => {
        return state.currentRound > 0 || state.players.length > 0 || state.rounds.length > 0
    },    
    currentRoundData: state => {
        return state.rounds.find((r) => r.round === state.currentRound)
    },
    currentView: state => state.currentView,
    rounds: state => state.rounds
}

const mutations = {
    currentView (state, view) {
        state.currentView = view;
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
    currentRound (state, round) {
        state.currentRound = round;
    },
    rounds (state, rounds) {
        state.rounds = rounds;
    },
    updatePlayerScores (state, scores) {        
        const players = JSON.parse(JSON.stringify(state.players)).map((p) => {
            p.score = scores[p.name] || 0;
            return p;
        });

        state.players = players;
    }   
}

const actions = {
    reset ({commit}) {
        return new Promise((resolve) => {
            commit('totalRounds', 18);
            commit('playerCount', 2);
            commit('players', []);
            commit('currentRound', 0);        
            commit('rounds', []);
            commit('currentView', 'SETUP');
            resolve(true);
        })        
    },
    backToSetup ({commit}) {
        commit('currentView', 'SETUP');
    },
    proceedToPlayerSetup ({commit}, {playerCount, rounds}) {
        commit('totalRounds', rounds);
        commit('playerCount', playerCount);

        var players = [];
        for(var i = 0; i < playerCount; i++) {
            players.push({
                name: `Player ${i+1}`,
                score: 0
            })
        }

        commit('players', players)
        commit('currentView', 'PLAYER_ENTRY');
    },
    proceedToFirstRound ({commit, state}, {names}) {
        const nameLength = (names||[]).length        
        var emptyPlayerScores = {};

        if (nameLength > 0) {           
            var players = JSON.parse(JSON.stringify(state.players)); 
            for(var i = 0; i < nameLength; i++) {
                var name = names[i];
                if (name) {
                    players[i].name = name;
                }
            }
            commit('players', players);      
            players.forEach((p) => emptyPlayerScores[p.name] = 0);     
        } else {
            state.players.forEach((p) => emptyPlayerScores[p.name] = 0);
        }
        
        commit('currentRound', 1);        
        commit('currentView', 'ROUND_ENTRY');
        
        var rounds = [];
       
        for (var roundIndex = 1; roundIndex < state.totalRounds; roundIndex++) {                        
            rounds.push({
                round: roundIndex,
                scores: JSON.parse(JSON.stringify(emptyPlayerScores))
            });
        }
        
        commit('rounds', rounds);
    },
    proceedToFinish({commit}) {
        commit('currentView', 'REVIEW');
    },
    previousRound ({commit, state}) {
        return new Promise((resolve) => {
            if (state.currentView === 'REVIEW') {
                commit('currentView', 'ROUND_ENTRY');
                commit('currentRound', state.totalRounds);
                resolve('currentRound');
            }  
            else if (state.currentRound > 1) {
                const destRd = state.currentRound - 1;
                const round = state.rounds.find((r) => r.round === destRd);
                commit('currentRound', destRd);
                
                resolve(round);
            } else {
                resolve(state.rounds.find((r) => r.round === state.currentRound));
            }            
        });
    },
    nextRound ({commit, state}) {
        return new Promise((resolve) => {
            if (state.currentRound < state.totalRounds) {
                const destRd = state.currentRound + 1;
                const round = state.rounds.find((r) => r.round === destRd);
                commit('currentRound', destRd);
                resolve(round);
            } else {
                resolve(state.rounds.find((r) => r.round === state.currentRound));
            }           
        })
    },
    setRoundScores ({commit, state}, round) {        
        return new Promise((resolve) => {
            var updated = false;
            var playerScores = {};
            var updatedRounds = JSON.parse(JSON.stringify(state.rounds)).map((r) => {
                if(r.round === round.round) {
                    r.scores = round.scores;
                    updated = true;
                }            
                Object.entries(r.scores).forEach((e) => {
                    const playerName = e[0];
                    const playerScore = e[1];
                    if(!playerScores[playerName]) {
                        playerScores[playerName] = playerScore;
                    } else {
                        playerScores[playerName] = playerScores[playerName] + playerScore;
                    }
                })

                return r;
            });
    
            if (!updated) {
                updatedRounds.push(round);
            }
            
            commit('rounds', updatedRounds);
            commit('updatePlayerScores', playerScores);
            resolve(true);
        });
        
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
