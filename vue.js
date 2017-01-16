/**
 * Created by peidan on 2017/1/15.
 */
;(function () {
    function Dep() {
        this.subs = [];
    }

    Dep.prototype = {
        addSub: function (sub) {
            this.subs.push(sub);
        },
        notify: function (val) {
            this.subs.forEach(function (sub) {
                sub.update(val)
            });
        }
    };

    var Vue = function (params) {
        this.el = document.querySelector(params.el);
        this.data = params.data;

        this.dep = new Dep();
        this.compile();
    };

    Vue.prototype = {
        compile: function () {
            this.bindText();
            this.bindModel();
        },
        bindText: function () {
            var textDOMs = this.el.querySelectorAll('[v-text]'),
                bindText,_context = this;

            for (var i = 0; i < textDOMs.length; i++) {
                bindText = textDOMs[i].getAttribute('v-text');
                textDOMs[i].innerHTML = this.data[bindText];

                var val = textDOMs[i]

                var up = function (text) {
                    val.innerText = text
                }
                _context.dep.addSub({
                    value: textDOMs[i],
                    update: up
                });
            }
        },
        bindModel: function () {
            var modelDOMs = this.el.querySelectorAll('[v-model]'),
                bindModel;
            var _context = this;

            for (var i = 0; i < modelDOMs.length; i++) {
                bindModel = modelDOMs[i].getAttribute('v-model');
                modelDOMs[i].value = this.data[bindModel] || '';

                //数据劫持
                _context.observe(this.data);

                if (document.addEventListener) {
                    modelDOMs[i].addEventListener('keyup', function (event) {
                        e = event || window.event;
                        _context.data[bindModel] = e.target.value;
                    }, false);
                } else {
                    modelDOMs[i].attachEvent('onkeyup', function (event) {
                        e = event || window.event;
                        _context.data[bindModel] = e.target.value;
                    }, false);
                }
            }
        },
        observe: function (data) {
            var _context = this;
            if (!data || typeof data !== 'object') {
                return;
            }
            // 取出所有属性遍历
            Object.keys(data).forEach(function (key) {
                _context.defineReactive(data, key, data[key]);
            });
        },
        defineReactive: function (data, key, val) {
            this.observe(val); // 监听子属性
            var _context = this;
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: false, // 不能再define
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    if (val === newVal) return;
                    console.log('监听到值变化了 ', val, ' 变成 ', newVal);
                    val = newVal;
                    _context.dep.notify(newVal);
                }
            });
        }
    };
    window['Vue'] = Vue;
})()