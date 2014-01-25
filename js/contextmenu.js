(function(win, $) {
    // menu item template
    var btnTmpl = '<a class="cm-btn {disabled}" data-cmd="{cmd}" href="{url}" target="{target}" title="{title}">' + 
						'<img src="{icon}" class="cm-btn-icon" alt="">' + 
						'<span class="cm-btn-text">{text}</span>' + 
					'</a>',

    	itemTmpl = '<li class="cm-item">' + btnTmpl + '</li>',

		sepTmpl = '<li class="sep cm-item"></li>',

		submenuTempl = '<li class="cm-item has-menu">' + 
							btnTmpl + 
							'<ul class="menu sub-menu ui-hidden">' + 
								'{submenu}' + 
							'</ul>' + 		
						'</li>';

	var noIconBase64 = 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw=='					
	
	// default menu button settings
	var defaultItemSetting = {
		icon: noIconBase64,
		cmd: 'unnamed-command',
		title: '',
		url: 'javascript:',
		target: ''
	};
    
    // mini template engine: {variable}
	var render = function(tpl, data) {
		var re = /{([^}]+)?}/g;
	    
	    while(match = re.exec(tpl)) {
	        tpl = tpl.replace(match[0], data[match[1]])
	    }
	    
	    return tpl;
	};

	// render menu items
	var buildMenu = function(items) {
		var tmpArr = [];

		$.each(items, function(index, item) {
			if( item == 'sep' ) {
				tmpArr.push(sepTmpl);
				return true;	
			}  
			
			var v = $.extend({}, defaultItemSetting, item);
			v.disabled = v.disabled === true ? 'cm-btn-disabled' : 'cm-btn-default';

			if(v.items && v.items.length) {
				tmpArr.push( render(submenuTempl, $.extend(v, {
					submenu: buildMenu(v.items)
				})) );
			} else {
				tmpArr.push( render(itemTmpl, v) );
			}
		});

		return tmpArr.join('');
	};

    win.ContextMenu = function(cfg) {
        this.cfg = cfg;  
        this._init();
    };
    
    ContextMenu.prototype = {
        constructor: ContextMenu,
        
        _init: function() {
        	this._initView();
        	this._initEvents();
        },

        _initView: function() {
        	var c = this.cfg,
        		html = [];

        	html.push('<div class="ui-context-menu ui-hidden">');
        	html.push('<ul class="menu">');
        	html.push(buildMenu(c.items));
        	html.push('</ul>');
        	html.push('</div>');

			this.$contextMenu = $(html.join('')).appendTo('body');
        },

        // hide context menu 
        hide: function() {
        	var $cm = this.$contextMenu;

        	$cm.addClass('ui-hidden');
        	$cm.find('ul.sub-menu').addClass('ui-hidden');
        },

        _initEvents: function() {
        	var c = this.cfg,
        		$cm = this.$contextMenu,
        		self = this;

        	$cm.on('click', 'a[data-cmd]', function(event) {
        		var $btn = $(this),
        			$p = $btn.parent(),
        			cmd = this.getAttribute('data-cmd');
        			
        		if( $p.hasClass('has-menu') || $btn.hasClass('cm-btn-disabled') ) return false;
        		
        		self.hide();
        		
        		$.proxy(c.callback, self, cmd, c)();
        	}); 

        	$cm.find('.has-menu').on('mouseenter mouseleave', function(event) {
        		var $li = $(this),
        			$a = $li.find('> a.cm-btn'),
        			$sub = $li.find('> ul.sub-menu'),

        			l = $li.width() - 2;

        		if($a.hasClass('cm-btn-disabled')) return false;

        		if( event.type == 'mouseenter' ) {
        			$sub.removeClass('ui-hidden').css({
        				left: l
        			});
        		} else {
        			$sub.addClass('ui-hidden');
        		}
        	});

        	// prevent default context menu and pupup custome one
        	var popupHandler = function(event) {
       	 		event.preventDefault();
				
				if(event.which == 3) {
					$cm.css({
        				left: event.pageX + 'px',
        				top: event.pageY + 'px'
        			}).removeClass('ui-hidden');
				}

				return false;
			};

			c.selector ? 
				$('body').on('contextmenu', c.selector, popupHandler) :
				$('body').on('contextmenu', popupHandler);

			// auto hide
			$('body').on('click', function(event) {
				var t = event.target;

				if(!$.contains($cm[0], t)) $cm.addClass('ui-hidden');
			});
        },

        // not for menu items only used to show up submenu
        updateItem: function(cmd, data) {
        	var $btn = this.$contextMenu.find('[data-cmd="' + cmd + '"]'),
                prop, val;

            if($btn.length) {
                for(prop in data) {
                    val = data[prop];

                    switch (prop) {
                        case 'icon':
                            $btn.find('> img.cm-btn-icon')[0].src = val; break;
                        case 'text':
                            $btn.find('> span.cm-btn-text')[0].innerHTML = val; break;
                        case 'title':
                            $btn.attr(prop, val); break;
                        case 'url':
                            $btn.attr('href', val); break;
                        case 'target':
                            $btn.attr('target', val); break;
                        case 'cmd': 
                            $btn.attr('data-cmd', val); break;
                        case 'disabled':
                            val ? this.disableItem(cmd) : this.enableItem(cmd);
                    }
                }
            }
        },

        disableItem: function(cmd) {
        	var $btn = this.$contextMenu.find('[data-cmd="' + cmd + '"]');

        	$btn.length && $btn.removeClass('cm-btn-default cm-btn-active').addClass('cm-btn-disabled');
        },

        enableItem: function(cmd) {
        	var $btn = this.$contextMenu.find('[data-cmd="' + cmd + '"]');

        	$btn.length && $btn.removeClass('cm-btn-disabled cm-btn-active').addClass('cm-btn-default');
        },

        // highlight menu item
        highlightItem: function(cmd) {
        	var $cm = this.$contextMenu,
        		$active = $cm.find('a.cm-btn-active'),
        		$btn = $cm.find('[data-cmd="' + cmd + '"]');

        	$active.length && $active.removeClass('cm-btn-active').addClass('cm-btn-default');

        	$btn.length && !$btn.hasClass('cm-btn-disabled') 
        		&& $btn.removeClass('cm-btn-default').addClass('cm-btn-active');  
        },

        destroy: function() {
        	this.$contextMenu.remove();
        }
    };
}(this, jQuery));