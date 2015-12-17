var pages = [
	{"id" : "pageChicken", "title" : "Chicken", "icon" : "img/chicken/chicken-eating-grass.jpg",
		"pics" : [ 
			{ "src" : "http://anonymous-pinkas.rhcloud.com/img/chicken/chicken-growth.jpg", "detailsText" : "Little chick grows fast" },
			{ "src" : "http://anonymous-pinkas.rhcloud.com/badddddddImg.jpg", "detailsText" : "Little chick grows fast" },
			{ "src" : "http://anonymous-pinkas.rhcloud.com/img/chicken/battery-cages.jpg", "detailsText" : "Battery cages are hell" }
		]
	},
	{"id" : "pageCow","title" : "Cow", "icon" : "img/cow/pasture-cow.jpg",
		"pics" : [
			{ "src" : "http://anonymous-pinkas.rhcloud.com/img/cow/pasture-cow.jpg", "detailsText" : "Cow in nature" }
		]
	}, 
	{"id" : "pagePuppy","title" : "Puppy", "icon" : "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg",
		"pics" : [
			{ "src" : "http://media.mydogspace.com.s3.amazonaws.com/wp-content/uploads/2013/08/puppy-500x350.jpg", "detailsText" : "This is a puppy" }
		]
	}, 
	{"id" : "pagePig","title" : "pig", "icon" : "img/pig/pig-meadow.jpg",
		"pics" : []
	}, 
	{"id" : "pageEnv","title" : "Environment", "icon" : "img/env/sick-earth.jpg",
		"pics" : []
	},
	{"id" : "pageHealth","title" : "Health", "icon" : "img/health/veg-heart.jpg",
		"pics" : []
	}  
];

var mainCategoriesInited = false;

$.each( pages, function(i, page){
	page["next"] = pages[ nextInd(pages, i) ];
	page["prev"] = pages[ prevInd(pages, i) ];
});

//allow dynamic content
$(document).bind( "pagebeforechange", function( e, data ) {

	if ( data.toPage.attr != undefined && data.toPage.attr("id") == "pageMain" ){
		var u = $.mobile.path.parseUrl( data.toPage )
		showMainPage( u, data.options, e )
		return;
	}

	// We only want to handle changePage() calls where the caller is
	// asking us to load a page by URL.	
	if ( typeof data.toPage === "string" ) {

		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// category.
		var u = $.mobile.path.parseUrl( data.toPage );
		//var re = /^#category-item/;
		var re = /^#page/;

		if ( u.hash.search(re) !== -1 ) {
			showCategory( u, data.options, e );
		}
	}
});

function showMainPage( urlObj, options, e ) {
	if ( !mainCategoriesInited ){
		$.each( pages, function(ind, page){
			//link in main page
			//$( "#mainButtonGroup" ).append('<a href="#' + page.id + '" class="ui-btn">' + page.title + '</a>');
			$( "#mainButtonGroup" ).append('<div class="main-category-image"><div class="boxInner"><a href="#' + page.id + '" class="ui-btn main-page-icons" ><img src="' + page.icon + '"/></a></div></div>');
		});
		mainCategoriesInited = true;
	}

	//$.mobile.changePage( "#pageMain", options );
	// Make sure to tell changePage() we've handled this call so it doesn't
	// have to do anything.		
	//e.preventDefault();
}

