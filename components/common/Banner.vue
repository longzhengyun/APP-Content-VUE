<template>
    <div ref="mySwiper" v-swiper:mySwiper="swiperOption" v-if="data && data.length">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, key) in data" :key="key">
                <img :data-src="item.image_url" class="img swiper-lazy">
                <div class="swiper-lazy-preloader"></div>
            </div>
        </div>
        <div class="swiper-pagination swiper-pagination-white"></div>
    </div>
</template>
<script>
export default {
    name: 'Banner',
    props: ['data'],
    data () {
        return {
            defaultSwiperOption: {
                loop: true,
                autoplay: true,
                lazy: true,
                disableOnInteraction: false,
                observer: true,
                observeParents: true,
                pagination: {
                    el: '.swiper-pagination'
                },
                on: {
                    slideChange () {
                        this.update()
                    },
                    click: () => { // loop: true  点击不能直接绑定在dom上，需要使用swiper click api
                        let swiper = this.$refs.mySwiper.swiper
                        let index = swiper.realIndex
                        this.goTarget(index)
                    }
                }
            }
        }
    },
    computed: {
        swiperOption () {
            const newSwiperOption = {}
            if (this.data && this.data.length === 1) {
                newSwiperOption.loop = false
                newSwiperOption.resistanceRatio = 0
                newSwiperOption.pagination = {}
            }
            return Object.assign({}, this.defaultSwiperOption, newSwiperOption)
        }
    },
    methods: {
        goTarget (index) {
            this.$emit('callback', this.data[index])
        }
    }
}
</script>
<style scoped>
    .swiper-slide,
    .swiper-slide .img{width:100%;height:100%;border-radius: .12rem;}
    .swiper-slide .swiper-lazy{display:none;}
    .swiper-slide .swiper-lazy-loaded{display:block;}
    .swiper-container-horizontal > .swiper-pagination-bullets,
    .swiper-pagination-custom,
    .swiper-pagination-fraction{bottom:0;}
    .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet{margin:0 .05rem;}
    .swiper-lazy-preloader{width:.42rem;height:.42rem;margin-top:-.21rem;margin-left:-.21rem;}
</style>