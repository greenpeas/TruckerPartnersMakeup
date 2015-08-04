$(document).ready(function() {
/*
    sidebarItem.each(function (i) {
        if ( $(this).hasClass("active") ) {
            $(this).children(".second-level-menu").show();
        }
         if ( $(this).hasClass('active') ) {
         return false;
         }
         else {
         $(this).siblings().removeClass('active');
         $(this).addClass('active');
         innerMenu.hide();
         $(this).children(".second-level-menu").show();
         }
    });
 */
    // init stepy form wizard plugin
    $('#tax-calc-form').stepy({
        backLabel:      'Backward',
        block:          true,
        nextLabel:      'Forward',
        titleClick:     true
        //validate:       true
    });

    // show drop-down-block
    $('.drop-down-toggle').click(function() {
        $(this).closest('li').toggleClass('drop-open');
        return false;
    });
    // show drop-down-block
    $(document).click(function(event) {
        if ($(event.target).closest(".user-drop-menu").length) return;
        $('li').removeClass('drop-open');
        event.stopPropagation();
    });

    //initial fancybox on registrarion page
    $(".login-fancybox-gallery").fancybox({
        padding: 0,
        openEffect : 'elastic',
        openSpeed  : 150,
        closeEffect : 'elastic',
        closeSpeed  : 150
    });
    //initial fancybox gallery
    $(".photo-gallery").fancybox({
        afterLoad: function() {
            this.title = '<a class="edit-link" href=""><i class="fa fa-pencil"></i></a> ' + this.title;
            this.title = '<a class="del-link" href=""><i class="fa fa-trash"></i></a> ' + this.title;
        },
        openEffect : 'elastic',
        openSpeed  : 200,
        closeEffect : 'elastic',
        closeSpeed  : 200,
        padding: 0
    });

    //initial resize image
    $(function() {
        $('.resize-img').resizeToParent();
    });
});

// script for resize image
(function($) {
    $.fn.resizeToParent = function(opts) {
        var defaults = {
            parent: 'div',
            delay: 100
        }

        var opts = $.extend(defaults, opts);

        function positionImage(obj) {
            // reset image (in case we're calling this a second time, for example on resize)
            obj.css({'width': '', 'height': '', 'margin-left': '', 'margin-top': ''});

            // dimensions of the parent
            var parentWidth = obj.parents(opts.parent).width();
            var parentHeight = obj.parents(opts.parent).height();

            // dimensions of the image
            var imageWidth = obj.width();
            var imageHeight = obj.height();

            // step 1 - calculate the percentage difference between image width and container width
            var diff = imageWidth / parentWidth;

            // step 2 - if height divided by difference is smaller than container height, resize by height. otherwise resize by width
            if ((imageHeight / diff) < parentHeight) {
                obj.css({'width': 'auto', 'height': parentHeight});

                // set image variables to new dimensions
                imageWidth = imageWidth / (imageHeight / parentHeight);
                imageHeight = parentHeight;
            }
            else {
                obj.css({'height': 'auto', 'width': parentWidth});

                // set image variables to new dimensions
                imageWidth = parentWidth;
                imageHeight = imageHeight / diff;
            }

            // step 3 - center image in container
            var leftOffset = (imageWidth - parentWidth) / -2;
            var topOffset = (imageHeight - parentHeight) / -2;

            obj.css({'margin-left': leftOffset, 'margin-top': topOffset});
        }

        // run the position function on window resize (to make it responsive)
        var tid;
        var elems = this;

        $(window).on('resize', function() {
            clearTimeout(tid);
            tid = setTimeout(function() {
                elems.each(function() {
                    positionImage($(this));
                });
            }, opts.delay);
        });

        return this.each(function() {
            var obj = $(this);

            // hack to force ie to run the load function... ridiculous bug
            // http://stackoverflow.com/questions/7137737/ie9-problems-with-jquery-load-event-not-firing
            obj.attr("src", obj.attr("src"));

            // bind to load of image
            obj.load(function() {
                positionImage(obj);
            });

            // run the position function if the image is cached
            if (this.complete) {
                positionImage(obj);
            }
        });
    }
})( jQuery );


