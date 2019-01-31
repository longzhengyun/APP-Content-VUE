const setHeaderConfigAction = (name) => {
    let config = {}

    // index
    if (name === 'index') {
        config = {
            showBack: false
        }
    }

    // home
    if (name === 'home') {
        config = {
            showBack: false,
            title: '首页'
        }
    }

    // list
    if (name === 'list') {
        config = {
            showBack: false,
            title: '列表'
        }
    }

    // mine
    if (name === 'mine') {
        config = {
            showBack: false,
            showSet: true,
            title: '我的'
        }
    }

    // mine/set
    if (name === 'mine-set') {
        config = {
            title: '设置'
        }
    }

    // hack 活动页隐藏header
    if (name && name.indexOf('activities') === 0) {
        config = {
            showHeader: false,
            title: ''
        }
    }

    return config
}

const setMenuConfigAction = (name) => {
    let config = {}

    // home
    if (name === 'home') {
        config = {
            showMenu: true,
            currentIndex: 0
        }
    }

    // list
    if (name === 'list') {
        config = {
            showMenu: true,
            currentIndex: 1
        }
    }

    // mine
    if (name === 'mine') {
        config = {
            showMenu: true,
            currentIndex: 2
        }
    }

    return config
}

export { setHeaderConfigAction, setMenuConfigAction }
