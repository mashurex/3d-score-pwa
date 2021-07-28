import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
    new VuexPersistence({
        key: '3d-score',
        storage: window.localStorage
    }).plugin(store);
}
