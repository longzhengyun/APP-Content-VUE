import pkg from './package'

module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'white' },
            { name: 'format-detection', content: 'email=no, telephone=no' },
            { name: 'renderer', content: 'webkit' },
            { name: 'full-screen', content: 'yes' },
            { name: 'x5-fullscreen', content: 'true' },
            { name: 'x5-page-mode', content: 'app' },
            { name: 'browsermode', content: 'application' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'manifest', href: '/manifest.json' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/common/icon.png' }
        ],
        script: [
            { src: '/js/common/productExposure.js', defer: 'defer' },
            { innerHTML: '(function(d,c){var e=d.documentElement,b="orientationchange" in window?"orientationchange":"resize",a=function(){var f=e.clientWidth;if(!f){return}e.style.fontSize=100*(f/750)+"px"};if(!d.addEventListener){return}c.addEventListener(b,a,false);d.addEventListener("DOMContentLoaded",a,false)})(document,window);', type: 'text/javascript', charset: 'utf-8' }
        ],
        __dangerouslyDisableSanitizers: ['script']
    },

    /*
    ** Customize the progress-bar color
    */
    loading: false,

    /*
    ** Global CSS
    */
    css: ['~assets/css/main'],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        { src: '~plugins/swiper.client.js'}
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios',
        '@nuxtjs/toast'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
        proxy: true, // 代理
        retry: true // 重试
    },

    env: {
        CONST_ENV: process.env.CONST_ENV
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {}
    },
    render: {
        http2: {
            push: true
        },
        resourceHints: false // 禁用预加载渲染，解决多项目加载不相干js问题
    },
    cache: true,
    toast: {
        position: 'center',
        duration: '1000'
    }
}
