(function($) {
    function initSwiper() {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: false,
            // direction: 'vertical',
            // autoplay: 1000,
            effect: 'slide', //Could be "slide", "fade", "cube" or "coverflow"
            loop: true,
            onSlideChangeEnd: function(s) {
                // console.log(s.activeIndex);
            }
        });
    }

    initSwiper();
})(jQuery);
