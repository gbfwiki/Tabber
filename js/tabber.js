(function($) {
	$.fn.tabber = function() {
		return this.each(function() {
			// create tabs
			var $this = $(this),
			    tabContent = $this.children('.tabbertab'),
			    nav = $('<ul>').addClass('tabbernav');
			tabContent.each(function() {
				var anchor = $('<a>').text(this.title).attr('title', this.title).attr('href', 'javascript:void(0);');
				$('<li>').append(anchor).appendTo(nav);
			});
			$this.prepend(nav);

			/**
			 * Internal helper function for showing content
			 * @param  string title to show, matching only 1 tab
			 * @return true if matching tab could be shown
			 */
			function showContent(title) {
				var content = tabContent.filter('[title="' + title + '"]');
				if (content.length !== 1) return false;
				tabContent.hide();
				content.show();
				nav.find('.tabberactive').removeClass('tabberactive');
				nav.find('a[title="' + title + '"]').parent().addClass('tabberactive');
				return true;
			}
			// setup initial state
			var loc;
			if (mw.config.get("wgInternalRedirectTargetUrl")) {
				loc = decodeURI(mw.config.get("wgInternalRedirectTargetUrl").replace(/.+#/,'').replace(/\.([0-9A-F]{2})/g, "%$1"));
			}
			else {
				loc = decodeURI(location.hash.replace('#', '').replace(/\.([0-9A-F]{2})/g, "%$1"));
			}
			if ( loc == '' || !showContent(loc) ) {
				showContent(tabContent.first().attr('title'));
			}

			// Repond to clicks on the nav tabs
			nav.on('click', 'a', function(e) {
				var title = $(this).attr('title');
				e.preventDefault();
				location.hash = '#' + title;
				showContent( title );
				dispatchEvent(new CustomEvent('tabber:nav', {"detail": {"title": title}}));
			});

			$this.addClass('tabberlive');

			$(window).bind('hashchange', function(e) {
				var loc = decodeURI(location.hash.replace('#', '').replace(/\.([0-9A-F]{2})/g, "%$1"));
				if ( loc == '' ) {
					showContent(tabContent.first().attr('title'));
				}
				else {
					showContent( loc );
				}
			});
		});
	};
})(jQuery);

$(document).ready(function() {
	$('.tabber').tabber();
});
