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
            title: 'APP'
        }
    }

    // product
    if (name === 'product') {
        config = {
            showBack: false,
            title: '产品大全'
        }
    }

    // product/id
    if (name === 'product-id') {
        config = {
            showService: true
        }
    }

    // mine
    if (name === 'mine') {
        config = {
            showBack: false,
            showLine: false,
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
