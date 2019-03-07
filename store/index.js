export const state = () => ({
    userInfo: null,
    headerConfig: {
        showHeader: true,
        showBack: true,
        showLine: true,
        title: ''
    },
    menuConfig: {
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
    appVersion: ''
})

export const mutations = {
    userInfo (state, data) {
        state.userInfo = data
    },
    appVersion (state, data) {
        state.appVersion = data
    }
}

export const actions = {}