/*!
 * jQuery Stepy - A Wizard Plugin - http://wbotelhos.com/stepy
 * ------------------------------------------------------------------------------------
 *
 * jQuery Stepy is a plugin based on FormToWizard that generates a customizable wizard.
 *
 * Licensed under The MIT License
 *
 * @version        1.0.0
 * @since          2010.07.03
 * @author         Washington Botelho
 * @documentation  wbotelhos.com/stepy
 * @twitter        twitter.com/wbotelhos
 *
 * Usage with default values:
 * ------------------------------------------------------------------------------------
 * $('#step').stepy();
 *
 *	<form id="step">
 *		<fieldset title="Step 1">
 *			<legend>description one</legend>
 *			<!-- input fields -->
 *		</fieldset>
 *
 *		<fieldset title="Step 2">
 *			<legend>description one</legend>
 *			<!-- input fields -->
 *		</fieldset>
 *
 *		<input type="submit" class="finish" value="Finish!"/>
 *	</form>
 *
 */

;(function($) {

    var methods = {
        init: function(options) {
            return this.each(function() {

                var opt		= $.extend({}, $.fn.stepy.defaults, options),
                    $this	= $(this).data('options', opt),
                    id		= $this.attr('id');

                if (id === undefined || id == '') {
                    id = 'stepy-' + $('.' + $this.attr('class')).index(this);
                    $this.attr('id', id);
                }

                var $titlesWrapper = $('<ul/>', { id: id + '-titles', 'class': 'stepy-titles' });

                if (opt.titleTarget) {
                    $(opt.titleTarget).html($titlesWrapper);
                } else {
                    $titlesWrapper.insertBefore($this);
                }

                if (opt.validate) {
                    jQuery.validator.setDefaults({ ignore: opt.ignore });

                    $this.append('<div class="stepy-error"/>');
                }

                var	$steps		= $this.children('fieldset'),
                    $step		= undefined,
                    $legend		= undefined,
                    description	= '',
                    title		= '';

                $steps.each(function(index) {
                    $step = $(this);

                    $step
                        .addClass('step')
                        .attr('id', id + '-step-' + index)
                        .append('<p id="' + id + '-buttons-' + index + '" class="' + id + '-buttons"/>');

                    $legend = $step.children('legend');

                    if (!opt.legend) {
                        $legend.hide();
                    }

                    description = '';

                    if (opt.description) {
                        if ($legend.length) {
                            description = '<span>' + $legend.html() + '</span>';
                        } else {
                            $.error(id + ': the legend element of the step ' + (index + 1) + ' is required to set the description!');
                        }
                    }

                    title = $step.attr('title');
                    title = (title != '') ? '<div>' + title + '</div>': '--';

                    $titlesWrapper.append('<li id="' + id + '-title-' + index + '">' + title + description + '</li>');

                    if (index == 0) {
                        if ($steps.length > 1) {
                            methods.createNextButton.call($this, index);
                        }
                    } else {
                        methods.createBackButton.call($this, index);

                        $step.hide();

                        if (index < $steps.length - 1) {
                            methods.createNextButton.call($this, index);
                        }
                    }
                });

                var $titles	= $titlesWrapper.children();

                $titles.first().addClass('current-step');

                var $finish = $this.children('.finish');

                if (opt.finishButton) {
                    if ($finish.length) {
                        var isForm		= $this.is('form'),
                            onSubmit	= undefined;

                        if (opt.finish && isForm) {
                            onSubmit = $this.attr('onsubmit');
                            $this.attr('onsubmit', 'return false;');
                        }

                        $finish.click(function(evt) {
                            if (opt.finish && !methods.execute.call($this, opt.finish, $steps.length - 1)) {
                                evt.preventDefault();
                            } else {
                                if (isForm) {
                                    if (onSubmit) {
                                        $this.attr('onsubmit', onSubmit);
                                    } else {
                                        $this.removeAttr('onsubmit');
                                    }

                                    var isSubmit = $finish.attr('type') == 'submit';

                                    if (!isSubmit && (!opt.validate || methods.validate.call($this, $steps.length - 1))) {
                                        $this.submit();
                                    }
                                }
                            }
                        });

                        $finish.appendTo($this.find('p:last'));
                    } else {
                        $.error(id + ': element with class name "finish" missing!');
                    }
                }

                if (opt.titleClick) {
                    $titles.click(function() {
                        var	array	= $titles.filter('.current-step').attr('id').split('-'), // TODO: try keep the number in an attribute.
                            current	= parseInt(array[array.length - 1], 10),
                            clicked	= $(this).index();

                        if (clicked > current) {
                            if (opt.next && !methods.execute.call($this, opt.next, clicked)) {
                                return false;
                            }
                        } else if (clicked < current) {
                            if (opt.back && !methods.execute.call($this, opt.back, clicked)) {
                                return false;
                            }
                        }

                        if (clicked != current) {
                            methods.step.call($this, (clicked) + 1);
                        }
                    });
                } else {
                    $titles.css('cursor', 'default');
                }

                $steps.delegate('input[type="text"], input[type="password"]', 'keypress', function(evt) {
                    var key = (evt.keyCode ? evt.keyCode : evt.which);

                    if (key == 13) {
                        evt.preventDefault();

                        var $buttons = $(this).parent().children('.' + id + '-buttons');

                        if ($buttons.length) {
                            var $next = $buttons.children('.button-next');

                            if ($next.length) {
                                $next.click();
                            } else {
                                var $finish = $buttons.children('.finish');

                                if ($finish.length) {
                                    $finish.click();
                                }
                            }
                        }
                    }
                });

                $steps.first().find(':input:visible:enabled').first().select().focus();
            });
        }, createBackButton: function(index) {
            var $this	= this,
                id		= this.attr('id'),
                opt		= this.data('options');

            $('<a/>', { id: id + '-back-' + index, href: 'javascript:void(0);', 'class': 'button-back', html: opt.backLabel }).click(function() {
                if (!opt.back || methods.execute.call($this, opt.back, index - 1)) {
                    methods.step.call($this, (index - 1) + 1);
                }
            }).appendTo($('#' + id + '-buttons-' + index));
        }, createNextButton: function(index) {
            var $this	= this,
                id		= this.attr('id'),
                opt		= this.data('options');

            $('<a/>', { id: id + '-next-' + index, href: 'javascript:void(0);', 'class': 'button-next', html: opt.nextLabel }).click(function() {
                if (!opt.next || methods.execute.call($this, opt.next, index + 1)) {
                    methods.step.call($this, (index + 1) + 1);
                }
            }).appendTo($('#' + id + '-buttons-' + index));
        }, execute: function(callback, index) {
            var isValid = callback.call(this, index + 1);

            return isValid || isValid === undefined;
        }, step: function(index) {
            index--;

            var $steps = this.children('fieldset');

            if (index > $steps.length - 1) {
                index = $steps.length - 1;
            }

            var opt = this.data('options');
            max	= index;

            if (opt.validate) {
                var isValid = true;

                for (var i = 0; i < index; i++) {
                    isValid &= methods.validate.call(this, i);

                    if (opt.block && !isValid) {
                        max = i;
                        break;
                    }
                }
            }

            $steps.hide().eq(max).show();

            var $titles	= $('#' + this.attr('id') + '-titles').children();

            $titles.removeClass('current-step').eq(max).addClass('current-step');

            if (this.is('form')) {
                var $fields = undefined;

                if (max == index) {
                    $fields = $steps.eq(max).find(':input:enabled:visible');
                } else {
                    $fields = $steps.eq(max).find('.error').select().focus();
                }

                $fields.first().select().focus();
            }

            if (opt.select) {
                opt.select.call(this, max + 1);
            }

            return this;
        }, validate: function(index) {
            if (!this.is('form')) {
                return true;
            }

            var $step		= this.children('fieldset').eq(index),
                isValid		= true,
                $title		= $('#' + this.attr('id') + '-titles').children().eq(index),
                opt			= this.data('options'),
                $validate	= this.validate();

            $($step.find(':input:enabled').get().reverse()).each(function() {
                var fieldIsValid = $validate.element($(this));

                if (fieldIsValid === undefined) {
                    fieldIsValid = true;
                }

                isValid &= fieldIsValid;

                if (isValid) {
                    if (opt.errorImage) {
                        $title.removeClass('error-image');
                    }
                } else {
                    if (opt.errorImage) {
                        $title.addClass('error-image');
                    }

                    $validate.focusInvalid();
                }
            });

            return isValid;
        }
    };

    $.fn.stepy = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist!');
        }
    };

    $.fn.stepy.defaults = {
        back:			undefined,
        backLabel:		'&lt; Back',
        block:			false,
        description:	true,
        errorImage:		false,
        finish:			undefined,
        finishButton:	true,
        legend:			true,
        ignore:			'',
        next:			undefined,
        nextLabel:		'Next &gt;',
        titleClick:		false,
        titleTarget:	undefined,
        validate:		false,
        select: 		undefined
    };

})(jQuery);


