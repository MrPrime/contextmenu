# An Amazing ContextMenu Widget based on jQuery 1.7+
> support IE8+ and other modern browsers 

### how to use

let's say you have a `div.right-click` in `body` tag

```html
<div class="right-click">
	right click me, show up the ContextMenu
</div> 
```

### options 

**selector** : use css selector to target dom elements

```js
selector: '.right-click'
```

**callback** : a callback which will be called when you click one menu item

```js
callback : function(cmd, options) {
	// your code here...
} 
```

**items** : plain object array to define your menu items

```js
[{
	text: 'adjust font size',   // menu item text
	disabled: false,      		// default false if not defined
	cmd: 'ad_fs',
	title: 'adjust font size to fit your eyes',
	items: [{
		text: 'large size',
		cmd: 'fs_16px'
	}, {
		text: 'normal size',
		cmd: 'fs_13px'
	}, {
		text: 'small size',
		cmd: 'fs_10px'
	}]          
}, {
	// this menu item is a link
	text: 'link to home',	
	url: 'https://github.com/MrPrime/ContextMenu',
	target: '_blank',
	cmd: 'link_to_home',
	icon: 'images/home.gif'	    // icon for the item
}] 
```
*note* : 
- `cmd`: should be unique for each item
- `disabled: true` means the item will be unclickable, as for a submenu, mouseover the submenu title will not show up its child items

### public methods

**disableItem** :

```js
// cm is an instance of ContextMenu
var cm = new ContextMenu({
	.... // options	
});

cm.disableItem('ad_fs');  // disable "adjust font size" submenu
```

**enableItem** :

```js
cm.enableItem('ad_fs');  // enable "adjust font size" submenu
```

**updateItem** :

```js
cm.updateItem('fs_10px', {
	text: 'small size disabled',
	disabled: true
});
```

**destroy** :

```js
cm.destroy();   // distroy the instance
```

look, it's very easy to use, I hope you will enjoy it : ) 

*demo.html* will show you more details, and the source code is not complicated at all, so go ahead to expand your methods as you like. 


