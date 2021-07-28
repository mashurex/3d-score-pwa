import Vue from 'vue';
import VueRouter from 'vue-router';
import TheContainer from '@/containers/TheContainer';
import SetupView from '@/views/Setup';
const PlayerEntryView = () => import('@/views/PlayerEntry');
const ReviewView = () => import('@/views/Review');
const RoundEntryView = () => import('@/views/RoundEntry');
const ScoreCardView = () => import('@/views/ScoreCard');
const TimelineView = () => import('@/views/Timeline');

import store from '@/store';
import { Routes } from '@/constants.js';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: Routes.HOME,
        component: TheContainer,
        children: [
            {
                path: '/setup',
                name: Routes.SETUP,       
                component: SetupView,
                meta: {
                    title: '3D Score',                    
                }         
            },
            {
                path: '/players',
                name: Routes.PLAYER_ENTRY,       
                component: PlayerEntryView,
                meta: {
                    title: '3D Score',                    
                }                  
            },
            {
                path: '/round/:round',
                name: Routes.ROUND_ENTRY,       
                component: RoundEntryView,
                props: true,                               
            },
            {
                path: '/review',
                name: Routes.REVIEW,       
                component: ReviewView,
                meta: {
                    title: 'Review',                    
                }                  
            },
            {
                path: '/scorecard',
                name: Routes.SCORECARD,       
                component: ScoreCardView,
                meta: {
                    title: 'Scorecard',                    
                }                  
            },
            {
                path: '/timeline',
                name: Routes.TIMELINE,       
                component: TimelineView,
                meta: {
                    title: 'Timeline',                    
                }                  
            }
        ]
    }
];

const router = new VueRouter({
    mode: 'hash',
    routes: routes,
    scrollBehavior () {
        return { x: 0, y: 0 }
    }      
});

router.beforeEach((to, from, next) => {
    if (!store.getters.roundStarted &&
        (to.name !== Routes.SETUP && to.name !== Routes.PLAYER_ENTRY)         
    ) {
        next({name: Routes.SETUP});
    } else {
        if(to.meta) {
            if (to.meta.title) {
                store.dispatch('setToolbarTitle', to.meta.title);
            }
        }        
        next();
    } 
});

export default router;