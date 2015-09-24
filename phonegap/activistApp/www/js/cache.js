
var Cache = {
	inited : false,
	
	init : function(){
		// write log to console
		ImgCache.options.debug = true;
		// increase allocated space on Chrome to 50MB, default was 10MB
		ImgCache.options.chromeQuota = 50*1024*1024;
		// actually save files to storage (?)
		ImgCache.options.usePersistentCache = true;
		// cache folder
		ImgCache.options.localCacheFolder = 'Activist';
		
		ImgCache.init()
		Cache.inited = true;
	},

	/**
	 * 1. if file is cached - return url for cached file
	 * 2. if downloadIfAbscent == true and network access is available:
	 * 2.1. try to download and cache file 
	 * 2.2. if file cached successfully - return cached file url
	 * 3. return an ampty string
	 */
	appendPic : function( url, parentElem, downloadIfAbscent ){
		//default is downloadIfAbscent==false
		downloadIfAbscent = typeof downloadIfAbscent !== 'undefined' ? downloadIfAbscent : false;
		
		//if not inited - either we have a bug, or we are running in a browser
		if ( !this.inited ){
			console.log("Called to Cache.getPicSrc() before Cache.init() was called. That means we are running in a browser - we return url as is: " + url);
			//return url;
			return "";
		}
		
		var getCacheFunc = function(img_src, file_entry){
			if(file_entry === null){
				console.log("could not get cached file "+img_src+" from cache. Trying to get it and add it to cache");
				if ( downloadIfAbscent ){
					console.log("could not cache file "+img_src+". Trting to cache it now.");
					//ImgCache.cacheFile(url, cacheFileSuccess, cacheFileFail);
					ImgCache.cacheFile(url, 
						function(){
							console.log("successfully cached file "+img_src+", now appending it");
							ImgCache.getCachedFile(url, getCacheAfterFetchedFunc);
						}
						,
						function(){
							console.log("could not cache file "+img_src+", ignoring it");
						}
					);
				} else {
					console.log("could not get file "+img_src+" from cache. Ignoring it");
				}
			} else {
				console.log("got file "+img_src+" from cache: " + file_entry);
				//if file is cached - add element with cached file
				appendImg(parentElem, img_src);
			}
			
		};
		
		var getCacheAfterFetchedFunc = function(img_src, file_entry){
			if(file_entry===null){
				console.log("for some reasone, failed to get file "+img_src+" after it was cached");
			} else {
				console.log("got file "+img_src+" after it was cached");
				appendImg(parentElem, img_src);
			}			
		}
		
		/* var cacheFileSuccess = function(img_src, file_entry){
			console.log("successfully cached file "+img_src+", now appending it");
			//if file is cached - add element with cached file
			appendImg(parentElem, file_entry);
		};
		
		var cacheFileFail = function(img_src, file_entry){
			console.log("could not cache file "+img_src+", ignoring it");
		}; */
		
		var appendImg = function(parentElem, img_src){
			var target = $('<img src="'+img_src+'" class="content-item"/>');
			parentElem.append( target );
			ImgCache.useCachedFile(target)
		}
		
		ImgCache.getCachedFile(url, getCacheFunc);
	},
	
	clearRefresh: function(){
		ImgCache.clearCache();
		this.refresh();
	},

	refresh : function (){
		ImgCache.init()
	}
}


//init when doc is ready
if (typeof(cordova) !== 'undefined') {
	// cordova test
	document.addEventListener('deviceready', Cache.init, false);
} else {
	// normal browser test
	$(document).ready( Cache.init );
}