function showCategory( urlObj, options, e ) {
	//var pageId = urlObj.hash.replace( /.*page/, "page" );
	var pageId = urlObj.hash.replace( /#/, "" );
	
	var page = findPageById(pageId);

		// The pages we use to display our content are already in
		// the DOM. The id of the page we are going to write our
		// content into is specified in the hash before the '?'.
		//pageSelector = urlObj.hash.replace( /\?.*$/, "" );

	if ( page && $("#"+pageId).length == 0  ) {
		$('body').append('<div data-role="page" id="'+pageId+'"></div>');
		var pageElem = $('#'+ page.id);
		
		var header = $('<div data-role="header" data-position="fixed"></div>');
		var navbar = $('<div data-role="navbar"></div>');
		var ul = $('<ul></ul>');
		header.append(navbar);
		navbar.append(ul);
		//var ul = navBar.children(0).children(0);
		ul.append( $('<li><a href="#'+page.prev.id+'" class="ui-btn-icon-left ui-icon-carat-l">'+page.prev.title+'</a></li>') );
		ul.append( $('<li><a href="index.html" class="ui-btn ui-icon-home ui-btn-icon-left">Home</a></li>') );	
		ul.append( $('<li><a href="#" class="ui-btn-icon-left ui-icon-search">Search</a></li>') );
		ul.append( $('<li><a href="#'+page.next.id+'" class="ui-btn-icon-right ui-icon-carat-r">'+page.next.title+'</a></li>') );
		
		//var contentElem = pageElem.children(0);
		var contentElem = $('<div data-role="main" class="ui-content"></div>');
		for(var i=0; i<page.pics.length; i++ ){
			var pic = page.pics[i];
			Cache.appendPic( pic.src, contentElem, true );
			//	contentElem.append('<img src="'+picSrc+'" class="content-item"/>');
		}
		
		pageElem.append(header);
		pageElem.append(contentElem);

		initSwipePages();
		
		options.dataUrl = urlObj.href;
		//$.mobile.changePage( pageElem, options );
				
		// Make sure to tell changePage() we've handled this call so it doesn't
		// have to do anything.		
		//e.preventDefault();
		/*
		// Get the page we are going to dump our content into.		
		var pageElem = $( pageSelector ),

		// Get the header for the page.
		$header = pageElem.children( ":jqmData(role=header)" ),

		// Get the content area element for the page.
		$content = pageElem.children( ":jqmData(role=content)" ),

		// The markup we are going to inject into the content
		// area of the page.
		markup = "<p>" + category.description + "</p><ul data-role='listview' data-inset='true'>",

		// The array of items for this category.
		cItems = category.items,

		// The number of items in the category.
		numItems = cItems.length;

		// Generate a list item for each item in the category
		// and add it to our markup.
		for ( var i = 0; i < numItems; i++ ) {
			markup += "<li>" + cItems[i].name + "</li>";
		}
		markup += "</ul>";

		// Find the h1 element in our header and inject the name of
		// the category into it.
		$header.find( "h1" ).html( category.name );

		// Inject the category items markup into the content element.
		$content.html( markup );

		// Pages are lazily enhanced. We call page() on the page
		// element to make sure it is always enhanced before we
		// attempt to enhance the listview markup we just injected.
		// Subsequent calls to page() are ignored since a page/widget
		// can only be enhanced once.
		pageElem.page();

		// Enhance the listview we just injected.
		$content.find( ":jqmData(role=listview)" ).listview();

		// We don't want the data-url of the page we just modified
		// to be the url that shows up in the browser's location field,
		// so set the dataUrl option to the URL for the category
		// we just loaded.
		options.dataUrl = urlObj.href;

		// Now call changePage() and tell it to switch to
		// the page we just modified.
		$.mobile.changePage( pageElem, options );
		*/
	}
}



// init links in main page
$.each( pages, function(ind, page){
	//link in main page
	$( "#mainButtonGroup" ).append('<a href="#' + page.id + '" class="ui-btn">aaaa' + page.title + '</a>');
	
	//div of actual page
	//$( "body" ).append( buildPage(page) );
	//$.mobile.initializePage();
});
$( "#mainButtonGroup" ).append('<a href="#aaaa" class="ui-btn">aaaa</a>');	

/* 
// init swipe
$( "#pageMain" ).on( "pagecontainerload", function( event, ui ) {
	initSwipePages();
} );

 */


 
function initSwipePages(){
	$.each( pages, function(ind, page){
		
		//init swipe events
		var pageId = "#"+pages[ind].id;
		$( document).on( "pagecreate", pageId , function() {
			
			$(pageId).on("swipeleft",function( event ){
				//brings user to next page on swipe.
				$.mobile.changePage("#" + page.next.id);
			});
			$(pageId).on("swiperight",function( event ){
				//brings user to next page on swipe.
				$.mobile.changePage("#" + page.prev.id);
			});
			
		});
		
	});
} 


function findPageById(id){
	for (var i=0; i< pages.length; i++){
		if ( pages[i].id == id){
			return pages[i];
		}
	}
	return null;
}

function nextInd(arr, i){
	return i == arr.length-1 ? 0 : i+1;
}

function prevInd(arr, i){
	return i == 0 ? arr.length-1 : i-1;
}
