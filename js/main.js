/*

	Main.js

	01. Menu toggle
	02. Top bar height effect
	03. Home content slider
	04. Home background slider
	05. Home background and content slider
	06. Quote slider
	07. Image slider
	08. Services slider
	09. Employee slider
	10. Work slider
	11. Footer promo
	12. Contact form
	13. Scrollto
	14. Magnific popup
	15. Equal height
	16. fitVids

*/


(function(){
	"use strict";

	/* ==================== 01. Menu toggle ==================== */
	$(function(){
		$('#toggle').click(function (e){
			e.stopPropagation();
		});
		$('html').click(function (e){
			if (!$('.toggle').is($(e.target))){
				$('#toggle').prop("checked", false);
			}
		});
	});

	/* ==================== 02. Top bar height effect ==================== */
	$(window).bind("scroll", function() {
		if ($(this).scrollTop() > 100) {
			$(".top-bar").removeClass("tb-large").addClass("tb-small");
		} else {
			$(".top-bar").removeClass("tb-small").addClass("tb-large");
		}
	});

	/* ==================== 03. Home content slider ==================== */
	$('.home-c-slider').bxSlider({
		mode: 'horizontal',
		pager: false,
		controls: true,
		nextText: '<i class="bs-right fa fa-angle-right"></i>',
		prevText: '<i class="bs-left fa fa-angle-left"></i>'
	});

	/* ==================== 04. Home background slider ==================== */
	$('.home-bg-slider').bxSlider({
		mode: 'fade',
		auto: true,
		speed: 1000,
		pager: false,
		controls: false,
		nextText: '<i class="bs-right fa fa-angle-right"></i>',
		prevText: '<i class="bs-left fa fa-angle-left"></i>'
	});

	/* ==================== 05. Home background and content slider ==================== */
	$('.home-bgc-slider').bxSlider({
		mode: 'fade',
		pager: true,
		controls: true,
		nextText: '<i class="bs-right fa fa-angle-right"></i>',
		prevText: '<i class="bs-left fa fa-angle-left"></i>'
	});

	/* ==================== 06. Quote slider ==================== */
	$('.quote-slider').bxSlider({
		mode: 'horizontal',
		controls: false,
		adaptiveHeight: true
	});

	/* ==================== 07. Image slider ==================== */
	$('.img-slider').bxSlider({
		mode: 'fade',
		pager: false,
		controls: true,
		nextText: '<i class="bs-right fa fa-angle-right"></i>',
		prevText: '<i class="bs-left fa fa-angle-left"></i>'
	});

	/* ==================== 08. Services slider ==================== */
	$(function() {
	 
		var owl = $(".services-slider");
		
		owl.owlCarousel({
			pagination: false,
			navigation: false,
			items: 4,
			itemsDesktop: [1000,3],
			itemsTablet: [600,2],
			itemsMobile: [321,1]
		});
		
		// Custom navigation
		$(".serv-next").click(function(){
			owl.trigger('owl.next');
		})
		$(".serv-prev").click(function(){
			owl.trigger('owl.prev');
		})
	 
	});

	/* ==================== 09. Employee slider ==================== */
	$(function() {
	 
		var owl = $(".employee-slider");
		
		owl.owlCarousel({
			pagination: false,
			navigation: false,
			items: 4,
			itemsDesktop: [1000,3],
			itemsTablet: [600,2],
			itemsMobile: [321,1]
		});
		
		// Custom navigation
		$(".emp-next").click(function(){
			owl.trigger('owl.next');
		})
		$(".emp-prev").click(function(){
			owl.trigger('owl.prev');
		})
	 
	});

	/* ==================== 10. Work slider ==================== */
	$(function() {
	 
		var owl = $(".work-slider");
		
		owl.owlCarousel({
			pagination: false,
			navigation: false,
			items: 3,
			itemsDesktop: [1000,3],
			itemsTablet: [600,2],
			itemsMobile: [321,1]
		});
		
		// Custom navigation
		$(".work-next").click(function(){
			owl.trigger('owl.next');
		})
		$(".work-prev").click(function(){
			owl.trigger('owl.prev');
		})
	 
	});

	/* ==================== 11. Footer promo ==================== */
	$('.promo-control').click(function () {
		$('.footer-promo').slideToggle(500);
		if($('.footer-promo').is(':visible')){
			$('html, body').animate({
				scrollTop: $('.footer-promo').offset().top
			}, 500);
		}
	});

	/* ==================== 12. Contact form ==================== */
	$(function(){

		$('#contactform').submit(function(){

			var action = $(this).attr('action');

			$('#message').slideUp(300,function() {
			$('#message').hide();

			$('#submit')
				.after('<img src="images/loader.gif" class="loader">')
				.attr('disabled','disabled');

			$.post(action, {
				name: $('#name').val(),
				email: $('#email').val(),
				phone: $('#phone').val(),
				subject: $('#subject').val(),
				comments: $('#comments').val(),
				verify: $('#verify').val()
			},
				function(data){
					document.getElementById('message').innerHTML = data;
					$('#message').slideDown(300);
					$('#contactform img.loader').fadeOut(300,function(){$(this).remove()});
					$('#submit').removeAttr('disabled');
					if(data.match('success') != null) $('#contactform').slideUp(300);
				}
			);

			});

			return false;

		});

	});

	/* ==================== 13. Scrollto ==================== */
	$(function(){
		$('.scrollto').bind('click.scrollto',function (e){
			e.preventDefault();

			var target = this.hash,
			$target = $(target);

			$('html, body').stop().animate({
				'scrollTop': $target.offset().top-0
			}, 900, 'swing', function () {
				window.location.hash = target;
			});
		});
	});

	/* ==================== 14. Magnific popup ==================== */
	// Image popup
	$('.popup').magnificPopup({ 
		type: 'image',
		fixedContentPos: false,
		fixedBgPos: false,
		removalDelay: 300,
		mainClass: 'mfp-fade'
	});

	// YouTube, Vimeo and Google Maps popup
	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		fixedContentPos: false,
		fixedBgPos: false,
		removalDelay: 300,
		mainClass: 'mfp-fade',
		preloader: false
	});

	// Gallery popup - Use this class to create a gallery where every thumbnail or link is visible
	$('.popup-gallery').magnificPopup({
		type: 'image',
		gallery:{
			enabled:true
		},
		fixedContentPos: false,
		fixedBgPos: false,
		removalDelay: 300,
		mainClass: 'mfp-fade'
	});

	// Gallery link - Use the gallery-link to create a link to a gallery
	$('.gallery-link').on('click', function () {
		$(this).next().magnificPopup('open');
	});

	// Gallery - Add every image you want to become visible in a popup inside a div with the gallery class
	$('.gallery').each(function () {
		$(this).magnificPopup({
			delegate: 'a',
			type: 'image',
			gallery: {
				enabled: true,
				navigateByImgClick: true
			},
			fixedContentPos: false,
			fixedBgPos: false,
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
	});

	/* ==================== 15. Equal height ==================== */
	/* Use the .equal class on a row if you want the columns to be equal in height */
	$('.equal').children('.col').equalizeHeight();
	$( window ).resize( function() {
		$( '.equal' ).children( '.col' ).equalizeHeight();
		setTimeout( function() {
			$( '.equal' ).children( '.col' ).equalizeHeight();
		}, 100 );
		setTimeout( function() {
			$( '.equal' ).children( '.col' ).equalizeHeight();
		}, 400 );
		setTimeout( function() {
			$( '.equal' ).children( '.col' ).equalizeHeight();
		}, 1400 );
		setTimeout( function() {
			$( '.equal' ).children( '.col' ).equalizeHeight();
		}, 2400 );
	});
	setTimeout( function() {
			$( window ).trigger( 'resize scroll' );
	}, 1000 );
	setTimeout( function() {
			$( window ).trigger( 'resize scroll' );
	}, 3000 );
	$( window ).load( function() {
		$( '.equal' ).children( '.col' ).equalizeHeight();
		$( window ).trigger( 'resize scroll' );
		setTimeout( function() {
			$( '.equal' ).children( '.col' ).equalizeHeight();
		}, 1000 );
		setTimeout( function() {
			$( '.equal' ).children( '.col' ).equalizeHeight();
		}, 1300 );
	});

	/* ==================== 16. fitVids ==================== */
	$(".responsive-video").fitVids();


})(jQuery);