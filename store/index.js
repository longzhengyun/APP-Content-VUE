import Vuex from 'vuex'

const state = {
    loginInfo: {
        state: false
    },
    headerConfig: {
        showHeader: true,
        showBack: true,
        showClose: false,
        showMineHeader: false,
        title: ''
    },
    menuConfig: {
        showMenu: false,
        currentIndex: 0,
        item: [
            {
                name: '首页',
                icon: '/img/common/icon_index.png',
                iconCurrent: '/img/common/icon_index_current.png',
                url: '/home'
            },
            {
                name: '推广赚钱',
                icon: '/img/common/icon_product.png',
                iconCurrent: '/img/common/icon_product_current.png',
                url: '/product'
            },
            {
                name: '我的',
                icon: '/img/common/icon_mine.png',
                iconCurrent: '/img/common/icon_mine_current.png',
                url: '/mine'
            }
        ]
    },
    appVersion: ''
}

const mutations = {
    loginInfo (state, data) {
        Object.assign(state.loginInfo, data)
    },
    headerConfig (state, data) {
        Object.assign(state.headerConfig, data)
    },
    menuConfig (state, data) {
        Object.assign(state.menuConfig, data)
    },
    appVersion (state, data) {
        state.appVersion = data
    }
}

const actions = {}

const createStore = () => {
    return new Vuex.Store({
        state,
        mutations,
        actions
    })
}

export default createStore
