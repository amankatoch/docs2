/**
 * Created by rollandsafort on 12/13/14.
 */

//bbq history script

// Be sure to bind to the "hashchange" event on document.ready, not
// before, or else it may fail in IE6/7. This limitation may be
// removed in a future revision.
var masterPageStatus = false;

$(function(){



    // Override the default behavior of all `a` elements so that, when
    // clicked, their `href` value is pushed onto the history hash
    // instead of being navigated to directly.



    // Bind a callback that executes when document.location.hash changes.
    // following was done 3 times in 3 different places, it is done in util now
//    $(window).bind( "hashchange", function(e) {
//        // In jQuery 1.4, use e.getState( "url" );
//        var url = $.param.fragment();
//        var urlsplit = url.split('/');
//        // alert(url);
//
//
//
//        if (urlsplit.length >3){
//            $.getScript(url +'.js');
//        }
//
//        else if (url == '/workspace/welcome'){
//
//            $.getScript('/workspace/welcome/master.js');
//        }
//        else if (url =='/home/userRegistration'){
//            $.getScript('/home/userRegistration.js')
//        }
//
//
//        else if (urlsplit[1] == 'publishing'){
//            // $.getScript('/publishing/publishing.js')
//        }
//
//
//
//
//    });

    // Since the event is only triggered when the hash changes, we need
    // to trigger the event now, to handle the hash the page may have
    // loaded with.
    $(window).trigger( "hashchange" );

});// JavaScript Document




//end of bbq history script