// mobile browsers detect
browserPlatform = {
    platforms: [
        { uaString:['symbian','midp'], cssFile:'symbian.css' }, // Symbian phones
        { uaString:['opera','mobi'], cssFile:'opera.css' }, // Opera Mobile
        { uaString:['msie','ppc'], cssFile:'ieppc.css' }, // IE Mobile <6
        { uaString:'iemobile', cssFile:'iemobile.css' }, // IE Mobile 6+
        { uaString:'webos', cssFile:'webos.css' }, // Palm WebOS
        { uaString:'Android', cssFile:'android.css' }, // Android
        { uaString:['BlackBerry','/6.0','mobi'], cssFile:'blackberry6.css' },	// Blackberry 6
        { uaString:['BlackBerry','/7.0','mobi'], cssFile:'blackberry7.css' },	// Blackberry 7+
        { uaString:'ipad', cssFile:'ipad.css' }, // iPad
        { uaString:['safari','mobi'], cssFile:'safari.css' } // iPhone and other webkit browsers
    ],
    options: {
        cssPath:'css/',
        mobileCSS:'allmobile.css'
    },
    init:function(){
        this.checkMobile();
        this.parsePlatforms();
        return this;
    },
    checkMobile: function() {
        if(this.uaMatch('mobi') || this.uaMatch('midp') || this.uaMatch('ppc') || this.uaMatch('webos')) {
            this.attachStyles({cssFile:this.options.mobileCSS});
        }
    },
    parsePlatforms: function() {
        for(var i = 0; i < this.platforms.length; i++) {
            if(typeof this.platforms[i].uaString === 'string') {
                if(this.uaMatch(this.platforms[i].uaString)) {
                    this.attachStyles(this.platforms[i]);
                    break;
                }
            } else {
                for(var j = 0, allMatch = true; j < this.platforms[i].uaString.length; j++) {
                    if(!this.uaMatch(this.platforms[i].uaString[j])) {
                        allMatch = false;
                    }
                }
                if(allMatch) {
                    this.attachStyles(this.platforms[i]);
                    break;
                }
            }
        }
    },
    attachStyles: function(platform) {
        var head = document.getElementsByTagName('head')[0], fragment;
        var cssText = '<link rel="stylesheet" href="' + this.options.cssPath + platform.cssFile + '" type="text/css"/>';
        var miscText = platform.miscHead;
        if(platform.cssFile) {
            if(document.body) {
                fragment = document.createElement('div');
                fragment.innerHTML = cssText;
                head.appendChild(fragment.childNodes[0]);
            } else {
                document.write(cssText);
            }
        }
        if(platform.miscHead) {
            if(document.body) {
                fragment = document.createElement('div');
                fragment.innerHTML = miscText;
                head.appendChild(fragment.childNodes[0]);
            } else {
                document.write(miscText);
            }
        }
    },
    uaMatch:function(str) {
        if(!this.ua) {
            this.ua = navigator.userAgent.toLowerCase();
        }
        return this.ua.indexOf(str.toLowerCase()) != -1;
    }
}.init();
// end mobile browsers detect

