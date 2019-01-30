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

    // mine
    if (name === 'mine') {
        config = {
            showBack: false,
            showMineHeader: true
        }
    }

    // set
    if (name === 'set') {
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

    // product
    if (name === 'product') {
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
