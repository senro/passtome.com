document.domain = "woniu.com";
var Login = function(t) {
    if (! (this instanceof Login)) {
        return new Login(t)
    }
    try {
        if (!t) {
            throw "缺少 options 对象"
        }
        if (!t.formId) {
            throw "options 下缺少 formId 属性"
        }
    } catch(H) {
        alert("缺少必要的参数：\n" + H);
        return
    }
    this.formId = e(t.formId);
    this.$formId = $(t.formId);
    t.submit = $.extend(true, {
            node: "input[type=submit]",
            disabled: ".disabledSubmit"
        },
        t.submit || {});
    var E = this,
        r = "http://gwpassport2.woniu.com/v2/",
        s = E.constructor.prototype,
        w = $("body"),
        y = E.$formId,
        v = y.find(t.submit.node),
        p = e(t.submit.disabled),
        G = "submit." + E.formId,
        g = $.extend(true, {
                scope: ".row",
                input: {
                    node: ".inputDefault",
                    write: ".inputWrite",
                    done: ".inputComplete"
                },
                message: {
                    node: ".msgContainer",
                    hover: ".msgHover",
                    error: ".msgError"
                },
                icon: {
                    node: "",
                    done: "",
                    error: ""
                }
            },
            t.elements || {}),
        f = 0,
        K = {},
        b = $.now(),
        d = E.formId + "_" + b,
        n = $.isFunction(t.beforeSend) ? t.beforeSend: function() {},
        D = $.isFunction(t.success) ? t.success: function(L) {
            a("注册完成")
        },
        q = $.isFunction(t.complete) ? t.complete: function(L) {},
        z,
        C,
        m = t.responseTimeLimit || 125 * 1000;
    var o = {
            emit: function() {
                if (!this._events) {
                    return
                }
                var N = this._events[arguments[0]];
                if (!N) {
                    return
                }
                var M = N.handler,
                    L = N.context;
                if ($.isFunction(M)) {
                    M.apply(L, Array.prototype.slice.call(arguments, 1))
                }
            },
            bind: function() {
                var M = {},
                    N;
                if (!$.isPlainObject(arguments[0])) {
                    M[arguments[0]] = arguments[1];
                    N = arguments[2]
                } else {
                    M = arguments[0];
                    N = arguments[1]
                }
                this._events = this._events || {};
                for (var L in M) {
                    if (M.hasOwnProperty(L)) {
                        this._events[L] = {
                            handler: M[L],
                            context: N || this
                        }
                    }
                }
            },
            unbind: function(L) {
                var N = this,
                    M = $.isArray(L) ? L: [L];
                $.each(M,
                    function(O, P) {
                        N._events[P] = null
                    })
            }
        },
        x = {
            models: (function() {
                function L() {}
                $.extend(L.prototype, {
                    getValue: function(M) {
                        if (this.hasOwnProperty(M) && this.isPublic) {
                            return this[M].get()
                        }
                    },
                    getValues: function(O) {
                        var N = this,
                            M = {};
                        if (!O) {
                            $.each(N,
                                function(Q, P) {
                                    if (N.hasOwnProperty(Q)) {
                                        M[Q] = P.get()
                                    }
                                });
                            return M
                        }
                        $.each($.isArray(O) ? O: [O],
                            function(P, Q) {
                                if (N.hasOwnProperty(Q) && N[Q].isPublic) {
                                    M[Q] = N[Q].get()
                                }
                            });
                        return M
                    },
                    reset: function() {
                        var M = this;
                        $.each(M,
                            function(N, O) {
                                if (M.hasOwnProperty(N)) {
                                    O.reset()
                                }
                            })
                    }
                });
                return new L()
            } ()),
            views: (function() {
                function L() {}
                $.extend(L.prototype, {
                    getValue: function(M) {
                        return u.getValue(M)
                    },
                    getValues: function(M) {
                        return u.getValues(M)
                    },
                    reset: function() {
                        var M = this;
                        $.each(M,
                            function(N, O) {
                                if (M.hasOwnProperty(N)) {
                                    O.reset()
                                }
                            });
                        u.reset()
                    }
                });
                return new L()
            } ()),
            controllers: (function() {
                function L() {}
                $.extend(L.prototype, {
                    getValue: function(M) {
                        return B.getValue(M)
                    },
                    getValues: function(M) {
                        return B.getValues(M)
                    },
                    reset: function() {
                        B.reset()
                    }
                });
                return new L()
            } ())
        },
        B = x.models,
        u = x.controllers,
        c = x.views;
    function F(L) {
        this.id = h("m-");
        this.value = "";
        this.validated = false;
        $.extend(true, this, L)
    }
    $.extend(true, F.prototype, o, {
        modelPass: function(L) {
            this.value = L;
            this.validated = true;
            this.emit("controllerPass", L)
        },
        modelFail: function(L) {
            this.reset();
            this.emit("controllerFail", L)
        },
        get: function() {
            return this.validated ? this.value: ""
        },
        reset: function() {
            this.value = "";
            this.validated = false
        }
    });
    function J(N) {
        this.id = h("v-");
        this.controller = N.controller;
        this.elements = N.elements;
        var O = this,
            M = O.el = O.elements,
            U = O.$scope = y.find(M.scope),
            Q = O.$input = U.find(M.input.node),
            R = O.$msg = U.find(M.message.node),
            P = O.$icon = U.find(M.icon.node),
            T = O.msgError = e(M.message.error),
            S = O.iconNode = e(M.icon.done),
            L = O.iconError = e(M.icon.error);
        R.bind({
            mouseenter: this.hover(),
            mouseleave: this.hover(),
            focus: function() {
                Q.get(0).focus()
            }
        });
        Q.bind({
            focus: this.show(),
            blur: this.update(),
            keyup: this.enter()
        });
        O.controller.bind(this.events, this)
    }
    $.extend(true, J.prototype, o, {
        events: {
            viewPass: function(R) {
                var P = this.el,
                    S = this.$input,
                    L = this.$msg,
                    M = this.$icon,
                    O = this.msgError,
                    Q = this.iconError,
                    N = this.iconNode;
                S.removeClass(e(P.input.write)).addClass(e(P.input.done));
                L.removeClass(O).hide();
                M.removeClass(Q).addClass(N).show()
            },
            viewFail: function(P) {
                var L = this.$msg,
                    M = this.$icon,
                    O = this.msgError,
                    Q = this.iconError,
                    N = this.iconNode;
                if (P) {
                    L.val(P)
                }
                L.addClass(O).show();
                M.removeClass(N).addClass(Q).show()
            }
        },
        hover: function(M) {
            var L = this;
            return function(Q) {
                var R = $(this),
                    P = Q.type,
                    O = L.elements,
                    N = e(O.message.hover);
                if (!N) {
                    return
                }
                if (P === "mouseenter") {
                    R.addClass(N)
                }
                if (P === "mouseleave") {
                    R.removeClass(N)
                }
            }
        },
        show: function() {
            var L = this;
            return function(O) {
                var N = L.elements,
                    P = L.$input,
                    M = L.$msg;
                M.hide();
                P.removeClass(e(N.input.done)).addClass(e(N.input.write));
                l()
            }
        },
        update: function() {
            var L = this;
            return function(M) {
                L.controller.update($(this).val())
            }
        },
        enter: function() {
            var L = this;
            return function(O) {
                if (O.keyCode === 13) {
                    var P = $(this),
                        Q = parseInt(L.id.slice(2), 10),
                        M = Number.MAX_VALUE,
                        N = null;
                    $.each(c,
                        function(S, R) {
                            if (!c.hasOwnProperty(S)) {
                                return
                            }
                            var T = parseInt(R.id.slice(2), 10);
                            if (T > Q && T < M) {
                                M = T;
                                N = R
                            }
                        });
                    if (N) {
                        y.find(N.elements.scope).find(N.elements.input.node).focus()
                    } else {
                        P.blur();
                        y.submit()
                    }
                    return false
                }
            }
        },
        nowValue: function() {
            return $.trim(this.$input.val())
        },
        reset: function() {
            var O = this,
                N = O.elements,
                P = O.$input,
                L = O.$msg,
                M = O.$icon;
            L.removeClass(e(N.message.error) + " " + e(N.message.hover)).show();
            P.removeClass(e(N.input.write)).removeClass(e(N.input.done));
            M.removeClass(e(N.icon.error)).removeClass(e(N.icon.done));
            if (typeof A !== "undefined") {
                A.click()
            }
        }
    });
    function k(L) {
        this.model = L.model;
        this.model.bind(this.events, this)
    }
    $.extend(true, k.prototype, o, {
        events: {
            controllerPass: function(L) {
                this.emit("viewPass", L)
            },
            controllerFail: function(L) {
                this.emit("viewFail", L)
            }
        },
        update: function(L) {
            this.model.validate(L)
        }
    });
    function h(M) {
        var L = 0;
        h = function(N) {
            L += 1;
            return N ? N + L: L
        };
        return h(M)
    }
    function e(L) {
        return L.replace(/^[.#]/, "")
    }
    function a(L) {
        if ($.isFunction(t.handleMessage)) {
            a = t.handleMessage
        } else {
            a = alert
        }
        a(L)
    }
    function l() {
        if (!s.hasToken) {
            $.ajax({
                url: r + "get_token",
                type: "GET",
                dataType: "jsonp",
                jsonp: "jsoncallback",
                beforeSend: function() {
                    s.hasToken = true;
                    z = setTimeout(function() {
                            s.hasToken = false
                        },
                        m)
                },
                success: function(L) {
                    clearTimeout(z);
                    s.hasToken = (L.msgcode * 1) === 1050
                }
            })
        }
    }
    $.extend(B, {
        username: new F({
            isPublic: true,
            verify: function(M) {
                var L = $.trim(M);
                if (!L) {
                    return "请输入用户名"
                }
                return true
            },
            validate: function(M) {
                var L = this.verify(M);
                L === true ? this.modelPass(M) : this.modelFail(L)
            }
        }),
        password: new F({
            verify: function(M) {
                var L = $.trim(M);
                if (!L) {
                    return "请输入密码"
                }
                return true
            },
            validate: function(M) {
                var L = this.verify(M);
                L === true ? this.modelPass(M) : this.modelFail(L)
            }
        })
    });
    if ($.isPlainObject(t.verifyCode)) {
        t.verifyCode = $.extend(true, {
                node: ".reVerifyCode",
                img: ".verifyCode",
                url: "http://gwact.woniu.com/qe/h120725/getcode"
            },
            t.verifyCode);
        var A = y.find(t.verifyCode.img),
            i = y.find(t.verifyCode.node),
            j = t.verifyCode.url;
        A.attr("src", j);
        A.add(i).click(function() {
            A.attr("src", j + "?_=" + $.now())
        });
        $.extend(B, {
            verifycode: new F({
                isPublic: true,
                verify: function(M) {
                    var L = $.trim(M);
                    if (!L) {
                        return "请输入验证码"
                    }
                    return true
                },
                validate: function(M) {
                    var L = this.verify(M);
                    L === true ? this.modelPass(M) : this.modelFail(L)
                }
            })
        })
    }
    $.each(B,
        function(L) {
            if (!B.hasOwnProperty(L)) {
                return
            }
            u[L] = new k({
                model: B[L]
            });
            var M = {
                controller: u[L],
                elements: $.extend({},
                    g, {
                        scope: g.scope + ":eq(" + (f++) + ")"
                    })
            };
            c[L] = new J(M)
        });
    if ($("#hiddenIframe").length === 0) {
        w.append('<iframe id="hiddenIframe" name="hiddenIframe" style="display:none;"></iframe>')
    }
    $.each(K,
        function(L, M) {
            if (!M) {
                return
            }
            y.append('<input name="' + L + '" value="' + M + '" type="hidden" />')
        });
    y.append('<input name="jsoncallback" value="' + d + '" type="hidden" />').attr("target", "hiddenIframe");
    window[d] = function(L) {
        clearTimeout(C);
        delete s.hasToken;
        y.unbind(G).bind(G, I);
        v.removeAttr("disabled").removeClass(p);
        if (L.msgcode * 1 === 1002) {
            D(L);
            s.hasToken = false
        } else {
            a(L.tips)
        }
        q(L)
    };
    function I() {
        var L = true;
        y.attr("action", y.attr("action").split("?")[0] + "?" + $.now());
        $.each(B,
            function(N, M) {
                if (!B.hasOwnProperty(N)) {
                    return
                }
                if (!M.validated) {
                    M.modelFail();
                    return L = false
                }
            });
        if (!L) {
            return L
        }
        E.setHiddenOptions(E.statsInfo);
        y.unbind(G).bind(G,
            function() {
                return false
            });
        v.attr("disabled", "disabled").addClass(p);
        n();
        C = setTimeout(function() {
                y.unbind(G).bind(G, I);
                v.removeAttr("disabled").removeClass(p)
            },
            m);
        return L
    }
    y.bind(G, I).get(0).reset();
    this.get = function(L) {
        var M = B[L];
        if (M && M.isPublic) {
            return M.get()
        }
    };
    this.set = function() {
        var L = {};
        if (!$.isPlainObject(arguments[0])) {
            L[arguments[0]] = arguments[1]
        } else {
            L = arguments[0]
        }
        $.each(L,
            function(N, O) {
                var M = c[N];
                if (M) {
                    M.$input.val(O).blur()
                }
            })
    };
    this.setHiddenOptions = function() {
        var L = {};
        if (!$.isPlainObject(arguments[0])) {
            L[arguments[0]] = arguments[1]
        } else {
            L = arguments[0]
        }
        $.each(L,
            function(M, N) {
                if (K.hasOwnProperty(M)) {
                    if (N) {
                        K[M] = N;
                        y.find("[name=" + M + "]").val(N)
                    } else {
                        delete K[M];
                        y.find("[name=" + M + "]").remove()
                    }
                } else {
                    if (N) {
                        K[M] = N;
                        y.append('<input name="' + M + '" value="' + N + '" type="hidden" />')
                    }
                }
            })
    };
    this.reset = function() {
        c.reset();
        y.get(0).reset()
    };
    if (!$.isFunction(this.submit)) {
        s.submit = function() {
            this.$formId.submit()
        }
    }
    if (!$.isPlainObject(this.statsInfo)) {
        s.statsInfo = {}
    }
};