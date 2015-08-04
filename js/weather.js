var oapBootstrapVer = "2013-06-24-11-28", _gaq = _gaq || [];
function pgfxLoadBlankBroadcasterImage() {
    return!1
}
(function () {
    function y() {
        f = window.jQuery.noConflict(!0);
        G()
    }
    function G() {
        J();
        f(document).ready(function (c) {

            c.each(e.css, function (a, b) {
                var e = "aw-widget-css-" + a;
                c("#" + e).length || c("<link>", {id: e, rel: "stylesheet", type: "text/css", href: b}).appendTo("head")
            });
            var b = f(e.current.selector).add(e.threeday.selector), a = c();
            b.each(function () {
                this.awInit || a.length || (a = c(this), this.awType = -1 != a.data("uid").indexOf("awcc") ? "current" : "threeday",
                        this.awInit = !0)
            });
            a.html('<span class="message">Loading Widget\u2026</span>');
            b = a.data();
            b.css && !c("#aw-widget-client-css").length && c("<link>", {id: "aw-widget-client-css", rel: "stylesheet", type: "text/css", href: b.css}).appendTo("head");
            b.css = null;
            f.getJSON(e[a.get(0).awType].url + "?callback=?", b, function (b) {
                b.style && c('<style type="text/css">' + b.style + "</style>").appendTo("head");
                a.html(b.html);
                v(f, a)
            })


        })
    }
    function x(c) {
        c.html('<span class="message">Loading Widget\u2026</span>');
        c.get(0).awInit = !1;
        var b = c.data();
        b.widget = null;
        var a;
        f(e.current.selector).add(e.threeday.selector).each(function () {
            this.awInit && f(this).data("uid").substr(4) == c.data("uid").substr(4) && (a = f(this), a.data("locationkey", c.data("locationkey")), a.data("unit", c.data("unit")), -1 != a.data("uid").indexOf("awcc") ? (this.awType = "current", a.awType = "current") : (this.awType = "threeday", a.awType = "threeday"))
        });
        c.get(0).awInit = !0;
        f.getJSON(e[c.get(0).awType].url +
                "?callback=?", b, function (a) {
                    c.html(a.html);
                    v(f, c)
                });
        a && (b = a.data(), b.widget = null, f.getJSON(e[a.awType].url + "?callback=?", b, function (c) {
            a.html(c.html);
            v(f, a)
        }))
    }
    function J() {
        (function (c, b) {
            var a;
            c.throttle = a = function (a, e, k, f) {
                function g() {
                    function c() {
                        C = +new Date;
                        k.apply(g, r)
                    }
                    function d() {
                        l = b
                    }
                    var g = this, n = +new Date - C, r = arguments;
                    f && !l && c();
                    l && clearTimeout(l);
                    f === b && n > a ? c() : !0 !== e && (l = setTimeout(f ? d : c, f === b ? a - n : a))
                }
                var l, C = 0;
                "boolean" !== typeof e && (f = k, k = e, e = b);
                c.guid && (g.guid = k.guid = k.guid || c.guid++);
                return g
            };
            c.debounce = function (c, e, f) {
                return f === b ? a(c, e, !1) : a(c, f, !1 !== e)
            }
        })(f);
        (function (c) {
            c.autocomplete = function (b, a) {
                function f() {
                    u = {data: {}, length: 0}
                }
                function q() {
                    var a = document.getElementById(p.attr("id")).value;
                    H(a, "search")
                }
                function k(a) {
                    var b = c("li", m);
                    b && (t += a, 0 > t ? t = 0 : t >= b.size() && (t = b.size() - 1), b.removeClass("aw-ac-hover"), c(b[t]).addClass("aw-ac-hover"), b[t] && b[t].scrollIntoView && b[t].scrollIntoView(!1))
                }
                function B() {
                    w && clearTimeout(w);
                    m.hide()
                }
                function g(b, d, g) {
                    if (d) {
                        p.removeClass(a.loadingClass);
                        m.html("");
                        if ("search" == g) {
                            if (!d.length) {
                                m.html('<div class="aw-no-results">No Matching Results Found</div>');
                                m.show();
                                return
                            }
                            if (1 == d.length) {
                                b = m.closest(e.threeday.selector);
                                b.data("locationkey", d[0][1]);
                                b.data("useip", "false");
                                x(b);
                                return
                            }
                        } else if (!v || 0 == d.length)
                            return B();
                        m.html(C(d));
                        m.find("a").each(function (a) {
                            c(this).click(function () {
                                var a = c(this).closest(e.threeday.selector);
                                a.data("locationkey", c(this).data("key"));
                                a.data("useip", "false");
                                x(a)
                            })
                        });
                        m.show()
                    } else
                        B()
                }
                function l(a) {
                    if (!a)
                        return null;
                    for (var c = [], b = 0; b < a.length; b++) {
                        var d = [], g = "";
                        a[b] && (d = a[b], g = [d.LocalizedName], "US" == d.Country.ID || "CA" == d.Country.ID || "AU" == d.Country.ID ? g.push(", " + d.AdministrativeArea.ID) : "GB" == d.Country.ID ? void 0 !== d.SupplementalAdminAreas && d.SupplementalAdminAreas.length ? g.push(", " + d.SupplementalAdminAreas[0].LocalizedName) : g.push(", " + d.AdministrativeArea.ID) : d.AdministrativeArea.LocalizedName != d.LocalizedName && g.push(", " + d.AdministrativeArea.LocalizedName), "US" == d.Country.ID ? g.push(" (USA)") : g.push(" (" +
                                d.Country.LocalizedName + ")"), g = g.join(""), d = [], d.push(g), d.push(a[b].Key), c.push(d))
                    }
                    return c
                }
                function C(c) {
                    var d = c.length;
                    0 < a.maxItemsToShow && a.maxItemsToShow < d && (d = a.maxItemsToShow);
                    for (var b = [], g = 0; g < d; g++)
                        b.push('<li class="aw-location"><a data-key="' + c[g][1] + '">' + c[g][0] + "</a></li>");
                    return b ? "<ul>" + b.join("") + "</ul>" : ""
                }
                function H(b, e) {
                    a.matchCase || (b = b.toLowerCase());
                    a.cacheLength && h(b);
                    "string" == typeof a.url && 0 < a.url.length ? c.ajax({type: "GET", url: d(b, e), cache: !0, dataType: "jsonp", success: function (a) {
                            a =
                                    l(a);
                            r(b, a);
                            g(b, a, e)
                        }}) : p.removeClass(a.loadingClass)
                }
                function d(c, d) {
                    "search" != d && (d = "autocomplete");
                    var b = a.url + d + "?q=" + encodeURI(c) + "&apiKey=" + a.api_key, g;
                    for (g in a.extraParams)
                        b += "&" + g + "=" + encodeURI(a.extraParams[g]);
                    return b
                }
                function h(c) {
                    if (!c)
                        return null;
                    if (u.data[c])
                        return u.data[c];
                    if (a.matchSubset)
                        for (var d = c.length - 1; d >= a.minChars; d--) {
                            var b = c.substr(0, d);
                            if (b = u.data[b]) {
                                for (var d = [], g = 0; g < b.length; g++) {
                                    var e = b[g], l;
                                    l = e[0];
                                    var m = c;
                                    a.matchCase || (l = l.toLowerCase());
                                    l = l.indexOf(m);
                                    l = -1 ==
                                            l ? !1 : 0 == l || a.matchContains;
                                    l && (d[d.length] = e)
                                }
                                return d
                            }
                        }
                    return null
                }
                function n(c, d) {
                    d && p.removeClass(a.loadingClass);
                    for (var b = d ? d.length : 0, g = null, l = 0; l < b; l++) {
                        var e = d[l];
                        if (e[0].toLowerCase() == c.toLowerCase()) {
                            g = document.createElement("li");
                            g.innerHTML = a.formatItem ? a.formatItem(e, l, b) : e[0];
                            g.selectValue = e[0];
                            var m = null;
                            if (1 < e.length)
                                for (var m = [], h = 1; h < e.length; h++)
                                    m[m.length] = e[h];
                            g.extra = m
                        }
                    }
                    a.onFindValue && setTimeout(function () {
                        a.onFindValue(g)
                    }, 1)
                }
                function r(c, d) {
                    d && c && a.cacheLength && (!u.length ||
                            u.length > a.cacheLength ? (f(), u.length++) : u[c] || u.length++, u.data[c] = d)
                }
                var p = b.attr("autocomplete", "off");
                a.inputClass && p.addClass(a.inputClass);
                var m = c(".aw-autocomplete"), K = c(".aw-submit-button");
                b.autocompleter = this;
                var w = null, I = "", t = -1, u = {}, v = !1, D = null;
                f();
                if (null != a.data) {
                    var E = "", z = {}, F = [];
                    "string" != typeof a.url && (a.cacheLength = 1);
                    for (var A = 0; A < a.data.length; A++)
                        F = "string" == typeof a.data[A] ? [a.data[A]] : a.data[A], 0 < F[0].length && (E = F[0].substring(0, 1).toLowerCase(), z[E] || (z[E] = []), z[E].push(F));
                    for (var y in z)
                        a.cacheLength++, r(y, z[y])
                }
                K.click(function () {
                    q()
                });
                p.bind("keydown", function (d) {
                    D = d.keyCode;
                    switch (d.keyCode) {
                        case 38:
                            d.preventDefault();
                            k(-1);
                            break;
                        case 40:
                            d.preventDefault();
                            k(1);
                            break;
                        case 9:
                            d.preventDefault();
                            break;
                        case 13:
                            var b = c("li", m);
                            d.preventDefault();
                            if (c(b).hasClass("aw-ac-hover")) {
                                d = m.closest(e.threeday.selector);
                                d.data("locationkey", c(b[t]).find("a").data("key"));
                                d.data("useip", "false");
                                x(d);
                                break
                            } else
                                q();
                            break;
                        default:
                            t = -1, w && clearTimeout(w), w = setTimeout(function () {
                                if (46 ==
                                        D || 8 < D && 32 > D)
                                    m.hide();
                                else {
                                    var d = document.getElementById(p.attr("id")).value;
                                    d != I && (I = d, d.length >= a.minChars ? (p.addClass(a.loadingClass), H(d, "autocomplete")) : (p.removeClass(a.loadingClass), m.hide()))
                                }
                            }, a.delay)
                    }
                }).bind("focus", function () {
                    v = !0
                }).bind("blur", function () {
                    v = !1;
                    w && clearTimeout(w);
                    w = setTimeout(B, 200)
                });
                B();
                this.flushCache = function () {
                    f()
                };
                this.setExtraParams = function (d) {
                    a.extraParams = d
                };
                this.findValue = function () {
                    var b = document.getElementById(p.attr("id")).value;
                    a.matchCase || (b = b.toLowerCase());
                    var e = a.cacheLength ? h(b) : null;
                    e ? n(b, e) : "string" == typeof a.url && 0 < a.url.length ? c.ajax({type: "GET", url: d(b, "autocomplete"), cache: !0, dataType: "jsonp", success: function (a) {
                            a = l(a);
                            r(b, a);
                            g(b, a, "autocomplete")
                        }}) : n(b, null)
                }
            };
            c.fn.autocomplete = function (b, a, e) {
                a = a || {};
                a.url = b;
                a.data = "object" == typeof e && e.constructor == Array ? e : null;
                a.inputClass = a.inputClass || "ac_input";
                a.resultsClass = a.resultsClass || "ac_results";
                a.lineSeparator = a.lineSeparator || "\n";
                a.cellSeparator = a.cellSeparator || "|";
                a.minChars = a.minChars ||
                        1;
                a.delay = a.delay || 400;
                a.matchCase = a.matchCase || 0;
                a.matchSubset = a.matchSubset || 1;
                a.matchContains = a.matchContains || 0;
                a.cacheLength = a.cacheLength || 1;
                a.mustMatch = a.mustMatch || 0;
                a.extraParams = a.extraParams || {};
                a.loadingClass = a.loadingClass || "ac_loading";
                a.selectFirst = a.selectFirst || !1;
                a.selectOnly = a.selectOnly || !1;
                a.maxItemsToShow = a.maxItemsToShow || -1;
                a.autoFill = a.autoFill || !1;
                a.width = parseInt(a.width, 10) || 0;
                new c.autocomplete(c(this), a);
                return c(this)
            };
            c.fn.autocompleteArray = function (c, a) {
                return this.autocomplete(null,
                        a, c)
            };
            c.fn.indexOf = function (c) {
                for (var a = 0; a < this.length; a++)
                    if (this[a] == c)
                        return a;
                return-1
            }
        })(f)
    }
    function v(c, b) {
        if ("undefined" != typeof awxOapIE8)
            for (var a = [{o: ".aw-widget-36hour .tbg-su, .aw-widget-36hour .bg-su, .aw-widget-current .tbg-su, .aw-widget-current .bg-su", c: "background", s: "#6cb2fc"}, {o: ".aw-widget-36hour .tbg-c, .aw-widget-36hour .bg-c, .aw-widget-current .tbg-c, .aw-widget-current .bg-c", c: "background", s: "#d0dae8"}, {o: ".aw-widget-36hour .tbg-f, .aw-widget-36hour .bg-f, .aw-widget-current .tbg-f, .aw-widget-current .bg-f",
                    c: "background", s: "#dee4ef"}, {o: ".aw-widget-36hour .tbg-t, .aw-widget-36hour .bg-t, .aw-widget-current .tbg-t, .aw-widget-current .bg-t", c: "background", s: "#90bbe5"}, {o: ".aw-widget-36hour .tbg-r, .aw-widget-36hour .bg-r, .aw-widget-current .tbg-r, .aw-widget-current .bg-r", c: "background", s: "#7789b2"}, {o: ".aw-widget-36hour .tbg-cl, .aw-widget-36hour .bg-cl, .aw-widget-current .tbg-cl, .aw-widget-current .bg-cl", c: "background", s: "#141414"}, {o: ".aw-widget-36hour .tbg-s, .aw-widget-36hour .bg-s, .aw-widget-current .tbg-s, .aw-widget-current .bg-s",
                    c: "background", s: "#141414"}, {o: "div.aw-widget-36hour-inner div.aw-widget-content div.aw-header div.aw-search button.aw-submit-button", c: "border", s: "none !important"}], f = 0; f < a.length; f++)
                c(a[f].o).css(a[f].c, a[f].s);
        window.accuweather = window.accuweather || {};
        window.accuweather.widgets = window.accuweather.widgets || {register: function (a, b) {
                var e = c(a);
                e.length && (window.accuweather.widgets[e.get(0)] = b)
            }, get: function (a) {
                a = c(a);
                if (a.length)
                    return window.accuweather.widgets[a.get(0)]
            }};
        window.accuweather.widgets.Current =
                function (a) {
                    var b = this;
                    this.el = c(a);
                    this.breakpoints = [86, 106, 115, 216, 280, 350, 479];
                    this.inner = this.el.find(".aw-widget-current-inner");
                    this.inow = this.el.find(".aw-current-weather .aw-icon");
                    this.clickUrl = this.el.find(".aw-widget-current-inner a").first();
                    -1 == this.clickUrl.attr("href").toString().toLowerCase().indexOf("accuweather.com") && this.clickUrl.removeAttr("target");
                    this.reload = function () {
                        x(a)
                    };
                    this.resize();
                    this.toggle = this.el.find(".aw-toggle");
                    this.toggle.click(function () {
                        b.inner.addClass("with-get");
                        return!1
                    });
                    window.accuweather.widgets.register(this.el.get(0), this)
                };
        window.accuweather.widgets.Current.prototype.resize = function () {
            for (var a = this.el.outerWidth(), c = [], b = !1, f = 0; f < this.breakpoints.length; f++) {
                var d = this.breakpoints[f];
                a < d && (c.push("lt-" + d), b = !0);
                a == d && c.push("eq-" + d)
            }
            b || (c = ["gte-" + this.breakpoints[this.breakpoints.length - 1]]);
            this.el.attr("class", e.current.baseClass + " " + c.join(" "));
            b = this.inow.data("icon");
            f = "l";
            216 > a && (f = "m");
            115 > a && (f = "t");
            this.inow.attr("class", "aw-icon aw-icon-" +
                    b + "-" + f);
            this.el.find(".debug .width").html(a);
            this.el.find(".debug .bpclasses").html(c.join(" "));
            this.el.hide();
            this.el.show()
        };
        window.accuweather.widgets.ThirtySixHour = function (a) {
            function e(a) {
                return awxWidgetInfo[d].wxInfo.ut ? "1" == awxWidgetInfo[d].wxInfo.ut ? 9 * a / 5 + 32 : a : a
            }
            function f(a, c) {
                for (var b in c)
                    switch (b) {
                        case "hi":
                        case "lo":
                            awxWidgetInfo[d].keyValuePairs[a + b] = 5 * Math.round(e(parseInt(c[b])) / 5);
                            break;
                        case "wx":
                            awxWidgetInfo[d].keyValuePairs[a + b] = parseInt(c[b]);
                            break;
                        default:
                            awxWidgetInfo[d].keyValuePairs[a +
                                    b] = c[b]
                    }
            }
            this.el = c(a);
            this.breakpoints = [320, 480, 540, 624, 632, 780, 860, 950];
            this.i36 = this.el.find(".aw-36-hours .aw-icon");
            this.inow = this.el.find(".aw-current-weather .aw-icon");
            this.search = this.el.find(".aw-search");
            this.reload = function () {
                x(a)
            };
            this.moveTimeBubble = function () {
                setTimeout(function () {
                    var a = c(".aw-widget-36hour").find(".aw-time-bubble"), d = a.find("span"), b = a.find("i"), e = a.find("b"), a = a.attr("data-minutes") / 60, g = c(".aw-six-hours-inner ul li:first").width(), e = e.width(), a = Math.max(5, g * a), a =
                            Math.min(e - 7, a), e = a + 6;
                    d.css("left", a + "px");
                    b.css("left", e + "px")
                }, 100)
            };
            b.find(".aw-temp-unit").find("li a").each(function (a) {
                c(this).click(function () {
                    c(this).closest("li").hasClass("current") || (c(this).hasClass("aw-unit-f") ? b.data("unit", "f") : b.data("unit", "c"), b.data("useip", "false"), x(b))
                })
            });
            var k = this.el.find(".aw-autocomplete");
            this.el.find(".aw-search input").bind({focus: function () {
                    c(this).closest(".aw-search").addClass("aw-focus");
                    c(this).val("");
                    var a = c(this).position().top + c(this).height() +
                            16;
                    c(".aw-emergency-header").length && (a += c(".aw-emergency-header").height() + 10);
                    k.css({width: c(this).width(), top: a, left: c(this).position().left})
                }, blur: function () {
                    c(this).closest(".aw-search").removeClass("aw-focus")
                }}).autocomplete("http://api.accuweather.com/locations/v1/cities/", {el: this.el.get(0), api_key: "651aa630aeac48e8b15f9072cfa524bc", autoFill: 1, inputClass: "aw-input", resultsClass: "aw-autocomplete", minChars: 1, cacheLength: 0, matchSubset: 1, matchCase: 0, matchContains: 1, maxItemsToShow: 8, mustMatch: 0});
            var d = this.el.data("uid");
            awxWidgetInfo[d].keyValuePairs = {zip: awxWidgetInfo[d].userInfo.zip, city: awxWidgetInfo[d].userInfo.city, state: awxWidgetInfo[d].userInfo.state, country: awxWidgetInfo[d].userInfo.country, partner: awxWidgetInfo[d].userInfo.sessionPartner, metro: awxWidgetInfo[d].userInfo.metro, dma: awxWidgetInfo[d].userInfo.dma, lang: awxWidgetInfo[d].userInfo.lang};
            if (awxWidgetInfo[d].wxInfo)
                for (var h in awxWidgetInfo[d].wxInfo)
                    if ("ix" != h)
                        if ("cu" == h)
                            for (var n in awxWidgetInfo[d].wxInfo[h])
                                awxWidgetInfo[d].wxInfo[h][n] &&
                                        f("cu", awxWidgetInfo[d].wxInfo[h]);
                        else if ("fc" == h)
                            for (var r = 0; r < awxWidgetInfo[d].wxInfo[h].length; r++)
                                for (n in awxWidgetInfo[d].wxInfo[h][r])
                                    awxWidgetInfo[d].wxInfo[h][r][n] && f("fc" + (r + 1), awxWidgetInfo[d].wxInfo[h][r]);
                        else
                            awxWidgetInfo[d].wxInfo[h] && (awxWidgetInfo[d].keyValuePairs[h] = awxWidgetInfo[d].wxInfo[h].toString());
            h = [];
            h.push('<iframe frameborder="0" height="250" width="300" marginheight="0" marginwidth="0" scrolling="no" src="');
            h.push("http://ad.doubleclick.net/N6581/adi/accuwx.products/oap/");
            h.push(document.domain.split(".").join("-") + ";");
            n = [];
            for (var p in awxWidgetInfo[d].keyValuePairs)
                awxWidgetInfo[d].keyValuePairs[p] && (n.push(p), n.push("="), n.push(awxWidgetInfo[d].keyValuePairs[p]), n.push(";"));
            h.push(n.join("").toLowerCase().split(" ").join("_"));
            h.push("sz=300x250;ord=" + 1E18 * Math.random());
            h.push('"></iframe>');
            c("#aw-ad-container").html(h.join(""));
            this.resize();
            window.accuweather.widgets.register(this.el.get(0), this)
        };
        window.accuweather.widgets.ThirtySixHour.prototype.resize =
                function () {
                    for (var a = this.el.outerWidth(), b = [], f = !1, k = 0; k < this.breakpoints.length; k++) {
                        var d = this.breakpoints[k];
                        a < d && (b.push("lt-" + d), f = !0);
                        a == d && b.push("eq-" + d)
                    }
                    f || (b = ["gte-" + this.breakpoints[this.breakpoints.length - 1]]);
                    this.el.attr("class", e.threeday.baseClass + " " + b.join(" "));
                    this.i36.each(function () {
                        var b = c(this), d = b.data("icon"), e = "m";
                        950 > a && (e = "s");
                        b.attr("class", "aw-icon aw-icon-" + d + "-" + e)
                    });
                    b = this.inow.data("icon");
                    this.inow.attr("class", "aw-icon aw-icon-" + b + "-" + (480 > a ? "m" : "xl"));
                    this.moveTimeBubble();
                    $table = c(".vid-headline-box");
                    $table.find("td.logo").css("width", $table.outerHeight(!0) + "px")
                };
        var q = "current" == b.get(0).awType ? new window.accuweather.widgets.Current(b) : new window.accuweather.widgets.ThirtySixHour(b);
        c(window).resize(c.throttle(200, function () {
            q.resize()
        }));
        "current" == b.get(0).awType ? window.accuweatherWidgetCurrentReady && window.accuweatherWidgetCurrentReady(b.get(0), q) : window.accuweatherWidgetThirtySixHourReady && window.accuweatherWidgetThirtySixHourReady(b.get(0), q);
        var k = b.data("uid") ?
                b.data("uid") : "aw" + (new Date).getTime(), a = b.data("lifestyle") ? "/" + b.data("lifestyle") : "", a = b.get(0).awType + a;
        try {
            (function (a, b, c, e, d, f, k) {
                a.GoogleAnalyticsObject = d;
                a[d] = a[d] || function () {
                    (a[d].q = a[d].q || []).push(arguments)
                };
                a[d].l = 1 * new Date;
                f = b.createElement(c);
                k = b.getElementsByTagName(c)[0];
                f.async = 1;
                f.src = e;
                k.parentNode.insertBefore(f, k)
            })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga_awxoap"), ga_awxoap("create", "UA-31945348-1", "auto", {name: "awxoapTracker"}), ga_awxoap("awxoapTracker.set",
                    "page", "/oap-weather-widgets/" + a), ga_awxoap("awxoapTracker.send", "pageview", {dimension1: "OAP_Weather_Widgets", dimension2: document.domain ? document.domain.split(".").join("-") : "OAP_NoDomain", dimension3: awxWidgetInfo[k].userInfo.partner, dimension4: "OAP_Widget_" + a, dimension5: awxWidgetInfo[k].wxInfo.mcpct})
        } catch (v) {
        }
        c("#" + k).find("a").each(function () {
            if (c(this).attr("id") && "#" != c(this).attr("href")) {
                var a = c(this).attr("href");
                c(this).attr("id");
                var e = [];
                e.push("utm_source=" + (document.domain ? document.domain.split(".").join("-") :
                        "OAP_NoDomain"));
                e.push("utm_medium=oap_weather_widget");
                e.push("utm_term=" + c(this).attr("id"));
                e.push("utm_content=" + awxWidgetInfo[k].userInfo.partner);
                e.push("utm_campaign=" + b.get(0).awType);
                -1 != a.indexOf("?") ? c(this).attr("href", a + "&" + e.join("&")) : c(this).attr("href", a + "?" + e.join("&"))
            }
        })
    }
    document && document.URL && document.URL.indexOf("/adc/");
    var f;
    if (void 0 !== window.jQuery && window.jQuery.fn.jquery.match(/^1\.9/))
        f = window.jQuery, G();
    else {
        var q = document.createElement("script");
        q.setAttribute("type",
                "text/javascript");
        q.setAttribute("src", "http://vortex.accuweather.com/adc2010/oap/javascript/jquery-1.9.1.min.js");
        q.readyState ? q.onreadystatechange = function () {
            "complete" != this.readyState && "loaded" != this.readyState || y()
        } : q.onload = y;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(q)
    }
    var e = {current: {}, threeday: {}};
    "undefined" != typeof oap3dayConfigDev ? (e.css = oap3dayConfigDev.css, e.threeday.selector = oap3dayConfigDev.threedaySelector, e.threeday.baseClass = oap3dayConfigDev.threedayBaseClass,
            e.threeday.url = oap3dayConfigDev.threedayUrl, e.current.selector = oap3dayConfigDev.currentSelector, e.current.baseClass = oap3dayConfigDev.currentBaseClass, e.current.url = oap3dayConfigDev.currentUrl) : (e.css = ["http://vortex.accuweather.com/adc2010/oap/stylesheets/widgets-20150116.css"], e.threeday.selector = ".aw-widget-36hour", e.threeday.baseClass = "aw-widget-36hour", e.threeday.url = "http://www.accuweather.com/ajax-service/oap/3day", e.current.selector = ".aw-widget-current", e.current.baseClass = "aw-widget-current",
            e.current.url = "http://www.accuweather.com/ajax-service/oap/current")
})();