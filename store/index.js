export const state = () => ({
    userInfo: null,
    headerConfig: {
        showHeader: true,
        showBack: true,
        showSet: false,
        title: ''
    },
    menuConfig: {
        showMenu: false,
        currentIndex: 0,
        item: [{
                name: '首页',
                icon: '/img/common/icon_index.png',
                iconCurrent: '/img/common/icon_index_current.png',
                url: '/home'
            },
            {
                name: '列表',
                icon: '/img/common/icon_list.png',
                iconCurrent: '/img/common/icon_list_current.png',
                url: '/list'
            },
            {
                name: '我的',
                icon: '/img/common/icon_mine.png',
                iconCurrent: '/img/common/icon_mine_current.png',
                url: '/mine'
            }
        ]
    },
    appVersion: '',
    mobileBook: []
})

export const mutations = {
    userInfo (state, data) {
        state.userInfo = data
    },
    headerConfig (state, data) {
        Object.assign(state.headerConfig, data)
    },
    menuConfig (state, data) {
        Object.assign(state.menuConfig, data)
    },
    appVersion (state, data) {
        state.appVersion = data
    },
    mobileBook (state, data) {
        state.mobileBook = data
    }
}

export const actions = {}