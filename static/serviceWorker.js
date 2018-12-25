// 定义缓存存储名
var cacheStorageName = '1.0.0';

// 定义缓存文件列表
var cacheList = [
    '/favicon.ico',
    '/manifest.json',
    '/css/library/mobileSelect.min.css',
    '/css/library/swiper.min.css',
    '/js/library/datepickerZH.js',
    '/js/library/mobileSelect.min.js',
    '/js/common/gtag.js',
    '/js/common/IDValidator.js',
    '/img/common/date.png',
    '/img/common/default_avatar.png',
    '/img/common/default_fail.png',
    '/img/common/default_nothing.png',
    '/img/common/icon.png',
    '/img/common/icon_index.png',
    '/img/common/icon_index_current.png',
    '/img/common/icon_mine.png',
    '/img/common/icon_mine_current.png',
    '/img/common/icon_product.png',
    '/img/common/icon_product_current.png',
    '/img/common/icon_back.png',
    '/img/index/adviser.png',
    '/img/index/icon_avatar.png',
    '/img/index/icon_copper.png',
    '/img/index/icon_gold.png',
    '/img/index/icon_silver.png',
    '/img/index/money_icon.png',
    '/img/index/red_package.png',
    '/img/index/title_bg.png',
    '/img/invitation/img_poster1.png',
    '/img/invitation/img_poster2.png',
    '/img/invitation/img_poster3.png',
    '/img/invitation/img_poster_detail.png',
    '/img/invitation/text_loading.png',
    '/img/login/icon_login.png',
    '/img/login/icon_wx.png',
    '/img/login/icon_arrow.png',
    '/img/mine/bg_mine.png',
    '/img/mine/icon_friends.png',
    '/img/mine/icon_invite.png',
    '/img/mine/icon_notice.png',
    '/img/mine/icon_order.png',
    '/img/mine/icon_privilege.png',
    '/img/mine/icon_profit.png',
    '/img/mine/icon_redpacket.png',
    '/img/mine/icon_service.png',
    '/img/mine/icon_set.png',
    '/img/mine/icon_vip.png',
    '/img/mine/icon_vip2.png',
    '/img/mine/icon_vip3.png',
    '/img/myorder/failed.png',
    '/img/myorder/ing.png',
    '/img/myorder/success.png',
    '/img/product/arrow-enter.png',
    '/img/product/get_redpacket.png',
    '/img/product/icon_notice.png',
    '/img/product/icon_redbag.png',
    '/img/product/tip.png',
    '/img/redpacket/bg_top.png',
    '/img/redpacket/bg_wrap.png',
    '/img/redpacket/icon_open.png',
    '/img/redpacket/icon_pop.png',
    '/img/redpacket/icon_redpacket.png',
    '/img/submitform/icon_apply_del.png',
    '/img/submitform/icon_apply_upload.png',
    '/img/submitform/zhifubao.png',
    '/img/submitform/examples1.png',
    '/img/submitform/examples2.png',
    '/img/consultant/spread_top.jpg',
    '/img/consultant/tequan_center.jpg',
    '/img/consultant/tequan_top.jpg',
    '/img/consultant/icon_alipay.png',
    '/img/consultant/icon_wechat.png',
    '/img/consultant/icon_select.png',
    '/img/consultant/icon_select_active.png',
    '/img/explain/explain_center.jpg',
    '/img/explain/explain_top.jpg'
];

// 安装，抓取资源进行缓存
self.addEventListener('install', function (e) {
    e.waitUntil( // 等待Promise完成后安装
        caches.open(cacheStorageName).then(function (cache) {
            return cache.addAll(cacheList) // 根据文件列表缓存资源
        }).then(function () {
            return self.skipWaiting() // 立即激活，在页面被旧sw控制时候，可不用刷新页面直接激活新的sw
        })
    )
});

// 拦截请求, 查询缓存或者网络, 返回请求的资源
self.addEventListener('fetch', function (e) {
    if (e.request.method === 'GET' && e.request.url.indexOf('/collect?') < 0 && e.request.url.indexOf('?imageView2/2/w/') < 0) { // 排除七牛云缩略图，解决生成海报bug，排除ga统计，获取get请求
        e.respondWith( // 等待Promise完成后响应
            caches.match(e.request).then(function (response) { // match 在缓存中匹配请求；
                if (response) { // 如果获取到资源，返回资源
                    return response
                };
                var requestToCache = e.request.clone();
                return fetch(requestToCache).then(function (response) { // 如果未获取到资源，重新发起网络请求
                    if (response && requestToCache.url.indexOf('http') === 0) { // 有返回结果，存储返回的结果
                        var responseToCache = response.clone();
                        caches.open(cacheStorageName).then(function (cache) { // 将从网络获取的静态资源缓存
                            cache.put(requestToCache, responseToCache) // 根据文件列表缓存资源
                        });
                    }
                    return response
                }).catch(function (err) {
                    console.log('Fetch错误:' + err);
                });
            })
        )
    }
});

// 激活，更新缓存的资源
self.addEventListener('activate', function (e) {
    e.waitUntil( // 等待Promise完成后激活
        caches.keys().then(function (cacheNames) { // 获取缓存名
            return Promise.all(
                cacheNames.map(function (cacheName) { // 遍历
                    if (cacheName !== cacheStorageName) {
                        return caches.delete(cacheName) // 删除和更新后的缓存名不一致的缓存
                    }
                })
            )
        }).then(function () {
            return self.clients.claim // 使新sw获取页面控制权
        })
    )
});