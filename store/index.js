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
                name: '产品',
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
    productSelectData: [0, 0, 0]
})

export const mutations = {
    userInfo (state, data) {
        state.userInfo = data
    },
    productSelectData(state, data) {
        state.productSelectData = data
    }
}

export const actions = {}