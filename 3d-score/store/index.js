export const state = () => ({
    roundInProgress: false,
    lastRound: null,
    players: [],
    totalRounds: 18,
    rounds: [],
});

export const mutations = {
    startRound(state) {
        state.roundInProgress = true;
    },
    setPlayers(state, players) {
        state.players = JSON.parse(JSON.stringify(players||[]));
    },
    setRounds(state, rounds) {
        state.rounds = JSON.parse(JSON.stringify(rounds||[]));
        state.totalRounds = rounds.length;
    },
    setLastRound(state, roundId) {
        state.lastRound = roundId;
    },
    setPlayerScores(state, scores) {
        const players = JSON.parse(JSON.stringify(state.players)).map((player) => {
            const score = scores.find((s) => s.playerId === player.id);
            if (score) {
                player.scores[score.roundId].score = score.score;
                player.totalScore = Object.values(player.scores).reduce((prv, s) => {
                    return prv + s.score;
                }, 0);
            }
            return player;
        });

        state.players = players;
    },
    setRoundScores(state, roundScore) {
        const rounds = JSON.parse(JSON.stringify(state.rounds)).map((round) => {
            if (round.id === roundScore.roundId) {
                roundScore.scores.forEach((score) => {
                    round.scores[score.playerId] = score.score;
                });
            }
            return round;
        });

        state.rounds = rounds;
        state.lastRound = roundScore.roundId;
    },
    setToolbarTitle(state, title) {
        state.title = title;
    }
}

export const getters = {
    totalRounds(state) {
        return state.totalRounds;
    },
    rounds(state) {
        return state.rounds;
    },
    players(state) {
        return state.players;
    },
    roundInProgress(state) {
        return state.roundInProgress === true;
    },
    lastRound(state) {
        if (!state.lastRound) {
            return null;
        } else {
            return state.rounds.find((rd) => rd.id === state.lastRound);
        }
    },
    currentLeader(state) {
        return state.players.reduce((cur, p) => {
            if (p.totalScore > cur.totalScore) {
                return p;
            } else {
                return cur;
            }
        }, state.players[0])
    }
}


export const actions = {
    initializeNewRound({commit}, {totalRounds, players}) {
        const emptyPlayerScores = this.$utils.range(0, totalRounds).map((idx) => {
            return {
                roundId: `round_${idx}`,
                roundNumber: idx + 1,
                score: 0
            }
        }).reduce((map, rd) => {
            map[rd.roundId] = rd;
            return map;
        }, {});

        commit('setPlayers', players.map((p) => {
            p.scores = JSON.parse(JSON.stringify(emptyPlayerScores));            
            return p;
        }));        

        const emptyRoundScores = players.reduce((prv, p) => {
            prv[p.id] = 0;
            return prv;
        }, {});

        const rounds = this.$utils.range(0, totalRounds).map((i) => {
            return {
                id: `round_${i}`,
                roundNumber: i + 1,
                scores: JSON.parse(JSON.stringify(emptyRoundScores)),
            };
        });  
        commit('setRounds', rounds);
        commit('startRound');

        return Promise.resolve(rounds[0]);
    },
    storeRoundScores({commit}, req) {
        commit('setPlayerScores', req.scores);
        commit('setRoundScores', req)

        return Promise.resolve(true);
    },
    setCurrentRound({commit}, roundId) {
        commit('setLastRound', roundId);
    },
    setToolbarTitle({commit}, title) {
        commit('setToolbarTitle', title);
    }
}