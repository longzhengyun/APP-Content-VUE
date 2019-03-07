const setHeaderConfigAction = (name) => {
    let config = {}

    // index
    if (name === 'index') {
        config = {
            showBack: false,
            showLine: false
        }
    }

    // home
    if (name === 'home') {
        config = {
            showBack: false,
            showLine: false,
            title: 'APP-Content'
        }
    }

    // list
    if (name === 'list') {
        config = {
            showBack: false,
            title: '列表'
        }
    }

    // list/id
    if (name === 'list-id') {
        config = {
            showService: true
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
    if (name.indexOf('activities') === 0) {
        config = {
            showHeader: false,
            title: ''
        }
    }

    return config
}

export { setHeaderConfigAction }
