/* eslint-disable */
window.productExposure = {
    offsetActon: function (curEle) { // 获取目标相对body的偏移值
        var totalTop = null;
        var par = curEle.offsetParent;

        //首先加自己本身的上偏移
        totalTop += curEle.offsetTop;

        //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
        while (par) {
            //累加父级参照物本身的偏移
            totalTop += par.offsetTop;
            par = par.offsetParent;
        }

        return totalTop;
    },
    scrollAction: function () { // 监听滚动方法
        var _this = this;

        _this.targetList.forEach(function (element, index) {
            if (element) {
                if (element.bodyOffsetTop + element.clientHeight <= _this.wrap.bodyOffsetTop + _this.wrap.clientHeight + _this.wrap.scrollTop) {
                    _this.option.callback(_this.targetList[index].dataset);
                    delete _this.targetList[index];
                }
            }
        });
    },
    formatData: function () { // 格式化数据
        var _this = this;

        // 获取容器相对body的偏移值
        _this.wrap.bodyOffsetTop = _this.offsetActon(_this.wrap);
        _this.targetList.forEach(function (element, index) {
            if (element) {
                element.bodyOffsetTop = _this.offsetActon(_this.domList[index]); // 为每项添加相对body的偏移值
            }
        });
    },
    init: function (option) { // 初始化
        // 获取容器
        this.option = option;
        this.wrap = document.getElementById(this.option.wrapId);

        if (this.wrap) {
            // 获取监听目标
            if (this.option.domClass) {
                this.domList = document.querySelectorAll(this.option.domClass);
                if (this.domList.length > 0) {
                    this.targetList = Array.prototype.slice.call(this.domList); // dom数组对象转普通数组

                    this.formatData();
                    this.scrollAction();

                    // 监听容器滚动
                    this.wrap.removeEventListener('scroll', this.scrollAction.bind(this), false);
                    this.wrap.addEventListener('scroll', this.scrollAction.bind(this), false);
                }
            }
        }
    },
    update: function () { // 更新
        if (this.wrap) {
            if (this.domList && this.targetList) {
                this.formatData();
                this.scrollAction();
            }
        }
    }
};

