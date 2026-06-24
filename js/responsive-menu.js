'use strict';

/**
 * Responsive menu that switches to mobile/compact mode when items don't fit in one row.
 * This checks if the menu items would wrap and adds a class to force mobile menu mode.
 */
(function responsiveMenu(document, window) {
    var menu = document.querySelector('.menu');
    var menuList = document.querySelector('.menu__list');
    var menuBtn = document.querySelector('.menu__btn');
    var headerRow = document.querySelector('.header__row');

    if (!menu || !menuList || !menuBtn) return;

    function checkMenuFit() {
        // Temporarily remove compact mode to measure natural width
        menu.classList.remove('menu--compact');
        
        // Force the menu to display as horizontal to measure
        var originalDisplay = menuBtn.style.display;
        var originalListPosition = menuList.style.position;
        var originalListVisibility = menuList.style.visibility;
        var originalListTransform = menuList.style.transform;
        
        // Temporarily show the list as horizontal to measure
        menuBtn.style.display = 'none';
        menuList.style.position = 'relative';
        menuList.style.visibility = 'visible';
        menuList.style.transform = 'none';
        menuList.style.display = 'flex';
        menuList.style.flexWrap = 'nowrap';
        
        // Get the logo width and available space
        var logo = document.querySelector('.logo');
        var logoWidth = logo ? logo.offsetWidth : 0;
        var headerWidth = headerRow ? headerRow.offsetWidth : window.innerWidth;
        var headerPadding = headerRow ? 
            parseInt(window.getComputedStyle(headerRow).paddingLeft) + 
            parseInt(window.getComputedStyle(headerRow).paddingRight) : 0;
        
        // Calculate available space for menu (with some buffer)
        var availableSpace = headerWidth - logoWidth - headerPadding - 40; // 40px buffer
        
        // Get the natural width of the menu items
        var menuWidth = menuList.scrollWidth;
        
        // Reset styles
        menuBtn.style.display = originalDisplay;
        menuList.style.position = originalListPosition;
        menuList.style.visibility = originalListVisibility;
        menuList.style.transform = originalListTransform;
        menuList.style.display = '';
        menuList.style.flexWrap = '';
        
        // If menu doesn't fit, add compact class
        if (menuWidth > availableSpace) {
            menu.classList.add('menu--compact');
        } else {
            menu.classList.remove('menu--compact');
        }
    }

    // Check on load
    checkMenuFit();
    
    // Check on resize with debounce
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkMenuFit, 100);
    });

    // Also check after fonts load
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(checkMenuFit);
    }
}(document, window));
