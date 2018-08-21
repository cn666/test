///<jscompress sourcefile="jquery.js" />
/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
    var
        // A central reference to the root jQuery(document)
        rootjQuery,

        // The deferred used on DOM ready
        readyList,

        // Use the correct document accordingly with window argument (sandbox)
        document = window.document,
        location = window.location,
        navigator = window.navigator,

        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
        _$ = window.$,

        // Save a reference to some core methods
        core_push = Array.prototype.push,
        core_slice = Array.prototype.slice,
        core_indexOf = Array.prototype.indexOf,
        core_toString = Object.prototype.toString,
        core_hasOwn = Object.prototype.hasOwnProperty,
        core_trim = String.prototype.trim,

        // Define a local copy of jQuery
        jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init( selector, context, rootjQuery );
        },

        // Used for matching numbers
        core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

        // Used for detecting and trimming whitespace
        core_rnotwhite = /\S/,
        core_rspace = /\s+/,

        // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

        // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return ( letter + "" ).toUpperCase();
        },

        // The ready event handler and self cleanup method
        DOMContentLoaded = function() {
            if ( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                jQuery.ready();
            } else if ( document.readyState === "complete" ) {
                // we're here because readyState === "complete" in oldIE
                // which is good enough for us to call the dom ready!
                document.detachEvent( "onreadystatechange", DOMContentLoaded );
                jQuery.ready();
            }
        },

        // [[Class]] -> type pairs
        class2type = {};

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function( selector, context, rootjQuery ) {
            var match, elem, ret, doc;

            // Handle $(""), $(null), $(undefined), $(false)
            if ( !selector ) {
                return this;
            }

            // Handle $(DOMElement)
            if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }

            // Handle HTML strings
            if ( typeof selector === "string" ) {
                if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [ null, selector, null ];

                } else {
                    match = rquickExpr.exec( selector );
                }

                // Match html or make sure no context is specified for #id
                if ( match && (match[1] || !context) ) {

                    // HANDLE: $(html) -> $(array)
                    if ( match[1] ) {
                        context = context instanceof jQuery ? context[0] : context;
                        doc = ( context && context.nodeType ? context.ownerDocument || context : document );

                        // scripts is true for back-compat
                        selector = jQuery.parseHTML( match[1], doc, true );
                        if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                            this.attr.call( selector, context, true );
                        }

                        return jQuery.merge( this, selector );

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById( match[2] );

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id !== match[2] ) {
                                return rootjQuery.find( selector );
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if ( !context || context.jquery ) {
                    return ( context || rootjQuery ).find( selector );

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor( context ).find( selector );
                }

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if ( jQuery.isFunction( selector ) ) {
                return rootjQuery.ready( selector );
            }

            if ( selector.selector !== undefined ) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray( selector, this );
        },

        // Start with an empty selector
        selector: "",

        // The current version of jQuery being used
        jquery: "1.8.2",

        // The default length of a jQuery object is 0
        length: 0,

        // The number of elements contained in the matched element set
        size: function() {
            return this.length;
        },

        toArray: function() {
            return core_slice.call( this );
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {
            return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                ( num < 0 ? this[ this.length + num ] : this[ num ] );
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function( elems, name, selector ) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge( this.constructor(), elems );

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            ret.context = this.context;

            if ( name === "find" ) {
                ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
            } else if ( name ) {
                ret.selector = this.selector + "." + name + "(" + selector + ")";
            }

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function( callback, args ) {
            return jQuery.each( this, callback, args );
        },

        ready: function( fn ) {
            // Add the callback
            jQuery.ready.promise().done( fn );

            return this;
        },

        eq: function( i ) {
            i = +i;
            return i === -1 ?
                this.slice( i ) :
                this.slice( i, i + 1 );
        },

        first: function() {
            return this.eq( 0 );
        },

        last: function() {
            return this.eq( -1 );
        },

        slice: function() {
            return this.pushStack( core_slice.apply( this, arguments ),
                "slice", core_slice.call(arguments).join(",") );
        },

        map: function( callback ) {
            return this.pushStack( jQuery.map(this, function( elem, i ) {
                return callback.call( elem, i, elem );
            }));
        },

        end: function() {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };

// Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        noConflict: function( deep ) {
            if ( window.$ === jQuery ) {
                window.$ = _$;
            }

            if ( deep && window.jQuery === jQuery ) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                jQuery.readyWait++;
            } else {
                jQuery.ready( true );
            }
        },

        // Handle when the DOM is ready
        ready: function( wait ) {

            // Abort if there are pending holds or we're already ready
            if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
                return;
            }

            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready, 1 );
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith( document, [ jQuery ] );

            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger("ready").off("ready");
            }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function( obj ) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function( obj ) {
            return jQuery.type(obj) === "array";
        },

        isWindow: function( obj ) {
            return obj != null && obj == obj.window;
        },

        isNumeric: function( obj ) {
            return !isNaN( parseFloat(obj) ) && isFinite( obj );
        },

        type: function( obj ) {
            return obj == null ?
                String( obj ) :
            class2type[ core_toString.call(obj) ] || "object";
        },

        isPlainObject: function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if ( obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                    return false;
                }
            } catch ( e ) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for ( key in obj ) {}

            return key === undefined || core_hasOwn.call( obj, key );
        },

        isEmptyObject: function( obj ) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        },

        error: function( msg ) {
            throw new Error( msg );
        },

        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // scripts (optional): If true, will include scripts passed in the html string
        parseHTML: function( data, context, scripts ) {
            var parsed;
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            if ( typeof context === "boolean" ) {
                scripts = context;
                context = 0;
            }
            context = context || document;

            // Single tag
            if ( (parsed = rsingleTag.exec( data )) ) {
                return [ context.createElement( parsed[1] ) ];
            }

            parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
            return jQuery.merge( [],
                (parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
        },

        parseJSON: function( data ) {
            if ( !data || typeof data !== "string") {
                return null;
            }

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = jQuery.trim( data );

            // Attempt to parse using the native JSON parser first
            if ( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( data );
            }

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                    .replace( rvalidtokens, "]" )
                    .replace( rvalidbraces, "")) ) {

                return ( new Function( "return " + data ) )();

            }
            jQuery.error( "Invalid JSON: " + data );
        },

        // Cross-browser xml parsing
        parseXML: function( data ) {
            var xml, tmp;
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            try {
                if ( window.DOMParser ) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString( data , "text/xml" );
                } else { // IE
                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( data );
                }
            } catch( e ) {
                xml = undefined;
            }
            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                jQuery.error( "Invalid XML: " + data );
            }
            return xml;
        },

        noop: function() {},

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function( data ) {
            if ( data && core_rnotwhite.test( data ) ) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                ( window.execScript || function( data ) {
                    window[ "eval" ].call( window, data );
                } )( data );
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function( string ) {
            return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
        },

        nodeName: function( elem, name ) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function( obj, callback, args ) {
            var name,
                i = 0,
                length = obj.length,
                isObj = length === undefined || jQuery.isFunction( obj );

            if ( args ) {
                if ( isObj ) {
                    for ( name in obj ) {
                        if ( callback.apply( obj[ name ], args ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( ; i < length; ) {
                        if ( callback.apply( obj[ i++ ], args ) === false ) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if ( isObj ) {
                    for ( name in obj ) {
                        if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                            break;
                        }
                    }
                } else {
                    for ( ; i < length; ) {
                        if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
            function( text ) {
                return text == null ?
                    "" :
                    core_trim.call( text );
            } :

            // Otherwise use our own trimming functionality
            function( text ) {
                return text == null ?
                    "" :
                    ( text + "" ).replace( rtrim, "" );
            },

        // results is for internal usage only
        makeArray: function( arr, results ) {
            var type,
                ret = results || [];

            if ( arr != null ) {
                // The window, strings (and functions) also have 'length'
                // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                type = jQuery.type( arr );

                if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
                    core_push.call( ret, arr );
                } else {
                    jQuery.merge( ret, arr );
                }
            }

            return ret;
        },

        inArray: function( elem, arr, i ) {
            var len;

            if ( arr ) {
                if ( core_indexOf ) {
                    return core_indexOf.call( arr, elem, i );
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

                for ( ; i < len; i++ ) {
                    // Skip accessing in sparse arrays
                    if ( i in arr && arr[ i ] === elem ) {
                        return i;
                    }
                }
            }

            return -1;
        },

        merge: function( first, second ) {
            var l = second.length,
                i = first.length,
                j = 0;

            if ( typeof l === "number" ) {
                for ( ; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }

            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }

            first.length = i;

            return first;
        },

        grep: function( elems, callback, inv ) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for ( ; i < length; i++ ) {
                retVal = !!callback( elems[ i ], i );
                if ( inv !== retVal ) {
                    ret.push( elems[ i ] );
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function( elems, callback, arg ) {
            var value, key,
                ret = [],
                i = 0,
                length = elems.length,
                // jquery objects are treated as arrays
                isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

            // Go through the array, translating each of the items to their
            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for ( key in elems ) {
                    value = callback( elems[ key ], key, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return ret.concat.apply( [], ret );
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function( fn, context ) {
            var tmp, args, proxy;

            if ( typeof context === "string" ) {
                tmp = fn[ context ];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if ( !jQuery.isFunction( fn ) ) {
                return undefined;
            }

            // Simulated bind
            args = core_slice.call( arguments, 2 );
            proxy = function() {
                return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
            var exec,
                bulk = key == null,
                i = 0,
                length = elems.length;

            // Sets many values
            if ( key && typeof key === "object" ) {
                for ( i in key ) {
                    jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
                }
                chainable = 1;

                // Sets one value
            } else if ( value !== undefined ) {
                // Optionally, function values get executed if exec is true
                exec = pass === undefined && jQuery.isFunction( value );

                if ( bulk ) {
                    // Bulk operations only iterate when executing function values
                    if ( exec ) {
                        exec = fn;
                        fn = function( elem, key, value ) {
                            return exec.call( jQuery( elem ), value );
                        };

                        // Otherwise they run against the entire set
                    } else {
                        fn.call( elems, value );
                        fn = null;
                    }
                }

                if ( fn ) {
                    for (; i < length; i++ ) {
                        fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
                    }
                }

                chainable = 1;
            }

            return chainable ?
                elems :

                // Gets
                bulk ?
                    fn.call( elems ) :
                    length ? fn( elems[0], key ) : emptyGet;
        },

        now: function() {
            return ( new Date() ).getTime();
        }
    });

    jQuery.ready.promise = function( obj ) {
        if ( !readyList ) {

            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout( jQuery.ready, 1 );

                // Standards-based browsers support DOMContentLoaded
            } else if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                // A fallback to window.onload, that will always work
                window.addEventListener( "load", jQuery.ready, false );

                // If IE event model is used
            } else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", DOMContentLoaded );

                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", jQuery.ready );

                // If IE and not a frame
                // continually check to see if the document is ready
                var top = false;

                try {
                    top = window.frameElement == null && document.documentElement;
                } catch(e) {}

                if ( top && top.doScroll ) {
                    (function doScrollCheck() {
                        if ( !jQuery.isReady ) {

                            try {
                                // Use the trick by Diego Perini
                                // http://javascript.nwbox.com/IEContentLoaded/
                                top.doScroll("left");
                            } catch(e) {
                                return setTimeout( doScrollCheck, 50 );
                            }

                            // and execute any waiting functions
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise( obj );
    };

// Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });

// All jQuery objects should point back to these
    rootjQuery = jQuery(document);
// String to Object options format cache
    var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions( options ) {
        var object = optionsCache[ options ] = {};
        jQuery.each( options.split( core_rspace ), function( _, flag ) {
            object[ flag ] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            ( optionsCache[ options ] || createOptions( options ) ) :
            jQuery.extend( {}, options );

        var // Last fire value (for non-forgettable lists)
            memory,
            // Flag to know if list was already fired
            fired,
            // Flag to know if list is currently firing
            firing,
            // First callback to fire (used internally by add and fireWith)
            firingStart,
            // End of the loop when firing
            firingLength,
            // Index of currently firing callback (modified by remove if needed)
            firingIndex,
            // Actual callback list
            list = [],
            // Stack of fire calls for repeatable lists
            stack = !options.once && [],
            // Fire callbacks
            fire = function( data ) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                    if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                        memory = false; // To prevent further calls using add
                        break;
                    }
                }
                firing = false;
                if ( list ) {
                    if ( stack ) {
                        if ( stack.length ) {
                            fire( stack.shift() );
                        }
                    } else if ( memory ) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
            // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function() {
                    if ( list ) {
                        // First, we save the current length
                        var start = list.length;
                        (function add( args ) {
                            jQuery.each( args, function( _, arg ) {
                                var type = jQuery.type( arg );
                                if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
                                    list.push( arg );
                                } else if ( arg && arg.length && type !== "string" ) {
                                    // Inspect recursively
                                    add( arg );
                                }
                            });
                        })( arguments );
                        // Do we need to add the callbacks to the
                        // current firing batch?
                        if ( firing ) {
                            firingLength = list.length;
                            // With memory, if we're not firing then
                            // we should call right away
                        } else if ( memory ) {
                            firingStart = start;
                            fire( memory );
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function() {
                    if ( list ) {
                        jQuery.each( arguments, function( _, arg ) {
                            var index;
                            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                                list.splice( index, 1 );
                                // Handle firing indexes
                                if ( firing ) {
                                    if ( index <= firingLength ) {
                                        firingLength--;
                                    }
                                    if ( index <= firingIndex ) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                // Control if a given callback is in the list
                has: function( fn ) {
                    return jQuery.inArray( fn, list ) > -1;
                },
                // Remove all callbacks from the list
                empty: function() {
                    list = [];
                    return this;
                },
                // Have the list do nothing anymore
                disable: function() {
                    list = stack = memory = undefined;
                    return this;
                },
                // Is it disabled?
                disabled: function() {
                    return !list;
                },
                // Lock the list in its current state
                lock: function() {
                    stack = undefined;
                    if ( !memory ) {
                        self.disable();
                    }
                    return this;
                },
                // Is it locked?
                locked: function() {
                    return !stack;
                },
                // Call all callbacks with the given context and arguments
                fireWith: function( context, args ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    if ( list && ( !fired || stack ) ) {
                        if ( firing ) {
                            stack.push( args );
                        } else {
                            fire( args );
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function() {
                    self.fireWith( this, arguments );
                    return this;
                },
                // To know if the callbacks have already been called at least once
                fired: function() {
                    return !!fired;
                }
            };

        return self;
    };
    jQuery.extend({

        Deferred: function( func ) {
            var tuples = [
                    // action, add listener, listener list, final state
                    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                    [ "notify", "progress", jQuery.Callbacks("memory") ]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done( arguments ).fail( arguments );
                        return this;
                    },
                    then: function( /* fnDone, fnFail, fnProgress */ ) {
                        var fns = arguments;
                        return jQuery.Deferred(function( newDefer ) {
                            jQuery.each( tuples, function( i, tuple ) {
                                var action = tuple[ 0 ],
                                    fn = fns[ i ];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
                                    function() {
                                        var returned = fn.apply( this, arguments );
                                        if ( returned && jQuery.isFunction( returned.promise ) ) {
                                            returned.promise()
                                                .done( newDefer.resolve )
                                                .fail( newDefer.reject )
                                                .progress( newDefer.notify );
                                        } else {
                                            newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                        }
                                    } :
                                    newDefer[ action ]
                                );
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj ) {
                        return obj != null ? jQuery.extend( obj, promise ) : promise;
                    }
                },
                deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            jQuery.each( tuples, function( i, tuple ) {
                var list = tuple[ 2 ],
                    stateString = tuple[ 3 ];

                // promise[ done | fail | progress ] = list.add
                promise[ tuple[1] ] = list.add;

                // Handle state
                if ( stateString ) {
                    list.add(function() {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
                }

                // deferred[ resolve | reject | notify ] = list.fire
                deferred[ tuple[0] ] = list.fire;
                deferred[ tuple[0] + "With" ] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise( deferred );

            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function( subordinate /* , ..., subordinateN */ ) {
            var i = 0,
                resolveValues = core_slice.call( arguments ),
                length = resolveValues.length,

                // the count of uncompleted subordinates
                remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

                // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                // Update function for both resolve and progress values
                updateFunc = function( i, contexts, values ) {
                    return function( value ) {
                        contexts[ i ] = this;
                        values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
                        if( values === progressValues ) {
                            deferred.notifyWith( contexts, values );
                        } else if ( !( --remaining ) ) {
                            deferred.resolveWith( contexts, values );
                        }
                    };
                },

                progressValues, progressContexts, resolveContexts;

            // add listeners to Deferred subordinates; treat others as resolved
            if ( length > 1 ) {
                progressValues = new Array( length );
                progressContexts = new Array( length );
                resolveContexts = new Array( length );
                for ( ; i < length; i++ ) {
                    if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                        resolveValues[ i ].promise()
                            .done( updateFunc( i, resolveContexts, resolveValues ) )
                            .fail( deferred.reject )
                            .progress( updateFunc( i, progressContexts, progressValues ) );
                    } else {
                        --remaining;
                    }
                }
            }

            // if we're not waiting on anything, resolve the master
            if ( !remaining ) {
                deferred.resolveWith( resolveContexts, resolveValues );
            }

            return deferred.promise();
        }
    });
    jQuery.support = (function() {

        var support,
            all,
            a,
            select,
            opt,
            input,
            fragment,
            eventName,
            i,
            isSupported,
            clickFn,
            div = document.createElement("div");

        // Preliminary tests
        div.setAttribute( "className", "t" );
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[ 0 ];
        a.style.cssText = "top:1px;float:left;opacity:.5";

        // Can't get basic test support
        if ( !all || !all.length ) {
            return {};
        }

        // First batch of supports tests
        select = document.createElement("select");
        opt = select.appendChild( document.createElement("option") );
        input = div.getElementsByTagName("input")[ 0 ];

        support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: ( div.firstChild.nodeType === 3 ),

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            style: /top/.test( a.getAttribute("style") ),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: ( a.getAttribute("href") === "/a" ),

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.5/.test( a.style.opacity ),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: ( input.value === "on" ),

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            getSetAttribute: div.className !== "t",

            // Tests for enctype support on a form(#6743)
            enctype: !!document.createElement("form").enctype,

            // Makes sure cloning an html5 element does not cause problems
            // Where outerHTML is undefined, this still works
            html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

            // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
            boxModel: ( document.compatMode === "CSS1Compat" ),

            // Will be defined later
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true,
            boxSizingReliable: true,
            pixelPosition: false
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode( true ).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete div.test;
        } catch( e ) {
            support.deleteExpando = false;
        }

        if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
            div.attachEvent( "onclick", clickFn = function() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                support.noCloneEvent = false;
            });
            div.cloneNode( true ).fireEvent("onclick");
            div.detachEvent( "onclick", clickFn );
        }

        // Check if a radio maintains its value
        // after being appended to the DOM
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute( "type", "radio" );
        support.radioValue = input.value === "t";

        input.setAttribute( "checked", "checked" );

        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute( "name", "t" );

        div.appendChild( input );
        fragment = document.createDocumentFragment();
        fragment.appendChild( div.lastChild );

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        fragment.removeChild( input );
        fragment.appendChild( div );

        // Technique from Juriy Zaytsev
        // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
        // We only care about the case where non-standard event systems
        // are used, namely in IE. Short-circuiting here helps us to
        // avoid an eval call (in setAttribute) which can cause CSP
        // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
        if ( div.attachEvent ) {
            for ( i in {
                submit: true,
                change: true,
                focusin: true
            }) {
                eventName = "on" + i;
                isSupported = ( eventName in div );
                if ( !isSupported ) {
                    div.setAttribute( eventName, "return;" );
                    isSupported = ( typeof div[ eventName ] === "function" );
                }
                support[ i + "Bubbles" ] = isSupported;
            }
        }

        // Run tests that need a body at doc ready
        jQuery(function() {
            var container, div, tds, marginDiv,
                divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                body = document.getElementsByTagName("body")[0];

            if ( !body ) {
                // Return for frameset docs that don't have a body
                return;
            }

            container = document.createElement("div");
            container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
            body.insertBefore( container, body.firstChild );

            // Construct the test element
            div = document.createElement("div");
            container.appendChild( div );

            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            // (only IE 8 fails this test)
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
            isSupported = ( tds[ 0 ].offsetHeight === 0 );

            tds[ 0 ].style.display = "";
            tds[ 1 ].style.display = "none";

            // Check if empty table cells still have offsetWidth/Height
            // (IE <= 8 fail this test)
            support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

            // Check box-sizing and margin behavior
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
            support.boxSizing = ( div.offsetWidth === 4 );
            support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

            // NOTE: To any future maintainer, we've window.getComputedStyle
            // because jsdom on node.js will break without it.
            if ( window.getComputedStyle ) {
                support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
                support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. For more
                // info see bug #3333
                // Fails in WebKit before Feb 2011 nightlies
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                marginDiv = document.createElement("div");
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";
                div.appendChild( marginDiv );
                support.reliableMarginRight =
                    !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
            }

            if ( typeof div.style.zoom !== "undefined" ) {
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                // (IE < 8 does this)
                div.innerHTML = "";
                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

                // Check if elements with layout shrink-wrap their children
                // (IE 6 does this)
                div.style.display = "block";
                div.style.overflow = "visible";
                div.innerHTML = "<div></div>";
                div.firstChild.style.width = "5px";
                support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

                container.style.zoom = 1;
            }

            // Null elements to avoid leaks in IE
            body.removeChild( container );
            container = div = tds = marginDiv = null;
        });

        // Null elements to avoid leaks in IE
        fragment.removeChild( div );
        all = a = select = opt = input = fragment = div = null;

        return support;
    })();
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;

    jQuery.extend({
        cache: {},

        deletedIds: [],

        // Remove at next major release (1.9/2.0)
        uuid: 0,

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function( elem ) {
            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
            return !!elem && !isEmptyDataObject( elem );
        },

        data: function( elem, name, data, pvt /* Internal Use Only */ ) {
            if ( !jQuery.acceptData( elem ) ) {
                return;
            }

            var thisCache, ret,
                internalKey = jQuery.expando,
                getByName = typeof name === "string",

                // We have to handle DOM nodes and JS objects differently because IE6-7
                // can't GC object references properly across the DOM-JS boundary
                isNode = elem.nodeType,

                // Only DOM nodes need the global jQuery cache; JS object data is
                // attached directly to the object so GC can occur automatically
                cache = isNode ? jQuery.cache : elem,

                // Only defining an ID for JS objects if its cache already exists allows
                // the code to shortcut on the same path as a DOM node with no cache
                id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
                return;
            }

            if ( !id ) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if ( isNode ) {
                    elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
                } else {
                    id = internalKey;
                }
            }

            if ( !cache[ id ] ) {
                cache[ id ] = {};

                // Avoids exposing jQuery metadata on plain JS objects when the object
                // is serialized using JSON.stringify
                if ( !isNode ) {
                    cache[ id ].toJSON = jQuery.noop;
                }
            }

            // An object can be passed to jQuery.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if ( typeof name === "object" || typeof name === "function" ) {
                if ( pvt ) {
                    cache[ id ] = jQuery.extend( cache[ id ], name );
                } else {
                    cache[ id ].data = jQuery.extend( cache[ id ].data, name );
                }
            }

            thisCache = cache[ id ];

            // jQuery data() is stored in a separate object inside the object's internal data
            // cache in order to avoid key collisions between internal data and user-defined
            // data.
            if ( !pvt ) {
                if ( !thisCache.data ) {
                    thisCache.data = {};
                }

                thisCache = thisCache.data;
            }

            if ( data !== undefined ) {
                thisCache[ jQuery.camelCase( name ) ] = data;
            }

            // Check for both converted-to-camel and non-converted data property names
            // If a data property was specified
            if ( getByName ) {

                // First Try to find as-is property data
                ret = thisCache[ name ];

                // Test for null|undefined property data
                if ( ret == null ) {

                    // Try to find the camelCased property
                    ret = thisCache[ jQuery.camelCase( name ) ];
                }
            } else {
                ret = thisCache;
            }

            return ret;
        },

        removeData: function( elem, name, pvt /* Internal Use Only */ ) {
            if ( !jQuery.acceptData( elem ) ) {
                return;
            }

            var thisCache, i, l,

                isNode = elem.nodeType,

                // See jQuery.data for more information
                cache = isNode ? jQuery.cache : elem,
                id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if ( !cache[ id ] ) {
                return;
            }

            if ( name ) {

                thisCache = pvt ? cache[ id ] : cache[ id ].data;

                if ( thisCache ) {

                    // Support array or space separated string names for data keys
                    if ( !jQuery.isArray( name ) ) {

                        // try the string as a key before any manipulation
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {

                            // split the camel cased version by spaces unless a key with the spaces exists
                            name = jQuery.camelCase( name );
                            if ( name in thisCache ) {
                                name = [ name ];
                            } else {
                                name = name.split(" ");
                            }
                        }
                    }

                    for ( i = 0, l = name.length; i < l; i++ ) {
                        delete thisCache[ name[i] ];
                    }

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                        return;
                    }
                }
            }

            // See jQuery.data for more information
            if ( !pvt ) {
                delete cache[ id ].data;

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if ( !isEmptyDataObject( cache[ id ] ) ) {
                    return;
                }
            }

            // Destroy the cache
            if ( isNode ) {
                jQuery.cleanData( [ elem ], true );

                // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
            } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
                delete cache[ id ];

                // When all else fails, null
            } else {
                cache[ id ] = null;
            }
        },

        // For internal use only.
        _data: function( elem, name, data ) {
            return jQuery.data( elem, name, data, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });

    jQuery.fn.extend({
        data: function( key, value ) {
            var parts, part, attr, name, l,
                elem = this[0],
                i = 0,
                data = null;

            // Gets all values
            if ( key === undefined ) {
                if ( this.length ) {
                    data = jQuery.data( elem );

                    if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
                        attr = elem.attributes;
                        for ( l = attr.length; i < l; i++ ) {
                            name = attr[i].name;

                            if ( !name.indexOf( "data-" ) ) {
                                name = jQuery.camelCase( name.substring(5) );

                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                        jQuery._data( elem, "parsedAttrs", true );
                    }
                }

                return data;
            }

            // Sets multiple values
            if ( typeof key === "object" ) {
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }

            parts = key.split( ".", 2 );
            parts[1] = parts[1] ? "." + parts[1] : "";
            part = parts[1] + "!";

            return jQuery.access( this, function( value ) {

                if ( value === undefined ) {
                    data = this.triggerHandler( "getData" + part, [ parts[0] ] );

                    // Try to fetch any internally stored data first
                    if ( data === undefined && elem ) {
                        data = jQuery.data( elem, key );
                        data = dataAttr( elem, key, data );
                    }

                    return data === undefined && parts[1] ?
                        this.data( parts[0] ) :
                        data;
                }

                parts[1] = value;
                this.each(function() {
                    var self = jQuery( this );

                    self.triggerHandler( "setData" + part, parts );
                    jQuery.data( this, key, value );
                    self.triggerHandler( "changeData" + part, parts );
                });
            }, null, value, arguments.length > 1, null, false );
        },

        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });

    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {

            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

            data = elem.getAttribute( name );

            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                            data === "null" ? null :
                                // Only convert to a number if it doesn't change the string
                                +data + "" === data ? +data :
                                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                                        data;
                } catch( e ) {}

                // Make sure we set the data so it isn't changed later
                jQuery.data( elem, key, data );

            } else {
                data = undefined;
            }
        }

        return data;
    }

// checks a cache object for emptiness
    function isEmptyDataObject( obj ) {
        var name;
        for ( name in obj ) {

            // if the public data object is empty, the private is still empty
            if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
                continue;
            }
            if ( name !== "toJSON" ) {
                return false;
            }
        }

        return true;
    }
    jQuery.extend({
        queue: function( elem, type, data ) {
            var queue;

            if ( elem ) {
                type = ( type || "fx" ) + "queue";
                queue = jQuery._data( elem, type );

                // Speed up dequeue by getting out quickly if this is just a lookup
                if ( data ) {
                    if ( !queue || jQuery.isArray(data) ) {
                        queue = jQuery._data( elem, type, jQuery.makeArray(data) );
                    } else {
                        queue.push( data );
                    }
                }
                return queue || [];
            }
        },

        dequeue: function( elem, type ) {
            type = type || "fx";

            var queue = jQuery.queue( elem, type ),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks( elem, type ),
                next = function() {
                    jQuery.dequeue( elem, type );
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
                startLength--;
            }

            if ( fn ) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift( "inprogress" );
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call( elem, next, hooks );
            }

            if ( !startLength && hooks ) {
                hooks.empty.fire();
            }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function( elem, type ) {
            var key = type + "queueHooks";
            return jQuery._data( elem, key ) || jQuery._data( elem, key, {
                    empty: jQuery.Callbacks("once memory").add(function() {
                        jQuery.removeData( elem, type + "queue", true );
                        jQuery.removeData( elem, key, true );
                    })
                });
        }
    });

    jQuery.fn.extend({
        queue: function( type, data ) {
            var setter = 2;

            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
                setter--;
            }

            if ( arguments.length < setter ) {
                return jQuery.queue( this[0], type );
            }

            return data === undefined ?
                this :
                this.each(function() {
                    var queue = jQuery.queue( this, type, data );

                    // ensure a hooks for this queue
                    jQuery._queueHooks( this, type );

                    if ( type === "fx" && queue[0] !== "inprogress" ) {
                        jQuery.dequeue( this, type );
                    }
                });
        },
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
            type = type || "fx";

            return this.queue( type, function( next, hooks ) {
                var timeout = setTimeout( next, time );
                hooks.stop = function() {
                    clearTimeout( timeout );
                };
            });
        },
        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, obj ) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function() {
                    if ( !( --count ) ) {
                        defer.resolveWith( elements, [ elements ] );
                    }
                };

            if ( typeof type !== "string" ) {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while( i-- ) {
                tmp = jQuery._data( elements[ i ], type + "queueHooks" );
                if ( tmp && tmp.empty ) {
                    count++;
                    tmp.empty.add( resolve );
                }
            }
            resolve();
            return defer.promise( obj );
        }
    });
    var nodeHook, boolHook, fixSpecified,
        rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea|)$/i,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute;

    jQuery.fn.extend({
        attr: function( name, value ) {
            return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
        },

        removeAttr: function( name ) {
            return this.each(function() {
                jQuery.removeAttr( this, name );
            });
        },

        prop: function( name, value ) {
            return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
        },

        removeProp: function( name ) {
            name = jQuery.propFix[ name ] || name;
            return this.each(function() {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[ name ] = undefined;
                    delete this[ name ];
                } catch( e ) {}
            });
        },

        addClass: function( value ) {
            var classNames, i, l, elem,
                setClass, c, cl;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).addClass( value.call(this, j, this.className) );
                });
            }

            if ( value && typeof value === "string" ) {
                classNames = value.split( core_rspace );

                for ( i = 0, l = this.length; i < l; i++ ) {
                    elem = this[ i ];

                    if ( elem.nodeType === 1 ) {
                        if ( !elem.className && classNames.length === 1 ) {
                            elem.className = value;

                        } else {
                            setClass = " " + elem.className + " ";

                            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                                if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                                    setClass += classNames[ c ] + " ";
                                }
                            }
                            elem.className = jQuery.trim( setClass );
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function( value ) {
            var removes, className, elem, c, cl, i, l;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).removeClass( value.call(this, j, this.className) );
                });
            }
            if ( (value && typeof value === "string") || value === undefined ) {
                removes = ( value || "" ).split( core_rspace );

                for ( i = 0, l = this.length; i < l; i++ ) {
                    elem = this[ i ];
                    if ( elem.nodeType === 1 && elem.className ) {

                        className = (" " + elem.className + " ").replace( rclass, " " );

                        // loop over each item in the removal list
                        for ( c = 0, cl = removes.length; c < cl; c++ ) {
                            // Remove until there is nothing to remove,
                            while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
                                className = className.replace( " " + removes[ c ] + " " , " " );
                            }
                        }
                        elem.className = value ? jQuery.trim( className ) : "";
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( i ) {
                    jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
                });
            }

            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery( this ),
                        state = stateVal,
                        classNames = value.split( core_rspace );

                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space separated list
                        state = isBool ? state : !self.hasClass( className );
                        self[ state ? "addClass" : "removeClass" ]( className );
                    }

                } else if ( type === "undefined" || type === "boolean" ) {
                    if ( this.className ) {
                        // store className if set
                        jQuery._data( this, "__className__", this.className );
                    }

                    // toggle whole className
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },

        hasClass: function( selector ) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for ( ; i < l; i++ ) {
                if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                    return true;
                }
            }

            return false;
        },

        val: function( value ) {
            var hooks, ret, isFunction,
                elem = this[0];

            if ( !arguments.length ) {
                if ( elem ) {
                    hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                    if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction( value );

            return this.each(function( i ) {
                var val,
                    self = jQuery(this);

                if ( this.nodeType !== 1 ) {
                    return;
                }

                if ( isFunction ) {
                    val = value.call( this, i, self.val() );
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";
                } else if ( typeof val === "number" ) {
                    val += "";
                } else if ( jQuery.isArray( val ) ) {
                    val = jQuery.map(val, function ( value ) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

                // If set returns undefined, fall back to normal setting
                if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function( elem ) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function( elem ) {
                    var value, i, max, option,
                        index = elem.selectedIndex,
                        values = [],
                        options = elem.options,
                        one = elem.type === "select-one";

                    // Nothing was selected
                    if ( index < 0 ) {
                        return null;
                    }

                    // Loop through all the selected options
                    i = one ? index : 0;
                    max = one ? index + 1 : options.length;
                    for ( ; i < max; i++ ) {
                        option = options[ i ];

                        // Don't return options that are disabled or in a disabled optgroup
                        if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                            (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                            // Get the specific value for the option
                            value = jQuery( option ).val();

                            // We don't need an array for one selects
                            if ( one ) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push( value );
                        }
                    }

                    // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                    if ( one && !values.length && options.length ) {
                        return jQuery( options[ index ] ).val();
                    }

                    return values;
                },

                set: function( elem, value ) {
                    var values = jQuery.makeArray( value );

                    jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                    });

                    if ( !values.length ) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
        attrFn: {},

        attr: function( elem, name, value, pass ) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
                return jQuery( elem )[ name ]( value );
            }

            // Fallback to prop when attributes are not supported
            if ( typeof elem.getAttribute === "undefined" ) {
                return jQuery.prop( elem, name, value );
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if ( notxml ) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
            }

            if ( value !== undefined ) {

                if ( value === null ) {
                    jQuery.removeAttr( elem, name );
                    return;

                } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    elem.setAttribute( name, value + "" );
                    return value;
                }

            } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {

                ret = elem.getAttribute( name );

                // Non-existent attributes return null, we normalize to undefined
                return ret === null ?
                    undefined :
                    ret;
            }
        },

        removeAttr: function( elem, value ) {
            var propName, attrNames, name, isBool,
                i = 0;

            if ( value && elem.nodeType === 1 ) {

                attrNames = value.split( core_rspace );

                for ( ; i < attrNames.length; i++ ) {
                    name = attrNames[ i ];

                    if ( name ) {
                        propName = jQuery.propFix[ name ] || name;
                        isBool = rboolean.test( name );

                        // See #9699 for explanation of this approach (setting first, then removal)
                        // Do not do this for boolean attributes (see #10870)
                        if ( !isBool ) {
                            jQuery.attr( elem, name, "" );
                        }
                        elem.removeAttribute( getSetAttribute ? name : propName );

                        // Set corresponding property to false for boolean attributes
                        if ( isBool && propName in elem ) {
                            elem[ propName ] = false;
                        }
                    }
                }
            }
        },

        attrHooks: {
            type: {
                set: function( elem, value ) {
                    // We can't allow the type property to be changed (since it causes problems in IE)
                    if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                        jQuery.error( "type property can't be changed" );
                    } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to it's default in case type is set after value
                        // This is for element creation
                        var val = elem.value;
                        elem.setAttribute( "type", value );
                        if ( val ) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            },
            // Use the value property for back compat
            // Use the nodeHook for button elements in IE6/7 (#1954)
            value: {
                get: function( elem, name ) {
                    if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                        return nodeHook.get( elem, name );
                    }
                    return name in elem ?
                        elem.value :
                        null;
                },
                set: function( elem, value, name ) {
                    if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                        return nodeHook.set( elem, value, name );
                    }
                    // Does not return so that setAttribute is also used
                    elem.value = value;
                }
            }
        },

        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },

        prop: function( elem, name, value ) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            if ( notxml ) {
                // Fix name and attach hooks
                name = jQuery.propFix[ name ] || name;
                hooks = jQuery.propHooks[ name ];
            }

            if ( value !== undefined ) {
                if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    return ( elem[ name ] = value );
                }

            } else {
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                    return ret;

                } else {
                    return elem[ name ];
                }
            }
        },

        propHooks: {
            tabIndex: {
                get: function( elem ) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabindex");

                    return attributeNode && attributeNode.specified ?
                        parseInt( attributeNode.value, 10 ) :
                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                            0 :
                            undefined;
                }
            }
        }
    });

// Hook for boolean attributes
    boolHook = {
        get: function( elem, name ) {
            // Align boolean attributes with corresponding properties
            // Fall back to attribute presence where some booleans are not supported
            var attrNode,
                property = jQuery.prop( elem, name );
            return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
                name.toLowerCase() :
                undefined;
        },
        set: function( elem, value, name ) {
            var propName;
            if ( value === false ) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr( elem, name );
            } else {
                // value is true since we know at this point it's type boolean and not false
                // Set boolean attributes to the same name and set the DOM property
                propName = jQuery.propFix[ name ] || name;
                if ( propName in elem ) {
                    // Only set the IDL specifically if it already exists on the element
                    elem[ propName ] = true;
                }

                elem.setAttribute( name, name.toLowerCase() );
            }
            return name;
        }
    };

// IE6/7 do not support getting/setting some attributes with get/setAttribute
    if ( !getSetAttribute ) {

        fixSpecified = {
            name: true,
            id: true,
            coords: true
        };

        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = jQuery.valHooks.button = {
            get: function( elem, name ) {
                var ret;
                ret = elem.getAttributeNode( name );
                return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
                    ret.value :
                    undefined;
            },
            set: function( elem, value, name ) {
                // Set the existing or create a new attribute node
                var ret = elem.getAttributeNode( name );
                if ( !ret ) {
                    ret = document.createAttribute( name );
                    elem.setAttributeNode( ret );
                }
                return ( ret.value = value + "" );
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each([ "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                set: function( elem, value ) {
                    if ( value === "" ) {
                        elem.setAttribute( name, "auto" );
                        return value;
                    }
                }
            });
        });

        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
            get: nodeHook.get,
            set: function( elem, value, name ) {
                if ( value === "" ) {
                    value = "false";
                }
                nodeHook.set( elem, value, name );
            }
        };
    }


// Some attributes require a special call on IE
    if ( !jQuery.support.hrefNormalized ) {
        jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                get: function( elem ) {
                    var ret = elem.getAttribute( name, 2 );
                    return ret === null ? undefined : ret;
                }
            });
        });
    }

    if ( !jQuery.support.style ) {
        jQuery.attrHooks.style = {
            get: function( elem ) {
                // Return undefined in the case of empty string
                // Normalize to lowercase since IE uppercases css property names
                return elem.style.cssText.toLowerCase() || undefined;
            },
            set: function( elem, value ) {
                return ( elem.style.cssText = value + "" );
            }
        };
    }

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
    if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
            get: function( elem ) {
                var parent = elem.parentNode;

                if ( parent ) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if ( parent.parentNode ) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        });
    }

// IE6/7 call enctype encoding
    if ( !jQuery.support.enctype ) {
        jQuery.propFix.enctype = "encoding";
    }

// Radios and checkboxes getter/setter
    if ( !jQuery.support.checkOn ) {
        jQuery.each([ "radio", "checkbox" ], function() {
            jQuery.valHooks[ this ] = {
                get: function( elem ) {
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
            set: function( elem, value ) {
                if ( jQuery.isArray( value ) ) {
                    return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
                }
            }
        });
    });
    var rformElems = /^(?:textarea|input|select)$/i,
        rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        hoverHack = function( events ) {
            return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
        };

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

        add: function( elem, types, handler, data, selector ) {

            var elemData, eventHandle, events,
                t, tns, type, namespaces, handleObj,
                handleObjIn, handlers, special;

            // Don't attach events to noData or text/comment nodes (allow plain objects tho)
            if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            events = elemData.events;
            if ( !events ) {
                elemData.events = events = {};
            }
            eventHandle = elemData.handle;
            if ( !eventHandle ) {
                elemData.handle = eventHandle = function( e ) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                        undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = jQuery.trim( hoverHack(types) ).split( " " );
            for ( t = 0; t < types.length; t++ ) {

                tns = rtypenamespace.exec( types[t] ) || [];
                type = tns[1];
                namespaces = ( tns[2] || "" ).split( "." ).sort();

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[ type ] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = ( selector ? special.delegateType : special.bindType ) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[ type ] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: tns[1],
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                    namespace: namespaces.join(".")
                }, handleObjIn );

                // Init the event handler queue if we're the first
                handlers = events[ type ];
                if ( !handlers ) {
                    handlers = events[ type ] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener/attachEvent if the special events handler returns false
                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                        // Bind the global event handler to the element
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle, false );

                        } else if ( elem.attachEvent ) {
                            elem.attachEvent( "on" + type, eventHandle );
                        }
                    }
                }

                if ( special.add ) {
                    special.add.call( elem, handleObj );

                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if ( selector ) {
                    handlers.splice( handlers.delegateCount++, 0, handleObj );
                } else {
                    handlers.push( handleObj );
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[ type ] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, selector, mappedTypes ) {

            var t, tns, type, origType, namespaces, origCount,
                j, events, special, eventType, handleObj,
                elemData = jQuery.hasData( elem ) && jQuery._data( elem );

            if ( !elemData || !(events = elemData.events) ) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
            for ( t = 0; t < types.length; t++ ) {
                tns = rtypenamespace.exec( types[t] ) || [];
                type = origType = tns[1];
                namespaces = tns[2];

                // Unbind all events (on this namespace, if provided) for the element
                if ( !type ) {
                    for ( type in events ) {
                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                    }
                    continue;
                }

                special = jQuery.event.special[ type ] || {};
                type = ( selector? special.delegateType : special.bindType ) || type;
                eventType = events[ type ] || [];
                origCount = eventType.length;
                namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

                // Remove matching events
                for ( j = 0; j < eventType.length; j++ ) {
                    handleObj = eventType[ j ];

                    if ( ( mappedTypes || origType === handleObj.origType ) &&
                        ( !handler || handler.guid === handleObj.guid ) &&
                        ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
                        ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                        eventType.splice( j--, 1 );

                        if ( handleObj.selector ) {
                            eventType.delegateCount--;
                        }
                        if ( special.remove ) {
                            special.remove.call( elem, handleObj );
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if ( eventType.length === 0 && origCount !== eventType.length ) {
                    if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                        jQuery.removeEvent( elem, type, elemData.handle );
                    }

                    delete events[ type ];
                }
            }

            // Remove the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                delete elemData.handle;

                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery.removeData( elem, "events", true );
            }
        },

        // Events that are safe to short-circuit if no handlers are attached.
        // Native DOM events should not be added, they may have inline handlers.
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },

        trigger: function( event, data, elem, onlyHandlers ) {
            // Don't do events on text and comment nodes
            if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
                return;
            }

            // Event object or event type
            var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
                type = event.type || event,
                namespaces = [];

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
                return;
            }

            if ( type.indexOf( "!" ) >= 0 ) {
                // Exclusive events trigger only for the exact event (no namespaces)
                type = type.slice(0, -1);
                exclusive = true;
            }

            if ( type.indexOf( "." ) >= 0 ) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }

            if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
                // No jQuery handlers for this event type, and it can't have inline handlers
                return;
            }

            // Caller can pass in an Event, Object, or just an event type string
            event = typeof event === "object" ?
                // jQuery.Event object
                event[ jQuery.expando ] ? event :
                    // Object literal
                    new jQuery.Event( type, event ) :
                // Just the event type (string)
                new jQuery.Event( type );

            event.type = type;
            event.isTrigger = true;
            event.exclusive = exclusive;
            event.namespace = namespaces.join( "." );
            event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

            // Handle a global trigger
            if ( !elem ) {

                // TODO: Stop taunting the data cache; remove global events and always attach to document
                cache = jQuery.cache;
                for ( i in cache ) {
                    if ( cache[ i ].events && cache[ i ].events[ type ] ) {
                        jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
                    }
                }
                return;
            }

            // Clean up the event in case it is being reused
            event.result = undefined;
            if ( !event.target ) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data != null ? jQuery.makeArray( data ) : [];
            data.unshift( event );

            // Allow special events to draw outside the lines
            special = jQuery.event.special[ type ] || {};
            if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            eventPath = [[ elem, special.bindType || type ]];
            if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

                bubbleType = special.delegateType || type;
                cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
                for ( old = elem; cur; cur = cur.parentNode ) {
                    eventPath.push([ cur, bubbleType ]);
                    old = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if ( old === (elem.ownerDocument || document) ) {
                    eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
                }
            }

            // Fire handlers on the event path
            for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

                cur = eventPath[i][0];
                event.type = eventPath[i][1];

                handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
                if ( handle ) {
                    handle.apply( cur, data );
                }
                // Note that this is a bare JS function and not a jQuery handler
                handle = ontype && cur[ ontype ];
                if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
                    event.preventDefault();
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if ( !onlyHandlers && !event.isDefaultPrevented() ) {

                if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                    !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    // IE<9 dies on focus/blur to hidden element (#1486)
                    if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        old = elem[ ontype ];

                        if ( old ) {
                            elem[ ontype ] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        elem[ type ]();
                        jQuery.event.triggered = undefined;

                        if ( old ) {
                            elem[ ontype ] = old;
                        }
                    }
                }
            }

            return event.result;
        },

        dispatch: function( event ) {

            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix( event || window.event );

            var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
                handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
                delegateCount = handlers.delegateCount,
                args = core_slice.call( arguments ),
                run_all = !event.exclusive && !event.namespace,
                special = jQuery.event.special[ event.type ] || {},
                handlerQueue = [];

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
                return;
            }

            // Determine handlers that should run if there are delegated events
            // Avoid non-left-click bubbling in Firefox (#3861)
            if ( delegateCount && !(event.button && event.type === "click") ) {

                for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

                    // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
                    if ( cur.disabled !== true || event.type !== "click" ) {
                        selMatch = {};
                        matches = [];
                        for ( i = 0; i < delegateCount; i++ ) {
                            handleObj = handlers[ i ];
                            sel = handleObj.selector;

                            if ( selMatch[ sel ] === undefined ) {
                                selMatch[ sel ] = handleObj.needsContext ?
                                jQuery( sel, this ).index( cur ) >= 0 :
                                    jQuery.find( sel, this, null, [ cur ] ).length;
                            }
                            if ( selMatch[ sel ] ) {
                                matches.push( handleObj );
                            }
                        }
                        if ( matches.length ) {
                            handlerQueue.push({ elem: cur, matches: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if ( handlers.length > delegateCount ) {
                handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
            }

            // Run delegates first; they may want to stop propagation beneath us
            for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
                matched = handlerQueue[ i ];
                event.currentTarget = matched.elem;

                for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
                    handleObj = matched.matches[ j ];

                    // Triggered event must either 1) be non-exclusive and have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

                        event.data = handleObj.data;
                        event.handleObj = handleObj;

                        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                        if ( ret !== undefined ) {
                            event.result = ret;
                            if ( ret === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if ( special.postDispatch ) {
                special.postDispatch.call( this, event );
            }

            return event.result;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function( event, original ) {

                // Add which for key events
                if ( event.which == null ) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function( event, original ) {
                var eventDoc, doc, body,
                    button = original.button,
                    fromElement = original.fromElement;

                // Calculate pageX/Y if missing and clientX/Y available
                if ( event.pageX == null && original.clientX != null ) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                    event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
                }

                // Add relatedTarget, if necessary
                if ( !event.relatedTarget && fromElement ) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if ( !event.which && button !== undefined ) {
                    event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                }

                return event;
            }
        },

        fix: function( event ) {
            if ( event[ jQuery.expando ] ) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i, prop,
                originalEvent = event,
                fixHook = jQuery.event.fixHooks[ event.type ] || {},
                copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

            event = jQuery.Event( originalEvent );

            for ( i = copy.length; i; ) {
                prop = copy[ --i ];
                event[ prop ] = originalEvent[ prop ];
            }

            // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
            if ( !event.target ) {
                event.target = originalEvent.srcElement || document;
            }

            // Target should not be a text node (#504, Safari)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
            event.metaKey = !!event.metaKey;

            return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
        },

        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },

            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },

            beforeunload: {
                setup: function( data, namespaces, eventHandle ) {
                    // We only want to do this special case on windows
                    if ( jQuery.isWindow( this ) ) {
                        this.onbeforeunload = eventHandle;
                    }
                },

                teardown: function( namespaces, eventHandle ) {
                    if ( this.onbeforeunload === eventHandle ) {
                        this.onbeforeunload = null;
                    }
                }
            }
        },

        simulate: function( type, elem, event, bubble ) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                { type: type,
                    isSimulated: true,
                    originalEvent: {}
                }
            );
            if ( bubble ) {
                jQuery.event.trigger( e, null, elem );
            } else {
                jQuery.event.dispatch.call( elem, e );
            }
            if ( e.isDefaultPrevented() ) {
                event.preventDefault();
            }
        }
    };

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
    jQuery.event.handle = jQuery.event.dispatch;

    jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
            if ( elem.removeEventListener ) {
                elem.removeEventListener( type, handle, false );
            }
        } :
        function( elem, type, handle ) {
            var name = "on" + type;

            if ( elem.detachEvent ) {

                // #8545, #7054, preventing memory leaks for custom events in IE6-8 â€“
                // detachEvent needed property on element, by name of that event, to properly expose it to GC
                if ( typeof elem[ name ] === "undefined" ) {
                    elem[ name ] = null;
                }

                elem.detachEvent( name, handle );
            }
        };

    jQuery.Event = function( src, props ) {
        // Allow instantiation without the 'new' keyword
        if ( !(this instanceof jQuery.Event) ) {
            return new jQuery.Event( src, props );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if ( props ) {
            jQuery.extend( this, props );
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }

            // if preventDefault exists run it on the original event
            if ( e.preventDefault ) {
                e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if ( e.stopPropagation ) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };

// Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            delegateType: fix,
            bindType: fix,

            handle: function( event ) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj,
                    selector = handleObj.selector;

                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply( this, arguments );
                    event.type = fix;
                }
                return ret;
            }
        };
    });

// IE submit delegation
    if ( !jQuery.support.submitBubbles ) {

        jQuery.event.special.submit = {
            setup: function() {
                // Only need this for delegated form submit events
                if ( jQuery.nodeName( this, "form" ) ) {
                    return false;
                }

                // Lazy-add a submit handler when a descendant form may potentially be submitted
                jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                    // Node name check avoids a VML-related crash in IE (#9807)
                    var elem = e.target,
                        form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                    if ( form && !jQuery._data( form, "_submit_attached" ) ) {
                        jQuery.event.add( form, "submit._submit", function( event ) {
                            event._submit_bubble = true;
                        });
                        jQuery._data( form, "_submit_attached", true );
                    }
                });
                // return undefined since we don't need an event listener
            },

            postDispatch: function( event ) {
                // If form was submitted by the user, bubble the event up the tree
                if ( event._submit_bubble ) {
                    delete event._submit_bubble;
                    if ( this.parentNode && !event.isTrigger ) {
                        jQuery.event.simulate( "submit", this.parentNode, event, true );
                    }
                }
            },

            teardown: function() {
                // Only need this for delegated form submit events
                if ( jQuery.nodeName( this, "form" ) ) {
                    return false;
                }

                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                jQuery.event.remove( this, "._submit" );
            }
        };
    }

// IE change delegation and checkbox/radio fix
    if ( !jQuery.support.changeBubbles ) {

        jQuery.event.special.change = {

            setup: function() {

                if ( rformElems.test( this.nodeName ) ) {
                    // IE doesn't fire change on a check/radio until blur; trigger it on click
                    // after a propertychange. Eat the blur-change in special.change.handle.
                    // This still fires onchange a second time for check/radio after blur.
                    if ( this.type === "checkbox" || this.type === "radio" ) {
                        jQuery.event.add( this, "propertychange._change", function( event ) {
                            if ( event.originalEvent.propertyName === "checked" ) {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add( this, "click._change", function( event ) {
                            if ( this._just_changed && !event.isTrigger ) {
                                this._just_changed = false;
                            }
                            // Allow triggered, simulated change events (#11500)
                            jQuery.event.simulate( "change", this, event, true );
                        });
                    }
                    return false;
                }
                // Delegated event; lazy-add a change handler on descendant inputs
                jQuery.event.add( this, "beforeactivate._change", function( e ) {
                    var elem = e.target;

                    if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
                        jQuery.event.add( elem, "change._change", function( event ) {
                            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                                jQuery.event.simulate( "change", this.parentNode, event, true );
                            }
                        });
                        jQuery._data( elem, "_change_attached", true );
                    }
                });
            },

            handle: function( event ) {
                var elem = event.target;

                // Swallow native change events from checkbox/radio, we already triggered them above
                if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                    return event.handleObj.handler.apply( this, arguments );
                }
            },

            teardown: function() {
                jQuery.event.remove( this, "._change" );

                return !rformElems.test( this.nodeName );
            }
        };
    }

// Create "bubbling" focus and blur events
    if ( !jQuery.support.focusinBubbles ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0,
                handler = function( event ) {
                    jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
                };

            jQuery.event.special[ fix ] = {
                setup: function() {
                    if ( attaches++ === 0 ) {
                        document.addEventListener( orig, handler, true );
                    }
                },
                teardown: function() {
                    if ( --attaches === 0 ) {
                        document.removeEventListener( orig, handler, true );
                    }
                }
            };
        });
    }

    jQuery.fn.extend({

        on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
            var origFn, type;

            // Types can be a map of types/handlers
            if ( typeof types === "object" ) {
                // ( types-Object, selector, data )
                if ( typeof selector !== "string" ) { // && selector != null
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for ( type in types ) {
                    this.on( type, selector, data, types[ type ], one );
                }
                return this;
            }

            if ( data == null && fn == null ) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if ( fn == null ) {
                if ( typeof selector === "string" ) {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if ( fn === false ) {
                fn = returnFalse;
            } else if ( !fn ) {
                return this;
            }

            if ( one === 1 ) {
                origFn = fn;
                fn = function( event ) {
                    // Can use an empty set, since event contains the info
                    jQuery().off( event );
                    return origFn.apply( this, arguments );
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
            }
            return this.each( function() {
                jQuery.event.add( this, types, fn, data, selector );
            });
        },
        one: function( types, selector, data, fn ) {
            return this.on( types, selector, data, fn, 1 );
        },
        off: function( types, selector, fn ) {
            var handleObj, type;
            if ( types && types.preventDefault && types.handleObj ) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery( types.delegateTarget ).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if ( typeof types === "object" ) {
                // ( types-object [, selector] )
                for ( type in types ) {
                    this.off( type, selector, types[ type ] );
                }
                return this;
            }
            if ( selector === false || typeof selector === "function" ) {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if ( fn === false ) {
                fn = returnFalse;
            }
            return this.each(function() {
                jQuery.event.remove( this, types, fn, selector );
            });
        },

        bind: function( types, data, fn ) {
            return this.on( types, null, data, fn );
        },
        unbind: function( types, fn ) {
            return this.off( types, null, fn );
        },

        live: function( types, data, fn ) {
            jQuery( this.context ).on( types, this.selector, data, fn );
            return this;
        },
        die: function( types, fn ) {
            jQuery( this.context ).off( types, this.selector || "**", fn );
            return this;
        },

        delegate: function( selector, types, data, fn ) {
            return this.on( types, selector, data, fn );
        },
        undelegate: function( selector, types, fn ) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
        },

        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },
        triggerHandler: function( type, data ) {
            if ( this[0] ) {
                return jQuery.event.trigger( type, data, this[0], true );
            }
        },

        toggle: function( fn ) {
            // Save reference to arguments for access in closure
            var args = arguments,
                guid = fn.guid || jQuery.guid++,
                i = 0,
                toggler = function( event ) {
                    // Figure out which function to execute
                    var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                    jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                    // Make sure that clicks stop
                    event.preventDefault();

                    // and execute the function
                    return args[ lastToggle ].apply( this, arguments ) || false;
                };

            // link all the functions, so any of them can unbind this click handler
            toggler.guid = guid;
            while ( i < args.length ) {
                args[ i++ ].guid = guid;
            }

            return this.click( toggler );
        },

        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
    });

    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            if ( fn == null ) {
                fn = data;
                data = null;
            }

            return arguments.length > 0 ?
                this.on( name, null, data, fn ) :
                this.trigger( name );
        };

        if ( rkeyEvent.test( name ) ) {
            jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
        }

        if ( rmouseEvent.test( name ) ) {
            jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
        }
    });
    /*!
     * Sizzle CSS Selector Engine
     * Copyright 2012 jQuery Foundation and other contributors
     * Released under the MIT license
     * http://sizzlejs.com/
     */
    (function( window, undefined ) {

        var cachedruns,
            assertGetIdNotName,
            Expr,
            getText,
            isXML,
            contains,
            compile,
            sortOrder,
            hasDuplicate,
            outermostContext,

            baseHasDuplicate = true,
            strundefined = "undefined",

            expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

            Token = String,
            document = window.document,
            docElem = document.documentElement,
            dirruns = 0,
            done = 0,
            pop = [].pop,
            push = [].push,
            slice = [].slice,
            // Use a stripped-down indexOf if a native one is unavailable
            indexOf = [].indexOf || function( elem ) {
                    var i = 0,
                        len = this.length;
                    for ( ; i < len; i++ ) {
                        if ( this[i] === elem ) {
                            return i;
                        }
                    }
                    return -1;
                },

            // Augment a function for special use by Sizzle
            markFunction = function( fn, value ) {
                fn[ expando ] = value == null || value;
                return fn;
            },

            createCache = function() {
                var cache = {},
                    keys = [];

                return markFunction(function( key, value ) {
                    // Only keep the most recent entries
                    if ( keys.push( key ) > Expr.cacheLength ) {
                        delete cache[ keys.shift() ];
                    }

                    return (cache[ key ] = value);
                }, cache );
            },

            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),

            // Regex

            // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
            // http://www.w3.org/TR/css3-syntax/#characters
            characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

            // Loosely modeled on CSS identifier characters
            // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
            // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = characterEncoding.replace( "w", "w#" ),

            // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
            operators = "([*^$|!~]?=)",
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
                "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

            // Prefer arguments not in parens/brackets,
            //   then attribute selectors and non-pseudos (denoted by :),
            //   then anything else
            // These preferences are here to reduce the number of selectors
            //   needing tokenize in the PSEUDO preFilter
            pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

            // For matchExpr.POS and matchExpr.needsContext
            pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
                "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

            // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

            rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
            rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
            rpseudo = new RegExp( pseudos ),

            // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

            rnot = /^:not/,
            rsibling = /[\x20\t\r\n\f]*[+~]/,
            rendsWithNot = /:not\($/,

            rheader = /h\d/i,
            rinputs = /input|select|textarea|button/i,

            rbackslash = /\\(?!\\)/g,

            matchExpr = {
                "ID": new RegExp( "^#(" + characterEncoding + ")" ),
                "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
                "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
                "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
                "ATTR": new RegExp( "^" + attributes ),
                "PSEUDO": new RegExp( "^" + pseudos ),
                "POS": new RegExp( pos, "i" ),
                "CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                    "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                // For use in libraries implementing .is()
                "needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
            },

            // Support

            // Used for testing something on an element
            assert = function( fn ) {
                var div = document.createElement("div");

                try {
                    return fn( div );
                } catch (e) {
                    return false;
                } finally {
                    // release memory in IE
                    div = null;
                }
            },

            // Check if getElementsByTagName("*") returns only elements
            assertTagNameNoComments = assert(function( div ) {
                div.appendChild( document.createComment("") );
                return !div.getElementsByTagName("*").length;
            }),

            // Check if getAttribute returns normalized href attributes
            assertHrefNotNormalized = assert(function( div ) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
                    div.firstChild.getAttribute("href") === "#";
            }),

            // Check if attributes should be retrieved by attribute nodes
            assertAttributes = assert(function( div ) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                // IE8 returns a string for some attributes even when not present
                return type !== "boolean" && type !== "string";
            }),

            // Check if getElementsByClassName can be trusted
            assertUsableClassName = assert(function( div ) {
                // Opera can't find a second classname (in 9.6)
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
                if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
                    return false;
                }

                // Safari 3.2 caches class attributes and doesn't catch changes
                div.lastChild.className = "e";
                return div.getElementsByClassName("e").length === 2;
            }),

            // Check if getElementById returns elements by name
            // Check if getElementsByName privileges form controls or returns elements by ID
            assertUsableName = assert(function( div ) {
                // Inject content
                div.id = expando + 0;
                div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
                docElem.insertBefore( div, docElem.firstChild );

                // Test
                var pass = document.getElementsByName &&
                    // buggy browsers will return fewer than the correct 2
                    document.getElementsByName( expando ).length === 2 +
                    // buggy browsers will return more than the correct 0
                    document.getElementsByName( expando + 0 ).length;
                assertGetIdNotName = !document.getElementById( expando );

                // Cleanup
                docElem.removeChild( div );

                return pass;
            });

// If slice is not available, provide a backup
        try {
            slice.call( docElem.childNodes, 0 )[0].nodeType;
        } catch ( e ) {
            slice = function( i ) {
                var elem,
                    results = [];
                for ( ; (elem = this[i]); i++ ) {
                    results.push( elem );
                }
                return results;
            };
        }

        function Sizzle( selector, context, results, seed ) {
            results = results || [];
            context = context || document;
            var match, elem, xml, m,
                nodeType = context.nodeType;

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            if ( nodeType !== 1 && nodeType !== 9 ) {
                return [];
            }

            xml = isXML( context );

            if ( !xml && !seed ) {
                if ( (match = rquickExpr.exec( selector )) ) {
                    // Speed-up: Sizzle("#ID")
                    if ( (m = match[1]) ) {
                        if ( nodeType === 9 ) {
                            elem = context.getElementById( m );
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if ( elem && elem.parentNode ) {
                                // Handle the case where IE, Opera, and Webkit return items
                                // by name instead of ID
                                if ( elem.id === m ) {
                                    results.push( elem );
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            // Context is not a document
                            if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                                contains( context, elem ) && elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        }

                        // Speed-up: Sizzle("TAG")
                    } else if ( match[2] ) {
                        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
                        return results;

                        // Speed-up: Sizzle(".CLASS")
                    } else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
                        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
                        return results;
                    }
                }
            }

            // All others
            return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
        }

        Sizzle.matches = function( expr, elements ) {
            return Sizzle( expr, null, null, elements );
        };

        Sizzle.matchesSelector = function( elem, expr ) {
            return Sizzle( expr, null, null, [ elem ] ).length > 0;
        };

// Returns a function to use in pseudos for input types
        function createInputPseudo( type ) {
            return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

// Returns a function to use in pseudos for buttons
        function createButtonPseudo( type ) {
            return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

// Returns a function to use in pseudos for positionals
        function createPositionalPseudo( fn ) {
            return markFunction(function( argument ) {
                argument = +argument;
                return markFunction(function( seed, matches ) {
                    var j,
                        matchIndexes = fn( [], seed.length, argument ),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while ( i-- ) {
                        if ( seed[ (j = matchIndexes[i]) ] ) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function( elem ) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if ( nodeType ) {
                if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (see #11153)
                    if ( typeof elem.textContent === "string" ) {
                        return elem.textContent;
                    } else {
                        // Traverse its children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                            ret += getText( elem );
                        }
                    }
                } else if ( nodeType === 3 || nodeType === 4 ) {
                    return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes
            } else {

                // If no nodeType, this is expected to be an array
                for ( ; (node = elem[i]); i++ ) {
                    // Do not traverse comment nodes
                    ret += getText( node );
                }
            }
            return ret;
        };

        isXML = Sizzle.isXML = function( elem ) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

// Element contains another
        contains = Sizzle.contains = docElem.contains ?
            function( a, b ) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
            } :
            docElem.compareDocumentPosition ?
                function( a, b ) {
                    return b && !!( a.compareDocumentPosition( b ) & 16 );
                } :
                function( a, b ) {
                    while ( (b = b.parentNode) ) {
                        if ( b === a ) {
                            return true;
                        }
                    }
                    return false;
                };

        Sizzle.attr = function( elem, name ) {
            var val,
                xml = isXML( elem );

            if ( !xml ) {
                name = name.toLowerCase();
            }
            if ( (val = Expr.attrHandle[ name ]) ) {
                return val( elem );
            }
            if ( xml || assertAttributes ) {
                return elem.getAttribute( name );
            }
            val = elem.getAttributeNode( name );
            return val ?
                typeof elem[ name ] === "boolean" ?
                    elem[ name ] ? name : null :
                    val.specified ? val.value : null :
                null;
        };

        Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            // IE6/7 return a modified href
            attrHandle: assertHrefNotNormalized ?
                {} :
                {
                    "href": function( elem ) {
                        return elem.getAttribute( "href", 2 );
                    },
                    "type": function( elem ) {
                        return elem.getAttribute("type");
                    }
                },

            find: {
                "ID": assertGetIdNotName ?
                    function( id, context, xml ) {
                        if ( typeof context.getElementById !== strundefined && !xml ) {
                            var m = context.getElementById( id );
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            return m && m.parentNode ? [m] : [];
                        }
                    } :
                    function( id, context, xml ) {
                        if ( typeof context.getElementById !== strundefined && !xml ) {
                            var m = context.getElementById( id );

                            return m ?
                                m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                                    [m] :
                                    undefined :
                                [];
                        }
                    },

                "TAG": assertTagNameNoComments ?
                    function( tag, context ) {
                        if ( typeof context.getElementsByTagName !== strundefined ) {
                            return context.getElementsByTagName( tag );
                        }
                    } :
                    function( tag, context ) {
                        var results = context.getElementsByTagName( tag );

                        // Filter out possible comments
                        if ( tag === "*" ) {
                            var elem,
                                tmp = [],
                                i = 0;

                            for ( ; (elem = results[i]); i++ ) {
                                if ( elem.nodeType === 1 ) {
                                    tmp.push( elem );
                                }
                            }

                            return tmp;
                        }
                        return results;
                    },

                "NAME": assertUsableName && function( tag, context ) {
                    if ( typeof context.getElementsByName !== strundefined ) {
                        return context.getElementsByName( name );
                    }
                },

                "CLASS": assertUsableClassName && function( className, context, xml ) {
                    if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
                        return context.getElementsByClassName( className );
                    }
                }
            },

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function( match ) {
                    match[1] = match[1].replace( rbackslash, "" );

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

                    if ( match[2] === "~=" ) {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice( 0, 4 );
                },

                "CHILD": function( match ) {
                    /* matches from matchExpr["CHILD"]
                     1 type (only|nth|...)
                     2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                     3 xn-component of xn+y argument ([+-]?\d*n|)
                     4 sign of xn-component
                     5 x of xn-component
                     6 sign of y-component
                     7 y of y-component
                     */
                    match[1] = match[1].toLowerCase();

                    if ( match[1] === "nth" ) {
                        // nth-child requires argument
                        if ( !match[2] ) {
                            Sizzle.error( match[0] );
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
                        match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

                        // other types prohibit arguments
                    } else if ( match[2] ) {
                        Sizzle.error( match[0] );
                    }

                    return match;
                },

                "PSEUDO": function( match ) {
                    var unquoted, excess;
                    if ( matchExpr["CHILD"].test( match[0] ) ) {
                        return null;
                    }

                    if ( match[3] ) {
                        match[2] = match[3];
                    } else if ( (unquoted = match[4]) ) {
                        // Only check arguments that contain a pseudo
                        if ( rpseudo.test(unquoted) &&
                            // Get excess from tokenize (recursively)
                            (excess = tokenize( unquoted, true )) &&
                            // advance to the next closing parenthesis
                            (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                            // excess is a negative index
                            unquoted = unquoted.slice( 0, excess );
                            match[0] = match[0].slice( 0, excess );
                        }
                        match[2] = unquoted;
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice( 0, 3 );
                }
            },

            filter: {
                "ID": assertGetIdNotName ?
                    function( id ) {
                        id = id.replace( rbackslash, "" );
                        return function( elem ) {
                            return elem.getAttribute("id") === id;
                        };
                    } :
                    function( id ) {
                        id = id.replace( rbackslash, "" );
                        return function( elem ) {
                            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                            return node && node.value === id;
                        };
                    },

                "TAG": function( nodeName ) {
                    if ( nodeName === "*" ) {
                        return function() { return true; };
                    }
                    nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

                    return function( elem ) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },

                "CLASS": function( className ) {
                    var pattern = classCache[ expando ][ className ];
                    if ( !pattern ) {
                        pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
                    }
                    return function( elem ) {
                        return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
                    };
                },

                "ATTR": function( name, operator, check ) {
                    return function( elem, context ) {
                        var result = Sizzle.attr( elem, name );

                        if ( result == null ) {
                            return operator === "!=";
                        }
                        if ( !operator ) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
                            operator === "!=" ? result !== check :
                                operator === "^=" ? check && result.indexOf( check ) === 0 :
                                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                                        operator === "$=" ? check && result.substr( result.length - check.length ) === check :
                                            operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                                                operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
                                                    false;
                    };
                },

                "CHILD": function( type, argument, first, last ) {

                    if ( type === "nth" ) {
                        return function( elem ) {
                            var node, diff,
                                parent = elem.parentNode;

                            if ( first === 1 && last === 0 ) {
                                return true;
                            }

                            if ( parent ) {
                                diff = 0;
                                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                    if ( node.nodeType === 1 ) {
                                        diff++;
                                        if ( elem === node ) {
                                            break;
                                        }
                                    }
                                }
                            }

                            // Incorporate the offset (or cast to NaN), then check against cycle size
                            diff -= last;
                            return diff === first || ( diff % first === 0 && diff / first >= 0 );
                        };
                    }

                    return function( elem ) {
                        var node = elem;

                        switch ( type ) {
                            case "only":
                            case "first":
                                while ( (node = node.previousSibling) ) {
                                    if ( node.nodeType === 1 ) {
                                        return false;
                                    }
                                }

                                if ( type === "first" ) {
                                    return true;
                                }

                                node = elem;

                            /* falls through */
                            case "last":
                                while ( (node = node.nextSibling) ) {
                                    if ( node.nodeType === 1 ) {
                                        return false;
                                    }
                                }

                                return true;
                        }
                    };
                },

                "PSEUDO": function( pseudo, argument ) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                            Sizzle.error( "unsupported pseudo: " + pseudo );

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if ( fn[ expando ] ) {
                        return fn( argument );
                    }

                    // But maintain support for old signatures
                    if ( fn.length > 1 ) {
                        args = [ pseudo, pseudo, "", argument ];
                        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                            markFunction(function( seed, matches ) {
                                var idx,
                                    matched = fn( seed, argument ),
                                    i = matched.length;
                                while ( i-- ) {
                                    idx = indexOf.call( seed, matched[i] );
                                    seed[ idx ] = !( matches[ idx ] = matched[i] );
                                }
                            }) :
                            function( elem ) {
                                return fn( elem, 0, args );
                            };
                    }

                    return fn;
                }
            },

            pseudos: {
                "not": markFunction(function( selector ) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile( selector.replace( rtrim, "$1" ) );

                    return matcher[ expando ] ?
                        markFunction(function( seed, matches, context, xml ) {
                            var elem,
                                unmatched = matcher( seed, null, xml, [] ),
                                i = seed.length;

                            // Match elements unmatched by `matcher`
                            while ( i-- ) {
                                if ( (elem = unmatched[i]) ) {
                                    seed[i] = !(matches[i] = elem);
                                }
                            }
                        }) :
                        function( elem, context, xml ) {
                            input[0] = elem;
                            matcher( input, null, xml, results );
                            return !results.pop();
                        };
                }),

                "has": markFunction(function( selector ) {
                    return function( elem ) {
                        return Sizzle( selector, elem ).length > 0;
                    };
                }),

                "contains": markFunction(function( text ) {
                    return function( elem ) {
                        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                    };
                }),

                "enabled": function( elem ) {
                    return elem.disabled === false;
                },

                "disabled": function( elem ) {
                    return elem.disabled === true;
                },

                "checked": function( elem ) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function( elem ) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if ( elem.parentNode ) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                "parent": function( elem ) {
                    return !Expr.pseudos["empty"]( elem );
                },

                "empty": function( elem ) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                    //   not comment, processing instructions, or others
                    // Thanks to Diego Perini for the nodeName shortcut
                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                    var nodeType;
                    elem = elem.firstChild;
                    while ( elem ) {
                        if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
                            return false;
                        }
                        elem = elem.nextSibling;
                    }
                    return true;
                },

                "header": function( elem ) {
                    return rheader.test( elem.nodeName );
                },

                "text": function( elem ) {
                    var type, attr;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" &&
                        (type = elem.type) === "text" &&
                        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
                },

                // Input types
                "radio": createInputPseudo("radio"),
                "checkbox": createInputPseudo("checkbox"),
                "file": createInputPseudo("file"),
                "password": createInputPseudo("password"),
                "image": createInputPseudo("image"),

                "submit": createButtonPseudo("submit"),
                "reset": createButtonPseudo("reset"),

                "button": function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "input": function( elem ) {
                    return rinputs.test( elem.nodeName );
                },

                "focus": function( elem ) {
                    var doc = elem.ownerDocument;
                    return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
                },

                "active": function( elem ) {
                    return elem === elem.ownerDocument.activeElement;
                },

                // Positional types
                "first": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    return [ 0 ];
                }),

                "last": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    return [ length - 1 ];
                }),

                "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    return [ argument < 0 ? argument + length : argument ];
                }),

                "even": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    for ( var i = 0; i < length; i += 2 ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    for ( var i = 1; i < length; i += 2 ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                })
            }
        };

        function siblingCheck( a, b, ret ) {
            if ( a === b ) {
                return ret;
            }

            var cur = a.nextSibling;

            while ( cur ) {
                if ( cur === b ) {
                    return -1;
                }

                cur = cur.nextSibling;
            }

            return 1;
        }

        sortOrder = docElem.compareDocumentPosition ?
            function( a, b ) {
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;
                }

                return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
                        a.compareDocumentPosition :
                    a.compareDocumentPosition(b) & 4
                ) ? -1 : 1;
            } :
            function( a, b ) {
                // The nodes are identical, we can exit early
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;

                    // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if ( a.sourceIndex && b.sourceIndex ) {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al, bl,
                    ap = [],
                    bp = [],
                    aup = a.parentNode,
                    bup = b.parentNode,
                    cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if ( aup === bup ) {
                    return siblingCheck( a, b );

                    // If no parents were found then the nodes are disconnected
                } else if ( !aup ) {
                    return -1;

                } else if ( !bup ) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while ( cur ) {
                    ap.unshift( cur );
                    cur = cur.parentNode;
                }

                cur = bup;

                while ( cur ) {
                    bp.unshift( cur );
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for ( var i = 0; i < al && i < bl; i++ ) {
                    if ( ap[i] !== bp[i] ) {
                        return siblingCheck( ap[i], bp[i] );
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
                    siblingCheck( a, bp[i], -1 ) :
                    siblingCheck( ap[i], b, 1 );
            };

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
        [0, 0].sort( sortOrder );
        baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
        Sizzle.uniqueSort = function( results ) {
            var elem,
                i = 1;

            hasDuplicate = baseHasDuplicate;
            results.sort( sortOrder );

            if ( hasDuplicate ) {
                for ( ; (elem = results[i]); i++ ) {
                    if ( elem === results[ i - 1 ] ) {
                        results.splice( i--, 1 );
                    }
                }
            }

            return results;
        };

        Sizzle.error = function( msg ) {
            throw new Error( "Syntax error, unrecognized expression: " + msg );
        };

        function tokenize( selector, parseOnly ) {
            var matched, match, tokens, type, soFar, groups, preFilters,
                cached = tokenCache[ expando ][ selector ];

            if ( cached ) {
                return parseOnly ? 0 : cached.slice( 0 );
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while ( soFar ) {

                // Comma and first run
                if ( !matched || (match = rcomma.exec( soFar )) ) {
                    if ( match ) {
                        soFar = soFar.slice( match[0].length );
                    }
                    groups.push( tokens = [] );
                }

                matched = false;

                // Combinators
                if ( (match = rcombinators.exec( soFar )) ) {
                    tokens.push( matched = new Token( match.shift() ) );
                    soFar = soFar.slice( matched.length );

                    // Cast descendant combinators to space
                    matched.type = match[0].replace( rtrim, " " );
                }

                // Filters
                for ( type in Expr.filter ) {
                    if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                        // The last two arguments here are (context, xml) for backCompat
                        (match = preFilters[ type ]( match, document, true ))) ) {

                        tokens.push( matched = new Token( match.shift() ) );
                        soFar = soFar.slice( matched.length );
                        matched.type = type;
                        matched.matches = match;
                    }
                }

                if ( !matched ) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
                soFar.length :
                soFar ?
                    Sizzle.error( selector ) :
                    // Cache the tokens
                    tokenCache( selector, groups ).slice( 0 );
        }

        function addCombinator( matcher, combinator, base ) {
            var dir = combinator.dir,
                checkNonElements = base && combinator.dir === "parentNode",
                doneName = done++;

            return combinator.first ?
                // Check against closest ancestor/preceding element
                function( elem, context, xml ) {
                    while ( (elem = elem[ dir ]) ) {
                        if ( checkNonElements || elem.nodeType === 1  ) {
                            return matcher( elem, context, xml );
                        }
                    }
                } :

                // Check against all ancestor/preceding elements
                function( elem, context, xml ) {
                    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                    if ( !xml ) {
                        var cache,
                            dirkey = dirruns + " " + doneName + " ",
                            cachedkey = dirkey + cachedruns;
                        while ( (elem = elem[ dir ]) ) {
                            if ( checkNonElements || elem.nodeType === 1 ) {
                                if ( (cache = elem[ expando ]) === cachedkey ) {
                                    return elem.sizset;
                                } else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
                                    if ( elem.sizset ) {
                                        return elem;
                                    }
                                } else {
                                    elem[ expando ] = cachedkey;
                                    if ( matcher( elem, context, xml ) ) {
                                        elem.sizset = true;
                                        return elem;
                                    }
                                    elem.sizset = false;
                                }
                            }
                        }
                    } else {
                        while ( (elem = elem[ dir ]) ) {
                            if ( checkNonElements || elem.nodeType === 1 ) {
                                if ( matcher( elem, context, xml ) ) {
                                    return elem;
                                }
                            }
                        }
                    }
                };
        }

        function elementMatcher( matchers ) {
            return matchers.length > 1 ?
                function( elem, context, xml ) {
                    var i = matchers.length;
                    while ( i-- ) {
                        if ( !matchers[i]( elem, context, xml ) ) {
                            return false;
                        }
                    }
                    return true;
                } :
                matchers[0];
        }

        function condense( unmatched, map, filter, context, xml ) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for ( ; i < len; i++ ) {
                if ( (elem = unmatched[i]) ) {
                    if ( !filter || filter( elem, context, xml ) ) {
                        newUnmatched.push( elem );
                        if ( mapped ) {
                            map.push( i );
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
            if ( postFilter && !postFilter[ expando ] ) {
                postFilter = setMatcher( postFilter );
            }
            if ( postFinder && !postFinder[ expando ] ) {
                postFinder = setMatcher( postFinder, postSelector );
            }
            return markFunction(function( seed, results, context, xml ) {
                // Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
                if ( seed && postFinder ) {
                    return;
                }

                var i, elem, postFilterIn,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,

                    // Get initial elements from seed or context
                    elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

                    // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn = preFilter && ( seed || !selector ) ?
                        condense( elems, preMap, preFilter, context, xml ) :
                        elems,

                    matcherOut = matcher ?
                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                            results :
                        matcherIn;

                // Find primary matches
                if ( matcher ) {
                    matcher( matcherIn, matcherOut, context, xml );
                }

                // Apply postFilter
                if ( postFilter ) {
                    postFilterIn = condense( matcherOut, postMap );
                    postFilter( postFilterIn, [], context, xml );

                    // Un-match failing elements by moving them back to matcherIn
                    i = postFilterIn.length;
                    while ( i-- ) {
                        if ( (elem = postFilterIn[i]) ) {
                            matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                        }
                    }
                }

                // Keep seed and results synchronized
                if ( seed ) {
                    // Ignore postFinder because it can't coexist with seed
                    i = preFilter && matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) ) {
                            seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
                        }
                    }
                } else {
                    matcherOut = condense(
                        matcherOut === results ?
                            matcherOut.splice( preexisting, matcherOut.length ) :
                            matcherOut
                    );
                    if ( postFinder ) {
                        postFinder( null, results, matcherOut, xml );
                    } else {
                        push.apply( results, matcherOut );
                    }
                }
            });
        }

        function matcherFromTokens( tokens ) {
            var checkContext, matcher, j,
                len = tokens.length,
                leadingRelative = Expr.relative[ tokens[0].type ],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,

                // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator( function( elem ) {
                    return elem === checkContext;
                }, implicitRelative, true ),
                matchAnyContext = addCombinator( function( elem ) {
                    return indexOf.call( checkContext, elem ) > -1;
                }, implicitRelative, true ),
                matchers = [ function( elem, context, xml ) {
                    return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                            (checkContext = context).nodeType ?
                                matchContext( elem, context, xml ) :
                                matchAnyContext( elem, context, xml ) );
                } ];

            for ( ; i < len; i++ ) {
                if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                    matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
                } else {
                    // The concatenated values are (context, xml) for backCompat
                    matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                    // Return special upon seeing a positional matcher
                    if ( matcher[ expando ] ) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for ( ; j < len; j++ ) {
                            if ( Expr.relative[ tokens[j].type ] ) {
                                break;
                            }
                        }
                        return setMatcher(
                            i > 1 && elementMatcher( matchers ),
                            i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
                            matcher,
                            i < j && matcherFromTokens( tokens.slice( i, j ) ),
                            j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                            j < len && tokens.join("")
                        );
                    }
                    matchers.push( matcher );
                }
            }

            return elementMatcher( matchers );
        }

        function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function( seed, context, xml, results, expandContext ) {
                    var elem, j, matcher,
                        setMatched = [],
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        outermost = expandContext != null,
                        contextBackup = outermostContext,
                        // We must always have either seed elements or context
                        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
                        // Nested matchers should use non-integer dirruns
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

                    if ( outermost ) {
                        outermostContext = context !== document && context;
                        cachedruns = superMatcher.el;
                    }

                    // Add elements passing elementMatchers directly to results
                    for ( ; (elem = elems[i]) != null; i++ ) {
                        if ( byElement && elem ) {
                            for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
                                if ( matcher( elem, context, xml ) ) {
                                    results.push( elem );
                                    break;
                                }
                            }
                            if ( outermost ) {
                                dirruns = dirrunsUnique;
                                cachedruns = ++superMatcher.el;
                            }
                        }

                        // Track unmatched elements for set filters
                        if ( bySet ) {
                            // They will have gone through all possible matchers
                            if ( (elem = !matcher && elem) ) {
                                matchedCount--;
                            }

                            // Lengthen the array for every element, matched or not
                            if ( seed ) {
                                unmatched.push( elem );
                            }
                        }
                    }

                    // Apply set filters to unmatched elements
                    matchedCount += i;
                    if ( bySet && i !== matchedCount ) {
                        for ( j = 0; (matcher = setMatchers[j]); j++ ) {
                            matcher( unmatched, setMatched, context, xml );
                        }

                        if ( seed ) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if ( matchedCount > 0 ) {
                                while ( i-- ) {
                                    if ( !(unmatched[i] || setMatched[i]) ) {
                                        setMatched[i] = pop.call( results );
                                    }
                                }
                            }

                            // Discard index placeholder values to get only actual matches
                            setMatched = condense( setMatched );
                        }

                        // Add matches to results
                        push.apply( results, setMatched );

                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if ( outermost && !seed && setMatched.length > 0 &&
                            ( matchedCount + setMatchers.length ) > 1 ) {

                            Sizzle.uniqueSort( results );
                        }
                    }

                    // Override manipulation of globals by nested matchers
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }

                    return unmatched;
                };

            superMatcher.el = 0;
            return bySet ?
                markFunction( superMatcher ) :
                superMatcher;
        }

        compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[ expando ][ selector ];

            if ( !cached ) {
                // Generate a function of recursive functions that can be used to check each element
                if ( !group ) {
                    group = tokenize( selector );
                }
                i = group.length;
                while ( i-- ) {
                    cached = matcherFromTokens( group[i] );
                    if ( cached[ expando ] ) {
                        setMatchers.push( cached );
                    } else {
                        elementMatchers.push( cached );
                    }
                }

                // Cache the compiled function
                cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
            }
            return cached;
        };

        function multipleContexts( selector, contexts, results, seed ) {
            var i = 0,
                len = contexts.length;
            for ( ; i < len; i++ ) {
                Sizzle( selector, contexts[i], results, seed );
            }
            return results;
        }

        function select( selector, context, results, seed, xml ) {
            var i, tokens, token, type, find,
                match = tokenize( selector ),
                j = match.length;

            if ( !seed ) {
                // Try to minimize operations if there is only one group
                if ( match.length === 1 ) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice( 0 );
                    if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        context.nodeType === 9 && !xml &&
                        Expr.relative[ tokens[1].type ] ) {

                        context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
                        if ( !context ) {
                            return results;
                        }

                        selector = selector.slice( tokens.shift().length );
                    }

                    // Fetch a seed set for right-to-left matching
                    for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if ( Expr.relative[ (type = token.type) ] ) {
                            break;
                        }
                        if ( (find = Expr.find[ type ]) ) {
                            // Search, expanding context for leading sibling combinators
                            if ( (seed = find(
                                    token.matches[0].replace( rbackslash, "" ),
                                    rsibling.test( tokens[0].type ) && context.parentNode || context,
                                    xml
                                )) ) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice( i, 1 );
                                selector = seed.length && tokens.join("");
                                if ( !selector ) {
                                    push.apply( results, slice.call( seed, 0 ) );
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }
            }

            // Compile and execute a filtering function
            // Provide `match` to avoid retokenization if we modified the selector above
            compile( selector, match )(
                seed,
                context,
                xml,
                results,
                rsibling.test( selector )
            );
            return results;
        }

        if ( document.querySelectorAll ) {
            (function() {
                var disconnectedMatch,
                    oldSelect = select,
                    rescape = /'|\\/g,
                    rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

                    // qSa(:focus) reports false when true (Chrome 21),
                    // A support test would require too much code (would include document ready)
                    rbuggyQSA = [":focus"],

                    // matchesSelector(:focus) reports false when true (Chrome 21),
                    // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                    // A support test would require too much code (would include document ready)
                    // just skip matchesSelector for :active
                    rbuggyMatches = [ ":active", ":focus" ],
                    matches = docElem.matchesSelector ||
                        docElem.mozMatchesSelector ||
                        docElem.webkitMatchesSelector ||
                        docElem.oMatchesSelector ||
                        docElem.msMatchesSelector;

                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function( div ) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explictly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    div.innerHTML = "<select><option selected=''></option></select>";

                    // IE8 - Some boolean attributes are not treated correctly
                    if ( !div.querySelectorAll("[selected]").length ) {
                        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here (do not put tests after this one)
                    if ( !div.querySelectorAll(":checked").length ) {
                        rbuggyQSA.push(":checked");
                    }
                });

                assert(function( div ) {

                    // Opera 10-12/IE9 - ^= $= *= and empty values
                    // Should not select anything
                    div.innerHTML = "<p test=''></p>";
                    if ( div.querySelectorAll("[test^='']").length ) {
                        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here (do not put tests after this one)
                    div.innerHTML = "<input type='hidden'/>";
                    if ( !div.querySelectorAll(":enabled").length ) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }
                });

                // rbuggyQSA always contains :focus, so no need for a length check
                rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

                select = function( selector, context, results, seed, xml ) {
                    // Only use querySelectorAll when not filtering,
                    // when this is not xml,
                    // and when no QSA bugs apply
                    if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
                        var groups, i,
                            old = true,
                            nid = expando,
                            newContext = context,
                            newSelector = context.nodeType === 9 && selector;

                        // qSA works strangely on Element-rooted queries
                        // We can work around this by specifying an extra ID on the root
                        // and working up from there (Thanks to Andrew Dupont for the technique)
                        // IE 8 doesn't work on object elements
                        if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                            groups = tokenize( selector );

                            if ( (old = context.getAttribute("id")) ) {
                                nid = old.replace( rescape, "\\$&" );
                            } else {
                                context.setAttribute( "id", nid );
                            }
                            nid = "[id='" + nid + "'] ";

                            i = groups.length;
                            while ( i-- ) {
                                groups[i] = nid + groups[i].join("");
                            }
                            newContext = rsibling.test( selector ) && context.parentNode || context;
                            newSelector = groups.join(",");
                        }

                        if ( newSelector ) {
                            try {
                                push.apply( results, slice.call( newContext.querySelectorAll(
                                    newSelector
                                ), 0 ) );
                                return results;
                            } catch(qsaError) {
                            } finally {
                                if ( !old ) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }

                    return oldSelect( selector, context, results, seed, xml );
                };

                if ( matches ) {
                    assert(function( div ) {
                        // Check to see if it's possible to do matchesSelector
                        // on a disconnected node (IE 9)
                        disconnectedMatch = matches.call( div, "div" );

                        // This should fail with an exception
                        // Gecko does not error, returns false instead
                        try {
                            matches.call( div, "[test!='']:sizzle" );
                            rbuggyMatches.push( "!=", pseudos );
                        } catch ( e ) {}
                    });

                    // rbuggyMatches always contains :active and :focus, so no need for a length check
                    rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

                    Sizzle.matchesSelector = function( elem, expr ) {
                        // Make sure that attribute selectors are quoted
                        expr = expr.replace( rattributeQuotes, "='$1']" );

                        // rbuggyMatches always contains :active, so no need for an existence check
                        if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
                            try {
                                var ret = matches.call( elem, expr );

                                // IE 9's matchesSelector returns false on disconnected nodes
                                if ( ret || disconnectedMatch ||
                                    // As well, disconnected nodes are said to be in a document
                                    // fragment in IE 9
                                    elem.document && elem.document.nodeType !== 11 ) {
                                    return ret;
                                }
                            } catch(e) {}
                        }

                        return Sizzle( expr, null, null, [ elem ] ).length > 0;
                    };
                }
            })();
        }

// Deprecated
        Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
        function setFilters() {}
        Expr.filters = setFilters.prototype = Expr.pseudos;
        Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
        Sizzle.attr = jQuery.attr;
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })( window );
    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        isSimple = /^.[^:#\[\.,]*$/,
        rneedsContext = jQuery.expr.match.needsContext,
        // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend({
        find: function( selector ) {
            var i, l, length, n, r, ret,
                self = this;

            if ( typeof selector !== "string" ) {
                return jQuery( selector ).filter(function() {
                    for ( i = 0, l = self.length; i < l; i++ ) {
                        if ( jQuery.contains( self[ i ], this ) ) {
                            return true;
                        }
                    }
                });
            }

            ret = this.pushStack( "", "find", selector );

            for ( i = 0, l = this.length; i < l; i++ ) {
                length = ret.length;
                jQuery.find( selector, this[i], ret );

                if ( i > 0 ) {
                    // Make sure that the results are unique
                    for ( n = length; n < ret.length; n++ ) {
                        for ( r = 0; r < length; r++ ) {
                            if ( ret[r] === ret[n] ) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        has: function( target ) {
            var i,
                targets = jQuery( target, this ),
                len = targets.length;

            return this.filter(function() {
                for ( i = 0; i < len; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },

        not: function( selector ) {
            return this.pushStack( winnow(this, selector, false), "not", selector);
        },

        filter: function( selector ) {
            return this.pushStack( winnow(this, selector, true), "filter", selector );
        },

        is: function( selector ) {
            return !!selector && (
                    typeof selector === "string" ?
                        // If this is a positional/relative selector, check membership in the returned set
                        // so $("p:first").is("p:last") won't return true for a doc with two "p".
                        rneedsContext.test( selector ) ?
                        jQuery( selector, this.context ).index( this[0] ) >= 0 :
                        jQuery.filter( selector, this ).length > 0 :
                    this.filter( selector ).length > 0 );
        },

        closest: function( selectors, context ) {
            var cur,
                i = 0,
                l = this.length,
                ret = [],
                pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
                    jQuery( selectors, context || this.context ) :
                    0;

            for ( ; i < l; i++ ) {
                cur = this[i];

                while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
                    if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                        ret.push( cur );
                        break;
                    }
                    cur = cur.parentNode;
                }
            }

            ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

            return this.pushStack( ret, "closest", selectors );
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {

            // No argument, return index in parent
            if ( !elem ) {
                return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
            }

            // index in selector
            if ( typeof elem === "string" ) {
                return jQuery.inArray( this[0], jQuery( elem ) );
            }

            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this );
        },

        add: function( selector, context ) {
            var set = typeof selector === "string" ?
                    jQuery( selector, context ) :
                    jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                all = jQuery.merge( this.get(), set );

            return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
                all :
                jQuery.unique( all ) );
        },

        addBack: function( selector ) {
            return this.add( selector == null ?
                this.prevObject : this.prevObject.filter(selector)
            );
        }
    });

    jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
    function isDisconnected( node ) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    function sibling( cur, dir ) {
        do {
            cur = cur[ dir ];
        } while ( cur && cur.nodeType !== 1 );

        return cur;
    }

    jQuery.each({
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return sibling( elem, "nextSibling" );
        },
        prev: function( elem ) {
            return sibling( elem, "previousSibling" );
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
        },
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
            elem.contentDocument || elem.contentWindow.document :
                jQuery.merge( [], elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var ret = jQuery.map( this, fn, until );

            if ( !runtil.test( name ) ) {
                selector = until;
            }

            if ( selector && typeof selector === "string" ) {
                ret = jQuery.filter( selector, ret );
            }

            ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

            if ( this.length > 1 && rparentsprev.test( name ) ) {
                ret = ret.reverse();
            }

            return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
        };
    });

    jQuery.extend({
        filter: function( expr, elems, not ) {
            if ( not ) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
                jQuery.find.matches(expr, elems);
        },

        dir: function( elem, dir, until ) {
            var matched = [],
                cur = elem[ dir ];

            while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
                if ( cur.nodeType === 1 ) {
                    matched.push( cur );
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function( n, elem ) {
            var r = [];

            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }

            return r;
        }
    });

// Implement the identical functionality for filter and not
    function winnow( elements, qualifier, keep ) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep(elements, function( elem, i ) {
                var retVal = !!qualifier.call( elem, i, elem );
                return retVal === keep;
            });

        } else if ( qualifier.nodeType ) {
            return jQuery.grep(elements, function( elem, i ) {
                return ( elem === qualifier ) === keep;
            });

        } else if ( typeof qualifier === "string" ) {
            var filtered = jQuery.grep(elements, function( elem ) {
                return elem.nodeType === 1;
            });

            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter( qualifier, filtered );
            }
        }

        return jQuery.grep(elements, function( elem, i ) {
            return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
        });
    }
    function createSafeFragment( document ) {
        var list = nodeNames.split( "|" ),
            safeFrag = document.createDocumentFragment();

        if ( safeFrag.createElement ) {
            while ( list.length ) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        rnocache = /<(?:script|object|embed|option|style)/i,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rcheckableType = /^(?:checkbox|radio)$/,
        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /\/(java|ecma)script/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            _default: [ 0, "", "" ]
        },
        safeFragment = createSafeFragment( document ),
        fragmentDiv = safeFragment.appendChild( document.createElement("div") );

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
    if ( !jQuery.support.htmlSerialize ) {
        wrapMap._default = [ 1, "X<div>", "</div>" ];
    }

    jQuery.fn.extend({
        text: function( value ) {
            return jQuery.access( this, function( value ) {
                return value === undefined ?
                    jQuery.text( this ) :
                    this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
            }, null, value, arguments.length );
        },

        wrapAll: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapAll( html.call(this, i) );
                });
            }

            if ( this[0] ) {
                // The elements to wrap the target around
                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

                if ( this[0].parentNode ) {
                    wrap.insertBefore( this[0] );
                }

                wrap.map(function() {
                    var elem = this;

                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append( this );
            }

            return this;
        },

        wrapInner: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapInner( html.call(this, i) );
                });
            }

            return this.each(function() {
                var self = jQuery( this ),
                    contents = self.contents();

                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    self.append( html );
                }
            });
        },

        wrap: function( html ) {
            var isFunction = jQuery.isFunction( html );

            return this.each(function(i) {
                jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
            });
        },

        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        },

        append: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 ) {
                    this.appendChild( elem );
                }
            });
        },

        prepend: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 ) {
                    this.insertBefore( elem, this.firstChild );
                }
            });
        },

        before: function() {
            if ( !isDisconnected( this[0] ) ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this );
                });
            }

            if ( arguments.length ) {
                var set = jQuery.clean( arguments );
                return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
            }
        },

        after: function() {
            if ( !isDisconnected( this[0] ) ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                });
            }

            if ( arguments.length ) {
                var set = jQuery.clean( arguments );
                return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
            }
        },

        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            var elem,
                i = 0;

            for ( ; (elem = this[i]) != null; i++ ) {
                if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                    if ( !keepData && elem.nodeType === 1 ) {
                        jQuery.cleanData( elem.getElementsByTagName("*") );
                        jQuery.cleanData( [ elem ] );
                    }

                    if ( elem.parentNode ) {
                        elem.parentNode.removeChild( elem );
                    }
                }
            }

            return this;
        },

        empty: function() {
            var elem,
                i = 0;

            for ( ; (elem = this[i]) != null; i++ ) {
                // Remove element nodes and prevent memory leaks
                if ( elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                }

                // Remove any remaining nodes
                while ( elem.firstChild ) {
                    elem.removeChild( elem.firstChild );
                }
            }

            return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map( function () {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            });
        },

        html: function( value ) {
            return jQuery.access( this, function( value ) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if ( value === undefined ) {
                    return elem.nodeType === 1 ?
                        elem.innerHTML.replace( rinlinejQuery, "" ) :
                        undefined;
                }

                // See if we can take a shortcut and just use innerHTML
                if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                    ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
                    ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
                    !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

                    value = value.replace( rxhtmlTag, "<$1></$2>" );

                    try {
                        for (; i < l; i++ ) {
                            // Remove element nodes and prevent memory leaks
                            elem = this[i] || {};
                            if ( elem.nodeType === 1 ) {
                                jQuery.cleanData( elem.getElementsByTagName( "*" ) );
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch(e) {}
                }

                if ( elem ) {
                    this.empty().append( value );
                }
            }, null, value, arguments.length );
        },

        replaceWith: function( value ) {
            if ( !isDisconnected( this[0] ) ) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if ( jQuery.isFunction( value ) ) {
                    return this.each(function(i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith( value.call( this, i, old ) );
                    });
                }

                if ( typeof value !== "string" ) {
                    value = jQuery( value ).detach();
                }

                return this.each(function() {
                    var next = this.nextSibling,
                        parent = this.parentNode;

                    jQuery( this ).remove();

                    if ( next ) {
                        jQuery(next).before( value );
                    } else {
                        jQuery(parent).append( value );
                    }
                });
            }

            return this.length ?
                this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
                this;
        },

        detach: function( selector ) {
            return this.remove( selector, true );
        },

        domManip: function( args, table, callback ) {

            // Flatten any nested arrays
            args = [].concat.apply( [], args );

            var results, first, fragment, iNoClone,
                i = 0,
                value = args[0],
                scripts = [],
                l = this.length;

            // We can't cloneNode fragments that contain checked, in WebKit
            if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
                return this.each(function() {
                    jQuery(this).domManip( args, table, callback );
                });
            }

            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    args[0] = value.call( this, i, table ? self.html() : undefined );
                    self.domManip( args, table, callback );
                });
            }

            if ( this[0] ) {
                results = jQuery.buildFragment( args, this, scripts );
                fragment = results.fragment;
                first = fragment.firstChild;

                if ( fragment.childNodes.length === 1 ) {
                    fragment = first;
                }

                if ( first ) {
                    table = table && jQuery.nodeName( first, "tr" );

                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    // Fragments from the fragment cache must always be cloned and never used in place.
                    for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
                        callback.call(
                            table && jQuery.nodeName( this[i], "table" ) ?
                                findOrAppend( this[i], "tbody" ) :
                                this[i],
                            i === iNoClone ?
                                fragment :
                                jQuery.clone( fragment, true, true )
                        );
                    }
                }

                // Fix #11809: Avoid leaking memory
                fragment = first = null;

                if ( scripts.length ) {
                    jQuery.each( scripts, function( i, elem ) {
                        if ( elem.src ) {
                            if ( jQuery.ajax ) {
                                jQuery.ajax({
                                    url: elem.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    "throws": true
                                });
                            } else {
                                jQuery.error("no ajax");
                            }
                        } else {
                            jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
                        }

                        if ( elem.parentNode ) {
                            elem.parentNode.removeChild( elem );
                        }
                    });
                }
            }

            return this;
        }
    });

    function findOrAppend( elem, tag ) {
        return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
    }

    function cloneCopyEvent( src, dest ) {

        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
            return;
        }

        var type, i, l,
            oldData = jQuery._data( src ),
            curData = jQuery._data( dest, oldData ),
            events = oldData.events;

        if ( events ) {
            delete curData.handle;
            curData.events = {};

            for ( type in events ) {
                for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                    jQuery.event.add( dest, type, events[ type ][ i ] );
                }
            }
        }

        // make the cloned public data object a copy from the original
        if ( curData.data ) {
            curData.data = jQuery.extend( {}, curData.data );
        }
    }

    function cloneFixAttributes( src, dest ) {
        var nodeName;

        // We do not need to do anything for non-Elements
        if ( dest.nodeType !== 1 ) {
            return;
        }

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if ( dest.clearAttributes ) {
            dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if ( dest.mergeAttributes ) {
            dest.mergeAttributes( src );
        }

        nodeName = dest.nodeName.toLowerCase();

        if ( nodeName === "object" ) {
            // IE6-10 improperly clones children of object elements using classid.
            // IE10 throws NoModificationAllowedError if parent is null, #12132.
            if ( dest.parentNode ) {
                dest.outerHTML = src.outerHTML;
            }

            // This path appears unavoidable for IE9. When cloning an object
            // element in IE9, the outerHTML strategy above is not sufficient.
            // If the src has innerHTML and the destination does not,
            // copy the src.innerHTML into the dest.innerHTML. #10324
            if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
                dest.innerHTML = src.innerHTML;
            }

        } else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set

            dest.defaultChecked = dest.checked = src.checked;

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if ( dest.value !== src.value ) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if ( nodeName === "option" ) {
            dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;

            // IE blanks contents when cloning scripts
        } else if ( nodeName === "script" && dest.text !== src.text ) {
            dest.text = src.text;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        dest.removeAttribute( jQuery.expando );
    }

    jQuery.buildFragment = function( args, context, scripts ) {
        var fragment, cacheable, cachehit,
            first = args[ 0 ];

        // Set context from what may come in as undefined or a jQuery collection or a node
        // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
        // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
        context = context || document;
        context = !context.nodeType && context[0] || context;
        context = context.ownerDocument || context;

        // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
        if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
            first.charAt(0) === "<" && !rnocache.test( first ) &&
            (jQuery.support.checkClone || !rchecked.test( first )) &&
            (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

            // Mark cacheable and look for a hit
            cacheable = true;
            fragment = jQuery.fragments[ first ];
            cachehit = fragment !== undefined;
        }

        if ( !fragment ) {
            fragment = context.createDocumentFragment();
            jQuery.clean( args, context, fragment, scripts );

            // Update the cache, but only store false
            // unless this is a second parsing of the same content
            if ( cacheable ) {
                jQuery.fragments[ first ] = cachehit && fragment;
            }
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var elems,
                i = 0,
                ret = [],
                insert = jQuery( selector ),
                l = insert.length,
                parent = this.length === 1 && this[0].parentNode;

            if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
                insert[ original ]( this[0] );
                return this;
            } else {
                for ( ; i < l; i++ ) {
                    elems = ( i > 0 ? this.clone(true) : this ).get();
                    jQuery( insert[i] )[ original ]( elems );
                    ret = ret.concat( elems );
                }

                return this.pushStack( ret, name, insert.selector );
            }
        };
    });

    function getAll( elem ) {
        if ( typeof elem.getElementsByTagName !== "undefined" ) {
            return elem.getElementsByTagName( "*" );

        } else if ( typeof elem.querySelectorAll !== "undefined" ) {
            return elem.querySelectorAll( "*" );

        } else {
            return [];
        }
    }

// Used in clean, fixes the defaultChecked property
    function fixDefaultChecked( elem ) {
        if ( rcheckableType.test( elem.type ) ) {
            elem.defaultChecked = elem.checked;
        }
    }

    jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var srcElements,
                destElements,
                i,
                clone;

            if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
                clone = elem.cloneNode( true );

                // IE<=8 does not properly clone detached, unknown element nodes
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
            }

            if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
                // IE copies events bound via attachEvent when using cloneNode.
                // Calling detachEvent on the clone will also remove the events
                // from the original. In order to get around this, we use some
                // proprietary methods to clear the events. Thanks to MooTools
                // guys for this hotness.

                cloneFixAttributes( elem, clone );

                // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
                srcElements = getAll( elem );
                destElements = getAll( clone );

                // Weird iteration because IE will replace the length property
                // with an element if you are cloning the body and one of the
                // elements on the page has a name or id of "length"
                for ( i = 0; srcElements[i]; ++i ) {
                    // Ensure that the destination node is not null; Fixes #9587
                    if ( destElements[i] ) {
                        cloneFixAttributes( srcElements[i], destElements[i] );
                    }
                }
            }

            // Copy the events from the original to the clone
            if ( dataAndEvents ) {
                cloneCopyEvent( elem, clone );

                if ( deepDataAndEvents ) {
                    srcElements = getAll( elem );
                    destElements = getAll( clone );

                    for ( i = 0; srcElements[i]; ++i ) {
                        cloneCopyEvent( srcElements[i], destElements[i] );
                    }
                }
            }

            srcElements = destElements = null;

            // Return the cloned set
            return clone;
        },

        clean: function( elems, context, fragment, scripts ) {
            var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
                safe = context === document && safeFragment,
                ret = [];

            // Ensure that context is a document
            if ( !context || typeof context.createDocumentFragment === "undefined" ) {
                context = document;
            }

            // Use the already-created safe fragment if context permits
            for ( i = 0; (elem = elems[i]) != null; i++ ) {
                if ( typeof elem === "number" ) {
                    elem += "";
                }

                if ( !elem ) {
                    continue;
                }

                // Convert html string into DOM nodes
                if ( typeof elem === "string" ) {
                    if ( !rhtml.test( elem ) ) {
                        elem = context.createTextNode( elem );
                    } else {
                        // Ensure a safe container in which to render the html
                        safe = safe || createSafeFragment( context );
                        div = context.createElement("div");
                        safe.appendChild( div );

                        // Fix "XHTML"-style tags in all browsers
                        elem = elem.replace(rxhtmlTag, "<$1></$2>");

                        // Go to html and back, then peel off extra wrappers
                        tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
                        wrap = wrapMap[ tag ] || wrapMap._default;
                        depth = wrap[0];
                        div.innerHTML = wrap[1] + elem + wrap[2];

                        // Move to the right depth
                        while ( depth-- ) {
                            div = div.lastChild;
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if ( !jQuery.support.tbody ) {

                            // String was a <table>, *may* have spurious <tbody>
                            hasBody = rtbody.test(elem);
                            tbody = tag === "table" && !hasBody ?
                            div.firstChild && div.firstChild.childNodes :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                            for ( j = tbody.length - 1; j >= 0 ; --j ) {
                                if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                    tbody[ j ].parentNode.removeChild( tbody[ j ] );
                                }
                            }
                        }

                        // IE completely kills leading whitespace when innerHTML is used
                        if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                            div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                        }

                        elem = div.childNodes;

                        // Take out of fragment container (we need a fresh div each time)
                        div.parentNode.removeChild( div );
                    }
                }

                if ( elem.nodeType ) {
                    ret.push( elem );
                } else {
                    jQuery.merge( ret, elem );
                }
            }

            // Fix #11356: Clear elements from safeFragment
            if ( div ) {
                elem = div = safe = null;
            }

            // Reset defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            if ( !jQuery.support.appendChecked ) {
                for ( i = 0; (elem = ret[i]) != null; i++ ) {
                    if ( jQuery.nodeName( elem, "input" ) ) {
                        fixDefaultChecked( elem );
                    } else if ( typeof elem.getElementsByTagName !== "undefined" ) {
                        jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
                    }
                }
            }

            // Append elements to a provided document fragment
            if ( fragment ) {
                // Special handling of each script element
                handleScript = function( elem ) {
                    // Check if we consider it executable
                    if ( !elem.type || rscriptType.test( elem.type ) ) {
                        // Detach the script and store it in the scripts array (if provided) or the fragment
                        // Return truthy to indicate that it has been handled
                        return scripts ?
                            scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
                            fragment.appendChild( elem );
                    }
                };

                for ( i = 0; (elem = ret[i]) != null; i++ ) {
                    // Check if we're done after handling an executable script
                    if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
                        // Append to fragment and handle embedded scripts
                        fragment.appendChild( elem );
                        if ( typeof elem.getElementsByTagName !== "undefined" ) {
                            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                            jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

                            // Splice the scripts into ret after their former ancestor and advance our index beyond them
                            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                            i += jsTags.length;
                        }
                    }
                }
            }

            return ret;
        },

        cleanData: function( elems, /* internal */ acceptData ) {
            var data, id, elem, type,
                i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                deleteExpando = jQuery.support.deleteExpando,
                special = jQuery.event.special;

            for ( ; (elem = elems[i]) != null; i++ ) {

                if ( acceptData || jQuery.acceptData( elem ) ) {

                    id = elem[ internalKey ];
                    data = id && cache[ id ];

                    if ( data ) {
                        if ( data.events ) {
                            for ( type in data.events ) {
                                if ( special[ type ] ) {
                                    jQuery.event.remove( elem, type );

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent( elem, type, data.handle );
                                }
                            }
                        }

                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if ( cache[ id ] ) {

                            delete cache[ id ];

                            // IE does not allow us to delete expando properties from nodes,
                            // nor does it have a removeAttribute function on Document nodes;
                            // we must handle all of these cases
                            if ( deleteExpando ) {
                                delete elem[ internalKey ];

                            } else if ( elem.removeAttribute ) {
                                elem.removeAttribute( internalKey );

                            } else {
                                elem[ internalKey ] = null;
                            }

                            jQuery.deletedIds.push( id );
                        }
                    }
                }
            }
        }
    });
// Limit scope pollution from any deprecated API
    (function() {

        var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
        jQuery.uaMatch = function( ua ) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [];

            return {
                browser: match[ 1 ] || "",
                version: match[ 2 ] || "0"
            };
        };

        matched = jQuery.uaMatch( navigator.userAgent );
        browser = {};

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
        }

// Chrome is Webkit, but Webkit is also Safari.
        if ( browser.chrome ) {
            browser.webkit = true;
        } else if ( browser.webkit ) {
            browser.safari = true;
        }

        jQuery.browser = browser;

        jQuery.sub = function() {
            function jQuerySub( selector, context ) {
                return new jQuerySub.fn.init( selector, context );
            }
            jQuery.extend( true, jQuerySub, this );
            jQuerySub.superclass = this;
            jQuerySub.fn = jQuerySub.prototype = this();
            jQuerySub.fn.constructor = jQuerySub;
            jQuerySub.sub = this.sub;
            jQuerySub.fn.init = function init( selector, context ) {
                if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                    context = jQuerySub( context );
                }

                return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
            };
            jQuerySub.fn.init.prototype = jQuerySub.fn;
            var rootjQuerySub = jQuerySub(document);
            return jQuerySub;
        };

    })();
    var curCSS, iframe, iframeDoc,
        ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,
        rposition = /^(top|right|bottom|left)$/,
        // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
        // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
        rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
        rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
        elemdisplay = {},

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },

        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
        cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

        eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
    function vendorPropName( style, name ) {

        // shortcut for names that are not vendor prefixed
        if ( name in style ) {
            return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;

        while ( i-- ) {
            name = cssPrefixes[ i ] + capName;
            if ( name in style ) {
                return name;
            }
        }

        return origName;
    }

    function isHidden( elem, el ) {
        elem = el || elem;
        return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
    }

    function showHide( elements, show ) {
        var elem, display,
            values = [],
            index = 0,
            length = elements.length;

        for ( ; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
            values[ index ] = jQuery._data( elem, "olddisplay" );
            if ( show ) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if ( !values[ index ] && elem.style.display === "none" ) {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if ( elem.style.display === "" && isHidden( elem ) ) {
                    values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
                }
            } else {
                display = curCSS( elem, "display" );

                if ( !values[ index ] && display !== "none" ) {
                    jQuery._data( elem, "olddisplay", display );
                }
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for ( index = 0; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
            if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
                elem.style.display = show ? values[ index ] || "" : "none";
            }
        }

        return elements;
    }

    jQuery.fn.extend({
        css: function( name, value ) {
            return jQuery.access( this, function( elem, name, value ) {
                return value !== undefined ?
                    jQuery.style( elem, name, value ) :
                    jQuery.css( elem, name );
            }, name, value, arguments.length > 1 );
        },
        show: function() {
            return showHide( this, true );
        },
        hide: function() {
            return showHide( this );
        },
        toggle: function( state, fn2 ) {
            var bool = typeof state === "boolean";

            if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
                return eventsToggle.apply( this, arguments );
            }

            return this.each(function() {
                if ( bool ? state : isHidden( this ) ) {
                    jQuery( this ).show();
                } else {
                    jQuery( this ).hide();
                }
            });
        }
    });

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity" );
                        return ret === "" ? "1" : ret;

                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = jQuery.camelCase( name ),
                style = elem.style;

            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // Check if we're setting a value
            if ( value !== undefined ) {
                type = typeof value;

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                    value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that NaN and null values aren't set. See: #7116
                if ( value == null || type === "number" && isNaN( value ) ) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                    value += "px";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[ name ] = value;
                    } catch(e) {}
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },

        css: function( elem, name, numeric, extra ) {
            var val, num, hooks,
                origName = jQuery.camelCase( name );

            // Make sure that we're working with the right name
            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks ) {
                val = hooks.get( elem, true, extra );
            }

            // Otherwise, if a way to get the computed value exists, use that
            if ( val === undefined ) {
                val = curCSS( elem, name );
            }

            //convert "normal" to computed value
            if ( val === "normal" && name in cssNormalTransform ) {
                val = cssNormalTransform[ name ];
            }

            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if ( numeric || extra !== undefined ) {
                num = parseFloat( val );
                return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
            }
            return val;
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function( elem, options, callback ) {
            var ret, name,
                old = {};

            // Remember the old values, and insert the new ones
            for ( name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }

            ret = callback.call( elem );

            // Revert the old values
            for ( name in options ) {
                elem.style[ name ] = old[ name ];
            }

            return ret;
        }
    });

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
        curCSS = function( elem, name ) {
            var ret, width, minWidth, maxWidth,
                computed = window.getComputedStyle( elem, null ),
                style = elem.style;

            if ( computed ) {

                ret = computed[ name ];
                if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
                    ret = jQuery.style( elem, name );
                }

                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;

                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;

                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }

            return ret;
        };
    } else if ( document.documentElement.currentStyle ) {
        curCSS = function( elem, name ) {
            var left, rsLeft,
                ret = elem.currentStyle && elem.currentStyle[ name ],
                style = elem.style;

            // Avoid setting ret to empty string here
            // so we don't default to auto
            if ( ret == null && style && style[ name ] ) {
                ret = style[ name ];
            }

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are proportional to the parent element instead
            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
            if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

                // Remember the original values
                left = style.left;
                rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

                // Put in the new values to get a computed value out
                if ( rsLeft ) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if ( rsLeft ) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    function setPositiveNumber( elem, value, subtract ) {
        var matches = rnumsplit.exec( value );
        return matches ?
        Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
            value;
    }

    function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
        var i = extra === ( isBorderBox ? "border" : "content" ) ?
                // If we already have the right measurement, avoid augmentation
                4 :
                // Otherwise initialize for horizontal or vertical properties
                name === "width" ? 1 : 0,

            val = 0;

        for ( ; i < 4; i += 2 ) {
            // both box models exclude margin, so add it if we want it
            if ( extra === "margin" ) {
                // we use jQuery.css instead of curCSS here
                // because of the reliableMarginRight CSS hook!
                val += jQuery.css( elem, extra + cssExpand[ i ], true );
            }

            // From this point on we use curCSS for maximum performance (relevant in animations)
            if ( isBorderBox ) {
                // border-box includes padding, so remove it if we want content
                if ( extra === "content" ) {
                    val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
                }

                // at this point, extra isn't border nor margin, so remove border
                if ( extra !== "margin" ) {
                    val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

                // at this point, extra isn't content nor padding, so add border
                if ( extra !== "padding" ) {
                    val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
                }
            }
        }

        return val;
    }

    function getWidthOrHeight( elem, name, extra ) {

        // Start with offset property, which is equivalent to the border-box value
        var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            valueIsBorderBox = true,
            isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if ( val <= 0 || val == null ) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS( elem, name );
            if ( val < 0 || val == null ) {
                val = elem.style[ name ];
            }

            // Computed unit is not pixels. Stop here and return.
            if ( rnumnonpx.test(val) ) {
                return val;
            }

            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

            // Normalize "", auto, and prepare for extra
            val = parseFloat( val ) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return ( val +
                augmentWidthOrHeight(
                    elem,
                    name,
                    extra || ( isBorderBox ? "border" : "content" ),
                    valueIsBorderBox
                )
            ) + "px";
    }


// Try to determine the default display value of an element
    function css_defaultDisplay( nodeName ) {
        if ( elemdisplay[ nodeName ] ) {
            return elemdisplay[ nodeName ];
        }

        var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
            display = elem.css("display");
        elem.remove();

        // If the simple way fails,
        // get element's real default display by attaching it to a temp iframe
        if ( display === "none" || display === "" ) {
            // Use the already-created iframe if possible
            iframe = document.body.appendChild(
                iframe || jQuery.extend( document.createElement("iframe"), {
                    frameBorder: 0,
                    width: 0,
                    height: 0
                })
            );

            // Create a cacheable copy of the iframe document on first call.
            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
            // document to it; WebKit & Firefox won't allow reusing the iframe document.
            if ( !iframeDoc || !iframe.createElement ) {
                iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
                iframeDoc.write("<!doctype html><html><body>");
                iframeDoc.close();
            }

            elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

            display = curCSS( elem, "display" );
            document.body.removeChild( iframe );
        }

        // Store the correct default display
        elemdisplay[ nodeName ] = display;

        return display;
    }

    jQuery.each([ "height", "width" ], function( i, name ) {
        jQuery.cssHooks[ name ] = {
            get: function( elem, computed, extra ) {
                if ( computed ) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
                        return jQuery.swap( elem, cssShow, function() {
                            return getWidthOrHeight( elem, name, extra );
                        });
                    } else {
                        return getWidthOrHeight( elem, name, extra );
                    }
                }
            },

            set: function( elem, value, extra ) {
                return setPositiveNumber( elem, value, extra ?
                    augmentWidthOrHeight(
                        elem,
                        name,
                        extra,
                        jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
                    ) : 0
                );
            }
        };
    });

    if ( !jQuery.support.opacity ) {
        jQuery.cssHooks.opacity = {
            get: function( elem, computed ) {
                // IE uses filters for opacity
                return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
                    computed ? "1" : "";
            },

            set: function( elem, value ) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
                    style.removeAttribute ) {

                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
                    // style.removeAttribute is IE Only, but so apparently is this code path...
                    style.removeAttribute( "filter" );

                    // if there there is no filter style applied in a css rule, we are done
                    if ( currentStyle && !currentStyle.filter ) {
                        return;
                    }
                }

                // otherwise, set new filter values
                style.filter = ralpha.test( filter ) ?
                    filter.replace( ralpha, opacity ) :
                filter + " " + opacity;
            }
        };
    }

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
    jQuery(function() {
        if ( !jQuery.support.reliableMarginRight ) {
            jQuery.cssHooks.marginRight = {
                get: function( elem, computed ) {
                    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                    // Work around by temporarily setting element display to inline-block
                    return jQuery.swap( elem, { "display": "inline-block" }, function() {
                        if ( computed ) {
                            return curCSS( elem, "marginRight" );
                        }
                    });
                }
            };
        }

        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
            jQuery.each( [ "top", "left" ], function( i, prop ) {
                jQuery.cssHooks[ prop ] = {
                    get: function( elem, computed ) {
                        if ( computed ) {
                            var ret = curCSS( elem, prop );
                            // if curCSS returns percentage, fallback to offset
                            return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
                        }
                    }
                };
            });
        }

    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
        };

        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    }

// These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function( prefix, suffix ) {
        jQuery.cssHooks[ prefix + suffix ] = {
            expand: function( value ) {
                var i,

                    // assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [ value ],
                    expanded = {};

                for ( i = 0; i < 4; i++ ) {
                    expanded[ prefix + cssExpand[ i ] + suffix ] =
                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                }

                return expanded;
            }
        };

        if ( !rmargin.test( prefix ) ) {
            jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        rselectTextarea = /^(?:select|textarea)/i;

    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
            return this.map(function(){
                return this.elements ? jQuery.makeArray( this.elements ) : this;
            })
                .filter(function(){
                    return this.name && !this.disabled &&
                        ( this.checked || rselectTextarea.test( this.nodeName ) ||
                        rinput.test( this.type ) );
                })
                .map(function( i, elem ){
                    var val = jQuery( this ).val();

                    return val == null ?
                        null :
                        jQuery.isArray( val ) ?
                            jQuery.map( val, function( val, i ){
                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                            }) :
                            { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                }).get();
        }
    });

//Serialize an array of form elements or a set of
//key/values into a query string
    jQuery.param = function( a, traditional ) {
        var prefix,
            s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    };

    function buildParams( prefix, obj, traditional, add ) {
        var name;

        if ( jQuery.isArray( obj ) ) {
            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if ( !traditional && jQuery.type( obj ) === "object" ) {
            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }
    var
        // Document location
        ajaxLocParts,
        ajaxLocation,

        rhash = /#.*$/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rts = /([?&])_=[^&]*/,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

        // Keep a copy of the old load method
        _load = jQuery.fn.load,

        /* Prefilters
         * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
         * 2) These are called:
         *    - BEFORE asking for a transport
         *    - AFTER param serialization (s.data is a string if s.processData is true)
         * 3) key is the dataType
         * 4) the catchall symbol "*" can be used
         * 5) execution will start with transport dataType and THEN continue down to "*" if needed
         */
        prefilters = {},

        /* Transports bindings
         * 1) key is the dataType
         * 2) the catchall symbol "*" can be used
         * 3) selection will start with transport dataType and THEN go to "*" if needed
         */
        transports = {},

        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch( e ) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement( "a" );
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

// Segment location into parts
    ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType, list, placeBefore,
                dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
                i = 0,
                length = dataTypes.length;

            if ( jQuery.isFunction( func ) ) {
                // For each dataType in the dataTypeExpression
                for ( ; i < length; i++ ) {
                    dataType = dataTypes[ i ];
                    // We control if we're asked to add before
                    // any existing element
                    placeBefore = /^\+/.test( dataType );
                    if ( placeBefore ) {
                        dataType = dataType.substr( 1 ) || "*";
                    }
                    list = structure[ dataType ] = structure[ dataType ] || [];
                    // then we add to the structure accordingly
                    list[ placeBefore ? "unshift" : "push" ]( func );
                }
            }
        };
    }

// Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
                                            dataType /* internal */, inspected /* internal */ ) {

        dataType = dataType || options.dataTypes[ 0 ];
        inspected = inspected || {};

        inspected[ dataType ] = true;

        var selection,
            list = structure[ dataType ],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = ( structure === prefilters );

        for ( ; i < length && ( executeOnly || !selection ); i++ ) {
            selection = list[ i ]( options, originalOptions, jqXHR );
            // If we got redirected to another dataType
            // we try there if executing only and not done already
            if ( typeof selection === "string" ) {
                if ( !executeOnly || inspected[ selection ] ) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift( selection );
                    selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jqXHR, selection, inspected );
                }
            }
        }
        // If we're only executing or nothing was selected
        // we try the catchall dataType if not done already
        if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
            selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jqXHR, "*", inspected );
        }
        // unnecessary when only executing (prefilters)
        // but it'll be ignored by the caller in that case
        return selection;
    }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
    function ajaxExtend( target, src ) {
        var key, deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for ( key in src ) {
            if ( src[ key ] !== undefined ) {
                ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
            }
        }
        if ( deep ) {
            jQuery.extend( true, target, deep );
        }
    }

    jQuery.fn.load = function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );
        }

        // Don't do a request if no elements are being requested
        if ( !this.length ) {
            return this;
        }

        var selector, type, response,
            self = this,
            off = url.indexOf(" ");

        if ( off >= 0 ) {
            selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }

        // If it's a function
        if ( jQuery.isFunction( params ) ) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if ( params && typeof params === "object" ) {
            type = "POST";
        }

        // Request the remote document
        jQuery.ajax({
            url: url,

            // if "type" variable is undefined, then "GET" method will be used
            type: type,
            dataType: "html",
            data: params,
            complete: function( jqXHR, status ) {
                if ( callback ) {
                    self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
                }
            }
        }).done(function( responseText ) {

            // Save response for use in complete callback
            response = arguments;

            // See if a selector was specified
            self.html( selector ?

                // Create a dummy div to hold the results
                jQuery("<div>")

                // inject the contents of the document in, removing the scripts
                // to avoid any 'Permission Denied' errors in IE
                    .append( responseText.replace( rscript, "" ) )

                    // Locate the specified elements
                    .find( selector ) :

                // If not, just inject the full result
                responseText );

        });

        return this;
    };

// Attach a bunch of functions for handling common AJAX events
    jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
        jQuery.fn[ o ] = function( f ){
            return this.on( o, f );
        };
    });

    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            // shift arguments if data argument was omitted
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    jQuery.extend({

        getScript: function( url, callback ) {
            return jQuery.get( url, undefined, callback, "script" );
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function( target, settings ) {
            if ( settings ) {
                // Building a settings object
                ajaxExtend( target, jQuery.ajaxSettings );
            } else {
                // Extending ajaxSettings
                settings = target;
                target = jQuery.ajaxSettings;
            }
            ajaxExtend( target, settings );
            return target;
        },

        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: true,
            async: true,
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             throws: false,
             traditional: false,
             headers: {},
             */

            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": allTypes
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // List of data converters
            // 1) key format is "source_type destination_type" (a single space in-between)
            // 2) the catchall symbol "*" can be used for source_type
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                context: true,
                url: true
            }
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

            // If url is an object, simulate pre-1.5 signature
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // ifModified key
                ifModifiedKey,
                // Response headers
                responseHeadersString,
                responseHeaders,
                // transport
                transport,
                // timeout handle
                timeoutTimer,
                // Cross-domain detection vars
                parts,
                // To know if global events are to be dispatched
                fireGlobals,
                // Loop variable
                i,
                // Create the final options object
                s = jQuery.ajaxSetup( {}, options ),
                // Callbacks context
                callbackContext = s.context || s,
                // Context for global events
                // It's the callbackContext if one was provided in the options
                // and if it's a DOM node or a jQuery collection
                globalEventContext = callbackContext !== s &&
                ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                    jQuery( callbackContext ) : jQuery.event,
                // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks( "once memory" ),
                // Status-dependent callbacks
                statusCode = s.statusCode || {},
                // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
                // The jqXHR state
                state = 0,
                // Default abort message
                strAbort = "canceled",
                // Fake xhr
                jqXHR = {

                    readyState: 0,

                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        if ( !state ) {
                            var lname = name.toLowerCase();
                            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                            requestHeaders[ name ] = value;
                        }
                        return this;
                    },

                    // Raw string
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( state === 2 ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() ];
                        }
                        return match === undefined ? null : match;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function( type ) {
                        if ( !state ) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function( statusText ) {
                        statusText = statusText || strAbort;
                        if ( transport ) {
                            transport.abort( statusText );
                        }
                        done( 0, statusText );
                        return this;
                    }
                };

            // Callback for when everything is done
            // It is defined here because jslint complains if it is declared
            // at the end of the function (which would be more logical and readable)
            function done( status, nativeStatusText, responses, headers ) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                // Called once
                if ( state === 2 ) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    clearTimeout( timeoutTimer );
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Get response data
                if ( responses ) {
                    response = ajaxHandleResponses( s, jqXHR, responses );
                }

                // If successful, handle type chaining
                if ( status >= 200 && status < 300 || status === 304 ) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {

                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if ( modified ) {
                            jQuery.lastModified[ ifModifiedKey ] = modified;
                        }
                        modified = jqXHR.getResponseHeader("Etag");
                        if ( modified ) {
                            jQuery.etag[ ifModifiedKey ] = modified;
                        }
                    }

                    // If not modified
                    if ( status === 304 ) {

                        statusText = "notmodified";
                        isSuccess = true;

                        // If we have data
                    } else {

                        isSuccess = ajaxConvert( s, response );
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if ( !statusText || status ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = ( nativeStatusText || statusText ) + "";

                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                }

                // Status-dependent callbacks
                jqXHR.statusCode( statusCode );
                statusCode = undefined;

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jqXHR, s, isSuccess ? success : error ] );
                }

                // Complete
                completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger( "ajaxStop" );
                    }
                }
            }

            // Attach deferreds
            deferred.promise( jqXHR );
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.add;

            // Status-dependent callbacks
            jqXHR.statusCode = function( map ) {
                if ( map ) {
                    var tmp;
                    if ( state < 2 ) {
                        for ( tmp in map ) {
                            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                        }
                    } else {
                        tmp = map[ jqXHR.status ];
                        jqXHR.always( tmp );
                    }
                }
                return this;
            };

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // We also use the url parameter if available
            s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

            // Extract dataTypes list
            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if ( s.crossDomain == null ) {
                parts = rurl.exec( s.url.toLowerCase() ) || false;
                s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
                    ( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
            }

            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }

            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

            // If request was aborted inside a prefilter, stop there
            if ( state === 2 ) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );

            // Watch for a new set of requests
            if ( fireGlobals && jQuery.active++ === 0 ) {
                jQuery.event.trigger( "ajaxStart" );
            }

            // More options handling for requests with no content
            if ( !s.hasContent ) {

                // If data is available, append data to url
                if ( s.data ) {
                    s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Get ifModifiedKey before adding the anti-cache parameter
                ifModifiedKey = s.url;

                // Add anti-cache in url if needed
                if ( s.cache === false ) {

                    var ts = jQuery.now(),
                        // try replacing _= if it is there
                        ret = s.url.replace( rts, "$1_=" + ts );

                    // if nothing was replaced, add timestamp to the end
                    s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
                }
            }

            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                jqXHR.setRequestHeader( "Content-Type", s.contentType );
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                ifModifiedKey = ifModifiedKey || s.url;
                if ( jQuery.lastModified[ ifModifiedKey ] ) {
                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
                }
                if ( jQuery.etag[ ifModifiedKey ] ) {
                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
                }
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                    s.accepts[ "*" ]
            );

            // Check for headers option
            for ( i in s.headers ) {
                jqXHR.setRequestHeader( i, s.headers[ i ] );
            }

            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already and return
                return jqXHR.abort();

            }

            // aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for ( i in { success: 1, error: 1, complete: 1 } ) {
                jqXHR[ i ]( s[ i ] );
            }

            // Get transport
            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

            // If no transport, we auto-abort
            if ( !transport ) {
                done( -1, "No Transport" );
            } else {
                jqXHR.readyState = 1;
                // Send global event
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                }
                // Timeout
                if ( s.async && s.timeout > 0 ) {
                    timeoutTimer = setTimeout( function(){
                        jqXHR.abort( "timeout" );
                    }, s.timeout );
                }

                try {
                    state = 1;
                    transport.send( requestHeaders, done );
                } catch (e) {
                    // Propagate exception as error if not done
                    if ( state < 2 ) {
                        done( -1, e );
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            return jqXHR;
        },

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {}

    });

    /* Handles responses to an ajax request:
     * - sets all responseXXX fields accordingly
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {

        var ct, type, finalDataType, firstDataType,
            contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;

        // Fill responseXXX fields
        for ( type in responseFields ) {
            if ( type in responses ) {
                jqXHR[ responseFields[type] ] = responses[ type ];
            }
        }

        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
            }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }

// Chain conversions given the request and the original response
    function ajaxConvert( s, response ) {

        var conv, conv2, current, tmp,
            // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice(),
            prev = dataTypes[ 0 ],
            converters = {},
            i = 0;

        // Apply the dataFilter if provided
        if ( s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        // Create converters map with lowercased keys
        if ( dataTypes[ 1 ] ) {
            for ( conv in s.converters ) {
                converters[ conv.toLowerCase() ] = s.converters[ conv ];
            }
        }

        // Convert to each sequential dataType, tolerating list modification
        for ( ; (current = dataTypes[++i]); ) {

            // There's only work to do if current dataType is non-auto
            if ( current !== "*" ) {

                // Convert response if prev dataType is non-auto and differs from current
                if ( prev !== "*" && prev !== current ) {

                    // Seek a direct converter
                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                    // If none found, seek a pair
                    if ( !conv ) {
                        for ( conv2 in converters ) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if ( tmp[ 1 ] === current ) {

                                // If prev can be converted to accepted input
                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                    converters[ "* " + tmp[ 0 ] ];
                                if ( conv ) {
                                    // Condense equivalence converters
                                    if ( conv === true ) {
                                        conv = converters[ conv2 ];

                                        // Otherwise, insert the intermediate dataType
                                    } else if ( converters[ conv2 ] !== true ) {
                                        current = tmp[ 0 ];
                                        dataTypes.splice( i--, 0, current );
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if ( conv !== true ) {

                        // Unless errors are allowed to bubble, catch and return them
                        if ( conv && s["throws"] ) {
                            response = conv( response );
                        } else {
                            try {
                                response = conv( response );
                            } catch ( e ) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }

                // Update prev for next iteration
                prev = current;
            }
        }

        return { state: "success", data: response };
    }
    var oldCallbacks = [],
        rquestion = /\?/,
        rjsonp = /(=)\?(?=&|$)|\?\?/,
        nonce = jQuery.now();

// Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
            this[ callback ] = true;
            return callback;
        }
    });

// Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

        var callbackName, overwritten, responseContainer,
            data = s.data,
            url = s.url,
            hasCallback = s.jsonp !== false,
            replaceInUrl = hasCallback && rjsonp.test( url ),
            replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
                !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
                rjsonp.test( data );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
                s.jsonpCallback() :
                s.jsonpCallback;
            overwritten = window[ callbackName ];

            // Insert callback into url or form data
            if ( replaceInUrl ) {
                s.url = url.replace( rjsonp, "$1" + callbackName );
            } else if ( replaceInData ) {
                s.data = data.replace( rjsonp, "$1" + callbackName );
            } else if ( hasCallback ) {
                s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function() {
                if ( !responseContainer ) {
                    jQuery.error( callbackName + " was not called" );
                }
                return responseContainer[ 0 ];
            };

            // force json dataType
            s.dataTypes[ 0 ] = "json";

            // Install callback
            window[ callbackName ] = function() {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function() {
                // Restore preexisting value
                window[ callbackName ] = overwritten;

                // Save back as free
                if ( s[ callbackName ] ) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push( callbackName );
                }

                // Call if it was a function and we have a response
                if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                    overwritten( responseContainer[ 0 ] );
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });
// Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    });

// Handle cache's special case and global
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });

// Bind script tag hack transport
    jQuery.ajaxTransport( "script", function(s) {

        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {

            var script,
                head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

            return {

                send: function( _, callback ) {

                    script = document.createElement( "script" );

                    script.async = "async";

                    if ( s.scriptCharset ) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function( _, isAbort ) {

                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if ( head && script.parentNode ) {
                                head.removeChild( script );
                            }

                            // Dereference the script
                            script = undefined;

                            // Callback if not abort
                            if ( !isAbort ) {
                                callback( 200, "success" );
                            }
                        }
                    };
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709 and #4378).
                    head.insertBefore( script, head.firstChild );
                },

                abort: function() {
                    if ( script ) {
                        script.onload( 0, 1 );
                    }
                }
            };
        }
    });
    var xhrCallbacks,
        // #5280: Internet Explorer will keep connections alive if we don't abort on unload
        xhrOnUnloadAbort = window.ActiveXObject ? function() {
            // Abort all pending requests
            for ( var key in xhrCallbacks ) {
                xhrCallbacks[ key ]( 0, 1 );
            }
        } : false,
        xhrId = 0;

// Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch( e ) {}
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject( "Microsoft.XMLHTTP" );
        } catch( e ) {}
    }

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function() {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

// Determine support properties
    (function( xhr ) {
        jQuery.extend( jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ( "withCredentials" in xhr )
        });
    })( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
    if ( jQuery.support.ajax ) {

        jQuery.ajaxTransport(function( s ) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if ( !s.crossDomain || jQuery.support.cors ) {

                var callback;

                return {
                    send: function( headers, complete ) {

                        // Get a new xhr
                        var handle, i,
                            xhr = s.xhr();

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if ( s.username ) {
                            xhr.open( s.type, s.url, s.async, s.username, s.password );
                        } else {
                            xhr.open( s.type, s.url, s.async );
                        }

                        // Apply custom fields if provided
                        if ( s.xhrFields ) {
                            for ( i in s.xhrFields ) {
                                xhr[ i ] = s.xhrFields[ i ];
                            }
                        }

                        // Override mime type if needed
                        if ( s.mimeType && xhr.overrideMimeType ) {
                            xhr.overrideMimeType( s.mimeType );
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                            headers[ "X-Requested-With" ] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for ( i in headers ) {
                                xhr.setRequestHeader( i, headers[ i ] );
                            }
                        } catch( _ ) {}

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send( ( s.hasContent && s.data ) || null );

                        // Listener
                        callback = function( _, isAbort ) {

                            var status,
                                statusText,
                                responseHeaders,
                                responses,
                                xml;

                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occurred
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {

                                // Was never called and is aborted or complete
                                if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                    // Only called once
                                    callback = undefined;

                                    // Do not keep as active anymore
                                    if ( handle ) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if ( xhrOnUnloadAbort ) {
                                            delete xhrCallbacks[ handle ];
                                        }
                                    }

                                    // If it's an abort
                                    if ( isAbort ) {
                                        // Abort it manually if needed
                                        if ( xhr.readyState !== 4 ) {
                                            xhr.abort();
                                        }
                                    } else {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;

                                        // Construct response list
                                        if ( xml && xml.documentElement /* #4958 */ ) {
                                            responses.xml = xml;
                                        }

                                        // When requesting binary data, IE6-9 will throw an exception
                                        // on any attempt to access responseText (#11426)
                                        try {
                                            responses.text = xhr.responseText;
                                        } catch( _ ) {
                                        }

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch( e ) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if ( !status && s.isLocal && !s.crossDomain ) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if ( status === 1223 ) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch( firefoxAccessException ) {
                                if ( !isAbort ) {
                                    complete( -1, firefoxAccessException );
                                }
                            }

                            // Call complete if needed
                            if ( responses ) {
                                complete( status, statusText, responses, responseHeaders );
                            }
                        };

                        if ( !s.async ) {
                            // if we're in sync mode we fire the callback
                            callback();
                        } else if ( xhr.readyState === 4 ) {
                            // (IE6 & IE7) if it's in cache and has been
                            // retrieved directly we need to fire the callback
                            setTimeout( callback, 0 );
                        } else {
                            handle = ++xhrId;
                            if ( xhrOnUnloadAbort ) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if ( !xhrCallbacks ) {
                                    xhrCallbacks = {};
                                    jQuery( window ).unload( xhrOnUnloadAbort );
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[ handle ] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function() {
                        if ( callback ) {
                            callback(0,1);
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
        rrun = /queueHooks$/,
        animationPrefilters = [ defaultPrefilter ],
        tweeners = {
            "*": [function( prop, value ) {
                var end, unit,
                    tween = this.createTween( prop, value ),
                    parts = rfxnum.exec( value ),
                    target = tween.cur(),
                    start = +target || 0,
                    scale = 1,
                    maxIterations = 20;

                if ( parts ) {
                    end = +parts[2];
                    unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

                    // We need to compute starting value
                    if ( unit !== "px" && start ) {
                        // Iteratively approximate from a nonzero starting point
                        // Prefer the current property, because this process will be trivial if it uses the same units
                        // Fallback to end or a simple constant
                        start = jQuery.css( tween.elem, prop, true ) || end || 1;

                        do {
                            // If previous iteration zeroed out, double until we get *something*
                            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                            scale = scale || ".5";

                            // Adjust and apply
                            start = start / scale;
                            jQuery.style( tween.elem, prop, start + unit );

                            // Update scale, tolerating zero or NaN from tween.cur()
                            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                        } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                    }

                    tween.unit = unit;
                    tween.start = start;
                    // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
                }
                return tween;
            }]
        };

// Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function() {
            fxNow = undefined;
        }, 0 );
        return ( fxNow = jQuery.now() );
    }

    function createTweens( animation, props ) {
        jQuery.each( props, function( prop, value ) {
            var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
                index = 0,
                length = collection.length;
            for ( ; index < length; index++ ) {
                if ( collection[ index ].call( animation, prop, value ) ) {

                    // we're done with this property
                    return;
                }
            }
        });
    }

    function Animation( elem, properties, options ) {
        var result,
            index = 0,
            tweenerIndex = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always( function() {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function() {
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                    percent = 1 - ( remaining / animation.duration || 0 ),
                    index = 0,
                    length = animation.tweens.length;

                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( percent );
                }

                deferred.notifyWith( elem, [ animation, percent, remaining ]);

                if ( percent < 1 && length ) {
                    return remaining;
                } else {
                    deferred.resolveWith( elem, [ animation ] );
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend( {}, properties ),
                opts: jQuery.extend( true, { specialEasing: {} }, options ),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function( prop, end, easing ) {
                    var tween = jQuery.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                    animation.tweens.push( tween );
                    return tween;
                },
                stop: function( gotoEnd ) {
                    var index = 0,
                        // if we are going to the end, we want to run all the tweens
                        // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;

                    for ( ; index < length ; index++ ) {
                        animation.tweens[ index ].run( 1 );
                    }

                    // resolve when we played the last frame
                    // otherwise, reject
                    if ( gotoEnd ) {
                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
                    } else {
                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
                    }
                    return this;
                }
            }),
            props = animation.props;

        propFilter( props, animation.opts.specialEasing );

        for ( ; index < length ; index++ ) {
            result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
            if ( result ) {
                return result;
            }
        }

        createTweens( animation, props );

        if ( jQuery.isFunction( animation.opts.start ) ) {
            animation.opts.start.call( elem, animation );
        }

        jQuery.fx.timer(
            jQuery.extend( tick, {
                anim: animation,
                queue: animation.opts.queue,
                elem: elem
            })
        );

        // attach callbacks from options
        return animation.progress( animation.opts.progress )
            .done( animation.opts.done, animation.opts.complete )
            .fail( animation.opts.fail )
            .always( animation.opts.always );
    }

    function propFilter( props, specialEasing ) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for ( index in props ) {
            name = jQuery.camelCase( index );
            easing = specialEasing[ name ];
            value = props[ index ];
            if ( jQuery.isArray( value ) ) {
                easing = value[ 1 ];
                value = props[ index ] = value[ 0 ];
            }

            if ( index !== name ) {
                props[ name ] = value;
                delete props[ index ];
            }

            hooks = jQuery.cssHooks[ name ];
            if ( hooks && "expand" in hooks ) {
                value = hooks.expand( value );
                delete props[ name ];

                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for ( index in value ) {
                    if ( !( index in props ) ) {
                        props[ index ] = value[ index ];
                        specialEasing[ index ] = easing;
                    }
                }
            } else {
                specialEasing[ name ] = easing;
            }
        }
    }

    jQuery.Animation = jQuery.extend( Animation, {

        tweener: function( props, callback ) {
            if ( jQuery.isFunction( props ) ) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.split(" ");
            }

            var prop,
                index = 0,
                length = props.length;

            for ( ; index < length ; index++ ) {
                prop = props[ index ];
                tweeners[ prop ] = tweeners[ prop ] || [];
                tweeners[ prop ].unshift( callback );
            }
        },

        prefilter: function( callback, prepend ) {
            if ( prepend ) {
                animationPrefilters.unshift( callback );
            } else {
                animationPrefilters.push( callback );
            }
        }
    });

    function defaultPrefilter( elem, props, opts ) {
        var index, prop, value, length, dataShow, tween, hooks, oldfire,
            anim = this,
            style = elem.style,
            orig = {},
            handled = [],
            hidden = elem.nodeType && isHidden( elem );

        // handle queue: false promises
        if ( !opts.queue ) {
            hooks = jQuery._queueHooks( elem, "fx" );
            if ( hooks.unqueued == null ) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if ( !hooks.unqueued ) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function() {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function() {
                    hooks.unqueued--;
                    if ( !jQuery.queue( elem, "fx" ).length ) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if ( jQuery.css( elem, "display" ) === "inline" &&
                jQuery.css( elem, "float" ) === "none" ) {

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
                    style.display = "inline-block";

                } else {
                    style.zoom = 1;
                }
            }
        }

        if ( opts.overflow ) {
            style.overflow = "hidden";
            if ( !jQuery.support.shrinkWrapBlocks ) {
                anim.done(function() {
                    style.overflow = opts.overflow[ 0 ];
                    style.overflowX = opts.overflow[ 1 ];
                    style.overflowY = opts.overflow[ 2 ];
                });
            }
        }


        // show/hide pass
        for ( index in props ) {
            value = props[ index ];
            if ( rfxtypes.exec( value ) ) {
                delete props[ index ];
                if ( value === ( hidden ? "hide" : "show" ) ) {
                    continue;
                }
                handled.push( index );
            }
        }

        length = handled.length;
        if ( length ) {
            dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
            if ( hidden ) {
                jQuery( elem ).show();
            } else {
                anim.done(function() {
                    jQuery( elem ).hide();
                });
            }
            anim.done(function() {
                var prop;
                jQuery.removeData( elem, "fxshow", true );
                for ( prop in orig ) {
                    jQuery.style( elem, prop, orig[ prop ] );
                }
            });
            for ( index = 0 ; index < length ; index++ ) {
                prop = handled[ index ];
                tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
                orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

                if ( !( prop in dataShow ) ) {
                    dataShow[ prop ] = tween.start;
                    if ( hidden ) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

    function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
        },
        cur: function() {
            var hooks = Tween.propHooks[ this.prop ];

            return hooks && hooks.get ?
                hooks.get( this ) :
                Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
            var eased,
                hooks = Tween.propHooks[ this.prop ];

            if ( this.options.duration ) {
                this.pos = eased = jQuery.easing[ this.easing ](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = ( this.end - this.start ) * eased + this.start;

            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            if ( hooks && hooks.set ) {
                hooks.set( this );
            } else {
                Tween.propHooks._default.set( this );
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function( tween ) {
                var result;

                if ( tween.elem[ tween.prop ] != null &&
                    (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                    return tween.elem[ tween.prop ];
                }

                // passing any value as a 4th parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css( tween.elem, tween.prop, false, "" );
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function( tween ) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if ( jQuery.fx.step[ tween.prop ] ) {
                    jQuery.fx.step[ tween.prop ]( tween );
                } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                    jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                } else {
                    tween.elem[ tween.prop ] = tween.now;
                }
            }
        }
    };

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
            if ( tween.elem.nodeType && tween.elem.parentNode ) {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    };

    jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
        var cssFn = jQuery.fn[ name ];
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return speed == null || typeof speed === "boolean" ||
            // special check for .toggle( handler, handler, ... )
            ( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
                cssFn.apply( this, arguments ) :
                this.animate( genFx( name, true ), speed, easing, callback );
        };
    });

    jQuery.fn.extend({
        fadeTo: function( speed, to, easing, callback ) {

            // show any hidden elements after setting opacity to 0
            return this.filter( isHidden ).css( "opacity", 0 ).show()

            // animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback );
        },
        animate: function( prop, speed, easing, callback ) {
            var empty = jQuery.isEmptyObject( prop ),
                optall = jQuery.speed( speed, easing, callback ),
                doAnimation = function() {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, jQuery.extend( {}, prop ), optall );

                    // Empty animations resolve immediately
                    if ( empty ) {
                        anim.stop( true );
                    }
                };

            return empty || optall.queue === false ?
                this.each( doAnimation ) :
                this.queue( optall.queue, doAnimation );
        },
        stop: function( type, clearQueue, gotoEnd ) {
            var stopQueue = function( hooks ) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop( gotoEnd );
            };

            if ( typeof type !== "string" ) {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if ( clearQueue && type !== false ) {
                this.queue( type || "fx", [] );
            }

            return this.each(function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data( this );

                if ( index ) {
                    if ( data[ index ] && data[ index ].stop ) {
                        stopQueue( data[ index ] );
                    }
                } else {
                    for ( index in data ) {
                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                            stopQueue( data[ index ] );
                        }
                    }
                }

                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                        timers[ index ].anim.stop( gotoEnd );
                        dequeue = false;
                        timers.splice( index, 1 );
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if ( dequeue || !gotoEnd ) {
                    jQuery.dequeue( this, type );
                }
            });
        }
    });

// Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
        var which,
            attrs = { height: type },
            i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth? 1 : 0;
        for( ; i < 4 ; i += 2 - includeWidth ) {
            which = cssExpand[ i ];
            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }

        if ( includeWidth ) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

// Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });

    jQuery.speed = function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
            jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function() {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            }
        };

        return opt;
    };

    jQuery.easing = {
        linear: function( p ) {
            return p;
        },
        swing: function( p ) {
            return 0.5 - Math.cos( p*Math.PI ) / 2;
        }
    };

    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function() {
        var timer,
            timers = jQuery.timers,
            i = 0;

        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];
            // Checks the timer has not already been removed
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
    };

    jQuery.fx.timer = function( timer ) {
        if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
            timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
        }
    };

    jQuery.fx.interval = 13;

    jQuery.fx.stop = function() {
        clearInterval( timerId );
        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

// Back Compat <1.8 extension point
    jQuery.fx.step = {};

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }
    var rroot = /^(?:body|html)$/i;

    jQuery.fn.offset = function( options ) {
        if ( arguments.length ) {
            return options === undefined ?
                this :
                this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
        }

        var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
            box = { top: 0, left: 0 },
            elem = this[ 0 ],
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        if ( (body = doc.body) === elem ) {
            return jQuery.offset.bodyOffset( elem );
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if ( !jQuery.contains( docElem, elem ) ) {
            return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof elem.getBoundingClientRect !== "undefined" ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        clientTop  = docElem.clientTop  || body.clientTop  || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;
        scrollTop  = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;
        return {
            top: box.top  + scrollTop  - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    };

    jQuery.offset = {

        bodyOffset: function( body ) {
            var top = body.offsetTop,
                left = body.offsetLeft;

            if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
                top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
                left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
            }

            return { top: top, left: left };
        },

        setOffset: function( elem, options, i ) {
            var position = jQuery.css( elem, "position" );

            // set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }

            var curElem = jQuery( elem ),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css( elem, "top" ),
                curCSSLeft = jQuery.css( elem, "left" ),
                calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if ( calculatePosition ) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat( curCSSTop ) || 0;
                curLeft = parseFloat( curCSSLeft ) || 0;
            }

            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            }

            if ( options.top != null ) {
                props.top = ( options.top - curOffset.top ) + curTop;
            }
            if ( options.left != null ) {
                props.left = ( options.left - curOffset.left ) + curLeft;
            }

            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };


    jQuery.fn.extend({

        position: function() {
            if ( !this[0] ) {
                return;
            }

            var elem = this[0],

                // Get *real* offsetParent
                offsetParent = this.offsetParent(),

                // Get correct offsets
                offset       = this.offset(),
                parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
            offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

            // Add offsetParent borders
            parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
            parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

            // Subtract the two offsets
            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.body;
                while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.body;
            });
        }
    });


// Create scrollLeft and scrollTop methods
    jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
        var top = /Y/.test( prop );

        jQuery.fn[ method ] = function( val ) {
            return jQuery.access( this, function( elem, method, val ) {
                var win = getWindow( elem );

                if ( val === undefined ) {
                    return win ? (prop in win) ? win[ prop ] :
                        win.document.documentElement[ method ] :
                        elem[ method ];
                }

                if ( win ) {
                    win.scrollTo(
                        !top ? val : jQuery( win ).scrollLeft(),
                        top ? val : jQuery( win ).scrollTop()
                    );

                } else {
                    elem[ method ] = val;
                }
            }, method, val, arguments.length, null );
        };
    });

    function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
                false;
    }
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[ funcName ] = function( margin, value ) {
                var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                    extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

                return jQuery.access( this, function( elem, type, value ) {
                    var doc;

                    if ( jQuery.isWindow( elem ) ) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement[ "client" + name ];
                    }

                    // Get document width or height
                    if ( elem.nodeType === 9 ) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                            elem.body[ "offset" + name ], doc[ "offset" + name ],
                            doc[ "client" + name ]
                        );
                    }

                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        jQuery.css( elem, type, value, extra ) :

                        // Set width or height on the element
                        jQuery.style( elem, type, value, extra );
                }, type, chainable ? margin : undefined, chainable, null );
            };
        });
    });
// Expose jQuery to the global object
    window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
    if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
        define( "jquery", [], function () { return jQuery; } );
    }

})( window );;
///<jscompress sourcefile="jquery.ui.js" />
//Version: 1.4.3
(function($){
$.parser={auto:true,onComplete:function(_1){
},plugins:["draggable","droppable","resizable","pagination","tooltip","linkbutton","menu","menubutton","splitbutton","switchbutton","progressbar","tree","textbox","filebox","combo","combobox","combotree","combogrid","numberbox","validatebox","searchbox","spinner","numberspinner","timespinner","datetimespinner","calendar","datebox","datetimebox","slider","layout","panel","datagrid","propertygrid","treegrid","datalist","tabs","accordion","window","dialog","form"],parse:function(_2){
var aa=[];
for(var i=0;i<$.parser.plugins.length;i++){
var _3=$.parser.plugins[i];
var r=$(".ui-"+_3,_2);
if(r.length){
if(r[_3]){
r[_3]();
}else{
aa.push({name:_3,jq:r});
}
}
}
if(aa.length&&window.easyloader){
var _4=[];
for(var i=0;i<aa.length;i++){
_4.push(aa[i].name);
}
easyloader.load(_4,function(){
for(var i=0;i<aa.length;i++){
var _5=aa[i].name;
var jq=aa[i].jq;
jq[_5]();
}
$.parser.onComplete.call($.parser,_2);
});
}else{
$.parser.onComplete.call($.parser,_2);
}
},parseValue:function(_6,_7,_8,_9){
_9=_9||0;
var v=$.trim(String(_7||""));
var _a=v.substr(v.length-1,1);
if(_a=="%"){
v=parseInt(v.substr(0,v.length-1));
if(_6.toLowerCase().indexOf("width")>=0){
v=Math.floor((_8.width()-_9)*v/100);
}else{
v=Math.floor((_8.height()-_9)*v/100);
}
}else{
v=parseInt(v)||undefined;
}
return v;
},parseOptions:function(_b,_c){
var t=$(_b);
var _d={};
var s=$.trim(t.attr("data-options"));
if(s){
if(s.substring(0,1)!="{"){
s="{"+s+"}";
}
_d=(new Function("return "+s))();
}
$.map(["width","height","left","top","minWidth","maxWidth","minHeight","maxHeight"],function(p){
var pv=$.trim(_b.style[p]||"");
if(pv){
if(pv.indexOf("%")==-1){
pv=parseInt(pv)||undefined;
}
_d[p]=pv;
}
});
if(_c){
var _e={};
for(var i=0;i<_c.length;i++){
var pp=_c[i];
if(typeof pp=="string"){
_e[pp]=t.attr(pp);
}else{
for(var _f in pp){
var _10=pp[_f];
if(_10=="boolean"){
_e[_f]=t.attr(_f)?(t.attr(_f)=="true"):undefined;
}else{
if(_10=="number"){
_e[_f]=t.attr(_f)=="0"?0:parseFloat(t.attr(_f))||undefined;
}
}
}
}
}
$.extend(_d,_e);
}
return _d;
}};
$(function(){
var d=$("<div style=\"position:absolute;top:-1000px;width:100px;height:100px;padding:5px\"></div>").appendTo("body");
$._boxModel=d.outerWidth()!=100;
d.remove();
d=$("<div style=\"position:fixed\"></div>").appendTo("body");
$._positionFixed=(d.css("position")=="fixed");
d.remove();
if(!window.easyloader&&$.parser.auto){
$.parser.parse();
}
});
$.fn._outerWidth=function(_11){
if(_11==undefined){
if(this[0]==window){
return this.width()||document.body.clientWidth;
}
return this.outerWidth()||0;
}
return this._size("width",_11);
};
$.fn._outerHeight=function(_12){
if(_12==undefined){
if(this[0]==window){
return this.height()||document.body.clientHeight;
}
return this.outerHeight()||0;
}
return this._size("height",_12);
};
$.fn._scrollLeft=function(_13){
if(_13==undefined){
return this.scrollLeft();
}else{
return this.each(function(){
$(this).scrollLeft(_13);
});
}
};
$.fn._propAttr=$.fn.prop||$.fn.attr;
$.fn._size=function(_14,_15){
if(typeof _14=="string"){
if(_14=="clear"){
return this.each(function(){
$(this).css({width:"",minWidth:"",maxWidth:"",height:"",minHeight:"",maxHeight:""});
});
}else{
if(_14=="fit"){
return this.each(function(){
_16(this,this.tagName=="BODY"?$("body"):$(this).parent(),true);
});
}else{
if(_14=="unfit"){
return this.each(function(){
_16(this,$(this).parent(),false);
});
}else{
if(_15==undefined){
return _17(this[0],_14);
}else{
return this.each(function(){
_17(this,_14,_15);
});
}
}
}
}
}else{
return this.each(function(){
_15=_15||$(this).parent();
$.extend(_14,_16(this,_15,_14.fit)||{});
var r1=_18(this,"width",_15,_14);
var r2=_18(this,"height",_15,_14);
if(r1||r2){
$(this).addClass("ui-fluid");
}else{
$(this).removeClass("ui-fluid");
}
});
}
function _16(_19,_1a,fit){
if(!_1a.length){
return false;
}
var t=$(_19)[0];
var p=_1a[0];
var _1b=p.fcount||0;
if(fit){
if(!t.fitted){
t.fitted=true;
p.fcount=_1b+1;
$(p).addClass("panel-noscroll");
if(p.tagName=="BODY"){
$("html").addClass("panel-fit");
}
}
return {width:($(p).width()||1),height:($(p).height()||1)};
}else{
if(t.fitted){
t.fitted=false;
p.fcount=_1b-1;
if(p.fcount==0){
$(p).removeClass("panel-noscroll");
if(p.tagName=="BODY"){
$("html").removeClass("panel-fit");
}
}
}
return false;
}
};
function _18(_1c,_1d,_1e,_1f){
var t=$(_1c);
var p=_1d;
var p1=p.substr(0,1).toUpperCase()+p.substr(1);
var min=$.parser.parseValue("min"+p1,_1f["min"+p1],_1e);
var max=$.parser.parseValue("max"+p1,_1f["max"+p1],_1e);
var val=$.parser.parseValue(p,_1f[p],_1e);
var _20=(String(_1f[p]||"").indexOf("%")>=0?true:false);
if(!isNaN(val)){
var v=Math.min(Math.max(val,min||0),max||99999);
if(!_20){
_1f[p]=v;
}
t._size("min"+p1,"");
t._size("max"+p1,"");
t._size(p,v);
}else{
t._size(p,"");
t._size("min"+p1,min);
t._size("max"+p1,max);
}
return _20||_1f.fit;
};
function _17(_21,_22,_23){
var t=$(_21);
if(_23==undefined){
_23=parseInt(_21.style[_22]);
if(isNaN(_23)){
return undefined;
}
if($._boxModel){
_23+=_24();
}
return _23;
}else{
if(_23===""){
t.css(_22,"");
}else{
if($._boxModel){
_23-=_24();
if(_23<0){
_23=0;
}
}
t.css(_22,_23+"px");
}
}
function _24(){
if(_22.toLowerCase().indexOf("width")>=0){
return t.outerWidth()-t.width();
}else{
return t.outerHeight()-t.height();
}
};
};
};
})(jQuery);
(function($){
var _25=null;
var _26=null;
var _27=false;
function _28(e){
if(e.touches.length!=1){
return;
}
if(!_27){
_27=true;
dblClickTimer=setTimeout(function(){
_27=false;
},500);
}else{
clearTimeout(dblClickTimer);
_27=false;
_29(e,"dblclick");
}
_25=setTimeout(function(){
_29(e,"contextmenu",3);
},1000);
_29(e,"mousedown");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _2a(e){
if(e.touches.length!=1){
return;
}
if(_25){
clearTimeout(_25);
}
_29(e,"mousemove");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _2b(e){
if(_25){
clearTimeout(_25);
}
_29(e,"mouseup");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _29(e,_2c,_2d){
var _2e=new $.Event(_2c);
_2e.pageX=e.changedTouches[0].pageX;
_2e.pageY=e.changedTouches[0].pageY;
_2e.which=_2d||1;
$(e.target).trigger(_2e);
};
if(document.addEventListener){
document.addEventListener("touchstart",_28,true);
document.addEventListener("touchmove",_2a,true);
document.addEventListener("touchend",_2b,true);
}
})(jQuery);
(function($){
function _2f(e){
var _30=$.data(e.data.target,"draggable");
var _31=_30.options;
var _32=_30.proxy;
var _33=e.data;
var _34=_33.startLeft+e.pageX-_33.startX;
var top=_33.startTop+e.pageY-_33.startY;
if(_32){
if(_32.parent()[0]==document.body){
if(_31.deltaX!=null&&_31.deltaX!=undefined){
_34=e.pageX+_31.deltaX;
}else{
_34=e.pageX-e.data.offsetWidth;
}
if(_31.deltaY!=null&&_31.deltaY!=undefined){
top=e.pageY+_31.deltaY;
}else{
top=e.pageY-e.data.offsetHeight;
}
}else{
if(_31.deltaX!=null&&_31.deltaX!=undefined){
_34+=e.data.offsetWidth+_31.deltaX;
}
if(_31.deltaY!=null&&_31.deltaY!=undefined){
top+=e.data.offsetHeight+_31.deltaY;
}
}
}
if(e.data.parent!=document.body){
_34+=$(e.data.parent).scrollLeft();
top+=$(e.data.parent).scrollTop();
}
if(_31.axis=="h"){
_33.left=_34;
}else{
if(_31.axis=="v"){
_33.top=top;
}else{
_33.left=_34;
_33.top=top;
}
}
};
function _35(e){
var _36=$.data(e.data.target,"draggable");
var _37=_36.options;
var _38=_36.proxy;
if(!_38){
_38=$(e.data.target);
}
_38.css({left:e.data.left,top:e.data.top});
$("body").css("cursor",_37.cursor);
};
function _39(e){
if(!$.fn.draggable.isDragging){
return false;
}
var _3a=$.data(e.data.target,"draggable");
var _3b=_3a.options;
var _3c=$(".droppable").filter(function(){
return e.data.target!=this;
}).filter(function(){
var _3d=$.data(this,"droppable").options.accept;
if(_3d){
return $(_3d).filter(function(){
return this==e.data.target;
}).length>0;
}else{
return true;
}
});
_3a.droppables=_3c;
var _3e=_3a.proxy;
if(!_3e){
if(_3b.proxy){
if(_3b.proxy=="clone"){
_3e=$(e.data.target).clone().insertAfter(e.data.target);
}else{
_3e=_3b.proxy.call(e.data.target,e.data.target);
}
_3a.proxy=_3e;
}else{
_3e=$(e.data.target);
}
}
_3e.css("position","absolute");
_2f(e);
_35(e);
_3b.onStartDrag.call(e.data.target,e);
return false;
};
function _3f(e){
if(!$.fn.draggable.isDragging){
return false;
}
var _40=$.data(e.data.target,"draggable");
_2f(e);
if(_40.options.onDrag.call(e.data.target,e)!=false){
_35(e);
}
var _41=e.data.target;
_40.droppables.each(function(){
var _42=$(this);
if(_42.droppable("options").disabled){
return;
}
var p2=_42.offset();
if(e.pageX>p2.left&&e.pageX<p2.left+_42.outerWidth()&&e.pageY>p2.top&&e.pageY<p2.top+_42.outerHeight()){
if(!this.entered){
$(this).trigger("_dragenter",[_41]);
this.entered=true;
}
$(this).trigger("_dragover",[_41]);
}else{
if(this.entered){
$(this).trigger("_dragleave",[_41]);
this.entered=false;
}
}
});
return false;
};
function _43(e){
if(!$.fn.draggable.isDragging){
_44();
return false;
}
_3f(e);
var _45=$.data(e.data.target,"draggable");
var _46=_45.proxy;
var _47=_45.options;
if(_47.revert){
if(_48()==true){
$(e.data.target).css({position:e.data.startPosition,left:e.data.startLeft,top:e.data.startTop});
}else{
if(_46){
var _49,top;
if(_46.parent()[0]==document.body){
_49=e.data.startX-e.data.offsetWidth;
top=e.data.startY-e.data.offsetHeight;
}else{
_49=e.data.startLeft;
top=e.data.startTop;
}
_46.animate({left:_49,top:top},function(){
_4a();
});
}else{
$(e.data.target).animate({left:e.data.startLeft,top:e.data.startTop},function(){
$(e.data.target).css("position",e.data.startPosition);
});
}
}
}else{
$(e.data.target).css({position:"absolute",left:e.data.left,top:e.data.top});
_48();
}
_47.onStopDrag.call(e.data.target,e);
_44();
function _4a(){
if(_46){
_46.remove();
}
_45.proxy=null;
};
function _48(){
var _4b=false;
_45.droppables.each(function(){
var _4c=$(this);
if(_4c.droppable("options").disabled){
return;
}
var p2=_4c.offset();
if(e.pageX>p2.left&&e.pageX<p2.left+_4c.outerWidth()&&e.pageY>p2.top&&e.pageY<p2.top+_4c.outerHeight()){
if(_47.revert){
$(e.data.target).css({position:e.data.startPosition,left:e.data.startLeft,top:e.data.startTop});
}
$(this).trigger("_drop",[e.data.target]);
_4a();
_4b=true;
this.entered=false;
return false;
}
});
if(!_4b&&!_47.revert){
_4a();
}
return _4b;
};
return false;
};
function _44(){
if($.fn.draggable.timer){
clearTimeout($.fn.draggable.timer);
$.fn.draggable.timer=undefined;
}
$(document).unbind(".draggable");
$.fn.draggable.isDragging=false;
setTimeout(function(){
$("body").css("cursor","");
},100);
};
$.fn.draggable=function(_4d,_4e){
if(typeof _4d=="string"){
return $.fn.draggable.methods[_4d](this,_4e);
}
return this.each(function(){
var _4f;
var _50=$.data(this,"draggable");
if(_50){
_50.handle.unbind(".draggable");
_4f=$.extend(_50.options,_4d);
}else{
_4f=$.extend({},$.fn.draggable.defaults,$.fn.draggable.parseOptions(this),_4d||{});
}
var _51=_4f.handle?(typeof _4f.handle=="string"?$(_4f.handle,this):_4f.handle):$(this);
$.data(this,"draggable",{options:_4f,handle:_51});
if(_4f.disabled){
$(this).css("cursor","");
return;
}
_51.unbind(".draggable").bind("mousemove.draggable",{target:this},function(e){
if($.fn.draggable.isDragging){
return;
}
var _52=$.data(e.data.target,"draggable").options;
if(_53(e)){
$(this).css("cursor",_52.cursor);
}else{
$(this).css("cursor","");
}
}).bind("mouseleave.draggable",{target:this},function(e){
$(this).css("cursor","");
}).bind("mousedown.draggable",{target:this},function(e){
if(_53(e)==false){
return;
}
$(this).css("cursor","");
var _54=$(e.data.target).position();
var _55=$(e.data.target).offset();
var _56={startPosition:$(e.data.target).css("position"),startLeft:_54.left,startTop:_54.top,left:_54.left,top:_54.top,startX:e.pageX,startY:e.pageY,offsetWidth:(e.pageX-_55.left),offsetHeight:(e.pageY-_55.top),target:e.data.target,parent:$(e.data.target).parent()[0]};
$.extend(e.data,_56);
var _57=$.data(e.data.target,"draggable").options;
if(_57.onBeforeDrag.call(e.data.target,e)==false){
return;
}
$(document).bind("mousedown.draggable",e.data,_39);
$(document).bind("mousemove.draggable",e.data,_3f);
$(document).bind("mouseup.draggable",e.data,_43);
$.fn.draggable.timer=setTimeout(function(){
$.fn.draggable.isDragging=true;
_39(e);
},_57.delay);
return false;
});
function _53(e){
var _58=$.data(e.data.target,"draggable");
var _59=_58.handle;
var _5a=$(_59).offset();
var _5b=$(_59).outerWidth();
var _5c=$(_59).outerHeight();
var t=e.pageY-_5a.top;
var r=_5a.left+_5b-e.pageX;
var b=_5a.top+_5c-e.pageY;
var l=e.pageX-_5a.left;
return Math.min(t,r,b,l)>_58.options.edge;
};
});
};
$.fn.draggable.methods={options:function(jq){
return $.data(jq[0],"draggable").options;
},proxy:function(jq){
return $.data(jq[0],"draggable").proxy;
},enable:function(jq){
return jq.each(function(){
$(this).draggable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).draggable({disabled:true});
});
}};
$.fn.draggable.parseOptions=function(_5d){
var t=$(_5d);
return $.extend({},$.parser.parseOptions(_5d,["cursor","handle","axis",{"revert":"boolean","deltaX":"number","deltaY":"number","edge":"number","delay":"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.draggable.defaults={proxy:null,revert:false,cursor:"move",deltaX:null,deltaY:null,handle:null,disabled:false,edge:0,axis:null,delay:100,onBeforeDrag:function(e){
},onStartDrag:function(e){
},onDrag:function(e){
},onStopDrag:function(e){
}};
$.fn.draggable.isDragging=false;
})(jQuery);
(function($){
function _5e(_5f){
$(_5f).addClass("droppable");
$(_5f).bind("_dragenter",function(e,_60){
$.data(_5f,"droppable").options.onDragEnter.apply(_5f,[e,_60]);
});
$(_5f).bind("_dragleave",function(e,_61){
$.data(_5f,"droppable").options.onDragLeave.apply(_5f,[e,_61]);
});
$(_5f).bind("_dragover",function(e,_62){
$.data(_5f,"droppable").options.onDragOver.apply(_5f,[e,_62]);
});
$(_5f).bind("_drop",function(e,_63){
$.data(_5f,"droppable").options.onDrop.apply(_5f,[e,_63]);
});
};
$.fn.droppable=function(_64,_65){
if(typeof _64=="string"){
return $.fn.droppable.methods[_64](this,_65);
}
_64=_64||{};
return this.each(function(){
var _66=$.data(this,"droppable");
if(_66){
$.extend(_66.options,_64);
}else{
_5e(this);
$.data(this,"droppable",{options:$.extend({},$.fn.droppable.defaults,$.fn.droppable.parseOptions(this),_64)});
}
});
};
$.fn.droppable.methods={options:function(jq){
return $.data(jq[0],"droppable").options;
},enable:function(jq){
return jq.each(function(){
$(this).droppable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).droppable({disabled:true});
});
}};
$.fn.droppable.parseOptions=function(_67){
var t=$(_67);
return $.extend({},$.parser.parseOptions(_67,["accept"]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.droppable.defaults={accept:null,disabled:false,onDragEnter:function(e,_68){
},onDragOver:function(e,_69){
},onDragLeave:function(e,_6a){
},onDrop:function(e,_6b){
}};
})(jQuery);
(function($){
$.fn.resizable=function(_6c,_6d){
if(typeof _6c=="string"){
return $.fn.resizable.methods[_6c](this,_6d);
}
function _6e(e){
var _6f=e.data;
var _70=$.data(_6f.target,"resizable").options;
if(_6f.dir.indexOf("e")!=-1){
var _71=_6f.startWidth+e.pageX-_6f.startX;
_71=Math.min(Math.max(_71,_70.minWidth),_70.maxWidth);
_6f.width=_71;
}
if(_6f.dir.indexOf("s")!=-1){
var _72=_6f.startHeight+e.pageY-_6f.startY;
_72=Math.min(Math.max(_72,_70.minHeight),_70.maxHeight);
_6f.height=_72;
}
if(_6f.dir.indexOf("w")!=-1){
var _71=_6f.startWidth-e.pageX+_6f.startX;
_71=Math.min(Math.max(_71,_70.minWidth),_70.maxWidth);
_6f.width=_71;
_6f.left=_6f.startLeft+_6f.startWidth-_6f.width;
}
if(_6f.dir.indexOf("n")!=-1){
var _72=_6f.startHeight-e.pageY+_6f.startY;
_72=Math.min(Math.max(_72,_70.minHeight),_70.maxHeight);
_6f.height=_72;
_6f.top=_6f.startTop+_6f.startHeight-_6f.height;
}
};
function _73(e){
var _74=e.data;
var t=$(_74.target);
t.css({left:_74.left,top:_74.top});
if(t.outerWidth()!=_74.width){
t._outerWidth(_74.width);
}
if(t.outerHeight()!=_74.height){
t._outerHeight(_74.height);
}
};
function _75(e){
$.fn.resizable.isResizing=true;
$.data(e.data.target,"resizable").options.onStartResize.call(e.data.target,e);
return false;
};
function _76(e){
_6e(e);
if($.data(e.data.target,"resizable").options.onResize.call(e.data.target,e)!=false){
_73(e);
}
return false;
};
function _77(e){
$.fn.resizable.isResizing=false;
_6e(e,true);
_73(e);
$.data(e.data.target,"resizable").options.onStopResize.call(e.data.target,e);
$(document).unbind(".resizable");
$("body").css("cursor","");
return false;
};
return this.each(function(){
var _78=null;
var _79=$.data(this,"resizable");
if(_79){
$(this).unbind(".resizable");
_78=$.extend(_79.options,_6c||{});
}else{
_78=$.extend({},$.fn.resizable.defaults,$.fn.resizable.parseOptions(this),_6c||{});
$.data(this,"resizable",{options:_78});
}
if(_78.disabled==true){
return;
}
$(this).bind("mousemove.resizable",{target:this},function(e){
if($.fn.resizable.isResizing){
return;
}
var dir=_7a(e);
if(dir==""){
$(e.data.target).css("cursor","");
}else{
$(e.data.target).css("cursor",dir+"-resize");
}
}).bind("mouseleave.resizable",{target:this},function(e){
$(e.data.target).css("cursor","");
}).bind("mousedown.resizable",{target:this},function(e){
var dir=_7a(e);
if(dir==""){
return;
}
function _7b(css){
var val=parseInt($(e.data.target).css(css));
if(isNaN(val)){
return 0;
}else{
return val;
}
};
var _7c={target:e.data.target,dir:dir,startLeft:_7b("left"),startTop:_7b("top"),left:_7b("left"),top:_7b("top"),startX:e.pageX,startY:e.pageY,startWidth:$(e.data.target).outerWidth(),startHeight:$(e.data.target).outerHeight(),width:$(e.data.target).outerWidth(),height:$(e.data.target).outerHeight(),deltaWidth:$(e.data.target).outerWidth()-$(e.data.target).width(),deltaHeight:$(e.data.target).outerHeight()-$(e.data.target).height()};
$(document).bind("mousedown.resizable",_7c,_75);
$(document).bind("mousemove.resizable",_7c,_76);
$(document).bind("mouseup.resizable",_7c,_77);
$("body").css("cursor",dir+"-resize");
});
function _7a(e){
var tt=$(e.data.target);
var dir="";
var _7d=tt.offset();
var _7e=tt.outerWidth();
var _7f=tt.outerHeight();
var _80=_78.edge;
if(e.pageY>_7d.top&&e.pageY<_7d.top+_80){
dir+="n";
}else{
if(e.pageY<_7d.top+_7f&&e.pageY>_7d.top+_7f-_80){
dir+="s";
}
}
if(e.pageX>_7d.left&&e.pageX<_7d.left+_80){
dir+="w";
}else{
if(e.pageX<_7d.left+_7e&&e.pageX>_7d.left+_7e-_80){
dir+="e";
}
}
var _81=_78.handles.split(",");
for(var i=0;i<_81.length;i++){
var _82=_81[i].replace(/(^\s*)|(\s*$)/g,"");
if(_82=="all"||_82==dir){
return dir;
}
}
return "";
};
});
};
$.fn.resizable.methods={options:function(jq){
return $.data(jq[0],"resizable").options;
},enable:function(jq){
return jq.each(function(){
$(this).resizable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).resizable({disabled:true});
});
}};
$.fn.resizable.parseOptions=function(_83){
var t=$(_83);
return $.extend({},$.parser.parseOptions(_83,["handles",{minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number",edge:"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.resizable.defaults={disabled:false,handles:"n, e, s, w, ne, se, sw, nw, all",minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000,edge:5,onStartResize:function(e){
},onResize:function(e){
},onStopResize:function(e){
}};
$.fn.resizable.isResizing=false;
})(jQuery);
(function($){
function _84(_85,_86){
var _87=$.data(_85,"linkbutton").options;
if(_86){
$.extend(_87,_86);
}
if(_87.width||_87.height||_87.fit){
var btn=$(_85);
var _88=btn.parent();
var _89=btn.is(":visible");
if(!_89){
var _8a=$("<div style=\"display:none\"></div>").insertBefore(_85);
var _8b={position:btn.css("position"),display:btn.css("display"),left:btn.css("left")};
btn.appendTo("body");
btn.css({position:"absolute",display:"inline-block",left:-20000});
}
btn._size(_87,_88);
var _8c=btn.find(".l-btn-left");
_8c.css("margin-top",0);
_8c.css("margin-top",parseInt((btn.height()-_8c.height())/2)+"px");
if(!_89){
btn.insertAfter(_8a);
btn.css(_8b);
_8a.remove();
}
}
};
function _8d(_8e){
var _8f=$.data(_8e,"linkbutton").options;
var t=$(_8e).empty();
t.addClass("l-btn").removeClass("l-btn-plain l-btn-selected l-btn-plain-selected l-btn-outline");
t.removeClass("l-btn-small l-btn-medium l-btn-large").addClass("l-btn-"+_8f.size);
if(_8f.plain){
t.addClass("l-btn-plain");
}
if(_8f.outline){
t.addClass("l-btn-outline");
}
if(_8f.selected){
t.addClass(_8f.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
}
t.attr("group",_8f.group||"");
t.attr("id",_8f.id||"");
var _90=$("<span class=\"l-btn-left\"></span>").appendTo(t);
if(_8f.text){
$("<span class=\"l-btn-text\"></span>").html(_8f.text).appendTo(_90);
}else{
$("<span class=\"l-btn-text l-btn-empty\">&nbsp;</span>").appendTo(_90);
}
if(_8f.iconCls){
$("<span class=\"l-btn-icon\">&nbsp;</span>").addClass(_8f.iconCls).appendTo(_90);
_90.addClass("l-btn-icon-"+_8f.iconAlign);
}
t.unbind(".linkbutton").bind("focus.linkbutton",function(){
if(!_8f.disabled){
$(this).addClass("l-btn-focus");
}
}).bind("blur.linkbutton",function(){
$(this).removeClass("l-btn-focus");
}).bind("click.linkbutton",function(){
if(!_8f.disabled){
if(_8f.toggle){
if(_8f.selected){
$(this).linkbutton("unselect");
}else{
$(this).linkbutton("select");
}
}
_8f.onClick.call(this);
}
});
_91(_8e,_8f.selected);
_92(_8e,_8f.disabled);
};
function _91(_93,_94){
var _95=$.data(_93,"linkbutton").options;
if(_94){
if(_95.group){
$("a.l-btn[group=\""+_95.group+"\"]").each(function(){
var o=$(this).linkbutton("options");
if(o.toggle){
$(this).removeClass("l-btn-selected l-btn-plain-selected");
o.selected=false;
}
});
}
$(_93).addClass(_95.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
_95.selected=true;
}else{
if(!_95.group){
$(_93).removeClass("l-btn-selected l-btn-plain-selected");
_95.selected=false;
}
}
};
function _92(_96,_97){
var _98=$.data(_96,"linkbutton");
var _99=_98.options;
$(_96).removeClass("l-btn-disabled l-btn-plain-disabled");
if(_97){
_99.disabled=true;
var _9a=$(_96).attr("href");
if(_9a){
_98.href=_9a;
$(_96).attr("href","javascript:void(0)");
}
if(_96.onclick){
_98.onclick=_96.onclick;
_96.onclick=null;
}
_99.plain?$(_96).addClass("l-btn-disabled l-btn-plain-disabled"):$(_96).addClass("l-btn-disabled");
}else{
_99.disabled=false;
if(_98.href){
$(_96).attr("href",_98.href);
}
if(_98.onclick){
_96.onclick=_98.onclick;
}
}
};
$.fn.linkbutton=function(_9b,_9c){
if(typeof _9b=="string"){
return $.fn.linkbutton.methods[_9b](this,_9c);
}
_9b=_9b||{};
return this.each(function(){
var _9d=$.data(this,"linkbutton");
if(_9d){
$.extend(_9d.options,_9b);
}else{
$.data(this,"linkbutton",{options:$.extend({},$.fn.linkbutton.defaults,$.fn.linkbutton.parseOptions(this),_9b)});
$(this).removeAttr("disabled");
$(this).bind("_resize",function(e,_9e){
if($(this).hasClass("ui-fluid")||_9e){
_84(this);
}
return false;
});
}
_8d(this);
_84(this);
});
};
$.fn.linkbutton.methods={options:function(jq){
return $.data(jq[0],"linkbutton").options;
},resize:function(jq,_9f){
return jq.each(function(){
_84(this,_9f);
});
},enable:function(jq){
return jq.each(function(){
_92(this,false);
});
},disable:function(jq){
return jq.each(function(){
_92(this,true);
});
},select:function(jq){
return jq.each(function(){
_91(this,true);
});
},unselect:function(jq){
return jq.each(function(){
_91(this,false);
});
}};
$.fn.linkbutton.parseOptions=function(_a0){
var t=$(_a0);
return $.extend({},$.parser.parseOptions(_a0,["id","iconCls","iconAlign","group","size","text",{plain:"boolean",toggle:"boolean",selected:"boolean",outline:"boolean"}]),{disabled:(t.attr("disabled")?true:undefined),text:($.trim(t.html())||undefined),iconCls:(t.attr("icon")||t.attr("iconCls"))});
};
$.fn.linkbutton.defaults={id:null,disabled:false,toggle:false,selected:false,outline:false,group:null,plain:false,text:"",iconCls:null,iconAlign:"left",size:"small",onClick:function(){
}};
})(jQuery);
(function($){
function _a1(_a2){
var _a3=$.data(_a2,"pagination");
var _a4=_a3.options;
var bb=_a3.bb={};
var _a5=$(_a2).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
var tr=_a5.find("tr");
var aa=$.extend([],_a4.layout);
if(!_a4.showPageList){
_a6(aa,"list");
}
if(!_a4.showRefresh){
_a6(aa,"refresh");
}
if(aa[0]=="sep"){
aa.shift();
}
if(aa[aa.length-1]=="sep"){
aa.pop();
}
for(var _a7=0;_a7<aa.length;_a7++){
var _a8=aa[_a7];
if(_a8=="list"){
var ps=$("<select class=\"pagination-page-list\"></select>");
ps.bind("change",function(){
_a4.pageSize=parseInt($(this).val());
_a4.onChangePageSize.call(_a2,_a4.pageSize);
_ae(_a2,_a4.pageNumber);
});
for(var i=0;i<_a4.pageList.length;i++){
$("<option></option>").text(_a4.pageList[i]).appendTo(ps);
}
$("<td></td>").append(ps).appendTo(tr);
}else{
if(_a8=="sep"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
if(_a8=="first"){
bb.first=_a9("first");
}else{
if(_a8=="prev"){
bb.prev=_a9("prev");
}else{
if(_a8=="next"){
bb.next=_a9("next");
}else{
if(_a8=="last"){
bb.last=_a9("last");
}else{
if(_a8=="manual"){
$("<span style=\"padding-left:6px;\"></span>").html(_a4.beforePageText).appendTo(tr).wrap("<td></td>");
bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
if(e.keyCode==13){
var _aa=parseInt($(this).val())||1;
_ae(_a2,_aa);
return false;
}
});
bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
}else{
if(_a8=="refresh"){
bb.refresh=_a9("refresh");
}else{
if(_a8=="links"){
$("<td class=\"pagination-links\"></td>").appendTo(tr);
}
}
}
}
}
}
}
}
}
}
if(_a4.buttons){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
if($.isArray(_a4.buttons)){
for(var i=0;i<_a4.buttons.length;i++){
var btn=_a4.buttons[i];
if(btn=="-"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
a[0].onclick=eval(btn.handler||function(){
});
a.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
var td=$("<td></td>").appendTo(tr);
$(_a4.buttons).appendTo(td).show();
}
}
//Modify by gongjg on 2015-10-10
if(_a4.showPageInfo) {
$("<div class=\"pagination-info\"></div>").appendTo(_a5);
}
$("<div style=\"clear:both;\"></div>").appendTo(_a5);
function _a9(_ab){
var btn=_a4.nav[_ab];
var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
a.wrap("<td></td>");
a.linkbutton({iconCls:btn.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
btn.handler.call(_a2);
});
return a;
};
function _a6(aa,_ac){
var _ad=$.inArray(_ac,aa);
if(_ad>=0){
aa.splice(_ad,1);
}
return aa;
};
};
function _ae(_af,_b0){
var _b1=$.data(_af,"pagination").options;
_b2(_af,{pageNumber:_b0});
_b1.onSelectPage.call(_af,_b1.pageNumber,_b1.pageSize);
};
function _b2(_b3,_b4){
var _b5=$.data(_b3,"pagination");
var _b6=_b5.options;
var bb=_b5.bb;
$.extend(_b6,_b4||{});
var ps=$(_b3).find("select.pagination-page-list");
if(ps.length){
ps.val(_b6.pageSize+"");
_b6.pageSize=parseInt(ps.val());
}
var _b7=Math.ceil(_b6.total/_b6.pageSize)||1;
if(_b6.pageNumber<1){
_b6.pageNumber=1;
}
if(_b6.pageNumber>_b7){
_b6.pageNumber=_b7;
}
if(_b6.total==0){
_b6.pageNumber=0;
_b7=0;
}
if(bb.num){
bb.num.val(_b6.pageNumber);
}
if(bb.after){
bb.after.html(_b6.afterPageText.replace(/{pages}/,_b7));
}
var td=$(_b3).find("td.pagination-links");
if(td.length){
td.empty();
var _b8=_b6.pageNumber-Math.floor(_b6.links/2);
if(_b8<1){
_b8=1;
}
var _b9=_b8+_b6.links-1;
if(_b9>_b7){
_b9=_b7;
}
_b8=_b9-_b6.links+1;
if(_b8<1){
_b8=1;
}
for(var i=_b8;i<=_b9;i++){
var a=$("<a class=\"pagination-link\" href=\"javascript:void(0)\"></a>").appendTo(td);
a.linkbutton({plain:true,text:i});
if(i==_b6.pageNumber){
a.linkbutton("select");
}else{
a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
_ae(_b3,e.data.pageNumber);
});
}
}
}
var _ba=_b6.displayMsg;
_ba=_ba.replace(/{from}/,_b6.total==0?0:_b6.pageSize*(_b6.pageNumber-1)+1);
_ba=_ba.replace(/{to}/,Math.min(_b6.pageSize*(_b6.pageNumber),_b6.total));
_ba=_ba.replace(/{total}/,_b6.total);
$(_b3).find("div.pagination-info").html(_ba);
if(bb.first){
bb.first.linkbutton({disabled:((!_b6.total)||_b6.pageNumber==1)});
}
if(bb.prev){
bb.prev.linkbutton({disabled:((!_b6.total)||_b6.pageNumber==1)});
}
if(bb.next){
bb.next.linkbutton({disabled:(_b6.pageNumber==_b7)});
}
if(bb.last){
bb.last.linkbutton({disabled:(_b6.pageNumber==_b7)});
}
_bb(_b3,_b6.loading);
};
function _bb(_bc,_bd){
var _be=$.data(_bc,"pagination");
var _bf=_be.options;
_bf.loading=_bd;
if(_bf.showRefresh&&_be.bb.refresh){
_be.bb.refresh.linkbutton({iconCls:(_bf.loading?"pagination-loading":"pagination-load")});
}
};
$.fn.pagination=function(_c0,_c1){
if(typeof _c0=="string"){
return $.fn.pagination.methods[_c0](this,_c1);
}
_c0=_c0||{};
return this.each(function(){
var _c2;
var _c3=$.data(this,"pagination");
if(_c3){
_c2=$.extend(_c3.options,_c0);
}else{
_c2=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),_c0);
$.data(this,"pagination",{options:_c2});
}
_a1(this);
_b2(this);
});
};
$.fn.pagination.methods={options:function(jq){
return $.data(jq[0],"pagination").options;
},loading:function(jq){
return jq.each(function(){
_bb(this,true);
});
},loaded:function(jq){
return jq.each(function(){
_bb(this,false);
});
},refresh:function(jq,_c4){
return jq.each(function(){
_b2(this,_c4);
});
},select:function(jq,_c5){
return jq.each(function(){
_ae(this,_c5);
});
}};
$.fn.pagination.parseOptions=function(_c6){
var t=$(_c6);
return $.extend({},$.parser.parseOptions(_c6,[{total:"number",pageSize:"number",pageNumber:"number",links:"number"},{loading:"boolean",showPageList:"boolean",showRefresh:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)});
};
//Modify by gongjg on 2015-10-10
//����showPageInfo
$.fn.pagination.defaults={total:1,pageSize:10,pageNumber:1,pageList:[10,20,30,50],loading:false,buttons:null,showPageList:false,showRefresh:true,showPageInfo:true,links:10,layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh"],onSelectPage:function(_c7,_c8){
},onBeforeRefresh:function(_c9,_ca){
},onRefresh:function(_cb,_cc){
},onChangePageSize:function(_cd){
},beforePageText:"Page",afterPageText:"of {pages}",displayMsg:"Displaying {from} to {to} of {total} items",nav:{first:{iconCls:"pagination-first",handler:function(){
var _ce=$(this).pagination("options");
if(_ce.pageNumber>1){
$(this).pagination("select",1);
}
}},prev:{iconCls:"pagination-prev",handler:function(){
var _cf=$(this).pagination("options");
if(_cf.pageNumber>1){
$(this).pagination("select",_cf.pageNumber-1);
}
}},next:{iconCls:"pagination-next",handler:function(){
var _d0=$(this).pagination("options");
var _d1=Math.ceil(_d0.total/_d0.pageSize);
if(_d0.pageNumber<_d1){
$(this).pagination("select",_d0.pageNumber+1);
}
}},last:{iconCls:"pagination-last",handler:function(){
var _d2=$(this).pagination("options");
var _d3=Math.ceil(_d2.total/_d2.pageSize);
if(_d2.pageNumber<_d3){
$(this).pagination("select",_d3);
}
}},refresh:{iconCls:"pagination-refresh",handler:function(){
var _d4=$(this).pagination("options");
if(_d4.onBeforeRefresh.call(this,_d4.pageNumber,_d4.pageSize)!=false){
$(this).pagination("select",_d4.pageNumber);
_d4.onRefresh.call(this,_d4.pageNumber,_d4.pageSize);
}
}}}};
})(jQuery);
(function($){
function _d5(_d6){
var _d7=$(_d6);
_d7.addClass("tree");
return _d7;
};
function _d8(_d9){
var _da=$.data(_d9,"tree").options;
$(_d9).unbind().bind("mouseover",function(e){
var tt=$(e.target);
var _db=tt.closest("div.tree-node");
if(!_db.length){
return;
}
_db.addClass("tree-node-hover");
if(tt.hasClass("tree-hit")){
if(tt.hasClass("tree-expanded")){
tt.addClass("tree-expanded-hover");
}else{
tt.addClass("tree-collapsed-hover");
}
}
e.stopPropagation();
}).bind("mouseout",function(e){
var tt=$(e.target);
var _dc=tt.closest("div.tree-node");
if(!_dc.length){
return;
}
_dc.removeClass("tree-node-hover");
if(tt.hasClass("tree-hit")){
if(tt.hasClass("tree-expanded")){
tt.removeClass("tree-expanded-hover");
}else{
tt.removeClass("tree-collapsed-hover");
}
}
e.stopPropagation();
}).bind("click",function(e){
var tt=$(e.target);
var _dd=tt.closest("div.tree-node");
if(!_dd.length){
return;
}
if(tt.hasClass("tree-hit")){
_144(_d9,_dd[0]);
return false;
}else{
if(tt.hasClass("tree-checkbox")){
_104(_d9,_dd[0]);
return false;
}else{
_18a(_d9,_dd[0]);
_da.onClick.call(_d9,_e0(_d9,_dd[0]));
}
}
e.stopPropagation();
}).bind("dblclick",function(e){
var _de=$(e.target).closest("div.tree-node");
if(!_de.length){
return;
}
_18a(_d9,_de[0]);
_da.onDblClick.call(_d9,_e0(_d9,_de[0]));
e.stopPropagation();
}).bind("contextmenu",function(e){
var _df=$(e.target).closest("div.tree-node");
if(!_df.length){
return;
}
_da.onContextMenu.call(_d9,e,_e0(_d9,_df[0]));
e.stopPropagation();
});
};
function _e1(_e2){
var _e3=$.data(_e2,"tree").options;
_e3.dnd=false;
var _e4=$(_e2).find("div.tree-node");
_e4.draggable("disable");
_e4.css("cursor","pointer");
};
function _e5(_e6){
var _e7=$.data(_e6,"tree");
var _e8=_e7.options;
var _e9=_e7.tree;
_e7.disabledNodes=[];
_e8.dnd=true;
_e9.find("div.tree-node").draggable({disabled:false,revert:true,cursor:"pointer",proxy:function(_ea){
var p=$("<div class=\"tree-node-proxy\"></div>").appendTo("body");
p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"+$(_ea).find(".tree-title").html());
p.hide();
return p;
},deltaX:15,deltaY:15,onBeforeDrag:function(e){
if(_e8.onBeforeDrag.call(_e6,_e0(_e6,this))==false){
return false;
}
if($(e.target).hasClass("tree-hit")||$(e.target).hasClass("tree-checkbox")){
return false;
}
if(e.which!=1){
return false;
}
var _eb=$(this).find("span.tree-indent");
if(_eb.length){
e.data.offsetWidth-=_eb.length*_eb.width();
}
},onStartDrag:function(e){
$(this).next("ul").find("div.tree-node").each(function(){
$(this).droppable("disable");
_e7.disabledNodes.push(this);
});
$(this).draggable("proxy").css({left:-10000,top:-10000});
_e8.onStartDrag.call(_e6,_e0(_e6,this));
var _ec=_e0(_e6,this);
if(_ec.id==undefined){
_ec.id="easyui_tree_node_id_temp";
_127(_e6,_ec);
}
_e7.draggingNodeId=_ec.id;
},onDrag:function(e){
var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
if(d>3){
$(this).draggable("proxy").show();
}
this.pageY=e.pageY;
},onStopDrag:function(){
for(var i=0;i<_e7.disabledNodes.length;i++){
$(_e7.disabledNodes[i]).droppable("enable");
}
_e7.disabledNodes=[];
var _ed=_182(_e6,_e7.draggingNodeId);
if(_ed&&_ed.id=="easyui_tree_node_id_temp"){
_ed.id="";
_127(_e6,_ed);
}
_e8.onStopDrag.call(_e6,_ed);
}}).droppable({accept:"div.tree-node",onDragEnter:function(e,_ee){
if(_e8.onDragEnter.call(_e6,this,_ef(_ee))==false){
_f0(_ee,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_e7.disabledNodes.push(this);
}
},onDragOver:function(e,_f1){
if($(this).droppable("options").disabled){
return;
}
var _f2=_f1.pageY;
var top=$(this).offset().top;
var _f3=top+$(this).outerHeight();
_f0(_f1,true);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
if(_f2>top+(_f3-top)/2){
if(_f3-_f2<5){
$(this).addClass("tree-node-bottom");
}else{
$(this).addClass("tree-node-append");
}
}else{
if(_f2-top<5){
$(this).addClass("tree-node-top");
}else{
$(this).addClass("tree-node-append");
}
}
if(_e8.onDragOver.call(_e6,this,_ef(_f1))==false){
_f0(_f1,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_e7.disabledNodes.push(this);
}
},onDragLeave:function(e,_f4){
_f0(_f4,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
_e8.onDragLeave.call(_e6,this,_ef(_f4));
},onDrop:function(e,_f5){
var _f6=this;
var _f7,_f8;
if($(this).hasClass("tree-node-append")){
_f7=_f9;
_f8="append";
}else{
_f7=_fa;
_f8=$(this).hasClass("tree-node-top")?"top":"bottom";
}
if(_e8.onBeforeDrop.call(_e6,_f6,_ef(_f5),_f8)==false){
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
return;
}
_f7(_f5,_f6,_f8);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
}});
function _ef(_fb,pop){
return $(_fb).closest("ul.tree").tree(pop?"pop":"getData",_fb);
};
function _f0(_fc,_fd){
var _fe=$(_fc).draggable("proxy").find("span.tree-dnd-icon");
_fe.removeClass("tree-dnd-yes tree-dnd-no").addClass(_fd?"tree-dnd-yes":"tree-dnd-no");
};
function _f9(_ff,dest){
if(_e0(_e6,dest).state=="closed"){
_13c(_e6,dest,function(){
_100();
});
}else{
_100();
}
function _100(){
var node=_ef(_ff,true);
$(_e6).tree("append",{parent:dest,data:[node]});
_e8.onDrop.call(_e6,dest,node,"append");
};
};
function _fa(_101,dest,_102){
var _103={};
if(_102=="top"){
_103.before=dest;
}else{
_103.after=dest;
}
var node=_ef(_101,true);
_103.data=node;
$(_e6).tree("insert",_103);
_e8.onDrop.call(_e6,dest,node,_102);
};
};
function _104(_105,_106,_107){
var _108=$.data(_105,"tree");
var opts=_108.options;
if(!opts.checkbox){
return;
}
var _109=_e0(_105,_106);
if(_107==undefined){
var ck=$(_106).find(".tree-checkbox");
if(ck.hasClass("tree-checkbox1")){
_107=false;
}else{
if(ck.hasClass("tree-checkbox0")){
_107=true;
}else{
if(_109._checked==undefined){
_109._checked=$(_106).find(".tree-checkbox").hasClass("tree-checkbox1");
}
_107=!_109._checked;
}
}
}
_109._checked=_107;
if(opts.onBeforeCheck.call(_105,_109,_107)==false){
return;
}
if(opts.cascadeCheck){
_10a(_109,_107);
_10b(_109,_107);
}else{
_10c($(_109.target),_107?"1":"0");
}
opts.onCheck.call(_105,_109,_107);
function _10c(node,flag){
var ck=node.find(".tree-checkbox");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
ck.addClass("tree-checkbox"+flag);
};
function _10a(_10d,_10e){
if(opts.deepCheck){
var node=$("#"+_10d.domId);
var flag=_10e?"1":"0";
_10c(node,flag);
_10c(node.next(),flag);
}else{
_10f(_10d,_10e);
_12a(_10d.children||[],function(n){
_10f(n,_10e);
});
}
};
function _10f(_110,_111){
if(_110.hidden){
return;
}
var cls="tree-checkbox"+(_111?"1":"0");
var node=$("#"+_110.domId);
_10c(node,_111?"1":"0");
if(_110.children){
for(var i=0;i<_110.children.length;i++){
if(_110.children[i].hidden){
if(!$("#"+_110.children[i].domId).find("."+cls).length){
_10c(node,"2");
var _112=_14f(_105,node[0]);
while(_112){
_10c($(_112.target),"2");
_112=_14f(_105,_112[0]);
}
return;
}
}
}
}
};
function _10b(_113,_114){
var node=$("#"+_113.domId);
var _115=_14f(_105,node[0]);
if(_115){
var flag="";
if(_116(node,true)){
flag="1";
}else{
if(_116(node,false)){
flag="0";
}else{
flag="2";
}
}
_10c($(_115.target),flag);
_10b(_115,_114);
}
};
function _116(node,_117){
var cls="tree-checkbox"+(_117?"1":"0");
var ck=node.find(".tree-checkbox");
if(!ck.hasClass(cls)){
return false;
}
var b=true;
node.parent().siblings().each(function(){
var ck=$(this).children("div.tree-node").children(".tree-checkbox");
if(ck.length&&!ck.hasClass(cls)){
b=false;
return false;
}
});
return b;
};
};
function _118(_119,_11a){
var opts=$.data(_119,"tree").options;
if(!opts.checkbox){
return;
}
var node=$(_11a);
if(_11b(_119,_11a)){
var ck=node.find(".tree-checkbox");
if(ck.length){
if(ck.hasClass("tree-checkbox1")){
_104(_119,_11a,true);
}else{
_104(_119,_11a,false);
}
}else{
if(opts.onlyLeafCheck){
$("<span class=\"tree-checkbox tree-checkbox0\"></span>").insertBefore(node.find(".tree-title"));
}
}
}else{
var ck=node.find(".tree-checkbox");
if(opts.onlyLeafCheck){
ck.remove();
}else{
if(ck.hasClass("tree-checkbox1")){
_104(_119,_11a,true);
}else{
if(ck.hasClass("tree-checkbox2")){
var _11c=true;
var _11d=true;
var _11e=_11f(_119,_11a);
for(var i=0;i<_11e.length;i++){
if(_11e[i].checked){
_11d=false;
}else{
_11c=false;
}
}
if(_11c){
_104(_119,_11a,true);
}
if(_11d){
_104(_119,_11a,false);
}
}
}
}
}
};
function _120(_121,ul,data,_122){
var _123=$.data(_121,"tree");
var opts=_123.options;
var _124=$(ul).prevAll("div.tree-node:first");
data=opts.loadFilter.call(_121,data,_124[0]);
var _125=_126(_121,"domId",_124.attr("id"));
if(!_122){
_125?_125.children=data:_123.data=data;
$(ul).empty();
}else{
if(_125){
_125.children?_125.children=_125.children.concat(data):_125.children=data;
}else{
_123.data=_123.data.concat(data);
}
}
opts.view.render.call(opts.view,_121,ul,data);
if(opts.dnd){
_e5(_121);
}
if(_125){
_127(_121,_125);
}
var _128=[];
var _129=[];
for(var i=0;i<data.length;i++){
var node=data[i];
if(!node.checked){
_128.push(node);
}
}
_12a(data,function(node){
if(node.checked){
_129.push(node);
}
});
var _12b=opts.onCheck;
opts.onCheck=function(){
};
if(_128.length){
_104(_121,$("#"+_128[0].domId)[0],false);
}
for(var i=0;i<_129.length;i++){
_104(_121,$("#"+_129[i].domId)[0],true);
}
opts.onCheck=_12b;
setTimeout(function(){
_12c(_121,_121);
},0);
opts.onLoadSuccess.call(_121,_125,data);
};
function _12c(_12d,ul,_12e){
var opts=$.data(_12d,"tree").options;
if(opts.lines){
$(_12d).addClass("tree-lines");
}else{
$(_12d).removeClass("tree-lines");
return;
}
if(!_12e){
_12e=true;
$(_12d).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
$(_12d).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
var _12f=$(_12d).tree("getRoots");
if(_12f.length>1){
$(_12f[0].target).addClass("tree-root-first");
}else{
if(_12f.length==1){
$(_12f[0].target).addClass("tree-root-one");
}
}
}
$(ul).children("li").each(function(){
var node=$(this).children("div.tree-node");
var ul=node.next("ul");
if(ul.length){
if($(this).next().length){
_130(node);
}
_12c(_12d,ul,_12e);
}else{
_131(node);
}
});
var _132=$(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
_132.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
function _131(node,_133){
var icon=node.find("span.tree-icon");
icon.prev("span.tree-indent").addClass("tree-join");
};
function _130(node){
var _134=node.find("span.tree-indent, span.tree-hit").length;
node.next().find("div.tree-node").each(function(){
$(this).children("span:eq("+(_134-1)+")").addClass("tree-line");
});
};
};
function _135(_136,ul,_137,_138){
var opts=$.data(_136,"tree").options;
_137=$.extend({},opts.queryParams,_137||{});
var _139=null;
if(_136!=ul){
var node=$(ul).prev();
_139=_e0(_136,node[0]);
}
if(opts.onBeforeLoad.call(_136,_139,_137)==false){
return;
}
var _13a=$(ul).prev().children("span.tree-folder");
_13a.addClass("tree-loading");
var _13b=opts.loader.call(_136,_137,function(data){
_13a.removeClass("tree-loading");
_120(_136,ul,data);
if(_138){
_138();
}
},function(){
_13a.removeClass("tree-loading");
opts.onLoadError.apply(_136,arguments);
if(_138){
_138();
}
});
if(_13b==false){
_13a.removeClass("tree-loading");
}
};
function _13c(_13d,_13e,_13f){
var opts=$.data(_13d,"tree").options;
var hit=$(_13e).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
var node=_e0(_13d,_13e);
if(opts.onBeforeExpand.call(_13d,node)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var ul=$(_13e).next();
if(ul.length){
if(opts.animate){
ul.slideDown("normal",function(){
node.state="open";
opts.onExpand.call(_13d,node);
if(_13f){
_13f();
}
});
}else{
ul.css("display","block");
node.state="open";
opts.onExpand.call(_13d,node);
if(_13f){
_13f();
}
}
}else{
var _140=$("<ul style=\"display:none\"></ul>").insertAfter(_13e);
_135(_13d,_140[0],{id:node.id},function(){
if(_140.is(":empty")){
_140.remove();
}
if(opts.animate){
_140.slideDown("normal",function(){
node.state="open";
opts.onExpand.call(_13d,node);
if(_13f){
_13f();
}
});
}else{
_140.css("display","block");
node.state="open";
opts.onExpand.call(_13d,node);
if(_13f){
_13f();
}
}
});
}
};
function _141(_142,_143){
var opts=$.data(_142,"tree").options;
var hit=$(_143).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
var node=_e0(_142,_143);
if(opts.onBeforeCollapse.call(_142,node)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
var ul=$(_143).next();
if(opts.animate){
ul.slideUp("normal",function(){
node.state="closed";
opts.onCollapse.call(_142,node);
});
}else{
ul.css("display","none");
node.state="closed";
opts.onCollapse.call(_142,node);
}
};
function _144(_145,_146){
var hit=$(_146).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
_141(_145,_146);
}else{
_13c(_145,_146);
}
};
function _147(_148,_149){
var _14a=_11f(_148,_149);
if(_149){
_14a.unshift(_e0(_148,_149));
}
for(var i=0;i<_14a.length;i++){
_13c(_148,_14a[i].target);
}
};
function _14b(_14c,_14d){
var _14e=[];
var p=_14f(_14c,_14d);
while(p){
_14e.unshift(p);
p=_14f(_14c,p.target);
}
for(var i=0;i<_14e.length;i++){
_13c(_14c,_14e[i].target);
}
};
function _150(_151,_152){
var c=$(_151).parent();
while(c[0].tagName!="BODY"&&c.css("overflow-y")!="auto"){
c=c.parent();
}
var n=$(_152);
var ntop=n.offset().top;
if(c[0].tagName!="BODY"){
var ctop=c.offset().top;
if(ntop<ctop){
c.scrollTop(c.scrollTop()+ntop-ctop);
}else{
if(ntop+n.outerHeight()>ctop+c.outerHeight()-18){
c.scrollTop(c.scrollTop()+ntop+n.outerHeight()-ctop-c.outerHeight()+18);
}
}
}else{
c.scrollTop(ntop);
}
};
function _153(_154,_155){
var _156=_11f(_154,_155);
if(_155){
_156.unshift(_e0(_154,_155));
}
for(var i=0;i<_156.length;i++){
_141(_154,_156[i].target);
}
};
function _157(_158,_159){
var node=$(_159.parent);
var data=_159.data;
if(!data){
return;
}
data=$.isArray(data)?data:[data];
if(!data.length){
return;
}
var ul;
if(node.length==0){
ul=$(_158);
}else{
if(_11b(_158,node[0])){
var _15a=node.find("span.tree-icon");
_15a.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_15a);
if(hit.prev().length){
hit.prev().remove();
}
}
ul=node.next();
if(!ul.length){
ul=$("<ul></ul>").insertAfter(node);
}
}
_120(_158,ul[0],data,true);
_118(_158,ul.prev());
};
function _15b(_15c,_15d){
var ref=_15d.before||_15d.after;
var _15e=_14f(_15c,ref);
var data=_15d.data;
if(!data){
return;
}
data=$.isArray(data)?data:[data];
if(!data.length){
return;
}
_157(_15c,{parent:(_15e?_15e.target:null),data:data});
var _15f=_15e?_15e.children:$(_15c).tree("getRoots");
for(var i=0;i<_15f.length;i++){
if(_15f[i].domId==$(ref).attr("id")){
for(var j=data.length-1;j>=0;j--){
_15f.splice((_15d.before?i:(i+1)),0,data[j]);
}
_15f.splice(_15f.length-data.length,data.length);
break;
}
}
var li=$();
for(var i=0;i<data.length;i++){
li=li.add($("#"+data[i].domId).parent());
}
if(_15d.before){
li.insertBefore($(ref).parent());
}else{
li.insertAfter($(ref).parent());
}
};
function _160(_161,_162){
var _163=del(_162);
$(_162).parent().remove();
if(_163){
if(!_163.children||!_163.children.length){
var node=$(_163.target);
node.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
node.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(node);
node.next().remove();
}
_127(_161,_163);
_118(_161,_163.target);
}
_12c(_161,_161);
function del(_164){
var id=$(_164).attr("id");
var _165=_14f(_161,_164);
var cc=_165?_165.children:$.data(_161,"tree").data;
for(var i=0;i<cc.length;i++){
if(cc[i].domId==id){
cc.splice(i,1);
break;
}
}
return _165;
};
};
function _127(_166,_167){
var opts=$.data(_166,"tree").options;
var node=$(_167.target);
var data=_e0(_166,_167.target);
var _168=data.checked;
if(data.iconCls){
node.find(".tree-icon").removeClass(data.iconCls);
}
$.extend(data,_167);
node.find(".tree-title").html(opts.formatter.call(_166,data));
if(data.iconCls){
node.find(".tree-icon").addClass(data.iconCls);
}
if(_168!=data.checked){
_104(_166,_167.target,data.checked);
}
};
function _169(_16a,_16b){
if(_16b){
var p=_14f(_16a,_16b);
while(p){
_16b=p.target;
p=_14f(_16a,_16b);
}
return _e0(_16a,_16b);
}else{
var _16c=_16d(_16a);
return _16c.length?_16c[0]:null;
}
};
function _16d(_16e){
var _16f=$.data(_16e,"tree").data;
for(var i=0;i<_16f.length;i++){
_170(_16f[i]);
}
return _16f;
};
function _11f(_171,_172){
var _173=[];
var n=_e0(_171,_172);
var data=n?(n.children||[]):$.data(_171,"tree").data;
_12a(data,function(node){
_173.push(_170(node));
});
return _173;
};
function _14f(_174,_175){
var p=$(_175).closest("ul").prevAll("div.tree-node:first");
return _e0(_174,p[0]);
};
function _176(_177,_178){
_178=_178||"checked";
if(!$.isArray(_178)){
_178=[_178];
}
var _179=[];
for(var i=0;i<_178.length;i++){
var s=_178[i];
if(s=="checked"){
_179.push("span.tree-checkbox1");
}else{
if(s=="unchecked"){
_179.push("span.tree-checkbox0");
}else{
if(s=="indeterminate"){
_179.push("span.tree-checkbox2");
}
}
}
}
var _17a=[];
$(_177).find(_179.join(",")).each(function(){
var node=$(this).parent();
_17a.push(_e0(_177,node[0]));
});
return _17a;
};
function _17b(_17c){
var node=$(_17c).find("div.tree-node-selected");
return node.length?_e0(_17c,node[0]):null;
};
function _17d(_17e,_17f){
var data=_e0(_17e,_17f);
if(data&&data.children){
_12a(data.children,function(node){
_170(node);
});
}
return data;
};
function _e0(_180,_181){
return _126(_180,"domId",$(_181).attr("id"));
};
function _182(_183,id){
return _126(_183,"id",id);
};
function _126(_184,_185,_186){
var data=$.data(_184,"tree").data;
var _187=null;
_12a(data,function(node){
if(node[_185]==_186){
_187=_170(node);
return false;
}
});
return _187;
};
function _170(node){
var d=$("#"+node.domId);
node.target=d[0];
node.checked=d.find(".tree-checkbox").hasClass("tree-checkbox1");
return node;
};
function _12a(data,_188){
var _189=[];
for(var i=0;i<data.length;i++){
_189.push(data[i]);
}
while(_189.length){
var node=_189.shift();
if(_188(node)==false){
return;
}
if(node.children){
for(var i=node.children.length-1;i>=0;i--){
_189.unshift(node.children[i]);
}
}
}
};
function _18a(_18b,_18c){
var opts=$.data(_18b,"tree").options;
var node=_e0(_18b,_18c);
if(opts.onBeforeSelect.call(_18b,node)==false){
return;
}
$(_18b).find("div.tree-node-selected").removeClass("tree-node-selected");
$(_18c).addClass("tree-node-selected");
opts.onSelect.call(_18b,node);
};
function _11b(_18d,_18e){
return $(_18e).children("span.tree-hit").length==0;
};
function _18f(_190,_191){
var opts=$.data(_190,"tree").options;
var node=_e0(_190,_191);
if(opts.onBeforeEdit.call(_190,node)==false){
return;
}
$(_191).css("position","relative");
var nt=$(_191).find(".tree-title");
var _192=nt.outerWidth();
nt.empty();
var _193=$("<input class=\"tree-editor\">").appendTo(nt);
_193.val(node.text).focus();
_193.width(_192+20);
_193.height(document.compatMode=="CSS1Compat"?(18-(_193.outerHeight()-_193.height())):18);
_193.bind("click",function(e){
return false;
}).bind("mousedown",function(e){
e.stopPropagation();
}).bind("mousemove",function(e){
e.stopPropagation();
}).bind("keydown",function(e){
if(e.keyCode==13){
_194(_190,_191);
return false;
}else{
if(e.keyCode==27){
_198(_190,_191);
return false;
}
}
}).bind("blur",function(e){
e.stopPropagation();
_194(_190,_191);
});
};
function _194(_195,_196){
var opts=$.data(_195,"tree").options;
$(_196).css("position","");
var _197=$(_196).find("input.tree-editor");
var val=_197.val();
_197.remove();
var node=_e0(_195,_196);
node.text=val;
_127(_195,node);
opts.onAfterEdit.call(_195,node);
};
function _198(_199,_19a){
var opts=$.data(_199,"tree").options;
$(_19a).css("position","");
$(_19a).find("input.tree-editor").remove();
var node=_e0(_199,_19a);
_127(_199,node);
opts.onCancelEdit.call(_199,node);
};
function _19b(_19c,q){
var _19d=$.data(_19c,"tree");
var opts=_19d.options;
var ids={};
_12a(_19d.data,function(node){
if(opts.filter.call(_19c,q,node)){
$("#"+node.domId).removeClass("tree-node-hidden");
ids[node.domId]=1;
node.hidden=false;
}else{
$("#"+node.domId).addClass("tree-node-hidden");
node.hidden=true;
}
});
for(var id in ids){
_19e(id);
}
function _19e(_19f){
var p=$(_19c).tree("getParent",$("#"+_19f)[0]);
while(p){
$(p.target).removeClass("tree-node-hidden");
p.hidden=false;
p=$(_19c).tree("getParent",p.target);
}
};
};
$.fn.tree=function(_1a0,_1a1){
if(typeof _1a0=="string"){
return $.fn.tree.methods[_1a0](this,_1a1);
}
var _1a0=_1a0||{};
return this.each(function(){
var _1a2=$.data(this,"tree");
var opts;
if(_1a2){
opts=$.extend(_1a2.options,_1a0);
_1a2.options=opts;
}else{
opts=$.extend({},$.fn.tree.defaults,$.fn.tree.parseOptions(this),_1a0);
$.data(this,"tree",{options:opts,tree:_d5(this),data:[]});
var data=$.fn.tree.parseData(this);
if(data.length){
_120(this,this,data);
}
}
_d8(this);
if(opts.data){
_120(this,this,$.extend(true,[],opts.data));
}
_135(this,this);
});
};
$.fn.tree.methods={options:function(jq){
return $.data(jq[0],"tree").options;
},loadData:function(jq,data){
return jq.each(function(){
_120(this,this,data);
});
},getNode:function(jq,_1a3){
return _e0(jq[0],_1a3);
},getData:function(jq,_1a4){
return _17d(jq[0],_1a4);
},reload:function(jq,_1a5){
return jq.each(function(){
if(_1a5){
var node=$(_1a5);
var hit=node.children("span.tree-hit");
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
node.next().remove();
_13c(this,_1a5);
}else{
$(this).empty();
_135(this,this);
}
});
},getRoot:function(jq,_1a6){
return _169(jq[0],_1a6);
},getRoots:function(jq){
return _16d(jq[0]);
},getParent:function(jq,_1a7){
return _14f(jq[0],_1a7);
},getChildren:function(jq,_1a8){
return _11f(jq[0],_1a8);
},getChecked:function(jq,_1a9){
return _176(jq[0],_1a9);
},getSelected:function(jq){
return _17b(jq[0]);
},isLeaf:function(jq,_1aa){
return _11b(jq[0],_1aa);
},find:function(jq,id){
return _182(jq[0],id);
},select:function(jq,_1ab){
return jq.each(function(){
_18a(this,_1ab);
});
},check:function(jq,_1ac){
return jq.each(function(){
_104(this,_1ac,true);
});
},uncheck:function(jq,_1ad){
return jq.each(function(){
_104(this,_1ad,false);
});
},collapse:function(jq,_1ae){
return jq.each(function(){
_141(this,_1ae);
});
},expand:function(jq,_1af){
return jq.each(function(){
_13c(this,_1af);
});
},collapseAll:function(jq,_1b0){
return jq.each(function(){
_153(this,_1b0);
});
},expandAll:function(jq,_1b1){
return jq.each(function(){
_147(this,_1b1);
});
},expandTo:function(jq,_1b2){
return jq.each(function(){
_14b(this,_1b2);
});
},scrollTo:function(jq,_1b3){
return jq.each(function(){
_150(this,_1b3);
});
},toggle:function(jq,_1b4){
return jq.each(function(){
_144(this,_1b4);
});
},append:function(jq,_1b5){
return jq.each(function(){
_157(this,_1b5);
});
},insert:function(jq,_1b6){
return jq.each(function(){
_15b(this,_1b6);
});
},remove:function(jq,_1b7){
return jq.each(function(){
_160(this,_1b7);
});
},pop:function(jq,_1b8){
var node=jq.tree("getData",_1b8);
jq.tree("remove",_1b8);
return node;
},update:function(jq,_1b9){
return jq.each(function(){
_127(this,_1b9);
});
},enableDnd:function(jq){
return jq.each(function(){
_e5(this);
});
},disableDnd:function(jq){
return jq.each(function(){
_e1(this);
});
},beginEdit:function(jq,_1ba){
return jq.each(function(){
_18f(this,_1ba);
});
},endEdit:function(jq,_1bb){
return jq.each(function(){
_194(this,_1bb);
});
},cancelEdit:function(jq,_1bc){
return jq.each(function(){
_198(this,_1bc);
});
},doFilter:function(jq,q){
return jq.each(function(){
_19b(this,q);
});
}};
$.fn.tree.parseOptions=function(_1bd){
var t=$(_1bd);
return $.extend({},$.parser.parseOptions(_1bd,["url","method",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean",lines:"boolean",dnd:"boolean"}]));
};
$.fn.tree.parseData=function(_1be){
var data=[];
_1bf(data,$(_1be));
return data;
function _1bf(aa,tree){
tree.children("li").each(function(){
var node=$(this);
var item=$.extend({},$.parser.parseOptions(this,["id","iconCls","state"]),{checked:(node.attr("checked")?true:undefined)});
item.text=node.children("span").html();
if(!item.text){
item.text=node.html();
}
var _1c0=node.children("ul");
if(_1c0.length){
item.children=[];
_1bf(item.children,_1c0);
}
aa.push(item);
});
};
};
var _1c1=1;
var _1c2={render:function(_1c3,ul,data){
var opts=$.data(_1c3,"tree").options;
var _1c4=$(ul).prev("div.tree-node").find("span.tree-indent, span.tree-hit").length;
var cc=_1c5(_1c4,data);
$(ul).append(cc.join(""));
function _1c5(_1c6,_1c7){
var cc=[];
for(var i=0;i<_1c7.length;i++){
var item=_1c7[i];
if(item.state!="open"&&item.state!="closed"){
item.state="open";
}
item.domId="_easyui_tree_"+_1c1++;
cc.push("<li>");
cc.push("<div id=\""+item.domId+"\" class=\"tree-node\">");
for(var j=0;j<_1c6;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
var _1c8=false;
if(item.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(item.iconCls?item.iconCls:"")+"\"></span>");
}else{
if(item.children&&item.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(item.iconCls?item.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(item.iconCls?item.iconCls:"")+"\"></span>");
_1c8=true;
}
}
if(opts.checkbox){
if((!opts.onlyLeafCheck)||_1c8){
cc.push("<span class=\"tree-checkbox tree-checkbox0\"></span>");
}
}
cc.push("<span class=\"tree-title\">"+opts.formatter.call(_1c3,item)+"</span>");
cc.push("</div>");
if(item.children&&item.children.length){
var tmp=_1c5(_1c6+1,item.children);
cc.push("<ul style=\"display:"+(item.state=="closed"?"none":"block")+"\">");
cc=cc.concat(tmp);
cc.push("</ul>");
}
cc.push("</li>");
}
return cc;
};
}};
$.fn.tree.defaults={url:null,method:"post",animate:false,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,dnd:false,data:null,queryParams:{},formatter:function(node){
return node.text;
},filter:function(q,node){
return node.text.toLowerCase().indexOf(q.toLowerCase())>=0;
},loader:function(_1c9,_1ca,_1cb){
var opts=$(this).tree("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_1c9,dataType:"json",success:function(data){
_1ca(data);
},error:function(){
_1cb.apply(this,arguments);
}});
},loadFilter:function(data,_1cc){
return data;
},view:_1c2,onBeforeLoad:function(node,_1cd){
},onLoadSuccess:function(node,data){
},onLoadError:function(){
},onClick:function(node){
},onDblClick:function(node){
},onBeforeExpand:function(node){
},onExpand:function(node){
},onBeforeCollapse:function(node){
},onCollapse:function(node){
},onBeforeCheck:function(node,_1ce){
},onCheck:function(node,_1cf){
},onBeforeSelect:function(node){
},onSelect:function(node){
},onContextMenu:function(e,node){
},onBeforeDrag:function(node){
},onStartDrag:function(node){
},onStopDrag:function(node){
},onDragEnter:function(_1d0,_1d1){
},onDragOver:function(_1d2,_1d3){
},onDragLeave:function(_1d4,_1d5){
},onBeforeDrop:function(_1d6,_1d7,_1d8){
},onDrop:function(_1d9,_1da,_1db){
},onBeforeEdit:function(node){
},onAfterEdit:function(node){
},onCancelEdit:function(node){
}};
})(jQuery);
(function($){
function init(_1dc){
$(_1dc).addClass("progressbar");
$(_1dc).html("<div class=\"progressbar-text\"></div><div class=\"progressbar-value\"><div class=\"progressbar-text\"></div></div>");
$(_1dc).bind("_resize",function(e,_1dd){
if($(this).hasClass("ui-fluid")||_1dd){
_1de(_1dc);
}
return false;
});
return $(_1dc);
};
function _1de(_1df,_1e0){
var opts=$.data(_1df,"progressbar").options;
var bar=$.data(_1df,"progressbar").bar;
if(_1e0){
opts.width=_1e0;
}
bar._size(opts);
bar.find("div.progressbar-text").css("width",bar.width());
bar.find("div.progressbar-text,div.progressbar-value").css({height:bar.height()+"px",lineHeight:bar.height()+"px"});
};
$.fn.progressbar=function(_1e1,_1e2){
if(typeof _1e1=="string"){
var _1e3=$.fn.progressbar.methods[_1e1];
if(_1e3){
return _1e3(this,_1e2);
}
}
_1e1=_1e1||{};
return this.each(function(){
var _1e4=$.data(this,"progressbar");
if(_1e4){
$.extend(_1e4.options,_1e1);
}else{
_1e4=$.data(this,"progressbar",{options:$.extend({},$.fn.progressbar.defaults,$.fn.progressbar.parseOptions(this),_1e1),bar:init(this)});
}
$(this).progressbar("setValue",_1e4.options.value);
_1de(this);
});
};
$.fn.progressbar.methods={options:function(jq){
return $.data(jq[0],"progressbar").options;
},resize:function(jq,_1e5){
return jq.each(function(){
_1de(this,_1e5);
});
},getValue:function(jq){
return $.data(jq[0],"progressbar").options.value;
},setValue:function(jq,_1e6){
if(_1e6<0){
_1e6=0;
}
if(_1e6>100){
_1e6=100;
}
return jq.each(function(){
var opts=$.data(this,"progressbar").options;
var text=opts.text.replace(/{value}/,_1e6);
var _1e7=opts.value;
opts.value=_1e6;
$(this).find("div.progressbar-value").width(_1e6+"%");
$(this).find("div.progressbar-text").html(text);
if(_1e7!=_1e6){
opts.onChange.call(this,_1e6,_1e7);
}
});
}};
$.fn.progressbar.parseOptions=function(_1e8){
return $.extend({},$.parser.parseOptions(_1e8,["width","height","text",{value:"number"}]));
};
$.fn.progressbar.defaults={width:"auto",height:22,value:0,text:"{value}%",onChange:function(_1e9,_1ea){
}};
})(jQuery);
(function($){
function init(_1eb){
$(_1eb).addClass("tooltip-f");
};
function _1ec(_1ed){
var opts=$.data(_1ed,"tooltip").options;
$(_1ed).unbind(".tooltip").bind(opts.showEvent+".tooltip",function(e){
$(_1ed).tooltip("show",e);
}).bind(opts.hideEvent+".tooltip",function(e){
$(_1ed).tooltip("hide",e);
}).bind("mousemove.tooltip",function(e){
if(opts.trackMouse){
opts.trackMouseX=e.pageX;
opts.trackMouseY=e.pageY;
$(_1ed).tooltip("reposition");
}
});
};
function _1ee(_1ef){
var _1f0=$.data(_1ef,"tooltip");
if(_1f0.showTimer){
clearTimeout(_1f0.showTimer);
_1f0.showTimer=null;
}
if(_1f0.hideTimer){
clearTimeout(_1f0.hideTimer);
_1f0.hideTimer=null;
}
};
function _1f1(_1f2){
var _1f3=$.data(_1f2,"tooltip");
if(!_1f3||!_1f3.tip){
return;
}
var opts=_1f3.options;
var tip=_1f3.tip;
var pos={left:-100000,top:-100000};
if($(_1f2).is(":visible")){
pos=_1f4(opts.position);
if(opts.position=="top"&&pos.top<0){
pos=_1f4("bottom");
}else{
if((opts.position=="bottom")&&(pos.top+tip._outerHeight()>$(window)._outerHeight()+$(document).scrollTop())){
pos=_1f4("top");
}
}
if(pos.left<0){
if(opts.position=="left"){
pos=_1f4("right");
}else{
$(_1f2).tooltip("arrow").css("left",tip._outerWidth()/2+pos.left);
pos.left=0;
}
}else{
if(pos.left+tip._outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
if(opts.position=="right"){
pos=_1f4("left");
}else{
var left=pos.left;
pos.left=$(window)._outerWidth()+$(document)._scrollLeft()-tip._outerWidth();
$(_1f2).tooltip("arrow").css("left",tip._outerWidth()/2-(pos.left-left));
}
}
}
}
tip.css({left:pos.left,top:pos.top,zIndex:(opts.zIndex!=undefined?opts.zIndex:($.fn.window?$.fn.window.defaults.zIndex++:""))});
opts.onPosition.call(_1f2,pos.left,pos.top);
function _1f4(_1f5){
opts.position=_1f5||"bottom";
tip.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-"+opts.position);
var left,top;
if(opts.trackMouse){
t=$();
left=opts.trackMouseX+opts.deltaX;
top=opts.trackMouseY+opts.deltaY;
}else{
var t=$(_1f2);
left=t.offset().left+opts.deltaX;
top=t.offset().top+opts.deltaY;
}
switch(opts.position){
case "right":
left+=t._outerWidth()+12+(opts.trackMouse?12:0);
top-=(tip._outerHeight()-t._outerHeight())/2;
break;
case "left":
left-=tip._outerWidth()+12+(opts.trackMouse?12:0);
top-=(tip._outerHeight()-t._outerHeight())/2;
break;
case "top":
left-=(tip._outerWidth()-t._outerWidth())/2;
top-=tip._outerHeight()+12+(opts.trackMouse?12:0);
break;
case "bottom":
left-=(tip._outerWidth()-t._outerWidth())/2;
top+=t._outerHeight()+12+(opts.trackMouse?12:0);
break;
}
return {left:left,top:top};
};
};
function _1f6(_1f7,e){
var _1f8=$.data(_1f7,"tooltip");
var opts=_1f8.options;
var tip=_1f8.tip;
if(!tip){
tip=$("<div tabindex=\"-1\" class=\"tooltip\">"+"<div class=\"tooltip-content\"></div>"+"<div class=\"tooltip-arrow-outer\"></div>"+"<div class=\"tooltip-arrow\"></div>"+"</div>").appendTo("body");
_1f8.tip=tip;
_1f9(_1f7);
}
_1ee(_1f7);
_1f8.showTimer=setTimeout(function(){
$(_1f7).tooltip("reposition");
tip.show();
opts.onShow.call(_1f7,e);
var _1fa=tip.children(".tooltip-arrow-outer");
var _1fb=tip.children(".tooltip-arrow");
var bc="border-"+opts.position+"-color";
_1fa.add(_1fb).css({borderTopColor:"",borderBottomColor:"",borderLeftColor:"",borderRightColor:""});
_1fa.css(bc,tip.css(bc));
_1fb.css(bc,tip.css("backgroundColor"));
},opts.showDelay);
};
function _1fc(_1fd,e){
var _1fe=$.data(_1fd,"tooltip");
if(_1fe&&_1fe.tip){
_1ee(_1fd);
_1fe.hideTimer=setTimeout(function(){
_1fe.tip.hide();
_1fe.options.onHide.call(_1fd,e);
},_1fe.options.hideDelay);
}
};
function _1f9(_1ff,_200){
var _201=$.data(_1ff,"tooltip");
var opts=_201.options;
if(_200){
opts.content=_200;
}
if(!_201.tip){
return;
}
var cc=typeof opts.content=="function"?opts.content.call(_1ff):opts.content;
_201.tip.children(".tooltip-content").html(cc);
opts.onUpdate.call(_1ff,cc);
};
function _202(_203){
var _204=$.data(_203,"tooltip");
if(_204){
_1ee(_203);
var opts=_204.options;
if(_204.tip){
_204.tip.remove();
}
if(opts._title){
$(_203).attr("title",opts._title);
}
$.removeData(_203,"tooltip");
$(_203).unbind(".tooltip").removeClass("tooltip-f");
opts.onDestroy.call(_203);
}
};
$.fn.tooltip=function(_205,_206){
if(typeof _205=="string"){
return $.fn.tooltip.methods[_205](this,_206);
}
_205=_205||{};
return this.each(function(){
var _207=$.data(this,"tooltip");
if(_207){
$.extend(_207.options,_205);
}else{
$.data(this,"tooltip",{options:$.extend({},$.fn.tooltip.defaults,$.fn.tooltip.parseOptions(this),_205)});
init(this);
}
_1ec(this);
_1f9(this);
});
};
$.fn.tooltip.methods={options:function(jq){
return $.data(jq[0],"tooltip").options;
},tip:function(jq){
return $.data(jq[0],"tooltip").tip;
},arrow:function(jq){
return jq.tooltip("tip").children(".tooltip-arrow-outer,.tooltip-arrow");
},show:function(jq,e){
return jq.each(function(){
_1f6(this,e);
});
},hide:function(jq,e){
return jq.each(function(){
_1fc(this,e);
});
},update:function(jq,_208){
return jq.each(function(){
_1f9(this,_208);
});
},reposition:function(jq){
return jq.each(function(){
_1f1(this);
});
},destroy:function(jq){
return jq.each(function(){
_202(this);
});
}};
$.fn.tooltip.parseOptions=function(_209){
var t=$(_209);
var opts=$.extend({},$.parser.parseOptions(_209,["position","showEvent","hideEvent","content",{trackMouse:"boolean",deltaX:"number",deltaY:"number",showDelay:"number",hideDelay:"number"}]),{_title:t.attr("title")});
t.attr("title","");
if(!opts.content){
opts.content=opts._title;
}
return opts;
};
$.fn.tooltip.defaults={position:"bottom",content:null,trackMouse:false,deltaX:0,deltaY:0,showEvent:"mouseenter",hideEvent:"mouseleave",showDelay:200,hideDelay:100,onShow:function(e){
},onHide:function(e){
},onUpdate:function(_20a){
},onPosition:function(left,top){
},onDestroy:function(){
}};
})(jQuery);
(function($){
$.fn._remove=function(){
return this.each(function(){
$(this).remove();
try{
this.outerHTML="";
}
catch(err){
}
});
};
function _20b(node){
node._remove();
};
function _20c(_20d,_20e){
var _20f=$.data(_20d,"panel");
var opts=_20f.options;
var _210=_20f.panel;
var _211=_210.children(".panel-header");
var _212=_210.children(".panel-body");
var _213=_210.children(".panel-footer");
if(_20e){
$.extend(opts,{width:_20e.width,height:_20e.height,minWidth:_20e.minWidth,maxWidth:_20e.maxWidth,minHeight:_20e.minHeight,maxHeight:_20e.maxHeight,left:_20e.left,top:_20e.top});
}
_210._size(opts);
_211.add(_212)._outerWidth(_210.width());
if(!isNaN(parseInt(opts.height))){
_212._outerHeight(_210.height()-_211._outerHeight()-_213._outerHeight());
}else{
_212.css("height","");
var min=$.parser.parseValue("minHeight",opts.minHeight,_210.parent());
var max=$.parser.parseValue("maxHeight",opts.maxHeight,_210.parent());
var _214=_211._outerHeight()+_213._outerHeight()+_210._outerHeight()-_210.height();
_212._size("minHeight",min?(min-_214):"");
_212._size("maxHeight",max?(max-_214):"");
}
_210.css({height:"",minHeight:"",maxHeight:"",left:opts.left,top:opts.top});
opts.onResize.apply(_20d,[opts.width,opts.height]);
$(_20d).panel("doLayout");
};
function _215(_216,_217){
var opts=$.data(_216,"panel").options;
var _218=$.data(_216,"panel").panel;
if(_217){
if(_217.left!=null){
opts.left=_217.left;
}
if(_217.top!=null){
opts.top=_217.top;
}
}
_218.css({left:opts.left,top:opts.top});
opts.onMove.apply(_216,[opts.left,opts.top]);
};
function _219(_21a){
$(_21a).addClass("panel-body")._size("clear");
var _21b=$("<div class=\"panel\"></div>").insertBefore(_21a);
_21b[0].appendChild(_21a);
_21b.bind("_resize",function(e,_21c){
if($(this).hasClass("ui-fluid")||_21c){
_20c(_21a);
}
return false;
});
return _21b;
};
function _21d(_21e){
var _21f=$.data(_21e,"panel");
var opts=_21f.options;
var _220=_21f.panel;
_220.css(opts.style);
_220.addClass(opts.cls);
_221();
_222();
var _223=$(_21e).panel("header");
var body=$(_21e).panel("body");
var _224=$(_21e).siblings(".panel-footer");
if(opts.border){
_223.removeClass("panel-header-noborder");
body.removeClass("panel-body-noborder");
_224.removeClass("panel-footer-noborder");
}else{
_223.addClass("panel-header-noborder");
body.addClass("panel-body-noborder");
_224.addClass("panel-footer-noborder");
}
_223.addClass(opts.headerCls);
body.addClass(opts.bodyCls);
$(_21e).attr("id",opts.id||"");
if(opts.content){
$(_21e).panel("clear");
$(_21e).html(opts.content);
$.parser.parse($(_21e));
}
function _221(){
if(opts.noheader||(!opts.title&&!opts.header)){
_20b(_220.children(".panel-header"));
_220.children(".panel-body").addClass("panel-body-noheader");
}else{
if(opts.header){
$(opts.header).addClass("panel-header").prependTo(_220);
}else{
var _225=_220.children(".panel-header");
if(!_225.length){
_225=$("<div class=\"panel-header\"></div>").prependTo(_220);
}
if(!$.isArray(opts.tools)){
_225.find("div.panel-tool .panel-tool-a").appendTo(opts.tools);
}
_225.empty();
var _226=$("<div class=\"panel-title\"></div>").html(opts.title).appendTo(_225);
if(opts.iconCls){
_226.addClass("panel-with-icon");
$("<div class=\"panel-icon\"></div>").addClass(opts.iconCls).appendTo(_225);
}
var tool=$("<div class=\"panel-tool\"></div>").appendTo(_225);
tool.bind("click",function(e){
e.stopPropagation();
});
if(opts.tools){
if($.isArray(opts.tools)){
$.map(opts.tools,function(t){
_227(tool,t.iconCls,eval(t.handler));
});
}else{
$(opts.tools).children().each(function(){
$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(tool);
});
}
}
if(opts.collapsible){
_227(tool,"panel-tool-collapse",function(){
if(opts.collapsed==true){
_245(_21e,true);
}else{
_238(_21e,true);
}
});
}
if(opts.minimizable){
_227(tool,"panel-tool-min",function(){
_24b(_21e);
});
}
if(opts.maximizable){
_227(tool,"panel-tool-max",function(){
if(opts.maximized==true){
_24e(_21e);
}else{
_237(_21e);
}
});
}
if(opts.closable){
_227(tool,"panel-tool-close",function(){
_239(_21e);
});
}
}
_220.children("div.panel-body").removeClass("panel-body-noheader");
}
};
function _227(c,icon,_228){
var a=$("<a href=\"javascript:void(0)\"></a>").addClass(icon).appendTo(c);
a.bind("click",_228);
};
function _222(){
if(opts.footer){
$(opts.footer).addClass("panel-footer").appendTo(_220);
$(_21e).addClass("panel-body-nobottom");
}else{
_220.children(".panel-footer").remove();
$(_21e).removeClass("panel-body-nobottom");
}
};
};
function _229(_22a,_22b){
var _22c=$.data(_22a,"panel");
var opts=_22c.options;
if(_22d){
opts.queryParams=_22b;
}
if(!opts.href){
return;
}
if(!_22c.isLoaded||!opts.cache){
var _22d=$.extend({},opts.queryParams);
if(opts.onBeforeLoad.call(_22a,_22d)==false){
return;
}
_22c.isLoaded=false;
$(_22a).panel("clear");
if(opts.loadingMessage){
$(_22a).html($("<div class=\"panel-loading\"></div>").html(opts.loadingMessage));
}
//Modified by gongjg on 2015-10-10
//ԭ����
//opts.loader.call(_22a,_22d,function(data){
//var _22e=opts.extractor.call(_22a,data);
//$(_22a).html(_22e);
//$.parser.parse($(_22a));
//opts.onLoad.apply(_22a,arguments);
//_22c.isLoaded=true;
//},function(){
//opts.onLoadError.apply(_22a,arguments);
//});
//�޸Ŀ�ʼ
if(opts.iframe) {
	$(_22a).css('overflow','hidden');
	$(_22a).html('<iframe name="iframeOptFrame" id="' + Math.round(Math.random()*1000) + '_iframeWin" scrolling="' + (opts.scroll==true?'yes':'no') + '" frameborder="0"  src="' + opts.href + '" style="width:100%;height:100%;"></iframe>');
	$.parser.parse($(_22a));
	opts.onLoad.apply(_22a,arguments);
	_22c.isLoaded=true;
}else{
	opts.loader.call(_22a,_22d,function(data){
	var _22e=opts.extractor.call(_22a,data);
	$(_22a).html(_22e);
	$.parser.parse($(_22a));
	opts.onLoad.apply(_22a,arguments);
	_22c.isLoaded=true;
	},function(){
	opts.onLoadError.apply(_22a,arguments);
	});
}
//�޸Ľ���
}
};
function _22f(_230){
var t=$(_230);
t.find(".combo-f").each(function(){
$(this).combo("destroy");
});
t.find(".m-btn").each(function(){
$(this).menubutton("destroy");
});
t.find(".s-btn").each(function(){
$(this).splitbutton("destroy");
});
t.find(".tooltip-f").each(function(){
$(this).tooltip("destroy");
});
t.children("div").each(function(){
$(this)._size("unfit");
});
t.empty();
};
function _231(_232){
$(_232).panel("doLayout",true);
};
function _233(_234,_235){
var opts=$.data(_234,"panel").options;
var _236=$.data(_234,"panel").panel;
if(_235!=true){
if(opts.onBeforeOpen.call(_234)==false){
return;
}
}
_236.stop(true,true);
if($.isFunction(opts.openAnimation)){
opts.openAnimation.call(_234,cb);
}else{
switch(opts.openAnimation){
case "slide":
_236.slideDown(opts.openDuration,cb);
break;
case "fade":
_236.fadeIn(opts.openDuration,cb);
break;
case "show":
_236.show(opts.openDuration,cb);
break;
default:
_236.show();
cb();
}
}
function cb(){
opts.closed=false;
opts.minimized=false;
var tool=_236.children(".panel-header").find("a.panel-tool-restore");
if(tool.length){
opts.maximized=true;
}
opts.onOpen.call(_234);
if(opts.maximized==true){
opts.maximized=false;
_237(_234);
}
if(opts.collapsed==true){
opts.collapsed=false;
_238(_234);
}
if(!opts.collapsed){
_229(_234);
_231(_234);
}
};
};
function _239(_23a,_23b){
var opts=$.data(_23a,"panel").options;
var _23c=$.data(_23a,"panel").panel;
if(_23b!=true){
if(opts.onBeforeClose.call(_23a)==false){
return;
}
}
_23c.stop(true,true);
_23c._size("unfit");
if($.isFunction(opts.closeAnimation)){
opts.closeAnimation.call(_23a,cb);
}else{
switch(opts.closeAnimation){
case "slide":
_23c.slideUp(opts.closeDuration,cb);
break;
case "fade":
_23c.fadeOut(opts.closeDuration,cb);
break;
case "hide":
_23c.hide(opts.closeDuration,cb);
break;
default:
_23c.hide();
cb();
}
}
function cb(){
opts.closed=true;
opts.onClose.call(_23a);
};
};
function _23d(_23e,_23f){
var _240=$.data(_23e,"panel");
var opts=_240.options;
var _241=_240.panel;
if(_23f!=true){
if(opts.onBeforeDestroy.call(_23e)==false){
return;
}
}
$(_23e).panel("clear").panel("clear","footer");
_20b(_241);
opts.onDestroy.call(_23e);
};
function _238(_242,_243){
var opts=$.data(_242,"panel").options;
var _244=$.data(_242,"panel").panel;
var body=_244.children(".panel-body");
var tool=_244.children(".panel-header").find("a.panel-tool-collapse");
if(opts.collapsed==true){
return;
}
body.stop(true,true);
if(opts.onBeforeCollapse.call(_242)==false){
return;
}
tool.addClass("panel-tool-expand");
if(_243==true){
body.slideUp("normal",function(){
opts.collapsed=true;
opts.onCollapse.call(_242);
});
}else{
body.hide();
opts.collapsed=true;
opts.onCollapse.call(_242);
}
};
function _245(_246,_247){
var opts=$.data(_246,"panel").options;
var _248=$.data(_246,"panel").panel;
var body=_248.children(".panel-body");
var tool=_248.children(".panel-header").find("a.panel-tool-collapse");
if(opts.collapsed==false){
return;
}
body.stop(true,true);
if(opts.onBeforeExpand.call(_246)==false){
return;
}
tool.removeClass("panel-tool-expand");
if(_247==true){
body.slideDown("normal",function(){
opts.collapsed=false;
opts.onExpand.call(_246);
_229(_246);
_231(_246);
});
}else{
body.show();
opts.collapsed=false;
opts.onExpand.call(_246);
_229(_246);
_231(_246);
}
};
//panel���
function _237(_249){
var opts=$.data(_249,"panel").options;
var _24a=$.data(_249,"panel").panel;
var tool=_24a.children(".panel-header").find("a.panel-tool-max");
if(opts.maximized==true){
//Modified by gongjg on 2015-10-10
//return;
_24a.show();
}
tool.addClass("panel-tool-restore");
if(!$.data(_249,"panel").original){
$.data(_249,"panel").original={width:opts.width,height:opts.height,left:opts.left,top:opts.top,fit:opts.fit};
}
opts.left=0;
opts.top=0;
opts.fit=true;
_20c(_249);
opts.minimized=false;
opts.maximized=true;
opts.onMaximize.call(_249);
};
//panel��С��
function _24b(_24c){
var opts=$.data(_24c,"panel").options;
var _24d=$.data(_24c,"panel").panel;
_24d._size("unfit");
_24d.hide();
opts.minimized=true;
opts.maximized=false;
opts.onMinimize.call(_24c);
};
//panel�ָ�
function _24e(_24f){
var opts=$.data(_24f,"panel").options;
var _250=$.data(_24f,"panel").panel;
var tool=_250.children(".panel-header").find("a.panel-tool-max");
if(opts.maximized==false){
return;
}
_250.show();
tool.removeClass("panel-tool-restore");
$.extend(opts,$.data(_24f,"panel").original);
_20c(_24f);
opts.minimized=false;
opts.maximized=false;
$.data(_24f,"panel").original=null;
opts.onRestore.call(_24f);
};
//Add by gongjg on 2015-10-10
//��ʼ
function show(target){
var opts=$.data(target,"panel").options;
var panel=$.data(target,"panel").panel;
var tool=panel.children("div.panel-header").find("a.panel-tool-max");
panel.show();
tool.removeClass("panel-tool-restore");
var originalPanel=$.data(target,"panel").original;
if(originalPanel){
opts.width=originalPanel.width;
opts.height=originalPanel.height;
opts.left=originalPanel.left;
opts.top=originalPanel.top;
opts.fit=originalPanel.fit;
}
_20c(target);
opts.minimized=false;
opts.maximized=false;
$.data(target,"panel").original=null;
opts.onRestore.call(target);
};
//����
function _251(_252,_253){
$.data(_252,"panel").options.title=_253;
$(_252).panel("header").find("div.panel-title").html(_253);
};
var _254=null;
$(window).unbind(".panel").bind("resize.panel",function(){
if(_254){
clearTimeout(_254);
}
_254=setTimeout(function(){
var _255=$("body.layout");
if(_255.length){
_255.layout("resize");
$("body").children(".ui-fluid:visible").each(function(){
$(this).triggerHandler("_resize");
});
}else{
$("body").panel("doLayout");
}
_254=null;
},100);
});
$.fn.panel=function(_256,_257){
if(typeof _256=="string"){
return $.fn.panel.methods[_256](this,_257);
}
_256=_256||{};
return this.each(function(){
var _258=$.data(this,"panel");
var opts;
if(_258){
opts=$.extend(_258.options,_256);
_258.isLoaded=false;
}else{
opts=$.extend({},$.fn.panel.defaults,$.fn.panel.parseOptions(this),_256);
$(this).attr("title","");
_258=$.data(this,"panel",{options:opts,panel:_219(this),isLoaded:false});
}
_21d(this);
if(opts.doSize==true){
_258.panel.css("display","block");
_20c(this);
}
if(opts.closed==true||opts.minimized==true){
_258.panel.hide();
}else{
_233(this);
}
});
};
$.fn.panel.methods={options:function(jq){
return $.data(jq[0],"panel").options;
},panel:function(jq){
return $.data(jq[0],"panel").panel;
},header:function(jq){
return $.data(jq[0],"panel").panel.children(".panel-header");
},footer:function(jq){
return jq.panel("panel").children(".panel-footer");
},body:function(jq){
return $.data(jq[0],"panel").panel.children(".panel-body");
},setTitle:function(jq,_259){
return jq.each(function(){
_251(this,_259);
});
},open:function(jq,_25a){
return jq.each(function(){
_233(this,_25a);
});
},close:function(jq,_25b){
return jq.each(function(){
_239(this,_25b);
});
},destroy:function(jq,_25c){
return jq.each(function(){
_23d(this,_25c);
});
},clear:function(jq,type){
return jq.each(function(){
_22f(type=="footer"?$(this).panel("footer"):this);
});
},refresh:function(jq,href){
return jq.each(function(){
var _25d=$.data(this,"panel");
_25d.isLoaded=false;
if(href){
if(typeof href=="string"){
_25d.options.href=href;
}else{
_25d.options.queryParams=href;
}
}
_229(this);
});
},resize:function(jq,_25e){
return jq.each(function(){
_20c(this,_25e);
});
},doLayout:function(jq,all){
return jq.each(function(){
_25f(this,"body");
_25f($(this).siblings(".panel-footer")[0],"footer");
function _25f(_260,type){
if(!_260){
return;
}
var _261=_260==$("body")[0];
var s=$(_260).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.ui-fluid:visible").filter(function(_262,el){
var p=$(el).parents(".panel-"+type+":first");
return _261?p.length==0:p[0]==_260;
});
s.each(function(){
$(this).triggerHandler("_resize",[all||false]);
});
};
});
},move:function(jq,_263){
return jq.each(function(){
_215(this,_263);
});
},maximize:function(jq){
return jq.each(function(){
_237(this);
});
},minimize:function(jq){
return jq.each(function(){
_24b(this);
});
},restore:function(jq){
return jq.each(function(){
_24e(this);
});
},show:function(jq){
return jq.each(function(){
show(this);
});
},collapse:function(jq,_264){
return jq.each(function(){
_238(this,_264);
});
},expand:function(jq,_265){
return jq.each(function(){
_245(this,_265);
});
}};
$.fn.panel.parseOptions=function(_266){
var t=$(_266);
var hh=t.children(".panel-header,header");
var ff=t.children(".panel-footer,footer");
return $.extend({},$.parser.parseOptions(_266,["id","width","height","left","top","title","iconCls","cls","headerCls","bodyCls","tools","href","method","header","footer",{cache:"boolean",fit:"boolean",border:"boolean",noheader:"boolean"},{collapsible:"boolean",minimizable:"boolean",maximizable:"boolean"},{closable:"boolean",collapsed:"boolean",minimized:"boolean",maximized:"boolean",closed:"boolean"},"openAnimation","closeAnimation",{openDuration:"number",closeDuration:"number"},]),{loadingMessage:(t.attr("loadingMessage")!=undefined?t.attr("loadingMessage"):undefined),header:(hh.length?hh.removeClass("panel-header"):undefined),footer:(ff.length?ff.removeClass("panel-footer"):undefined)});
};
//Modified by gongjg on 2015-10-10
//���iframe,scroll����
$.fn.panel.defaults={id:null,title:null,iconCls:null,width:"auto",height:"auto",left:null,top:null,cls:null,headerCls:null,bodyCls:null,style:{},iframe:false,scroll:false,href:null,cache:true,fit:false,border:true,doSize:true,noheader:false,content:null,collapsible:false,minimizable:false,maximizable:false,closable:false,collapsed:false,minimized:false,maximized:false,closed:false,openAnimation:false,openDuration:400,closeAnimation:false,closeDuration:400,tools:null,footer:null,header:null,queryParams:{},method:"get",href:null,loadingMessage:"Loading...",loader:function(_267,_268,_269){
var opts=$(this).panel("options");
if(!opts.href){
return false;
}
$.ajax({type:opts.method,url:opts.href,cache:false,data:_267,dataType:"html",success:function(data){
_268(data);
},error:function(){
_269.apply(this,arguments);
}});
},extractor:function(data){
var _26a=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
var _26b=_26a.exec(data);
if(_26b){
return _26b[1];
}else{
return data;
}
},onBeforeLoad:function(_26c){
},onLoad:function(){
},onLoadError:function(){
},onBeforeOpen:function(){
},onOpen:function(){
},onBeforeClose:function(){
},onClose:function(){
},onBeforeDestroy:function(){
},onDestroy:function(){
},onResize:function(_26d,_26e){
},onMove:function(left,top){
},onMaximize:function(){
},onRestore:function(){
},onMinimize:function(){
},onBeforeCollapse:function(){
},onBeforeExpand:function(){
},onCollapse:function(){
},onExpand:function(){
}};
})(jQuery);
//Window���
(function($){
function _26f(_270,_271){
var _272=$.data(_270,"window");
if(_271){
if(_271.left!=null){
_272.options.left=_271.left;
}
if(_271.top!=null){
_272.options.top=_271.top;
}
}
$(_270).panel("move",_272.options);
if(_272.shadow){
_272.shadow.css({left:_272.options.left,top:_272.options.top});
}
};
function _273(_274,_275){
var opts=$.data(_274,"window").options;
var pp=$(_274).window("panel");
var _276=pp._outerWidth();
if(opts.inline){
var _277=pp.parent();
opts.left=Math.ceil((_277.width()-_276)/2+_277.scrollLeft());
}else{
opts.left=Math.ceil(($(window)._outerWidth()-_276)/2+$(document).scrollLeft());
}
if(_275){
_26f(_274);
}
};
function _278(_279,_27a){
var opts=$.data(_279,"window").options;
var pp=$(_279).window("panel");
var _27b=pp._outerHeight();
if(opts.inline){
var _27c=pp.parent();
opts.top=Math.ceil((_27c.height()-_27b)/2+_27c.scrollTop());
}else{
opts.top=Math.ceil(($(window)._outerHeight()-_27b)/2+$(document).scrollTop());
}
if(_27a){
_26f(_279);
}
};
function _27d(_27e){
var _27f=$.data(_27e,"window");
var opts=_27f.options;
/*
* Modified by gongjg on 2015-10-10
* ����windowCls��headerCls����
*/
var win=$(_27e).panel($.extend({},_27f.options,{border:false,doSize:true,closed:true,cls:"window " + (_27f.options.windowCls?' ' + _27f.options.windowCls:''),headerCls:"window-header " + (_27f.options.headerCls?' ' + _27f.options.headerCls:''),bodyCls:"window-body "+(opts.noheader?"window-body-noheader":""),onBeforeDestroy:function(){
if(opts.onBeforeDestroy.call(_27e)==false){
return false;
}
if(_27f.shadow){
_27f.shadow.remove();
}
if(_27f.mask){
_27f.mask.remove();
}
},onClose:function(){
if(_27f.shadow){
_27f.shadow.hide();
}
if(_27f.mask){
_27f.mask.hide();
}
opts.onClose.call(_27e);
},onOpen:function(){
if(_27f.mask){
_27f.mask.css($.extend({display:"block",zIndex:$.fn.window.defaults.zIndex++},$.fn.window.getMaskSize(_27e)));
}
if(_27f.shadow){
_27f.shadow.css({display:"block",zIndex:$.fn.window.defaults.zIndex++,left:opts.left,top:opts.top,width:_27f.window._outerWidth(),height:_27f.window._outerHeight()});
}
_27f.window.css("z-index",$.fn.window.defaults.zIndex++);
opts.onOpen.call(_27e);
},onResize:function(_280,_281){
var _282=$(this).panel("options");
$.extend(opts,{width:_282.width,height:_282.height,left:_282.left,top:_282.top});
if(_27f.shadow){
_27f.shadow.css({left:opts.left,top:opts.top,width:_27f.window._outerWidth(),height:_27f.window._outerHeight()});
}
opts.onResize.call(_27e,_280,_281);
},onMinimize:function(){
if(_27f.shadow){
_27f.shadow.hide();
}
if(_27f.mask){
_27f.mask.hide();
}
_27f.options.onMinimize.call(_27e);
},onBeforeCollapse:function(){
if(opts.onBeforeCollapse.call(_27e)==false){
return false;
}
if(_27f.shadow){
_27f.shadow.hide();
}
},onExpand:function(){
if(_27f.shadow){
_27f.shadow.show();
}
opts.onExpand.call(_27e);
}}));
_27f.window=win.panel("panel");
if(_27f.mask){
_27f.mask.remove();
}
if(opts.modal==true){
_27f.mask=$("<div class=\"window-mask\" style=\"display:none\"></div>").insertAfter(_27f.window);
}
if(_27f.shadow){
_27f.shadow.remove();
}
if(opts.shadow==true){
_27f.shadow=$("<div class=\"window-shadow\" style=\"display:none\"></div>").insertAfter(_27f.window);
}
if(opts.left==null){
_273(_27e);
}
if(opts.top==null){
_278(_27e);
}
_26f(_27e);
if(!opts.closed){
win.window("open");
}
};
function _283(_284){
var _285=$.data(_284,"window");
_285.window.draggable({handle:">div.panel-header>div.panel-title",disabled:_285.options.draggable==false,onStartDrag:function(e){
if(_285.mask){
_285.mask.css("z-index",$.fn.window.defaults.zIndex++);
}
if(_285.shadow){
_285.shadow.css("z-index",$.fn.window.defaults.zIndex++);
}
_285.window.css("z-index",$.fn.window.defaults.zIndex++);
if(!_285.proxy){
_285.proxy=$("<div class=\"window-proxy\"></div>").insertAfter(_285.window);
}
_285.proxy.css({display:"none",zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top});
_285.proxy._outerWidth(_285.window._outerWidth());
_285.proxy._outerHeight(_285.window._outerHeight());
setTimeout(function(){
if(_285.proxy){
_285.proxy.show();
}
},500);
},onDrag:function(e){
_285.proxy.css({display:"block",left:e.data.left,top:e.data.top});
return false;
},onStopDrag:function(e){
_285.options.left=e.data.left;
_285.options.top=e.data.top;
$(_284).window("move");
_285.proxy.remove();
_285.proxy=null;
}});
_285.window.resizable({disabled:_285.options.resizable==false,onStartResize:function(e){
if(_285.pmask){
_285.pmask.remove();
}
_285.pmask=$("<div class=\"window-proxy-mask\"></div>").insertAfter(_285.window);
_285.pmask.css({zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top,width:_285.window._outerWidth(),height:_285.window._outerHeight()});
if(_285.proxy){
_285.proxy.remove();
}
_285.proxy=$("<div class=\"window-proxy\"></div>").insertAfter(_285.window);
_285.proxy.css({zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top});
_285.proxy._outerWidth(e.data.width)._outerHeight(e.data.height);
},onResize:function(e){
_285.proxy.css({left:e.data.left,top:e.data.top});
_285.proxy._outerWidth(e.data.width);
_285.proxy._outerHeight(e.data.height);
return false;
},onStopResize:function(e){
$(_284).window("resize",e.data);
_285.pmask.remove();
_285.pmask=null;
_285.proxy.remove();
_285.proxy=null;
}});
};
$(window).resize(function(){
$("body>div.window-mask").css({width:$(window)._outerWidth(),height:$(window)._outerHeight()});
setTimeout(function(){
$("body>div.window-mask").css($.fn.window.getMaskSize());
},50);
});
$.fn.window=function(_286,_287){
if(typeof _286=="string"){
var _288=$.fn.window.methods[_286];
if(_288){
return _288(this,_287);
}else{
return this.panel(_286,_287);
}
}
_286=_286||{};
return this.each(function(){
var _289=$.data(this,"window");
if(_289){
$.extend(_289.options,_286);
}else{
_289=$.data(this,"window",{options:$.extend({},$.fn.window.defaults,$.fn.window.parseOptions(this),_286)});
if(!_289.options.inline){
document.body.appendChild(this);
}
}
_27d(this);
_283(this);
});
};
$.fn.window.methods={options:function(jq){
var _28a=jq.panel("options");
var _28b=$.data(jq[0],"window").options;
return $.extend(_28b,{closed:_28a.closed,collapsed:_28a.collapsed,minimized:_28a.minimized,maximized:_28a.maximized});
},window:function(jq){
return $.data(jq[0],"window").window;
},move:function(jq,_28c){
return jq.each(function(){
_26f(this,_28c);
});
},hcenter:function(jq){
return jq.each(function(){
_273(this,true);
});
},vcenter:function(jq){
return jq.each(function(){
_278(this,true);
});
},center:function(jq){
return jq.each(function(){
_273(this);
_278(this);
_26f(this);
});
}};
$.fn.window.getMaskSize=function(_28d){
var _28e=$(_28d).data("window");
var _28f=(_28e&&_28e.options.inline);
return {width:(_28f?"100%":$(document).width()),height:(_28f?"100%":$(document).height())};
};
$.fn.window.parseOptions=function(_290){
return $.extend({},$.fn.panel.parseOptions(_290),$.parser.parseOptions(_290,[{draggable:"boolean",resizable:"boolean",shadow:"boolean",modal:"boolean",inline:"boolean"}]));
};
$.fn.window.defaults=$.extend({},$.fn.panel.defaults,{zIndex:9000,draggable:true,resizable:true,shadow:true,modal:false,inline:false,title:"New Window",collapsible:true,minimizable:true,maximizable:true,closable:true,closed:false});
})(jQuery);
//Dialog�Ի������
(function($){
function _291(_292){
var opts=$.data(_292,"dialog").options;
opts.inited=false;
$(_292).window($.extend({},opts,{onResize:function(w,h){
if(opts.inited){
_297(this);
opts.onResize.call(this,w,h);
}
}}));
var win=$(_292).window("window");
if(opts.toolbar){
if($.isArray(opts.toolbar)){
$(_292).siblings("div.dialog-toolbar").remove();
var _293=$("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").appendTo(win);
var tr=_293.find("tr");
for(var i=0;i<opts.toolbar.length;i++){
var btn=opts.toolbar[i];
if(btn=="-"){
$("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
tool[0].onclick=eval(btn.handler||function(){
});
tool.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
$(opts.toolbar).addClass("dialog-toolbar").appendTo(win);
$(opts.toolbar).show();
}
}else{
$(_292).siblings("div.dialog-toolbar").remove();
}
if(opts.buttons){
if($.isArray(opts.buttons)){
$(_292).siblings("div.dialog-button").remove();
var _294=$("<div class=\"dialog-button\"></div>").appendTo(win);
for(var i=0;i<opts.buttons.length;i++){
var p=opts.buttons[i];
var _295=$("<a href=\"javascript:void(0)\"></a>").appendTo(_294);
if(p.handler){
_295[0].onclick=p.handler;
}
_295.linkbutton(p);
}
}else{
$(opts.buttons).addClass("dialog-button").appendTo(win);
$(opts.buttons).show();
}
}else{
$(_292).siblings("div.dialog-button").remove();
}
opts.inited=true;
var _296=opts.closed;
win.show();
$(_292).window("resize");
if(_296){
win.hide();
}
};
function _297(_298,_299){
var t=$(_298);
var opts=t.dialog("options");
var _29a=opts.noheader;
var tb=t.siblings(".dialog-toolbar");
var bb=t.siblings(".dialog-button");
tb.insertBefore(_298).css({position:"relative",borderTopWidth:(_29a?1:0),top:(_29a?tb.length:0)});
bb.insertAfter(_298).css({position:"relative",top:-1});
tb.add(bb)._outerWidth(t._outerWidth()).find(".ui-fluid:visible").each(function(){
$(this).triggerHandler("_resize");
});
if(!isNaN(parseInt(opts.height))){
t._outerHeight(t._outerHeight()-tb._outerHeight()-bb._outerHeight());
}
var _29b=$.data(_298,"window").shadow;
if(_29b){
var cc=t.panel("panel");
_29b.css({width:cc._outerWidth(),height:cc._outerHeight()});
}
};
$.fn.dialog=function(_29c,_29d){
if(typeof _29c=="string"){
var _29e=$.fn.dialog.methods[_29c];
if(_29e){
return _29e(this,_29d);
}else{
return this.window(_29c,_29d);
}
}
_29c=_29c||{};
return this.each(function(){
var _29f=$.data(this,"dialog");
if(_29f){
$.extend(_29f.options,_29c);
}else{
$.data(this,"dialog",{options:$.extend({},$.fn.dialog.defaults,$.fn.dialog.parseOptions(this),_29c)});
}
_291(this);
});
};
$.fn.dialog.methods={options:function(jq){
var _2a0=$.data(jq[0],"dialog").options;
var _2a1=jq.panel("options");
$.extend(_2a0,{width:_2a1.width,height:_2a1.height,left:_2a1.left,top:_2a1.top,closed:_2a1.closed,collapsed:_2a1.collapsed,minimized:_2a1.minimized,maximized:_2a1.maximized});
return _2a0;
},dialog:function(jq){
return jq.window("window");
}};
$.fn.dialog.parseOptions=function(_2a2){
var t=$(_2a2);
return $.extend({},$.fn.window.parseOptions(_2a2),$.parser.parseOptions(_2a2,["toolbar","buttons"]),{toolbar:(t.children(".dialog-toolbar").length?t.children(".dialog-toolbar").removeClass("dialog-toolbar"):undefined),buttons:(t.children(".dialog-button").length?t.children(".dialog-button").removeClass("dialog-button"):undefined)});
};
$.fn.dialog.defaults=$.extend({},$.fn.window.defaults,{title:"New Dialog",collapsible:false,minimizable:false,maximizable:false,resizable:false,toolbar:null,buttons:null});
})(jQuery);
(function($){
function _2a3(){
$(document).unbind(".messager").bind("keydown.messager",function(e){
if(e.keyCode==27){
$("body").children("div.messager-window").children("div.messager-body").each(function(){
$(this).window("close");
});
}else{
if(e.keyCode==9){
var win=$("body").children("div.messager-window").children("div.messager-body");
if(!win.length){
return;
}
var _2a4=win.find(".messager-input,.messager-button .l-btn");
for(var i=0;i<_2a4.length;i++){
if($(_2a4[i]).is(":focus")){
$(_2a4[i>=_2a4.length-1?0:i+1]).focus();
return false;
}
}
}
}
});
};
function _2a5(){
$(document).unbind(".messager");
};
function _2a6(_2a7){
var opts=$.extend({},$.messager.defaults,{modal:false,shadow:false,draggable:false,resizable:false,closed:true,style:{left:"",top:"",right:0,zIndex:$.fn.window.defaults.zIndex++,bottom:-document.body.scrollTop-document.documentElement.scrollTop},title:"",width:250,height:100,showType:"slide",showSpeed:600,msg:"",timeout:4000},_2a7);
var win=$("<div class=\"messager-body\"></div>").html(opts.msg).appendTo("body");
win.window($.extend({},opts,{openAnimation:(opts.showType),closeAnimation:(opts.showType=="show"?"hide":opts.showType),openDuration:opts.showSpeed,closeDuration:opts.showSpeed,onOpen:function(){
win.window("window").hover(function(){
if(opts.timer){
clearTimeout(opts.timer);
}
},function(){
_2a8();
});
_2a8();
function _2a8(){
if(opts.timeout>0){
opts.timer=setTimeout(function(){
if(win.length&&win.data("window")){
win.window("close");
}
},opts.timeout);
}
};
if(_2a7.onOpen){
_2a7.onOpen.call(this);
}else{
opts.onOpen.call(this);
}
},onClose:function(){
if(opts.timer){
clearTimeout(opts.timer);
}
if(_2a7.onClose){
_2a7.onClose.call(this);
}else{
opts.onClose.call(this);
}
win.window("destroy");
}}));
win.window("window").css(opts.style);
win.window("open");
return win;
};
function _2a9(_2aa){
_2a3();
var win=$("<div class=\"messager-body\"></div>").appendTo("body");
win.window($.extend({},_2aa,{doSize:false,noheader:(_2aa.title?false:true),onClose:function(){
_2a5();
if(_2aa.onClose){
_2aa.onClose.call(this);
}
setTimeout(function(){
win.window("destroy");
},100);
}}));
if(_2aa.buttons&&_2aa.buttons.length){
var tb=$("<div class=\"messager-button\"></div>").appendTo(win);
$.map(_2aa.buttons,function(btn){
$("<a href=\"javascript:void(0)\" style=\"margin-left:10px\"></a>").appendTo(tb).linkbutton(btn);
});
}
win.window("window").addClass("messager-window");
win.window("resize");
win.children("div.messager-button").children("a:first").focus();
return win;
};
$.messager={show:function(_2ab){
return _2a6(_2ab);
},alert:function(_2ac,msg,icon,fn){
var opts=typeof _2ac=="object"?_2ac:{title:_2ac,msg:msg,icon:icon,fn:fn};
var cls=opts.icon?"messager-icon messager-"+opts.icon:"";
opts=$.extend({},$.messager.defaults,{content:"<div class=\""+cls+"\"></div>"+"<div>"+opts.msg+"</div>"+"<div style=\"clear:both;\"/>",buttons:[{text:$.messager.defaults.ok,onClick:function(){
win.window("close");
opts.fn();
}}]},opts);
var win=_2a9(opts);
return win;
},confirm:function(_2ad,msg,fn){
var opts=typeof _2ad=="object"?_2ad:{title:_2ad,msg:msg,fn:fn};
opts=$.extend({},$.messager.defaults,{content:"<div class=\"messager-icon messager-question\"></div>"+"<div>"+opts.msg+"</div>"+"<div style=\"clear:both;\"/>",buttons:[{text:$.messager.defaults.ok,onClick:function(){
win.window("close");
opts.fn(true);
}},{text:$.messager.defaults.cancel,onClick:function(){
win.window("close");
opts.fn(false);
}}]},opts);
var win=_2a9(opts);
return win;
},prompt:function(_2ae,msg,fn){
var opts=typeof _2ae=="object"?_2ae:{title:_2ae,msg:msg,fn:fn};
opts=$.extend({},$.messager.defaults,{content:"<div class=\"messager-icon messager-question\"></div>"+"<div>"+opts.msg+"</div>"+"<br/>"+"<div style=\"clear:both;\"/>"+"<div><input class=\"messager-input\" type=\"text\"/></div>",buttons:[{text:$.messager.defaults.ok,onClick:function(){
win.window("close");
opts.fn(win.find(".messager-input").val());
}},{text:$.messager.defaults.cancel,onClick:function(){
win.window("close");
opts.fn();
}}]},opts);
var win=_2a9(opts);
win.find("input.messager-input").focus();
return win;
},progress:function(_2af){
var _2b0={bar:function(){
return $("body>div.messager-window").find("div.messager-p-bar");
},close:function(){
var win=$("body>div.messager-window>div.messager-body:has(div.messager-progress)");
if(win.length){
win.window("close");
}
}};
if(typeof _2af=="string"){
var _2b1=_2b0[_2af];
return _2b1();
}
var opts=$.extend({},{title:"",content:undefined,msg:"",text:undefined,interval:300},_2af||{});
var win=_2a9($.extend({},$.messager.defaults,{content:"<div class=\"messager-progress\"><div class=\"messager-p-msg\">"+opts.msg+"</div><div class=\"messager-p-bar\"></div></div>",closable:false,doSize:false},opts,{onClose:function(){
if(this.timer){
clearInterval(this.timer);
}
if(_2af.onClose){
_2af.onClose.call(this);
}else{
$.messager.defaults.onClose.call(this);
}
}}));
var bar=win.find("div.messager-p-bar");
bar.progressbar({text:opts.text});
win.window("resize");
if(opts.interval){
win[0].timer=setInterval(function(){
var v=bar.progressbar("getValue");
v+=10;
if(v>100){
v=0;
}
bar.progressbar("setValue",v);
},opts.interval);
}
return win;
}};
$.messager.defaults=$.extend({},$.fn.window.defaults,{ok:"Ok",cancel:"Cancel",width:300,height:"auto",modal:true,collapsible:false,minimizable:false,maximizable:false,resizable:false,fn:function(){
}});
})(jQuery);
(function($){
function _2b2(_2b3,_2b4){
var _2b5=$.data(_2b3,"accordion");
var opts=_2b5.options;
var _2b6=_2b5.panels;
var cc=$(_2b3);
if(_2b4){
$.extend(opts,{width:_2b4.width,height:_2b4.height});
}
cc._size(opts);
var _2b7=0;
var _2b8="auto";
var _2b9=cc.find(">.panel>.accordion-header");
if(_2b9.length){
_2b7=$(_2b9[0]).css("height","")._outerHeight();
}
if(!isNaN(parseInt(opts.height))){
_2b8=cc.height()-_2b7*_2b9.length;
}
_2ba(true,_2b8-_2ba(false)+1);
function _2ba(_2bb,_2bc){
var _2bd=0;
for(var i=0;i<_2b6.length;i++){
var p=_2b6[i];
var h=p.panel("header")._outerHeight(_2b7);
if(p.panel("options").collapsible==_2bb){
var _2be=isNaN(_2bc)?undefined:(_2bc+_2b7*h.length);
p.panel("resize",{width:cc.width(),height:(_2bb?_2be:undefined)});
_2bd+=p.panel("panel").outerHeight()-_2b7*h.length;
}
}
return _2bd;
};
};
function _2bf(_2c0,_2c1,_2c2,all){
var _2c3=$.data(_2c0,"accordion").panels;
var pp=[];
for(var i=0;i<_2c3.length;i++){
var p=_2c3[i];
if(_2c1){
if(p.panel("options")[_2c1]==_2c2){
pp.push(p);
}
}else{
if(p[0]==$(_2c2)[0]){
return i;
}
}
}
if(_2c1){
return all?pp:(pp.length?pp[0]:null);
}else{
return -1;
}
};
function _2c4(_2c5){
return _2bf(_2c5,"collapsed",false,true);
};
function _2c6(_2c7){
var pp=_2c4(_2c7);
return pp.length?pp[0]:null;
};
function _2c8(_2c9,_2ca){
return _2bf(_2c9,null,_2ca);
};
function _2cb(_2cc,_2cd){
var _2ce=$.data(_2cc,"accordion").panels;
if(typeof _2cd=="number"){
if(_2cd<0||_2cd>=_2ce.length){
return null;
}else{
return _2ce[_2cd];
}
}
return _2bf(_2cc,"title",_2cd);
};
function _2cf(_2d0){
var opts=$.data(_2d0,"accordion").options;
var cc=$(_2d0);
if(opts.border){
cc.removeClass("accordion-noborder");
}else{
cc.addClass("accordion-noborder");
}
};
function init(_2d1){
var _2d2=$.data(_2d1,"accordion");
var cc=$(_2d1);
cc.addClass("accordion");
_2d2.panels=[];
cc.children("div").each(function(){
var opts=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
var pp=$(this);
_2d2.panels.push(pp);
_2d4(_2d1,pp,opts);
});
cc.bind("_resize",function(e,_2d3){
if($(this).hasClass("ui-fluid")||_2d3){
_2b2(_2d1);
}
return false;
});
};
function _2d4(_2d5,pp,_2d6){
var opts=$.data(_2d5,"accordion").options;
pp.panel($.extend({},{collapsible:true,minimizable:false,maximizable:false,closable:false,doSize:false,collapsed:true,headerCls:"accordion-header",bodyCls:"accordion-body"},_2d6,{onBeforeExpand:function(){
if(_2d6.onBeforeExpand){
if(_2d6.onBeforeExpand.call(this)==false){
return false;
}
}
if(!opts.multiple){
var all=$.grep(_2c4(_2d5),function(p){
return p.panel("options").collapsible;
});
for(var i=0;i<all.length;i++){
_2de(_2d5,_2c8(_2d5,all[i]));
}
}
var _2d7=$(this).panel("header");
_2d7.addClass("accordion-header-selected");
_2d7.find(".accordion-collapse").removeClass("accordion-expand");
},onExpand:function(){
if(_2d6.onExpand){
_2d6.onExpand.call(this);
}
opts.onSelect.call(_2d5,$(this).panel("options").title,_2c8(_2d5,this));
},onBeforeCollapse:function(){
if(_2d6.onBeforeCollapse){
if(_2d6.onBeforeCollapse.call(this)==false){
return false;
}
}
var _2d8=$(this).panel("header");
_2d8.removeClass("accordion-header-selected");
_2d8.find(".accordion-collapse").addClass("accordion-expand");
},onCollapse:function(){
if(_2d6.onCollapse){
_2d6.onCollapse.call(this);
}
opts.onUnselect.call(_2d5,$(this).panel("options").title,_2c8(_2d5,this));
}}));
var _2d9=pp.panel("header");
var tool=_2d9.children("div.panel-tool");
tool.children("a.panel-tool-collapse").hide();
var t=$("<a href=\"javascript:void(0)\"></a>").addClass("accordion-collapse accordion-expand").appendTo(tool);
t.bind("click",function(){
_2da(pp);
return false;
});
pp.panel("options").collapsible?t.show():t.hide();
_2d9.click(function(){
_2da(pp);
return false;
});
function _2da(p){
var _2db=p.panel("options");
if(_2db.collapsible){
var _2dc=_2c8(_2d5,p);
if(_2db.collapsed){
_2dd(_2d5,_2dc);
}else{
_2de(_2d5,_2dc);
}
}
};
};
function _2dd(_2df,_2e0){
var p=_2cb(_2df,_2e0);
if(!p){
return;
}
_2e1(_2df);
var opts=$.data(_2df,"accordion").options;
p.panel("expand",opts.animate);
};
function _2de(_2e2,_2e3){
var p=_2cb(_2e2,_2e3);
if(!p){
return;
}
_2e1(_2e2);
var opts=$.data(_2e2,"accordion").options;
p.panel("collapse",opts.animate);
};
function _2e4(_2e5){
var opts=$.data(_2e5,"accordion").options;
var p=_2bf(_2e5,"selected",true);
if(p){
_2e6(_2c8(_2e5,p));
}else{
_2e6(opts.selected);
}
function _2e6(_2e7){
var _2e8=opts.animate;
opts.animate=false;
_2dd(_2e5,_2e7);
opts.animate=_2e8;
};
};
function _2e1(_2e9){
var _2ea=$.data(_2e9,"accordion").panels;
for(var i=0;i<_2ea.length;i++){
_2ea[i].stop(true,true);
}
};
function add(_2eb,_2ec){
var _2ed=$.data(_2eb,"accordion");
var opts=_2ed.options;
var _2ee=_2ed.panels;
if(_2ec.selected==undefined){
_2ec.selected=true;
}
_2e1(_2eb);
var pp=$("<div></div>").appendTo(_2eb);
_2ee.push(pp);
_2d4(_2eb,pp,_2ec);
_2b2(_2eb);
opts.onAdd.call(_2eb,_2ec.title,_2ee.length-1);
if(_2ec.selected){
_2dd(_2eb,_2ee.length-1);
}
};
function _2ef(_2f0,_2f1){
var _2f2=$.data(_2f0,"accordion");
var opts=_2f2.options;
var _2f3=_2f2.panels;
_2e1(_2f0);
var _2f4=_2cb(_2f0,_2f1);
var _2f5=_2f4.panel("options").title;
var _2f6=_2c8(_2f0,_2f4);
if(!_2f4){
return;
}
if(opts.onBeforeRemove.call(_2f0,_2f5,_2f6)==false){
return;
}
_2f3.splice(_2f6,1);
_2f4.panel("destroy");
if(_2f3.length){
_2b2(_2f0);
var curr=_2c6(_2f0);
if(!curr){
_2dd(_2f0,0);
}
}
opts.onRemove.call(_2f0,_2f5,_2f6);
};
$.fn.accordion=function(_2f7,_2f8){
if(typeof _2f7=="string"){
return $.fn.accordion.methods[_2f7](this,_2f8);
}
_2f7=_2f7||{};
return this.each(function(){
var _2f9=$.data(this,"accordion");
if(_2f9){
$.extend(_2f9.options,_2f7);
}else{
$.data(this,"accordion",{options:$.extend({},$.fn.accordion.defaults,$.fn.accordion.parseOptions(this),_2f7),accordion:$(this).addClass("accordion"),panels:[]});
init(this);
}
_2cf(this);
_2b2(this);
_2e4(this);
});
};
$.fn.accordion.methods={options:function(jq){
return $.data(jq[0],"accordion").options;
},panels:function(jq){
return $.data(jq[0],"accordion").panels;
},resize:function(jq,_2fa){
return jq.each(function(){
_2b2(this,_2fa);
});
},getSelections:function(jq){
return _2c4(jq[0]);
},getSelected:function(jq){
return _2c6(jq[0]);
},getPanel:function(jq,_2fb){
return _2cb(jq[0],_2fb);
},getPanelIndex:function(jq,_2fc){
return _2c8(jq[0],_2fc);
},select:function(jq,_2fd){
return jq.each(function(){
_2dd(this,_2fd);
});
},unselect:function(jq,_2fe){
return jq.each(function(){
_2de(this,_2fe);
});
},add:function(jq,_2ff){
return jq.each(function(){
add(this,_2ff);
});
},remove:function(jq,_300){
return jq.each(function(){
_2ef(this,_300);
});
}};
$.fn.accordion.parseOptions=function(_301){
var t=$(_301);
return $.extend({},$.parser.parseOptions(_301,["width","height",{fit:"boolean",border:"boolean",animate:"boolean",multiple:"boolean",selected:"number"}]));
};
$.fn.accordion.defaults={width:"auto",height:"auto",fit:false,border:true,animate:true,multiple:false,selected:0,onSelect:function(_302,_303){
},onUnselect:function(_304,_305){
},onAdd:function(_306,_307){
},onBeforeRemove:function(_308,_309){
},onRemove:function(_30a,_30b){
}};
})(jQuery);
(function($){
function _30c(c){
var w=0;
$(c).children().each(function(){
w+=$(this).outerWidth(true);
});
return w;
};
function _30d(_30e){
var opts=$.data(_30e,"tabs").options;
if(opts.tabPosition=="left"||opts.tabPosition=="right"||!opts.showHeader){
return;
}
var _30f=$(_30e).children("div.tabs-header");
var tool=_30f.children("div.tabs-tool:not(.tabs-tool-hidden)");
var _310=_30f.children("div.tabs-scroller-left");
var _311=_30f.children("div.tabs-scroller-right");
var wrap=_30f.children("div.tabs-wrap");
var _312=_30f.outerHeight();
if(opts.plain){
_312-=_312-_30f.height();
}
tool._outerHeight(_312);
var _313=_30c(_30f.find("ul.tabs"));
var _314=_30f.width()-tool._outerWidth();
if(_313>_314){
_310.add(_311).show()._outerHeight(_312);
if(opts.toolPosition=="left"){
tool.css({left:_310.outerWidth(),right:""});
wrap.css({marginLeft:_310.outerWidth()+tool._outerWidth(),marginRight:_311._outerWidth(),width:_314-_310.outerWidth()-_311.outerWidth()});
}else{
tool.css({left:"",right:_311.outerWidth()});
wrap.css({marginLeft:_310.outerWidth(),marginRight:_311.outerWidth()+tool._outerWidth(),width:_314-_310.outerWidth()-_311.outerWidth()});
}
}else{
_310.add(_311).hide();
if(opts.toolPosition=="left"){
tool.css({left:0,right:""});
wrap.css({marginLeft:tool._outerWidth(),marginRight:0,width:_314});
}else{
tool.css({left:"",right:0});
wrap.css({marginLeft:0,marginRight:tool._outerWidth(),width:_314});
}
}
};
function _315(_316){
var opts=$.data(_316,"tabs").options;
var _317=$(_316).children("div.tabs-header");
if(opts.tools){
if(typeof opts.tools=="string"){
$(opts.tools).addClass("tabs-tool").appendTo(_317);
$(opts.tools).show();
}else{
_317.children("div.tabs-tool").remove();
var _318=$("<div class=\"tabs-tool\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"height:100%\"><tr></tr></table></div>").appendTo(_317);
var tr=_318.find("tr");
for(var i=0;i<opts.tools.length;i++){
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:void(0);\"></a>").appendTo(td);
tool[0].onclick=eval(opts.tools[i].handler||function(){
});
tool.linkbutton($.extend({},opts.tools[i],{plain:true}));
}
}
}else{
_317.children("div.tabs-tool").remove();
}
};
function _319(_31a,_31b){
var _31c=$.data(_31a,"tabs");
var opts=_31c.options;
var cc=$(_31a);
if(!opts.doSize){
return;
}
if(_31b){
$.extend(opts,{width:_31b.width,height:_31b.height});
}
cc._size(opts);
var _31d=cc.children("div.tabs-header");
var _31e=cc.children("div.tabs-panels");
var wrap=_31d.find("div.tabs-wrap");
var ul=wrap.find(".tabs");
ul.children("li").removeClass("tabs-first tabs-last");
ul.children("li:first").addClass("tabs-first");
ul.children("li:last").addClass("tabs-last");
if(opts.tabPosition=="left"||opts.tabPosition=="right"){
_31d._outerWidth(opts.showHeader?opts.headerWidth:0);
_31e._outerWidth(cc.width()-_31d.outerWidth());
_31d.add(_31e)._outerHeight(opts.height);
wrap._outerWidth(_31d.width());
ul._outerWidth(wrap.width()).css("height","");
}else{
_31d.children("div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool:not(.tabs-tool-hidden)").css("display",opts.showHeader?"block":"none");
_31d._outerWidth(cc.width()).css("height","");
if(opts.showHeader){
_31d.css("background-color","");
wrap.css("height","");
}else{
_31d.css("background-color","transparent");
_31d._outerHeight(0);
wrap._outerHeight(0);
}
ul._outerHeight(opts.tabHeight).css("width","");
ul._outerHeight(ul.outerHeight()-ul.height()-1+opts.tabHeight).css("width","");
_31e._size("height",isNaN(opts.height)?"":(opts.height-_31d.outerHeight()));
_31e._size("width",isNaN(opts.width)?"":opts.width);
}
if(_31c.tabs.length){
var d1=ul.outerWidth(true)-ul.width();
var li=ul.children("li:first");
var d2=li.outerWidth(true)-li.width();
var _31f=_31d.width()-_31d.children(".tabs-tool:not(.tabs-tool-hidden)")._outerWidth();
var _320=Math.floor((_31f-d1-d2*_31c.tabs.length)/_31c.tabs.length);
$.map(_31c.tabs,function(p){
_321(p,(opts.justified&&$.inArray(opts.tabPosition,["top","bottom"])>=0)?_320:undefined);
});
if(opts.justified&&$.inArray(opts.tabPosition,["top","bottom"])>=0){
var _322=_31f-d1-_30c(ul);
_321(_31c.tabs[_31c.tabs.length-1],_320+_322);
}
}
_30d(_31a);
function _321(p,_323){
var _324=p.panel("options");
var p_t=_324.tab.find("a.tabs-inner");
var _323=_323?_323:(parseInt(_324.tabWidth||opts.tabWidth||undefined));
if(_323){
p_t._outerWidth(_323);
}else{
p_t.css("width","");
}
p_t._outerHeight(opts.tabHeight);
p_t.css("lineHeight",p_t.height()+"px");
p_t.find(".ui-fluid:visible").triggerHandler("_resize");
};
};
function _325(_326){
var opts=$.data(_326,"tabs").options;
var tab=_327(_326);
if(tab){
var _328=$(_326).children("div.tabs-panels");
var _329=opts.width=="auto"?"auto":_328.width();
var _32a=opts.height=="auto"?"auto":_328.height();
tab.panel("resize",{width:_329,height:_32a});
}
};
function _32b(_32c){
var tabs=$.data(_32c,"tabs").tabs;
var cc=$(_32c).addClass("tabs-container");
var _32d=$("<div class=\"tabs-panels\"></div>").insertBefore(cc);
cc.children("div").each(function(){
_32d[0].appendChild(this);
});
cc[0].appendChild(_32d[0]);
$("<div class=\"tabs-header\">"+"<div class=\"tabs-scroller-left\"></div>"+"<div class=\"tabs-scroller-right\"></div>"+"<div class=\"tabs-wrap\">"+"<ul class=\"tabs\"></ul>"+"</div>"+"</div>").prependTo(_32c);
cc.children("div.tabs-panels").children("div").each(function(i){
var opts=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
_33a(_32c,opts,$(this));
});
cc.children("div.tabs-header").find(".tabs-scroller-left, .tabs-scroller-right").hover(function(){
$(this).addClass("tabs-scroller-over");
},function(){
$(this).removeClass("tabs-scroller-over");
});
cc.bind("_resize",function(e,_32e){
if($(this).hasClass("ui-fluid")||_32e){
_319(_32c);
_325(_32c);
}
return false;
});
};
function _32f(_330){
var _331=$.data(_330,"tabs");
var opts=_331.options;
$(_330).children("div.tabs-header").unbind().bind("click",function(e){
if($(e.target).hasClass("tabs-scroller-left")){
$(_330).tabs("scrollBy",-opts.scrollIncrement);
}else{
if($(e.target).hasClass("tabs-scroller-right")){
$(_330).tabs("scrollBy",opts.scrollIncrement);
}else{
var li=$(e.target).closest("li");
if(li.hasClass("tabs-disabled")){
return false;
}
var a=$(e.target).closest("a.tabs-close");
if(a.length){
_353(_330,_332(li));
}else{
if(li.length){
var _333=_332(li);
var _334=_331.tabs[_333].panel("options");
if(_334.collapsible){
_334.closed?_34a(_330,_333):_367(_330,_333);
}else{
_34a(_330,_333);
}
}
}
return false;
}
}
}).bind("contextmenu",function(e){
var li=$(e.target).closest("li");
if(li.hasClass("tabs-disabled")){
return;
}
if(li.length){
opts.onContextMenu.call(_330,e,li.find("span.tabs-title").html(),_332(li));
}
});
function _332(li){
var _335=0;
li.parent().children("li").each(function(i){
if(li[0]==this){
_335=i;
return false;
}
});
return _335;
};
};
function _336(_337){
var opts=$.data(_337,"tabs").options;
var _338=$(_337).children("div.tabs-header");
var _339=$(_337).children("div.tabs-panels");
_338.removeClass("tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right");
_339.removeClass("tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right");
if(opts.tabPosition=="top"){
_338.insertBefore(_339);
}else{
if(opts.tabPosition=="bottom"){
_338.insertAfter(_339);
_338.addClass("tabs-header-bottom");
_339.addClass("tabs-panels-top");
}else{
if(opts.tabPosition=="left"){
_338.addClass("tabs-header-left");
_339.addClass("tabs-panels-right");
}else{
if(opts.tabPosition=="right"){
_338.addClass("tabs-header-right");
_339.addClass("tabs-panels-left");
}
}
}
}
if(opts.plain==true){
_338.addClass("tabs-header-plain");
}else{
_338.removeClass("tabs-header-plain");
}
_338.removeClass("tabs-header-narrow").addClass(opts.narrow?"tabs-header-narrow":"");
var tabs=_338.find(".tabs");
tabs.removeClass("tabs-pill").addClass(opts.pill?"tabs-pill":"");
tabs.removeClass("tabs-narrow").addClass(opts.narrow?"tabs-narrow":"");
tabs.removeClass("tabs-justified").addClass(opts.justified?"tabs-justified":"");
if(opts.border==true){
_338.removeClass("tabs-header-noborder");
_339.removeClass("tabs-panels-noborder");
}else{
_338.addClass("tabs-header-noborder");
_339.addClass("tabs-panels-noborder");
}
opts.doSize=true;
};
function _33a(_33b,_33c,pp){
_33c=_33c||{};
var _33d=$.data(_33b,"tabs");
var tabs=_33d.tabs;
if(_33c.index==undefined||_33c.index>tabs.length){
_33c.index=tabs.length;
}
if(_33c.index<0){
_33c.index=0;
}
var ul=$(_33b).children("div.tabs-header").find("ul.tabs");
var _33e=$(_33b).children("div.tabs-panels");
var tab=$("<li>"+"<a href=\"javascript:void(0)\" class=\"tabs-inner\">"+"<span class=\"tabs-title\"></span>"+"<span class=\"tabs-icon\"></span>"+"</a>"+"</li>");
if(!pp){
pp=$("<div></div>");
}
if(_33c.index>=tabs.length){
tab.appendTo(ul);
pp.appendTo(_33e);
tabs.push(pp);
}else{
tab.insertBefore(ul.children("li:eq("+_33c.index+")"));
pp.insertBefore(_33e.children("div.panel:eq("+_33c.index+")"));
tabs.splice(_33c.index,0,pp);
}
pp.panel($.extend({},_33c,{tab:tab,border:false,noheader:true,closed:true,doSize:false,iconCls:(_33c.icon?_33c.icon:undefined),onLoad:function(){
if(_33c.onLoad){
_33c.onLoad.call(this,arguments);
}
_33d.options.onLoad.call(_33b,$(this));
},onBeforeOpen:function(){
if(_33c.onBeforeOpen){
if(_33c.onBeforeOpen.call(this)==false){
return false;
}
}
var p=$(_33b).tabs("getSelected");
if(p){
if(p[0]!=this){
$(_33b).tabs("unselect",_345(_33b,p));
p=$(_33b).tabs("getSelected");
if(p){
return false;
}
}else{
_325(_33b);
return false;
}
}
var _33f=$(this).panel("options");
_33f.tab.addClass("tabs-selected");
var wrap=$(_33b).find(">div.tabs-header>div.tabs-wrap");
var left=_33f.tab.position().left;
var _340=left+_33f.tab.outerWidth();
if(left<0||_340>wrap.width()){
var _341=left-(wrap.width()-_33f.tab.width())/2;
$(_33b).tabs("scrollBy",_341);
}else{
$(_33b).tabs("scrollBy",0);
}
var _342=$(this).panel("panel");
_342.css("display","block");
_325(_33b);
_342.css("display","none");
},onOpen:function(){
if(_33c.onOpen){
_33c.onOpen.call(this);
}
var _343=$(this).panel("options");
_33d.selectHis.push(_343.title);
_33d.options.onSelect.call(_33b,_343.title,_345(_33b,this));
},onBeforeClose:function(){
if(_33c.onBeforeClose){
if(_33c.onBeforeClose.call(this)==false){
return false;
}
}
$(this).panel("options").tab.removeClass("tabs-selected");
},onClose:function(){
if(_33c.onClose){
_33c.onClose.call(this);
}
var _344=$(this).panel("options");
_33d.options.onUnselect.call(_33b,_344.title,_345(_33b,this));
}}));
$(_33b).tabs("update",{tab:pp,options:pp.panel("options"),type:"header"});
};
function _346(_347,_348){
var _349=$.data(_347,"tabs");
var opts=_349.options;
if(_348.selected==undefined){
_348.selected=true;
}
_33a(_347,_348);
opts.onAdd.call(_347,_348.title,_348.index);
if(_348.selected){
_34a(_347,_348.index);
}
};
function _34b(_34c,_34d){
_34d.type=_34d.type||"all";
var _34e=$.data(_34c,"tabs").selectHis;
var pp=_34d.tab;
var opts=pp.panel("options");
var _34f=opts.title;
$.extend(opts,_34d.options,{iconCls:(_34d.options.icon?_34d.options.icon:undefined)});
if(_34d.type=="all"||_34d.type=="body"){
pp.panel();
}
if(_34d.type=="all"||_34d.type=="header"){
var tab=opts.tab;
if(opts.header){
tab.find(".tabs-inner").html($(opts.header));
}else{
var _350=tab.find("span.tabs-title");
var _351=tab.find("span.tabs-icon");
_350.html(opts.title);
_351.attr("class","tabs-icon");
tab.find("a.tabs-close").remove();
if(opts.closable){
_350.addClass("tabs-closable");
$("<a href=\"javascript:void(0)\" class=\"tabs-close\"></a>").appendTo(tab);
}else{
_350.removeClass("tabs-closable");
}
if(opts.iconCls){
_350.addClass("tabs-with-icon");
_351.addClass(opts.iconCls);
}else{
_350.removeClass("tabs-with-icon");
}
if(opts.tools){
var _352=tab.find("span.tabs-p-tool");
if(!_352.length){
var _352=$("<span class=\"tabs-p-tool\"></span>").insertAfter(tab.find("a.tabs-inner"));
}
if($.isArray(opts.tools)){
_352.empty();
for(var i=0;i<opts.tools.length;i++){
var t=$("<a href=\"javascript:void(0)\"></a>").appendTo(_352);
t.addClass(opts.tools[i].iconCls);
if(opts.tools[i].handler){
t.bind("click",{handler:opts.tools[i].handler},function(e){
if($(this).parents("li").hasClass("tabs-disabled")){
return;
}
e.data.handler.call(this);
});
}
}
}else{
$(opts.tools).children().appendTo(_352);
}
var pr=_352.children().length*12;
if(opts.closable){
pr+=8;
}else{
pr-=3;
_352.css("right","5px");
}
_350.css("padding-right",pr+"px");
}else{
tab.find("span.tabs-p-tool").remove();
_350.css("padding-right","");
}
}
if(_34f!=opts.title){
for(var i=0;i<_34e.length;i++){
if(_34e[i]==_34f){
_34e[i]=opts.title;
}
}
}
}
_319(_34c);
$.data(_34c,"tabs").options.onUpdate.call(_34c,opts.title,_345(_34c,pp));
};
function _353(_354,_355){
var opts=$.data(_354,"tabs").options;
var tabs=$.data(_354,"tabs").tabs;
var _356=$.data(_354,"tabs").selectHis;
if(!_357(_354,_355)){
return;
}
var tab=_358(_354,_355);
var _359=tab.panel("options").title;
var _35a=_345(_354,tab);
if(opts.onBeforeClose.call(_354,_359,_35a)==false){
return;
}
var tab=_358(_354,_355,true);
tab.panel("options").tab.remove();
tab.panel("destroy");
opts.onClose.call(_354,_359,_35a);
_319(_354);
for(var i=0;i<_356.length;i++){
if(_356[i]==_359){
_356.splice(i,1);
i--;
}
}
var _35b=_356.pop();
if(_35b){
_34a(_354,_35b);
}else{
if(tabs.length){
_34a(_354,0);
}
}
};
function _358(_35c,_35d,_35e){
var tabs=$.data(_35c,"tabs").tabs;
if(typeof _35d=="number"){
if(_35d<0||_35d>=tabs.length){
return null;
}else{
var tab=tabs[_35d];
if(_35e){
tabs.splice(_35d,1);
}
return tab;
}
}
for(var i=0;i<tabs.length;i++){
var tab=tabs[i];
if(tab.panel("options").title==_35d){
if(_35e){
tabs.splice(i,1);
}
return tab;
}
}
return null;
};
function _345(_35f,tab){
var tabs=$.data(_35f,"tabs").tabs;
for(var i=0;i<tabs.length;i++){
if(tabs[i][0]==$(tab)[0]){
return i;
}
}
return -1;
};
function _327(_360){
var tabs=$.data(_360,"tabs").tabs;
for(var i=0;i<tabs.length;i++){
var tab=tabs[i];
if(tab.panel("options").tab.hasClass("tabs-selected")){
return tab;
}
}
return null;
};
function _361(_362){
var _363=$.data(_362,"tabs");
var tabs=_363.tabs;
for(var i=0;i<tabs.length;i++){
if(tabs[i].panel("options").selected){
_34a(_362,i);
return;
}
}
_34a(_362,_363.options.selected);
};
function _34a(_364,_365){
var p=_358(_364,_365);
if(p&&!p.is(":visible")){
_366(_364);
p.panel("open");
}
};
function _367(_368,_369){
var p=_358(_368,_369);
if(p&&p.is(":visible")){
_366(_368);
p.panel("close");
}
};
function _366(_36a){
$(_36a).children("div.tabs-panels").each(function(){
$(this).stop(true,true);
});
};
function _357(_36b,_36c){
return _358(_36b,_36c)!=null;
};
function _36d(_36e,_36f){
var opts=$.data(_36e,"tabs").options;
opts.showHeader=_36f;
$(_36e).tabs("resize");
};
function _370(_371,_372){
var tool=$(_371).find(">.tabs-header>.tabs-tool");
if(_372){
tool.removeClass("tabs-tool-hidden").show();
}else{
tool.addClass("tabs-tool-hidden").hide();
}
$(_371).tabs("resize").tabs("scrollBy",0);
};
$.fn.tabs=function(_373,_374){
if(typeof _373=="string"){
return $.fn.tabs.methods[_373](this,_374);
}
_373=_373||{};
return this.each(function(){
var _375=$.data(this,"tabs");
if(_375){
$.extend(_375.options,_373);
}else{
$.data(this,"tabs",{options:$.extend({},$.fn.tabs.defaults,$.fn.tabs.parseOptions(this),_373),tabs:[],selectHis:[]});
_32b(this);
}
_315(this);
_336(this);
_319(this);
_32f(this);
_361(this);
});
};
$.fn.tabs.methods={options:function(jq){
var cc=jq[0];
var opts=$.data(cc,"tabs").options;
var s=_327(cc);
opts.selected=s?_345(cc,s):-1;
return opts;
},tabs:function(jq){
return $.data(jq[0],"tabs").tabs;
},resize:function(jq,_376){
return jq.each(function(){
_319(this,_376);
_325(this);
});
},add:function(jq,_377){
return jq.each(function(){
_346(this,_377);
});
},close:function(jq,_378){
return jq.each(function(){
_353(this,_378);
});
},getTab:function(jq,_379){
return _358(jq[0],_379);
},getTabIndex:function(jq,tab){
return _345(jq[0],tab);
},getSelected:function(jq){
return _327(jq[0]);
},select:function(jq,_37a){
return jq.each(function(){
_34a(this,_37a);
});
},unselect:function(jq,_37b){
return jq.each(function(){
_367(this,_37b);
});
},exists:function(jq,_37c){
return _357(jq[0],_37c);
},update:function(jq,_37d){
return jq.each(function(){
_34b(this,_37d);
});
},enableTab:function(jq,_37e){
return jq.each(function(){
$(this).tabs("getTab",_37e).panel("options").tab.removeClass("tabs-disabled");
});
},disableTab:function(jq,_37f){
return jq.each(function(){
$(this).tabs("getTab",_37f).panel("options").tab.addClass("tabs-disabled");
});
},showHeader:function(jq){
return jq.each(function(){
_36d(this,true);
});
},hideHeader:function(jq){
return jq.each(function(){
_36d(this,false);
});
},showTool:function(jq){
return jq.each(function(){
_370(this,true);
});
},hideTool:function(jq){
return jq.each(function(){
_370(this,false);
});
},scrollBy:function(jq,_380){
return jq.each(function(){
var opts=$(this).tabs("options");
var wrap=$(this).find(">div.tabs-header>div.tabs-wrap");
var pos=Math.min(wrap._scrollLeft()+_380,_381());
wrap.animate({scrollLeft:pos},opts.scrollDuration);
function _381(){
var w=0;
var ul=wrap.children("ul");
ul.children("li").each(function(){
w+=$(this).outerWidth(true);
});
return w-wrap.width()+(ul.outerWidth()-ul.width());
};
});
}};
$.fn.tabs.parseOptions=function(_382){
return $.extend({},$.parser.parseOptions(_382,["tools","toolPosition","tabPosition",{fit:"boolean",border:"boolean",plain:"boolean"},{headerWidth:"number",tabWidth:"number",tabHeight:"number",selected:"number"},{showHeader:"boolean",justified:"boolean",narrow:"boolean",pill:"boolean"}]));
};
$.fn.tabs.defaults={width:"auto",height:"auto",headerWidth:150,tabWidth:"auto",tabHeight:27,selected:0,showHeader:true,plain:false,fit:false,border:true,justified:false,narrow:false,pill:false,tools:null,toolPosition:"right",tabPosition:"top",scrollIncrement:100,scrollDuration:400,onLoad:function(_383){
},onSelect:function(_384,_385){
},onUnselect:function(_386,_387){
},onBeforeClose:function(_388,_389){
},onClose:function(_38a,_38b){
},onAdd:function(_38c,_38d){
},onUpdate:function(_38e,_38f){
},onContextMenu:function(e,_390,_391){
}};
})(jQuery);
(function($){
var _392=false;
function _393(_394,_395){
var _396=$.data(_394,"layout");
var opts=_396.options;
var _397=_396.panels;
var cc=$(_394);
if(_395){
$.extend(opts,{width:_395.width,height:_395.height});
}
if(_394.tagName.toLowerCase()=="body"){
cc._size("fit");
}else{
cc._size(opts);
}
var cpos={top:0,left:0,width:cc.width(),height:cc.height()};
_398(_399(_397.expandNorth)?_397.expandNorth:_397.north,"n");
_398(_399(_397.expandSouth)?_397.expandSouth:_397.south,"s");
_39a(_399(_397.expandEast)?_397.expandEast:_397.east,"e");
_39a(_399(_397.expandWest)?_397.expandWest:_397.west,"w");
_397.center.panel("resize",cpos);
function _398(pp,type){
if(!pp.length||!_399(pp)){
return;
}
var opts=pp.panel("options");
pp.panel("resize",{width:cc.width(),height:opts.height});
var _39b=pp.panel("panel").outerHeight();
pp.panel("move",{left:0,top:(type=="n"?0:cc.height()-_39b)});
cpos.height-=_39b;
if(type=="n"){
cpos.top+=_39b;
if(!opts.split&&opts.border){
cpos.top--;
}
}
if(!opts.split&&opts.border){
cpos.height++;
}
};
function _39a(pp,type){
if(!pp.length||!_399(pp)){
return;
}
var opts=pp.panel("options");
pp.panel("resize",{width:opts.width,height:cpos.height});
var _39c=pp.panel("panel").outerWidth();
pp.panel("move",{left:(type=="e"?cc.width()-_39c:0),top:cpos.top});
cpos.width-=_39c;
if(type=="w"){
cpos.left+=_39c;
if(!opts.split&&opts.border){
cpos.left--;
}
}
if(!opts.split&&opts.border){
cpos.width++;
}
};
};
function init(_39d){
var cc=$(_39d);
cc.addClass("layout");
function _39e(cc){
cc.children("div").each(function(){
var opts=$.fn.layout.parsePanelOptions(this);
if("north,south,east,west,center".indexOf(opts.region)>=0){
_3a0(_39d,opts,this);
}
});
};
cc.children("form").length?_39e(cc.children("form")):_39e(cc);
cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
cc.bind("_resize",function(e,_39f){
if($(this).hasClass("ui-fluid")||_39f){
_393(_39d);
}
return false;
});
};
function _3a0(_3a1,_3a2,el){
_3a2.region=_3a2.region||"center";
var _3a3=$.data(_3a1,"layout").panels;
var cc=$(_3a1);
var dir=_3a2.region;
if(_3a3[dir].length){
return;
}
var pp=$(el);
if(!pp.length){
pp=$("<div></div>").appendTo(cc);
}
var _3a4=$.extend({},$.fn.layout.paneldefaults,{width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),doSize:false,collapsible:true,onOpen:function(){
var tool=$(this).panel("header").children("div.panel-tool");
tool.children("a.panel-tool-collapse").hide();
var _3a5={north:"up",south:"down",east:"right",west:"left"};
if(!_3a5[dir]){
return;
}
var _3a6="layout-button-"+_3a5[dir];
var t=tool.children("a."+_3a6);
if(!t.length){
t=$("<a href=\"javascript:void(0)\"></a>").addClass(_3a6).appendTo(tool);
t.bind("click",{dir:dir},function(e){
_3b2(_3a1,e.data.dir);
return false;
});
}
$(this).panel("options").collapsible?t.show():t.hide();
}},_3a2,{cls:((_3a2.cls||"")+" layout-panel layout-panel-"+dir),bodyCls:((_3a2.bodyCls||"")+" layout-body")});
pp.panel(_3a4);
_3a3[dir]=pp;
var _3a7={north:"s",south:"n",east:"w",west:"e"};
var _3a8=pp.panel("panel");
if(pp.panel("options").split){
_3a8.addClass("layout-split-"+dir);
}
_3a8.resizable($.extend({},{handles:(_3a7[dir]||""),disabled:(!pp.panel("options").split),onStartResize:function(e){
_392=true;
if(dir=="north"||dir=="south"){
var _3a9=$(">div.layout-split-proxy-v",_3a1);
}else{
var _3a9=$(">div.layout-split-proxy-h",_3a1);
}
var top=0,left=0,_3aa=0,_3ab=0;
var pos={display:"block"};
if(dir=="north"){
pos.top=parseInt(_3a8.css("top"))+_3a8.outerHeight()-_3a9.height();
pos.left=parseInt(_3a8.css("left"));
pos.width=_3a8.outerWidth();
pos.height=_3a9.height();
}else{
if(dir=="south"){
pos.top=parseInt(_3a8.css("top"));
pos.left=parseInt(_3a8.css("left"));
pos.width=_3a8.outerWidth();
pos.height=_3a9.height();
}else{
if(dir=="east"){
pos.top=parseInt(_3a8.css("top"))||0;
pos.left=parseInt(_3a8.css("left"))||0;
pos.width=_3a9.width();
pos.height=_3a8.outerHeight();
}else{
if(dir=="west"){
pos.top=parseInt(_3a8.css("top"))||0;
pos.left=_3a8.outerWidth()-_3a9.width();
pos.width=_3a9.width();
pos.height=_3a8.outerHeight();
}
}
}
}
_3a9.css(pos);
$("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
},onResize:function(e){
if(dir=="north"||dir=="south"){
var _3ac=$(">div.layout-split-proxy-v",_3a1);
_3ac.css("top",e.pageY-$(_3a1).offset().top-_3ac.height()/2);
}else{
var _3ac=$(">div.layout-split-proxy-h",_3a1);
_3ac.css("left",e.pageX-$(_3a1).offset().left-_3ac.width()/2);
}
return false;
},onStopResize:function(e){
cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
pp.panel("resize",e.data);
_393(_3a1);
_392=false;
cc.find(">div.layout-mask").remove();
}},_3a2));
};
function _3ad(_3ae,_3af){
var _3b0=$.data(_3ae,"layout").panels;
if(_3b0[_3af].length){
_3b0[_3af].panel("destroy");
_3b0[_3af]=$();
var _3b1="expand"+_3af.substring(0,1).toUpperCase()+_3af.substring(1);
if(_3b0[_3b1]){
_3b0[_3b1].panel("destroy");
_3b0[_3b1]=undefined;
}
}
};
function _3b2(_3b3,_3b4,_3b5){
if(_3b5==undefined){
_3b5="normal";
}
var _3b6=$.data(_3b3,"layout").panels;
var p=_3b6[_3b4];
var _3b7=p.panel("options");
if(_3b7.onBeforeCollapse.call(p)==false){
return;
}
var _3b8="expand"+_3b4.substring(0,1).toUpperCase()+_3b4.substring(1);
if(!_3b6[_3b8]){
_3b6[_3b8]=_3b9(_3b4);
_3b6[_3b8].panel("panel").bind("click",function(){
p.panel("expand",false).panel("open");
var _3ba=_3bb();
p.panel("resize",_3ba.collapse);
p.panel("panel").animate(_3ba.expand,function(){
$(this).unbind(".layout").bind("mouseleave.layout",{region:_3b4},function(e){
if(_392==true){
return;
}
if($("body>div.combo-p>div.combo-panel:visible").length){
return;
}
_3b2(_3b3,e.data.region);
});
});
return false;
});
}
var _3bc=_3bb();
if(!_399(_3b6[_3b8])){
_3b6.center.panel("resize",_3bc.resizeC);
}
p.panel("panel").animate(_3bc.collapse,_3b5,function(){
p.panel("collapse",false).panel("close");
_3b6[_3b8].panel("open").panel("resize",_3bc.expandP);
$(this).unbind(".layout");
});
function _3b9(dir){
var icon;
if(dir=="east"){
icon="layout-button-left";
}else{
if(dir=="west"){
icon="layout-button-right";
}else{
if(dir=="north"){
icon="layout-button-down";
}else{
if(dir=="south"){
icon="layout-button-up";
}
}
}
}
var p=$("<div></div>").appendTo(_3b3);
p.panel($.extend({},$.fn.layout.paneldefaults,{cls:("layout-expand layout-expand-"+dir),title:"&nbsp;",closed:true,minWidth:0,minHeight:0,doSize:false,tools:[{iconCls:icon,handler:function(){
_3c2(_3b3,_3b4);
return false;
}}]}));
p.panel("panel").hover(function(){
$(this).addClass("layout-expand-over");
},function(){
$(this).removeClass("layout-expand-over");
});
return p;
};
function _3bb(){
var cc=$(_3b3);
var _3bd=_3b6.center.panel("options");
var _3be=_3b7.collapsedSize;
if(_3b4=="east"){
var _3bf=p.panel("panel")._outerWidth();
var _3c0=_3bd.width+_3bf-_3be;
if(_3b7.split||!_3b7.border){
_3c0++;
}
return {resizeC:{width:_3c0},expand:{left:cc.width()-_3bf},expandP:{top:_3bd.top,left:cc.width()-_3be,width:_3be,height:_3bd.height},collapse:{left:cc.width(),top:_3bd.top,height:_3bd.height}};
}else{
if(_3b4=="west"){
var _3bf=p.panel("panel")._outerWidth();
var _3c0=_3bd.width+_3bf-_3be;
if(_3b7.split||!_3b7.border){
_3c0++;
}
return {resizeC:{width:_3c0,left:_3be-1},expand:{left:0},expandP:{left:0,top:_3bd.top,width:_3be,height:_3bd.height},collapse:{left:-_3bf,top:_3bd.top,height:_3bd.height}};
}else{
if(_3b4=="north"){
var _3c1=p.panel("panel")._outerHeight();
var hh=_3bd.height;
if(!_399(_3b6.expandNorth)){
hh+=_3c1-_3be+((_3b7.split||!_3b7.border)?1:0);
}
_3b6.east.add(_3b6.west).add(_3b6.expandEast).add(_3b6.expandWest).panel("resize",{top:_3be-1,height:hh});
return {resizeC:{top:_3be-1,height:hh},expand:{top:0},expandP:{top:0,left:0,width:cc.width(),height:_3be},collapse:{top:-_3c1,width:cc.width()}};
}else{
if(_3b4=="south"){
var _3c1=p.panel("panel")._outerHeight();
var hh=_3bd.height;
if(!_399(_3b6.expandSouth)){
hh+=_3c1-_3be+((_3b7.split||!_3b7.border)?1:0);
}
_3b6.east.add(_3b6.west).add(_3b6.expandEast).add(_3b6.expandWest).panel("resize",{height:hh});
return {resizeC:{height:hh},expand:{top:cc.height()-_3c1},expandP:{top:cc.height()-_3be,left:0,width:cc.width(),height:_3be},collapse:{top:cc.height(),width:cc.width()}};
}
}
}
}
};
};
function _3c2(_3c3,_3c4){
var _3c5=$.data(_3c3,"layout").panels;
var p=_3c5[_3c4];
var _3c6=p.panel("options");
if(_3c6.onBeforeExpand.call(p)==false){
return;
}
var _3c7="expand"+_3c4.substring(0,1).toUpperCase()+_3c4.substring(1);
if(_3c5[_3c7]){
_3c5[_3c7].panel("close");
p.panel("panel").stop(true,true);
p.panel("expand",false).panel("open");
var _3c8=_3c9();
p.panel("resize",_3c8.collapse);
p.panel("panel").animate(_3c8.expand,function(){
_393(_3c3);
});
}
function _3c9(){
var cc=$(_3c3);
var _3ca=_3c5.center.panel("options");
if(_3c4=="east"&&_3c5.expandEast){
return {collapse:{left:cc.width(),top:_3ca.top,height:_3ca.height},expand:{left:cc.width()-p.panel("panel")._outerWidth()}};
}else{
if(_3c4=="west"&&_3c5.expandWest){
return {collapse:{left:-p.panel("panel")._outerWidth(),top:_3ca.top,height:_3ca.height},expand:{left:0}};
}else{
if(_3c4=="north"&&_3c5.expandNorth){
return {collapse:{top:-p.panel("panel")._outerHeight(),width:cc.width()},expand:{top:0}};
}else{
if(_3c4=="south"&&_3c5.expandSouth){
return {collapse:{top:cc.height(),width:cc.width()},expand:{top:cc.height()-p.panel("panel")._outerHeight()}};
}
}
}
}
};
};
function _399(pp){
if(!pp){
return false;
}
if(pp.length){
return pp.panel("panel").is(":visible");
}else{
return false;
}
};
function _3cb(_3cc){
var _3cd=$.data(_3cc,"layout").panels;
_3ce("east");
_3ce("west");
_3ce("north");
_3ce("south");
function _3ce(_3cf){
var p=_3cd[_3cf];
if(p.length&&p.panel("options").collapsed){
_3b2(_3cc,_3cf,0);
}
};
};
function _3d0(_3d1,_3d2,_3d3){
var p=$(_3d1).layout("panel",_3d2);
p.panel("options").split=_3d3;
var cls="layout-split-"+_3d2;
var _3d4=p.panel("panel").removeClass(cls);
if(_3d3){
_3d4.addClass(cls);
}
_3d4.resizable({disabled:(!_3d3)});
_393(_3d1);
};
$.fn.layout=function(_3d5,_3d6){
if(typeof _3d5=="string"){
return $.fn.layout.methods[_3d5](this,_3d6);
}
_3d5=_3d5||{};
return this.each(function(){
var _3d7=$.data(this,"layout");
if(_3d7){
$.extend(_3d7.options,_3d5);
}else{
var opts=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),_3d5);
$.data(this,"layout",{options:opts,panels:{center:$(),north:$(),south:$(),east:$(),west:$()}});
init(this);
}
_393(this);
_3cb(this);
});
};
$.fn.layout.methods={options:function(jq){
return $.data(jq[0],"layout").options;
},resize:function(jq,_3d8){
return jq.each(function(){
_393(this,_3d8);
});
},panel:function(jq,_3d9){
return $.data(jq[0],"layout").panels[_3d9];
},collapse:function(jq,_3da){
return jq.each(function(){
_3b2(this,_3da);
});
},expand:function(jq,_3db){
return jq.each(function(){
_3c2(this,_3db);
});
},add:function(jq,_3dc){
return jq.each(function(){
_3a0(this,_3dc);
_393(this);
if($(this).layout("panel",_3dc.region).panel("options").collapsed){
_3b2(this,_3dc.region,0);
}
});
},remove:function(jq,_3dd){
return jq.each(function(){
_3ad(this,_3dd);
_393(this);
});
},split:function(jq,_3de){
return jq.each(function(){
_3d0(this,_3de,true);
});
},unsplit:function(jq,_3df){
return jq.each(function(){
_3d0(this,_3df,false);
});
}};
$.fn.layout.parseOptions=function(_3e0){
return $.extend({},$.parser.parseOptions(_3e0,[{fit:"boolean"}]));
};
$.fn.layout.defaults={fit:false};
$.fn.layout.parsePanelOptions=function(_3e1){
var t=$(_3e1);
return $.extend({},$.fn.panel.parseOptions(_3e1),$.parser.parseOptions(_3e1,["region",{split:"boolean",collpasedSize:"number",minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number"}]));
};
$.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{region:null,split:false,collapsedSize:28,minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000});
})(jQuery);
(function($){
$(function(){
$(document).unbind(".menu").bind("mousedown.menu",function(e){
var m=$(e.target).closest("div.menu,div.combo-p");
if(m.length){
return;
}
$("body>div.menu-top:visible").not(".menu-inline").menu("hide");
_3e2($("body>div.menu:visible").not(".menu-inline"));
});
});
function init(_3e3){
var opts=$.data(_3e3,"menu").options;
$(_3e3).addClass("menu-top");
opts.inline?$(_3e3).addClass("menu-inline"):$(_3e3).appendTo("body");
$(_3e3).bind("_resize",function(e,_3e4){
if($(this).hasClass("ui-fluid")||_3e4){
$(_3e3).menu("resize",_3e3);
}
return false;
});
var _3e5=_3e6($(_3e3));
for(var i=0;i<_3e5.length;i++){
_3e7(_3e5[i]);
}
function _3e6(menu){
var _3e8=[];
menu.addClass("menu");
_3e8.push(menu);
if(!menu.hasClass("menu-content")){
menu.children("div").each(function(){
var _3e9=$(this).children("div");
if(_3e9.length){
_3e9.appendTo("body");
this.submenu=_3e9;
var mm=_3e6(_3e9);
_3e8=_3e8.concat(mm);
}
});
}
return _3e8;
};
function _3e7(menu){
var wh=$.parser.parseOptions(menu[0],["width","height"]);
menu[0].originalHeight=wh.height||0;
if(menu.hasClass("menu-content")){
menu[0].originalWidth=wh.width||menu._outerWidth();
}else{
menu[0].originalWidth=wh.width||0;
menu.children("div").each(function(){
var item=$(this);
var _3ea=$.extend({},$.parser.parseOptions(this,["name","iconCls","href",{separator:"boolean"}]),{disabled:(item.attr("disabled")?true:undefined)});
if(_3ea.separator){
item.addClass("menu-sep");
}
if(!item.hasClass("menu-sep")){
item[0].itemName=_3ea.name||"";
item[0].itemHref=_3ea.href||"";
var text=item.addClass("menu-item").html();
item.empty().append($("<div class=\"menu-text\"></div>").html(text));
if(_3ea.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_3ea.iconCls).appendTo(item);
}
if(_3ea.disabled){
_3eb(_3e3,item[0],true);
}
if(item[0].submenu){
$("<div class=\"menu-rightarrow\"></div>").appendTo(item);
}
_3ec(_3e3,item);
}
});
$("<div class=\"menu-line\"></div>").prependTo(menu);
}
_3ed(_3e3,menu);
if(!menu.hasClass("menu-inline")){
menu.hide();
}
_3ee(_3e3,menu);
};
};
function _3ed(_3ef,menu){
var opts=$.data(_3ef,"menu").options;
var _3f0=menu.attr("style")||"";
menu.css({display:"block",left:-10000,height:"auto",overflow:"hidden"});
menu.find(".menu-item").each(function(){
$(this)._outerHeight(opts.itemHeight);
$(this).find(".menu-text").css({height:(opts.itemHeight-2)+"px",lineHeight:(opts.itemHeight-2)+"px"});
});
menu.removeClass("menu-noline").addClass(opts.noline?"menu-noline":"");
var _3f1=menu[0].originalWidth||"auto";
if(isNaN(parseInt(_3f1))){
_3f1=0;
menu.find("div.menu-text").each(function(){
if(_3f1<$(this)._outerWidth()){
_3f1=$(this)._outerWidth();
}
});
_3f1+=40;
}
var _3f2=menu.outerHeight();
var _3f3=menu[0].originalHeight||"auto";
if(isNaN(parseInt(_3f3))){
_3f3=_3f2;
if(menu.hasClass("menu-top")&&opts.alignTo){
var at=$(opts.alignTo);
var h1=at.offset().top-$(document).scrollTop();
var h2=$(window)._outerHeight()+$(document).scrollTop()-at.offset().top-at._outerHeight();
_3f3=Math.min(_3f3,Math.max(h1,h2));
}else{
if(_3f3>$(window)._outerHeight()){
_3f3=$(window).height();
}
}
}
menu.attr("style",_3f0);
menu._size({fit:(menu[0]==_3ef?opts.fit:false),width:_3f1,minWidth:opts.minWidth,height:_3f3});
menu.css("overflow",menu.outerHeight()<_3f2?"auto":"hidden");
menu.children("div.menu-line")._outerHeight(_3f2-2);
};
function _3ee(_3f4,menu){
if(menu.hasClass("menu-inline")){
return;
}
var _3f5=$.data(_3f4,"menu");
menu.unbind(".menu").bind("mouseenter.menu",function(){
if(_3f5.timer){
clearTimeout(_3f5.timer);
_3f5.timer=null;
}
}).bind("mouseleave.menu",function(){
if(_3f5.options.hideOnUnhover){
_3f5.timer=setTimeout(function(){
_3f6(_3f4,$(_3f4).hasClass("menu-inline"));
},_3f5.options.duration);
}
});
};
function _3ec(_3f7,item){
if(!item.hasClass("menu-item")){
return;
}
item.unbind(".menu");
item.bind("click.menu",function(){
if($(this).hasClass("menu-item-disabled")){
return;
}
if(!this.submenu){
_3f6(_3f7,$(_3f7).hasClass("menu-inline"));
var href=this.itemHref;
if(href){
location.href=href;
}
}
$(this).trigger("mouseenter");
var item=$(_3f7).menu("getItem",this);
$.data(_3f7,"menu").options.onClick.call(_3f7,item);
}).bind("mouseenter.menu",function(e){
item.siblings().each(function(){
if(this.submenu){
_3e2(this.submenu);
}
$(this).removeClass("menu-active");
});
item.addClass("menu-active");
if($(this).hasClass("menu-item-disabled")){
item.addClass("menu-active-disabled");
return;
}
var _3f8=item[0].submenu;
if(_3f8){
$(_3f7).menu("show",{menu:_3f8,parent:item});
}
}).bind("mouseleave.menu",function(e){
item.removeClass("menu-active menu-active-disabled");
var _3f9=item[0].submenu;
if(_3f9){
if(e.pageX>=parseInt(_3f9.css("left"))){
item.addClass("menu-active");
}else{
_3e2(_3f9);
}
}else{
item.removeClass("menu-active");
}
});
};
function _3f6(_3fa,_3fb){
var _3fc=$.data(_3fa,"menu");
if(_3fc){
if($(_3fa).is(":visible")){
_3e2($(_3fa));
if(_3fb){
$(_3fa).show();
}else{
_3fc.options.onHide.call(_3fa);
}
}
}
return false;
};
function _3fd(_3fe,_3ff){
var left,top;
_3ff=_3ff||{};
var menu=$(_3ff.menu||_3fe);
$(_3fe).menu("resize",menu[0]);
if(menu.hasClass("menu-top")){
var opts=$.data(_3fe,"menu").options;
$.extend(opts,_3ff);
left=opts.left;
top=opts.top;
if(opts.alignTo){
var at=$(opts.alignTo);
left=at.offset().left;
top=at.offset().top+at._outerHeight();
if(opts.align=="right"){
left+=at.outerWidth()-menu.outerWidth();
}
}
if(left+menu.outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
left=$(window)._outerWidth()+$(document).scrollLeft()-menu.outerWidth()-5;
}
if(left<0){
left=0;
}
top=_400(top,opts.alignTo);
}else{
var _401=_3ff.parent;
left=_401.offset().left+_401.outerWidth()-2;
if(left+menu.outerWidth()+5>$(window)._outerWidth()+$(document).scrollLeft()){
left=_401.offset().left-menu.outerWidth()+2;
}
top=_400(_401.offset().top-3);
}
function _400(top,_402){
if(top+menu.outerHeight()>$(window)._outerHeight()+$(document).scrollTop()){
if(_402){
top=$(_402).offset().top-menu._outerHeight();
}else{
top=$(window)._outerHeight()+$(document).scrollTop()-menu.outerHeight();
}
}
if(top<0){
top=0;
}
return top;
};
menu.css({left:left,top:top});
menu.show(0,function(){
if(!menu[0].shadow){
menu[0].shadow=$("<div class=\"menu-shadow\"></div>").insertAfter(menu);
}
menu[0].shadow.css({display:(menu.hasClass("menu-inline")?"none":"block"),zIndex:$.fn.menu.defaults.zIndex++,left:menu.css("left"),top:menu.css("top"),width:menu.outerWidth(),height:menu.outerHeight()});
menu.css("z-index",$.fn.menu.defaults.zIndex++);
if(menu.hasClass("menu-top")){
$.data(menu[0],"menu").options.onShow.call(menu[0]);
}
});
};
function _3e2(menu){
if(menu&&menu.length){
_403(menu);
menu.find("div.menu-item").each(function(){
if(this.submenu){
_3e2(this.submenu);
}
$(this).removeClass("menu-active");
});
}
function _403(m){
m.stop(true,true);
if(m[0].shadow){
m[0].shadow.hide();
}
m.hide();
};
};
function _404(_405,text){
var _406=null;
var tmp=$("<div></div>");
function find(menu){
menu.children("div.menu-item").each(function(){
var item=$(_405).menu("getItem",this);
var s=tmp.empty().html(item.text).text();
if(text==$.trim(s)){
_406=item;
}else{
if(this.submenu&&!_406){
find(this.submenu);
}
}
});
};
find($(_405));
tmp.remove();
return _406;
};
function _3eb(_407,_408,_409){
var t=$(_408);
if(!t.hasClass("menu-item")){
return;
}
if(_409){
t.addClass("menu-item-disabled");
if(_408.onclick){
_408.onclick1=_408.onclick;
_408.onclick=null;
}
}else{
t.removeClass("menu-item-disabled");
if(_408.onclick1){
_408.onclick=_408.onclick1;
_408.onclick1=null;
}
}
};
function _40a(_40b,_40c){
var opts=$.data(_40b,"menu").options;
var menu=$(_40b);
if(_40c.parent){
if(!_40c.parent.submenu){
var _40d=$("<div class=\"menu\"><div class=\"menu-line\"></div></div>").appendTo("body");
_40d.hide();
_40c.parent.submenu=_40d;
$("<div class=\"menu-rightarrow\"></div>").appendTo(_40c.parent);
}
menu=_40c.parent.submenu;
}
if(_40c.separator){
var item=$("<div class=\"menu-sep\"></div>").appendTo(menu);
}else{
var item=$("<div class=\"menu-item\"></div>").appendTo(menu);
$("<div class=\"menu-text\"></div>").html(_40c.text).appendTo(item);
}
if(_40c.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_40c.iconCls).appendTo(item);
}
if(_40c.id){
item.attr("id",_40c.id);
}
if(_40c.name){
item[0].itemName=_40c.name;
}
if(_40c.href){
item[0].itemHref=_40c.href;
}
if(_40c.onclick){
if(typeof _40c.onclick=="string"){
item.attr("onclick",_40c.onclick);
}else{
item[0].onclick=eval(_40c.onclick);
}
}
if(_40c.handler){
item[0].onclick=eval(_40c.handler);
}
if(_40c.disabled){
_3eb(_40b,item[0],true);
}
_3ec(_40b,item);
_3ee(_40b,menu);
_3ed(_40b,menu);
};
function _40e(_40f,_410){
function _411(el){
if(el.submenu){
el.submenu.children("div.menu-item").each(function(){
_411(this);
});
var _412=el.submenu[0].shadow;
if(_412){
_412.remove();
}
el.submenu.remove();
}
$(el).remove();
};
var menu=$(_410).parent();
_411(_410);
_3ed(_40f,menu);
};
function _413(_414,_415,_416){
var menu=$(_415).parent();
if(_416){
$(_415).show();
}else{
$(_415).hide();
}
_3ed(_414,menu);
};
function _417(_418){
$(_418).children("div.menu-item").each(function(){
_40e(_418,this);
});
if(_418.shadow){
_418.shadow.remove();
}
$(_418).remove();
};
$.fn.menu=function(_419,_41a){
if(typeof _419=="string"){
return $.fn.menu.methods[_419](this,_41a);
}
_419=_419||{};
return this.each(function(){
var _41b=$.data(this,"menu");
if(_41b){
$.extend(_41b.options,_419);
}else{
_41b=$.data(this,"menu",{options:$.extend({},$.fn.menu.defaults,$.fn.menu.parseOptions(this),_419)});
init(this);
}
$(this).css({left:_41b.options.left,top:_41b.options.top});
});
};
$.fn.menu.methods={options:function(jq){
return $.data(jq[0],"menu").options;
},show:function(jq,pos){
return jq.each(function(){
_3fd(this,pos);
});
},hide:function(jq){
return jq.each(function(){
_3f6(this);
});
},destroy:function(jq){
return jq.each(function(){
_417(this);
});
},setText:function(jq,_41c){
return jq.each(function(){
$(_41c.target).children("div.menu-text").html(_41c.text);
});
},setIcon:function(jq,_41d){
return jq.each(function(){
$(_41d.target).children("div.menu-icon").remove();
if(_41d.iconCls){
$("<div class=\"menu-icon\"></div>").addClass(_41d.iconCls).appendTo(_41d.target);
}
});
},getItem:function(jq,_41e){
var t=$(_41e);
var item={target:_41e,id:t.attr("id"),text:$.trim(t.children("div.menu-text").html()),disabled:t.hasClass("menu-item-disabled"),name:_41e.itemName,href:_41e.itemHref,onclick:_41e.onclick};
var icon=t.children("div.menu-icon");
if(icon.length){
var cc=[];
var aa=icon.attr("class").split(" ");
for(var i=0;i<aa.length;i++){
if(aa[i]!="menu-icon"){
cc.push(aa[i]);
}
}
item.iconCls=cc.join(" ");
}
return item;
},findItem:function(jq,text){
return _404(jq[0],text);
},appendItem:function(jq,_41f){
return jq.each(function(){
_40a(this,_41f);
});
},removeItem:function(jq,_420){
return jq.each(function(){
_40e(this,_420);
});
},enableItem:function(jq,_421){
return jq.each(function(){
_3eb(this,_421,false);
});
},disableItem:function(jq,_422){
return jq.each(function(){
_3eb(this,_422,true);
});
},showItem:function(jq,_423){
return jq.each(function(){
_413(this,_423,true);
});
},hideItem:function(jq,_424){
return jq.each(function(){
_413(this,_424,false);
});
},resize:function(jq,_425){
return jq.each(function(){
_3ed(this,$(_425));
});
}};
$.fn.menu.parseOptions=function(_426){
return $.extend({},$.parser.parseOptions(_426,[{minWidth:"number",itemHeight:"number",duration:"number",hideOnUnhover:"boolean"},{fit:"boolean",inline:"boolean",noline:"boolean"}]));
};
$.fn.menu.defaults={zIndex:110000,left:0,top:0,alignTo:null,align:"left",minWidth:120,itemHeight:22,duration:100,hideOnUnhover:true,inline:false,fit:false,noline:false,onShow:function(){
},onHide:function(){
},onClick:function(item){
}};
})(jQuery);
(function($){
function init(_427){
var opts=$.data(_427,"menubutton").options;
var btn=$(_427);
btn.linkbutton(opts);
if(opts.hasDownArrow){
btn.removeClass(opts.cls.btn1+" "+opts.cls.btn2).addClass("m-btn");
btn.removeClass("m-btn-small m-btn-medium m-btn-large").addClass("m-btn-"+opts.size);
var _428=btn.find(".l-btn-left");
$("<span></span>").addClass(opts.cls.arrow).appendTo(_428);
$("<span></span>").addClass("m-btn-line").appendTo(_428);
}
$(_427).menubutton("resize");
if(opts.menu){
$(opts.menu).menu({duration:opts.duration});
var _429=$(opts.menu).menu("options");
var _42a=_429.onShow;
var _42b=_429.onHide;
$.extend(_429,{onShow:function(){
var _42c=$(this).menu("options");
var btn=$(_42c.alignTo);
var opts=btn.menubutton("options");
btn.addClass((opts.plain==true)?opts.cls.btn2:opts.cls.btn1);
_42a.call(this);
},onHide:function(){
var _42d=$(this).menu("options");
var btn=$(_42d.alignTo);
var opts=btn.menubutton("options");
btn.removeClass((opts.plain==true)?opts.cls.btn2:opts.cls.btn1);
_42b.call(this);
}});
}
};
function _42e(_42f){
var opts=$.data(_42f,"menubutton").options;
var btn=$(_42f);
var t=btn.find("."+opts.cls.trigger);
if(!t.length){
t=btn;
}
t.unbind(".menubutton");
var _430=null;
t.bind("click.menubutton",function(){
if(!_431()){
_432(_42f);
return false;
}
}).bind("mouseenter.menubutton",function(){
if(!_431()){
_430=setTimeout(function(){
_432(_42f);
},opts.duration);
return false;
}
}).bind("mouseleave.menubutton",function(){
if(_430){
clearTimeout(_430);
}
$(opts.menu).triggerHandler("mouseleave");
});
function _431(){
return $(_42f).linkbutton("options").disabled;
};
};
function _432(_433){
var opts=$(_433).menubutton("options");
if(opts.disabled||!opts.menu){
return;
}
$("body>div.menu-top").menu("hide");
var btn=$(_433);
var mm=$(opts.menu);
if(mm.length){
mm.menu("options").alignTo=btn;
mm.menu("show",{alignTo:btn,align:opts.menuAlign});
}
btn.blur();
};
$.fn.menubutton=function(_434,_435){
if(typeof _434=="string"){
var _436=$.fn.menubutton.methods[_434];
if(_436){
return _436(this,_435);
}else{
return this.linkbutton(_434,_435);
}
}
_434=_434||{};
return this.each(function(){
var _437=$.data(this,"menubutton");
if(_437){
$.extend(_437.options,_434);
}else{
$.data(this,"menubutton",{options:$.extend({},$.fn.menubutton.defaults,$.fn.menubutton.parseOptions(this),_434)});
$(this).removeAttr("disabled");
}
init(this);
_42e(this);
});
};
$.fn.menubutton.methods={options:function(jq){
var _438=jq.linkbutton("options");
return $.extend($.data(jq[0],"menubutton").options,{toggle:_438.toggle,selected:_438.selected,disabled:_438.disabled});
},destroy:function(jq){
return jq.each(function(){
var opts=$(this).menubutton("options");
if(opts.menu){
$(opts.menu).menu("destroy");
}
$(this).remove();
});
}};
$.fn.menubutton.parseOptions=function(_439){
var t=$(_439);
return $.extend({},$.fn.linkbutton.parseOptions(_439),$.parser.parseOptions(_439,["menu",{plain:"boolean",hasDownArrow:"boolean",duration:"number"}]));
};
$.fn.menubutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,hasDownArrow:true,menu:null,menuAlign:"left",duration:100,cls:{btn1:"m-btn-active",btn2:"m-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn"}});
})(jQuery);
(function($){
function init(_43a){
var opts=$.data(_43a,"splitbutton").options;
$(_43a).menubutton(opts);
$(_43a).addClass("s-btn");
};
$.fn.splitbutton=function(_43b,_43c){
if(typeof _43b=="string"){
var _43d=$.fn.splitbutton.methods[_43b];
if(_43d){
return _43d(this,_43c);
}else{
return this.menubutton(_43b,_43c);
}
}
_43b=_43b||{};
return this.each(function(){
var _43e=$.data(this,"splitbutton");
if(_43e){
$.extend(_43e.options,_43b);
}else{
$.data(this,"splitbutton",{options:$.extend({},$.fn.splitbutton.defaults,$.fn.splitbutton.parseOptions(this),_43b)});
$(this).removeAttr("disabled");
}
init(this);
});
};
$.fn.splitbutton.methods={options:function(jq){
var _43f=jq.menubutton("options");
var _440=$.data(jq[0],"splitbutton").options;
$.extend(_440,{disabled:_43f.disabled,toggle:_43f.toggle,selected:_43f.selected});
return _440;
}};
$.fn.splitbutton.parseOptions=function(_441){
var t=$(_441);
return $.extend({},$.fn.linkbutton.parseOptions(_441),$.parser.parseOptions(_441,["menu",{plain:"boolean",duration:"number"}]));
};
$.fn.splitbutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,menu:null,duration:100,cls:{btn1:"m-btn-active s-btn-active",btn2:"m-btn-plain-active s-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn-line"}});
})(jQuery);
(function($){
function init(_442){
var _443=$("<span class=\"switchbutton\">"+"<span class=\"switchbutton-inner\">"+"<span class=\"switchbutton-on\"></span>"+"<span class=\"switchbutton-handle\"></span>"+"<span class=\"switchbutton-off\"></span>"+"<input class=\"switchbutton-value\" type=\"checkbox\">"+"</span>"+"</span>").insertAfter(_442);
var t=$(_442);
t.addClass("switchbutton-f").hide();
var name=t.attr("name");
if(name){
t.removeAttr("name").attr("switchbuttonName",name);
_443.find(".switchbutton-value").attr("name",name);
}
_443.bind("_resize",function(e,_444){
if($(this).hasClass("ui-fluid")||_444){
_445(_442);
}
return false;
});
return _443;
};
function _445(_446,_447){
var _448=$.data(_446,"switchbutton");
var opts=_448.options;
var _449=_448.switchbutton;
if(_447){
$.extend(opts,_447);
}
var _44a=_449.is(":visible");
if(!_44a){
_449.appendTo("body");
}
_449._size(opts);
var w=_449.width();
var h=_449.height();
var w=_449.outerWidth();
var h=_449.outerHeight();
var _44b=parseInt(opts.handleWidth)||_449.height();
var _44c=w*2-_44b;
_449.find(".switchbutton-inner").css({width:_44c+"px",height:h+"px",lineHeight:h+"px"});
_449.find(".switchbutton-handle")._outerWidth(_44b)._outerHeight(h).css({marginLeft:-_44b/2+"px"});
_449.find(".switchbutton-on").css({width:(w-_44b/2)+"px",textIndent:(opts.reversed?"":"-")+_44b/2+"px"});
_449.find(".switchbutton-off").css({width:(w-_44b/2)+"px",textIndent:(opts.reversed?"-":"")+_44b/2+"px"});
opts.marginWidth=w-_44b;
_44d(_446,opts.checked,false);
if(!_44a){
_449.insertAfter(_446);
}
};
function _44e(_44f){
var _450=$.data(_44f,"switchbutton");
var opts=_450.options;
var _451=_450.switchbutton;
var _452=_451.find(".switchbutton-inner");
var on=_452.find(".switchbutton-on").html(opts.onText);
var off=_452.find(".switchbutton-off").html(opts.offText);
var _453=_452.find(".switchbutton-handle").html(opts.handleText);
if(opts.reversed){
off.prependTo(_452);
on.insertAfter(_453);
}else{
on.prependTo(_452);
off.insertAfter(_453);
}
_451.find(".switchbutton-value")._propAttr("checked",opts.checked);
_451.removeClass("switchbutton-disabled").addClass(opts.disabled?"switchbutton-disabled":"");
_451.removeClass("switchbutton-reversed").addClass(opts.reversed?"switchbutton-reversed":"");
_44d(_44f,opts.checked);
_454(_44f,opts.readonly);
$(_44f).switchbutton("setValue",opts.value);
};
function _44d(_455,_456,_457){
var _458=$.data(_455,"switchbutton");
var opts=_458.options;
opts.checked=_456;
var _459=_458.switchbutton.find(".switchbutton-inner");
var _45a=_459.find(".switchbutton-on");
var _45b=opts.reversed?(opts.checked?opts.marginWidth:0):(opts.checked?0:opts.marginWidth);
var dir=_45a.css("float").toLowerCase();
var css={};
css["margin-"+dir]=-_45b+"px";
_457?_459.animate(css,200):_459.css(css);
var _45c=_459.find(".switchbutton-value");
var ck=_45c.is(":checked");
$(_455).add(_45c)._propAttr("checked",opts.checked);
if(ck!=opts.checked){
opts.onChange.call(_455,opts.checked);
}
};
function _45d(_45e,_45f){
var _460=$.data(_45e,"switchbutton");
var opts=_460.options;
var _461=_460.switchbutton;
var _462=_461.find(".switchbutton-value");
if(_45f){
opts.disabled=true;
$(_45e).add(_462).attr("disabled","disabled");
_461.addClass("switchbutton-disabled");
}else{
opts.disabled=false;
$(_45e).add(_462).removeAttr("disabled");
_461.removeClass("switchbutton-disabled");
}
};
function _454(_463,mode){
var _464=$.data(_463,"switchbutton");
var opts=_464.options;
opts.readonly=mode==undefined?true:mode;
_464.switchbutton.removeClass("switchbutton-readonly").addClass(opts.readonly?"switchbutton-readonly":"");
};
function _465(_466){
var _467=$.data(_466,"switchbutton");
var opts=_467.options;
_467.switchbutton.unbind(".switchbutton").bind("click.switchbutton",function(){
if(!opts.disabled&&!opts.readonly){
_44d(_466,opts.checked?false:true,true);
}
});
};
$.fn.switchbutton=function(_468,_469){
if(typeof _468=="string"){
return $.fn.switchbutton.methods[_468](this,_469);
}
_468=_468||{};
return this.each(function(){
var _46a=$.data(this,"switchbutton");
if(_46a){
$.extend(_46a.options,_468);
}else{
_46a=$.data(this,"switchbutton",{options:$.extend({},$.fn.switchbutton.defaults,$.fn.switchbutton.parseOptions(this),_468),switchbutton:init(this)});
}
_46a.options.originalChecked=_46a.options.checked;
_44e(this);
_445(this);
_465(this);
});
};
$.fn.switchbutton.methods={options:function(jq){
var _46b=jq.data("switchbutton");
return $.extend(_46b.options,{value:_46b.switchbutton.find(".switchbutton-value").val()});
},resize:function(jq,_46c){
return jq.each(function(){
_445(this,_46c);
});
},enable:function(jq){
return jq.each(function(){
_45d(this,false);
});
},disable:function(jq){
return jq.each(function(){
_45d(this,true);
});
},readonly:function(jq,mode){
return jq.each(function(){
_454(this,mode);
});
},check:function(jq){
return jq.each(function(){
_44d(this,true);
});
},uncheck:function(jq){
return jq.each(function(){
_44d(this,false);
});
},clear:function(jq){
return jq.each(function(){
_44d(this,false);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).switchbutton("options");
_44d(this,opts.originalChecked);
});
},setValue:function(jq,_46d){
return jq.each(function(){
$(this).val(_46d);
$.data(this,"switchbutton").switchbutton.find(".switchbutton-value").val(_46d);
});
}};
$.fn.switchbutton.parseOptions=function(_46e){
var t=$(_46e);
return $.extend({},$.parser.parseOptions(_46e,["onText","offText","handleText",{handleWidth:"number",reversed:"boolean"}]),{value:(t.val()||undefined),checked:(t.attr("checked")?true:undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined)});
};
$.fn.switchbutton.defaults={handleWidth:"auto",width:60,height:26,checked:false,disabled:false,readonly:false,reversed:false,onText:"ON",offText:"OFF",handleText:"",value:"on",onChange:function(_46f){
}};
})(jQuery);
(function($){
function init(_470){
$(_470).addClass("validatebox-text");
};
function _471(_472){
var _473=$.data(_472,"validatebox");
_473.validating=false;
if(_473.timer){
clearTimeout(_473.timer);
}
$(_472).tooltip("destroy");
$(_472).unbind();
$(_472).remove();
};
function _474(_475){
var opts=$.data(_475,"validatebox").options;
var box=$(_475);
box.unbind(".validatebox");
if(opts.novalidate||box.is(":disabled")){
return;
}
for(var _476 in opts.events){
$(_475).bind(_476+".validatebox",{target:_475},opts.events[_476]);
}
};
function _477(e){
var _478=e.data.target;
var _479=$.data(_478,"validatebox");
var box=$(_478);
if($(_478).attr("readonly")){
return;
}
_479.validating=true;
_479.value=undefined;
(function(){
if(_479.validating){
if(_479.value!=box.val()){
_479.value=box.val();
if(_479.timer){
clearTimeout(_479.timer);
}
_479.timer=setTimeout(function(){
$(_478).validatebox("validate");
},_479.options.delay);
}else{
_47a(_478);
}
setTimeout(arguments.callee,200);
}
})();
};
function _47b(e){
var _47c=e.data.target;
var _47d=$.data(_47c,"validatebox");
if(_47d.timer){
clearTimeout(_47d.timer);
_47d.timer=undefined;
}
_47d.validating=false;
_47e(_47c);
};
function _47f(e){
var _480=e.data.target;
if($(_480).hasClass("validatebox-invalid")){
_481(_480);
}
};
function _482(e){
var _483=e.data.target;
var _484=$.data(_483,"validatebox");
if(!_484.validating){
_47e(_483);
}
};
function _481(_485){
var _486=$.data(_485,"validatebox");
var opts=_486.options;
$(_485).tooltip($.extend({},opts.tipOptions,{content:_486.message,position:opts.tipPosition,deltaX:opts.deltaX})).tooltip("show");
_486.tip=true;
};
function _47a(_487){
var _488=$.data(_487,"validatebox");
if(_488&&_488.tip){
$(_487).tooltip("reposition");
}
};
function _47e(_489){
var _48a=$.data(_489,"validatebox");
_48a.tip=false;
$(_489).tooltip("hide");
};
function _48b(_48c){
var _48d=$.data(_48c,"validatebox");
var opts=_48d.options;
var box=$(_48c);
opts.onBeforeValidate.call(_48c);
var _48e=_48f();
opts.onValidate.call(_48c,_48e);
return _48e;
function _490(msg){
_48d.message=msg;
};
function _491(_492,_493){
var _494=box.val();
var _495=/([a-zA-Z_]+)(.*)/.exec(_492);
var rule=opts.rules[_495[1]];
if(rule&&_494){
var _496=_493||opts.validParams||eval(_495[2]);
if(!rule["validator"].call(_48c,_494,_496)){
box.addClass("validatebox-invalid");
var _497=rule["message"];
if(_496){
for(var i=0;i<_496.length;i++){
_497=_497.replace(new RegExp("\\{"+i+"\\}","g"),_496[i]);
}
}
_490(opts.invalidMessage||_497);
if(_48d.validating){
_481(_48c);
}
return false;
}
}
return true;
};
function _48f(){
box.removeClass("validatebox-invalid");
_47e(_48c);
if(opts.novalidate||box.is(":disabled")){
return true;
}
if(opts.required){
if($.trim(box.val())==""){
box.addClass("validatebox-invalid");
_490(opts.missingMessage);
if(_48d.validating){
_481(_48c);
}
return false;
}
}
if(opts.validType){
if($.isArray(opts.validType)){
for(var i=0;i<opts.validType.length;i++){
if(!_491(opts.validType[i])){
return false;
}
}
}else{
if(typeof opts.validType=="string"){
if(!_491(opts.validType)){
return false;
}
}else{
for(var _498 in opts.validType){
var _499=opts.validType[_498];
if(!_491(_498,_499)){
return false;
}
}
}
}
}
return true;
};
};
function _49a(_49b,_49c){
var opts=$.data(_49b,"validatebox").options;
if(_49c!=undefined){
opts.novalidate=_49c;
}
if(opts.novalidate){
$(_49b).removeClass("validatebox-invalid");
_47e(_49b);
}
_48b(_49b);
_474(_49b);
};
$.fn.validatebox=function(_49d,_49e){
if(typeof _49d=="string"){
return $.fn.validatebox.methods[_49d](this,_49e);
}
_49d=_49d||{};
return this.each(function(){
var _49f=$.data(this,"validatebox");
if(_49f){
$.extend(_49f.options,_49d);
}else{
init(this);
$.data(this,"validatebox",{options:$.extend({},$.fn.validatebox.defaults,$.fn.validatebox.parseOptions(this),_49d)});
}
_49a(this);
_48b(this);
});
};
$.fn.validatebox.methods={options:function(jq){
return $.data(jq[0],"validatebox").options;
},destroy:function(jq){
return jq.each(function(){
_471(this);
});
},validate:function(jq){
return jq.each(function(){
_48b(this);
});
},isValid:function(jq){
return _48b(jq[0]);
},enableValidation:function(jq){
return jq.each(function(){
_49a(this,false);
});
},disableValidation:function(jq){
return jq.each(function(){
_49a(this,true);
});
}};
$.fn.validatebox.parseOptions=function(_4a0){
var t=$(_4a0);
return $.extend({},$.parser.parseOptions(_4a0,["validType","missingMessage","invalidMessage","tipPosition",{delay:"number",deltaX:"number"}]),{required:(t.attr("required")?true:undefined),novalidate:(t.attr("novalidate")!=undefined?true:undefined)});
};
$.fn.validatebox.defaults={required:false,validType:null,validParams:null,delay:200,missingMessage:"This field is required.",invalidMessage:null,tipPosition:"right",deltaX:0,novalidate:false,events:{focus:_477,blur:_47b,mouseenter:_47f,mouseleave:_482,click:function(e){
var t=$(e.data.target);
if(!t.is(":focus")){
t.trigger("focus");
}
}},tipOptions:{showEvent:"none",hideEvent:"none",showDelay:0,hideDelay:0,zIndex:"",onShow:function(){
$(this).tooltip("tip").css({color:"#000",borderColor:"#CC9933",backgroundColor:"#FFFFCC"});
},onHide:function(){
$(this).tooltip("destroy");
}},rules:{email:{validator:function(_4a1){
return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(_4a1);
},message:"Please enter a valid email address."},url:{validator:function(_4a2){
return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(_4a2);
},message:"Please enter a valid URL."},length:{validator:function(_4a3,_4a4){
var len=$.trim(_4a3).length;
return len>=_4a4[0]&&len<=_4a4[1];
},message:"Please enter a value between {0} and {1}."},remote:{validator:function(_4a5,_4a6){
var data={};
data[_4a6[1]]=_4a5;
var _4a7=$.ajax({url:_4a6[0],dataType:"json",data:data,async:false,cache:false,type:"post"}).responseText;
return _4a7=="true";
},message:"Please fix this field."}},onBeforeValidate:function(){
},onValidate:function(_4a8){
}};
})(jQuery);
(function($){
function init(_4a9){
$(_4a9).addClass("textbox-f").hide();
var span=$("<span class=\"textbox\">"+"<input class=\"textbox-text\" autocomplete=\"off\">"+"<input type=\"hidden\" class=\"textbox-value\">"+"</span>").insertAfter(_4a9);
var name=$(_4a9).attr("name");
if(name){
span.find("input.textbox-value").attr("name",name);
$(_4a9).removeAttr("name").attr("textboxName",name);
}
return span;
};
function _4aa(_4ab){
var _4ac=$.data(_4ab,"textbox");
var opts=_4ac.options;
var tb=_4ac.textbox;
tb.find(".textbox-text").remove();
if(opts.multiline){
$("<textarea class=\"textbox-text\" autocomplete=\"off\"></textarea>").prependTo(tb);
}else{
$("<input type=\""+opts.type+"\" class=\"textbox-text\" autocomplete=\"off\">").prependTo(tb);
}
tb.find(".textbox-addon").remove();
var bb=opts.icons?$.extend(true,[],opts.icons):[];
if(opts.iconCls){
bb.push({iconCls:opts.iconCls,disabled:true});
}
if(bb.length){
var bc=$("<span class=\"textbox-addon\"></span>").prependTo(tb);
bc.addClass("textbox-addon-"+opts.iconAlign);
for(var i=0;i<bb.length;i++){
bc.append("<a href=\"javascript:void(0)\" class=\"textbox-icon "+bb[i].iconCls+"\" icon-index=\""+i+"\" tabindex=\"-1\"></a>");
}
}
tb.find(".textbox-button").remove();
if(opts.buttonText||opts.buttonIcon){
var btn=$("<a href=\"javascript:void(0)\" class=\"textbox-button\"></a>").prependTo(tb);
btn.addClass("textbox-button-"+opts.buttonAlign).linkbutton({text:opts.buttonText,iconCls:opts.buttonIcon});
}
_4ad(_4ab,opts.disabled);
_4ae(_4ab,opts.readonly);
};
function _4af(_4b0){
var tb=$.data(_4b0,"textbox").textbox;
tb.find(".textbox-text").validatebox("destroy");
tb.remove();
$(_4b0).remove();
};
function _4b1(_4b2,_4b3){
var _4b4=$.data(_4b2,"textbox");
var opts=_4b4.options;
var tb=_4b4.textbox;
var _4b5=tb.parent();
if(_4b3){
opts.width=_4b3;
}
if(isNaN(parseInt(opts.width))){
var c=$(_4b2).clone();
c.css("visibility","hidden");
c.insertAfter(_4b2);
opts.width=c.outerWidth();
c.remove();
}
var _4b6=tb.is(":visible");
if(!_4b6){
tb.appendTo("body");
}
var _4b7=tb.find(".textbox-text");
var btn=tb.find(".textbox-button");
var _4b8=tb.find(".textbox-addon");
var _4b9=_4b8.find(".textbox-icon");
tb._size(opts,_4b5);
btn.linkbutton("resize",{height:tb.height()});
btn.css({left:(opts.buttonAlign=="left"?0:""),right:(opts.buttonAlign=="right"?0:"")});
_4b8.css({left:(opts.iconAlign=="left"?(opts.buttonAlign=="left"?btn._outerWidth():0):""),right:(opts.iconAlign=="right"?(opts.buttonAlign=="right"?btn._outerWidth():0):"")});
_4b9.css({width:opts.iconWidth+"px",height:tb.height()+"px"});
_4b7.css({paddingLeft:(_4b2.style.paddingLeft||""),paddingRight:(_4b2.style.paddingRight||""),marginLeft:_4ba("left"),marginRight:_4ba("right")});
if(opts.multiline){
_4b7.css({paddingTop:(_4b2.style.paddingTop||""),paddingBottom:(_4b2.style.paddingBottom||"")});
_4b7._outerHeight(tb.height());
}else{
var _4bb=Math.floor((tb.height()-_4b7.height())/2);
_4b7.css({paddingTop:_4bb+"px",paddingBottom:_4bb+"px"});
}
_4b7._outerWidth(tb.width()-_4b9.length*opts.iconWidth-btn._outerWidth());
if(!_4b6){
tb.insertAfter(_4b2);
}
opts.onResize.call(_4b2,opts.width,opts.height);
function _4ba(_4bc){
return (opts.iconAlign==_4bc?_4b8._outerWidth():0)+(opts.buttonAlign==_4bc?btn._outerWidth():0);
};
};
function _4bd(_4be){
var opts=$(_4be).textbox("options");
var _4bf=$(_4be).textbox("textbox");
_4bf.validatebox($.extend({},opts,{deltaX:$(_4be).textbox("getTipX"),onBeforeValidate:function(){
var box=$(this);
if(!box.is(":focus")){
opts.oldInputValue=box.val();
box.val(opts.value);
}
},onValidate:function(_4c0){
var box=$(this);
if(opts.oldInputValue!=undefined){
box.val(opts.oldInputValue);
opts.oldInputValue=undefined;
}
var tb=box.parent();
if(_4c0){
tb.removeClass("textbox-invalid");
}else{
tb.addClass("textbox-invalid");
}
}}));
};
function _4c1(_4c2){
var _4c3=$.data(_4c2,"textbox");
var opts=_4c3.options;
var tb=_4c3.textbox;
var _4c4=tb.find(".textbox-text");
_4c4.attr("placeholder",opts.prompt);
_4c4.unbind(".textbox");
if(!opts.disabled&&!opts.readonly){
_4c4.bind("blur.textbox",function(e){
if(!tb.hasClass("textbox-focused")){
return;
}
opts.value=$(this).val();
if(opts.value==""){
$(this).val(opts.prompt).addClass("textbox-prompt");
}else{
$(this).removeClass("textbox-prompt");
}
tb.removeClass("textbox-focused");
}).bind("focus.textbox",function(e){
if(tb.hasClass("textbox-focused")){
return;
}
if($(this).val()!=opts.value){
$(this).val(opts.value);
}
$(this).removeClass("textbox-prompt");
tb.addClass("textbox-focused");
});
for(var _4c5 in opts.inputEvents){
_4c4.bind(_4c5+".textbox",{target:_4c2},opts.inputEvents[_4c5]);
}
}
var _4c6=tb.find(".textbox-addon");
_4c6.unbind().bind("click",{target:_4c2},function(e){
var icon=$(e.target).closest("a.textbox-icon:not(.textbox-icon-disabled)");
if(icon.length){
var _4c7=parseInt(icon.attr("icon-index"));
var conf=opts.icons[_4c7];
if(conf&&conf.handler){
conf.handler.call(icon[0],e);
opts.onClickIcon.call(_4c2,_4c7);
}
}
});
_4c6.find(".textbox-icon").each(function(_4c8){
var conf=opts.icons[_4c8];
var icon=$(this);
if(!conf||conf.disabled||opts.disabled||opts.readonly){
icon.addClass("textbox-icon-disabled");
}else{
icon.removeClass("textbox-icon-disabled");
}
});
var btn=tb.find(".textbox-button");
btn.unbind(".textbox").bind("click.textbox",function(){
if(!btn.linkbutton("options").disabled){
opts.onClickButton.call(_4c2);
}
});
btn.linkbutton((opts.disabled||opts.readonly)?"disable":"enable");
tb.unbind(".textbox").bind("_resize.textbox",function(e,_4c9){
if($(this).hasClass("ui-fluid")||_4c9){
_4b1(_4c2);
}
return false;
});
};
function _4ad(_4ca,_4cb){
var _4cc=$.data(_4ca,"textbox");
var opts=_4cc.options;
var tb=_4cc.textbox;
if(_4cb){
opts.disabled=true;
$(_4ca).attr("disabled","disabled");
tb.addClass("textbox-disabled");
tb.find(".textbox-text,.textbox-value").attr("disabled","disabled");
}else{
opts.disabled=false;
tb.removeClass("textbox-disabled");
$(_4ca).removeAttr("disabled");
tb.find(".textbox-text,.textbox-value").removeAttr("disabled");
}
};
function _4ae(_4cd,mode){
var _4ce=$.data(_4cd,"textbox");
var opts=_4ce.options;
opts.readonly=mode==undefined?true:mode;
_4ce.textbox.removeClass("textbox-readonly").addClass(opts.readonly?"textbox-readonly":"");
var _4cf=_4ce.textbox.find(".textbox-text");
_4cf.removeAttr("readonly");
if(opts.readonly||!opts.editable){
_4cf.attr("readonly","readonly");
}
};
$.fn.textbox=function(_4d0,_4d1){
if(typeof _4d0=="string"){
var _4d2=$.fn.textbox.methods[_4d0];
if(_4d2){
return _4d2(this,_4d1);
}else{
return this.each(function(){
var _4d3=$(this).textbox("textbox");
_4d3.validatebox(_4d0,_4d1);
});
}
}
_4d0=_4d0||{};
return this.each(function(){
var _4d4=$.data(this,"textbox");
if(_4d4){
$.extend(_4d4.options,_4d0);
if(_4d0.value!=undefined){
_4d4.options.originalValue=_4d0.value;
}
}else{
_4d4=$.data(this,"textbox",{options:$.extend({},$.fn.textbox.defaults,$.fn.textbox.parseOptions(this),_4d0),textbox:init(this)});
_4d4.options.originalValue=_4d4.options.value;
}
_4aa(this);
_4c1(this);
_4b1(this);
_4bd(this);
$(this).textbox("initValue",_4d4.options.value);
});
};
$.fn.textbox.methods={options:function(jq){
return $.data(jq[0],"textbox").options;
},cloneFrom:function(jq,from){
return jq.each(function(){
var t=$(this);
if(t.data("textbox")){
return;
}
if(!$(from).data("textbox")){
$(from).textbox();
}
var name=t.attr("name")||"";
t.addClass("textbox-f").hide();
t.removeAttr("name").attr("textboxName",name);
var span=$(from).next().clone().insertAfter(t);
span.find("input.textbox-value").attr("name",name);
$.data(this,"textbox",{options:$.extend(true,{},$(from).textbox("options")),textbox:span});
var _4d5=$(from).textbox("button");
if(_4d5.length){
t.textbox("button").linkbutton($.extend(true,{},_4d5.linkbutton("options")));
}
_4c1(this);
_4bd(this);
});
},textbox:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-text");
},button:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-button");
},destroy:function(jq){
return jq.each(function(){
_4af(this);
});
},resize:function(jq,_4d6){
return jq.each(function(){
_4b1(this,_4d6);
});
},disable:function(jq){
return jq.each(function(){
_4ad(this,true);
_4c1(this);
});
},enable:function(jq){
return jq.each(function(){
_4ad(this,false);
_4c1(this);
});
},readonly:function(jq,mode){
return jq.each(function(){
_4ae(this,mode);
_4c1(this);
});
},isValid:function(jq){
return jq.textbox("textbox").validatebox("isValid");
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setValue","");
});
},setText:function(jq,_4d7){
return jq.each(function(){
var opts=$(this).textbox("options");
var _4d8=$(this).textbox("textbox");
_4d7=_4d7==undefined?"":String(_4d7);
if($(this).textbox("getText")!=_4d7){
_4d8.val(_4d7);
}
opts.value=_4d7;
if(!_4d8.is(":focus")){
if(_4d7){
_4d8.removeClass("textbox-prompt");
}else{
_4d8.val(opts.prompt).addClass("textbox-prompt");
}
}
$(this).textbox("validate");
});
},initValue:function(jq,_4d9){
return jq.each(function(){
var _4da=$.data(this,"textbox");
_4da.options.value="";
$(this).textbox("setText",_4d9);
_4da.textbox.find(".textbox-value").val(_4d9);
$(this).val(_4d9);
});
},setValue:function(jq,_4db){
return jq.each(function(){
var opts=$.data(this,"textbox").options;
var _4dc=$(this).textbox("getValue");
$(this).textbox("initValue",_4db);
if(_4dc!=_4db){
opts.onChange.call(this,_4db,_4dc);
$(this).closest("form").trigger("_change",[this]);
}
});
},getText:function(jq){
var _4dd=jq.textbox("textbox");
if(_4dd.is(":focus")){
return _4dd.val();
}else{
return jq.textbox("options").value;
}
},getValue:function(jq){
return jq.data("textbox").textbox.find(".textbox-value").val();
},reset:function(jq){
return jq.each(function(){
var opts=$(this).textbox("options");
$(this).textbox("setValue",opts.originalValue);
});
},getIcon:function(jq,_4de){
return jq.data("textbox").textbox.find(".textbox-icon:eq("+_4de+")");
},getTipX:function(jq){
var _4df=jq.data("textbox");
var opts=_4df.options;
var tb=_4df.textbox;
var _4e0=tb.find(".textbox-text");
var _4e1=tb.find(".textbox-addon")._outerWidth();
var _4e2=tb.find(".textbox-button")._outerWidth();
if(opts.tipPosition=="right"){
return (opts.iconAlign=="right"?_4e1:0)+(opts.buttonAlign=="right"?_4e2:0)+1;
}else{
if(opts.tipPosition=="left"){
return (opts.iconAlign=="left"?-_4e1:0)+(opts.buttonAlign=="left"?-_4e2:0)-1;
}else{
return _4e1/2*(opts.iconAlign=="right"?1:-1);
}
}
}};
$.fn.textbox.parseOptions=function(_4e3){
var t=$(_4e3);
return $.extend({},$.fn.validatebox.parseOptions(_4e3),$.parser.parseOptions(_4e3,["prompt","iconCls","iconAlign","buttonText","buttonIcon","buttonAlign",{multiline:"boolean",editable:"boolean",iconWidth:"number"}]),{value:(t.val()||undefined),type:(t.attr("type")?t.attr("type"):undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined)});
};
$.fn.textbox.defaults=$.extend({},$.fn.validatebox.defaults,{width:"auto",height:22,prompt:"",value:"",type:"text",multiline:false,editable:true,disabled:false,readonly:false,icons:[],iconCls:null,iconAlign:"right",iconWidth:18,buttonText:"",buttonIcon:null,buttonAlign:"right",inputEvents:{blur:function(e){
var t=$(e.data.target);
var opts=t.textbox("options");
t.textbox("setValue",opts.value);
},keydown:function(e){
if(e.keyCode==13){
var t=$(e.data.target);
t.textbox("setValue",t.textbox("getText"));
}
}},onChange:function(_4e4,_4e5){
},onResize:function(_4e6,_4e7){
},onClickButton:function(){
},onClickIcon:function(_4e8){
}});
})(jQuery);
(function($){
var _4e9=0;
function _4ea(_4eb){
var _4ec=$.data(_4eb,"filebox");
var opts=_4ec.options;
var id="filebox_file_id_"+(++_4e9);
$(_4eb).addClass("filebox-f").textbox(opts);
$(_4eb).textbox("textbox").attr("readonly","readonly");
_4ec.filebox=$(_4eb).next().addClass("filebox");
_4ec.filebox.find(".textbox-value").remove();
opts.oldValue="";
var file=$("<input type=\"file\" class=\"textbox-value\">").appendTo(_4ec.filebox);
file.attr("id",id).attr("name",$(_4eb).attr("textboxName")||"");
file.change(function(){
$(_4eb).filebox("setText",this.value);
opts.onChange.call(_4eb,this.value,opts.oldValue);
opts.oldValue=this.value;
});
var btn=$(_4eb).filebox("button");
if(btn.length){
$("<label class=\"filebox-label\" for=\""+id+"\"></label>").appendTo(btn);
if(btn.linkbutton("options").disabled){
file.attr("disabled","disabled");
}else{
file.removeAttr("disabled");
}
}
};
$.fn.filebox=function(_4ed,_4ee){
if(typeof _4ed=="string"){
var _4ef=$.fn.filebox.methods[_4ed];
if(_4ef){
return _4ef(this,_4ee);
}else{
return this.textbox(_4ed,_4ee);
}
}
_4ed=_4ed||{};
return this.each(function(){
var _4f0=$.data(this,"filebox");
if(_4f0){
$.extend(_4f0.options,_4ed);
}else{
$.data(this,"filebox",{options:$.extend({},$.fn.filebox.defaults,$.fn.filebox.parseOptions(this),_4ed)});
}
_4ea(this);
});
};
$.fn.filebox.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"filebox").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.filebox.parseOptions=function(_4f1){
return $.extend({},$.fn.textbox.parseOptions(_4f1),{});
};
$.fn.filebox.defaults=$.extend({},$.fn.textbox.defaults,{buttonIcon:null,buttonText:"Choose File",buttonAlign:"right",inputEvents:{}});
})(jQuery);
(function($){
function _4f2(_4f3){
var _4f4=$.data(_4f3,"searchbox");
var opts=_4f4.options;
var _4f5=$.extend(true,[],opts.icons);
_4f5.push({iconCls:"searchbox-button",handler:function(e){
var t=$(e.data.target);
var opts=t.searchbox("options");
opts.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
}});
_4f6();
var _4f7=_4f8();
$(_4f3).addClass("searchbox-f").textbox($.extend({},opts,{icons:_4f5,buttonText:(_4f7?_4f7.text:"")}));
$(_4f3).attr("searchboxName",$(_4f3).attr("textboxName"));
_4f4.searchbox=$(_4f3).next();
_4f4.searchbox.addClass("searchbox");
_4f9(_4f7);
function _4f6(){
if(opts.menu){
_4f4.menu=$(opts.menu).menu();
var _4fa=_4f4.menu.menu("options");
var _4fb=_4fa.onClick;
_4fa.onClick=function(item){
_4f9(item);
_4fb.call(this,item);
};
}else{
if(_4f4.menu){
_4f4.menu.menu("destroy");
}
_4f4.menu=null;
}
};
function _4f8(){
if(_4f4.menu){
var item=_4f4.menu.children("div.menu-item:first");
_4f4.menu.children("div.menu-item").each(function(){
var _4fc=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
if(_4fc.selected){
item=$(this);
return false;
}
});
return _4f4.menu.menu("getItem",item[0]);
}else{
return null;
}
};
function _4f9(item){
if(!item){
return;
}
$(_4f3).textbox("button").menubutton({text:item.text,iconCls:(item.iconCls||null),menu:_4f4.menu,menuAlign:opts.buttonAlign,plain:false});
_4f4.searchbox.find("input.textbox-value").attr("name",item.name||item.text);
$(_4f3).searchbox("resize");
};
};
$.fn.searchbox=function(_4fd,_4fe){
if(typeof _4fd=="string"){
var _4ff=$.fn.searchbox.methods[_4fd];
if(_4ff){
return _4ff(this,_4fe);
}else{
return this.textbox(_4fd,_4fe);
}
}
_4fd=_4fd||{};
return this.each(function(){
var _500=$.data(this,"searchbox");
if(_500){
$.extend(_500.options,_4fd);
}else{
$.data(this,"searchbox",{options:$.extend({},$.fn.searchbox.defaults,$.fn.searchbox.parseOptions(this),_4fd)});
}
_4f2(this);
});
};
$.fn.searchbox.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"searchbox").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},menu:function(jq){
return $.data(jq[0],"searchbox").menu;
},getName:function(jq){
return $.data(jq[0],"searchbox").searchbox.find("input.textbox-value").attr("name");
},selectName:function(jq,name){
return jq.each(function(){
var menu=$.data(this,"searchbox").menu;
if(menu){
menu.children("div.menu-item").each(function(){
var item=menu.menu("getItem",this);
if(item.name==name){
$(this).triggerHandler("click");
return false;
}
});
}
});
},destroy:function(jq){
return jq.each(function(){
var menu=$(this).searchbox("menu");
if(menu){
menu.menu("destroy");
}
$(this).textbox("destroy");
});
}};
$.fn.searchbox.parseOptions=function(_501){
var t=$(_501);
return $.extend({},$.fn.textbox.parseOptions(_501),$.parser.parseOptions(_501,["menu"]),{searcher:(t.attr("searcher")?eval(t.attr("searcher")):undefined)});
};
$.fn.searchbox.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:$.extend({},$.fn.textbox.defaults.inputEvents,{keydown:function(e){
if(e.keyCode==13){
e.preventDefault();
var t=$(e.data.target);
var opts=t.searchbox("options");
t.searchbox("setValue",$(this).val());
opts.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
return false;
}
}}),buttonAlign:"left",menu:null,searcher:function(_502,name){
}});
})(jQuery);
(function($){
function _503(_504,_505){
var opts=$.data(_504,"form").options;
$.extend(opts,_505||{});
var _506=$.extend({},opts.queryParams);
if(opts.onSubmit.call(_504,_506)==false){
return;
}
$(_504).find(".textbox-text:focus").blur();
var _507="easyui_frame_"+(new Date().getTime());
var _508=$("<iframe id="+_507+" name="+_507+"></iframe>").appendTo("body");
_508.attr("src",window.ActiveXObject?"javascript:false":"about:blank");
_508.css({position:"absolute",top:-1000,left:-1000});
_508.bind("load",cb);
_509(_506);
function _509(_50a){
var form=$(_504);
if(opts.url){
form.attr("action",opts.url);
}
var t=form.attr("target"),a=form.attr("action");
form.attr("target",_507);
var _50b=$();
try{
for(var n in _50a){
var _50c=$("<input type=\"hidden\" name=\""+n+"\">").val(_50a[n]).appendTo(form);
_50b=_50b.add(_50c);
}
_50d();
form[0].submit();
}
finally{
form.attr("action",a);
t?form.attr("target",t):form.removeAttr("target");
_50b.remove();
}
};
function _50d(){
var f=$("#"+_507);
if(!f.length){
return;
}
try{
var s=f.contents()[0].readyState;
if(s&&s.toLowerCase()=="uninitialized"){
setTimeout(_50d,100);
}
}
catch(e){
cb();
}
};
var _50e=10;
function cb(){
var f=$("#"+_507);
if(!f.length){
return;
}
f.unbind();
var data="";
try{
var body=f.contents().find("body");
data=body.html();
if(data==""){
if(--_50e){
setTimeout(cb,100);
return;
}
}
var ta=body.find(">textarea");
if(ta.length){
data=ta.val();
}else{
var pre=body.find(">pre");
if(pre.length){
data=pre.html();
}
}
}
catch(e){
}
opts.success(data);
setTimeout(function(){
f.unbind();
f.remove();
},100);
};
};
function load(_50f,data){
var opts=$.data(_50f,"form").options;
if(typeof data=="string"){
var _510={};
if(opts.onBeforeLoad.call(_50f,_510)==false){
return;
}
$.ajax({url:data,data:_510,dataType:"json",success:function(data){
_511(data);
},error:function(){
opts.onLoadError.apply(_50f,arguments);
}});
}else{
_511(data);
}
function _511(data){
var form=$(_50f);
for(var name in data){
var val=data[name];
if(!_512(name,val)){
if(!_513(name,val)){
form.find("input[name=\""+name+"\"]").val(val);
form.find("textarea[name=\""+name+"\"]").val(val);
form.find("select[name=\""+name+"\"]").val(val);
}
}
}
opts.onLoadSuccess.call(_50f,data);
form.form("validate");
};
function _512(name,val){
var cc=$(_50f).find("[switchbuttonName=\""+name+"\"]");
if(cc.length){
cc.switchbutton("uncheck");
cc.each(function(){
if(_514($(this).switchbutton("options").value,val)){
$(this).switchbutton("check");
}
});
return true;
}
cc=$(_50f).find("input[name=\""+name+"\"][type=radio], input[name=\""+name+"\"][type=checkbox]");
if(cc.length){
cc._propAttr("checked",false);
cc.each(function(){
if(_514($(this).val(),val)){
$(this)._propAttr("checked",true);
}
});
return true;
}
return false;
};
function _514(v,val){
if(v==String(val)||$.inArray(v,$.isArray(val)?val:[val])>=0){
return true;
}else{
return false;
}
};
function _513(name,val){
var _515=$(_50f).find("[textboxName=\""+name+"\"],[sliderName=\""+name+"\"]");
if(_515.length){
for(var i=0;i<opts.fieldTypes.length;i++){
var type=opts.fieldTypes[i];
var _516=_515.data(type);
if(_516){
if(_516.options.multiple||_516.options.range){
_515[type]("setValues",val);
}else{
_515[type]("setValue",val);
}
return true;
}
}
}
return false;
};
};
function _517(_518){
$("input,select,textarea",_518).each(function(){
var t=this.type,tag=this.tagName.toLowerCase();
if(t=="text"||t=="hidden"||t=="password"||tag=="textarea"){
this.value="";
}else{
if(t=="file"){
var file=$(this);
if(!file.hasClass("textbox-value")){
var _519=file.clone().val("");
_519.insertAfter(file);
if(file.data("validatebox")){
file.validatebox("destroy");
_519.validatebox();
}else{
file.remove();
}
}
}else{
if(t=="checkbox"||t=="radio"){
this.checked=false;
}else{
if(tag=="select"){
this.selectedIndex=-1;
}
}
}
}
});
var form=$(_518);
var opts=$.data(_518,"form").options;
for(var i=opts.fieldTypes.length-1;i>=0;i--){
var type=opts.fieldTypes[i];
var _51a=form.find("."+type+"-f");
if(_51a.length&&_51a[type]){
_51a[type]("clear");
}
}
form.form("validate");
};
function _51b(_51c){
_51c.reset();
var form=$(_51c);
var opts=$.data(_51c,"form").options;
for(var i=opts.fieldTypes.length-1;i>=0;i--){
var type=opts.fieldTypes[i];
var _51d=form.find("."+type+"-f");
if(_51d.length&&_51d[type]){
_51d[type]("reset");
}
}
form.form("validate");
};
function _51e(_51f){
var _520=$.data(_51f,"form").options;
$(_51f).unbind(".form");
if(_520.ajax){
$(_51f).bind("submit.form",function(){
setTimeout(function(){
_503(_51f,_520);
},0);
return false;
});
}
$(_51f).bind("_change.form",function(e,t){
_520.onChange.call(this,t);
}).bind("change.form",function(e){
var t=e.target;
if(!$(t).hasClass("textbox-text")){
_520.onChange.call(this,t);
}
});
_521(_51f,_520.novalidate);
};
function _522(_523,_524){
_524=_524||{};
var _525=$.data(_523,"form");
if(_525){
$.extend(_525.options,_524);
}else{
$.data(_523,"form",{options:$.extend({},$.fn.form.defaults,$.fn.form.parseOptions(_523),_524)});
}
};
function _526(_527){
if($.fn.validatebox){
var t=$(_527);
t.find(".validatebox-text:not(:disabled)").validatebox("validate");
var _528=t.find(".validatebox-invalid");
_528.filter(":not(:disabled):first").focus();
return _528.length==0;
}
return true;
};
function _521(_529,_52a){
var opts=$.data(_529,"form").options;
opts.novalidate=_52a;
$(_529).find(".validatebox-text:not(:disabled)").validatebox(_52a?"disableValidation":"enableValidation");
};
$.fn.form=function(_52b,_52c){
if(typeof _52b=="string"){
this.each(function(){
_522(this);
});
return $.fn.form.methods[_52b](this,_52c);
}
return this.each(function(){
_522(this,_52b);
_51e(this);
});
};
$.fn.form.methods={options:function(jq){
return $.data(jq[0],"form").options;
},submit:function(jq,_52d){
return jq.each(function(){
_503(this,_52d);
});
},load:function(jq,data){
return jq.each(function(){
load(this,data);
});
},clear:function(jq){
return jq.each(function(){
_517(this);
});
},reset:function(jq){
return jq.each(function(){
_51b(this);
});
},validate:function(jq){
return _526(jq[0]);
},disableValidation:function(jq){
return jq.each(function(){
_521(this,true);
});
},enableValidation:function(jq){
return jq.each(function(){
_521(this,false);
});
}};
$.fn.form.parseOptions=function(_52e){
var t=$(_52e);
return $.extend({},$.parser.parseOptions(_52e,[{ajax:"boolean"}]),{url:(t.attr("action")?t.attr("action"):undefined)});
};
$.fn.form.defaults={fieldTypes:["combobox","combotree","combogrid","datetimebox","datebox","combo","datetimespinner","timespinner","numberspinner","spinner","slider","searchbox","numberbox","textbox","switchbutton"],novalidate:false,ajax:true,url:null,queryParams:{},onSubmit:function(_52f){
return $(this).form("validate");
},success:function(data){
},onBeforeLoad:function(_530){
},onLoadSuccess:function(data){
},onLoadError:function(){
},onChange:function(_531){
}};
})(jQuery);
(function($){
function _532(_533){
var _534=$.data(_533,"numberbox");
var opts=_534.options;
$(_533).addClass("numberbox-f").textbox(opts);
$(_533).textbox("textbox").css({imeMode:"disabled"});
$(_533).attr("numberboxName",$(_533).attr("textboxName"));
_534.numberbox=$(_533).next();
_534.numberbox.addClass("numberbox");
var _535=opts.parser.call(_533,opts.value);
var _536=opts.formatter.call(_533,_535);
$(_533).numberbox("initValue",_535).numberbox("setText",_536);
};
function _537(_538,_539){
var _53a=$.data(_538,"numberbox");
var opts=_53a.options;
var _539=opts.parser.call(_538,_539);
var text=opts.formatter.call(_538,_539);
opts.value=_539;
$(_538).textbox("setText",text).textbox("setValue",_539);
text=opts.formatter.call(_538,$(_538).textbox("getValue"));
$(_538).textbox("setText",text);
};
$.fn.numberbox=function(_53b,_53c){
if(typeof _53b=="string"){
var _53d=$.fn.numberbox.methods[_53b];
if(_53d){
return _53d(this,_53c);
}else{
return this.textbox(_53b,_53c);
}
}
_53b=_53b||{};
return this.each(function(){
var _53e=$.data(this,"numberbox");
if(_53e){
$.extend(_53e.options,_53b);
}else{
_53e=$.data(this,"numberbox",{options:$.extend({},$.fn.numberbox.defaults,$.fn.numberbox.parseOptions(this),_53b)});
}
_532(this);
});
};
$.fn.numberbox.methods={options:function(jq){
var opts=jq.data("textbox")?jq.textbox("options"):{};
return $.extend($.data(jq[0],"numberbox").options,{width:opts.width,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},fix:function(jq){
return jq.each(function(){
$(this).numberbox("setValue",$(this).numberbox("getText"));
});
},setValue:function(jq,_53f){
return jq.each(function(){
_537(this,_53f);
});
},clear:function(jq){
return jq.each(function(){
$(this).textbox("clear");
$(this).numberbox("options").value="";
});
},reset:function(jq){
return jq.each(function(){
$(this).textbox("reset");
$(this).numberbox("setValue",$(this).numberbox("getValue"));
});
}};
$.fn.numberbox.parseOptions=function(_540){
var t=$(_540);
return $.extend({},$.fn.textbox.parseOptions(_540),$.parser.parseOptions(_540,["decimalSeparator","groupSeparator","suffix",{min:"number",max:"number",precision:"number"}]),{prefix:(t.attr("prefix")?t.attr("prefix"):undefined)});
};
$.fn.numberbox.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:{keypress:function(e){
var _541=e.data.target;
var opts=$(_541).numberbox("options");
return opts.filter.call(_541,e);
},blur:function(e){
var _542=e.data.target;
$(_542).numberbox("setValue",$(_542).numberbox("getText"));
},keydown:function(e){
if(e.keyCode==13){
var _543=e.data.target;
$(_543).numberbox("setValue",$(_543).numberbox("getText"));
}
}},min:null,max:null,precision:0,decimalSeparator:".",groupSeparator:"",prefix:"",suffix:"",filter:function(e){
var opts=$(this).numberbox("options");
var s=$(this).numberbox("getText");
if(e.which==13){
return true;
}
if(e.which==45){
return (s.indexOf("-")==-1?true:false);
}
var c=String.fromCharCode(e.which);
if(c==opts.decimalSeparator){
return (s.indexOf(c)==-1?true:false);
}else{
if(c==opts.groupSeparator){
return true;
}else{
if((e.which>=48&&e.which<=57&&e.ctrlKey==false&&e.shiftKey==false)||e.which==0||e.which==8){
return true;
}else{
if(e.ctrlKey==true&&(e.which==99||e.which==118)){
return true;
}else{
return false;
}
}
}
}
},formatter:function(_544){
if(!_544){
return _544;
}
_544=_544+"";
var opts=$(this).numberbox("options");
var s1=_544,s2="";
var dpos=_544.indexOf(".");
if(dpos>=0){
s1=_544.substring(0,dpos);
s2=_544.substring(dpos+1,_544.length);
}
if(opts.groupSeparator){
var p=/(\d+)(\d{3})/;
while(p.test(s1)){
s1=s1.replace(p,"$1"+opts.groupSeparator+"$2");
}
}
if(s2){
return opts.prefix+s1+opts.decimalSeparator+s2+opts.suffix;
}else{
return opts.prefix+s1+opts.suffix;
}
},parser:function(s){
s=s+"";
var opts=$(this).numberbox("options");
if(parseFloat(s)!=s){
if(opts.prefix){
s=$.trim(s.replace(new RegExp("\\"+$.trim(opts.prefix),"g"),""));
}
if(opts.suffix){
s=$.trim(s.replace(new RegExp("\\"+$.trim(opts.suffix),"g"),""));
}
if(opts.groupSeparator){
s=$.trim(s.replace(new RegExp("\\"+opts.groupSeparator,"g"),""));
}
if(opts.decimalSeparator){
s=$.trim(s.replace(new RegExp("\\"+opts.decimalSeparator,"g"),"."));
}
s=s.replace(/\s/g,"");
}
var val=parseFloat(s).toFixed(opts.precision);
if(isNaN(val)){
val="";
}else{
if(typeof (opts.min)=="number"&&val<opts.min){
val=opts.min.toFixed(opts.precision);
}else{
if(typeof (opts.max)=="number"&&val>opts.max){
val=opts.max.toFixed(opts.precision);
}
}
}
return val;
}});
})(jQuery);
(function($){
function _545(_546,_547){
var opts=$.data(_546,"calendar").options;
var t=$(_546);
if(_547){
$.extend(opts,{width:_547.width,height:_547.height});
}
t._size(opts,t.parent());
t.find(".calendar-body")._outerHeight(t.height()-t.find(".calendar-header")._outerHeight());
if(t.find(".calendar-menu").is(":visible")){
_548(_546);
}
};
function init(_549){
$(_549).addClass("calendar").html("<div class=\"calendar-header\">"+"<div class=\"calendar-nav calendar-prevmonth\"></div>"+"<div class=\"calendar-nav calendar-nextmonth\"></div>"+"<div class=\"calendar-nav calendar-prevyear\"></div>"+"<div class=\"calendar-nav calendar-nextyear\"></div>"+"<div class=\"calendar-title\">"+"<span class=\"calendar-text\"></span>"+"</div>"+"</div>"+"<div class=\"calendar-body\">"+"<div class=\"calendar-menu\">"+"<div class=\"calendar-menu-year-inner\">"+"<span class=\"calendar-nav calendar-menu-prev\"></span>"+"<span><input class=\"calendar-menu-year\" type=\"text\"></input></span>"+"<span class=\"calendar-nav calendar-menu-next\"></span>"+"</div>"+"<div class=\"calendar-menu-month-inner\">"+"</div>"+"</div>"+"</div>");
$(_549).bind("_resize",function(e,_54a){
if($(this).hasClass("ui-fluid")||_54a){
_545(_549);
}
return false;
});
};
function _54b(_54c){
var opts=$.data(_54c,"calendar").options;
var menu=$(_54c).find(".calendar-menu");
menu.find(".calendar-menu-year").unbind(".calendar").bind("keypress.calendar",function(e){
if(e.keyCode==13){
_54d(true);
}
});
$(_54c).unbind(".calendar").bind("mouseover.calendar",function(e){
var t=_54e(e.target);
if(t.hasClass("calendar-nav")||t.hasClass("calendar-text")||(t.hasClass("calendar-day")&&!t.hasClass("calendar-disabled"))){
t.addClass("calendar-nav-hover");
}
}).bind("mouseout.calendar",function(e){
var t=_54e(e.target);
if(t.hasClass("calendar-nav")||t.hasClass("calendar-text")||(t.hasClass("calendar-day")&&!t.hasClass("calendar-disabled"))){
t.removeClass("calendar-nav-hover");
}
}).bind("click.calendar",function(e){
var t=_54e(e.target);
if(t.hasClass("calendar-menu-next")||t.hasClass("calendar-nextyear")){
_54f(1);
}else{
if(t.hasClass("calendar-menu-prev")||t.hasClass("calendar-prevyear")){
_54f(-1);
}else{
if(t.hasClass("calendar-menu-month")){
menu.find(".calendar-selected").removeClass("calendar-selected");
t.addClass("calendar-selected");
_54d(true);
}else{
if(t.hasClass("calendar-prevmonth")){
_550(-1);
}else{
if(t.hasClass("calendar-nextmonth")){
_550(1);
}else{
if(t.hasClass("calendar-text")){
if(menu.is(":visible")){
menu.hide();
}else{
_548(_54c);
}
}else{
if(t.hasClass("calendar-day")){
if(t.hasClass("calendar-disabled")){
return;
}
var _551=opts.current;
t.closest("div.calendar-body").find(".calendar-selected").removeClass("calendar-selected");
t.addClass("calendar-selected");
var _552=t.attr("abbr").split(",");
var y=parseInt(_552[0]);
var m=parseInt(_552[1]);
var d=parseInt(_552[2]);
opts.current=new Date(y,m-1,d);
opts.onSelect.call(_54c,opts.current);
if(!_551||_551.getTime()!=opts.current.getTime()){
opts.onChange.call(_54c,opts.current,_551);
}
if(opts.year!=y||opts.month!=m){
opts.year=y;
opts.month=m;
show(_54c);
}
}
}
}
}
}
}
}
});
function _54e(t){
var day=$(t).closest(".calendar-day");
if(day.length){
return day;
}else{
return $(t);
}
};
function _54d(_553){
var menu=$(_54c).find(".calendar-menu");
var year=menu.find(".calendar-menu-year").val();
var _554=menu.find(".calendar-selected").attr("abbr");
if(!isNaN(year)){
opts.year=parseInt(year);
opts.month=parseInt(_554);
show(_54c);
}
if(_553){
menu.hide();
}
};
function _54f(_555){
opts.year+=_555;
show(_54c);
menu.find(".calendar-menu-year").val(opts.year);
};
function _550(_556){
opts.month+=_556;
if(opts.month>12){
opts.year++;
opts.month=1;
}else{
if(opts.month<1){
opts.year--;
opts.month=12;
}
}
show(_54c);
menu.find("td.calendar-selected").removeClass("calendar-selected");
menu.find("td:eq("+(opts.month-1)+")").addClass("calendar-selected");
};
};
function _548(_557){
var opts=$.data(_557,"calendar").options;
$(_557).find(".calendar-menu").show();
if($(_557).find(".calendar-menu-month-inner").is(":empty")){
$(_557).find(".calendar-menu-month-inner").empty();
var t=$("<table class=\"calendar-mtable\"></table>").appendTo($(_557).find(".calendar-menu-month-inner"));
var idx=0;
for(var i=0;i<3;i++){
var tr=$("<tr></tr>").appendTo(t);
for(var j=0;j<4;j++){
$("<td class=\"calendar-nav calendar-menu-month\"></td>").html(opts.months[idx++]).attr("abbr",idx).appendTo(tr);
}
}
}
var body=$(_557).find(".calendar-body");
var sele=$(_557).find(".calendar-menu");
var _558=sele.find(".calendar-menu-year-inner");
var _559=sele.find(".calendar-menu-month-inner");
_558.find("input").val(opts.year).focus();
_559.find("td.calendar-selected").removeClass("calendar-selected");
_559.find("td:eq("+(opts.month-1)+")").addClass("calendar-selected");
sele._outerWidth(body._outerWidth());
sele._outerHeight(body._outerHeight());
_559._outerHeight(sele.height()-_558._outerHeight());
};
function _55a(_55b,year,_55c){
var opts=$.data(_55b,"calendar").options;
var _55d=[];
var _55e=new Date(year,_55c,0).getDate();
for(var i=1;i<=_55e;i++){
_55d.push([year,_55c,i]);
}
var _55f=[],week=[];
var _560=-1;
while(_55d.length>0){
var date=_55d.shift();
week.push(date);
var day=new Date(date[0],date[1]-1,date[2]).getDay();
if(_560==day){
day=0;
}else{
if(day==(opts.firstDay==0?7:opts.firstDay)-1){
_55f.push(week);
week=[];
}
}
_560=day;
}
if(week.length){
_55f.push(week);
}
var _561=_55f[0];
if(_561.length<7){
while(_561.length<7){
var _562=_561[0];
var date=new Date(_562[0],_562[1]-1,_562[2]-1);
_561.unshift([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
}else{
var _562=_561[0];
var week=[];
for(var i=1;i<=7;i++){
var date=new Date(_562[0],_562[1]-1,_562[2]-i);
week.unshift([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
_55f.unshift(week);
}
var _563=_55f[_55f.length-1];
while(_563.length<7){
var _564=_563[_563.length-1];
var date=new Date(_564[0],_564[1]-1,_564[2]+1);
_563.push([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
if(_55f.length<6){
var _564=_563[_563.length-1];
var week=[];
for(var i=1;i<=7;i++){
var date=new Date(_564[0],_564[1]-1,_564[2]+i);
week.push([date.getFullYear(),date.getMonth()+1,date.getDate()]);
}
_55f.push(week);
}
return _55f;
};
function show(_565){
var opts=$.data(_565,"calendar").options;
if(opts.current&&!opts.validator.call(_565,opts.current)){
opts.current=null;
}
var now=new Date();
var _566=now.getFullYear()+","+(now.getMonth()+1)+","+now.getDate();
var _567=opts.current?(opts.current.getFullYear()+","+(opts.current.getMonth()+1)+","+opts.current.getDate()):"";
var _568=6-opts.firstDay;
var _569=_568+1;
if(_568>=7){
_568-=7;
}
if(_569>=7){
_569-=7;
}
$(_565).find(".calendar-title span").html(opts.months[opts.month-1]+" "+opts.year);
var body=$(_565).find("div.calendar-body");
body.children("table").remove();
var data=["<table class=\"calendar-dtable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">"];
data.push("<thead><tr>");
for(var i=opts.firstDay;i<opts.weeks.length;i++){
data.push("<th>"+opts.weeks[i]+"</th>");
}
for(var i=0;i<opts.firstDay;i++){
data.push("<th>"+opts.weeks[i]+"</th>");
}
data.push("</tr></thead>");
data.push("<tbody>");
var _56a=_55a(_565,opts.year,opts.month);
for(var i=0;i<_56a.length;i++){
var week=_56a[i];
var cls="";
if(i==0){
cls="calendar-first";
}else{
if(i==_56a.length-1){
cls="calendar-last";
}
}
data.push("<tr class=\""+cls+"\">");
for(var j=0;j<week.length;j++){
var day=week[j];
var s=day[0]+","+day[1]+","+day[2];
var _56b=new Date(day[0],parseInt(day[1])-1,day[2]);
var d=opts.formatter.call(_565,_56b);
var css=opts.styler.call(_565,_56b);
var _56c="";
var _56d="";
if(typeof css=="string"){
_56d=css;
}else{
if(css){
_56c=css["class"]||"";
_56d=css["style"]||"";
}
}
var cls="calendar-day";
if(!(opts.year==day[0]&&opts.month==day[1])){
cls+=" calendar-other-month";
}
if(s==_566){
cls+=" calendar-today";
}
if(s==_567){
cls+=" calendar-selected";
}
if(j==_568){
cls+=" calendar-saturday";
}else{
if(j==_569){
cls+=" calendar-sunday";
}
}
if(j==0){
cls+=" calendar-first";
}else{
if(j==week.length-1){
cls+=" calendar-last";
}
}
cls+=" "+_56c;
if(!opts.validator.call(_565,_56b)){
cls+=" calendar-disabled";
}
data.push("<td class=\""+cls+"\" abbr=\""+s+"\" style=\""+_56d+"\">"+d+"</td>");
}
data.push("</tr>");
}
data.push("</tbody>");
data.push("</table>");
body.append(data.join(""));
body.children("table.calendar-dtable").prependTo(body);
opts.onNavigate.call(_565,opts.year,opts.month);
};
$.fn.calendar=function(_56e,_56f){
if(typeof _56e=="string"){
return $.fn.calendar.methods[_56e](this,_56f);
}
_56e=_56e||{};
return this.each(function(){
var _570=$.data(this,"calendar");
if(_570){
$.extend(_570.options,_56e);
}else{
_570=$.data(this,"calendar",{options:$.extend({},$.fn.calendar.defaults,$.fn.calendar.parseOptions(this),_56e)});
init(this);
}
if(_570.options.border==false){
$(this).addClass("calendar-noborder");
}
_545(this);
_54b(this);
show(this);
$(this).find("div.calendar-menu").hide();
});
};
$.fn.calendar.methods={options:function(jq){
return $.data(jq[0],"calendar").options;
},resize:function(jq,_571){
return jq.each(function(){
_545(this,_571);
});
},moveTo:function(jq,date){
return jq.each(function(){
if(!date){
var now=new Date();
$(this).calendar({year:now.getFullYear(),month:now.getMonth()+1,current:date});
return;
}
var opts=$(this).calendar("options");
if(opts.validator.call(this,date)){
var _572=opts.current;
$(this).calendar({year:date.getFullYear(),month:date.getMonth()+1,current:date});
if(!_572||_572.getTime()!=date.getTime()){
opts.onChange.call(this,opts.current,_572);
}
}
});
}};
$.fn.calendar.parseOptions=function(_573){
var t=$(_573);
return $.extend({},$.parser.parseOptions(_573,[{firstDay:"number",fit:"boolean",border:"boolean"}]));
};
$.fn.calendar.defaults={width:180,height:180,fit:false,border:true,firstDay:0,weeks:["S","M","T","W","T","F","S"],months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],year:new Date().getFullYear(),month:new Date().getMonth()+1,current:(function(){
var d=new Date();
return new Date(d.getFullYear(),d.getMonth(),d.getDate());
})(),formatter:function(date){
return date.getDate();
},styler:function(date){
return "";
},validator:function(date){
return true;
},onSelect:function(date){
},onChange:function(_574,_575){
},onNavigate:function(year,_576){
}};
})(jQuery);
(function($){
function _577(_578){
var _579=$.data(_578,"spinner");
var opts=_579.options;
var _57a=$.extend(true,[],opts.icons);
_57a.push({iconCls:"spinner-arrow",handler:function(e){
_57b(e);
}});
$(_578).addClass("spinner-f").textbox($.extend({},opts,{icons:_57a}));
var _57c=$(_578).textbox("getIcon",_57a.length-1);
_57c.append("<a href=\"javascript:void(0)\" class=\"spinner-arrow-up\" tabindex=\"-1\"></a>");
_57c.append("<a href=\"javascript:void(0)\" class=\"spinner-arrow-down\" tabindex=\"-1\"></a>");
$(_578).attr("spinnerName",$(_578).attr("textboxName"));
_579.spinner=$(_578).next();
_579.spinner.addClass("spinner");
};
function _57b(e){
var _57d=e.data.target;
var opts=$(_57d).spinner("options");
var up=$(e.target).closest("a.spinner-arrow-up");
if(up.length){
opts.spin.call(_57d,false);
opts.onSpinUp.call(_57d);
$(_57d).spinner("validate");
}
var down=$(e.target).closest("a.spinner-arrow-down");
if(down.length){
opts.spin.call(_57d,true);
opts.onSpinDown.call(_57d);
$(_57d).spinner("validate");
}
};
$.fn.spinner=function(_57e,_57f){
if(typeof _57e=="string"){
var _580=$.fn.spinner.methods[_57e];
if(_580){
return _580(this,_57f);
}else{
return this.textbox(_57e,_57f);
}
}
_57e=_57e||{};
return this.each(function(){
var _581=$.data(this,"spinner");
if(_581){
$.extend(_581.options,_57e);
}else{
_581=$.data(this,"spinner",{options:$.extend({},$.fn.spinner.defaults,$.fn.spinner.parseOptions(this),_57e)});
}
_577(this);
});
};
$.fn.spinner.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"spinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.spinner.parseOptions=function(_582){
return $.extend({},$.fn.textbox.parseOptions(_582),$.parser.parseOptions(_582,["min","max",{increment:"number"}]));
};
$.fn.spinner.defaults=$.extend({},$.fn.textbox.defaults,{min:null,max:null,increment:1,spin:function(down){
},onSpinUp:function(){
},onSpinDown:function(){
}});
})(jQuery);
(function($){
function _583(_584){
$(_584).addClass("numberspinner-f");
var opts=$.data(_584,"numberspinner").options;
$(_584).numberbox(opts).spinner(opts);
$(_584).numberbox("setValue",opts.value);
};
function _585(_586,down){
var opts=$.data(_586,"numberspinner").options;
var v=parseFloat($(_586).numberbox("getValue")||opts.value)||0;
if(down){
v-=opts.increment;
}else{
v+=opts.increment;
}
$(_586).numberbox("setValue",v);
};
$.fn.numberspinner=function(_587,_588){
if(typeof _587=="string"){
var _589=$.fn.numberspinner.methods[_587];
if(_589){
return _589(this,_588);
}else{
return this.numberbox(_587,_588);
}
}
_587=_587||{};
return this.each(function(){
var _58a=$.data(this,"numberspinner");
if(_58a){
$.extend(_58a.options,_587);
}else{
$.data(this,"numberspinner",{options:$.extend({},$.fn.numberspinner.defaults,$.fn.numberspinner.parseOptions(this),_587)});
}
_583(this);
});
};
$.fn.numberspinner.methods={options:function(jq){
var opts=jq.numberbox("options");
return $.extend($.data(jq[0],"numberspinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.numberspinner.parseOptions=function(_58b){
return $.extend({},$.fn.spinner.parseOptions(_58b),$.fn.numberbox.parseOptions(_58b),{});
};
$.fn.numberspinner.defaults=$.extend({},$.fn.spinner.defaults,$.fn.numberbox.defaults,{spin:function(down){
_585(this,down);
}});
})(jQuery);
(function($){
function _58c(_58d){
var _58e=0;
if(typeof _58d.selectionStart=="number"){
_58e=_58d.selectionStart;
}else{
if(_58d.createTextRange){
var _58f=_58d.createTextRange();
var s=document.selection.createRange();
s.setEndPoint("StartToStart",_58f);
_58e=s.text.length;
}
}
return _58e;
};
function _590(_591,_592,end){
if(_591.setSelectionRange){
_591.setSelectionRange(_592,end);
}else{
if(_591.createTextRange){
var _593=_591.createTextRange();
_593.collapse();
_593.moveEnd("character",end);
_593.moveStart("character",_592);
_593.select();
}
}
};
function _594(_595){
var opts=$.data(_595,"timespinner").options;
$(_595).addClass("timespinner-f").spinner(opts);
var _596=opts.formatter.call(_595,opts.parser.call(_595,opts.value));
$(_595).timespinner("initValue",_596);
};
function _597(e){
var _598=e.data.target;
var opts=$.data(_598,"timespinner").options;
var _599=_58c(this);
for(var i=0;i<opts.selections.length;i++){
var _59a=opts.selections[i];
if(_599>=_59a[0]&&_599<=_59a[1]){
_59b(_598,i);
return;
}
}
};
function _59b(_59c,_59d){
var opts=$.data(_59c,"timespinner").options;
if(_59d!=undefined){
opts.highlight=_59d;
}
var _59e=opts.selections[opts.highlight];
if(_59e){
var tb=$(_59c).timespinner("textbox");
_590(tb[0],_59e[0],_59e[1]);
tb.focus();
}
};
function _59f(_5a0,_5a1){
var opts=$.data(_5a0,"timespinner").options;
var _5a1=opts.parser.call(_5a0,_5a1);
var text=opts.formatter.call(_5a0,_5a1);
$(_5a0).spinner("setValue",text);
};
function _5a2(_5a3,down){
var opts=$.data(_5a3,"timespinner").options;
var s=$(_5a3).timespinner("getValue");
var _5a4=opts.selections[opts.highlight];
var s1=s.substring(0,_5a4[0]);
var s2=s.substring(_5a4[0],_5a4[1]);
var s3=s.substring(_5a4[1]);
var v=s1+((parseInt(s2)||0)+opts.increment*(down?-1:1))+s3;
$(_5a3).timespinner("setValue",v);
_59b(_5a3);
};
$.fn.timespinner=function(_5a5,_5a6){
if(typeof _5a5=="string"){
var _5a7=$.fn.timespinner.methods[_5a5];
if(_5a7){
return _5a7(this,_5a6);
}else{
return this.spinner(_5a5,_5a6);
}
}
_5a5=_5a5||{};
return this.each(function(){
var _5a8=$.data(this,"timespinner");
if(_5a8){
$.extend(_5a8.options,_5a5);
}else{
$.data(this,"timespinner",{options:$.extend({},$.fn.timespinner.defaults,$.fn.timespinner.parseOptions(this),_5a5)});
}
_594(this);
});
};
$.fn.timespinner.methods={options:function(jq){
var opts=jq.data("spinner")?jq.spinner("options"):{};
return $.extend($.data(jq[0],"timespinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
},setValue:function(jq,_5a9){
return jq.each(function(){
_59f(this,_5a9);
});
},getHours:function(jq){
var opts=$.data(jq[0],"timespinner").options;
var vv=jq.timespinner("getValue").split(opts.separator);
return parseInt(vv[0],10);
},getMinutes:function(jq){
var opts=$.data(jq[0],"timespinner").options;
var vv=jq.timespinner("getValue").split(opts.separator);
return parseInt(vv[1],10);
},getSeconds:function(jq){
var opts=$.data(jq[0],"timespinner").options;
var vv=jq.timespinner("getValue").split(opts.separator);
return parseInt(vv[2],10)||0;
}};
$.fn.timespinner.parseOptions=function(_5aa){
return $.extend({},$.fn.spinner.parseOptions(_5aa),$.parser.parseOptions(_5aa,["separator",{showSeconds:"boolean",highlight:"number"}]));
};
$.fn.timespinner.defaults=$.extend({},$.fn.spinner.defaults,{inputEvents:$.extend({},$.fn.spinner.defaults.inputEvents,{click:function(e){
_597.call(this,e);
},blur:function(e){
var t=$(e.data.target);
t.timespinner("setValue",t.timespinner("getText"));
},keydown:function(e){
if(e.keyCode==13){
var t=$(e.data.target);
t.timespinner("setValue",t.timespinner("getText"));
}
}}),formatter:function(date){
if(!date){
return "";
}
var opts=$(this).timespinner("options");
var tt=[_5ab(date.getHours()),_5ab(date.getMinutes())];
if(opts.showSeconds){
tt.push(_5ab(date.getSeconds()));
}
return tt.join(opts.separator);
function _5ab(_5ac){
return (_5ac<10?"0":"")+_5ac;
};
},parser:function(s){
var opts=$(this).timespinner("options");
var date=_5ad(s);
if(date){
var min=_5ad(opts.min);
var max=_5ad(opts.max);
if(min&&min>date){
date=min;
}
if(max&&max<date){
date=max;
}
}
return date;
function _5ad(s){
if(!s){
return null;
}
var tt=s.split(opts.separator);
return new Date(1900,0,0,parseInt(tt[0],10)||0,parseInt(tt[1],10)||0,parseInt(tt[2],10)||0);
};
if(!s){
return null;
}
var tt=s.split(opts.separator);
return new Date(1900,0,0,parseInt(tt[0],10)||0,parseInt(tt[1],10)||0,parseInt(tt[2],10)||0);
},selections:[[0,2],[3,5],[6,8]],separator:":",showSeconds:false,highlight:0,spin:function(down){
_5a2(this,down);
}});
})(jQuery);
(function($){
function _5ae(_5af){
var opts=$.data(_5af,"datetimespinner").options;
$(_5af).addClass("datetimespinner-f").timespinner(opts);
};
$.fn.datetimespinner=function(_5b0,_5b1){
if(typeof _5b0=="string"){
var _5b2=$.fn.datetimespinner.methods[_5b0];
if(_5b2){
return _5b2(this,_5b1);
}else{
return this.timespinner(_5b0,_5b1);
}
}
_5b0=_5b0||{};
return this.each(function(){
var _5b3=$.data(this,"datetimespinner");
if(_5b3){
$.extend(_5b3.options,_5b0);
}else{
$.data(this,"datetimespinner",{options:$.extend({},$.fn.datetimespinner.defaults,$.fn.datetimespinner.parseOptions(this),_5b0)});
}
_5ae(this);
});
};
$.fn.datetimespinner.methods={options:function(jq){
var opts=jq.timespinner("options");
return $.extend($.data(jq[0],"datetimespinner").options,{width:opts.width,value:opts.value,originalValue:opts.originalValue,disabled:opts.disabled,readonly:opts.readonly});
}};
$.fn.datetimespinner.parseOptions=function(_5b4){
return $.extend({},$.fn.timespinner.parseOptions(_5b4),$.parser.parseOptions(_5b4,[]));
};
$.fn.datetimespinner.defaults=$.extend({},$.fn.timespinner.defaults,{formatter:function(date){
if(!date){
return "";
}
return $.fn.datebox.defaults.formatter.call(this,date)+" "+$.fn.timespinner.defaults.formatter.call(this,date);
},parser:function(s){
s=$.trim(s);
if(!s){
return null;
}
var dt=s.split(" ");
var _5b5=$.fn.datebox.defaults.parser.call(this,dt[0]);
if(dt.length<2){
return _5b5;
}
var _5b6=$.fn.timespinner.defaults.parser.call(this,dt[1]);
return new Date(_5b5.getFullYear(),_5b5.getMonth(),_5b5.getDate(),_5b6.getHours(),_5b6.getMinutes(),_5b6.getSeconds());
},selections:[[0,2],[3,5],[6,10],[11,13],[14,16],[17,19]]});
})(jQuery);
(function($){
var _5b7=0;
function _5b8(a,o){
for(var i=0,len=a.length;i<len;i++){
if(a[i]==o){
return i;
}
}
return -1;
};
function _5b9(a,o,id){
if(typeof o=="string"){
for(var i=0,len=a.length;i<len;i++){
if(a[i][o]==id){
a.splice(i,1);
return;
}
}
}else{
var _5ba=_5b8(a,o);
if(_5ba!=-1){
a.splice(_5ba,1);
}
}
};
function _5bb(a,o,r){
for(var i=0,len=a.length;i<len;i++){
if(a[i][o]==r[o]){
return;
}
}
a.push(r);
};
function _5bc(_5bd,aa){
return $.data(_5bd,"treegrid")?aa.slice(1):aa;
};
function _5be(_5bf){
var _5c0=$.data(_5bf,"datagrid");
var opts=_5c0.options;
var _5c1=_5c0.panel;
var dc=_5c0.dc;
var ss=null;
if(opts.sharedStyleSheet){
ss=typeof opts.sharedStyleSheet=="boolean"?"head":opts.sharedStyleSheet;
}else{
ss=_5c1.closest("div.datagrid-view");
if(!ss.length){
ss=dc.view;
}
}
var cc=$(ss);
var _5c2=$.data(cc[0],"ss");
if(!_5c2){
_5c2=$.data(cc[0],"ss",{cache:{},dirty:[]});
}
return {add:function(_5c3){
var ss=["<style type=\"text/css\" easyui=\"true\">"];
for(var i=0;i<_5c3.length;i++){
_5c2.cache[_5c3[i][0]]={width:_5c3[i][1]};
}
var _5c4=0;
for(var s in _5c2.cache){
var item=_5c2.cache[s];
item.index=_5c4++;
ss.push(s+"{width:"+item.width+"}");
}
ss.push("</style>");
$(ss.join("\n")).appendTo(cc);
cc.children("style[easyui]:not(:last)").remove();
},getRule:function(_5c5){
var _5c6=cc.children("style[easyui]:last")[0];
var _5c7=_5c6.styleSheet?_5c6.styleSheet:(_5c6.sheet||document.styleSheets[document.styleSheets.length-1]);
var _5c8=_5c7.cssRules||_5c7.rules;
return _5c8[_5c5];
},set:function(_5c9,_5ca){
var item=_5c2.cache[_5c9];
if(item){
item.width=_5ca;
var rule=this.getRule(item.index);
if(rule){
rule.style["width"]=_5ca;
}
}
},remove:function(_5cb){
var tmp=[];
for(var s in _5c2.cache){
if(s.indexOf(_5cb)==-1){
tmp.push([s,_5c2.cache[s].width]);
}
}
_5c2.cache={};
this.add(tmp);
},dirty:function(_5cc){
if(_5cc){
_5c2.dirty.push(_5cc);
}
},clean:function(){
for(var i=0;i<_5c2.dirty.length;i++){
this.remove(_5c2.dirty[i]);
}
_5c2.dirty=[];
}};
};
function _5cd(_5ce,_5cf){
var _5d0=$.data(_5ce,"datagrid");
var opts=_5d0.options;
var _5d1=_5d0.panel;
if(_5cf){
$.extend(opts,_5cf);
}
if(opts.fit==true){
var p=_5d1.panel("panel").parent();
opts.width=p.width();
opts.height=p.height();
}
_5d1.panel("resize",opts);
};
function _5d2(_5d3){
var _5d4=$.data(_5d3,"datagrid");
var opts=_5d4.options;
var dc=_5d4.dc;
var wrap=_5d4.panel;
var _5d5=wrap.width();
var _5d6=wrap.height();
var view=dc.view;
var _5d7=dc.view1;
var _5d8=dc.view2;
var _5d9=_5d7.children("div.datagrid-header");
var _5da=_5d8.children("div.datagrid-header");
var _5db=_5d9.find("table");
var _5dc=_5da.find("table");
view.width(_5d5);
var _5dd=_5d9.children("div.datagrid-header-inner").show();
_5d7.width(_5dd.find("table").width());
if(!opts.showHeader){
_5dd.hide();
}
_5d8.width(_5d5-_5d7._outerWidth());
_5d7.children()._outerWidth(_5d7.width());
_5d8.children()._outerWidth(_5d8.width());
var all=_5d9.add(_5da).add(_5db).add(_5dc);
all.css("height","");
var hh=Math.max(_5db.height(),_5dc.height());
all._outerHeight(hh);
dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({position:"absolute",top:dc.header2._outerHeight()});
var _5de=dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
var _5df=_5de+_5da._outerHeight()+_5d8.children(".datagrid-footer")._outerHeight();
wrap.children(":not(.datagrid-view,.datagrid-mask,.datagrid-mask-msg)").each(function(){
_5df+=$(this)._outerHeight();
});
var _5e0=wrap.outerHeight()-wrap.height();
var _5e1=wrap._size("minHeight")||"";
var _5e2=wrap._size("maxHeight")||"";
_5d7.add(_5d8).children("div.datagrid-body").css({marginTop:_5de,height:(isNaN(parseInt(opts.height))?"":(_5d6-_5df)),minHeight:(_5e1?_5e1-_5e0-_5df:""),maxHeight:(_5e2?_5e2-_5e0-_5df:"")});
view.height(_5d8.height());
};
function _5e3(_5e4,_5e5,_5e6){
var rows=$.data(_5e4,"datagrid").data.rows;
var opts=$.data(_5e4,"datagrid").options;
var dc=$.data(_5e4,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight||_5e6)){
if(_5e5!=undefined){
var tr1=opts.finder.getTr(_5e4,_5e5,"body",1);
var tr2=opts.finder.getTr(_5e4,_5e5,"body",2);
_5e7(tr1,tr2);
}else{
var tr1=opts.finder.getTr(_5e4,0,"allbody",1);
var tr2=opts.finder.getTr(_5e4,0,"allbody",2);
_5e7(tr1,tr2);
if(opts.showFooter){
var tr1=opts.finder.getTr(_5e4,0,"allfooter",1);
var tr2=opts.finder.getTr(_5e4,0,"allfooter",2);
_5e7(tr1,tr2);
}
}
}
_5d2(_5e4);
if(opts.height=="auto"){
var _5e8=dc.body1.parent();
var _5e9=dc.body2;
var _5ea=_5eb(_5e9);
var _5ec=_5ea.height;
if(_5ea.width>_5e9.width()){
_5ec+=18;
}
_5ec-=parseInt(_5e9.css("marginTop"))||0;
_5e8.height(_5ec);
_5e9.height(_5ec);
dc.view.height(dc.view2.height());
}
dc.body2.triggerHandler("scroll");
function _5e7(trs1,trs2){
for(var i=0;i<trs2.length;i++){
var tr1=$(trs1[i]);
var tr2=$(trs2[i]);
tr1.css("height","");
tr2.css("height","");
var _5ed=Math.max(tr1.height(),tr2.height());
tr1.css("height",_5ed);
tr2.css("height",_5ed);
}
};
function _5eb(cc){
var _5ee=0;
var _5ef=0;
$(cc).children().each(function(){
var c=$(this);
if(c.is(":visible")){
_5ef+=c._outerHeight();
if(_5ee<c._outerWidth()){
_5ee=c._outerWidth();
}
}
});
return {width:_5ee,height:_5ef};
};
};
function _5f0(_5f1,_5f2){
var _5f3=$.data(_5f1,"datagrid");
var opts=_5f3.options;
var dc=_5f3.dc;
if(!dc.body2.children("table.datagrid-btable-frozen").length){
dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
}
_5f4(true);
_5f4(false);
_5d2(_5f1);
function _5f4(_5f5){
var _5f6=_5f5?1:2;
var tr=opts.finder.getTr(_5f1,_5f2,"body",_5f6);
(_5f5?dc.body1:dc.body2).children("table.datagrid-btable-frozen").append(tr);
};
};
function _5f7(_5f8,_5f9){
function _5fa(){
var _5fb=[];
var _5fc=[];
$(_5f8).children("thead").each(function(){
var opt=$.parser.parseOptions(this,[{frozen:"boolean"}]);
$(this).find("tr").each(function(){
var cols=[];
$(this).find("th").each(function(){
var th=$(this);
var col=$.extend({},$.parser.parseOptions(this,["field","align","halign","order","width",{sortable:"boolean",checkbox:"boolean",resizable:"boolean",fixed:"boolean"},{rowspan:"number",colspan:"number"}]),{title:(th.html()||undefined),hidden:(th.attr("hidden")?true:undefined),formatter:(th.attr("formatter")?eval(th.attr("formatter")):undefined),styler:(th.attr("styler")?eval(th.attr("styler")):undefined),sorter:(th.attr("sorter")?eval(th.attr("sorter")):undefined)});
if(col.width&&String(col.width).indexOf("%")==-1){
col.width=parseInt(col.width);
}
if(th.attr("editor")){
var s=$.trim(th.attr("editor"));
if(s.substr(0,1)=="{"){
col.editor=eval("("+s+")");
}else{
col.editor=s;
}
}
cols.push(col);
});
opt.frozen?_5fb.push(cols):_5fc.push(cols);
});
});
return [_5fb,_5fc];
};
var _5fd=$("<div class=\"datagrid-wrap\">"+"<div class=\"datagrid-view\">"+"<div class=\"datagrid-view1\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\">"+"<div class=\"datagrid-body-inner\"></div>"+"</div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"<div class=\"datagrid-view2\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\"></div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"</div>"+"</div>").insertAfter(_5f8);
_5fd.panel({doSize:false,cls:"datagrid"});
$(_5f8).addClass("datagrid-f").hide().appendTo(_5fd.children("div.datagrid-view"));
var cc=_5fa();
var view=_5fd.children("div.datagrid-view");
var _5fe=view.children("div.datagrid-view1");
var _5ff=view.children("div.datagrid-view2");
return {panel:_5fd,frozenColumns:cc[0],columns:cc[1],dc:{view:view,view1:_5fe,view2:_5ff,header1:_5fe.children("div.datagrid-header").children("div.datagrid-header-inner"),header2:_5ff.children("div.datagrid-header").children("div.datagrid-header-inner"),body1:_5fe.children("div.datagrid-body").children("div.datagrid-body-inner"),body2:_5ff.children("div.datagrid-body"),footer1:_5fe.children("div.datagrid-footer").children("div.datagrid-footer-inner"),footer2:_5ff.children("div.datagrid-footer").children("div.datagrid-footer-inner")}};
};
function _600(_601){
var _602=$.data(_601,"datagrid");
var opts=_602.options;
var dc=_602.dc;
var _603=_602.panel;
_602.ss=$(_601).datagrid("createStyleSheet");
_603.panel($.extend({},opts,{id:null,doSize:false,onResize:function(_604,_605){
if($.data(_601,"datagrid")){
_5d2(_601);
$(_601).datagrid("fitColumns");
opts.onResize.call(_603,_604,_605);
}
},onExpand:function(){
if($.data(_601,"datagrid")){
$(_601).datagrid("fixRowHeight").datagrid("fitColumns");
opts.onExpand.call(_603);
}
}}));
_602.rowIdPrefix="datagrid-row-r"+(++_5b7);
_602.cellClassPrefix="datagrid-cell-c"+_5b7;
_606(dc.header1,opts.frozenColumns,true);
_606(dc.header2,opts.columns,false);
_607();
dc.header1.add(dc.header2).css("display",opts.showHeader?"block":"none");
dc.footer1.add(dc.footer2).css("display",opts.showFooter?"block":"none");
if(opts.toolbar){
if($.isArray(opts.toolbar)){
$("div.datagrid-toolbar",_603).remove();
//Modified by gongjg on 2014-01-03
//Ϊtable���align����
//ԭ����: var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_603);
var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\" align=\"left\"><tr></tr></table></div>").prependTo(_603);
var tr=tb.find("tr");
for(var i=0;i<opts.toolbar.length;i++){
var btn=opts.toolbar[i];
if(btn=="-"){
$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var tool=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
tool[0].onclick=eval(btn.handler||function(){
});
//Modified by gongjg on 2015-10-10
//Ϊtoolbar���menubutton
//ԭ����:tool.linkbutton($.extend({},btn,{plain:true}));
//�޸Ŀ�ʼ
if(btn.type == 'menubutton') {
	tool.menubutton($.extend({},btn,{plain:true}));
}else {
	tool.linkbutton($.extend({},btn,{plain:true}));
}
//�޸Ľ���
}
}
}else{
$(opts.toolbar).addClass("datagrid-toolbar").prependTo(_603);
$(opts.toolbar).show();
}
}else{
$("div.datagrid-toolbar",_603).remove();
}
$("div.datagrid-pager",_603).remove();
if(opts.pagination){
var _608=$("<div class=\"datagrid-pager\"></div>");
if(opts.pagePosition=="bottom"){
_608.appendTo(_603);
}else{
if(opts.pagePosition=="top"){
_608.addClass("datagrid-pager-top").prependTo(_603);
}else{
var ptop=$("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_603);
_608.appendTo(_603);
_608=_608.add(ptop);
}
}
_608.pagination({total:(opts.pageNumber*opts.pageSize),pageNumber:opts.pageNumber,pageSize:opts.pageSize,pageList:opts.pageList,onSelectPage:function(_609,_60a){
opts.pageNumber=_609||1;
opts.pageSize=_60a;
_608.pagination("refresh",{pageNumber:_609,pageSize:_60a});
_646(_601);
}});
opts.pageSize=_608.pagination("options").pageSize;
}
function _606(_60b,_60c,_60d){
if(!_60c){
return;
}
$(_60b).show();
$(_60b).empty();
var _60e=[];
var _60f=[];
if(opts.sortName){
_60e=opts.sortName.split(",");
_60f=opts.sortOrder.split(",");
}
var t=$("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_60b);
for(var i=0;i<_60c.length;i++){
var tr=$("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody",t));
var cols=_60c[i];
for(var j=0;j<cols.length;j++){
var col=cols[j];
var attr="";
if(col.rowspan){
attr+="rowspan=\""+col.rowspan+"\" ";
}
if(col.colspan){
attr+="colspan=\""+col.colspan+"\" ";
}
var td=$("<td "+attr+"></td>").appendTo(tr);
if(col.checkbox){
td.attr("field",col.field);
$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
}else{
if(col.field){
td.attr("field",col.field);
td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
$("span",td).html(col.title);
$("span.datagrid-sort-icon",td).html("&nbsp;");
var cell=td.find("div.datagrid-cell");
var pos=_5b8(_60e,col.field);
if(pos>=0){
cell.addClass("datagrid-sort-"+_60f[pos]);
}
if(col.resizable==false){
cell.attr("resizable","false");
}
if(col.width){
var _610=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize);
cell._outerWidth(_610-1);
col.boxWidth=parseInt(cell[0].style.width);
col.deltaWidth=_610-col.boxWidth;
}else{
col.auto=true;
}
cell.css("text-align",(col.halign||col.align||""));
col.cellClass=_602.cellClassPrefix+"-"+col.field.replace(/[\.|\s]/g,"-");
cell.addClass(col.cellClass).css("width","");
}else{
$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
}
}
if(col.hidden){
td.hide();
}
}
}
if(_60d&&opts.rownumbers){
var td=$("<td rowspan=\""+opts.frozenColumns.length+"\"><div class=\"datagrid-header-rownumber\"></div></td>");
if($("tr",t).length==0){
td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody",t));
}else{
td.prependTo($("tr:first",t));
}
}
};
function _607(){
var _611=[];
var _612=_613(_601,true).concat(_613(_601));
for(var i=0;i<_612.length;i++){
var col=_614(_601,_612[i]);
if(col&&!col.checkbox){
_611.push(["."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto"]);
}
}
_602.ss.add(_611);
_602.ss.dirty(_602.cellSelectorPrefix);
_602.cellSelectorPrefix="."+_602.cellClassPrefix;
};
};
function _615(_616){
var _617=$.data(_616,"datagrid");
var _618=_617.panel;
var opts=_617.options;
var dc=_617.dc;
var _619=dc.header1.add(dc.header2);
_619.find("input[type=checkbox]").unbind(".datagrid").bind("click.datagrid",function(e){
if(opts.singleSelect&&opts.selectOnCheck){
return false;
}
if($(this).is(":checked")){
_6b0(_616);
}else{
_6b6(_616);
}
e.stopPropagation();
});
var _61a=_619.find("div.datagrid-cell");
_61a.closest("td").unbind(".datagrid").bind("mouseenter.datagrid",function(){
if(_617.resizing){
return;
}
$(this).addClass("datagrid-header-over");
}).bind("mouseleave.datagrid",function(){
$(this).removeClass("datagrid-header-over");
}).bind("contextmenu.datagrid",function(e){
var _61b=$(this).attr("field");
opts.onHeaderContextMenu.call(_616,e,_61b);
});
_61a.unbind(".datagrid").bind("click.datagrid",function(e){
var p1=$(this).offset().left+5;
var p2=$(this).offset().left+$(this)._outerWidth()-5;
if(e.pageX<p2&&e.pageX>p1){
_63b(_616,$(this).parent().attr("field"));
}
}).bind("dblclick.datagrid",function(e){
var p1=$(this).offset().left+5;
var p2=$(this).offset().left+$(this)._outerWidth()-5;
var cond=opts.resizeHandle=="right"?(e.pageX>p2):(opts.resizeHandle=="left"?(e.pageX<p1):(e.pageX<p1||e.pageX>p2));
if(cond){
var _61c=$(this).parent().attr("field");
var col=_614(_616,_61c);
if(col.resizable==false){
return;
}
$(_616).datagrid("autoSizeColumn",_61c);
col.auto=false;
}
});
var _61d=opts.resizeHandle=="right"?"e":(opts.resizeHandle=="left"?"w":"e,w");
_61a.each(function(){
$(this).resizable({handles:_61d,disabled:($(this).attr("resizable")?$(this).attr("resizable")=="false":false),minWidth:25,onStartResize:function(e){
_617.resizing=true;
_619.css("cursor",$("body").css("cursor"));
if(!_617.proxy){
_617.proxy=$("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
}
_617.proxy.css({left:e.pageX-$(_618).offset().left-1,display:"none"});
setTimeout(function(){
if(_617.proxy){
_617.proxy.show();
}
},500);
},onResize:function(e){
_617.proxy.css({left:e.pageX-$(_618).offset().left-1,display:"block"});
return false;
},onStopResize:function(e){
_619.css("cursor","");
$(this).css("height","");
var _61e=$(this).parent().attr("field");
var col=_614(_616,_61e);
col.width=$(this)._outerWidth();
col.boxWidth=col.width-col.deltaWidth;
col.auto=undefined;
$(this).css("width","");
$(_616).datagrid("fixColumnSize",_61e);
_617.proxy.remove();
_617.proxy=null;
if($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")){
_5d2(_616);
}
$(_616).datagrid("fitColumns");
opts.onResizeColumn.call(_616,_61e,col.width);
setTimeout(function(){
_617.resizing=false;
},0);
}});
});
var bb=dc.body1.add(dc.body2);
bb.unbind();
for(var _61f in opts.rowEvents){
bb.bind(_61f,opts.rowEvents[_61f]);
}
dc.body1.bind("mousewheel DOMMouseScroll",function(e){
var e1=e.originalEvent||window.event;
var _620=e1.wheelDelta||e1.detail*(-1);
var dg=$(e.target).closest("div.datagrid-view").children(".datagrid-f");
var dc=dg.data("datagrid").dc;
dc.body2.scrollTop(dc.body2.scrollTop()-_620);
});
dc.body2.bind("scroll",function(){
var b1=dc.view1.children("div.datagrid-body");
b1.scrollTop($(this).scrollTop());
var c1=dc.body1.children(":first");
var c2=dc.body2.children(":first");
if(c1.length&&c2.length){
var top1=c1.offset().top;
var top2=c2.offset().top;
if(top1!=top2){
b1.scrollTop(b1.scrollTop()+top1-top2);
}
}
dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
dc.body2.children("table.datagrid-btable-frozen").css("left",-$(this)._scrollLeft());
});
};
function _621(_622){
return function(e){
var tr=_623(e.target);
if(!tr){
return;
}
var _624=_625(tr);
if($.data(_624,"datagrid").resizing){
return;
}
var _626=_627(tr);
if(_622){
_628(_624,_626);
}else{
var opts=$.data(_624,"datagrid").options;
opts.finder.getTr(_624,_626).removeClass("datagrid-row-over");
}
};
};
function _629(e){
var tr=_623(e.target);
if(!tr){
return;
}
var _62a=_625(tr);
var opts=$.data(_62a,"datagrid").options;
var _62b=_627(tr);
var tt=$(e.target);
if(tt.parent().hasClass("datagrid-cell-check")){
if(opts.singleSelect&&opts.selectOnCheck){
tt._propAttr("checked",!tt.is(":checked"));
_62c(_62a,_62b);
}else{
if(tt.is(":checked")){
tt._propAttr("checked",false);
_62c(_62a,_62b);
}else{
tt._propAttr("checked",true);
_62d(_62a,_62b);
}
}
}else{
var row=opts.finder.getRow(_62a,_62b);
var td=tt.closest("td[field]",tr);
if(td.length){
var _62e=td.attr("field");
opts.onClickCell.call(_62a,_62b,_62e,row[_62e]);
}
if(opts.singleSelect==true){
_62f(_62a,_62b);
}else{
if(opts.ctrlSelect){
if(e.ctrlKey){
if(tr.hasClass("datagrid-row-selected")){
_630(_62a,_62b);
}else{
_62f(_62a,_62b);
}
}else{
if(e.shiftKey){
$(_62a).datagrid("clearSelections");
var _631=Math.min(opts.lastSelectedIndex||0,_62b);
var _632=Math.max(opts.lastSelectedIndex||0,_62b);
for(var i=_631;i<=_632;i++){
_62f(_62a,i);
}
}else{
$(_62a).datagrid("clearSelections");
_62f(_62a,_62b);
opts.lastSelectedIndex=_62b;
}
}
}else{
if(tr.hasClass("datagrid-row-selected")){
_630(_62a,_62b);
}else{
_62f(_62a,_62b);
}
}
}
opts.onClickRow.apply(_62a,_5bc(_62a,[_62b,row]));
}
};
function _633(e){
var tr=_623(e.target);
if(!tr){
return;
}
var _634=_625(tr);
var opts=$.data(_634,"datagrid").options;
var _635=_627(tr);
var row=opts.finder.getRow(_634,_635);
var td=$(e.target).closest("td[field]",tr);
if(td.length){
var _636=td.attr("field");
opts.onDblClickCell.call(_634,_635,_636,row[_636]);
}
opts.onDblClickRow.apply(_634,_5bc(_634,[_635,row]));
};
function _637(e){
var tr=_623(e.target);
if(tr){
var _638=_625(tr);
var opts=$.data(_638,"datagrid").options;
var _639=_627(tr);
var row=opts.finder.getRow(_638,_639);
opts.onRowContextMenu.call(_638,e,_639,row);
}else{
var body=_623(e.target,".datagrid-body");
if(body){
var _638=_625(body);
var opts=$.data(_638,"datagrid").options;
opts.onRowContextMenu.call(_638,e,-1,null);
}
}
};
function _625(t){
return $(t).closest("div.datagrid-view").children(".datagrid-f")[0];
};
function _623(t,_63a){
var tr=$(t).closest(_63a||"tr.datagrid-row");
if(tr.length&&tr.parent().length){
return tr;
}else{
return undefined;
}
};
function _627(tr){
if(tr.attr("datagrid-row-index")){
return parseInt(tr.attr("datagrid-row-index"));
}else{
return tr.attr("node-id");
}
};
function _63b(_63c,_63d){
var _63e=$.data(_63c,"datagrid");
var opts=_63e.options;
_63d=_63d||{};
var _63f={sortName:opts.sortName,sortOrder:opts.sortOrder};
if(typeof _63d=="object"){
$.extend(_63f,_63d);
}
var _640=[];
var _641=[];
if(_63f.sortName){
_640=_63f.sortName.split(",");
_641=_63f.sortOrder.split(",");
}
if(typeof _63d=="string"){
var _642=_63d;
var col=_614(_63c,_642);
if(!col.sortable||_63e.resizing){
return;
}
var _643=col.order||"asc";
var pos=_5b8(_640,_642);
if(pos>=0){
var _644=_641[pos]=="asc"?"desc":"asc";
if(opts.multiSort&&_644==_643){
_640.splice(pos,1);
_641.splice(pos,1);
}else{
_641[pos]=_644;
}
}else{
if(opts.multiSort){
_640.push(_642);
_641.push(_643);
}else{
_640=[_642];
_641=[_643];
}
}
_63f.sortName=_640.join(",");
_63f.sortOrder=_641.join(",");
}
if(opts.onBeforeSortColumn.call(_63c,_63f.sortName,_63f.sortOrder)==false){
return;
}
$.extend(opts,_63f);
var dc=_63e.dc;
var _645=dc.header1.add(dc.header2);
_645.find("div.datagrid-cell").removeClass("datagrid-sort-asc datagrid-sort-desc");
for(var i=0;i<_640.length;i++){
var col=_614(_63c,_640[i]);
_645.find("div."+col.cellClass).addClass("datagrid-sort-"+_641[i]);
}
if(opts.remoteSort){
_646(_63c);
}else{
_647(_63c,$(_63c).datagrid("getData"));
}
opts.onSortColumn.call(_63c,opts.sortName,opts.sortOrder);
};
function _648(_649){
var _64a=$.data(_649,"datagrid");
var opts=_64a.options;
var dc=_64a.dc;
var _64b=dc.view2.children("div.datagrid-header");
dc.body2.css("overflow-x","");
_64c();
_64d();
_64e();
_64c(true);
if(_64b.width()>=_64b.find("table").width()){
dc.body2.css("overflow-x","hidden");
}
function _64e(){
if(!opts.fitColumns){
return;
}
if(!_64a.leftWidth){
_64a.leftWidth=0;
}
var _64f=0;
var cc=[];
var _650=_613(_649,false);
for(var i=0;i<_650.length;i++){
var col=_614(_649,_650[i]);
if(_651(col)){
_64f+=col.width;
cc.push({field:col.field,col:col,addingWidth:0});
}
}
if(!_64f){
return;
}
cc[cc.length-1].addingWidth-=_64a.leftWidth;
var _652=_64b.children("div.datagrid-header-inner").show();
var _653=_64b.width()-_64b.find("table").width()-opts.scrollbarSize+_64a.leftWidth;
var rate=_653/_64f;
if(!opts.showHeader){
_652.hide();
}
for(var i=0;i<cc.length;i++){
var c=cc[i];
var _654=parseInt(c.col.width*rate);
c.addingWidth+=_654;
_653-=_654;
}
cc[cc.length-1].addingWidth+=_653;
for(var i=0;i<cc.length;i++){
var c=cc[i];
if(c.col.boxWidth+c.addingWidth>0){
c.col.boxWidth+=c.addingWidth;
c.col.width+=c.addingWidth;
}
}
_64a.leftWidth=_653;
$(_649).datagrid("fixColumnSize");
};
function _64d(){
var _655=false;
var _656=_613(_649,true).concat(_613(_649,false));
$.map(_656,function(_657){
var col=_614(_649,_657);
if(String(col.width||"").indexOf("%")>=0){
var _658=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize)-col.deltaWidth;
if(_658>0){
col.boxWidth=_658;
_655=true;
}
}
});
if(_655){
$(_649).datagrid("fixColumnSize");
}
};
function _64c(fit){
var _659=dc.header1.add(dc.header2).find(".datagrid-cell-group");
if(_659.length){
_659.each(function(){
$(this)._outerWidth(fit?$(this).parent().width():10);
});
if(fit){
_5d2(_649);
}
}
};
function _651(col){
if(String(col.width||"").indexOf("%")>=0){
return false;
}
if(!col.hidden&&!col.checkbox&&!col.auto&&!col.fixed){
return true;
}
};
};
function _65a(_65b,_65c){
var _65d=$.data(_65b,"datagrid");
var opts=_65d.options;
var dc=_65d.dc;
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-9999px\"></div>").appendTo("body");
if(_65c){
_5cd(_65c);
$(_65b).datagrid("fitColumns");
}else{
var _65e=false;
var _65f=_613(_65b,true).concat(_613(_65b,false));
for(var i=0;i<_65f.length;i++){
var _65c=_65f[i];
var col=_614(_65b,_65c);
if(col.auto){
_5cd(_65c);
_65e=true;
}
}
if(_65e){
$(_65b).datagrid("fitColumns");
}
}
tmp.remove();
function _5cd(_660){
var _661=dc.view.find("div.datagrid-header td[field=\""+_660+"\"] div.datagrid-cell");
_661.css("width","");
var col=$(_65b).datagrid("getColumnOption",_660);
col.width=undefined;
col.boxWidth=undefined;
col.auto=true;
$(_65b).datagrid("fixColumnSize",_660);
var _662=Math.max(_663("header"),_663("allbody"),_663("allfooter"))+1;
_661._outerWidth(_662-1);
col.width=_662;
col.boxWidth=parseInt(_661[0].style.width);
col.deltaWidth=_662-col.boxWidth;
_661.css("width","");
$(_65b).datagrid("fixColumnSize",_660);
opts.onResizeColumn.call(_65b,_660,col.width);
function _663(type){
var _664=0;
if(type=="header"){
_664=_665(_661);
}else{
opts.finder.getTr(_65b,0,type).find("td[field=\""+_660+"\"] div.datagrid-cell").each(function(){
var w=_665($(this));
if(_664<w){
_664=w;
}
});
}
return _664;
function _665(cell){
return cell.is(":visible")?cell._outerWidth():tmp.html(cell.html())._outerWidth();
};
};
};
};
function _666(_667,_668){
var _669=$.data(_667,"datagrid");
var opts=_669.options;
var dc=_669.dc;
var _66a=dc.view.find("table.datagrid-btable,table.datagrid-ftable");
_66a.css("table-layout","fixed");
if(_668){
fix(_668);
}else{
var ff=_613(_667,true).concat(_613(_667,false));
for(var i=0;i<ff.length;i++){
fix(ff[i]);
}
}
_66a.css("table-layout","");
_66b(_667);
_5e3(_667);
_66c(_667);
function fix(_66d){
var col=_614(_667,_66d);
if(col.cellClass){
_669.ss.set("."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto");
}
};
};
function _66b(_66e){
var dc=$.data(_66e,"datagrid").dc;
dc.view.find("td.datagrid-td-merged").each(function(){
var td=$(this);
var _66f=td.attr("colspan")||1;
var col=_614(_66e,td.attr("field"));
var _670=col.boxWidth+col.deltaWidth-1;
for(var i=1;i<_66f;i++){
td=td.next();
col=_614(_66e,td.attr("field"));
_670+=col.boxWidth+col.deltaWidth;
}
$(this).children("div.datagrid-cell")._outerWidth(_670);
});
};
function _66c(_671){
var dc=$.data(_671,"datagrid").dc;
dc.view.find("div.datagrid-editable").each(function(){
var cell=$(this);
var _672=cell.parent().attr("field");
var col=$(_671).datagrid("getColumnOption",_672);
cell._outerWidth(col.boxWidth+col.deltaWidth-1);
var ed=$.data(this,"datagrid.editor");
if(ed.actions.resize){
ed.actions.resize(ed.target,cell.width());
}
});
};
function _614(_673,_674){
function find(_675){
if(_675){
for(var i=0;i<_675.length;i++){
var cc=_675[i];
for(var j=0;j<cc.length;j++){
var c=cc[j];
if(c.field==_674){
return c;
}
}
}
}
return null;
};
var opts=$.data(_673,"datagrid").options;
var col=find(opts.columns);
if(!col){
col=find(opts.frozenColumns);
}
return col;
};
function _613(_676,_677){
var opts=$.data(_676,"datagrid").options;
var _678=(_677==true)?(opts.frozenColumns||[[]]):opts.columns;
if(_678.length==0){
return [];
}
var aa=[];
var _679=_67a();
for(var i=0;i<_678.length;i++){
aa[i]=new Array(_679);
}
for(var _67b=0;_67b<_678.length;_67b++){
$.map(_678[_67b],function(col){
var _67c=_67d(aa[_67b]);
if(_67c>=0){
var _67e=col.field||"";
for(var c=0;c<(col.colspan||1);c++){
for(var r=0;r<(col.rowspan||1);r++){
aa[_67b+r][_67c]=_67e;
}
_67c++;
}
}
});
}
return aa[aa.length-1];
function _67a(){
var _67f=0;
$.map(_678[0],function(col){
_67f+=col.colspan||1;
});
return _67f;
};
function _67d(a){
for(var i=0;i<a.length;i++){
if(a[i]==undefined){
return i;
}
}
return -1;
};
};
function _647(_680,data){
var _681=$.data(_680,"datagrid");
var opts=_681.options;
var dc=_681.dc;
data=opts.loadFilter.call(_680,data);
data.total=parseInt(data.total);
_681.data=data;
if(data.footer){
_681.footer=data.footer;
}
if(!opts.remoteSort&&opts.sortName){
var _682=opts.sortName.split(",");
var _683=opts.sortOrder.split(",");
data.rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_682.length;i++){
var sn=_682[i];
var so=_683[i];
var col=_614(_680,sn);
//Modified by gongjg on 2015-10-10
//ԭ���� 
//var _684=col.sorter||function(a,b){
//return a==b?0:(a>b?1:-1);
//};
//�޸Ŀ�ʼ
if(col != null) {
var _684=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
}else{
return 0;
}
//�޸Ľ���
r=_684(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_680,data.rows);
}
opts.view.render.call(opts.view,_680,dc.body2,false);
opts.view.render.call(opts.view,_680,dc.body1,true);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_680,dc.footer2,false);
opts.view.renderFooter.call(opts.view,_680,dc.footer1,true);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_680);
}
_681.ss.clean();
var _685=$(_680).datagrid("getPager");
if(_685.length){
var _686=_685.pagination("options");
if(_686.total!=data.total){
_685.pagination("refresh",{total:data.total});
if(opts.pageNumber!=_686.pageNumber&&_686.pageNumber>0){
opts.pageNumber=_686.pageNumber;
_646(_680);
}
}
}
_5e3(_680);
dc.body2.triggerHandler("scroll");
$(_680).datagrid("setSelectionState");
$(_680).datagrid("autoSizeColumn");
opts.onLoadSuccess.call(_680,data);
};
function _687(_688){
var _689=$.data(_688,"datagrid");
var opts=_689.options;
var dc=_689.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
var _68a=$.data(_688,"treegrid")?true:false;
var _68b=opts.onSelect;
var _68c=opts.onCheck;
opts.onSelect=opts.onCheck=function(){
};
var rows=opts.finder.getRows(_688);
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _68d=_68a?row[opts.idField]:i;
if(_68e(_689.selectedRows,row)){
_62f(_688,_68d,true);
}
if(_68e(_689.checkedRows,row)){
_62c(_688,_68d,true);
}
}
opts.onSelect=_68b;
opts.onCheck=_68c;
}
function _68e(a,r){
for(var i=0;i<a.length;i++){
if(a[i][opts.idField]==r[opts.idField]){
a[i]=r;
return true;
}
}
return false;
};
};
function _68f(_690,row){
var _691=$.data(_690,"datagrid");
var opts=_691.options;
var rows=_691.data.rows;
if(typeof row=="object"){
return _5b8(rows,row);
}else{
for(var i=0;i<rows.length;i++){
if(rows[i][opts.idField]==row){
return i;
}
}
return -1;
}
};
function _692(_693){
var _694=$.data(_693,"datagrid");
var opts=_694.options;
var data=_694.data;
if(opts.idField){
return _694.selectedRows;
}else{
var rows=[];
opts.finder.getTr(_693,"","selected",2).each(function(){
rows.push(opts.finder.getRow(_693,$(this)));
});
return rows;
}
};
function _695(_696){
var _697=$.data(_696,"datagrid");
var opts=_697.options;
if(opts.idField){
return _697.checkedRows;
}else{
var rows=[];
opts.finder.getTr(_696,"","checked",2).each(function(){
rows.push(opts.finder.getRow(_696,$(this)));
});
return rows;
}
};
function _698(_699,_69a){
var _69b=$.data(_699,"datagrid");
var dc=_69b.dc;
var opts=_69b.options;
var tr=opts.finder.getTr(_699,_69a);
if(tr.length){
if(tr.closest("table").hasClass("datagrid-btable-frozen")){
return;
}
var _69c=dc.view2.children("div.datagrid-header")._outerHeight();
var _69d=dc.body2;
var _69e=_69d.outerHeight(true)-_69d.outerHeight();
var top=tr.position().top-_69c-_69e;
if(top<0){
_69d.scrollTop(_69d.scrollTop()+top);
}else{
if(top+tr._outerHeight()>_69d.height()-18){
_69d.scrollTop(_69d.scrollTop()+top+tr._outerHeight()-_69d.height()+18);
}
}
}
};
function _628(_69f,_6a0){
var _6a1=$.data(_69f,"datagrid");
var opts=_6a1.options;
opts.finder.getTr(_69f,_6a1.highlightIndex).removeClass("datagrid-row-over");
opts.finder.getTr(_69f,_6a0).addClass("datagrid-row-over");
_6a1.highlightIndex=_6a0;
};
function _62f(_6a2,_6a3,_6a4){
var _6a5=$.data(_6a2,"datagrid");
var opts=_6a5.options;
var row=opts.finder.getRow(_6a2,_6a3);
if(opts.onBeforeSelect.apply(_6a2,_5bc(_6a2,[_6a3,row]))==false){
return;
}
if(opts.singleSelect){
_6a6(_6a2,true);
_6a5.selectedRows=[];
}
if(!_6a4&&opts.checkOnSelect){
_62c(_6a2,_6a3,true);
}
if(opts.idField){
_5bb(_6a5.selectedRows,opts.idField,row);
}
opts.finder.getTr(_6a2,_6a3).addClass("datagrid-row-selected");
opts.onSelect.apply(_6a2,_5bc(_6a2,[_6a3,row]));
_698(_6a2,_6a3);
};
function _630(_6a7,_6a8,_6a9){
var _6aa=$.data(_6a7,"datagrid");
var dc=_6aa.dc;
var opts=_6aa.options;
var row=opts.finder.getRow(_6a7,_6a8);
if(opts.onBeforeUnselect.apply(_6a7,_5bc(_6a7,[_6a8,row]))==false){
return;
}
if(!_6a9&&opts.checkOnSelect){
_62d(_6a7,_6a8,true);
}
opts.finder.getTr(_6a7,_6a8).removeClass("datagrid-row-selected");
if(opts.idField){
_5b9(_6aa.selectedRows,opts.idField,row[opts.idField]);
}
opts.onUnselect.apply(_6a7,_5bc(_6a7,[_6a8,row]));
};
function _6ab(_6ac,_6ad){
var _6ae=$.data(_6ac,"datagrid");
var opts=_6ae.options;
var rows=opts.finder.getRows(_6ac);
var _6af=$.data(_6ac,"datagrid").selectedRows;
if(!_6ad&&opts.checkOnSelect){
_6b0(_6ac,true);
}
opts.finder.getTr(_6ac,"","allbody").addClass("datagrid-row-selected");
if(opts.idField){
for(var _6b1=0;_6b1<rows.length;_6b1++){
_5bb(_6af,opts.idField,rows[_6b1]);
}
}
opts.onSelectAll.call(_6ac,rows);
};
function _6a6(_6b2,_6b3){
var _6b4=$.data(_6b2,"datagrid");
var opts=_6b4.options;
var rows=opts.finder.getRows(_6b2);
var _6b5=$.data(_6b2,"datagrid").selectedRows;
if(!_6b3&&opts.checkOnSelect){
_6b6(_6b2,true);
}
opts.finder.getTr(_6b2,"","selected").removeClass("datagrid-row-selected");
if(opts.idField){
for(var _6b7=0;_6b7<rows.length;_6b7++){
_5b9(_6b5,opts.idField,rows[_6b7][opts.idField]);
}
}
opts.onUnselectAll.call(_6b2,rows);
};
function _62c(_6b8,_6b9,_6ba){
var _6bb=$.data(_6b8,"datagrid");
var opts=_6bb.options;
var row=opts.finder.getRow(_6b8,_6b9);
if(opts.onBeforeCheck.apply(_6b8,_5bc(_6b8,[_6b9,row]))==false){
return;
}
if(opts.singleSelect&&opts.selectOnCheck){
_6b6(_6b8,true);
_6bb.checkedRows=[];
}
if(!_6ba&&opts.selectOnCheck){
_62f(_6b8,_6b9,true);
}
var tr=opts.finder.getTr(_6b8,_6b9).addClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
tr=opts.finder.getTr(_6b8,"","checked",2);
if(tr.length==opts.finder.getRows(_6b8).length){
var dc=_6bb.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",true);
}
if(opts.idField){
_5bb(_6bb.checkedRows,opts.idField,row);
}
opts.onCheck.apply(_6b8,_5bc(_6b8,[_6b9,row]));
};
function _62d(_6bc,_6bd,_6be){
var _6bf=$.data(_6bc,"datagrid");
var opts=_6bf.options;
var row=opts.finder.getRow(_6bc,_6bd);
if(opts.onBeforeUncheck.apply(_6bc,_5bc(_6bc,[_6bd,row]))==false){
return;
}
if(!_6be&&opts.selectOnCheck){
_630(_6bc,_6bd,true);
}
var tr=opts.finder.getTr(_6bc,_6bd).removeClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",false);
var dc=_6bf.dc;
var _6c0=dc.header1.add(dc.header2);
_6c0.find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
_5b9(_6bf.checkedRows,opts.idField,row[opts.idField]);
}
opts.onUncheck.apply(_6bc,_5bc(_6bc,[_6bd,row]));
};
function _6b0(_6c1,_6c2){
var _6c3=$.data(_6c1,"datagrid");
var opts=_6c3.options;
var rows=opts.finder.getRows(_6c1);
if(!_6c2&&opts.selectOnCheck){
_6ab(_6c1,true);
}
var dc=_6c3.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_6c1,"","allbody").addClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",true);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_5bb(_6c3.checkedRows,opts.idField,rows[i]);
}
}
opts.onCheckAll.call(_6c1,rows);
};
function _6b6(_6c4,_6c5){
var _6c6=$.data(_6c4,"datagrid");
var opts=_6c6.options;
var rows=opts.finder.getRows(_6c4);
if(!_6c5&&opts.selectOnCheck){
_6a6(_6c4,true);
}
var dc=_6c6.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_6c4,"","checked").removeClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",false);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_5b9(_6c6.checkedRows,opts.idField,rows[i][opts.idField]);
}
}
opts.onUncheckAll.call(_6c4,rows);
};
function _6c7(_6c8,_6c9){
var opts=$.data(_6c8,"datagrid").options;
var tr=opts.finder.getTr(_6c8,_6c9);
var row=opts.finder.getRow(_6c8,_6c9);
if(tr.hasClass("datagrid-row-editing")){
return;
}
if(opts.onBeforeEdit.apply(_6c8,_5bc(_6c8,[_6c9,row]))==false){
return;
}
tr.addClass("datagrid-row-editing");
_6ca(_6c8,_6c9);
_66c(_6c8);
tr.find("div.datagrid-editable").each(function(){
var _6cb=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
ed.actions.setValue(ed.target,row[_6cb]);
});
_6cc(_6c8,_6c9);
opts.onBeginEdit.apply(_6c8,_5bc(_6c8,[_6c9,row]));
};
function _6cd(_6ce,_6cf,_6d0){
var _6d1=$.data(_6ce,"datagrid");
var opts=_6d1.options;
var _6d2=_6d1.updatedRows;
var _6d3=_6d1.insertedRows;
var tr=opts.finder.getTr(_6ce,_6cf);
var row=opts.finder.getRow(_6ce,_6cf);
if(!tr.hasClass("datagrid-row-editing")){
return;
}
if(!_6d0){
if(!_6cc(_6ce,_6cf)){
return;
}
var _6d4=false;
var _6d5={};
tr.find("div.datagrid-editable").each(function(){
var _6d6=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
var t=$(ed.target);
var _6d7=t.data("textbox")?t.textbox("textbox"):t;
_6d7.triggerHandler("blur");
var _6d8=ed.actions.getValue(ed.target);
if(row[_6d6]!=_6d8){
row[_6d6]=_6d8;
_6d4=true;
_6d5[_6d6]=_6d8;
}
});
if(_6d4){
if(_5b8(_6d3,row)==-1){
if(_5b8(_6d2,row)==-1){
_6d2.push(row);
}
}
}
opts.onEndEdit.apply(_6ce,_5bc(_6ce,[_6cf,row,_6d5]));
}
tr.removeClass("datagrid-row-editing");
_6d9(_6ce,_6cf);
$(_6ce).datagrid("refreshRow",_6cf);
if(!_6d0){
opts.onAfterEdit.apply(_6ce,_5bc(_6ce,[_6cf,row,_6d5]));
}else{
opts.onCancelEdit.apply(_6ce,_5bc(_6ce,[_6cf,row]));
}
};
function _6da(_6db,_6dc){
var opts=$.data(_6db,"datagrid").options;
var tr=opts.finder.getTr(_6db,_6dc);
var _6dd=[];
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
_6dd.push(ed);
}
});
return _6dd;
};
function _6de(_6df,_6e0){
var _6e1=_6da(_6df,_6e0.index!=undefined?_6e0.index:_6e0.id);
for(var i=0;i<_6e1.length;i++){
if(_6e1[i].field==_6e0.field){
return _6e1[i];
}
}
return null;
};
function _6ca(_6e2,_6e3){
var opts=$.data(_6e2,"datagrid").options;
var tr=opts.finder.getTr(_6e2,_6e3);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-cell");
var _6e4=$(this).attr("field");
var col=_614(_6e2,_6e4);
if(col&&col.editor){
var _6e5,_6e6;
if(typeof col.editor=="string"){
_6e5=col.editor;
}else{
_6e5=col.editor.type;
_6e6=col.editor.options;
}
var _6e7=opts.editors[_6e5];
if(_6e7){
var _6e8=cell.html();
var _6e9=cell._outerWidth();
cell.addClass("datagrid-editable");
cell._outerWidth(_6e9);
cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
cell.children("table").bind("click dblclick contextmenu",function(e){
e.stopPropagation();
});
$.data(cell[0],"datagrid.editor",{actions:_6e7,target:_6e7.init(cell.find("td"),_6e6),field:_6e4,type:_6e5,oldHtml:_6e8});
}
}
});
_5e3(_6e2,_6e3,true);
};
function _6d9(_6ea,_6eb){
var opts=$.data(_6ea,"datagrid").options;
var tr=opts.finder.getTr(_6ea,_6eb);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
if(ed.actions.destroy){
ed.actions.destroy(ed.target);
}
cell.html(ed.oldHtml);
$.removeData(cell[0],"datagrid.editor");
cell.removeClass("datagrid-editable");
cell.css("width","");
}
});
};
function _6cc(_6ec,_6ed){
var tr=$.data(_6ec,"datagrid").options.finder.getTr(_6ec,_6ed);
if(!tr.hasClass("datagrid-row-editing")){
return true;
}
var vbox=tr.find(".validatebox-text");
vbox.validatebox("validate");
vbox.trigger("mouseleave");
var _6ee=tr.find(".validatebox-invalid");
return _6ee.length==0;
};
function _6ef(_6f0,_6f1){
var _6f2=$.data(_6f0,"datagrid").insertedRows;
var _6f3=$.data(_6f0,"datagrid").deletedRows;
var _6f4=$.data(_6f0,"datagrid").updatedRows;
if(!_6f1){
var rows=[];
rows=rows.concat(_6f2);
rows=rows.concat(_6f3);
rows=rows.concat(_6f4);
return rows;
}else{
if(_6f1=="inserted"){
return _6f2;
}else{
if(_6f1=="deleted"){
return _6f3;
}else{
if(_6f1=="updated"){
return _6f4;
}
}
}
}
return [];
};
function _6f5(_6f6,_6f7){
var _6f8=$.data(_6f6,"datagrid");
var opts=_6f8.options;
var data=_6f8.data;
var _6f9=_6f8.insertedRows;
var _6fa=_6f8.deletedRows;
$(_6f6).datagrid("cancelEdit",_6f7);
var row=opts.finder.getRow(_6f6,_6f7);
if(_5b8(_6f9,row)>=0){
_5b9(_6f9,row);
}else{
_6fa.push(row);
}
_5b9(_6f8.selectedRows,opts.idField,row[opts.idField]);
_5b9(_6f8.checkedRows,opts.idField,row[opts.idField]);
opts.view.deleteRow.call(opts.view,_6f6,_6f7);
if(opts.height=="auto"){
_5e3(_6f6);
}
$(_6f6).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _6fb(_6fc,_6fd){
var data=$.data(_6fc,"datagrid").data;
var view=$.data(_6fc,"datagrid").options.view;
var _6fe=$.data(_6fc,"datagrid").insertedRows;
view.insertRow.call(view,_6fc,_6fd.index,_6fd.row);
_6fe.push(_6fd.row);
$(_6fc).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _6ff(_700,row){
var data=$.data(_700,"datagrid").data;
var view=$.data(_700,"datagrid").options.view;
var _701=$.data(_700,"datagrid").insertedRows;
view.insertRow.call(view,_700,null,row);
_701.push(row);
$(_700).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _702(_703){
var _704=$.data(_703,"datagrid");
var data=_704.data;
var rows=data.rows;
var _705=[];
for(var i=0;i<rows.length;i++){
_705.push($.extend({},rows[i]));
}
_704.originalRows=_705;
_704.updatedRows=[];
_704.insertedRows=[];
_704.deletedRows=[];
};
function _706(_707){
var data=$.data(_707,"datagrid").data;
var ok=true;
for(var i=0,len=data.rows.length;i<len;i++){
if(_6cc(_707,i)){
$(_707).datagrid("endEdit",i);
}else{
ok=false;
}
}
if(ok){
_702(_707);
}
};
function _708(_709){
var _70a=$.data(_709,"datagrid");
var opts=_70a.options;
var _70b=_70a.originalRows;
var _70c=_70a.insertedRows;
var _70d=_70a.deletedRows;
var _70e=_70a.selectedRows;
var _70f=_70a.checkedRows;
var data=_70a.data;
function _710(a){
var ids=[];
for(var i=0;i<a.length;i++){
ids.push(a[i][opts.idField]);
}
return ids;
};
function _711(ids,_712){
for(var i=0;i<ids.length;i++){
var _713=_68f(_709,ids[i]);
if(_713>=0){
(_712=="s"?_62f:_62c)(_709,_713,true);
}
}
};
for(var i=0;i<data.rows.length;i++){
$(_709).datagrid("cancelEdit",i);
}
var _714=_710(_70e);
var _715=_710(_70f);
_70e.splice(0,_70e.length);
_70f.splice(0,_70f.length);
data.total+=_70d.length-_70c.length;
data.rows=_70b;
_647(_709,data);
_711(_714,"s");
_711(_715,"c");
_702(_709);
};
function _646(_716,_717){
var opts=$.data(_716,"datagrid").options;
if(_717){
opts.queryParams=_717;
}
var _718=$.extend({},opts.queryParams);
if(opts.pagination){
//Modified by gongjg on 2015-10-10
//page��ΪpageNo,row��ΪpageSize
$.extend(_718,{pageNo:opts.pageNumber||1,pageSize:opts.pageSize,showPageInfo:opts.showPageInfo,showPageList:opts.showPageList});
}
if(opts.sortName){
$.extend(_718,{sort:opts.sortName,order:opts.sortOrder});
}
if(opts.onBeforeLoad.call(_716,_718)==false){
return;
}
$(_716).datagrid("loading");
var _719=opts.loader.call(_716,_718,function(data){
$(_716).datagrid("loaded");
$(_716).datagrid("loadData",data);
},function(){
$(_716).datagrid("loaded");
opts.onLoadError.apply(_716,arguments);
});
if(_719==false){
$(_716).datagrid("loaded");
}
};
function _71a(_71b,_71c){
var opts=$.data(_71b,"datagrid").options;
_71c.type=_71c.type||"body";
_71c.rowspan=_71c.rowspan||1;
_71c.colspan=_71c.colspan||1;
if(_71c.rowspan==1&&_71c.colspan==1){
return;
}
var tr=opts.finder.getTr(_71b,(_71c.index!=undefined?_71c.index:_71c.id),_71c.type);
if(!tr.length){
return;
}
var td=tr.find("td[field=\""+_71c.field+"\"]");
td.attr("rowspan",_71c.rowspan).attr("colspan",_71c.colspan);
td.addClass("datagrid-td-merged");
_71d(td.next(),_71c.colspan-1);
for(var i=1;i<_71c.rowspan;i++){
tr=tr.next();
if(!tr.length){
break;
}
td=tr.find("td[field=\""+_71c.field+"\"]");
_71d(td,_71c.colspan);
}
_66b(_71b);
function _71d(td,_71e){
for(var i=0;i<_71e;i++){
td.hide();
td=td.next();
}
};
};
$.fn.datagrid=function(_71f,_720){
if(typeof _71f=="string"){
return $.fn.datagrid.methods[_71f](this,_720);
}
_71f=_71f||{};
return this.each(function(){
var _721=$.data(this,"datagrid");
var opts;
if(_721){
opts=$.extend(_721.options,_71f);
_721.options=opts;
}else{
opts=$.extend({},$.extend({},$.fn.datagrid.defaults,{queryParams:{}}),$.fn.datagrid.parseOptions(this),_71f);
$(this).css("width","").css("height","");
var _722=_5f7(this,opts.rownumbers);
if(!opts.columns){
opts.columns=_722.columns;
}
if(!opts.frozenColumns){
opts.frozenColumns=_722.frozenColumns;
}
opts.columns=$.extend(true,[],opts.columns);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.view=$.extend({},opts.view);
$.data(this,"datagrid",{options:opts,panel:_722.panel,dc:_722.dc,ss:null,selectedRows:[],checkedRows:[],data:{total:0,rows:[]},originalRows:[],updatedRows:[],insertedRows:[],deletedRows:[]});
}
_600(this);
_615(this);
_5cd(this);
if(opts.data){
$(this).datagrid("loadData",opts.data);
}else{
var data=$.fn.datagrid.parseData(this);
if(data.total>0){
$(this).datagrid("loadData",data);
}else{
opts.view.renderEmptyRow(this);
$(this).datagrid("autoSizeColumn");
}
}
_646(this);
});
};
function _723(_724){
var _725={};
$.map(_724,function(name){
_725[name]=_726(name);
});
return _725;
function _726(name){
function isA(_727){
return $.data($(_727)[0],name)!=undefined;
};
return {init:function(_728,_729){
var _72a=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_728);
if(_72a[name]&&name!="text"){
return _72a[name](_729);
}else{
return _72a;
}
},destroy:function(_72b){
if(isA(_72b,name)){
$(_72b)[name]("destroy");
}
},getValue:function(_72c){
if(isA(_72c,name)){
var opts=$(_72c)[name]("options");
if(opts.multiple){
return $(_72c)[name]("getValues").join(opts.separator);
}else{
return $(_72c)[name]("getValue");
}
}else{
return $(_72c).val();
}
},setValue:function(_72d,_72e){
if(isA(_72d,name)){
var opts=$(_72d)[name]("options");
if(opts.multiple){
if(_72e){
$(_72d)[name]("setValues",_72e.split(opts.separator));
}else{
$(_72d)[name]("clear");
}
}else{
$(_72d)[name]("setValue",_72e);
}
}else{
$(_72d).val(_72e);
}
},resize:function(_72f,_730){
if(isA(_72f,name)){
$(_72f)[name]("resize",_730);
}else{
$(_72f)._outerWidth(_730)._outerHeight(22);
}
}};
};
};
var _731=$.extend({},_723(["text","textbox","numberbox","numberspinner","combobox","combotree","combogrid","datebox","datetimebox","timespinner","datetimespinner"]),{textarea:{init:function(_732,_733){
var _734=$("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_732);
return _734;
},getValue:function(_735){
return $(_735).val();
},setValue:function(_736,_737){
$(_736).val(_737);
},resize:function(_738,_739){
$(_738)._outerWidth(_739);
}},checkbox:{init:function(_73a,_73b){
var _73c=$("<input type=\"checkbox\">").appendTo(_73a);
_73c.val(_73b.on);
_73c.attr("offval",_73b.off);
return _73c;
},getValue:function(_73d){
if($(_73d).is(":checked")){
return $(_73d).val();
}else{
return $(_73d).attr("offval");
}
},setValue:function(_73e,_73f){
var _740=false;
if($(_73e).val()==_73f){
_740=true;
}
$(_73e)._propAttr("checked",_740);
}},validatebox:{init:function(_741,_742){
var _743=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_741);
_743.validatebox(_742);
return _743;
},destroy:function(_744){
$(_744).validatebox("destroy");
},getValue:function(_745){
return $(_745).val();
},setValue:function(_746,_747){
$(_746).val(_747);
},resize:function(_748,_749){
$(_748)._outerWidth(_749)._outerHeight(22);
}}});
$.fn.datagrid.methods={options:function(jq){
var _74a=$.data(jq[0],"datagrid").options;
var _74b=$.data(jq[0],"datagrid").panel.panel("options");
var opts=$.extend(_74a,{width:_74b.width,height:_74b.height,closed:_74b.closed,collapsed:_74b.collapsed,minimized:_74b.minimized,maximized:_74b.maximized});
return opts;
},setSelectionState:function(jq){
return jq.each(function(){
_687(this);
});
},createStyleSheet:function(jq){
return _5be(jq[0]);
},getPanel:function(jq){
return $.data(jq[0],"datagrid").panel;
},getPager:function(jq){
return $.data(jq[0],"datagrid").panel.children("div.datagrid-pager");
},getColumnFields:function(jq,_74c){
return _613(jq[0],_74c);
},getColumnOption:function(jq,_74d){
return _614(jq[0],_74d);
},resize:function(jq,_74e){
return jq.each(function(){
_5cd(this,_74e);
});
},load:function(jq,_74f){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _74f=="string"){
opts.url=_74f;
_74f=null;
}
opts.pageNumber=1;
var _750=$(this).datagrid("getPager");
_750.pagination("refresh",{pageNumber:1});
_646(this,_74f);
});
},reload:function(jq,_751){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _751=="string"){
opts.url=_751;
_751=null;
}
_646(this,_751);
});
},reloadFooter:function(jq,_752){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
var dc=$.data(this,"datagrid").dc;
if(_752){
$.data(this,"datagrid").footer=_752;
}
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,this);
}
$(this).datagrid("fixRowHeight");
}
});
},loading:function(jq){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
$(this).datagrid("getPager").pagination("loading");
if(opts.loadMsg){
var _753=$(this).datagrid("getPanel");
if(!_753.children("div.datagrid-mask").length){
$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_753);
var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(_753);
msg._outerHeight(40);
msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
}
}
});
},loaded:function(jq){
return jq.each(function(){
$(this).datagrid("getPager").pagination("loaded");
var _754=$(this).datagrid("getPanel");
_754.children("div.datagrid-mask-msg").remove();
_754.children("div.datagrid-mask").remove();
});
},fitColumns:function(jq){
return jq.each(function(){
_648(this);
});
},fixColumnSize:function(jq,_755){
return jq.each(function(){
_666(this,_755);
});
},fixRowHeight:function(jq,_756){
return jq.each(function(){
_5e3(this,_756);
});
},freezeRow:function(jq,_757){
return jq.each(function(){
_5f0(this,_757);
});
},autoSizeColumn:function(jq,_758){
return jq.each(function(){
_65a(this,_758);
});
},loadData:function(jq,data){
return jq.each(function(){
_647(this,data);
_702(this);
});
},getData:function(jq){
return $.data(jq[0],"datagrid").data;
},getRows:function(jq){
return $.data(jq[0],"datagrid").data.rows;
},getFooterRows:function(jq){
return $.data(jq[0],"datagrid").footer;
},getRowIndex:function(jq,id){
return _68f(jq[0],id);
},getChecked:function(jq){
return _695(jq[0]);
},getSelected:function(jq){
var rows=_692(jq[0]);
return rows.length>0?rows[0]:null;
},getSelections:function(jq){
return _692(jq[0]);
},clearSelections:function(jq){
return jq.each(function(){
var _759=$.data(this,"datagrid");
var _75a=_759.selectedRows;
var _75b=_759.checkedRows;
_75a.splice(0,_75a.length);
_6a6(this);
if(_759.options.checkOnSelect){
_75b.splice(0,_75b.length);
}
});
},clearChecked:function(jq){
return jq.each(function(){
var _75c=$.data(this,"datagrid");
var _75d=_75c.selectedRows;
var _75e=_75c.checkedRows;
_75e.splice(0,_75e.length);
_6b6(this);
if(_75c.options.selectOnCheck){
_75d.splice(0,_75d.length);
}
});
},scrollTo:function(jq,_75f){
return jq.each(function(){
_698(this,_75f);
});
},highlightRow:function(jq,_760){
return jq.each(function(){
_628(this,_760);
_698(this,_760);
});
},selectAll:function(jq){
return jq.each(function(){
_6ab(this);
});
},unselectAll:function(jq){
return jq.each(function(){
_6a6(this);
});
},selectRow:function(jq,_761){
return jq.each(function(){
_62f(this,_761);
});
},selectRecord:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
if(opts.idField){
var _762=_68f(this,id);
if(_762>=0){
$(this).datagrid("selectRow",_762);
}
}
});
},unselectRow:function(jq,_763){
return jq.each(function(){
_630(this,_763);
});
},checkRow:function(jq,_764){
return jq.each(function(){
_62c(this,_764);
});
},uncheckRow:function(jq,_765){
return jq.each(function(){
_62d(this,_765);
});
},checkAll:function(jq){
return jq.each(function(){
_6b0(this);
});
},uncheckAll:function(jq){
return jq.each(function(){
_6b6(this);
});
},beginEdit:function(jq,_766){
return jq.each(function(){
_6c7(this,_766);
});
},endEdit:function(jq,_767){
return jq.each(function(){
_6cd(this,_767,false);
});
},cancelEdit:function(jq,_768){
return jq.each(function(){
_6cd(this,_768,true);
});
},getEditors:function(jq,_769){
return _6da(jq[0],_769);
},getEditor:function(jq,_76a){
return _6de(jq[0],_76a);
},refreshRow:function(jq,_76b){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.refreshRow.call(opts.view,this,_76b);
});
},validateRow:function(jq,_76c){
return _6cc(jq[0],_76c);
},updateRow:function(jq,_76d){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.updateRow.call(opts.view,this,_76d.index,_76d.row);
});
},appendRow:function(jq,row){
return jq.each(function(){
_6ff(this,row);
});
},insertRow:function(jq,_76e){
return jq.each(function(){
_6fb(this,_76e);
});
},deleteRow:function(jq,_76f){
return jq.each(function(){
_6f5(this,_76f);
});
},getChanges:function(jq,_770){
return _6ef(jq[0],_770);
},acceptChanges:function(jq){
return jq.each(function(){
_706(this);
});
},rejectChanges:function(jq){
return jq.each(function(){
_708(this);
});
},mergeCells:function(jq,_771){
return jq.each(function(){
_71a(this,_771);
});
},showColumn:function(jq,_772){
return jq.each(function(){
var _773=$(this).datagrid("getPanel");
_773.find("td[field=\""+_772+"\"]").show();
$(this).datagrid("getColumnOption",_772).hidden=false;
$(this).datagrid("fitColumns");
});
},hideColumn:function(jq,_774){
return jq.each(function(){
var _775=$(this).datagrid("getPanel");
_775.find("td[field=\""+_774+"\"]").hide();
$(this).datagrid("getColumnOption",_774).hidden=true;
$(this).datagrid("fitColumns");
});
},sort:function(jq,_776){
return jq.each(function(){
_63b(this,_776);
});
}};
$.fn.datagrid.parseOptions=function(_777){
var t=$(_777);
return $.extend({},$.fn.panel.parseOptions(_777),$.parser.parseOptions(_777,["url","toolbar","idField","sortName","sortOrder","pagePosition","resizeHandle",{sharedStyleSheet:"boolean",fitColumns:"boolean",autoRowHeight:"boolean",striped:"boolean",nowrap:"boolean"},{rownumbers:"boolean",singleSelect:"boolean",ctrlSelect:"boolean",checkOnSelect:"boolean",selectOnCheck:"boolean"},{pagination:"boolean",pageSize:"number",pageNumber:"number"},{multiSort:"boolean",remoteSort:"boolean",showHeader:"boolean",showFooter:"boolean"},{scrollbarSize:"number"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined),loadMsg:(t.attr("loadMsg")!=undefined?t.attr("loadMsg"):undefined),rowStyler:(t.attr("rowStyler")?eval(t.attr("rowStyler")):undefined)});
};
$.fn.datagrid.parseData=function(_778){
var t=$(_778);
var data={total:0,rows:[]};
var _779=t.datagrid("getColumnFields",true).concat(t.datagrid("getColumnFields",false));
t.find("tbody tr").each(function(){
data.total++;
var row={};
$.extend(row,$.parser.parseOptions(this,["iconCls","state"]));
for(var i=0;i<_779.length;i++){
row[_779[i]]=$(this).find("td:eq("+i+")").html();
}
data.rows.push(row);
});
return data;
};
var _77a={render:function(_77b,_77c,_77d){
var rows=$(_77b).datagrid("getRows");
$(_77c).html(this.renderTable(_77b,0,rows,_77d));
},renderFooter:function(_77e,_77f,_780){
var opts=$.data(_77e,"datagrid").options;
var rows=$.data(_77e,"datagrid").footer||[];
var _781=$(_77e).datagrid("getColumnFields",_780);
var _782=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
_782.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+i+"\">");
_782.push(this.renderRow.call(this,_77e,_781,_780,i,rows[i]));
_782.push("</tr>");
}
_782.push("</tbody></table>");
$(_77f).html(_782.join(""));
},renderTable:function(_783,_784,rows,_785){
var _786=$.data(_783,"datagrid");
var opts=_786.options;
if(_785){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return "";
}
}
var _787=$(_783).datagrid("getColumnFields",_785);
var _788=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var css=opts.rowStyler?opts.rowStyler.call(_783,_784,row):"";
var _789="";
var _78a="";
if(typeof css=="string"){
_78a=css;
}else{
if(css){
_789=css["class"]||"";
_78a=css["style"]||"";
}
}
var cls="class=\"datagrid-row "+(_784%2&&opts.striped?"datagrid-row-alt ":" ")+_789+"\"";
var _78b=_78a?"style=\""+_78a+"\"":"";
var _78c=_786.rowIdPrefix+"-"+(_785?1:2)+"-"+_784;
_788.push("<tr id=\""+_78c+"\" datagrid-row-index=\""+_784+"\" "+cls+" "+_78b+">");
_788.push(this.renderRow.call(this,_783,_787,_785,_784,row));
_788.push("</tr>");
_784++;
}
_788.push("</tbody></table>");
return _788.join("");
},renderRow:function(_78d,_78e,_78f,_790,_791){
var opts=$.data(_78d,"datagrid").options;
var cc=[];
if(_78f&&opts.rownumbers){
var _792=_790+1;
if(opts.pagination){
_792+=(opts.pageNumber-1)*opts.pageSize;
}
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"+_792+"</div></td>");
}
for(var i=0;i<_78e.length;i++){
var _793=_78e[i];
var col=$(_78d).datagrid("getColumnOption",_793);
if(col){
var _794=_791[_793];
var css=col.styler?(col.styler(_794,_791,_790)||""):"";
var _795="";
var _796="";
if(typeof css=="string"){
_796=css;
}else{
if(css){
_795=css["class"]||"";
_796=css["style"]||"";
}
}
var cls=_795?"class=\""+_795+"\"":"";
var _797=col.hidden?"style=\"display:none;"+_796+"\"":(_796?"style=\""+_796+"\"":"");
cc.push("<td field=\""+_793+"\" "+cls+" "+_797+">");
var _797="";
if(!col.checkbox){
if(col.align){
_797+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_797+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_797+="height:auto;";
}
}
}
cc.push("<div style=\""+_797+"\" ");
cc.push(col.checkbox?"class=\"datagrid-cell-check\"":"class=\"datagrid-cell "+col.cellClass+"\"");
cc.push(">");
if(col.checkbox){
cc.push("<input type=\"checkbox\" "+(_791.checked?"checked=\"checked\"":""));
cc.push(" name=\""+_793+"\" value=\""+(_794!=undefined?_794:"")+"\">");
}else{
if(col.formatter){
cc.push(col.formatter(_794,_791,_790));
}else{
cc.push(_794);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},refreshRow:function(_798,_799){
this.updateRow.call(this,_798,_799,{});
},updateRow:function(_79a,_79b,row){
var opts=$.data(_79a,"datagrid").options;
var rows=$(_79a).datagrid("getRows");
var _79c=_79d(_79b);
$.extend(rows[_79b],row);
var _79e=_79d(_79b);
var _79f=_79c.c;
var _7a0=_79e.s;
var _7a1="datagrid-row "+(_79b%2&&opts.striped?"datagrid-row-alt ":" ")+_79e.c;
function _79d(_7a2){
var css=opts.rowStyler?opts.rowStyler.call(_79a,_7a2,rows[_7a2]):"";
var _7a3="";
var _7a4="";
if(typeof css=="string"){
_7a4=css;
}else{
if(css){
_7a3=css["class"]||"";
_7a4=css["style"]||"";
}
}
return {c:_7a3,s:_7a4};
};
function _7a5(_7a6){
var _7a7=$(_79a).datagrid("getColumnFields",_7a6);
var tr=opts.finder.getTr(_79a,_79b,"body",(_7a6?1:2));
var _7a8=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow.call(this,_79a,_7a7,_7a6,_79b,rows[_79b]));
tr.attr("style",_7a0).removeClass(_79f).addClass(_7a1);
if(_7a8){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
};
_7a5.call(this,true);
_7a5.call(this,false);
$(_79a).datagrid("fixRowHeight",_79b);
},insertRow:function(_7a9,_7aa,row){
var _7ab=$.data(_7a9,"datagrid");
var opts=_7ab.options;
var dc=_7ab.dc;
var data=_7ab.data;
if(_7aa==undefined||_7aa==null){
_7aa=data.rows.length;
}
if(_7aa>data.rows.length){
_7aa=data.rows.length;
}
function _7ac(_7ad){
var _7ae=_7ad?1:2;
for(var i=data.rows.length-1;i>=_7aa;i--){
var tr=opts.finder.getTr(_7a9,i,"body",_7ae);
tr.attr("datagrid-row-index",i+1);
tr.attr("id",_7ab.rowIdPrefix+"-"+_7ae+"-"+(i+1));
if(_7ad&&opts.rownumbers){
var _7af=i+2;
if(opts.pagination){
_7af+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_7af);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i+1)%2?"datagrid-row-alt":"");
}
}
};
function _7b0(_7b1){
var _7b2=_7b1?1:2;
var _7b3=$(_7a9).datagrid("getColumnFields",_7b1);
var _7b4=_7ab.rowIdPrefix+"-"+_7b2+"-"+_7aa;
var tr="<tr id=\""+_7b4+"\" class=\"datagrid-row\" datagrid-row-index=\""+_7aa+"\"></tr>";
if(_7aa>=data.rows.length){
if(data.rows.length){
opts.finder.getTr(_7a9,"","last",_7b2).after(tr);
}else{
var cc=_7b1?dc.body1:dc.body2;
cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+tr+"</tbody></table>");
}
}else{
opts.finder.getTr(_7a9,_7aa+1,"body",_7b2).before(tr);
}
};
_7ac.call(this,true);
_7ac.call(this,false);
_7b0.call(this,true);
_7b0.call(this,false);
data.total+=1;
data.rows.splice(_7aa,0,row);
this.refreshRow.call(this,_7a9,_7aa);
},deleteRow:function(_7b5,_7b6){
var _7b7=$.data(_7b5,"datagrid");
var opts=_7b7.options;
var data=_7b7.data;
function _7b8(_7b9){
var _7ba=_7b9?1:2;
for(var i=_7b6+1;i<data.rows.length;i++){
var tr=opts.finder.getTr(_7b5,i,"body",_7ba);
tr.attr("datagrid-row-index",i-1);
tr.attr("id",_7b7.rowIdPrefix+"-"+_7ba+"-"+(i-1));
if(_7b9&&opts.rownumbers){
var _7bb=i;
if(opts.pagination){
_7bb+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_7bb);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i-1)%2?"datagrid-row-alt":"");
}
}
};
opts.finder.getTr(_7b5,_7b6).remove();
_7b8.call(this,true);
_7b8.call(this,false);
data.total-=1;
data.rows.splice(_7b6,1);
},onBeforeRender:function(_7bc,rows){
},onAfterRender:function(_7bd){
var _7be=$.data(_7bd,"datagrid");
var opts=_7be.options;
if(opts.showFooter){
var _7bf=$(_7bd).datagrid("getPanel").find("div.datagrid-footer");
_7bf.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
}
if(opts.finder.getRows(_7bd).length==0){
this.renderEmptyRow(_7bd);
}
},renderEmptyRow:function(_7c0){
var cols=$.map($(_7c0).datagrid("getColumnFields"),function(_7c1){
return $(_7c0).datagrid("getColumnOption",_7c1);
});
$.map(cols,function(col){
col.formatter1=col.formatter;
col.styler1=col.styler;
col.formatter=col.styler=undefined;
});
var _7c2=$.data(_7c0,"datagrid").dc.body2;
_7c2.html(this.renderTable(_7c0,0,[{}],false));
_7c2.find("tbody *").css({height:1,borderColor:"transparent",background:"transparent"});
var tr=_7c2.find(".datagrid-row");
tr.removeClass("datagrid-row").removeAttr("datagrid-row-index");
tr.find(".datagrid-cell,.datagrid-cell-check").empty();
$.map(cols,function(col){
col.formatter=col.formatter1;
col.styler=col.styler1;
col.formatter1=col.styler1=undefined;
});
}};
//Modify by gongjg on 2015-10-10
//��������,showPageInfo,showPageList
$.fn.datagrid.defaults=$.extend({},$.fn.panel.defaults,{sharedStyleSheet:false,frozenColumns:undefined,columns:undefined,fitColumns:false,resizeHandle:"right",autoRowHeight:true,toolbar:null,striped:false,method:"post",nowrap:true,idField:null,url:null,data:null,loadMsg:"Processing, please wait ...",rownumbers:false,singleSelect:false,ctrlSelect:false,selectOnCheck:true,checkOnSelect:true,pagination:false,pagePosition:"bottom",pageNumber:1,pageSize:10,pageList:[10,20,30,40,50],showPageInfo:true,showPageList:false,queryParams:{},sortName:null,sortOrder:"asc",multiSort:false,remoteSort:true,showHeader:true,showFooter:false,scrollbarSize:18,rowEvents:{mouseover:_621(true),mouseout:_621(false),click:_629,dblclick:_633,contextmenu:_637},rowStyler:function(_7c3,_7c4){
},loader:function(_7c5,_7c6,_7c7){
var opts=$(this).datagrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_7c5,dataType:"json",success:function(data){
_7c6(data);
},error:function(){
_7c7.apply(this,arguments);
}});
},loadFilter:function(data){
if(typeof data.length=="number"&&typeof data.splice=="function"){
return {total:data.length,rows:data};
}else{
return data;
}
},editors:_731,finder:{getTr:function(_7c8,_7c9,type,_7ca){
type=type||"body";
_7ca=_7ca||0;
var _7cb=$.data(_7c8,"datagrid");
var dc=_7cb.dc;
var opts=_7cb.options;
if(_7ca==0){
var tr1=opts.finder.getTr(_7c8,_7c9,type,1);
var tr2=opts.finder.getTr(_7c8,_7c9,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+_7cb.rowIdPrefix+"-"+_7ca+"-"+_7c9);
if(!tr.length){
tr=(_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index="+_7c9+"]");
}
return tr;
}else{
if(type=="footer"){
return (_7ca==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index="+_7c9+"]");
}else{
if(type=="selected"){
return (_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-checked");
}else{
if(type=="editing"){
return (_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-editing");
}else{
if(type=="last"){
return (_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
}else{
if(type=="allbody"){
return (_7ca==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]");
}else{
if(type=="allfooter"){
return (_7ca==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
}
}
}
}
}
}
}
}
}
}
},getRow:function(_7cc,p){
var _7cd=(typeof p=="object")?p.attr("datagrid-row-index"):p;
return $.data(_7cc,"datagrid").data.rows[parseInt(_7cd)];
},getRows:function(_7ce){
return $(_7ce).datagrid("getRows");
}},view:_77a,onBeforeLoad:function(_7cf){
},onLoadSuccess:function(){
},onLoadError:function(){
},onClickRow:function(_7d0,_7d1){
},onDblClickRow:function(_7d2,_7d3){
},onClickCell:function(_7d4,_7d5,_7d6){
},onDblClickCell:function(_7d7,_7d8,_7d9){
},onBeforeSortColumn:function(sort,_7da){
},onSortColumn:function(sort,_7db){
},onResizeColumn:function(_7dc,_7dd){
},onBeforeSelect:function(_7de,_7df){
},onSelect:function(_7e0,_7e1){
},onBeforeUnselect:function(_7e2,_7e3){
},onUnselect:function(_7e4,_7e5){
},onSelectAll:function(rows){
},onUnselectAll:function(rows){
},onBeforeCheck:function(_7e6,_7e7){
},onCheck:function(_7e8,_7e9){
},onBeforeUncheck:function(_7ea,_7eb){
},onUncheck:function(_7ec,_7ed){
},onCheckAll:function(rows){
},onUncheckAll:function(rows){
},onBeforeEdit:function(_7ee,_7ef){
},onBeginEdit:function(_7f0,_7f1){
},onEndEdit:function(_7f2,_7f3,_7f4){
},onAfterEdit:function(_7f5,_7f6,_7f7){
},onCancelEdit:function(_7f8,_7f9){
},onHeaderContextMenu:function(e,_7fa){
},onRowContextMenu:function(e,_7fb,_7fc){
}});
})(jQuery);
(function($){
var _7fd;
$(document).unbind(".propertygrid").bind("mousedown.propertygrid",function(e){
var p=$(e.target).closest("div.datagrid-view,div.combo-panel");
if(p.length){
return;
}
_7fe(_7fd);
_7fd=undefined;
});
function _7ff(_800){
var _801=$.data(_800,"propertygrid");
var opts=$.data(_800,"propertygrid").options;
$(_800).datagrid($.extend({},opts,{cls:"propertygrid",view:(opts.showGroup?opts.groupView:opts.view),onBeforeEdit:function(_802,row){
if(opts.onBeforeEdit.call(_800,_802,row)==false){
return false;
}
var dg=$(this);
var row=dg.datagrid("getRows")[_802];
var col=dg.datagrid("getColumnOption","value");
col.editor=row.editor;
},onClickCell:function(_803,_804,_805){
if(_7fd!=this){
_7fe(_7fd);
_7fd=this;
}
if(opts.editIndex!=_803){
_7fe(_7fd);
$(this).datagrid("beginEdit",_803);
var ed=$(this).datagrid("getEditor",{index:_803,field:_804});
if(!ed){
ed=$(this).datagrid("getEditor",{index:_803,field:"value"});
}
if(ed){
var t=$(ed.target);
var _806=t.data("textbox")?t.textbox("textbox"):t;
_806.focus();
opts.editIndex=_803;
}
}
opts.onClickCell.call(_800,_803,_804,_805);
},loadFilter:function(data){
_7fe(this);
return opts.loadFilter.call(this,data);
}}));
};
function _7fe(_807){
var t=$(_807);
if(!t.length){
return;
}
var opts=$.data(_807,"propertygrid").options;
opts.finder.getTr(_807,null,"editing").each(function(){
var _808=parseInt($(this).attr("datagrid-row-index"));
if(t.datagrid("validateRow",_808)){
t.datagrid("endEdit",_808);
}else{
t.datagrid("cancelEdit",_808);
}
});
opts.editIndex=undefined;
};
$.fn.propertygrid=function(_809,_80a){
if(typeof _809=="string"){
var _80b=$.fn.propertygrid.methods[_809];
if(_80b){
return _80b(this,_80a);
}else{
return this.datagrid(_809,_80a);
}
}
_809=_809||{};
return this.each(function(){
var _80c=$.data(this,"propertygrid");
if(_80c){
$.extend(_80c.options,_809);
}else{
var opts=$.extend({},$.fn.propertygrid.defaults,$.fn.propertygrid.parseOptions(this),_809);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.columns=$.extend(true,[],opts.columns);
$.data(this,"propertygrid",{options:opts});
}
_7ff(this);
});
};
$.fn.propertygrid.methods={options:function(jq){
return $.data(jq[0],"propertygrid").options;
}};
$.fn.propertygrid.parseOptions=function(_80d){
return $.extend({},$.fn.datagrid.parseOptions(_80d),$.parser.parseOptions(_80d,[{showGroup:"boolean"}]));
};
var _80e=$.extend({},$.fn.datagrid.defaults.view,{render:function(_80f,_810,_811){
var _812=[];
var _813=this.groups;
for(var i=0;i<_813.length;i++){
_812.push(this.renderGroup.call(this,_80f,i,_813[i],_811));
}
$(_810).html(_812.join(""));
},renderGroup:function(_814,_815,_816,_817){
var _818=$.data(_814,"datagrid");
var opts=_818.options;
var _819=$(_814).datagrid("getColumnFields",_817);
var _81a=[];
_81a.push("<div class=\"datagrid-group\" group-index="+_815+">");
_81a.push("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"height:100%\"><tbody>");
_81a.push("<tr>");
if((_817&&(opts.rownumbers||opts.frozenColumns.length))||(!_817&&!(opts.rownumbers||opts.frozenColumns.length))){
_81a.push("<td style=\"border:0;text-align:center;width:25px\"><span class=\"datagrid-row-expander datagrid-row-collapse\" style=\"display:inline-block;width:16px;height:16px;cursor:pointer\">&nbsp;</span></td>");
}
_81a.push("<td style=\"border:0;\">");
if(!_817){
_81a.push("<span class=\"datagrid-group-title\">");
_81a.push(opts.groupFormatter.call(_814,_816.value,_816.rows));
_81a.push("</span>");
}
_81a.push("</td>");
_81a.push("</tr>");
_81a.push("</tbody></table>");
_81a.push("</div>");
_81a.push("<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>");
var _81b=_816.startIndex;
for(var j=0;j<_816.rows.length;j++){
var css=opts.rowStyler?opts.rowStyler.call(_814,_81b,_816.rows[j]):"";
var _81c="";
var _81d="";
if(typeof css=="string"){
_81d=css;
}else{
if(css){
_81c=css["class"]||"";
_81d=css["style"]||"";
}
}
var cls="class=\"datagrid-row "+(_81b%2&&opts.striped?"datagrid-row-alt ":" ")+_81c+"\"";
var _81e=_81d?"style=\""+_81d+"\"":"";
var _81f=_818.rowIdPrefix+"-"+(_817?1:2)+"-"+_81b;
_81a.push("<tr id=\""+_81f+"\" datagrid-row-index=\""+_81b+"\" "+cls+" "+_81e+">");
_81a.push(this.renderRow.call(this,_814,_819,_817,_81b,_816.rows[j]));
_81a.push("</tr>");
_81b++;
}
_81a.push("</tbody></table>");
return _81a.join("");
},bindEvents:function(_820){
var _821=$.data(_820,"datagrid");
var dc=_821.dc;
var body=dc.body1.add(dc.body2);
var _822=($.data(body[0],"events")||$._data(body[0],"events")).click[0].handler;
body.unbind("click").bind("click",function(e){
var tt=$(e.target);
var _823=tt.closest("span.datagrid-row-expander");
if(_823.length){
var _824=_823.closest("div.datagrid-group").attr("group-index");
if(_823.hasClass("datagrid-row-collapse")){
$(_820).datagrid("collapseGroup",_824);
}else{
$(_820).datagrid("expandGroup",_824);
}
}else{
_822(e);
}
e.stopPropagation();
});
},onBeforeRender:function(_825,rows){
var _826=$.data(_825,"datagrid");
var opts=_826.options;
_827();
var _828=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _829=_82a(row[opts.groupField]);
if(!_829){
_829={value:row[opts.groupField],rows:[row]};
_828.push(_829);
}else{
_829.rows.push(row);
}
}
var _82b=0;
var _82c=[];
for(var i=0;i<_828.length;i++){
var _829=_828[i];
_829.startIndex=_82b;
_82b+=_829.rows.length;
_82c=_82c.concat(_829.rows);
}
_826.data.rows=_82c;
this.groups=_828;
var that=this;
setTimeout(function(){
that.bindEvents(_825);
},0);
function _82a(_82d){
for(var i=0;i<_828.length;i++){
var _82e=_828[i];
if(_82e.value==_82d){
return _82e;
}
}
return null;
};
function _827(){
if(!$("#datagrid-group-style").length){
$("head").append("<style id=\"datagrid-group-style\">"+".datagrid-group{height:25px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}"+"</style>");
}
};
}});
$.extend($.fn.datagrid.methods,{expandGroup:function(jq,_82f){
return jq.each(function(){
var view=$.data(this,"datagrid").dc.view;
var _830=view.find(_82f!=undefined?"div.datagrid-group[group-index=\""+_82f+"\"]":"div.datagrid-group");
var _831=_830.find("span.datagrid-row-expander");
if(_831.hasClass("datagrid-row-expand")){
_831.removeClass("datagrid-row-expand").addClass("datagrid-row-collapse");
_830.next("table").show();
}
$(this).datagrid("fixRowHeight");
});
},collapseGroup:function(jq,_832){
return jq.each(function(){
var view=$.data(this,"datagrid").dc.view;
var _833=view.find(_832!=undefined?"div.datagrid-group[group-index=\""+_832+"\"]":"div.datagrid-group");
var _834=_833.find("span.datagrid-row-expander");
if(_834.hasClass("datagrid-row-collapse")){
_834.removeClass("datagrid-row-collapse").addClass("datagrid-row-expand");
_833.next("table").hide();
}
$(this).datagrid("fixRowHeight");
});
}});
$.extend(_80e,{refreshGroupTitle:function(_835,_836){
var _837=$.data(_835,"datagrid");
var opts=_837.options;
var dc=_837.dc;
var _838=this.groups[_836];
var span=dc.body2.children("div.datagrid-group[group-index="+_836+"]").find("span.datagrid-group-title");
span.html(opts.groupFormatter.call(_835,_838.value,_838.rows));
},insertRow:function(_839,_83a,row){
var _83b=$.data(_839,"datagrid");
var opts=_83b.options;
var dc=_83b.dc;
var _83c=null;
var _83d;
for(var i=0;i<this.groups.length;i++){
if(this.groups[i].value==row[opts.groupField]){
_83c=this.groups[i];
_83d=i;
break;
}
}
if(_83c){
if(_83a==undefined||_83a==null){
_83a=_83b.data.rows.length;
}
if(_83a<_83c.startIndex){
_83a=_83c.startIndex;
}else{
if(_83a>_83c.startIndex+_83c.rows.length){
_83a=_83c.startIndex+_83c.rows.length;
}
}
$.fn.datagrid.defaults.view.insertRow.call(this,_839,_83a,row);
if(_83a>=_83c.startIndex+_83c.rows.length){
_83e(_83a,true);
_83e(_83a,false);
}
_83c.rows.splice(_83a-_83c.startIndex,0,row);
}else{
_83c={value:row[opts.groupField],rows:[row],startIndex:_83b.data.rows.length};
_83d=this.groups.length;
dc.body1.append(this.renderGroup.call(this,_839,_83d,_83c,true));
dc.body2.append(this.renderGroup.call(this,_839,_83d,_83c,false));
this.groups.push(_83c);
_83b.data.rows.push(row);
}
this.refreshGroupTitle(_839,_83d);
function _83e(_83f,_840){
var _841=_840?1:2;
var _842=opts.finder.getTr(_839,_83f-1,"body",_841);
var tr=opts.finder.getTr(_839,_83f,"body",_841);
tr.insertAfter(_842);
};
},updateRow:function(_843,_844,row){
var opts=$.data(_843,"datagrid").options;
$.fn.datagrid.defaults.view.updateRow.call(this,_843,_844,row);
var tb=opts.finder.getTr(_843,_844,"body",2).closest("table.datagrid-btable");
var _845=parseInt(tb.prev().attr("group-index"));
this.refreshGroupTitle(_843,_845);
},deleteRow:function(_846,_847){
var _848=$.data(_846,"datagrid");
var opts=_848.options;
var dc=_848.dc;
var body=dc.body1.add(dc.body2);
var tb=opts.finder.getTr(_846,_847,"body",2).closest("table.datagrid-btable");
var _849=parseInt(tb.prev().attr("group-index"));
$.fn.datagrid.defaults.view.deleteRow.call(this,_846,_847);
var _84a=this.groups[_849];
if(_84a.rows.length>1){
_84a.rows.splice(_847-_84a.startIndex,1);
this.refreshGroupTitle(_846,_849);
}else{
body.children("div.datagrid-group[group-index="+_849+"]").remove();
for(var i=_849+1;i<this.groups.length;i++){
body.children("div.datagrid-group[group-index="+i+"]").attr("group-index",i-1);
}
this.groups.splice(_849,1);
}
var _847=0;
for(var i=0;i<this.groups.length;i++){
var _84a=this.groups[i];
_84a.startIndex=_847;
_847+=_84a.rows.length;
}
}});
$.fn.propertygrid.defaults=$.extend({},$.fn.datagrid.defaults,{singleSelect:true,remoteSort:false,fitColumns:true,loadMsg:"",frozenColumns:[[{field:"f",width:16,resizable:false}]],columns:[[{field:"name",title:"Name",width:100,sortable:true},{field:"value",title:"Value",width:100,resizable:false}]],showGroup:false,groupView:_80e,groupField:"group",groupFormatter:function(_84b,rows){
return _84b;
}});
})(jQuery);
(function($){
function _84c(_84d){
var _84e=$.data(_84d,"treegrid");
var opts=_84e.options;
$(_84d).datagrid($.extend({},opts,{url:null,data:null,loader:function(){
return false;
},onBeforeLoad:function(){
return false;
},onLoadSuccess:function(){
},onResizeColumn:function(_84f,_850){
_85d(_84d);
opts.onResizeColumn.call(_84d,_84f,_850);
},onBeforeSortColumn:function(sort,_851){
if(opts.onBeforeSortColumn.call(_84d,sort,_851)==false){
return false;
}
},onSortColumn:function(sort,_852){
opts.sortName=sort;
opts.sortOrder=_852;
if(opts.remoteSort){
_85c(_84d);
}else{
var data=$(_84d).treegrid("getData");
_873(_84d,0,data);
}
opts.onSortColumn.call(_84d,sort,_852);
},onClickCell:function(_853,_854){
opts.onClickCell.call(_84d,_854,find(_84d,_853));
},onDblClickCell:function(_855,_856){
opts.onDblClickCell.call(_84d,_856,find(_84d,_855));
},onRowContextMenu:function(e,_857){
opts.onContextMenu.call(_84d,e,find(_84d,_857));
}}));
var _858=$.data(_84d,"datagrid").options;
opts.columns=_858.columns;
opts.frozenColumns=_858.frozenColumns;
_84e.dc=$.data(_84d,"datagrid").dc;
if(opts.pagination){
var _859=$(_84d).datagrid("getPager");
_859.pagination({pageNumber:opts.pageNumber,pageSize:opts.pageSize,pageList:opts.pageList,onSelectPage:function(_85a,_85b){
opts.pageNumber=_85a;
opts.pageSize=_85b;
_85c(_84d);
}});
opts.pageSize=_859.pagination("options").pageSize;
}
};
function _85d(_85e,_85f){
var opts=$.data(_85e,"datagrid").options;
var dc=$.data(_85e,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight)){
if(_85f!=undefined){
var _860=_861(_85e,_85f);
for(var i=0;i<_860.length;i++){
_862(_860[i][opts.idField]);
}
}
}
$(_85e).datagrid("fixRowHeight",_85f);
function _862(_863){
var tr1=opts.finder.getTr(_85e,_863,"body",1);
var tr2=opts.finder.getTr(_85e,_863,"body",2);
tr1.css("height","");
tr2.css("height","");
var _864=Math.max(tr1.height(),tr2.height());
tr1.css("height",_864);
tr2.css("height",_864);
};
};
function _865(_866){
var dc=$.data(_866,"datagrid").dc;
var opts=$.data(_866,"treegrid").options;
if(!opts.rownumbers){
return;
}
dc.body1.find("div.datagrid-cell-rownumber").each(function(i){
$(this).html(i+1);
});
};
function _867(_868){
return function(e){
$.fn.datagrid.defaults.rowEvents[_868?"mouseover":"mouseout"](e);
var tt=$(e.target);
var fn=_868?"addClass":"removeClass";
if(tt.hasClass("tree-hit")){
tt.hasClass("tree-expanded")?tt[fn]("tree-expanded-hover"):tt[fn]("tree-collapsed-hover");
}
};
};
function _869(e){
var tt=$(e.target);
if(tt.hasClass("tree-hit")){
var tr=tt.closest("tr.datagrid-row");
var _86a=tr.closest("div.datagrid-view").children(".datagrid-f")[0];
_86b(_86a,tr.attr("node-id"));
}else{
$.fn.datagrid.defaults.rowEvents.click(e);
}
};
function _86c(_86d,_86e){
var opts=$.data(_86d,"treegrid").options;
var tr1=opts.finder.getTr(_86d,_86e,"body",1);
var tr2=opts.finder.getTr(_86d,_86e,"body",2);
var _86f=$(_86d).datagrid("getColumnFields",true).length+(opts.rownumbers?1:0);
var _870=$(_86d).datagrid("getColumnFields",false).length;
_871(tr1,_86f);
_871(tr2,_870);
function _871(tr,_872){
$("<tr class=\"treegrid-tr-tree\">"+"<td style=\"border:0px\" colspan=\""+_872+"\">"+"<div></div>"+"</td>"+"</tr>").insertAfter(tr);
};
};
function _873(_874,_875,data,_876){
var _877=$.data(_874,"treegrid");
var opts=_877.options;
var dc=_877.dc;
data=opts.loadFilter.call(_874,data,_875);
var node=find(_874,_875);
if(node){
var _878=opts.finder.getTr(_874,_875,"body",1);
var _879=opts.finder.getTr(_874,_875,"body",2);
var cc1=_878.next("tr.treegrid-tr-tree").children("td").children("div");
var cc2=_879.next("tr.treegrid-tr-tree").children("td").children("div");
if(!_876){
node.children=[];
}
}else{
var cc1=dc.body1;
var cc2=dc.body2;
if(!_876){
_877.data=[];
}
}
if(!_876){
cc1.empty();
cc2.empty();
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_874,_875,data);
}
opts.view.render.call(opts.view,_874,cc1,true);
opts.view.render.call(opts.view,_874,cc2,false);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_874,dc.footer1,true);
opts.view.renderFooter.call(opts.view,_874,dc.footer2,false);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_874);
}
if(!_875&&opts.pagination){
var _87a=$.data(_874,"treegrid").total;
var _87b=$(_874).datagrid("getPager");
if(_87b.pagination("options").total!=_87a){
_87b.pagination({total:_87a});
}
}
_85d(_874);
_865(_874);
$(_874).treegrid("showLines");
$(_874).treegrid("setSelectionState");
$(_874).treegrid("autoSizeColumn");
opts.onLoadSuccess.call(_874,node,data);
};
function _85c(_87c,_87d,_87e,_87f,_880){
var opts=$.data(_87c,"treegrid").options;
var body=$(_87c).datagrid("getPanel").find("div.datagrid-body");
if(_87e){
opts.queryParams=_87e;
}
var _881=$.extend({},opts.queryParams);
if(opts.pagination){
//Modified by gongjg on 2015-10-10
//page��ΪpageNo,row��ΪpageSize
$.extend(_881,{pageNo:opts.pageNumber,pageSize:opts.pageSize});
}
if(opts.sortName){
$.extend(_881,{sort:opts.sortName,order:opts.sortOrder});
}
var row=find(_87c,_87d);
if(opts.onBeforeLoad.call(_87c,row,_881)==false){
return;
}
var _882=body.find("tr[node-id=\""+_87d+"\"] span.tree-folder");
_882.addClass("tree-loading");
$(_87c).treegrid("loading");
var _883=opts.loader.call(_87c,_881,function(data){
_882.removeClass("tree-loading");
$(_87c).treegrid("loaded");
_873(_87c,_87d,data,_87f);
if(_880){
_880();
}
},function(){
_882.removeClass("tree-loading");
$(_87c).treegrid("loaded");
opts.onLoadError.apply(_87c,arguments);
if(_880){
_880();
}
});
if(_883==false){
_882.removeClass("tree-loading");
$(_87c).treegrid("loaded");
}
};
function _884(_885){
var rows=_886(_885);
if(rows.length){
return rows[0];
}else{
return null;
}
};
function _886(_887){
return $.data(_887,"treegrid").data;
};
function _888(_889,_88a){
var row=find(_889,_88a);
if(row._parentId){
return find(_889,row._parentId);
}else{
return null;
}
};
function _861(_88b,_88c){
var opts=$.data(_88b,"treegrid").options;
var body=$(_88b).datagrid("getPanel").find("div.datagrid-view2 div.datagrid-body");
var _88d=[];
if(_88c){
_88e(_88c);
}else{
var _88f=_886(_88b);
for(var i=0;i<_88f.length;i++){
_88d.push(_88f[i]);
_88e(_88f[i][opts.idField]);
}
}
function _88e(_890){
var _891=find(_88b,_890);
if(_891&&_891.children){
for(var i=0,len=_891.children.length;i<len;i++){
var _892=_891.children[i];
_88d.push(_892);
_88e(_892[opts.idField]);
}
}
};
return _88d;
};
function _893(_894,_895){
if(!_895){
return 0;
}
var opts=$.data(_894,"treegrid").options;
var view=$(_894).datagrid("getPanel").children("div.datagrid-view");
var node=view.find("div.datagrid-body tr[node-id=\""+_895+"\"]").children("td[field=\""+opts.treeField+"\"]");
return node.find("span.tree-indent,span.tree-hit").length;
};
function find(_896,_897){
var opts=$.data(_896,"treegrid").options;
var data=$.data(_896,"treegrid").data;
var cc=[data];
while(cc.length){
var c=cc.shift();
for(var i=0;i<c.length;i++){
var node=c[i];
if(node[opts.idField]==_897){
return node;
}else{
if(node["children"]){
cc.push(node["children"]);
}
}
}
}
return null;
};
function _898(_899,_89a){
var opts=$.data(_899,"treegrid").options;
var row=find(_899,_89a);
var tr=opts.finder.getTr(_899,_89a);
var hit=tr.find("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
if(opts.onBeforeCollapse.call(_899,row)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
row.state="closed";
tr=tr.next("tr.treegrid-tr-tree");
var cc=tr.children("td").children("div");
if(opts.animate){
cc.slideUp("normal",function(){
$(_899).treegrid("autoSizeColumn");
_85d(_899,_89a);
opts.onCollapse.call(_899,row);
});
}else{
cc.hide();
$(_899).treegrid("autoSizeColumn");
_85d(_899,_89a);
opts.onCollapse.call(_899,row);
}
};
function _89b(_89c,_89d){
var opts=$.data(_89c,"treegrid").options;
var tr=opts.finder.getTr(_89c,_89d);
var hit=tr.find("span.tree-hit");
var row=find(_89c,_89d);
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
if(opts.onBeforeExpand.call(_89c,row)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var _89e=tr.next("tr.treegrid-tr-tree");
if(_89e.length){
var cc=_89e.children("td").children("div");
_89f(cc);
}else{
_86c(_89c,row[opts.idField]);
var _89e=tr.next("tr.treegrid-tr-tree");
var cc=_89e.children("td").children("div");
cc.hide();
var _8a0=$.extend({},opts.queryParams||{});
_8a0.id=row[opts.idField];
_85c(_89c,row[opts.idField],_8a0,true,function(){
if(cc.is(":empty")){
_89e.remove();
}else{
_89f(cc);
}
});
}
function _89f(cc){
row.state="open";
if(opts.animate){
cc.slideDown("normal",function(){
$(_89c).treegrid("autoSizeColumn");
_85d(_89c,_89d);
opts.onExpand.call(_89c,row);
});
}else{
cc.show();
$(_89c).treegrid("autoSizeColumn");
_85d(_89c,_89d);
opts.onExpand.call(_89c,row);
}
};
};
function _86b(_8a1,_8a2){
var opts=$.data(_8a1,"treegrid").options;
var tr=opts.finder.getTr(_8a1,_8a2);
var hit=tr.find("span.tree-hit");
if(hit.hasClass("tree-expanded")){
_898(_8a1,_8a2);
}else{
_89b(_8a1,_8a2);
}
};
function _8a3(_8a4,_8a5){
var opts=$.data(_8a4,"treegrid").options;
var _8a6=_861(_8a4,_8a5);
if(_8a5){
_8a6.unshift(find(_8a4,_8a5));
}
for(var i=0;i<_8a6.length;i++){
_898(_8a4,_8a6[i][opts.idField]);
}
};
function _8a7(_8a8,_8a9){
var opts=$.data(_8a8,"treegrid").options;
var _8aa=_861(_8a8,_8a9);
if(_8a9){
_8aa.unshift(find(_8a8,_8a9));
}
for(var i=0;i<_8aa.length;i++){
_89b(_8a8,_8aa[i][opts.idField]);
}
};
function _8ab(_8ac,_8ad){
var opts=$.data(_8ac,"treegrid").options;
var ids=[];
var p=_888(_8ac,_8ad);
while(p){
var id=p[opts.idField];
ids.unshift(id);
p=_888(_8ac,id);
}
for(var i=0;i<ids.length;i++){
_89b(_8ac,ids[i]);
}
};
function _8ae(_8af,_8b0){
var opts=$.data(_8af,"treegrid").options;
if(_8b0.parent){
var tr=opts.finder.getTr(_8af,_8b0.parent);
if(tr.next("tr.treegrid-tr-tree").length==0){
_86c(_8af,_8b0.parent);
}
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
var _8b1=cell.children("span.tree-icon");
if(_8b1.hasClass("tree-file")){
_8b1.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_8b1);
if(hit.prev().length){
hit.prev().remove();
}
}
}
_873(_8af,_8b0.parent,_8b0.data,true);
};
function _8b2(_8b3,_8b4){
var ref=_8b4.before||_8b4.after;
var opts=$.data(_8b3,"treegrid").options;
var _8b5=_888(_8b3,ref);
_8ae(_8b3,{parent:(_8b5?_8b5[opts.idField]:null),data:[_8b4.data]});
var _8b6=_8b5?_8b5.children:$(_8b3).treegrid("getRoots");
for(var i=0;i<_8b6.length;i++){
if(_8b6[i][opts.idField]==ref){
var _8b7=_8b6[_8b6.length-1];
_8b6.splice(_8b4.before?i:(i+1),0,_8b7);
_8b6.splice(_8b6.length-1,1);
break;
}
}
_8b8(true);
_8b8(false);
_865(_8b3);
$(_8b3).treegrid("showLines");
function _8b8(_8b9){
var _8ba=_8b9?1:2;
var tr=opts.finder.getTr(_8b3,_8b4.data[opts.idField],"body",_8ba);
var _8bb=tr.closest("table.datagrid-btable");
tr=tr.parent().children();
var dest=opts.finder.getTr(_8b3,ref,"body",_8ba);
if(_8b4.before){
tr.insertBefore(dest);
}else{
var sub=dest.next("tr.treegrid-tr-tree");
tr.insertAfter(sub.length?sub:dest);
}
_8bb.remove();
};
};
function _8bc(_8bd,_8be){
var _8bf=$.data(_8bd,"treegrid");
$(_8bd).datagrid("deleteRow",_8be);
_865(_8bd);
_8bf.total-=1;
$(_8bd).datagrid("getPager").pagination("refresh",{total:_8bf.total});
$(_8bd).treegrid("showLines");
};
function _8c0(_8c1){
var t=$(_8c1);
var opts=t.treegrid("options");
if(opts.lines){
t.treegrid("getPanel").addClass("tree-lines");
}else{
t.treegrid("getPanel").removeClass("tree-lines");
return;
}
t.treegrid("getPanel").find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
t.treegrid("getPanel").find("div.datagrid-cell").removeClass("tree-node-last tree-root-first tree-root-one");
var _8c2=t.treegrid("getRoots");
if(_8c2.length>1){
_8c3(_8c2[0]).addClass("tree-root-first");
}else{
if(_8c2.length==1){
_8c3(_8c2[0]).addClass("tree-root-one");
}
}
_8c4(_8c2);
_8c5(_8c2);
function _8c4(_8c6){
$.map(_8c6,function(node){
if(node.children&&node.children.length){
_8c4(node.children);
}else{
var cell=_8c3(node);
cell.find(".tree-icon").prev().addClass("tree-join");
}
});
if(_8c6.length){
var cell=_8c3(_8c6[_8c6.length-1]);
cell.addClass("tree-node-last");
cell.find(".tree-join").removeClass("tree-join").addClass("tree-joinbottom");
}
};
function _8c5(_8c7){
$.map(_8c7,function(node){
if(node.children&&node.children.length){
_8c5(node.children);
}
});
for(var i=0;i<_8c7.length-1;i++){
var node=_8c7[i];
var _8c8=t.treegrid("getLevel",node[opts.idField]);
var tr=opts.finder.getTr(_8c1,node[opts.idField]);
var cc=tr.next().find("tr.datagrid-row td[field=\""+opts.treeField+"\"] div.datagrid-cell");
cc.find("span:eq("+(_8c8-1)+")").addClass("tree-line");
}
};
function _8c3(node){
var tr=opts.finder.getTr(_8c1,node[opts.idField]);
var cell=tr.find("td[field=\""+opts.treeField+"\"] div.datagrid-cell");
return cell;
};
};
$.fn.treegrid=function(_8c9,_8ca){
if(typeof _8c9=="string"){
var _8cb=$.fn.treegrid.methods[_8c9];
if(_8cb){
return _8cb(this,_8ca);
}else{
return this.datagrid(_8c9,_8ca);
}
}
_8c9=_8c9||{};
return this.each(function(){
var _8cc=$.data(this,"treegrid");
if(_8cc){
$.extend(_8cc.options,_8c9);
}else{
_8cc=$.data(this,"treegrid",{options:$.extend({},$.fn.treegrid.defaults,$.fn.treegrid.parseOptions(this),_8c9),data:[]});
}
_84c(this);
if(_8cc.options.data){
$(this).treegrid("loadData",_8cc.options.data);
}
_85c(this);
});
};
$.fn.treegrid.methods={options:function(jq){
return $.data(jq[0],"treegrid").options;
},resize:function(jq,_8cd){
return jq.each(function(){
$(this).datagrid("resize",_8cd);
});
},fixRowHeight:function(jq,_8ce){
return jq.each(function(){
_85d(this,_8ce);
});
},loadData:function(jq,data){
return jq.each(function(){
_873(this,data.parent,data);
});
},load:function(jq,_8cf){
return jq.each(function(){
$(this).treegrid("options").pageNumber=1;
$(this).treegrid("getPager").pagination({pageNumber:1});
$(this).treegrid("reload",_8cf);
});
},reload:function(jq,id){
return jq.each(function(){
var opts=$(this).treegrid("options");
var _8d0={};
if(typeof id=="object"){
_8d0=id;
}else{
_8d0=$.extend({},opts.queryParams);
_8d0.id=id;
}
if(_8d0.id){
var node=$(this).treegrid("find",_8d0.id);
if(node.children){
node.children.splice(0,node.children.length);
}
opts.queryParams=_8d0;
var tr=opts.finder.getTr(this,_8d0.id);
tr.next("tr.treegrid-tr-tree").remove();
tr.find("span.tree-hit").removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
_89b(this,_8d0.id);
}else{
_85c(this,null,_8d0);
}
});
},reloadFooter:function(jq,_8d1){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
var dc=$.data(this,"datagrid").dc;
if(_8d1){
$.data(this,"treegrid").footer=_8d1;
}
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,this);
}
$(this).treegrid("fixRowHeight");
}
});
},getData:function(jq){
return $.data(jq[0],"treegrid").data;
},getFooterRows:function(jq){
return $.data(jq[0],"treegrid").footer;
},getRoot:function(jq){
return _884(jq[0]);
},getRoots:function(jq){
return _886(jq[0]);
},getParent:function(jq,id){
return _888(jq[0],id);
},getChildren:function(jq,id){
return _861(jq[0],id);
},getLevel:function(jq,id){
return _893(jq[0],id);
},find:function(jq,id){
return find(jq[0],id);
},isLeaf:function(jq,id){
var opts=$.data(jq[0],"treegrid").options;
var tr=opts.finder.getTr(jq[0],id);
var hit=tr.find("span.tree-hit");
return hit.length==0;
},select:function(jq,id){
return jq.each(function(){
$(this).datagrid("selectRow",id);
});
},unselect:function(jq,id){
return jq.each(function(){
$(this).datagrid("unselectRow",id);
});
},collapse:function(jq,id){
return jq.each(function(){
_898(this,id);
});
},expand:function(jq,id){
return jq.each(function(){
_89b(this,id);
});
},toggle:function(jq,id){
return jq.each(function(){
_86b(this,id);
});
},collapseAll:function(jq,id){
return jq.each(function(){
_8a3(this,id);
});
},expandAll:function(jq,id){
return jq.each(function(){
_8a7(this,id);
});
},expandTo:function(jq,id){
return jq.each(function(){
_8ab(this,id);
});
},append:function(jq,_8d2){
return jq.each(function(){
_8ae(this,_8d2);
});
},insert:function(jq,_8d3){
return jq.each(function(){
_8b2(this,_8d3);
});
},remove:function(jq,id){
return jq.each(function(){
_8bc(this,id);
});
},pop:function(jq,id){
var row=jq.treegrid("find",id);
jq.treegrid("remove",id);
return row;
},refresh:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
opts.view.refreshRow.call(opts.view,this,id);
});
},update:function(jq,_8d4){
return jq.each(function(){
var opts=$.data(this,"treegrid").options;
opts.view.updateRow.call(opts.view,this,_8d4.id,_8d4.row);
});
},beginEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("beginEdit",id);
$(this).treegrid("fixRowHeight",id);
});
},endEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("endEdit",id);
});
},cancelEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("cancelEdit",id);
});
},showLines:function(jq){
return jq.each(function(){
_8c0(this);
});
}};
$.fn.treegrid.parseOptions=function(_8d5){
return $.extend({},$.fn.datagrid.parseOptions(_8d5),$.parser.parseOptions(_8d5,["treeField",{animate:"boolean"}]));
};
var _8d6=$.extend({},$.fn.datagrid.defaults.view,{render:function(_8d7,_8d8,_8d9){
var opts=$.data(_8d7,"treegrid").options;
var _8da=$(_8d7).datagrid("getColumnFields",_8d9);
var _8db=$.data(_8d7,"datagrid").rowIdPrefix;
if(_8d9){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return;
}
}
var view=this;
if(this.treeNodes&&this.treeNodes.length){
var _8dc=_8dd(_8d9,this.treeLevel,this.treeNodes);
$(_8d8).append(_8dc.join(""));
}
function _8dd(_8de,_8df,_8e0){
var _8e1=$(_8d7).treegrid("getParent",_8e0[0][opts.idField]);
var _8e2=(_8e1?_8e1.children.length:$(_8d7).treegrid("getRoots").length)-_8e0.length;
var _8e3=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_8e0.length;i++){
var row=_8e0[i];
if(row.state!="open"&&row.state!="closed"){
row.state="open";
}
var css=opts.rowStyler?opts.rowStyler.call(_8d7,row):"";
var _8e4="";
var _8e5="";
if(typeof css=="string"){
_8e5=css;
}else{
if(css){
_8e4=css["class"]||"";
_8e5=css["style"]||"";
}
}
var cls="class=\"datagrid-row "+(_8e2++%2&&opts.striped?"datagrid-row-alt ":" ")+_8e4+"\"";
var _8e6=_8e5?"style=\""+_8e5+"\"":"";
var _8e7=_8db+"-"+(_8de?1:2)+"-"+row[opts.idField];
_8e3.push("<tr id=\""+_8e7+"\" node-id=\""+row[opts.idField]+"\" "+cls+" "+_8e6+">");
_8e3=_8e3.concat(view.renderRow.call(view,_8d7,_8da,_8de,_8df,row));
_8e3.push("</tr>");
if(row.children&&row.children.length){
var tt=_8dd(_8de,_8df+1,row.children);
var v=row.state=="closed"?"none":"block";
_8e3.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan="+(_8da.length+(opts.rownumbers?1:0))+"><div style=\"display:"+v+"\">");
_8e3=_8e3.concat(tt);
_8e3.push("</div></td></tr>");
}
}
_8e3.push("</tbody></table>");
return _8e3;
};
},renderFooter:function(_8e8,_8e9,_8ea){
var opts=$.data(_8e8,"treegrid").options;
var rows=$.data(_8e8,"treegrid").footer||[];
var _8eb=$(_8e8).datagrid("getColumnFields",_8ea);
var _8ec=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
row[opts.idField]=row[opts.idField]||("foot-row-id"+i);
_8ec.push("<tr class=\"datagrid-row\" node-id=\""+row[opts.idField]+"\">");
_8ec.push(this.renderRow.call(this,_8e8,_8eb,_8ea,0,row));
_8ec.push("</tr>");
}
_8ec.push("</tbody></table>");
$(_8e9).html(_8ec.join(""));
},renderRow:function(_8ed,_8ee,_8ef,_8f0,row){
var opts=$.data(_8ed,"treegrid").options;
var cc=[];
if(_8ef&&opts.rownumbers){
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
}
for(var i=0;i<_8ee.length;i++){
var _8f1=_8ee[i];
var col=$(_8ed).datagrid("getColumnOption",_8f1);
if(col){
var css=col.styler?(col.styler(row[_8f1],row)||""):"";
var _8f2="";
var _8f3="";
if(typeof css=="string"){
_8f3=css;
}else{
if(cc){
_8f2=css["class"]||"";
_8f3=css["style"]||"";
}
}
var cls=_8f2?"class=\""+_8f2+"\"":"";
var _8f4=col.hidden?"style=\"display:none;"+_8f3+"\"":(_8f3?"style=\""+_8f3+"\"":"");
cc.push("<td field=\""+_8f1+"\" "+cls+" "+_8f4+">");
var _8f4="";
if(!col.checkbox){
if(col.align){
_8f4+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_8f4+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_8f4+="height:auto;";
}
}
}
cc.push("<div style=\""+_8f4+"\" ");
if(col.checkbox){
cc.push("class=\"datagrid-cell-check ");
}else{
cc.push("class=\"datagrid-cell "+col.cellClass);
}
cc.push("\">");
if(col.checkbox){
if(row.checked){
cc.push("<input type=\"checkbox\" checked=\"checked\"");
}else{
cc.push("<input type=\"checkbox\"");
}
cc.push(" name=\""+_8f1+"\" value=\""+(row[_8f1]!=undefined?row[_8f1]:"")+"\">");
}else{
var val=null;
if(col.formatter){
val=col.formatter(row[_8f1],row);
}else{
val=row[_8f1];
}
if(_8f1==opts.treeField){
for(var j=0;j<_8f0;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
if(row.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
if(row.children&&row.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(row.iconCls?row.iconCls:"")+"\"></span>");
}
}
cc.push("<span class=\"tree-title\">"+val+"</span>");
}else{
cc.push(val);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},refreshRow:function(_8f5,id){
this.updateRow.call(this,_8f5,id,{});
},updateRow:function(_8f6,id,row){
var opts=$.data(_8f6,"treegrid").options;
var _8f7=$(_8f6).treegrid("find",id);
$.extend(_8f7,row);
var _8f8=$(_8f6).treegrid("getLevel",id)-1;
var _8f9=opts.rowStyler?opts.rowStyler.call(_8f6,_8f7):"";
var _8fa=$.data(_8f6,"datagrid").rowIdPrefix;
var _8fb=_8f7[opts.idField];
function _8fc(_8fd){
var _8fe=$(_8f6).treegrid("getColumnFields",_8fd);
var tr=opts.finder.getTr(_8f6,id,"body",(_8fd?1:2));
var _8ff=tr.find("div.datagrid-cell-rownumber").html();
var _900=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow(_8f6,_8fe,_8fd,_8f8,_8f7));
tr.attr("style",_8f9||"");
tr.find("div.datagrid-cell-rownumber").html(_8ff);
if(_900){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
if(_8fb!=id){
tr.attr("id",_8fa+"-"+(_8fd?1:2)+"-"+_8fb);
tr.attr("node-id",_8fb);
}
};
_8fc.call(this,true);
_8fc.call(this,false);
$(_8f6).treegrid("fixRowHeight",id);
},deleteRow:function(_901,id){
var opts=$.data(_901,"treegrid").options;
var tr=opts.finder.getTr(_901,id);
tr.next("tr.treegrid-tr-tree").remove();
tr.remove();
var _902=del(id);
if(_902){
if(_902.children.length==0){
tr=opts.finder.getTr(_901,_902[opts.idField]);
tr.next("tr.treegrid-tr-tree").remove();
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
cell.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
cell.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(cell);
}
}
function del(id){
var cc;
var _903=$(_901).treegrid("getParent",id);
if(_903){
cc=_903.children;
}else{
cc=$(_901).treegrid("getData");
}
for(var i=0;i<cc.length;i++){
if(cc[i][opts.idField]==id){
cc.splice(i,1);
break;
}
}
return _903;
};
},onBeforeRender:function(_904,_905,data){
if($.isArray(_905)){
data={total:_905.length,rows:_905};
_905=null;
}
if(!data){
return false;
}
var _906=$.data(_904,"treegrid");
var opts=_906.options;
if(data.length==undefined){
if(data.footer){
_906.footer=data.footer;
}
if(data.total){
_906.total=data.total;
}
data=this.transfer(_904,_905,data.rows);
}else{
function _907(_908,_909){
for(var i=0;i<_908.length;i++){
var row=_908[i];
row._parentId=_909;
if(row.children&&row.children.length){
_907(row.children,row[opts.idField]);
}
}
};
_907(data,_905);
}
var node=find(_904,_905);
if(node){
if(node.children){
node.children=node.children.concat(data);
}else{
node.children=data;
}
}else{
_906.data=_906.data.concat(data);
}
this.sort(_904,data);
this.treeNodes=data;
this.treeLevel=$(_904).treegrid("getLevel",_905);
},sort:function(_90a,data){
var opts=$.data(_90a,"treegrid").options;
if(!opts.remoteSort&&opts.sortName){
var _90b=opts.sortName.split(",");
var _90c=opts.sortOrder.split(",");
_90d(data);
}
function _90d(rows){
rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_90b.length;i++){
var sn=_90b[i];
var so=_90c[i];
var col=$(_90a).treegrid("getColumnOption",sn);
var _90e=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_90e(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
for(var i=0;i<rows.length;i++){
var _90f=rows[i].children;
if(_90f&&_90f.length){
_90d(_90f);
}
}
};
},transfer:function(_910,_911,data){
var opts=$.data(_910,"treegrid").options;
var rows=[];
for(var i=0;i<data.length;i++){
rows.push(data[i]);
}
var _912=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
if(!_911){
if(!row._parentId){
_912.push(row);
rows.splice(i,1);
i--;
}
}else{
if(row._parentId==_911){
_912.push(row);
rows.splice(i,1);
i--;
}
}
}
var toDo=[];
for(var i=0;i<_912.length;i++){
toDo.push(_912[i]);
}
while(toDo.length){
var node=toDo.shift();
for(var i=0;i<rows.length;i++){
var row=rows[i];
if(row._parentId==node[opts.idField]){
if(node.children){
node.children.push(row);
}else{
node.children=[row];
}
toDo.push(row);
rows.splice(i,1);
i--;
}
}
}
return _912;
}});
$.fn.treegrid.defaults=$.extend({},$.fn.datagrid.defaults,{treeField:null,lines:false,animate:false,singleSelect:true,view:_8d6,rowEvents:$.extend({},$.fn.datagrid.defaults.rowEvents,{mouseover:_867(true),mouseout:_867(false),click:_869}),loader:function(_913,_914,_915){
var opts=$(this).treegrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_913,dataType:"json",success:function(data){
_914(data);
},error:function(){
_915.apply(this,arguments);
}});
},loadFilter:function(data,_916){
return data;
},finder:{getTr:function(_917,id,type,_918){
type=type||"body";
_918=_918||0;
var dc=$.data(_917,"datagrid").dc;
if(_918==0){
var opts=$.data(_917,"treegrid").options;
var tr1=opts.finder.getTr(_917,id,type,1);
var tr2=opts.finder.getTr(_917,id,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+$.data(_917,"datagrid").rowIdPrefix+"-"+_918+"-"+id);
if(!tr.length){
tr=(_918==1?dc.body1:dc.body2).find("tr[node-id=\""+id+"\"]");
}
return tr;
}else{
if(type=="footer"){
return (_918==1?dc.footer1:dc.footer2).find("tr[node-id=\""+id+"\"]");
}else{
if(type=="selected"){
return (_918==1?dc.body1:dc.body2).find("tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_918==1?dc.body1:dc.body2).find("tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_918==1?dc.body1:dc.body2).find("tr.datagrid-row-checked");
}else{
if(type=="last"){
return (_918==1?dc.body1:dc.body2).find("tr:last[node-id]");
}else{
if(type=="allbody"){
return (_918==1?dc.body1:dc.body2).find("tr[node-id]");
}else{
if(type=="allfooter"){
return (_918==1?dc.footer1:dc.footer2).find("tr[node-id]");
}
}
}
}
}
}
}
}
}
},getRow:function(_919,p){
var id=(typeof p=="object")?p.attr("node-id"):p;
return $(_919).treegrid("find",id);
},getRows:function(_91a){
return $(_91a).treegrid("getChildren");
}},onBeforeLoad:function(row,_91b){
},onLoadSuccess:function(row,data){
},onLoadError:function(){
},onBeforeCollapse:function(row){
},onCollapse:function(row){
},onBeforeExpand:function(row){
},onExpand:function(row){
},onClickRow:function(row){
},onDblClickRow:function(row){
},onClickCell:function(_91c,row){
},onDblClickCell:function(_91d,row){
},onContextMenu:function(e,row){
},onBeforeEdit:function(row){
},onAfterEdit:function(row,_91e){
},onCancelEdit:function(row){
}});
})(jQuery);
(function($){
function _91f(_920){
var opts=$.data(_920,"datalist").options;
$(_920).datagrid($.extend({},opts,{cls:"datalist"+(opts.lines?" datalist-lines":""),frozenColumns:(opts.frozenColumns&&opts.frozenColumns.length)?opts.frozenColumns:(opts.checkbox?[[{field:"_ck",checkbox:true}]]:undefined),columns:(opts.columns&&opts.columns.length)?opts.columns:[[{field:opts.textField,width:"100%",formatter:function(_921,row,_922){
return opts.textFormatter?opts.textFormatter(_921,row,_922):_921;
}}]]}));
};
var _923=$.extend({},$.fn.datagrid.defaults.view,{render:function(_924,_925,_926){
var _927=$.data(_924,"datagrid");
var opts=_927.options;
if(opts.groupField){
var g=this.groupRows(_924,_927.data.rows);
this.groups=g.groups;
_927.data.rows=g.rows;
var _928=[];
for(var i=0;i<g.groups.length;i++){
_928.push(this.renderGroup.call(this,_924,i,g.groups[i],_926));
}
$(_925).html(_928.join(""));
}else{
$(_925).html(this.renderTable(_924,0,_927.data.rows,_926));
}
},renderGroup:function(_929,_92a,_92b,_92c){
var _92d=$.data(_929,"datagrid");
var opts=_92d.options;
var _92e=$(_929).datagrid("getColumnFields",_92c);
var _92f=[];
_92f.push("<div class=\"datagrid-group\" group-index="+_92a+">");
if(!_92c){
_92f.push("<span class=\"datagrid-group-title\">");
_92f.push(opts.groupFormatter.call(_929,_92b.value,_92b.rows));
_92f.push("</span>");
}
_92f.push("</div>");
_92f.push(this.renderTable(_929,_92b.startIndex,_92b.rows,_92c));
return _92f.join("");
},groupRows:function(_930,rows){
var _931=$.data(_930,"datagrid");
var opts=_931.options;
var _932=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _933=_934(row[opts.groupField]);
if(!_933){
_933={value:row[opts.groupField],rows:[row]};
_932.push(_933);
}else{
_933.rows.push(row);
}
}
var _935=0;
var rows=[];
for(var i=0;i<_932.length;i++){
var _933=_932[i];
_933.startIndex=_935;
_935+=_933.rows.length;
rows=rows.concat(_933.rows);
}
return {groups:_932,rows:rows};
function _934(_936){
for(var i=0;i<_932.length;i++){
var _937=_932[i];
if(_937.value==_936){
return _937;
}
}
return null;
};
}});
$.fn.datalist=function(_938,_939){
if(typeof _938=="string"){
var _93a=$.fn.datalist.methods[_938];
if(_93a){
return _93a(this,_939);
}else{
return this.datagrid(_938,_939);
}
}
_938=_938||{};
return this.each(function(){
var _93b=$.data(this,"datalist");
if(_93b){
$.extend(_93b.options,_938);
}else{
var opts=$.extend({},$.fn.datalist.defaults,$.fn.datalist.parseOptions(this),_938);
opts.columns=$.extend(true,[],opts.columns);
_93b=$.data(this,"datalist",{options:opts});
}
_91f(this);
if(!_93b.options.data){
var data=$.fn.datalist.parseData(this);
if(data.total){
$(this).datalist("loadData",data);
}
}
});
};
$.fn.datalist.methods={options:function(jq){
return $.data(jq[0],"datalist").options;
}};
$.fn.datalist.parseOptions=function(_93c){
return $.extend({},$.fn.datagrid.parseOptions(_93c),$.parser.parseOptions(_93c,["valueField","textField","groupField",{checkbox:"boolean",lines:"boolean"}]));
};
$.fn.datalist.parseData=function(_93d){
var opts=$.data(_93d,"datalist").options;
var data={total:0,rows:[]};
$(_93d).children().each(function(){
var _93e=$.parser.parseOptions(this,["value","group"]);
var row={};
var html=$(this).html();
row[opts.valueField]=_93e.value!=undefined?_93e.value:html;
row[opts.textField]=html;
if(opts.groupField){
row[opts.groupField]=_93e.group;
}
data.total++;
data.rows.push(row);
});
return data;
};
$.fn.datalist.defaults=$.extend({},$.fn.datagrid.defaults,{fitColumns:true,singleSelect:true,showHeader:false,checkbox:false,lines:false,valueField:"value",textField:"text",groupField:"",view:_923,textFormatter:function(_93f,row){
return _93f;
},groupFormatter:function(_940,rows){
return _940;
}});
})(jQuery);
(function($){
$(function(){
$(document).unbind(".combo").bind("mousedown.combo mousewheel.combo",function(e){
var p=$(e.target).closest("span.combo,div.combo-p,div.menu");
if(p.length){
_941(p);
return;
}
$("body>div.combo-p>div.combo-panel:visible").panel("close");
});
});
function _942(_943){
var _944=$.data(_943,"combo");
var opts=_944.options;
if(!_944.panel){
_944.panel=$("<div class=\"combo-panel\"></div>").appendTo("body");
_944.panel.panel({minWidth:opts.panelMinWidth,maxWidth:opts.panelMaxWidth,minHeight:opts.panelMinHeight,maxHeight:opts.panelMaxHeight,doSize:false,closed:true,cls:"combo-p",style:{position:"absolute",zIndex:10},onOpen:function(){
var _945=$(this).panel("options").comboTarget;
var _946=$.data(_945,"combo");
if(_946){
_946.options.onShowPanel.call(_945);
}
},onBeforeClose:function(){
_941(this);
},onClose:function(){
var _947=$(this).panel("options").comboTarget;
var _948=$(_947).data("combo");
if(_948){
_948.options.onHidePanel.call(_947);
}
}});
}
var _949=$.extend(true,[],opts.icons);
if(opts.hasDownArrow){
_949.push({iconCls:"combo-arrow",handler:function(e){
_94d(e.data.target);
}});
}
$(_943).addClass("combo-f").textbox($.extend({},opts,{icons:_949,onChange:function(){
}}));
$(_943).attr("comboName",$(_943).attr("textboxName"));
_944.combo=$(_943).next();
_944.combo.addClass("combo");
};
function _94a(_94b){
var _94c=$.data(_94b,"combo");
var opts=_94c.options;
var p=_94c.panel;
if(p.is(":visible")){
p.panel("close");
}
if(!opts.cloned){
p.panel("destroy");
}
$(_94b).textbox("destroy");
};
function _94d(_94e){
var _94f=$.data(_94e,"combo").panel;
if(_94f.is(":visible")){
_950(_94e);
}else{
var p=$(_94e).closest("div.combo-panel");
$("div.combo-panel:visible").not(_94f).not(p).panel("close");
$(_94e).combo("showPanel");
}
$(_94e).combo("textbox").focus();
};
function _941(_951){
$(_951).find(".combo-f").each(function(){
var p=$(this).combo("panel");
if(p.is(":visible")){
p.panel("close");
}
});
};
function _952(e){
var _953=e.data.target;
var _954=$.data(_953,"combo");
var opts=_954.options;
var _955=_954.panel;
if(!opts.editable){
_94d(_953);
}else{
var p=$(_953).closest("div.combo-panel");
$("div.combo-panel:visible").not(_955).not(p).panel("close");
}
};
function _956(e){
var _957=e.data.target;
var t=$(_957);
var _958=t.data("combo");
var opts=t.combo("options");
switch(e.keyCode){
case 38:
opts.keyHandler.up.call(_957,e);
break;
case 40:
opts.keyHandler.down.call(_957,e);
break;
case 37:
opts.keyHandler.left.call(_957,e);
break;
case 39:
opts.keyHandler.right.call(_957,e);
break;
case 13:
e.preventDefault();
opts.keyHandler.enter.call(_957,e);
return false;
case 9:
case 27:
_950(_957);
break;
default:
if(opts.editable){
if(_958.timer){
clearTimeout(_958.timer);
}
_958.timer=setTimeout(function(){
var q=t.combo("getText");
if(_958.previousText!=q){
_958.previousText=q;
t.combo("showPanel");
opts.keyHandler.query.call(_957,q,e);
t.combo("validate");
}
},opts.delay);
}
}
};
function _959(_95a){
var _95b=$.data(_95a,"combo");
var _95c=_95b.combo;
var _95d=_95b.panel;
var opts=$(_95a).combo("options");
var _95e=_95d.panel("options");
_95e.comboTarget=_95a;
if(_95e.closed){
_95d.panel("panel").show().css({zIndex:($.fn.menu?$.fn.menu.defaults.zIndex++:$.fn.window.defaults.zIndex++),left:-999999});
_95d.panel("resize",{width:(opts.panelWidth?opts.panelWidth:_95c._outerWidth()),height:opts.panelHeight});
_95d.panel("panel").hide();
_95d.panel("open");
}
(function(){
if(_95d.is(":visible")){
_95d.panel("move",{left:_95f(),top:_960()});
setTimeout(arguments.callee,200);
}
})();
function _95f(){
var left=_95c.offset().left;
if(opts.panelAlign=="right"){
left+=_95c._outerWidth()-_95d._outerWidth();
}
if(left+_95d._outerWidth()>$(window)._outerWidth()+$(document).scrollLeft()){
left=$(window)._outerWidth()+$(document).scrollLeft()-_95d._outerWidth();
}
if(left<0){
left=0;
}
return left;
};
function _960(){
var top=_95c.offset().top+_95c._outerHeight();
if(top+_95d._outerHeight()>$(window)._outerHeight()+$(document).scrollTop()){
top=_95c.offset().top-_95d._outerHeight();
}
if(top<$(document).scrollTop()){
top=_95c.offset().top+_95c._outerHeight();
}
return top;
};
};
function _950(_961){
var _962=$.data(_961,"combo").panel;
_962.panel("close");
};
function _963(_964,text){
var _965=$.data(_964,"combo");
var _966=$(_964).textbox("getText");
if(_966!=text){
$(_964).textbox("setText",text);
_965.previousText=text;
}
};
function _967(_968){
var _969=[];
var _96a=$.data(_968,"combo").combo;
_96a.find(".textbox-value").each(function(){
_969.push($(this).val());
});
return _969;
};
function _96b(_96c,_96d){
var _96e=$.data(_96c,"combo");
var opts=_96e.options;
var _96f=_96e.combo;
if(!$.isArray(_96d)){
_96d=_96d.split(opts.separator);
}
var _970=_967(_96c);
_96f.find(".textbox-value").remove();
var name=$(_96c).attr("textboxName")||"";
for(var i=0;i<_96d.length;i++){
var _971=$("<input type=\"hidden\" class=\"textbox-value\">").appendTo(_96f);
_971.attr("name",name);
if(opts.disabled){
_971.attr("disabled","disabled");
}
_971.val(_96d[i]);
}
var _972=(function(){
if(_970.length!=_96d.length){
return true;
}
var a1=$.extend(true,[],_970);
var a2=$.extend(true,[],_96d);
a1.sort();
a2.sort();
for(var i=0;i<a1.length;i++){
if(a1[i]!=a2[i]){
return true;
}
}
return false;
})();
if(_972){
if(opts.multiple){
opts.onChange.call(_96c,_96d,_970);
}else{
opts.onChange.call(_96c,_96d[0],_970[0]);
}
$(_96c).closest("form").trigger("_change",[_96c]);
}
};
function _973(_974){
var _975=_967(_974);
return _975[0];
};
function _976(_977,_978){
_96b(_977,[_978]);
};
function _979(_97a){
var opts=$.data(_97a,"combo").options;
var _97b=opts.onChange;
opts.onChange=function(){
};
if(opts.multiple){
_96b(_97a,opts.value?opts.value:[]);
}else{
_976(_97a,opts.value);
}
opts.onChange=_97b;
};
$.fn.combo=function(_97c,_97d){
if(typeof _97c=="string"){
var _97e=$.fn.combo.methods[_97c];
if(_97e){
return _97e(this,_97d);
}else{
return this.textbox(_97c,_97d);
}
}
_97c=_97c||{};
return this.each(function(){
var _97f=$.data(this,"combo");
if(_97f){
$.extend(_97f.options,_97c);
if(_97c.value!=undefined){
_97f.options.originalValue=_97c.value;
}
}else{
_97f=$.data(this,"combo",{options:$.extend({},$.fn.combo.defaults,$.fn.combo.parseOptions(this),_97c),previousText:""});
_97f.options.originalValue=_97f.options.value;
}
_942(this);
_979(this);
});
};
$.fn.combo.methods={options:function(jq){
var opts=jq.textbox("options");
return $.extend($.data(jq[0],"combo").options,{width:opts.width,height:opts.height,disabled:opts.disabled,readonly:opts.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).textbox("cloneFrom",from);
$.data(this,"combo",{options:$.extend(true,{cloned:true},$(from).combo("options")),combo:$(this).next(),panel:$(from).combo("panel")});
$(this).addClass("combo-f").attr("comboName",$(this).attr("textboxName"));
});
},panel:function(jq){
return $.data(jq[0],"combo").panel;
},destroy:function(jq){
return jq.each(function(){
_94a(this);
});
},showPanel:function(jq){
return jq.each(function(){
_959(this);
});
},hidePanel:function(jq){
return jq.each(function(){
_950(this);
});
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setText","");
var opts=$.data(this,"combo").options;
if(opts.multiple){
$(this).combo("setValues",[]);
}else{
$(this).combo("setValue","");
}
});
},reset:function(jq){
return jq.each(function(){
var opts=$.data(this,"combo").options;
if(opts.multiple){
$(this).combo("setValues",opts.originalValue);
}else{
$(this).combo("setValue",opts.originalValue);
}
});
},setText:function(jq,text){
return jq.each(function(){
_963(this,text);
});
},getValues:function(jq){
return _967(jq[0]);
},setValues:function(jq,_980){
return jq.each(function(){
_96b(this,_980);
});
},getValue:function(jq){
return _973(jq[0]);
},setValue:function(jq,_981){
return jq.each(function(){
_976(this,_981);
});
}};
$.fn.combo.parseOptions=function(_982){
var t=$(_982);
return $.extend({},$.fn.textbox.parseOptions(_982),$.parser.parseOptions(_982,["separator","panelAlign",{panelWidth:"number",hasDownArrow:"boolean",delay:"number",selectOnNavigation:"boolean"},{panelMinWidth:"number",panelMaxWidth:"number",panelMinHeight:"number",panelMaxHeight:"number"}]),{panelHeight:(t.attr("panelHeight")=="auto"?"auto":parseInt(t.attr("panelHeight"))||undefined),multiple:(t.attr("multiple")?true:undefined)});
};
$.fn.combo.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:{click:_952,keydown:_956,paste:_956,drop:_956},panelWidth:null,panelHeight:200,panelMinWidth:null,panelMaxWidth:null,panelMinHeight:null,panelMaxHeight:null,panelAlign:"left",multiple:false,editable:false,selectOnNavigation:true,separator:",",hasDownArrow:true,delay:200,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
},query:function(q,e){
}},onShowPanel:function(){
},onHidePanel:function(){
},onChange:function(_983,_984){
}});
})(jQuery);
(function($){
var _985=0;
function _986(_987,_988){
var _989=$.data(_987,"combobox");
var opts=_989.options;
var data=_989.data;
for(var i=0;i<data.length;i++){
if(data[i][opts.valueField]==_988){
return i;
}
}
return -1;
};
function _98a(_98b,_98c){
var opts=$.data(_98b,"combobox").options;
var _98d=$(_98b).combo("panel");
var item=opts.finder.getEl(_98b,_98c);
if(item.length){
if(item.position().top<=0){
var h=_98d.scrollTop()+item.position().top;
_98d.scrollTop(h);
}else{
if(item.position().top+item.outerHeight()>_98d.height()){
var h=_98d.scrollTop()+item.position().top+item.outerHeight()-_98d.height();
_98d.scrollTop(h);
}
}
}
};
function nav(_98e,dir){
var opts=$.data(_98e,"combobox").options;
var _98f=$(_98e).combobox("panel");
var item=_98f.children("div.combobox-item-hover");
if(!item.length){
item=_98f.children("div.combobox-item-selected");
}
item.removeClass("combobox-item-hover");
var _990="div.combobox-item:visible:not(.combobox-item-disabled):first";
var _991="div.combobox-item:visible:not(.combobox-item-disabled):last";
if(!item.length){
item=_98f.children(dir=="next"?_990:_991);
}else{
if(dir=="next"){
item=item.nextAll(_990);
if(!item.length){
item=_98f.children(_990);
}
}else{
item=item.prevAll(_990);
if(!item.length){
item=_98f.children(_991);
}
}
}
if(item.length){
item.addClass("combobox-item-hover");
var row=opts.finder.getRow(_98e,item);
if(row){
_98a(_98e,row[opts.valueField]);
if(opts.selectOnNavigation){
_992(_98e,row[opts.valueField]);
}
}
}
};
function _992(_993,_994){
var opts=$.data(_993,"combobox").options;
var _995=$(_993).combo("getValues");
if($.inArray(_994+"",_995)==-1){
if(opts.multiple){
_995.push(_994);
}else{
_995=[_994];
}
_996(_993,_995);
opts.onSelect.call(_993,opts.finder.getRow(_993,_994));
}
};
function _997(_998,_999){
var opts=$.data(_998,"combobox").options;
var _99a=$(_998).combo("getValues");
var _99b=$.inArray(_999+"",_99a);
if(_99b>=0){
_99a.splice(_99b,1);
_996(_998,_99a);
opts.onUnselect.call(_998,opts.finder.getRow(_998,_999));
}
};
function _996(_99c,_99d,_99e){
var opts=$.data(_99c,"combobox").options;
var _99f=$(_99c).combo("panel");
if(!$.isArray(_99d)){
_99d=_99d.split(opts.separator);
}
_99f.find("div.combobox-item-selected").removeClass("combobox-item-selected");
var vv=[],ss=[];
for(var i=0;i<_99d.length;i++){
var v=_99d[i];
var s=v;
opts.finder.getEl(_99c,v).addClass("combobox-item-selected");
var row=opts.finder.getRow(_99c,v);
if(row){
s=row[opts.textField];
}
vv.push(v);
ss.push(s);
}
if(!_99e){
$(_99c).combo("setText",ss.join(opts.separator));
}
$(_99c).combo("setValues",vv);
};
function _9a0(_9a1,data,_9a2){
var _9a3=$.data(_9a1,"combobox");
var opts=_9a3.options;
_9a3.data=opts.loadFilter.call(_9a1,data);
_9a3.groups=[];
data=_9a3.data;
var _9a4=$(_9a1).combobox("getValues");
var dd=[];
var _9a5=undefined;
for(var i=0;i<data.length;i++){
var row=data[i];
var v=row[opts.valueField]+"";
var s=row[opts.textField];
var g=row[opts.groupField];
if(g){
if(_9a5!=g){
_9a5=g;
_9a3.groups.push(g);
dd.push("<div id=\""+(_9a3.groupIdPrefix+"_"+(_9a3.groups.length-1))+"\" class=\"combobox-group\">");
dd.push(opts.groupFormatter?opts.groupFormatter.call(_9a1,g):g);
dd.push("</div>");
}
}else{
_9a5=undefined;
}
var cls="combobox-item"+(row.disabled?" combobox-item-disabled":"")+(g?" combobox-gitem":"");
dd.push("<div id=\""+(_9a3.itemIdPrefix+"_"+i)+"\" class=\""+cls+"\">");
dd.push(opts.formatter?opts.formatter.call(_9a1,row):s);
dd.push("</div>");
if(row["selected"]&&$.inArray(v,_9a4)==-1){
_9a4.push(v);
}
}
$(_9a1).combo("panel").html(dd.join(""));
if(opts.multiple){
_996(_9a1,_9a4,_9a2);
}else{
_996(_9a1,_9a4.length?[_9a4[_9a4.length-1]]:[],_9a2);
}
opts.onLoadSuccess.call(_9a1,data);
};
function _9a6(_9a7,url,_9a8,_9a9){
var opts=$.data(_9a7,"combobox").options;
if(url){
opts.url=url;
}
_9a8=$.extend({},opts.queryParams,_9a8||{});
if(opts.onBeforeLoad.call(_9a7,_9a8)==false){
return;
}
opts.loader.call(_9a7,_9a8,function(data){
_9a0(_9a7,data,_9a9);
},function(){
opts.onLoadError.apply(this,arguments);
});
};
function _9aa(_9ab,q){
var _9ac=$.data(_9ab,"combobox");
var opts=_9ac.options;
var qq=opts.multiple?q.split(opts.separator):[q];
if(opts.mode=="remote"){
_9ad(qq);
_9a6(_9ab,null,{q:q},true);
}else{
var _9ae=$(_9ab).combo("panel");
_9ae.find("div.combobox-item-selected,div.combobox-item-hover").removeClass("combobox-item-selected combobox-item-hover");
_9ae.find("div.combobox-item,div.combobox-group").hide();
var data=_9ac.data;
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
var _9af=q;
var _9b0=undefined;
for(var i=0;i<data.length;i++){
var row=data[i];
if(opts.filter.call(_9ab,q,row)){
var v=row[opts.valueField];
var s=row[opts.textField];
var g=row[opts.groupField];
var item=opts.finder.getEl(_9ab,v).show();
if(s.toLowerCase()==q.toLowerCase()){
_9af=v;
item.addClass("combobox-item-selected");
opts.onSelect.call(_9ab,row);
}
if(opts.groupField&&_9b0!=g){
$("#"+_9ac.groupIdPrefix+"_"+$.inArray(g,_9ac.groups)).show();
_9b0=g;
}
}
}
vv.push(_9af);
});
_9ad(vv);
}
function _9ad(vv){
_996(_9ab,opts.multiple?(q?vv:[]):vv,true);
};
};
function _9b1(_9b2){
var t=$(_9b2);
var opts=t.combobox("options");
var _9b3=t.combobox("panel");
var item=_9b3.children("div.combobox-item-hover");
if(item.length){
var row=opts.finder.getRow(_9b2,item);
var _9b4=row[opts.valueField];
if(opts.multiple){
if(item.hasClass("combobox-item-selected")){
t.combobox("unselect",_9b4);
}else{
t.combobox("select",_9b4);
}
}else{
t.combobox("select",_9b4);
}
}
var vv=[];
$.map(t.combobox("getValues"),function(v){
if(_986(_9b2,v)>=0){
vv.push(v);
}
});
t.combobox("setValues",vv);
if(!opts.multiple){
t.combobox("hidePanel");
}
};
function _9b5(_9b6){
var _9b7=$.data(_9b6,"combobox");
var opts=_9b7.options;
_985++;
_9b7.itemIdPrefix="_easyui_combobox_i"+_985;
_9b7.groupIdPrefix="_easyui_combobox_g"+_985;
$(_9b6).addClass("combobox-f");
$(_9b6).combo($.extend({},opts,{onShowPanel:function(){
$(_9b6).combo("panel").find("div.combobox-item:hidden,div.combobox-group:hidden").show();
_98a(_9b6,$(_9b6).combobox("getValue"));
opts.onShowPanel.call(_9b6);
}}));
$(_9b6).combo("panel").unbind().bind("mouseover",function(e){
$(this).children("div.combobox-item-hover").removeClass("combobox-item-hover");
var item=$(e.target).closest("div.combobox-item");
if(!item.hasClass("combobox-item-disabled")){
item.addClass("combobox-item-hover");
}
e.stopPropagation();
}).bind("mouseout",function(e){
$(e.target).closest("div.combobox-item").removeClass("combobox-item-hover");
e.stopPropagation();
}).bind("click",function(e){
var item=$(e.target).closest("div.combobox-item");
if(!item.length||item.hasClass("combobox-item-disabled")){
return;
}
var row=opts.finder.getRow(_9b6,item);
if(!row){
return;
}
var _9b8=row[opts.valueField];
if(opts.multiple){
if(item.hasClass("combobox-item-selected")){
_997(_9b6,_9b8);
}else{
_992(_9b6,_9b8);
}
}else{
_992(_9b6,_9b8);
$(_9b6).combo("hidePanel");
}
e.stopPropagation();
});
};
$.fn.combobox=function(_9b9,_9ba){
if(typeof _9b9=="string"){
var _9bb=$.fn.combobox.methods[_9b9];
if(_9bb){
return _9bb(this,_9ba);
}else{
return this.combo(_9b9,_9ba);
}
}
_9b9=_9b9||{};
return this.each(function(){
var _9bc=$.data(this,"combobox");
if(_9bc){
$.extend(_9bc.options,_9b9);
}else{
_9bc=$.data(this,"combobox",{options:$.extend({},$.fn.combobox.defaults,$.fn.combobox.parseOptions(this),_9b9),data:[]});
}
_9b5(this);
if(_9bc.options.data){
_9a0(this,_9bc.options.data);
}else{
var data=$.fn.combobox.parseData(this);
if(data.length){
_9a0(this,data);
}
}
_9a6(this);
});
};
$.fn.combobox.methods={options:function(jq){
var _9bd=jq.combo("options");
return $.extend($.data(jq[0],"combobox").options,{width:_9bd.width,height:_9bd.height,originalValue:_9bd.originalValue,disabled:_9bd.disabled,readonly:_9bd.readonly});
},getData:function(jq){
return $.data(jq[0],"combobox").data;
},setValues:function(jq,_9be){
return jq.each(function(){
_996(this,_9be);
});
},setValue:function(jq,_9bf){
return jq.each(function(){
_996(this,[_9bf]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combo("clear");
var _9c0=$(this).combo("panel");
_9c0.find("div.combobox-item-selected").removeClass("combobox-item-selected");
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combobox("options");
if(opts.multiple){
$(this).combobox("setValues",opts.originalValue);
}else{
$(this).combobox("setValue",opts.originalValue);
}
});
},loadData:function(jq,data){
return jq.each(function(){
_9a0(this,data);
});
},reload:function(jq,url){
return jq.each(function(){
if(typeof url=="string"){
_9a6(this,url);
}else{
if(url){
var opts=$(this).combobox("options");
opts.queryParams=url;
}
_9a6(this);
}
});
},select:function(jq,_9c1){
return jq.each(function(){
_992(this,_9c1);
});
},unselect:function(jq,_9c2){
return jq.each(function(){
_997(this,_9c2);
});
}};
$.fn.combobox.parseOptions=function(_9c3){
var t=$(_9c3);
return $.extend({},$.fn.combo.parseOptions(_9c3),$.parser.parseOptions(_9c3,["valueField","textField","groupField","mode","method","url"]));
};
$.fn.combobox.parseData=function(_9c4){
var data=[];
var opts=$(_9c4).combobox("options");
$(_9c4).children().each(function(){
if(this.tagName.toLowerCase()=="optgroup"){
var _9c5=$(this).attr("label");
$(this).children().each(function(){
_9c6(this,_9c5);
});
}else{
_9c6(this);
}
});
return data;
function _9c6(el,_9c7){
var t=$(el);
var row={};
row[opts.valueField]=t.attr("value")!=undefined?t.attr("value"):t.text();
row[opts.textField]=t.text();
row["selected"]=t.is(":selected");
row["disabled"]=t.is(":disabled");
if(_9c7){
opts.groupField=opts.groupField||"group";
row[opts.groupField]=_9c7;
}
data.push(row);
};
};
$.fn.combobox.defaults=$.extend({},$.fn.combo.defaults,{valueField:"value",textField:"text",groupField:null,groupFormatter:function(_9c8){
return _9c8;
},mode:"local",method:"post",url:null,data:null,queryParams:{},keyHandler:{up:function(e){
nav(this,"prev");
e.preventDefault();
},down:function(e){
nav(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_9b1(this);
},query:function(q,e){
_9aa(this,q);
}},filter:function(q,row){
var opts=$(this).combobox("options");
return row[opts.textField].toLowerCase().indexOf(q.toLowerCase())==0;
},formatter:function(row){
var opts=$(this).combobox("options");
return row[opts.textField];
},loader:function(_9c9,_9ca,_9cb){
var opts=$(this).combobox("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_9c9,dataType:"json",success:function(data){
_9ca(data);
},error:function(){
_9cb.apply(this,arguments);
}});
},loadFilter:function(data){
return data;
},finder:{getEl:function(_9cc,_9cd){
var _9ce=_986(_9cc,_9cd);
var id=$.data(_9cc,"combobox").itemIdPrefix+"_"+_9ce;
return $("#"+id);
},getRow:function(_9cf,p){
var _9d0=$.data(_9cf,"combobox");
var _9d1=(p instanceof jQuery)?p.attr("id").substr(_9d0.itemIdPrefix.length+1):_986(_9cf,p);
return _9d0.data[parseInt(_9d1)];
}},onBeforeLoad:function(_9d2){
},onLoadSuccess:function(){
},onLoadError:function(){
},onSelect:function(_9d3){
},onUnselect:function(_9d4){
}});
})(jQuery);
(function($){
function _9d5(_9d6){
var _9d7=$.data(_9d6,"combotree");
var opts=_9d7.options;
var tree=_9d7.tree;
$(_9d6).addClass("combotree-f");
$(_9d6).combo(opts);
var _9d8=$(_9d6).combo("panel");
if(!tree){
tree=$("<ul></ul>").appendTo(_9d8);
$.data(_9d6,"combotree").tree=tree;
}
tree.tree($.extend({},opts,{checkbox:opts.multiple,onLoadSuccess:function(node,data){
var _9d9=$(_9d6).combotree("getValues");
if(opts.multiple){
var _9da=tree.tree("getChecked");
for(var i=0;i<_9da.length;i++){
var id=_9da[i].id;
(function(){
for(var i=0;i<_9d9.length;i++){
if(id==_9d9[i]){
return;
}
}
_9d9.push(id);
})();
}
}
$(_9d6).combotree("setValues",_9d9);
opts.onLoadSuccess.call(this,node,data);
},onClick:function(node){
if(opts.multiple){
$(this).tree(node.checked?"uncheck":"check",node.target);
}else{
$(_9d6).combo("hidePanel");
}
_9dc(_9d6);
opts.onClick.call(this,node);
},onCheck:function(node,_9db){
_9dc(_9d6);
opts.onCheck.call(this,node,_9db);
}}));
};
function _9dc(_9dd){
var _9de=$.data(_9dd,"combotree");
var opts=_9de.options;
var tree=_9de.tree;
var vv=[],ss=[];
if(opts.multiple){
var _9df=tree.tree("getChecked");
for(var i=0;i<_9df.length;i++){
vv.push(_9df[i].id);
ss.push(_9df[i].text);
}
}else{
var node=tree.tree("getSelected");
if(node){
vv.push(node.id);
ss.push(node.text);
}
}
$(_9dd).combo("setText",ss.join(opts.separator)).combo("setValues",opts.multiple?vv:(vv.length?vv:[""]));
};
function _9e0(_9e1,_9e2){
var _9e3=$.data(_9e1,"combotree");
var opts=_9e3.options;
var tree=_9e3.tree;
var _9e4=tree.tree("options");
var _9e5=_9e4.onCheck;
var _9e6=_9e4.onSelect;
_9e4.onCheck=_9e4.onSelect=function(){
};
tree.find("span.tree-checkbox").addClass("tree-checkbox0").removeClass("tree-checkbox1 tree-checkbox2");
if(!$.isArray(_9e2)){
_9e2=_9e2.split(opts.separator);
}
var vv=$.map(_9e2,function(_9e7){
return String(_9e7);
});
var ss=[];
$.map(vv,function(v){
var node=tree.tree("find",v);
if(node){
tree.tree("check",node.target).tree("select",node.target);
ss.push(node.text);
}else{
ss.push(v);
}
});
if(opts.multiple){
var _9e8=tree.tree("getChecked");
$.map(_9e8,function(node){
var id=String(node.id);
if($.inArray(id,vv)==-1){
vv.push(id);
ss.push(node.text);
}
});
}
_9e4.onCheck=_9e5;
_9e4.onSelect=_9e6;
$(_9e1).combo("setText",ss.join(opts.separator)).combo("setValues",opts.multiple?vv:(vv.length?vv:[""]));
};
$.fn.combotree=function(_9e9,_9ea){
if(typeof _9e9=="string"){
var _9eb=$.fn.combotree.methods[_9e9];
if(_9eb){
return _9eb(this,_9ea);
}else{
return this.combo(_9e9,_9ea);
}
}
_9e9=_9e9||{};
return this.each(function(){
var _9ec=$.data(this,"combotree");
if(_9ec){
$.extend(_9ec.options,_9e9);
}else{
$.data(this,"combotree",{options:$.extend({},$.fn.combotree.defaults,$.fn.combotree.parseOptions(this),_9e9)});
}
_9d5(this);
});
};
$.fn.combotree.methods={options:function(jq){
var _9ed=jq.combo("options");
return $.extend($.data(jq[0],"combotree").options,{width:_9ed.width,height:_9ed.height,originalValue:_9ed.originalValue,disabled:_9ed.disabled,readonly:_9ed.readonly});
},clone:function(jq,_9ee){
var t=jq.combo("clone",_9ee);
t.data("combotree",{options:$.extend(true,{},jq.combotree("options")),tree:jq.combotree("tree")});
return t;
},tree:function(jq){
return $.data(jq[0],"combotree").tree;
},loadData:function(jq,data){
return jq.each(function(){
var opts=$.data(this,"combotree").options;
opts.data=data;
var tree=$.data(this,"combotree").tree;
tree.tree("loadData",data);
});
},reload:function(jq,url){
return jq.each(function(){
var opts=$.data(this,"combotree").options;
var tree=$.data(this,"combotree").tree;
if(url){
opts.url=url;
}
tree.tree({url:opts.url});
});
},setValues:function(jq,_9ef){
return jq.each(function(){
_9e0(this,_9ef);
});
},setValue:function(jq,_9f0){
return jq.each(function(){
_9e0(this,[_9f0]);
});
},clear:function(jq){
return jq.each(function(){
var tree=$.data(this,"combotree").tree;
tree.find("div.tree-node-selected").removeClass("tree-node-selected");
var cc=tree.tree("getChecked");
for(var i=0;i<cc.length;i++){
tree.tree("uncheck",cc[i].target);
}
$(this).combo("clear");
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combotree("options");
if(opts.multiple){
$(this).combotree("setValues",opts.originalValue);
}else{
$(this).combotree("setValue",opts.originalValue);
}
});
}};
$.fn.combotree.parseOptions=function(_9f1){
return $.extend({},$.fn.combo.parseOptions(_9f1),$.fn.tree.parseOptions(_9f1));
};
$.fn.combotree.defaults=$.extend({},$.fn.combo.defaults,$.fn.tree.defaults,{editable:false});
})(jQuery);
(function($){
function _9f2(_9f3){
var _9f4=$.data(_9f3,"combogrid");
var opts=_9f4.options;
var grid=_9f4.grid;
$(_9f3).addClass("combogrid-f").combo($.extend({},opts,{onShowPanel:function(){
var p=$(this).combogrid("panel");
var _9f5=p.outerHeight()-p.height();
var _9f6=p._size("minHeight");
var _9f7=p._size("maxHeight");
var dg=$(this).combogrid("grid");
dg.datagrid("resize",{width:"100%",height:(isNaN(parseInt(opts.panelHeight))?"auto":"100%"),minHeight:(_9f6?_9f6-_9f5:""),maxHeight:(_9f7?_9f7-_9f5:"")});
var row=dg.datagrid("getSelected");
if(row){
dg.datagrid("scrollTo",dg.datagrid("getRowIndex",row));
}
opts.onShowPanel.call(this);
}}));
var _9f8=$(_9f3).combo("panel");
if(!grid){
grid=$("<table></table>").appendTo(_9f8);
_9f4.grid=grid;
}
grid.datagrid($.extend({},opts,{border:false,singleSelect:(!opts.multiple),onLoadSuccess:function(data){
var _9f9=$(_9f3).combo("getValues");
var _9fa=opts.onSelect;
opts.onSelect=function(){
};
_a00(_9f3,_9f9,_9f4.remainText);
opts.onSelect=_9fa;
opts.onLoadSuccess.apply(_9f3,arguments);
},onClickRow:_9fb,onSelect:function(_9fc,row){
_9fd();
opts.onSelect.call(this,_9fc,row);
},onUnselect:function(_9fe,row){
_9fd();
opts.onUnselect.call(this,_9fe,row);
},onSelectAll:function(rows){
_9fd();
opts.onSelectAll.call(this,rows);
},onUnselectAll:function(rows){
if(opts.multiple){
_9fd();
}
opts.onUnselectAll.call(this,rows);
}}));
function _9fb(_9ff,row){
_9f4.remainText=false;
_9fd();
if(!opts.multiple){
$(_9f3).combo("hidePanel");
}
opts.onClickRow.call(this,_9ff,row);
};
function _9fd(){
var vv=$.map(grid.datagrid("getSelections"),function(row){
return row[opts.idField];
});
vv=vv.concat(opts.unselectedValues);
if(!opts.multiple){
vv=vv.length?[vv[0]]:[""];
}
_a00(_9f3,vv,_9f4.remainText);
};
};
function nav(_a01,dir){
var _a02=$.data(_a01,"combogrid");
var opts=_a02.options;
var grid=_a02.grid;
var _a03=grid.datagrid("getRows").length;
if(!_a03){
return;
}
var tr=opts.finder.getTr(grid[0],null,"highlight");
if(!tr.length){
tr=opts.finder.getTr(grid[0],null,"selected");
}
var _a04;
if(!tr.length){
_a04=(dir=="next"?0:_a03-1);
}else{
var _a04=parseInt(tr.attr("datagrid-row-index"));
_a04+=(dir=="next"?1:-1);
if(_a04<0){
_a04=_a03-1;
}
if(_a04>=_a03){
_a04=0;
}
}
grid.datagrid("highlightRow",_a04);
if(opts.selectOnNavigation){
_a02.remainText=false;
grid.datagrid("selectRow",_a04);
}
};
function _a00(_a05,_a06,_a07){
var _a08=$.data(_a05,"combogrid");
var opts=_a08.options;
var grid=_a08.grid;
var _a09=$(_a05).combo("getValues");
var _a0a=$(_a05).combo("options");
var _a0b=_a0a.onChange;
_a0a.onChange=function(){
};
var _a0c=grid.datagrid("options");
var _a0d=_a0c.onSelect;
var _a0e=_a0c.onUnselectAll;
_a0c.onSelect=_a0c.onUnselectAll=function(){
};
if(!$.isArray(_a06)){
_a06=_a06.split(opts.separator);
}
var _a0f=[];
$.map(grid.datagrid("getSelections"),function(row){
if($.inArray(row[opts.idField],_a06)>=0){
_a0f.push(row);
}
});
grid.datagrid("clearSelections");
grid.data("datagrid").selectedRows=_a0f;
var ss=[];
for(var i=0;i<_a06.length;i++){
var _a10=_a06[i];
var _a11=grid.datagrid("getRowIndex",_a10);
if(_a11>=0){
grid.datagrid("selectRow",_a11);
}
ss.push(_a12(_a10,grid.datagrid("getRows"))||_a12(_a10,grid.datagrid("getSelections"))||_a12(_a10,opts.mappingRows)||_a10);
}
opts.unselectedValues=[];
var _a13=$.map(_a0f,function(row){
return row[opts.idField];
});
$.map(_a06,function(_a14){
if($.inArray(_a14,_a13)==-1){
opts.unselectedValues.push(_a14);
}
});
$(_a05).combo("setValues",_a09);
_a0a.onChange=_a0b;
_a0c.onSelect=_a0d;
_a0c.onUnselectAll=_a0e;
if(!_a07){
var s=ss.join(opts.separator);
if($(_a05).combo("getText")!=s){
$(_a05).combo("setText",s);
}
}
$(_a05).combo("setValues",_a06);
function _a12(_a15,a){
for(var i=0;i<a.length;i++){
if(_a15==a[i][opts.idField]){
return a[i][opts.textField];
}
}
return undefined;
};
};
function _a16(_a17,q){
var _a18=$.data(_a17,"combogrid");
var opts=_a18.options;
var grid=_a18.grid;
_a18.remainText=true;
if(opts.multiple&&!q){
_a00(_a17,[],true);
}else{
_a00(_a17,[q],true);
}
if(opts.mode=="remote"){
grid.datagrid("clearSelections");
grid.datagrid("load",$.extend({},opts.queryParams,{q:q}));
}else{
if(!q){
return;
}
grid.datagrid("clearSelections").datagrid("highlightRow",-1);
var rows=grid.datagrid("getRows");
var qq=opts.multiple?q.split(opts.separator):[q];
$.map(qq,function(q){
q=$.trim(q);
if(q){
$.map(rows,function(row,i){
if(q==row[opts.textField]){
grid.datagrid("selectRow",i);
}else{
if(opts.filter.call(_a17,q,row)){
grid.datagrid("highlightRow",i);
}
}
});
}
});
}
};
function _a19(_a1a){
var _a1b=$.data(_a1a,"combogrid");
var opts=_a1b.options;
var grid=_a1b.grid;
var tr=opts.finder.getTr(grid[0],null,"highlight");
_a1b.remainText=false;
if(tr.length){
var _a1c=parseInt(tr.attr("datagrid-row-index"));
if(opts.multiple){
if(tr.hasClass("datagrid-row-selected")){
grid.datagrid("unselectRow",_a1c);
}else{
grid.datagrid("selectRow",_a1c);
}
}else{
grid.datagrid("selectRow",_a1c);
}
}
var vv=[];
$.map(grid.datagrid("getSelections"),function(row){
vv.push(row[opts.idField]);
});
$(_a1a).combogrid("setValues",vv);
if(!opts.multiple){
$(_a1a).combogrid("hidePanel");
}
};
$.fn.combogrid=function(_a1d,_a1e){
if(typeof _a1d=="string"){
var _a1f=$.fn.combogrid.methods[_a1d];
if(_a1f){
return _a1f(this,_a1e);
}else{
return this.combo(_a1d,_a1e);
}
}
_a1d=_a1d||{};
return this.each(function(){
var _a20=$.data(this,"combogrid");
if(_a20){
$.extend(_a20.options,_a1d);
}else{
_a20=$.data(this,"combogrid",{options:$.extend({},$.fn.combogrid.defaults,$.fn.combogrid.parseOptions(this),_a1d)});
}
_9f2(this);
});
};
$.fn.combogrid.methods={options:function(jq){
var _a21=jq.combo("options");
return $.extend($.data(jq[0],"combogrid").options,{width:_a21.width,height:_a21.height,originalValue:_a21.originalValue,disabled:_a21.disabled,readonly:_a21.readonly});
},grid:function(jq){
return $.data(jq[0],"combogrid").grid;
},setValues:function(jq,_a22){
return jq.each(function(){
var opts=$(this).combogrid("options");
if($.isArray(_a22)){
_a22=$.map(_a22,function(_a23){
if(typeof _a23=="object"){
var v=_a23[opts.idField];
(function(){
for(var i=0;i<opts.mappingRows.length;i++){
if(v==opts.mappingRows[i][opts.idField]){
return;
}
}
opts.mappingRows.push(_a23);
})();
return v;
}else{
return _a23;
}
});
}
_a00(this,_a22);
});
},setValue:function(jq,_a24){
return jq.each(function(){
$(this).combogrid("setValues",[_a24]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combogrid("grid").datagrid("clearSelections");
$(this).combo("clear");
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).combogrid("options");
if(opts.multiple){
$(this).combogrid("setValues",opts.originalValue);
}else{
$(this).combogrid("setValue",opts.originalValue);
}
});
}};
$.fn.combogrid.parseOptions=function(_a25){
var t=$(_a25);
return $.extend({},$.fn.combo.parseOptions(_a25),$.fn.datagrid.parseOptions(_a25),$.parser.parseOptions(_a25,["idField","textField","mode"]));
};
$.fn.combogrid.defaults=$.extend({},$.fn.combo.defaults,$.fn.datagrid.defaults,{height:22,loadMsg:null,idField:null,textField:null,unselectedValues:[],mappingRows:[],mode:"local",keyHandler:{up:function(e){
nav(this,"prev");
e.preventDefault();
},down:function(e){
nav(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_a19(this);
},query:function(q,e){
_a16(this,q);
}},filter:function(q,row){
var opts=$(this).combogrid("options");
return (row[opts.textField]||"").toLowerCase().indexOf(q.toLowerCase())==0;
}});
})(jQuery);
(function($){
function _a26(_a27){
var _a28=$.data(_a27,"datebox");
var opts=_a28.options;
$(_a27).addClass("datebox-f").combo($.extend({},opts,{onShowPanel:function(){
_a29(this);
_a2a(this);
_a2b(this);
_a39(this,$(this).datebox("getText"),true);
opts.onShowPanel.call(this);
}}));
if(!_a28.calendar){
var _a2c=$(_a27).combo("panel").css("overflow","hidden");
_a2c.panel("options").onBeforeDestroy=function(){
var c=$(this).find(".calendar-shared");
if(c.length){
c.insertBefore(c[0].pholder);
}
};
var cc=$("<div class=\"datebox-calendar-inner\"></div>").prependTo(_a2c);
if(opts.sharedCalendar){
var c=$(opts.sharedCalendar);
if(!c[0].pholder){
c[0].pholder=$("<div class=\"calendar-pholder\" style=\"display:none\"></div>").insertAfter(c);
}
c.addClass("calendar-shared").appendTo(cc);
if(!c.hasClass("calendar")){
c.calendar();
}
_a28.calendar=c;
}else{
_a28.calendar=$("<div></div>").appendTo(cc).calendar();
}
$.extend(_a28.calendar.calendar("options"),{fit:true,border:false,onSelect:function(date){
var _a2d=this.target;
var opts=$(_a2d).datebox("options");
_a39(_a2d,opts.formatter.call(_a2d,date));
$(_a2d).combo("hidePanel");
opts.onSelect.call(_a2d,date);
}});
}
$(_a27).combo("textbox").parent().addClass("datebox");
$(_a27).datebox("initValue",opts.value);
function _a29(_a2e){
var opts=$(_a2e).datebox("options");
var _a2f=$(_a2e).combo("panel");
_a2f.unbind(".datebox").bind("click.datebox",function(e){
if($(e.target).hasClass("datebox-button-a")){
var _a30=parseInt($(e.target).attr("datebox-button-index"));
opts.buttons[_a30].handler.call(e.target,_a2e);
}
});
};
function _a2a(_a31){
var _a32=$(_a31).combo("panel");
if(_a32.children("div.datebox-button").length){
return;
}
var _a33=$("<div class=\"datebox-button\"><table cellspacing=\"0\" cellpadding=\"0\" style=\"width:100%\"><tr></tr></table></div>").appendTo(_a32);
var tr=_a33.find("tr");
for(var i=0;i<opts.buttons.length;i++){
var td=$("<td></td>").appendTo(tr);
var btn=opts.buttons[i];
var t=$("<a class=\"datebox-button-a\" href=\"javascript:void(0)\"></a>").html($.isFunction(btn.text)?btn.text(_a31):btn.text).appendTo(td);
t.attr("datebox-button-index",i);
}
tr.find("td").css("width",(100/opts.buttons.length)+"%");
};
function _a2b(_a34){
var _a35=$(_a34).combo("panel");
var cc=_a35.children("div.datebox-calendar-inner");
_a35.children()._outerWidth(_a35.width());
_a28.calendar.appendTo(cc);
_a28.calendar[0].target=_a34;
if(opts.panelHeight!="auto"){
var _a36=_a35.height();
_a35.children().not(cc).each(function(){
_a36-=$(this).outerHeight();
});
cc._outerHeight(_a36);
}
_a28.calendar.calendar("resize");
};
};
function _a37(_a38,q){
_a39(_a38,q,true);
};
function _a3a(_a3b){
var _a3c=$.data(_a3b,"datebox");
var opts=_a3c.options;
var _a3d=_a3c.calendar.calendar("options").current;
if(_a3d){
_a39(_a3b,opts.formatter.call(_a3b,_a3d));
$(_a3b).combo("hidePanel");
}
};
function _a39(_a3e,_a3f,_a40){
var _a41=$.data(_a3e,"datebox");
var opts=_a41.options;
var _a42=_a41.calendar;
_a42.calendar("moveTo",opts.parser.call(_a3e,_a3f));
if(_a40){
$(_a3e).combo("setValue",_a3f);
}else{
if(_a3f){
_a3f=opts.formatter.call(_a3e,_a42.calendar("options").current);
}
$(_a3e).combo("setText",_a3f).combo("setValue",_a3f);
}
};
$.fn.datebox=function(_a43,_a44){
if(typeof _a43=="string"){
var _a45=$.fn.datebox.methods[_a43];
if(_a45){
return _a45(this,_a44);
}else{
return this.combo(_a43,_a44);
}
}
_a43=_a43||{};
return this.each(function(){
var _a46=$.data(this,"datebox");
if(_a46){
$.extend(_a46.options,_a43);
}else{
$.data(this,"datebox",{options:$.extend({},$.fn.datebox.defaults,$.fn.datebox.parseOptions(this),_a43)});
}
_a26(this);
});
};
$.fn.datebox.methods={options:function(jq){
var _a47=jq.combo("options");
return $.extend($.data(jq[0],"datebox").options,{width:_a47.width,height:_a47.height,originalValue:_a47.originalValue,disabled:_a47.disabled,readonly:_a47.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).combo("cloneFrom",from);
$.data(this,"datebox",{options:$.extend(true,{},$(from).datebox("options")),calendar:$(from).datebox("calendar")});
$(this).addClass("datebox-f");
});
},calendar:function(jq){
return $.data(jq[0],"datebox").calendar;
},initValue:function(jq,_a48){
return jq.each(function(){
var opts=$(this).datebox("options");
var _a49=opts.value;
if(_a49){
_a49=opts.formatter.call(this,opts.parser.call(this,_a49));
}
$(this).combo("initValue",_a49).combo("setText",_a49);
});
},setValue:function(jq,_a4a){
return jq.each(function(){
_a39(this,_a4a);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).datebox("options");
$(this).datebox("setValue",opts.originalValue);
});
}};
$.fn.datebox.parseOptions=function(_a4b){
return $.extend({},$.fn.combo.parseOptions(_a4b),$.parser.parseOptions(_a4b,["sharedCalendar"]));
};
$.fn.datebox.defaults=$.extend({},$.fn.combo.defaults,{panelWidth:180,panelHeight:"auto",sharedCalendar:null,keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_a3a(this);
},query:function(q,e){
_a37(this,q);
}},currentText:"Today",closeText:"Close",okText:"Ok",buttons:[{text:function(_a4c){
return $(_a4c).datebox("options").currentText;
},handler:function(_a4d){
var now=new Date();
$(_a4d).datebox("calendar").calendar({year:now.getFullYear(),month:now.getMonth()+1,current:new Date(now.getFullYear(),now.getMonth(),now.getDate())});
_a3a(_a4d);
}},{text:function(_a4e){
return $(_a4e).datebox("options").closeText;
},handler:function(_a4f){
$(this).closest("div.combo-panel").panel("close");
}}],formatter:function(date){
var y=date.getFullYear();
var m=date.getMonth()+1;
var d=date.getDate();
return (m<10?("0"+m):m)+"/"+(d<10?("0"+d):d)+"/"+y;
},parser:function(s){
if(!s){
return new Date();
}
var ss=s.split("/");
var m=parseInt(ss[0],10);
var d=parseInt(ss[1],10);
var y=parseInt(ss[2],10);
if(!isNaN(y)&&!isNaN(m)&&!isNaN(d)){
return new Date(y,m-1,d);
}else{
return new Date();
}
},onSelect:function(date){
}});
})(jQuery);
(function($){
function _a50(_a51){
var _a52=$.data(_a51,"datetimebox");
var opts=_a52.options;
$(_a51).datebox($.extend({},opts,{onShowPanel:function(){
var _a53=$(this).datetimebox("getValue");
_a59(this,_a53,true);
opts.onShowPanel.call(this);
},formatter:$.fn.datebox.defaults.formatter,parser:$.fn.datebox.defaults.parser}));
$(_a51).removeClass("datebox-f").addClass("datetimebox-f");
$(_a51).datebox("calendar").calendar({onSelect:function(date){
opts.onSelect.call(this.target,date);
}});
if(!_a52.spinner){
var _a54=$(_a51).datebox("panel");
var p=$("<div style=\"padding:2px\"><input></div>").insertAfter(_a54.children("div.datebox-calendar-inner"));
_a52.spinner=p.children("input");
}
_a52.spinner.timespinner({width:opts.spinnerWidth,showSeconds:opts.showSeconds,separator:opts.timeSeparator});
$(_a51).datetimebox("initValue",opts.value);
};
function _a55(_a56){
var c=$(_a56).datetimebox("calendar");
var t=$(_a56).datetimebox("spinner");
var date=c.calendar("options").current;
return new Date(date.getFullYear(),date.getMonth(),date.getDate(),t.timespinner("getHours"),t.timespinner("getMinutes"),t.timespinner("getSeconds"));
};
function _a57(_a58,q){
_a59(_a58,q,true);
};
function _a5a(_a5b){
var opts=$.data(_a5b,"datetimebox").options;
var date=_a55(_a5b);
_a59(_a5b,opts.formatter.call(_a5b,date));
$(_a5b).combo("hidePanel");
};
function _a59(_a5c,_a5d,_a5e){
var opts=$.data(_a5c,"datetimebox").options;
$(_a5c).combo("setValue",_a5d);
if(!_a5e){
if(_a5d){
var date=opts.parser.call(_a5c,_a5d);
$(_a5c).combo("setText",opts.formatter.call(_a5c,date));
$(_a5c).combo("setValue",opts.formatter.call(_a5c,date));
}else{
$(_a5c).combo("setText",_a5d);
}
}
var date=opts.parser.call(_a5c,_a5d);
$(_a5c).datetimebox("calendar").calendar("moveTo",date);
$(_a5c).datetimebox("spinner").timespinner("setValue",_a5f(date));
function _a5f(date){
function _a60(_a61){
return (_a61<10?"0":"")+_a61;
};
var tt=[_a60(date.getHours()),_a60(date.getMinutes())];
if(opts.showSeconds){
tt.push(_a60(date.getSeconds()));
}
return tt.join($(_a5c).datetimebox("spinner").timespinner("options").separator);
};
};
$.fn.datetimebox=function(_a62,_a63){
if(typeof _a62=="string"){
var _a64=$.fn.datetimebox.methods[_a62];
if(_a64){
return _a64(this,_a63);
}else{
return this.datebox(_a62,_a63);
}
}
_a62=_a62||{};
return this.each(function(){
var _a65=$.data(this,"datetimebox");
if(_a65){
$.extend(_a65.options,_a62);
}else{
$.data(this,"datetimebox",{options:$.extend({},$.fn.datetimebox.defaults,$.fn.datetimebox.parseOptions(this),_a62)});
}
_a50(this);
});
};
$.fn.datetimebox.methods={options:function(jq){
var _a66=jq.datebox("options");
return $.extend($.data(jq[0],"datetimebox").options,{originalValue:_a66.originalValue,disabled:_a66.disabled,readonly:_a66.readonly});
},cloneFrom:function(jq,from){
return jq.each(function(){
$(this).datebox("cloneFrom",from);
$.data(this,"datetimebox",{options:$.extend(true,{},$(from).datetimebox("options")),spinner:$(from).datetimebox("spinner")});
$(this).removeClass("datebox-f").addClass("datetimebox-f");
});
},spinner:function(jq){
return $.data(jq[0],"datetimebox").spinner;
},initValue:function(jq,_a67){
return jq.each(function(){
var opts=$(this).datetimebox("options");
var _a68=opts.value;
if(_a68){
_a68=opts.formatter.call(this,opts.parser.call(this,_a68));
}
$(this).combo("initValue",_a68).combo("setText",_a68);
});
},setValue:function(jq,_a69){
return jq.each(function(){
_a59(this,_a69);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).datetimebox("options");
$(this).datetimebox("setValue",opts.originalValue);
});
}};
$.fn.datetimebox.parseOptions=function(_a6a){
var t=$(_a6a);
return $.extend({},$.fn.datebox.parseOptions(_a6a),$.parser.parseOptions(_a6a,["timeSeparator","spinnerWidth",{showSeconds:"boolean"}]));
};
$.fn.datetimebox.defaults=$.extend({},$.fn.datebox.defaults,{spinnerWidth:"100%",showSeconds:true,timeSeparator:":",keyHandler:{up:function(e){
},down:function(e){
},left:function(e){
},right:function(e){
},enter:function(e){
_a5a(this);
},query:function(q,e){
_a57(this,q);
}},buttons:[{text:function(_a6b){
return $(_a6b).datetimebox("options").currentText;
},handler:function(_a6c){
var opts=$(_a6c).datetimebox("options");
_a59(_a6c,opts.formatter.call(_a6c,new Date()));
$(_a6c).datetimebox("hidePanel");
}},{text:function(_a6d){
return $(_a6d).datetimebox("options").okText;
},handler:function(_a6e){
_a5a(_a6e);
}},{text:function(_a6f){
return $(_a6f).datetimebox("options").closeText;
},handler:function(_a70){
$(_a70).datetimebox("hidePanel");
}}],formatter:function(date){
var h=date.getHours();
var M=date.getMinutes();
var s=date.getSeconds();
function _a71(_a72){
return (_a72<10?"0":"")+_a72;
};
var _a73=$(this).datetimebox("spinner").timespinner("options").separator;
var r=$.fn.datebox.defaults.formatter(date)+" "+_a71(h)+_a73+_a71(M);
if($(this).datetimebox("options").showSeconds){
r+=_a73+_a71(s);
}
return r;
},parser:function(s){
if($.trim(s)==""){
return new Date();
}
var dt=s.split(" ");
var d=$.fn.datebox.defaults.parser(dt[0]);
if(dt.length<2){
return d;
}
var _a74=$(this).datetimebox("spinner").timespinner("options").separator;
var tt=dt[1].split(_a74);
var hour=parseInt(tt[0],10)||0;
var _a75=parseInt(tt[1],10)||0;
var _a76=parseInt(tt[2],10)||0;
return new Date(d.getFullYear(),d.getMonth(),d.getDate(),hour,_a75,_a76);
}});
})(jQuery);
(function($){
function init(_a77){
var _a78=$("<div class=\"slider\">"+"<div class=\"slider-inner\">"+"<a href=\"javascript:void(0)\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>"+"</div>"+"<div class=\"slider-rule\"></div>"+"<div class=\"slider-rulelabel\"></div>"+"<div style=\"clear:both\"></div>"+"<input type=\"hidden\" class=\"slider-value\">"+"</div>").insertAfter(_a77);
var t=$(_a77);
t.addClass("slider-f").hide();
var name=t.attr("name");
if(name){
_a78.find("input.slider-value").attr("name",name);
t.removeAttr("name").attr("sliderName",name);
}
_a78.bind("_resize",function(e,_a79){
if($(this).hasClass("ui-fluid")||_a79){
_a7a(_a77);
}
return false;
});
return _a78;
};
function _a7a(_a7b,_a7c){
var _a7d=$.data(_a7b,"slider");
var opts=_a7d.options;
var _a7e=_a7d.slider;
if(_a7c){
if(_a7c.width){
opts.width=_a7c.width;
}
if(_a7c.height){
opts.height=_a7c.height;
}
}
_a7e._size(opts);
if(opts.mode=="h"){
_a7e.css("height","");
_a7e.children("div").css("height","");
}else{
_a7e.css("width","");
_a7e.children("div").css("width","");
_a7e.children("div.slider-rule,div.slider-rulelabel,div.slider-inner")._outerHeight(_a7e._outerHeight());
}
_a7f(_a7b);
};
function _a80(_a81){
var _a82=$.data(_a81,"slider");
var opts=_a82.options;
var _a83=_a82.slider;
var aa=opts.mode=="h"?opts.rule:opts.rule.slice(0).reverse();
if(opts.reversed){
aa=aa.slice(0).reverse();
}
_a84(aa);
function _a84(aa){
var rule=_a83.find("div.slider-rule");
var _a85=_a83.find("div.slider-rulelabel");
rule.empty();
_a85.empty();
for(var i=0;i<aa.length;i++){
var _a86=i*100/(aa.length-1)+"%";
var span=$("<span></span>").appendTo(rule);
span.css((opts.mode=="h"?"left":"top"),_a86);
if(aa[i]!="|"){
span=$("<span></span>").appendTo(_a85);
span.html(aa[i]);
if(opts.mode=="h"){
span.css({left:_a86,marginLeft:-Math.round(span.outerWidth()/2)});
}else{
span.css({top:_a86,marginTop:-Math.round(span.outerHeight()/2)});
}
}
}
};
};
function _a87(_a88){
var _a89=$.data(_a88,"slider");
var opts=_a89.options;
var _a8a=_a89.slider;
_a8a.removeClass("slider-h slider-v slider-disabled");
_a8a.addClass(opts.mode=="h"?"slider-h":"slider-v");
_a8a.addClass(opts.disabled?"slider-disabled":"");
var _a8b=_a8a.find(".slider-inner");
_a8b.html("<a href=\"javascript:void(0)\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>");
if(opts.range){
_a8b.append("<a href=\"javascript:void(0)\" class=\"slider-handle\"></a>"+"<span class=\"slider-tip\"></span>");
}
_a8a.find("a.slider-handle").draggable({axis:opts.mode,cursor:"pointer",disabled:opts.disabled,onDrag:function(e){
var left=e.data.left;
var _a8c=_a8a.width();
if(opts.mode!="h"){
left=e.data.top;
_a8c=_a8a.height();
}
if(left<0||left>_a8c){
return false;
}else{
_a8d(left,this);
return false;
}
},onStartDrag:function(){
_a89.isDragging=true;
opts.onSlideStart.call(_a88,opts.value);
},onStopDrag:function(e){
_a8d(opts.mode=="h"?e.data.left:e.data.top,this);
opts.onSlideEnd.call(_a88,opts.value);
opts.onComplete.call(_a88,opts.value);
_a89.isDragging=false;
}});
_a8a.find("div.slider-inner").unbind(".slider").bind("mousedown.slider",function(e){
if(_a89.isDragging||opts.disabled){
return;
}
var pos=$(this).offset();
_a8d(opts.mode=="h"?(e.pageX-pos.left):(e.pageY-pos.top));
opts.onComplete.call(_a88,opts.value);
});
function _a8d(pos,_a8e){
var _a8f=_a90(_a88,pos);
var s=Math.abs(_a8f%opts.step);
if(s<opts.step/2){
_a8f-=s;
}else{
_a8f=_a8f-s+opts.step;
}
if(opts.range){
var v1=opts.value[0];
var v2=opts.value[1];
var m=parseFloat((v1+v2)/2);
if(_a8e){
var _a91=$(_a8e).nextAll(".slider-handle").length>0;
if(_a8f<=v2&&_a91){
v1=_a8f;
}else{
if(_a8f>=v1&&(!_a91)){
v2=_a8f;
}
}
}else{
if(_a8f<v1){
v1=_a8f;
}else{
if(_a8f>v2){
v2=_a8f;
}else{
_a8f<m?v1=_a8f:v2=_a8f;
}
}
}
$(_a88).slider("setValues",[v1,v2]);
}else{
$(_a88).slider("setValue",_a8f);
}
};
};
function _a92(_a93,_a94){
var _a95=$.data(_a93,"slider");
var opts=_a95.options;
var _a96=_a95.slider;
var _a97=$.isArray(opts.value)?opts.value:[opts.value];
var _a98=[];
if(!$.isArray(_a94)){
_a94=$.map(String(_a94).split(opts.separator),function(v){
return parseFloat(v);
});
}
_a96.find(".slider-value").remove();
var name=$(_a93).attr("sliderName")||"";
for(var i=0;i<_a94.length;i++){
var _a99=_a94[i];
if(_a99<opts.min){
_a99=opts.min;
}
if(_a99>opts.max){
_a99=opts.max;
}
var _a9a=$("<input type=\"hidden\" class=\"slider-value\">").appendTo(_a96);
_a9a.attr("name",name);
_a9a.val(_a99);
_a98.push(_a99);
var _a9b=_a96.find(".slider-handle:eq("+i+")");
var tip=_a9b.next();
var pos=_a9c(_a93,_a99);
if(opts.showTip){
tip.show();
tip.html(opts.tipFormatter.call(_a93,_a99));
}else{
tip.hide();
}
if(opts.mode=="h"){
var _a9d="left:"+pos+"px;";
_a9b.attr("style",_a9d);
tip.attr("style",_a9d+"margin-left:"+(-Math.round(tip.outerWidth()/2))+"px");
}else{
var _a9d="top:"+pos+"px;";
_a9b.attr("style",_a9d);
tip.attr("style",_a9d+"margin-left:"+(-Math.round(tip.outerWidth()))+"px");
}
}
opts.value=opts.range?_a98:_a98[0];
$(_a93).val(opts.range?_a98.join(opts.separator):_a98[0]);
if(_a97.join(",")!=_a98.join(",")){
opts.onChange.call(_a93,opts.value,(opts.range?_a97:_a97[0]));
}
};
function _a7f(_a9e){
var opts=$.data(_a9e,"slider").options;
var fn=opts.onChange;
opts.onChange=function(){
};
_a92(_a9e,opts.value);
opts.onChange=fn;
};
function _a9c(_a9f,_aa0){
var _aa1=$.data(_a9f,"slider");
var opts=_aa1.options;
var _aa2=_aa1.slider;
var size=opts.mode=="h"?_aa2.width():_aa2.height();
var pos=opts.converter.toPosition.call(_a9f,_aa0,size);
if(opts.mode=="v"){
pos=_aa2.height()-pos;
}
if(opts.reversed){
pos=size-pos;
}
return pos.toFixed(0);
};
function _a90(_aa3,pos){
var _aa4=$.data(_aa3,"slider");
var opts=_aa4.options;
var _aa5=_aa4.slider;
var size=opts.mode=="h"?_aa5.width():_aa5.height();
var pos=opts.mode=="h"?(opts.reversed?(size-pos):pos):(opts.reversed?pos:(size-pos));
var _aa6=opts.converter.toValue.call(_aa3,pos,size);
return _aa6.toFixed(0);
};
$.fn.slider=function(_aa7,_aa8){
if(typeof _aa7=="string"){
return $.fn.slider.methods[_aa7](this,_aa8);
}
_aa7=_aa7||{};
return this.each(function(){
var _aa9=$.data(this,"slider");
if(_aa9){
$.extend(_aa9.options,_aa7);
}else{
_aa9=$.data(this,"slider",{options:$.extend({},$.fn.slider.defaults,$.fn.slider.parseOptions(this),_aa7),slider:init(this)});
$(this).removeAttr("disabled");
}
var opts=_aa9.options;
opts.min=parseFloat(opts.min);
opts.max=parseFloat(opts.max);
if(opts.range){
if(!$.isArray(opts.value)){
opts.value=$.map(String(opts.value).split(opts.separator),function(v){
return parseFloat(v);
});
}
if(opts.value.length<2){
opts.value.push(opts.max);
}
}else{
opts.value=parseFloat(opts.value);
}
opts.step=parseFloat(opts.step);
opts.originalValue=opts.value;
_a87(this);
_a80(this);
_a7a(this);
});
};
$.fn.slider.methods={options:function(jq){
return $.data(jq[0],"slider").options;
},destroy:function(jq){
return jq.each(function(){
$.data(this,"slider").slider.remove();
$(this).remove();
});
},resize:function(jq,_aaa){
return jq.each(function(){
_a7a(this,_aaa);
});
},getValue:function(jq){
return jq.slider("options").value;
},getValues:function(jq){
return jq.slider("options").value;
},setValue:function(jq,_aab){
return jq.each(function(){
_a92(this,[_aab]);
});
},setValues:function(jq,_aac){
return jq.each(function(){
_a92(this,_aac);
});
},clear:function(jq){
return jq.each(function(){
var opts=$(this).slider("options");
_a92(this,opts.range?[opts.min,opts.max]:[opts.min]);
});
},reset:function(jq){
return jq.each(function(){
var opts=$(this).slider("options");
$(this).slider(opts.range?"setValues":"setValue",opts.originalValue);
});
},enable:function(jq){
return jq.each(function(){
$.data(this,"slider").options.disabled=false;
_a87(this);
});
},disable:function(jq){
return jq.each(function(){
$.data(this,"slider").options.disabled=true;
_a87(this);
});
}};
$.fn.slider.parseOptions=function(_aad){
var t=$(_aad);
return $.extend({},$.parser.parseOptions(_aad,["width","height","mode",{reversed:"boolean",showTip:"boolean",range:"boolean",min:"number",max:"number",step:"number"}]),{value:(t.val()||undefined),disabled:(t.attr("disabled")?true:undefined),rule:(t.attr("rule")?eval(t.attr("rule")):undefined)});
};
$.fn.slider.defaults={width:"auto",height:"auto",mode:"h",reversed:false,showTip:false,disabled:false,range:false,value:0,separator:",",min:0,max:100,step:1,rule:[],tipFormatter:function(_aae){
return _aae;
},converter:{toPosition:function(_aaf,size){
var opts=$(this).slider("options");
return (_aaf-opts.min)/(opts.max-opts.min)*size;
},toValue:function(pos,size){
var opts=$(this).slider("options");
return opts.min+(opts.max-opts.min)*(pos/size);
}},onChange:function(_ab0,_ab1){
},onSlideStart:function(_ab2){
},onSlideEnd:function(_ab3){
},onComplete:function(_ab4){
}};
})(jQuery);

$.extend($.fn.validatebox.defaults.rules, { 
	packageStr: { 
		validator: function(value, param){ 
			return /^[A-Za-z0-9_.]+$/.test(value); 
		}, 
		message: '请输入正确包名,格式为:英文字母、数字、.或_'
	} 
}); 

/**
 * 给tree增加禁用复选框功能
 */
$.extend($.fn.tree.methods, {   
    /**
     * 激活复选框  
     * @param {Object} jq  
     * @param {Object} target  
     */  
    enableCheck : function(jq, target) {    
        return jq.each(function(){   
            var realTarget;   
            if(typeof target == "string" || typeof target == "number"){   
            	var otarget = $(this).tree("find",target);
            	if(otarget != null) {
            		realTarget = $(this).tree("find",target).target; 
            	}
            }else{   
                realTarget = target;   
            }  
            if(realTarget != null) {
	            var ckSpan = $(realTarget).find(">span.tree-checkbox");   
	            if(ckSpan.hasClass('tree-checkbox-disabled0')){   
	                ckSpan.removeClass('tree-checkbox-disabled0');   
	            }else if(ckSpan.hasClass('tree-checkbox-disabled1')){   
	                ckSpan.removeClass('tree-checkbox-disabled1');   
	            }else if(ckSpan.hasClass('tree-checkbox-disabled2')){   
	                ckSpan.removeClass('tree-checkbox-disabled2');   
	            } 
            }
        });   
    },   
    /**
     * 禁用复选框  
     * @param {Object} jq  
     * @param {Object} target  
     */  
    disableCheck : function(jq, target) {   
        return jq.each(function() {   
            var realTarget;   
            var that = this;   
            var state = $.data(this,'tree');   
            var opts = state.options;   
            if(typeof target == "string" || typeof target == "number"){
            	var otarget = $(this).tree("find",target);
            	if(otarget != null) {
            		realTarget = $(this).tree("find",target).target; 
            	}
            }else{   
                realTarget = target;   
            }   
            if(realTarget != null) {
	            var ckSpan = $(realTarget).find(">span.tree-checkbox");   
	            ckSpan.removeClass("tree-checkbox-disabled0").removeClass("tree-checkbox-disabled1").removeClass("tree-checkbox-disabled2");   
	            if(ckSpan.hasClass('tree-checkbox0')){   
	                ckSpan.addClass('tree-checkbox-disabled0');   
	            }else if(ckSpan.hasClass('tree-checkbox1')){   
	                ckSpan.addClass('tree-checkbox-disabled1');   
	            }else{   
	                ckSpan.addClass('tree-checkbox-disabled2')   
	            }   
	            if(!state.resetClick){   
	                $(this).unbind('click').bind('click', function(e) {   
	                    var tt = $(e.target);   
	                    var node = tt.closest('div.tree-node');   
	                    if (!node.length){return;}   
	                    if (tt.hasClass('tree-hit')){   
	                        $(this).tree("toggle",node[0]);   
	                        return false;   
	                    } else if (tt.hasClass('tree-checkbox')){   
	                        if(tt.hasClass('tree-checkbox-disabled0') || tt.hasClass('tree-checkbox-disabled1') || tt.hasClass('tree-checkbox-disabled2')){   
	                            $(this).tree("select",node[0]);   
	                        }else{   
	                            if(tt.hasClass('tree-checkbox1')){   
	                                $(this).tree('uncheck',node[0]);   
	                            }else{   
	                                $(this).tree('check',node[0]);   
	                            }   
	                            return false;   
	                        }   
	                    } else {   
	                        $(this).tree("select",node[0]);   
	                        opts.onClick.call(this, $(this).tree("getNode",node[0]));   
	                    }   
	                    e.stopPropagation();   
	                });   
	            }   
            }   
        });   
    }   
});  

;
///<jscompress sourcefile="ui-lang-zh_CN.js" />
if ($.fn.pagination) {
    $.fn.pagination.defaults.beforePageText = '第';
    $.fn.pagination.defaults.afterPageText = '共{pages}页';
    $.fn.pagination.defaults.displayMsg = '显示{from}到{to},共{total}条记录';
}
if ($.fn.datagrid) {
    $.fn.datagrid.defaults.loadMsg = '正在处理，请稍候...';
}
if ($.messager) {
    $.messager.defaults.ok = '确定';
    $.messager.defaults.cancel = '取消';
}
if ($.fn.validatebox) {
    $.fn.validatebox.defaults.missingMessage = '该输入项为必输项';
    $.fn.validatebox.defaults.rules.email.message = '请输入有效的电子邮件地址';
    $.fn.validatebox.defaults.rules.url.message = '请输入有效的URL地址';
    $.fn.validatebox.defaults.rules.length.message = '输入内容长度必须介于{0}和{1}之间';
    $.fn.validatebox.defaults.rules.remote.message = '请修正该字段';
}
if ($.fn.numberbox) {
    $.fn.numberbox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combobox) {
    $.fn.combobox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combotree) {
    $.fn.combotree.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.calendar) {
    $.fn.calendar.defaults.weeks = ['日', '一', '二', '三', '四', '五', '六'];
    $.fn.calendar.defaults.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
}
if ($.fn.datebox) {
    $.fn.datebox.defaults.currentText = '今天';
    $.fn.datebox.defaults.closeText = '关闭';
    $.fn.datebox.defaults.okText = '确定';
    $.fn.datebox.defaults.missingMessage = '该输入项为必输项';
    $.fn.datebox.defaults.formatter = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    };
    $.fn.datebox.defaults.parser = function (s) {
        if (!s) return new Date();
        var ss = s.split('-');
        var y = parseInt(ss[0], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };
}
if ($.fn.datetimebox && $.fn.datebox) {
    $.extend($.fn.datetimebox.defaults, {
        currentText: $.fn.datebox.defaults.currentText,
        closeText: $.fn.datebox.defaults.closeText,
        okText: $.fn.datebox.defaults.okText,
        missingMessage: $.fn.datebox.defaults.missingMessage
    });
}
;
///<jscompress sourcefile="validateExtend.js" />
/**
 * 扩展easyui的验证
 */


var rulesConfig = {
    trueFalse:{
        validator:function(value,param){
            return param[0];
        },
        message: '非真即假'
    },
    compareNum:{
        validator: function (value, param) {
            if(($("#" + param[0]).val())!= ''){
                return Number(value) <= Number($("#" + param[0]).val());
            }
            return true;
        },
        message: "请输入合适的数字"
    },
    idcard: {// 验证身份证
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字符.'
    },
    length: {
        validator: function (value, param) {
            //var len = $.trim(value).length;
            var len = value.length;
            return len >= param[0] && len <= param[1];
        },
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    faxno: {// 验证传真
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '号码格式有误<br>例如010-88888888'
    },
    phone: {// 验证电话号码
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    mobile: {// 验证手机号码
        validator: function (value) {
            //return /^(13|14|15|18|17)\d{9}$/i.test(value);
            return /^[0-9]{11}$/i.test(value);
        },
        message: '号码格式有误<br>例如13300001111'
    },
    currency: {// 验证货币
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    decimal: {
        validator: function (value, param) {
            var regStr = "^\\d+(\\.\\d+)?$";
            if (param)
                regStr = "^\\+?(\\d*\\.\\d{" + param[0] + "})$";
            var reg = new RegExp(regStr);
            return reg.test(value);
        },
        message: '输入的数据格式不正确'
    },
    intOrFloat: {// 验证整数或小数
        validator: function (value, param) {
            var pattStr = "^\\d+(\\.\\d+)?$";
            if (param) {
                pattStr = "^\\d+(\\.\\d{0," + param[0] + "})?$";
            }
            return (new RegExp(pattStr)).test(value);
            //如果有参数则验证小数的保留位数,下面是原正则表达式
            //return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    integer: {// 验证整数
        validator: function (value, param) {
            var pattern = /^[0-9]+\d*$/i;
            if (param)
                pattern = new RegExp("^[0-9]\d{" + param[0] + "}$");
            return pattern.test(value);
        },
        message: '请输入整数'
    },
	numberOrFloat: {// 验证可以为负数整数或小数
        validator: function (value, param) {
            var pattStr = "^[\\-\\+]?\\d+(\\.\\d+)?$";
            if (param) {
                pattStr = "^[\\-\\+]?\\d+(\\.\\d{0,"+param[0]+"})?$";
            }
            return (new RegExp(pattStr)).test(value);
            //如果有参数则验证小数的保留位数,下面是原正则表达式
            //return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    number:{
        validator: function (value, param) {
            var pattern = /^-?[0-9]+\d*$/i;
            return pattern.test(value);
        },
        message: '请输入数字'
    },
    range: {
        validator: function (value, param) {
            var v1 = parseFloat(param[0]), v2 = parseFloat(value), v3 = parseFloat(param[1]);
            if (isNaN(v1) || isNaN(v2) || isNaN(v3)) {
                return false;
            }
            return (v1 <= v2 && v2 <= v3);
        },
        message: '请输入{0}到{1}之间的数字'
    },
    qq: {// 验证QQ,从10000开始
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    age: {// 验证年龄
        validator: function (value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
        },
        message: '年龄必须是0到120之间的整数'
    },
    chinese: {// 验证中文
        validator: function (value, param) {

            var pattern = new RegExp("^[\u4e00-\u9fa5]{" + param[0] + "," + param[1] + "}$");
            return pattern.test(value);
            //return /^[\Α-\￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    address: {
        validator: function (value) {
            var reg = /^[< >]+$/;
            return !reg.test(value);//匹配是否含有特殊的字符
        },
        message: '只能输入包括汉字、字母、数字、符号'
    },
    ip: {// 验证IP地址
        validator: function (value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    date: {// 验证姓名，可以是中文或英文
        validator: function (value) {
            //格式yyyy-MM-dd或yyyy-M-d
            return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
        },
        message: '请输入正确的<br>日期格式,<br>例如：2015-01-01。'
    },
    date1: {
        validator: function (value, param) {
            var reg = /\d{4}-\d{2}-\d{2}/;
            return !reg.test(value);
        },
        message: "时间格式不正确,例如：2016-12-22"
    },
    msn: {
        validator: function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    },
    unequals: {
        validator: function (value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() != value;
            } else {
                return true;
            }
        },
        message: '两次输入不能一致'
    },
    equals: {
        validator: function (value, param) {
            if ($("#" + param[0]).val() != "" && value != "") {
                return $("#" + param[0]).val() == value;
            } else {
                return true;
            }
        },
        message: '两次输入的密码不一致！'
    },
    compareDate: {
        validator: function (value, param) {
            return dateCompare($(param[0]).datetimebox('getValue'), value); //注意easyui 时间控制获取值的方式
        },
        message: '开始日期不能大于结束日期'
    },
    linkMan: {
        validator: function (value, param) {
            var pattern = /^[\u4e00-\u9fa5]{2,4}$|^[a-zA-Z]{2,20}$/gi;
            return pattern.test(value);
        },
        message: "请输入2-4个汉字或者20个字母"
    },
    phoneMobile: {//手机或者固话
        validator: function (value, param) {
            var pattern = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/;
            return pattern.test(value);
        },
        message: "号码格式有误<br>例如010-88888888或者13300001111"
    },
    postCode: {
        validator: function (value, param) {
            //var pattern = /^[1-9]\d{5}$/;
            var pattern = /^[0-9]\d{5}$/;
            return pattern.test(value);
        },
        message: "请输入格式正确的邮编"
    },
    product: {
        validator: function (value, param) {
            var pattern = new RegExp("^([\u4e00-\u9fa5]|[,]|[，]|[“]|[”]|[\"]|[\"]){" + param[0] + "," + param[1] + "}$");
            return pattern.test(value);
        },
        message: "请输入主要产品"
    },
    companyCode: {
        validator: function (value, param) {
            var pattern = new RegExp("[a-zA-Z0-9]{8}-[a-zA-Z0-9]");
            return pattern.test(value);
        },
        message: "请输入组织机构代码证"
    },
    organizCode: {
        validator: function (value, param) {
            //var pattern = new RegExp("[a-zA-Z0-9]{8}-[a-zA-Z0-9]");
            //修改
            var pattern = /^[a-zA-Z0-9]{8}-([1-9]{2}|([a-zA-Z0-9]{2}\([a-zA-Z0-9]*\)))$/;
            if (pattern.test(value)) {
                var reg = /\(.*?\)/;
                //如果结尾有(XX)
                if (value.match(reg)) {
                    var c1 = value.match(reg)[0].replace(/[( )]/g, '');
                    reg = /-[1-9]{2}/;
                    var c2 = value.match(reg)[0].replace(/-/, '');
                    return c1 == c2;
                }
                return true;
            }
            else
                return false;
        },
        message: "请输入组织机构代码证"
    },
    organizCodes: {
        validator: function (value, param) {
            var pattern = /(^[A-Z0-9]{8}-[A-Z0-9]{1}(\([A-Z0-9]{1,2}\)){0,1}$)|(^[A-Z0-9]{18}$)/;
            return pattern.test(value);
        },
        message: "请输入组织机构代码证"
    },
    flEmpty: {
        validator: function (value, param) {
            /* var reg = /^[ ]|[ ]$/gi;
             return !reg.test(value);*/
            //return !(/^\s+|\s+$/.test(value));
            return true;
        },
        message: "首尾不能有空格"
    },
    timeDiff: {//时间范围验证
        validator: function (value, param) {
            //validType:'timeDiff[]'
            if (param != undefined && param.length == 2) {
                try {
                    var d1 = null,
                        date = new Date(value.replace(/-/g, "/")),
                        d3 = null;
                    if (param[0] == 0) {//第一个参数=0 那么必须小于等于第二个参数
                        if (param[1] == "")
                            return true;
                        d3 = new Date(param[1].replace(/-/g, "/"));
                        rulesConfig.timeDiff.message = "您选择的时间必须大于等于{1}。";
                        return (date <= d3);
                    } else if (param[1] == 0) {//第二个参数=0 那么必须大于等于第一个参数
                        if (param[0] == "")
                            return true;
                        d1 = new Date(param[0].replace(/-/g, "/"));
                        rulesConfig.timeDiff.message = "您选择的时间必须大于等于{0}。";
                        return (date >= d1);
                    } else {
                        d1 = new Date(param[0].replace(/-/g, "/"));
                        d3 = new Date(param[1].replace(/-/g, "/"));
                        rulesConfig.timeDiff.message = "您选择的时间必须在{0}和{1}之间。";
                        return d1 <= date && date <= d2
                    }
                } catch (e) {
                    rulesConfig.timeDiff.message = "您选择的时间不正确。";
                    return false;

                }

                return false;
            }
            return true;

            /*  var d = new Date(value.replace(/-/g, "/"))
             var d1 = null;
             var d2 = null;
             if (param[0] != undefined && param[1] != undefined) {//两个都不为空的时候需要在时间之间
             d1 = new Date(param[0].replace(/-/g, "/"));
             d2 = new Date(param[1].replace(/-/g, "/"));
             return (d1 < d1 < d2);
             } else if (param[1] != undefined) {//第二个参数不为空,则需要时间小于参数
             d2 = new Date(param[1].replace(/-/g, "/"));
             return (d < d2);
             } else if (param[0] != undefined) {//第一个参数不为空,则需要时间大于参数
             d1 = new Date(param[0].replace(/-/g, "/"));
             return (d > d1);
             }
             return true;*/
        },
        message: "时间范围选择有误{0}{1}"
    },
    timeValDiff: {//时间范围验证
        validator: function (value, param) {
            var d1 = new Date(param[0].replace(/-/g, "/")),
                d2 = new Date(param[1].replace(/-/g, "/"));
            return d2 >= d1;
        },
        message: "时间范围选择有误{0}{1}"
    },
    less: {
        //验证当前项小于等于前几项的差
        validator: function (value, param) {
            if (param.length > 1) {
                //验证当前项小于等于前几项的差
                var total = 0;

                $.each(param, function (k, p) {
                    if (k == 0) {
                        total = Number($(p).val());
                    } else {
                        total = total - Number($(p).val());
                    }
                });
                return (total - Number(value)) > 0;
            }
            return Number(value) < Number($(param[0]).val());
        },
        message: "填写的数值必须小于{0}"
    },
    lessEq: {
        //验证当前项小于等于前几项的差
        validator: function (value, param) {
            if (param.length > 1) {
                //验证当前项小于等于前几项的差
                var total = 0;

                $.each(param, function (k, p) {
                    if (k == 0) {
                        total = Number($(p).val());
                    } else {
                        total = total - Number($(p).val());
                    }
                });
                return (total - Number(value)) >= 0;
            }
            return Number(value) <= Number($(param[0]).val());
        },
        message: "填写的数值必须小于{0}"
    },
    mdEq: {
        //验证当前项小于等于前几项的差
        validator: function (value, param) {

            return Number(value) >= Number($(param[0]).val());
        },
        message: "填写的数值必须小于{0}"
    },
    lessSum: {
        //验证当前项小于等于前几项的合
        validator: function (value, param) {
            if (param.length > 1) {
                //验证一项大于等其他几项
                var total = 0;

                $.each(param, function (k, p) {
                    total += Number($(p).val());
                });
                return Number(value) <= total;
            }
            return Number(value) <= Number($(param[0]).val());
        },
        message: "填写的数值必须小于{0}"
    },
    md: {
        validator: function (value, param) {
            var startTime2 = $(param[0]).datebox('getValue');
            var d1 = $.fn.datebox.defaults.parser(startTime2);
            var d2 = $.fn.datebox.defaults.parser(value);
            if (param[1] == 1)
                return d2 >= d1;
            return d2 > d1;
        },
        message: '结束时间要大于开始时间！'
    },
    mde: {
        validator: function (value, param) {
            var startTime2 = $(param[0]).val().replace(/-/g, '/');
            var d1 = new Date(startTime2);
            var d2 = new Date(value.replace(/-/g, '/'));
            if (param[1] == 1)
                return d2 >= d1;
            return d2 > d1;

        },
        message: '结束时间要大于开始时间！'
    },
    code: {
        validator: function (value, param) {
            //var reg=/<(\/?)(script|i?frame|div|p|b|font|table|td|th|strong|style|html|t?body|title|link|meta|t?head|br|h(1|2|3|4|5|6)|\?|%)([^>]*?)>/ig;
            var reg = /<([a-zA-Z]+)[^>]*>/ig;
            return !reg.test(value);
        },
        message: "您输入了非法危险字符"
    },
    bfbNum: {//百分比 只允许输入0或者1-100之间的数字
        validator: function (value, param) {
            if (param == undefined)
                param = [2];
            //先验证是否是浮点型
            if (rulesConfig.intOrFloat.validator(value, param)) {
                var n = parseFloat(value);
                if (n == 0 || (1 <= n && n <= 100))
                    return true;
                else
                    return false;
            }
            return false;
        },
        message: "请输入0或者1-100之间的数字"
    },
    mstEmpty: {
        validator: function (value, param) {
            //验证必须为空
            return value == "";
        },
        message: "不能输入"
    },
    danger: {
        validator: function (value, param) {
            //过滤英文：" ' ! % <script> <head>
            var pattern = new RegExp("^\"|\"$|[\!\_\^\']", "g");
            return !pattern.test(value) && rulesConfig.code.validator(value, param);
        },
        message: "不能输入% ! _"
    },
    letOrNumb: {
        validator: function (value, param) {
            var pattern = new RegExp("[a-zA-Z0-9]");
            if (param[0] == 1) {
                pattern = new RegExp("[A-Z0-9]");
            }
            return pattern.test(value);
        },
        message: "请输入字母或者数字"
    }

};


$.extend($.fn.validatebox.defaults.rules, rulesConfig);


var errconfig = {
    lenEmpty: function () {
        //必填非空且有长度限制的
        return "请输入{0}个以内的长度<br>（包括汉字、字母、数字、空格、符号）".format(arguments[0]);
    },
    rangeFloat: function () {
        if (arguments.length == 0)
            return "请输入数字";
        if (arguments.length == 1)
            return "请输入数字，<br>有小数保留{0}位".format(arguments[0]);
        if (arguments[2] == 'n')
            return "请输入{0}-{1}的数字".format(arguments[0], arguments[1]);
        //浮点型必填提示
        return "请输入{0}-{1}的数字，<br>有小数保留{2}位".format(arguments[0], arguments[1], (arguments[2] == undefined ? 2 : arguments[2]));
    },
    rangeInteger: function () {
        //整形范围必填提示
        return "请输入{0}-{1}以内的整数".format(arguments[0], arguments[1]);
    },
    Integer: "请输入整数",
    phoneMobile: "请输入联系方式(手机或者固话)",
    psMobile: function () {
        return "{0}为{1}个长度（不包括：!、_、%、^、\'等特殊字符）".format(arguments[0], arguments[1]);
    },
    comboMsg: function () {
        //选择下拉框
        return "请您选择一项{0}。".format(arguments[0]);
    },
    datebox: function () {
        //时间控件必选提示
        return "请您选择{0}。".format(arguments[0]);
    },
    tipMsg: function () {
        //普通的必填提示
        return "请输入{0}".format(arguments[0])
    },
    listGtValMsg: function () {
        //列表数据超过了规定的值
        return "{0}列表中的有效数据超过了{1}填写的<font color='red' size='+2'>{2}</font>,请您核对数据后再保存。".format(arguments[0], arguments[1], arguments[2])
    },
    bfbNum: function () {
        //百分比
        if (arguments.length == 0)
            return "请输入0或者1-100之间的数字,有小数保留2位。";
        return "请输入0或者1-100之间的数字,有小数保留{0}位。".format(arguments[0]);
    },
    condtion: function () {
        if (arguments.length > 1)
            return "{0}不允许超过{1}个长度<br>（不包括：!、_、%、^、\'等特殊字符）".format(arguments[0], arguments[1]);
        else
            return "{0}<br>（不包括：!、_、%、^、\'等特殊字符）".format(arguments[0], arguments[1]);
    },
    startTimeAlert:function(){
    return "开始时间必须小于或等于结束时间";
    },
    endTimeAlert:function(){
        return "结束时间必须大于或等于开始时间";
    }
};
;
///<jscompress sourcefile="json2.js" />
/*
 json2.js
 2015-05-03

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse. This file is provides the ES5 JSON capability to ES3 systems.
 If a project might run on IE8 or earlier, then this file should be included.
 This file does nothing on ES5 systems.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10
 ? '0' + n
 : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 JSON.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = JSON.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = JSON.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date
 ? 'Date(' + this[key] + ')'
 : value;
 });
 // text is '["Date(---current time---)"]'


 JSON.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = JSON.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint 
 eval, for, this
 */

/*property
 JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? '0' + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
            f(this.getUTCMonth() + 1) + '-' +
            f(this.getUTCDate()) + 'T' +
            f(this.getUTCHours()) + ':' +
            f(this.getUTCMinutes()) + ':' +
            f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? '"' + string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"'
            : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value)
                    ? String(value)
                    : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                        gap
                                            ? ': '
                                            : ':'
                                    ) + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                        gap
                                            ? ': '
                                            : ':'
                                    ) + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, '@')
                        .replace(rx_three, ']')
                        .replace(rx_four, '')
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
;
///<jscompress sourcefile="template.js" />
/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(/^$|,+/)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--.*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g;e.openTag="{{",e.closeTag="}}";var y=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a,b){a=a.replace(/^\s/,"");var c=a.split(" "),e=c.shift(),f=c.join(" ");switch(e){case"if":a="if("+f+"){";break;case"else":c="if"===c.shift()?" if("+c.join(" ")+")":"",a="}else"+c+"{";break;case"/if":a="}";break;case"each":var g=c[0]||"$data",h=c[1]||"as",i=c[2]||"$value",j=c[3]||"$index",k=i+","+j;"as"!==h&&(g="[]"),a="$each("+g+",function("+k+"){";break;case"/each":a="});";break;case"echo":a="print("+f+");";break;case"print":case"include":a=e+"("+c.join(",")+");";break;default:if(-1!==f.indexOf("|")){var l=b.escape;0===a.indexOf("#")&&(a=a.substr(1),l=!1);for(var m=0,n=a.split("|"),o=n.length,p=l?"$escape":"$string",q=p+"("+n[m++]+")";o>m;m++)q=y(q,n[m]);a="=#"+q}else a=d.helpers[e]?"=#"+e+"("+c.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();;
///<jscompress sourcefile="jquery.form.js" />
/*!
 * jQuery Form Plugin
 * version: 4.2.2
 * Requires jQuery v1.7.2 or later
 * Project repository: https://github.com/jquery-form/form
 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup
 * Dual licensed under the LGPL-2.1+ or MIT licenses
 * https://github.com/jquery-form/form#license
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,r){return void 0===r&&(r="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(r),r}:e(jQuery)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).closest("form").ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=r.form;if(i.clk=r,"image"===r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n=/\r?\n/g,i={};i.fileapi=void 0!==e('<input type="file">').get(0).files,i.formdata=void 0!==window.FormData;var o=!!e.fn.prop;e.fn.attr2=function(){if(!o)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t,r,n,s){function u(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;a<o;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function c(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(e){a("cannot get iframe.contentWindow document: "+e)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function i(){function t(){try{var e=n(v).readyState;a("state = "+e),e&&"uninitialized"===e.toLowerCase()&&setTimeout(t,50)}catch(e){a("Server abort: ",e," (",e.name,")"),s(L),j&&clearTimeout(j),j=void 0}}var r=p.attr2("target"),i=p.attr2("action"),o=p.attr("enctype")||p.attr("encoding")||"multipart/form-data";w.setAttribute("target",m),l&&!/post/i.test(l)||w.setAttribute("method","POST"),i!==f.url&&w.setAttribute("action",f.url),f.skipEncodingOverride||l&&!/post/i.test(l)||p.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),f.timeout&&(j=setTimeout(function(){T=!0,s(A)},f.timeout));var u=[];try{if(f.extraData)for(var c in f.extraData)f.extraData.hasOwnProperty(c)&&(e.isPlainObject(f.extraData[c])&&f.extraData[c].hasOwnProperty("name")&&f.extraData[c].hasOwnProperty("value")?u.push(e('<input type="hidden" name="'+f.extraData[c].name+'">',k).val(f.extraData[c].value).appendTo(w)[0]):u.push(e('<input type="hidden" name="'+c+'">',k).val(f.extraData[c]).appendTo(w)[0]));f.iframeTarget||h.appendTo(D),v.attachEvent?v.attachEvent("onload",s):v.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(e){document.createElement("form").submit.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",o),r?w.setAttribute("target",r):p.removeAttr("target"),e(u).remove()}}function s(t){if(!x.aborted&&!X){if((O=n(v))||(a("cannot access response document"),t=L),t===A&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t===L&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(O&&O.location.href!==f.iframeSrc||T){v.detachEvent?v.detachEvent("onload",s):v.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"===f.dataType||O.XMLDocument||e.isXMLDoc(O);if(a("isXml="+o),!o&&window.opera&&(null===O.body||!O.body.innerHTML)&&--C)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=O.body?O.body:O.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=O.XMLDocument?O.XMLDocument:O,o&&(f.dataType="xml"),x.getResponseHeader=function(e){return{"content-type":f.dataType}[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(f.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||f.textarea){var p=O.getElementsByTagName("textarea")[0];if(p)x.responseText=p.value,x.status=Number(p.getAttribute("status"))||x.status,x.statusText=p.getAttribute("statusText")||x.statusText;else if(l){var m=O.getElementsByTagName("pre")[0],g=O.getElementsByTagName("body")[0];m?x.responseText=m.textContent?m.textContent:m.innerText:g&&(x.responseText=g.textContent?g.textContent:g.innerText)}}else"xml"===c&&!x.responseXML&&x.responseText&&(x.responseXML=q(x.responseText));try{M=N(x,c,f)}catch(e){i="parsererror",x.error=r=e||i}}catch(e){a("error caught: ",e),i="error",x.error=r=e||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(f.success&&f.success.call(f.context,M,"success",x),S.resolve(x.responseText,"success",x),d&&e.event.trigger("ajaxSuccess",[x,f])):i&&(void 0===r&&(r=x.statusText),f.error&&f.error.call(f.context,x,i,r),S.reject(x,"error",r),d&&e.event.trigger("ajaxError",[x,f,r])),d&&e.event.trigger("ajaxComplete",[x,f]),d&&!--e.active&&e.event.trigger("ajaxStop"),f.complete&&f.complete.call(f.context,x,i),X=!0,f.timeout&&clearTimeout(j),setTimeout(function(){f.iframeTarget?h.attr("src",f.iframeSrc):h.remove(),x.responseXML=null},100)}}}var u,c,f,d,m,h,v,x,y,b,T,j,w=p[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(c=0;c<g.length;c++)u=e(g[c]),o?u.prop("disabled",!1):u.removeAttr("disabled");(f=e.extend(!0,{},e.ajaxSettings,t)).context=f.context||f,m="jqFormIO"+(new Date).getTime();var k=w.ownerDocument,D=p.closest("body");if(f.iframeTarget?(b=(h=e(f.iframeTarget,k)).attr2("name"))?m=b:h.attr2("name",m):(h=e('<iframe name="'+m+'" src="'+f.iframeSrc+'" />',k)).css({position:"absolute",top:"-1000px",left:"-1000px"}),v=h[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{v.contentWindow.document.execCommand&&v.contentWindow.document.execCommand("Stop")}catch(e){}h.attr("src",f.iframeSrc),x.error=r,f.error&&f.error.call(f.context,x,r,t),d&&e.event.trigger("ajaxError",[x,f,r]),f.complete&&f.complete.call(f.context,x,r)}},(d=f.global)&&0==e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[x,f]),f.beforeSend&&!1===f.beforeSend.call(f.context,x,f))return f.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;(y=w.clk)&&(b=y.name)&&!y.disabled&&(f.extraData=f.extraData||{},f.extraData[b]=y.value,"image"===y.type&&(f.extraData[b+".x"]=w.clk_x,f.extraData[b+".y"]=w.clk_y));var A=1,L=2,F=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&F&&(f.extraData=f.extraData||{},f.extraData[E]=F),f.forceSync?i():setTimeout(i,10);var M,O,X,C=50,q=e.parseXML||function(e,t){return window.ActiveXObject?((t=new ActiveXObject("Microsoft.XMLDOM")).async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!==t.documentElement.nodeName?t:null},_=e.parseJSON||function(e){return window.eval("("+e+")")},N=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i=("xml"===r||!r)&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&(("json"===r||!r)&&n.indexOf("json")>=0?o=_(o):("script"===r||!r)&&n.indexOf("javascript")>=0&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var l,f,d,p=this;"function"==typeof t?t={success:t}:"string"==typeof t||!1===t&&arguments.length>0?(t={url:t,data:r,dataType:n},"function"==typeof s&&(t.success=s)):void 0===t&&(t={}),l=t.method||t.type||this.attr2("method"),(d=(d="string"==typeof(f=t.url||this.attr2("action"))?e.trim(f):"")||window.location.href||"")&&(d=(d.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:d,success:e.ajaxSettings.success,type:l||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&!1===t.beforeSerialize(this,t))return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var h=t.traditional;void 0===h&&(h=e.ajaxSettings.traditional);var v,g=[],x=this.formToArray(t.semantic,g,t.filtering);if(t.data){var y=e.isFunction(t.data)?t.data(x):t.data;t.extraData=y,v=e.param(y,h)}if(t.beforeSubmit&&!1===t.beforeSubmit(x,this,t))return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[x,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var b=e.param(x,h);v&&(b=b?b+"&"+v:v),"GET"===t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+b,t.data=null):t.data=b;var T=[];if(t.resetForm&&T.push(function(){p.resetForm()}),t.clearForm&&T.push(function(){p.clearForm(t.includeHidden)}),!t.dataType&&t.target){var j=t.success||function(){};T.push(function(r,a,n){var i=arguments,o=t.replaceTarget?"replaceWith":"html";e(t.target)[o](r).each(function(){j.apply(this,i)})})}else t.success&&(e.isArray(t.success)?e.merge(T,t.success):T.push(t.success));if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=T.length;i<o;i++)T[i].apply(n,[e,r,a||p,p])},t.error){var w=t.error;t.error=function(e,r,a){var n=t.context||this;w.apply(n,[e,r,a,p])}}if(t.complete){var S=t.complete;t.complete=function(e,r){var a=t.context||this;S.apply(a,[e,r,p])}}var k=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}).length>0,D="multipart/form-data",A=p.attr("enctype")===D||p.attr("encoding")===D,L=i.fileapi&&i.formdata;a("fileAPI :"+L);var F,E=(k||A)&&!L;!1!==t.iframe&&(t.iframe||E)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){F=c(x)}):F=c(x):F=(k||A)&&L?function(r){for(var a=new FormData,n=0;n<r.length;n++)a.append(r[n].name,r[n].value);if(t.extraData){var i=u(t.extraData);for(n=0;n<i.length;n++)i[n]&&a.append(i[n][0],i[n][1])}t.data=null;var o=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:l||"POST"});t.uploadProgress&&(o.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),o.data=null;var s=o.beforeSend;return o.beforeSend=function(e,r){t.formData?r.data=t.formData:r.data=a,s&&s.call(this,e,r)},e.ajax(o)}(x):e.ajax(t),p.removeData("jqxhr").data("jqxhr",F);for(var M=0;M<g.length;M++)g[M]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n,i,o,s){if(("string"==typeof n||!1===n&&arguments.length>0)&&(n={url:n,data:i,dataType:o},"function"==typeof s&&(n.success=s)),n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var u={s:this.selector,c:this.context};return!e.isReady&&u.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(u.s,u.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().on("submit.form-plugin",n,t).on("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.off("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r,a){var n=[];if(0===this.length)return n;var o,s=this[0],u=this.attr("id"),c=t||void 0===s.elements?s.getElementsByTagName("*"):s.elements;if(c&&(c=e.makeArray(c)),u&&(t||/(Edge|Trident)\//.test(navigator.userAgent))&&(o=e(':input[form="'+u+'"]').get()).length&&(c=(c||[]).concat(o)),!c||!c.length)return n;e.isFunction(a)&&(c=e.map(c,a));var l,f,d,p,m,h,v;for(l=0,h=c.length;l<h;l++)if(m=c[l],(d=m.name)&&!m.disabled)if(t&&s.clk&&"image"===m.type)s.clk===m&&(n.push({name:d,value:e(m).val(),type:m.type}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}));else if((p=e.fieldValue(m,!0))&&p.constructor===Array)for(r&&r.push(m),f=0,v=p.length;f<v;f++)n.push({name:d,value:p[f]});else if(i.fileapi&&"file"===m.type){r&&r.push(m);var g=m.files;if(g.length)for(f=0;f<g.length;f++)n.push({name:d,value:g[f],type:m.type});else n.push({name:d,value:"",type:m.type})}else null!==p&&void 0!==p&&(r&&r.push(m),n.push({name:d,value:p,type:m.type,required:m.required}));if(!t&&s.clk){var x=e(s.clk),y=x[0];(d=y.name)&&!y.disabled&&"image"===y.type&&(n.push({name:d,value:x.val()}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}))}return n},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor===Array)for(var i=0,o=n.length;i<o;i++)r.push({name:a,value:n[i]});else null!==n&&void 0!==n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;a<n;a++){var i=this[a],o=e.fieldValue(i,t);null===o||void 0===o||o.constructor===Array&&!o.length||(o.constructor===Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,i=t.type,o=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"===i||"button"===i||("checkbox"===i||"radio"===i)&&!t.checked||("submit"===i||"image"===i)&&t.form&&t.form.clk!==t||"select"===o&&-1===t.selectedIndex))return null;if("select"===o){var s=t.selectedIndex;if(s<0)return null;for(var u=[],c=t.options,l="select-one"===i,f=l?s+1:c.length,d=l?s:0;d<f;d++){var p=c[d];if(p.selected&&!p.disabled){var m=p.value;if(m||(m=p.attributes&&p.attributes.value&&!p.attributes.value.specified?p.text:p.value),l)return m;u.push(m)}}return u}return e(t).val().replace(n,"\r\n")},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"===n?this.value="":"checkbox"===a||"radio"===a?this.checked=!1:"select"===n?this.selectedIndex=-1:"file"===a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(!0===t&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){var t=e(this),r=this.tagName.toLowerCase();switch(r){case"input":this.checked=this.defaultChecked;case"textarea":return this.value=this.defaultValue,!0;case"option":case"optgroup":var a=t.parents("select");return a.length&&a[0].multiple?"option"===r?this.selected=this.defaultSelected:t.find("option").resetForm():a.resetForm(),!0;case"select":return t.find("option").each(function(e){if(this.selected=this.defaultSelected,this.defaultSelected&&!t[0].multiple)return t[0].selectedIndex=e,!1}),!0;case"label":var n=e(t.attr("for")),i=t.find("input,select,textarea");return n[0]&&i.unshift(n[0]),i.resetForm(),!0;case"form":return("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset(),!0;default:return t.find("form,input,label,select,textarea").resetForm(),!0}})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"===r||"radio"===r)this.checked=t;else if("option"===this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"===a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});
//# sourceMappingURL=jquery.form.min.js.map;
///<jscompress sourcefile="jquery.MultiFile.js" />
/*
 ### jQuery Multiple File Selection Plugin v2.2.0 - 2015-03-23 ###
 * Home: http://www.fyneworks.com/jquery/multifile/
 * Code: http://code.google.com/p/jquery-multifile-plugin/
 *
	* Licensed under http://en.wikipedia.org/wiki/MIT_License
 ###
*/
/*# AVOID COLLISIONS #*/
;
if (window.jQuery)(function ($) {
	"use strict";
	/*# AVOID COLLISIONS #*/

	// size label function (shows kb and mb where accordingly)
	function sl(x) {
		return x > 1048576 ? (x / 1048576).toFixed(1) + 'Mb' : (x==1024?'1Mb': (x / 1024).toFixed(1) + 'Kb' )
	};
	// utility function to return an array of
	function FILE_LIST(x){
		return ((x.files&&x.files.length) ? x.files : null) || [{
			name: x.value,
			size: 0,
			type: ((x.value || '').match(/[^\.]+$/i) || [''])[0]
		}];
	};

	// plugin initialization
	$.fn.MultiFile = function (options) {
		if (this.length == 0) return this; // quick fail

		// Handle API methods
		if (typeof arguments[0] == 'string') {
			// Perform API methods on individual elements
			if (this.length > 1) {
				var args = arguments;
				return this.each(function () {
					$.fn.MultiFile.apply($(this), args);
				});
			};
			// Invoke API method handler (and return whatever it wants to return)
			return $.fn.MultiFile[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
		};

		// Accept number
		if (typeof options == 'number') {
			options = {max: options};
		};

		// Initialize options for this call
		var options = $.extend({} /* new object */ ,
			$.fn.MultiFile.options /* default options */ ,
			options || {} /* just-in-time options */
		);

		// Empty Element Fix!!!
		// this code will automatically intercept native form submissions
		// and disable empty file elements
		$('form')
			.not('MultiFile-intercepted')
			.addClass('MultiFile-intercepted')
			.submit($.fn.MultiFile.disableEmpty);

		//### http://plugins.jquery.com/node/1363
		// utility method to integrate this plugin with others...
		if ($.fn.MultiFile.options.autoIntercept) {
			$.fn.MultiFile.intercept($.fn.MultiFile.options.autoIntercept /* array of methods to intercept */ );
			$.fn.MultiFile.options.autoIntercept = null; /* only run this once */
		};

		// loop through each matched element
		this
			.not('.MultiFile-applied')
			.addClass('MultiFile-applied')
			.each(function () {
				//#####################################################################
				// MAIN PLUGIN FUNCTIONALITY - START
				//#####################################################################

				// BUG 1251 FIX: http://plugins.jquery.com/project/comments/add/1251
				// variable group_count would repeat itself on multiple calls to the plugin.
				// this would cause a conflict with multiple elements
				// changes scope of variable to global so id will be unique over n calls
				window.MultiFile = (window.MultiFile || 0) + 1;
				var group_count = window.MultiFile;

				// Copy parent attributes - Thanks to Jonas Wagner
				// we will use this one to create new input elements
				var MultiFile = {
					e: this,
					E: $(this),
					clone: $(this).clone()
				};

				//===

				//# USE CONFIGURATION
				var o = $.extend({},
					$.fn.MultiFile.options,
					options || {}, ($.metadata ? MultiFile.E.metadata() : ($.meta ? MultiFile.E.data() : null)) || {}, /* metadata options */ {} /* internals */
				);
				// limit number of files that can be selected?
				if (!(o.max > 0) /*IsNull(MultiFile.max)*/ ) {
					o.max = MultiFile.E.attr('maxlength');
				};
				if (!(o.max > 0) /*IsNull(MultiFile.max)*/ ) {
					o.max = (String(MultiFile.e.className.match(/\b(max|limit)\-([0-9]+)\b/gi) || ['']).match(/[0-9]+/gi) || [''])[0];
					if (!(o.max > 0)) o.max = -1;
					else o.max = String(o.max).match(/[0-9]+/gi)[0];
				};
				o.max = new Number(o.max);
				// limit extensions?
				o.accept = o.accept || MultiFile.E.attr('accept') || '';
				if (!o.accept) {
					o.accept = (MultiFile.e.className.match(/\b(accept\-[\w\|]+)\b/gi)) || '';
					o.accept = new String(o.accept).replace(/^(accept|ext)\-/i, '');
				};
				// limit total pay load size
				o.maxsize = o.maxsize>0?o.maxsize:null || MultiFile.E.data('maxsize') || 0;
				if (!(o.maxsize > 0) /*IsNull(MultiFile.maxsize)*/ ) {
					o.maxsize = (String(MultiFile.e.className.match(/\b(maxsize|maxload|size)\-([0-9]+)\b/gi) || ['']).match(/[0-9]+/gi) || [''])[0];
					if (!(o.maxsize > 0)) o.maxsize = -1;
					else o.maxsize = String(o.maxsize).match(/[0-9]+/gi)[0];
				};
				// limit individual file size
				o.maxfile = o.maxfile>0?o.maxfile:null || MultiFile.E.data('maxfile') || 0;
				if (!(o.maxfile > 0) /*IsNull(MultiFile.maxfile)*/ ) {
					o.maxfile = (String(MultiFile.e.className.match(/\b(maxfile|filemax)\-([0-9]+)\b/gi) || ['']).match(/[0-9]+/gi) || [''])[0];
					if (!(o.maxfile > 0)) o.maxfile = -1;
					else o.maxfile = String(o.maxfile).match(/[0-9]+/gi)[0];
				};

				//===

				// size options are accepted in kylobytes, so multiple them by 1024
				if(o.maxfile>1) o.maxfile = o.maxfile * 1024;
				if(o.maxsize>1) o.maxsize = o.maxsize * 1024;

				//===

				// HTML5: enforce multiple selection to be enabled
				if(o.max>1) MultiFile.E.attr('multiple','multiple').prop('multiple',true);

				//===

				// APPLY CONFIGURATION
				$.extend(MultiFile, o || {});
				MultiFile.STRING = $.extend(MultiFile.STRING || {}, $.fn.MultiFile.options.STRING, MultiFile.STRING);

				//===

				//#########################################
				// PRIVATE PROPERTIES/METHODS
				$.extend(MultiFile, {
					n: 0, // How many elements are currently selected?
					slaves: [],
					files: [],
					instanceKey: MultiFile.e.id || 'MultiFile' + String(group_count), // Instance Key?
					generateID: function (z) {
						return MultiFile.instanceKey + (z > 0 ? '_F' + String(z) : '');
					},
					trigger: function (event, element, MultiFile, files) {
						var rv, handler = MultiFile[event] || MultiFile['on'+event] ;
						if (handler){
							files = files || MultiFile.files || FILE_LIST(this);
							;
							$.each(files,function(i, file){
								// execute function in element's context, so 'this' variable is current element
								rv = handler.apply(MultiFile.wrapper, [element, file.name, MultiFile, file]);
							});
							return rv;
						};
					}
				});

				//===

				// Setup dynamic regular expression for extension validation
				// - thanks to John-Paul Bader: http://smyck.de/2006/08/11/javascript-dynamic-regular-expresions/
				if (String(MultiFile.accept).length > 1) {
					MultiFile.accept = MultiFile.accept.replace(/\W+/g, '|').replace(/^\W|\W$/g, '');
					MultiFile.rxAccept = new RegExp('\\.(' + (MultiFile.accept ? MultiFile.accept : '') + ')$', 'gi');
				};

				//===

				// Create wrapper to hold our file list
				MultiFile.wrapID = MultiFile.instanceKey;// + '_wrap'; // Wrapper ID?
				MultiFile.E.wrap('<div class="MultiFile-wrap" id="' + MultiFile.wrapID + '"></div>');
				MultiFile.wrapper = $('#' + MultiFile.wrapID + '');

				//===

				// MultiFile MUST have a name - default: file1[], file2[], file3[]
				MultiFile.e.name = MultiFile.e.name || 'file' + group_count + '[]';

				//===

				if (!MultiFile.list) {
					// Create a wrapper for the list
					// * OPERA BUG: NO_MODIFICATION_ALLOWED_ERR ('list' is a read-only property)
					// this change allows us to keep the files in the order they were selected
					MultiFile.wrapper.append('<div class="MultiFile-list" id="' + MultiFile.wrapID + '_list"></div>');
					MultiFile.list = $('#' + MultiFile.wrapID + '_list');
				};
				MultiFile.list = $(MultiFile.list);

				//===

				// Bind a new element
				MultiFile.addSlave = function (slave, slave_count) {
					//if(window.console) console.log('MultiFile.addSlave',slave_count);
					
					// Keep track of how many elements have been displayed
					MultiFile.n++;
					// Add reference to master element
					slave.MultiFile = MultiFile;

					// BUG FIX: http://plugins.jquery.com/node/1495
					// Clear identifying properties from clones
					slave.id = slave.name = '';

					// Define element's ID and name (upload components need this!)
					//slave.id = slave.id || MultiFile.generateID(slave_count);
					slave.id = MultiFile.generateID(slave_count);
					//FIX for: http://code.google.com/p/jquery-multifile-plugin/issues/detail?id=23
					//CHANGE v2.2.0 - change ID of all file elements, keep original ID in wrapper

					// 2008-Apr-29: New customizable naming convention (see url below)
					// http://groups.google.com/group/jquery-dev/browse_frm/thread/765c73e41b34f924#
					slave.name = String(MultiFile.namePattern
						/*master name*/
						.replace(/\$name/gi, $(MultiFile.clone).attr('name'))
						/*master id */
						.replace(/\$id/gi, $(MultiFile.clone).attr('id'))
						/*group count*/
						.replace(/\$g/gi, group_count) //(group_count>0?group_count:''))
						/*slave count*/
						.replace(/\$i/gi, slave_count) //(slave_count>0?slave_count:''))
					);

					// If we've reached maximum number, disable input slave
					var disable_slave;
					if ((MultiFile.max > 0) && ((MultiFile.files.length) > (MultiFile.max))) {
						slave.disabled = true;
						disable_slave = true;
					};

					// Remember most recent slave
					MultiFile.current = slave;
					
					// We'll use jQuery from now on
					slave = $(slave);

					// Clear value
					slave.val('').attr('value', '')[0].value = '';

					// Stop plugin initializing on slaves
					slave.addClass('MultiFile-applied');

					// Triggered when a file is selected
					slave.change(function (a, b, c) {
						//if(window.console) console.log('MultiFile.slave.change',slave_count);
						//if(window.console) console.log('MultiFile.slave.change',this.files);

						// Lose focus to stop IE7 firing onchange again
						$(this).blur();

						//# NEW 2014-04-14 - accept multiple file selection, HTML5
						var e = this,
								prevs = MultiFile.files || [],
								files = this.files || [{
									name: this.value,
									size: 0,
									type: ((this.value || '').match(/[^\.]+$/i) || [''])[0]
								}],
								newfs = [],
								newfs_size = 0,
								total_size = MultiFile.total_size || 0/*,
								html5_multi_mode = this.files && $(this).attr('multiple')*/
							;

						// recap
						//console.log('START '+ prevs.length + ' files @ '+ sl(total_size) +'.', prevs);

						//# Retrive value of selected file from element
						var ERROR = []; //, v = String(this.value || '');

						// make a normal array
						$.each(files, function (i, file) {
							newfs[newfs.length] = file;
						});

						//# Trigger Event! onFileSelect
						MultiFile.trigger('FileSelect', this, MultiFile, newfs);
						//# End Event!

						// validate individual files
						$.each(files, function (i, file) {

							// pop local variables out of array/file object
							var v = file.name,
									s = file.size,
									p = function(z){
										return z
											.replace('$ext', String(v.match(/[^\.]+$/i) || ''))
											.replace('$file', v.match(/[^\/\\]+$/gi))
											.replace('$size', sl(s) + ' > ' + sl(MultiFile.maxfile))
									}
							;

							// check extension
							if (MultiFile.accept && v && !v.match(MultiFile.rxAccept)) {
								ERROR[ERROR.length] = p(MultiFile.STRING.denied);
								MultiFile.trigger('FileInvalid', this, MultiFile, [file]);
							};

							// Disallow duplicates
							$(MultiFile.wrapper).find('input[type=file]').not(e).each(function(){
								// go through each file in each slave
								$.each(FILE_LIST(this), function (i, file) {
									if(file.name){
										//console.log('MultiFile.debug> Duplicate?', file.name, v);
										var x = (file.name || '').replace(/^C:\\fakepath\\/gi,'');
										if ( v == x || v == x.substr(x.length - v.length)) {
											ERROR[ERROR.length] = p(MultiFile.STRING.duplicate);
											MultiFile.trigger('FileDuplicate', e, MultiFile, [file]);
										};
									};
								});
							});

							// limit the max size of individual files selected
							if (MultiFile.maxfile>0 && s>0 && s>MultiFile.maxfile) {
								ERROR[ERROR.length] = p(MultiFile.STRING.toobig);
								MultiFile.trigger('FileTooBig', this, MultiFile, [file]);
							};

							// limit the min size of individual files selected
							if (MultiFile.minfile>0 && s>0 && s<MultiFile.minfile) {
								ERROR[ERROR.length] = p(MultiFile.STRING.toosmall);
								MultiFile.trigger('FileTooSmall', this, MultiFile, [file]);
							};

							// check extension
							var customError = MultiFile.trigger('FileValidate', this, MultiFile, [file]);
							if(customError && customError!=''){
								ERROR[ERROR.length] = p(customError);
							};
								
							// add up size of files selected
							newfs_size += file.size;

						});
						
						// add up total for all files selected (existing and new)
						total_size += newfs_size;

						// put some useful information in the file array
						newfs.size = newfs_size;
						newfs.total = total_size;
						newfs.total_length = newfs.length + prevs.length;

						// limit the number of files selected
						if (MultiFile.max>0 && prevs.length + files.length > MultiFile.max) {
							ERROR[ERROR.length] = MultiFile.STRING.toomany.replace('$max', MultiFile.max);
							MultiFile.trigger('FileTooMany', this, MultiFile, newfs);
						};
						if (MultiFile.min>0 && prevs.length + files.length < MultiFile.min) {
							ERROR[ERROR.length] = MultiFile.STRING.toofew.replace('$min', MultiFile.min);
							MultiFile.trigger('FileTooFew', this, MultiFile, newfs);
						};

						// limit the max size of files selected
						if (MultiFile.maxsize > 0 && total_size > MultiFile.maxsize) {
							ERROR[ERROR.length] = MultiFile.STRING.toomuch.replace('$size', sl(total_size) + ' > ' + sl(MultiFile.maxsize));
							MultiFile.trigger('FileTooMuch', this, MultiFile, newfs);
						};
						if (MultiFile.minsize > 0 && total_size < MultiFile.minsize) {
							ERROR[ERROR.length] = MultiFile.STRING.toolittle.replace('$size', sl(total_size) + ' < ' + sl(MultiFile.minsize));
							MultiFile.trigger('FileTooLittle', this, MultiFile, newfs);
						};

						// Create a new file input element
						var newEle = $(MultiFile.clone).clone(); // Copy parent attributes - Thanks to Jonas Wagner
						//# Let's remember which input we've generated so
						// we can disable the empty ones before submission
						// See: http://plugins.jquery.com/node/1495
						newEle.addClass('MultiFile');

						// Handle error
						if (ERROR.length > 0) {

							// Handle error
							if($.type(MultiFile.error)=='function')
								MultiFile.error(ERROR.join('\n\n'));

							// 2007-06-24: BUG FIX - Thanks to Adrian Wr骲el <adrian [dot] wrobel [at] gmail.com>
							// Ditch the trouble maker and add a fresh new element
							MultiFile.n--;
							MultiFile.addSlave(newEle[0], slave_count);
							slave.parent().prepend(newEle);
							slave.remove();
							return false;

						}
						else { // if no errors have been found

							// remember total size
							MultiFile.total_size = total_size;

							// merge arrays
							files = prevs.concat(newfs);

							// put some useful information in the file array
							files.size = total_size;
							files.size_label = sl(total_size);

							// recap
							//console.log('NOW '+ files.length + ' files @ '+ sl(total_size) +'.', files);

							// remember files
							MultiFile.files = files;

							// Hide this element (NB: display:none is evil!)
							$(this).css({
								position: 'absolute',
								top: '-3000px'
							});

							// Add new element to the form
							slave.after(newEle);

							// Bind functionality
							MultiFile.addSlave(newEle[0], slave_count + 1);

							// Update list
							MultiFile.addToList(this, slave_count, newfs);

							//# Trigger Event! afterFileSelect
							MultiFile.trigger('afterFileSelect', this, MultiFile, newfs);
							//# End Event!

						}; // no errors detected

					}); // slave.change()

					// point to wrapper
					$(slave).data('MultiFile-wrap', MultiFile.wrapper);

					// store contorl's settings and file info in wrapper
					$(MultiFile.wrapper).data('MultiFile',MultiFile);

					// disable?
					if(disable_slave) $(slave).attr('disabled','disabled').prop('disabled',true);

				}; // MultiFile.addSlave
				// Bind a new element



				// Add a new file to the list
				MultiFile.addToList = function (slave, slave_count, files) {
					//if(window.console) console.log('MultiFile.addToList',slave_count);

					//# Trigger Event! onFileAppend
					MultiFile.trigger('FileAppend', slave, MultiFile, files);
					//# End Event!
					
					var names = $('<span/>');
					$.each(files, function (i, file) {
						var v = String(file.name || '' ),
								S = MultiFile.STRING,
								n = S.label || S.file || S.name,
								t = S.title || S.tooltip || S.selected,
								p = '<img class="MultiFile-preview" style="'+ MultiFile.previewCss+'"/>',
								label =	$(
										(
											'<span class="MultiFile-label" title="' + t + '">'+
												'<span class="MultiFile-title">'+ n +'</span>'+
												(MultiFile.preview || $(slave).is('.with-preview') ? p : '' )+
											'</span>'
										)
										.replace(/\$(file|name)/gi, (v.match(/[^\/\\]+$/gi)||[v])[0])
										.replace(/\$(ext|extension|type)/gi, (v.match(/[^\.]+$/gi)||[''])[0])
										.replace(/\$(size)/gi, sl(file.size || 0))
										.replace(/\$(preview)/gi, p)
								);
						
						// now supports preview via locale string.
						// just add an <img class='MultiFile-preview'/> anywhere within the "file" string
						label.find('img.MultiFile-preview').each(function(){
							var t = this;
							var oFReader = new FileReader();
							oFReader.readAsDataURL(file);
							oFReader.onload = function (oFREvent) {
								t.src = oFREvent.target.result;
							};
						});

						// append file label to list
						if(i>1) names.append(', ');
						names.append(label);

					});

					//$.each(files, function (i, file) {
						// Create label elements
						var
							r = $('<div class="MultiFile-label"></div>'),
							b = $('<a class="MultiFile-remove" href="#' + MultiFile.wrapID + '">' + MultiFile.STRING.remove + '</a>')
								
								// ********
								// TODO:
								// refactor this as a single event listener on the control's
								// wrapper for better performance and cleaner code
								// ********
								.click(function () {

									// get list of files being removed
									var files_being_removed = FILE_LIST(slave);
									
									//# Trigger Event! onFileRemove
									MultiFile.trigger('FileRemove', slave, MultiFile, files_being_removed);
									//# End Event!

									MultiFile.n--;
									MultiFile.current.disabled = false;

									// remove the relevant <input type="file"/> element
									$(slave).remove();

									// remove the relevant label
									$(this).parent().remove();

									// Show most current element again (move into view) and clear selection
									$(MultiFile.current).css({
										position: '',
										top: ''
									});
									$(MultiFile.current).reset().val('').attr('value', '')[0].value = '';

									// point to currently visible element (always true, not necessary)
									//MultiFile.current = MultiFile.wrapper.find('[type=file]:visible');

									// rebuild array with the files that are left.
									var files_remaining = [], remain_size = 0;
									// go through each slave
									$(MultiFile.wrapper).find('input[type=file]').each(function(){
										// go through each file in each slave
										$.each(FILE_LIST(this), function (i, file) {
											if(file.name){
												//console.log('MultiFile.debug> FileRemove> remaining file', file.size, file);
												// fresh file array
												files_remaining[files_remaining.length] = file;
												// fresh size count
												remain_size += file.size;
											};
										});
									});

									// update MultiFile object
									MultiFile.files = files_remaining;
									MultiFile.total_size = remain_size;
									MultiFile.size_label = sl(remain_size);

									// update current control's reference to MultiFile object
									$(MultiFile.wrapper).data('MultiFile', MultiFile);

									//# Trigger Event! afterFileRemove
									MultiFile.trigger('afterFileRemove', slave, MultiFile, files_being_removed);
									//# End Event!

									//# Trigger Event! onFileChange
									MultiFile.trigger('FileChange', MultiFile.current, MultiFile, files_remaining);
									//# End Event!

									return false;
								});

						// Insert label
						MultiFile.list.append(
							r.append(b, ' ', names)
						);

					//}); // each file?

					//# Trigger Event! afterFileAppend
					MultiFile.trigger('afterFileAppend', slave, MultiFile, files);
					//# End Event!

					//# Trigger Event! onFileChange
					MultiFile.trigger('FileChange', slave, MultiFile, MultiFile.files);
					//# End Event!

				}; // MultiFile.addToList
				// Add element to selected files list



				// Bind functionality to the first element
				if (!MultiFile.MultiFile) MultiFile.addSlave(MultiFile.e, 0);

				// Increment control count
				//MultiFile.I++; // using window.MultiFile
				MultiFile.n++;

				// deprecated: contorl's data now stored in wrapper because it is never removed.
				// improved performance and lower memory comsumption
				// Save control to element
				//MultiFile.E.data('MultiFile', MultiFile);


				//#####################################################################
				// MAIN PLUGIN FUNCTIONALITY - END
				//#####################################################################
			}); // each element
	};

	/*--------------------------------------------------------*/

	/*
	### Core functionality and API ###
	*/
	$.extend($.fn.MultiFile, {


		/**
		 * This method exposes the all the control's data
		 *
		 * Returns an object with various settings and properties of the selected files
		 * for this particular instance of the control. stored in the control's wrapper
		 *
		 * @name data
		 * @type Object
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $('#selector').MultiFile('data');
		 */
		data: function () {
			
			// analyse this element
			var e = $(this), b = e.is('.MultiFile-wrap');
			
			// get control wrapper
			var wp = b ? e : e.data('MultiFile-wrap');
			if(!wp || !wp.length)
				return !console.error('Could not find MultiFile control wrapper');
			
			// get control data from wrapper
			var mf = wp.data('MultiFile');
			if(!mf)
				return !console.error('Could not find MultiFile data in wrapper');
			
			// return data
			return mf || {};
		},


		/**
		 * This method removes all selected files
		 *
		 * Returns a jQuery collection of all affected elements.
		 *
		 * @name reset
		 * @type jQuery
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $.fn.MultiFile.reset();
		 */
		reset: function () {
			var mf = this.MultiFile('data');
			if (mf) $(mf.list).find('a.MultiFile-remove').click();
			return $(this);
		},


		/**
		 * This method exposes the array of selected files
		 *
		 * Returns an array of file objects
		 *
		 * @name files
		 * @type Array
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $('#selector').MultiFile('files');
		 */
		files: function () {
			var mf = this.MultiFile('data');
			if(!mf) return !console.log('MultiFile plugin not initialized');
			return mf.files || [];
		},


		/**
		 * This method exposes the plugin's sum of the sizes of all files selected
		 *
		 * Returns size (in bytes) of files selected
		 *
		 * @name size
		 * @type Number
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $('#selector').MultiFile('size');
		 */
		size: function () {
			var mf = this.MultiFile('data');
			if(!mf) return !console.log('MultiFile plugin not initialized');
			return mf.total_size || 0;
		},


		/**
		 * This method exposes the plugin's tally of how many files have been selected
		 *
		 * Returns number (a count) of files selected
		 *
		 * @name count
		 * @type Number
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $('#selector').MultiFile('size');
		 */
		count: function () {
			var mf = this.MultiFile('data');
			if(!mf) return !console.log('MultiFile plugin not initialized');
			return mf.files ? mf.files.length || 0 : 0;
		},


		/**
		 * This utility makes it easy to disable all 'empty' file elements in the document before submitting a form.
		 * It marks the affected elements so they can be easily re-enabled after the form submission or validation.
		 *
		 * Returns a jQuery collection of all affected elements.
		 *
		 * @name disableEmpty
		 * @type jQuery
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $.fn.MultiFile.disableEmpty();
		 * @param String class (optional) A string specifying a class to be applied to all affected elements - Default: 'mfD'.
		 */
		disableEmpty: function (klass) {
			klass = (typeof (klass) == 'string' ? klass : '') || 'mfD';
			var o = [];
			$('input:file.MultiFile').each(function () {
				if ($(this).val() == '') o[o.length] = this;
			});

			// automatically re-enable for novice users
			window.clearTimeout($.fn.MultiFile.reEnableTimeout);
			$.fn.MultiFile.reEnableTimeout = window.setTimeout($.fn.MultiFile.reEnableEmpty, 500);
			
			return $(o).each(function () {
				this.disabled = true
			}).addClass(klass);
		},


		/**
		 * This method re-enables 'empty' file elements that were disabled (and marked) with the $.fn.MultiFile.disableEmpty method.
		 *
		 * Returns a jQuery collection of all affected elements.
		 *
		 * @name reEnableEmpty
		 * @type jQuery
		 * @cat Plugins/MultiFile
		 * @author Diego A. (http://www.fyneworks.com/)
		 *
		 * @example $.fn.MultiFile.reEnableEmpty();
		 * @param String klass (optional) A string specifying the class that was used to mark affected elements - Default: 'mfD'.
		 */
		reEnableEmpty: function (klass) {
			klass = (typeof (klass) == 'string' ? klass : '') || 'mfD';
			return $('input:file.' + klass).removeClass(klass).each(function () {
				this.disabled = false
			});
		},


		/**
		* This method will intercept other jQuery plugins and disable empty file input elements prior to form submission
		*

		* @name intercept
		* @cat Plugins/MultiFile
		* @author Diego A. (http://www.fyneworks.com/)
		*
		* @example $.fn.MultiFile.intercept();
		* @param Array methods (optional) Array of method names to be intercepted
		*/
		intercepted: {},
		intercept: function (methods, context, args) {
			var method, value;
			args = args || [];
			if (args.constructor.toString().indexOf("Array") < 0) args = [args];
			if (typeof (methods) == 'function') {
				$.fn.MultiFile.disableEmpty();
				value = methods.apply(context || window, args);
				//SEE-http://code.google.com/p/jquery-multifile-plugin/issues/detail?id=27
				setTimeout(function () {
					$.fn.MultiFile.reEnableEmpty()
				}, 1000);
				return value;
			};
			if (methods.constructor.toString().indexOf("Array") < 0) methods = [methods];
			for (var i = 0; i < methods.length; i++) {
				method = methods[i] + ''; // make sure that we have a STRING
				if (method)(function (method) { // make sure that method is ISOLATED for the interception
					$.fn.MultiFile.intercepted[method] = $.fn[method] || function () {};
					$.fn[method] = function () {
						$.fn.MultiFile.disableEmpty();
						value = $.fn.MultiFile.intercepted[method].apply(this, arguments);
						//SEE http://code.google.com/p/jquery-multifile-plugin/issues/detail?id=27
						setTimeout(function () {
							$.fn.MultiFile.reEnableEmpty()
						}, 1000);
						return value;
					}; // interception
				})(method); // MAKE SURE THAT method IS ISOLATED for the interception
			}; // for each method
		} // $.fn.MultiFile.intercept

	});

	/*--------------------------------------------------------*/

	/*
	### Default Settings ###
	eg.: You can override default control like this:
	$.fn.MultiFile.options.accept = 'gif|jpg';
	*/
	$.fn.MultiFile.options = { //$.extend($.fn.MultiFile, { options: {
		accept: '', // accepted file extensions
		max: -1, // maximum number of selectable files
		maxfile: -1, // maximum size of a single file
		maxsize: -1, // maximum size of entire payload
		
		minfile: -1, // minimum size of a single file
		minsize: -1, // minimum size of entire payload

		// name to use for newly created elements
		namePattern: '$name', // same name by default (which creates an array)
		/*master name*/ // use $name
		/*master id */ // use $id
		/*group count*/ // use $g
		/*slave count*/ // use $i
		/*other	 */ // use any combination of he above, eg.: $name_file$i

		// previews
		preview: false,
		previewCss: 'max-height:100px; max-width:100px;',

		// STRING: collection lets you show messages in different languages
		STRING: {
			remove: 'x',
			denied: 'You cannot select a $ext file.\nTry again...',
			file: '$file',
			selected: 'File selected: $file',
			duplicate: 'This file has already been selected:\n$file',
			toomuch: 'The files selected exceed the maximum size permited ($size)',
			toolittle: 'The files do not reach the minimum size required ($size)',
			toomany: 'Too many files selected (max: $max)',
			toofew: 'Too few files selected (min: $max)',
			toobig: '$file is too big (max $size)',
			toosmall: '$file is too small (min $size)'
		},

		// name of methods that should be automcatically intercepted so the plugin can disable
		// extra file elements that are empty before execution and automatically re-enable them afterwards
		autoIntercept: ['submit', 'ajaxSubmit', 'ajaxForm', 'validate', 'valid' /* array of methods to intercept */ ],

		// error handling function
		error: function (s) {

			if(typeof console != 'undefined') console.log(s);

			// TODO: add various dialog handlers here?
			alert(s);
		}
	}; //} });

	/*--------------------------------------------------------*/

	/*
	### Additional Methods ###
	Required functionality outside the plugin's scope
	*/

	// Native input reset method - because this alone doesn't always work: $(element).val('').attr('value', '')[0].value = '';
	$.fn.reset = $.fn.reset || function () {
		return this.each(function () {
			try {
				this.reset();
			} catch (e) {}
		});
	};

	/*--------------------------------------------------------*/

	/*
	### Default implementation ###
	The plugin will attach itself to file inputs
	with the class 'multi' when the page loads
	*/
	$(function () {
		//$("input:file.multi").MultiFile();
		$("input[type=file].multi").MultiFile();
	});



	/*# AVOID COLLISIONS #*/
})(jQuery);
/*# AVOID COLLISIONS #*/
;
///<jscompress sourcefile="jquery.validate.js" />
/**
 * jQuery Validation Plugin @VERSION
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2011 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr('novalidate', 'novalidate');

		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator);

		if ( validator.settings.onsubmit ) {

			var inputsAndButtons = this.find("input, button");

			// allow suppresing validation by adding a cancel class to the submit button
			inputsAndButtons.filter(".cancel").click(function () {
				validator.cancelSubmit = true;
			});

			// when a submitHandler is used, capture the submitting button
			if (validator.settings.submitHandler) {
				inputsAndButtons.filter(":submit").click(function () {
					validator.submitButton = this;
				});
			}

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();

				function handle() {
					if ( validator.settings.submitHandler ) {
						if (validator.submitButton) {
							// insert a hidden input as a replacement for the missing submit button
							var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm );
						if (validator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
				valid &= validator.element(this);
            });
            return valid;
        }
    },
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];

		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages)
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function(source, params) {
	if ( arguments.length == 1 )
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: "",
		ignoreTitle: false,
		onfocusin: function(element, event) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function(element, event) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element, event) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function(element, event) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted )
				this.element(element);
			// or option elements, check parent select in that case
			else if (element.parentNode.name in this.submitted)
				this.element(element.parentNode);
		},
		highlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				validator.settings[eventType] && validator.settings[eventType].call(validator, this[0], event);
			}
			$(this.currentForm)
			       .validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, " +
						"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
						"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], " +
						"[type='range'], [type='color'] ",
						"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if (this.settings.invalidHandler)
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid())
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element );
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm )
				$( this.currentForm ).resetForm();
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj )
				count++;
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() == 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
					return false;

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[0];
		},

		errors: function() {
			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {
					var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result == "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result == "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method", e);
					throw e;
				}
			}
			if (dependencyMismatch)
				return;
			if ( this.objectLength(rules) )
				this.successList.push(element);
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata)
				return;

			var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();

			return meta && meta.messages && meta.messages[method];
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},

		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message == "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			return toToggle;
		},

		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

				// check if we have a generated label, replace the message then
				label.attr("generated") && label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(label, $(element) )
						: label.insertAfter(element);
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.addClass( this.settings.success )
					: this.settings.success( label );
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function(element) {
			var name = this.idOrName(element);
    		return this.errors().filter(function() {
				return $(this).attr('for') == name;
			});
		},

		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function(element) {
			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},

		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element.name == name && element  || null;
			});
		},

		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},

		depend: function(param, element) {
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},

		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},

		optional: function(element) {
			return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
		},

		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0)
				this.pendingRequest = 0;
			delete this.pending[element.name];
			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		dateDE: {dateDE: true},
		number: {number: true},
		numberDE: {numberDE: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function(className, rules) {
		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},

	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		classes && $.each(classes.split(' '), function() {
			if (this in $.validator.classRuleSettings) {
				$.extend(rules, $.validator.classRuleSettings[this]);
			}
		});
		return rules;
	},

	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (var method in $.validator.methods) {
			var value;
			// If .prop exists (jQuery >= 1.6), use it to get true/false for required
			if (method === 'required' && typeof $.fn.prop === 'function') {
				value = $element.prop(method);
			} else {
				value = $element.attr(method);
			}
			if (value) {
				rules[method] = value;
			} else if ($element[0].getAttribute("type") === method) {
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}

		return rules;
	},

	metadataRules: function(element) {
		if (!$.metadata) return {};

		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},

	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});

		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			case 'input':
				if ( this.checkable(element) )
					return this.getLength(value, element) > 0;
			default:
				return $.trim(value).length > 0;
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return "dependency-mismatch";

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] )
				this.settings.messages[element.name] = {};
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param == "string" && {url:param} || param;

			if ( this.pending[element.name] ) {
				return "pending";
			}
			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function(response) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true;
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function(value, element) {
			if ( this.optional(element) )
				return "dependency-mismatch";
			// accept only spaces, digits and dashes
			if (/[^0-9 -]+/.test(value))
				return false;
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				var nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) == 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
				$(element).valid();
			});
			return value == target.val();
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
;(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
			var port = settings.port;
			if (settings.mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
;(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					arguments[0] = $.event.fix(e);
					arguments[0].type = fix;
					return $.event.handle.apply(this, arguments);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	};
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
})(jQuery);
;
///<jscompress sourcefile="messages_zh.js" />
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
$.extend($.validator.messages, {
	required: "这是必填字段",
	remote: "请修正此字段",
	email: "请输入有效的电子邮件地址",
	url: "请输入有效的网址",
	date: "请输入有效的日期",
	dateISO: "请输入有效的日期 (YYYY-MM-DD)",
	number: "请输入有效的数字",
	digits: "只能输入数字",
	creditcard: "请输入有效的信用卡号码",
	equalTo: "你的输入不相同",
	extension: "请输入有效的后缀",
	maxlength: $.validator.format("最多可以输入 {0} 个字符"),
	minlength: $.validator.format("最少要输入 {0} 个字符"),
	rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
	range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
	max: $.validator.format("请输入不大于 {0} 的数值"),
	min: $.validator.format("请输入不小于 {0} 的数值")
});

}));;
///<jscompress sourcefile="additional-methods.js" />
(function() {
		
	function stripHtml(value) {
		// remove html tags and space chars
		return value.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
		// remove numbers and punctuation
		.replace(/[0-9.(),;:!?%#$'"_+=\/-]*/g,'');
	}
	jQuery.validator.addMethod("maxWords", function(value, element, params) {
	    return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length < params;
	}, jQuery.validator.format("Please enter {0} words or less."));

	jQuery.validator.addMethod("minWords", function(value, element, params) {
	    return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
	}, jQuery.validator.format("Please enter at least {0} words."));

	jQuery.validator.addMethod("rangeWords", function(value, element, params) {
	    return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params[0] && value.match(/bw+b/g).length < params[1];
	}, jQuery.validator.format("Please enter between {0} and {1} words."));

})();

jQuery.validator.setDefaults({ 
	errorContainer: $('#errorMsgWin')
});

jQuery.validator.addMethod("letterswithbasicpunc", function(value, element) {
	return this.optional(element) || /^[a-z-.,()'\"\s]+$/i.test(value);
}, "Letters or punctuation only please");

jQuery.validator.addMethod("alphanumeric", function(value, element) {
	return this.optional(element) || /^\w+$/i.test(value);
}, "只能输入字母和数字");

jQuery.validator.addMethod("lettersonly", function(value, element) {
	return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");

jQuery.validator.addMethod("nowhitespace", function(value, element) {
	return this.optional(element) || /^\S+$/i.test(value);
}, "No white space please");

jQuery.validator.addMethod("ziprange", function(value, element) {
	return this.optional(element) || /^90[2-5]\d\{2}-\d{4}$/.test(value);
}, "Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx");

jQuery.validator.addMethod("integer", function(value, element) {
	return this.optional(element) || /^-?\d+$/.test(value);
}, "A positive or negative non-decimal number please");

/**
* Return true, if the value is a valid vehicle identification number (VIN).
*
* Works with all kind of text inputs.
*
* @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
* @desc Declares a required input element whose value must be a valid vehicle identification number.
*
* @name jQuery.validator.methods.vinUS
* @type Boolean
* @cat Plugins/Validate/Methods
*/
jQuery.validator.addMethod(
	"vinUS",
	function(v){
		if (v.length != 17)
			return false;
		var i, n, d, f, cd, cdv;
		var LL    = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","U","V","W","X","Y","Z"];
		var VL    = [1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9];
		var FL    = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
		var rs    = 0;
		for(i = 0; i < 17; i++){
		    f = FL[i];
		    d = v.slice(i,i+1);
		    if(i == 8){
		        cdv = d;
		    }
		    if(!isNaN(d)){
		        d *= f;
		    }
		    else{
		        for(n = 0; n < LL.length; n++){
		            if(d.toUpperCase() === LL[n]){
		                d = VL[n];
		                d *= f;
		                if(isNaN(cdv) && n == 8){
		                    cdv = LL[n];
		                }
		                break;
		            }
		        }
		    }
		    rs += d;
		}
		cd = rs % 11;
		if(cd == 10){cd = "X";}
		if(cd == cdv){return true;}
		return false;
	},
	"The specified vehicle identification number (VIN) is invalid."
);

/**
  * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
  *
  * @example jQuery.validator.methods.date("01/01/1900")
  * @result true
  *
  * @example jQuery.validator.methods.date("01/13/1990")
  * @result false
  *
  * @example jQuery.validator.methods.date("01.01.1900")
  * @result false
  *
  * @example <input name="pippo" class="{dateITA:true}" />
  * @desc Declares an optional input element whose value must be a valid date.
  *
  * @name jQuery.validator.methods.dateITA
  * @type Boolean
  * @cat Plugins/Validate/Methods
  */
jQuery.validator.addMethod(
	"dateITA",
	function(value, element) {
		var check = false;
		var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
		if( re.test(value)){
			var adata = value.split('/');
			var gg = parseInt(adata[0],10);
			var mm = parseInt(adata[1],10);
			var aaaa = parseInt(adata[2],10);
			var xdata = new Date(aaaa,mm-1,gg);
			if ( ( xdata.getFullYear() == aaaa ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == gg ) )
				check = true;
			else
				check = false;
		} else
			check = false;
		return this.optional(element) || check;
	},
	"Please enter a correct date"
);

jQuery.validator.addMethod("dateNL", function(value, element) {
		return this.optional(element) || /^\d\d?[\.\/-]\d\d?[\.\/-]\d\d\d?\d?$/.test(value);
	}, "Vul hier een geldige datum in."
);

jQuery.validator.addMethod("time", function(value, element) {
	return this.optional(element) || /^([01]\d|2[0-3])(:[0-5]\d){0,2}$/.test(value);
}, "Please enter a valid time, between 00:00 and 23:59");
jQuery.validator.addMethod("time12h", function(value, element) {
	return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){0,2}(\ [AP]M))$/i.test(value);
}, "Please enter a valid time, between 00:00 am and 12:00 pm");

/**
 * matches US phone number format
 *
 * where the area code may not start with 1 and the prefix may not start with 1
 * allows '-' or ' ' as a separator and allows parens around area code
 * some people may want to put a '1' in front of their number
 *
 * 1(212)-999-2345
 * or
 * 212 999 2344
 * or
 * 212-999-0983
 *
 * but not
 * 111-123-5434
 * and not
 * 212 123 4567
 */
jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
	return this.optional(element) || phone_number.length > 9 &&
		phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");

jQuery.validator.addMethod('phoneUK', function(phone_number, element) {
return this.optional(element) || phone_number.length > 9 &&
phone_number.match(/^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/);
}, 'Please specify a valid phone number');

jQuery.validator.addMethod('mobileUK', function(phone_number, element) {
return this.optional(element) || phone_number.length > 9 &&
phone_number.match(/^((0|\+44)7(5|6|7|8|9){1}\d{2}\s?\d{6})$/);
}, 'Please specify a valid mobile number');

// TODO check if value starts with <, otherwise don't try stripping anything
jQuery.validator.addMethod("strippedminlength", function(value, element, param) {
	return jQuery(value).text().length >= param;
}, jQuery.validator.format("Please enter at least {0} characters"));

// same as email, but TLD is optional
jQuery.validator.addMethod("email2", function(value, element, param) {
	return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
}, jQuery.validator.messages.email);

// same as url, but TLD is optional
jQuery.validator.addMethod("url2", function(value, element, param) {
	return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}, '请输入一个有效的url地址');

function isUrlAddress(str_url){
	var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
	+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
	+ "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
	+ "|" // 允许IP和DOMAIN（域名）
	+ "([0-9a-z_!~*'()-]+.)*" // 域名- www.
	+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
	+ "[a-z]{2,6})" // first level domain- .com or .museum
	+ "(:[0-9]{1,4})?" // 端口- :80
	+ "((/?)|" // a slash isn't required if there is no file name
	+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
	var re=new RegExp(strRegex);
	if (re.test(str_url)){
		return (true);
	}else{
		return (false);
	}
}

jQuery.validator.addMethod("url3", function(value, element) {
	return this.optional(element) || isUrlAddress(value);
	}, '请输入一个有效的url地址');

// NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
// Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
// Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
jQuery.validator.addMethod("creditcardtypes", function(value, element, param) {

	if (/[^0-9-]+/.test(value))
		return false;

	value = value.replace(/\D/g, "");

	var validTypes = 0x0000;

	if (param.mastercard)
		validTypes |= 0x0001;
	if (param.visa)
		validTypes |= 0x0002;
	if (param.amex)
		validTypes |= 0x0004;
	if (param.dinersclub)
		validTypes |= 0x0008;
	if (param.enroute)
		validTypes |= 0x0010;
	if (param.discover)
		validTypes |= 0x0020;
	if (param.jcb)
		validTypes |= 0x0040;
	if (param.unknown)
		validTypes |= 0x0080;
	if (param.all)
		validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;

	if (validTypes & 0x0001 && /^(51|52|53|54|55)/.test(value)) { //mastercard
		return value.length == 16;
	}
	if (validTypes & 0x0002 && /^(4)/.test(value)) { //visa
		return value.length == 16;
	}
	if (validTypes & 0x0004 && /^(34|37)/.test(value)) { //amex
		return value.length == 15;
	}
	if (validTypes & 0x0008 && /^(300|301|302|303|304|305|36|38)/.test(value)) { //dinersclub
		return value.length == 14;
	}
	if (validTypes & 0x0010 && /^(2014|2149)/.test(value)) { //enroute
		return value.length == 15;
	}
	if (validTypes & 0x0020 && /^(6011)/.test(value)) { //discover
		return value.length == 16;
	}
	if (validTypes & 0x0040 && /^(3)/.test(value)) { //jcb
		return value.length == 16;
	}
	if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) { //jcb
		return value.length == 15;
	}
	if (validTypes & 0x0080) { //unknown
		return true;
	}
	return false;
}, "Please enter a valid credit card number.");

jQuery.validator.addMethod("ipv4", function(value, element, param) {
    return this.optional(element) || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i.test(value);
}, "Please enter a valid IP v4 address.");

jQuery.validator.addMethod("ipv6", function(value, element, param) {
    return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
}, "Please enter a valid IP v6 address.");

/**
  * Return true if the field value matches the given format RegExp
  *
  * @example jQuery.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
  * @result true
  *
  * @example jQuery.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
  * @result false
  *
  * @name jQuery.validator.methods.pattern
  * @type Boolean
  * @cat Plugins/Validate/Methods
  */
jQuery.validator.addMethod("pattern", function(value, element, param) {
    return this.optional(element) || param.test(value);
}, "Invalid format.");

/** 
* 身份证号码验证
*/
function isIdCardNo(num) {
var factorArr = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
//var error;
var varArray = new Array();
var intValue;
var lngProduct = 0;
var intCheckDigit;
var intStrLen = num.length;
var idNumber = num;
   // initialize
     //if ((intStrLen != 15) && (intStrLen != 18)) {
         //error = "输入身份证号码长度不对！";
         //alert(error);
         //frmAddUser.txtIDCard.focus();
     //   return false;
     //}
     if(intStrLen != 18) {
    	 error = "输入身份证号码长度不对！";
    	 return false;
     }
     // check and set value
     for(i=0;i<intStrLen;i++) {
         varArray[i] = idNumber.charAt(i);
         if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
             //error = "错误的身份证号码！.";
             //alert(error);
             //frmAddUser.txtIDCard.focus();
             return false;
         } else if (i < 17) {
             varArray[i] = varArray[i]*factorArr[i];
         }
     }
     if (intStrLen == 18) {
         //check date
         var date8 = idNumber.substring(6,14);
         if (isDate8(date8) == false) {
             //error = "身份证中日期信息不正确！.";
             //alert(error);
             return false;
         }
         // calculate the sum of the products
         for(i=0;i<17;i++) {
             lngProduct = lngProduct + varArray[i];
         }
         // calculate the check digit
         intCheckDigit = 12 - lngProduct % 11;
         switch (intCheckDigit) {
             case 10:
                 intCheckDigit = 'X';
                 break;
             case 11:
                 intCheckDigit = 0;
                 break;
             case 12:
                 intCheckDigit = 1;
                 break;
         }
         // check last digit
         if (varArray[17].toUpperCase() != intCheckDigit) {
             //error = "身份证效验位错误!正确为： " + intCheckDigit + ".";
             //alert(error);
             return false;
         }
     }
     else{
		 //length is 15
         //check date
         var date6 = idNumber.substring(6,12);
         if (isDate6(date6) == false) {
             //alert("身份证日期信息有误！.");
             return false;
         }
     }
     //alert ("Correct.");
     return true;
}

/**
* 判断是否为“YYYYMM”式的时期
*
*/
function isDate6(sDate) {
	if(!/^[0-9]{6}$/.test(sDate)) {
	  return false;
	}
	var year, month, day;
	year = sDate.substring(0, 4);
	month = sDate.substring(4, 6);
	if (year < 1900 || year > 2100) return false
	if (month < 1 || month > 12) return false 
	return true;
} 
/**
* 判断是否为“YYYYMMDD”式的时期
*
*/
function isDate8(sDate) {
	if(!/^[0-9]{8}$/.test(sDate)) {
	  return false;
	}
	var year, month, day;
	year = sDate.substring(0, 4);
	month = sDate.substring(4, 6);
	day = sDate.substring(6, 8);
	var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
	if (year < 1900 || year > 2100){
		return false;
	}
	if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;
	if (month < 1 || month > 12) {
		return false;
	}
	if (day < 1 || day > iaMonthDays[month - 1]) {
		return false;
	}
	return true;
} 

function isDate9(sDate) {
	if(!/^[1-2]{1}[0-9]{3}\-[0-1]{1}[1-9]{1}$/.test(sDate)) {
	  return false;
	}
	var year, month, day;
	year = sDate.substring(0, 4);
	month = sDate.substring(5, 7);
	if (year < 1900 || year > 2100) return false
	if (month < 1 || month > 12) return false 
	return true;
} 

// 字符验证 
jQuery.validator.addMethod("stringCheck", function(value, element) {
    return this.optional(element) || /^\w+$/.test(value);
}, "只能包括英文字母、数字和下划线"); 

jQuery.validator.addMethod("stringCheck1", function(value, element) {
    return this.optional(element) || /^[A-Za-z0-9]+$/.test(value);
}, "只能包括英文字母、数字"); 

jQuery.validator.addMethod("stringCheck2", function(value, element) {
	return this.optional(element) || /^[A-Za-z0-9_.]+$/.test(value);
}, "只能包括英文字母、数字、.和下划线"); 

jQuery.validator.addMethod("stringCheck3", function(value, element) {
	return this.optional(element) || /^[A-Za-z0-9_.\s]+$/.test(value);
}, "只能包括英文字母、数字、下划线、.和空格"); 

//中文字符串
jQuery.validator.addMethod("cnString", function(value, element) {
    return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
}, "只能输入中文字符串"); 

// 手机号码验证 
jQuery.validator.addMethod("mobile", function(value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
}, "请正确填写您的手机号码");

// 电话号码验证 
jQuery.validator.addMethod("phone", function(value, element) {
    var tel = /^((^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(^[0-9]{3,4}\-[0-9]{3,8}\-[0-9]{2,5}$))$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写您的电话号码");

// 邮政编码验证 
jQuery.validator.addMethod("zipCode", function(value, element) {
    var tel = /^[0-9]{6}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写您的邮政编码"); 

// 中文字两个字节        
jQuery.validator.addMethod("byteRangeLength", function(value, element, param) { 
	var length = value.length;          
	for(var i = 0; i < value.length; i++){ 
		if(value.charCodeAt(i) > 127){ 
			length++;            
		}       
	}
	return this.optional(element) || ( length >= param[0] && length <= param[1] );       
}, "请确保输入的值在3-15个字节之间(一个中文字算2个字节)"); 

// 身份证号码验证        
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
	return this.optional(element) || isIdCardNo(value);        
}, "请正确输入您的身份证号码");  

//大于
jQuery.validator.addMethod("greaterTo", function(value, element, param) {    
    return this.optional(element) || (Number(value) > Number($(param).val()));
}, "输入的最大值必须大于最小值");

//不等于
jQuery.validator.addMethod("notEqualTo", function(value, element, param) {    
	return value != $(param).val();
}, "输入的两个值不应该相同");

//以指定字符开始
jQuery.validator.addMethod("startWith", function(value, element, param) {
	return this.optional(element) || value.match(new RegExp("^" + param, "i"));   
}, "必须以指定字符开始");

jQuery.validator.addMethod("float", function(value, element) {
	return this.optional(element) || /^\d{1,4}(\.\d{1,2}){0,1}$/.test(value);   
}, "格式错误，只能输入整数或小数，最多两位小数<br/>");

$.validator.addMethod("checkboxLeastOne", function(value, elem, param) {
    return $("input[type='checkbox'][name='" + param+ "']:checked").length > 0;
},"您必须至少选择一项!");

//计算中英文混合字符串长度
function getFullLength(str){
    var totalCount = 0; 
    for (var i=0; i<str.length; i++) { 
        var c = str.charCodeAt(i); 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
             totalCount++; 
         }else {     
             totalCount+=2; 
         } 
     }
    return totalCount;
}

$.validator.addMethod("maxFullLen", function(value, elem, param) {
	return this.optional(elem) || (getFullLength(value) <= param);        
}, "长度超过限制");

//工作流定时任务开始时间验证
jQuery.validator.addMethod("timePattern", function(value, element, param) {
	var type = $(param).val();
	var reg;
	if(type == '1') {
		reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/;
	}else if(type == '2') {
		reg = /^(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/;
	}else if(type == '3') {
		reg = /^([1-7]):(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/;
	}else if(type == '4') {
		reg = /^((0[1-9])|([1-2][0-9])|30|31):(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/;
	}else if(type == '5') {
		reg = /^((0[1-9])|1[0-2]):(0\d{1}|1\d{1}|2[0-3]):[0-5]\d{1}:([0-5]\d{1})$/;
	}
    return (this.optional(element) || reg.test(value));
}, "输入的数据格式错误");

$.validator.addMethod("equalLength", function(value, elem, param) {
	return this.optional(elem) || (getFullLength(value) == param);        
}, "长度不符合要求");;
///<jscompress sourcefile="jquery.pagination.js" />
/**
 * pagination分页插件
 * @version 1.3.1
 * @author mss
 * @url http://maxiaoxiang.com/jQuery-plugins/plugins/pagination.html
 *
 * @调用方法
 * $(selector).pagination();
 */
;(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define([ "jquery" ],factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
}(function ($) {

	//配置参数
	var defaults = {
		totalData: 0,			//数据总条数
		showData: 0,			//每页显示的条数
		pageCount: 9,			//总页数,默认为9
		current: 1,				//当前第几页
		prevCls: 'prev',		//上一页class
		nextCls: 'next',		//下一页class
		prevContent: '上一页',		//上一页内容
		nextContent: '下一页',		//下一页内容
		activeCls: 'active',	//当前页选中状态
		coping: false,			//首页和尾页
		isHide: false,			//当前页数为0页或者1页时不显示分页
		homePage: '首页',			//首页节点内容
		endPage: '末页',			//尾页节点内容
		keepShowPN: false,		//是否一直显示上一页下一页
		count: 1,				//当前页前后分页个数
		jump: false,			//跳转到指定页数
		jumpIptCls: 'jump-ipt',	//文本框内容
		jumpBtnCls: 'jump-btn',	//跳转按钮
		jumpBtn: '跳转',		//跳转按钮文本
		callback: function(){}	//回调
	};

	var Pagination = function(element,options){
		//全局变量
		var opts = options,//配置
			current,//当前页
			$document = $(document),
			$obj = $(element);//容器

		/**
		 * 设置总页数
		 * @param int page 页码
		 * @return opts.pageCount 总页数配置
		 */
		this.setPageCount = function(page){
			return opts.pageCount = page;
		};

		/**
		 * 获取总页数
		 * 如果配置了总条数和每页显示条数，将会自动计算总页数并略过总页数配置，反之
		 * @return int p 总页数
		 */
		this.getPageCount = function(){
			return opts.totalData || opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
		};

		/**
		 * 获取当前页
		 * @return int current 当前第几页
		 */
		this.getCurrent = function(){
			return current;
		};

		/**
		 * 填充数据
		 * @param int index 页码
		 */
		this.filling = function(index){
			var html = '';
			current = index || opts.current;//当前页码
			var pageCount = this.getPageCount();//获取的总页数
			if(opts.keepShowPN || current > 1){//上一页
				html += '<a href="javascript:;" class="'+opts.prevCls+'">'+opts.prevContent+'</a>';
			}else{
				if(opts.keepShowPN == false){
					$obj.find('.'+opts.prevCls) && $obj.find('.'+opts.prevCls).remove();
				}
			}
			if(current >= opts.count + 2 && current != 1 && pageCount != opts.count){
				var home = opts.coping && opts.homePage ? opts.homePage : '1';
				html += opts.coping ? '<a href="javascript:;" data-page="1">'+home+'</a><span>...</span>' : '';
			}
			var end = current + opts.count;
			var start = '';
			//修复到最后一页时比第一页少显示两页
			start = current === pageCount ? current - opts.count - 2 : current - opts.count;
			((start > 1 && current < opts.count) || current == 1) && end++;
			(current > pageCount - opts.count && current >= pageCount) && start++;
			for (;start <= end; start++) {
				if(start <= pageCount && start >= 1){
					if(start != current){
						html += '<a href="javascript:;" data-page="'+start+'">'+ start +'</a>';
					}else{
						html += '<span class="'+opts.activeCls+'">'+start+'</span>';
					}
				}
			}
			if(current + opts.count < pageCount && current >= 1 && pageCount > opts.count){
				var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
				html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
			}
			if(opts.keepShowPN || current < pageCount){//下一页
				html += '<a href="javascript:;" class="'+opts.nextCls+'">'+opts.nextContent+'</a>'
			}else{
				if(opts.keepShowPN == false){
					$obj.find('.'+opts.nextCls) && $obj.find('.'+opts.nextCls).remove();
				}
			}
			html += opts.jump ? '<input type="text" class="'+opts.jumpIptCls+'"><a href="javascript:;" class="'+opts.jumpBtnCls+'">'+opts.jumpBtn+'</a>' : '';
			$obj.empty().html(html);
		};

		//绑定事件
		this.eventBind = function(){
			var that = this;
			var pageCount = that.getPageCount();//总页数
			var index = 1;
			$obj.off().on('click','a',function(){
				if($(this).hasClass(opts.nextCls)){
					if($obj.find('.'+opts.activeCls).text() >= pageCount){
						$(this).addClass('disabled');
						return false;
					}else{
						index = parseInt($obj.find('.'+opts.activeCls).text()) + 1;
					}
				}else if($(this).hasClass(opts.prevCls)){
					if($obj.find('.'+opts.activeCls).text() <= 1){
						$(this).addClass('disabled');
						return false;
					}else{
						index = parseInt($obj.find('.'+opts.activeCls).text()) - 1;
					}
				}else if($(this).hasClass(opts.jumpBtnCls)){
					if($obj.find('.'+opts.jumpIptCls).val() !== ''){
						index = parseInt($obj.find('.'+opts.jumpIptCls).val());
					}else{
						return;
					}
				}else{
					index = parseInt($(this).data('page'));
				}
				that.filling(index);
				typeof opts.callback === 'function' && opts.callback(that.getCurrent(),that);
			});
			//输入跳转的页码
			$obj.on('input propertychange','.'+opts.jumpIptCls,function(){
				var $this = $(this);
				var val = $this.val();
				var reg = /[^\d]/g;
	            if (reg.test(val)) {
	                $this.val(val.replace(reg, ''));
	            }
	            (parseInt(val) > pageCount) && $this.val(pageCount);
	            if(parseInt(val) === 0){//最小值为1
	            	$this.val(1);
	            }
			});
			//回车跳转指定页码
			$document.keydown(function(e){
		        if(e.keyCode == 13 && $obj.find('.'+opts.jumpIptCls).val()){
		        	var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
		            that.filling(index);
					typeof opts.callback === 'function' && opts.callback(that.getCurrent(),that);
		        }
		    });
		};

		//初始化
		this.init = function(){
			this.filling(opts.current);
			this.eventBind();
			//if(opts.isHide && this.getPageCount() == '1' || this.getPageCount() == '0') $obj.hide();
		};
		this.init();
	};

	$.fn.paginationM = function(parameter,callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var pagination = new Pagination(this, options);
			callback(pagination.getCurrent(),pagination);
		});
	};

}));;
///<jscompress sourcefile="layer.js" />
/*! layer-v3.0.3 Web弹层组件 MIT License  http://layer.layui.com/  By 贤心 */
 ;!function(e,t){"use strict";var i,n,a=e.layui&&layui.define,o={getPath:function(){var e=document.scripts,t=e[e.length-1],i=t.src;if(!t.getAttribute("merge"))return i.substring(0,i.lastIndexOf("/")+1)}(),config:{},end:{},minIndex:0,minLeft:[],btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],type:["dialog","page","iframe","loading","tips"]},r={v:"3.0.3",ie:function(){var t=navigator.userAgent.toLowerCase();return!!(e.ActiveXObject||"ActiveXObject"in e)&&((t.match(/msie\s(\d+)/)||[])[1]||"11")}(),index:e.layer&&e.layer.v?1e5:0,path:o.getPath,config:function(e,t){return e=e||{},r.cache=o.config=i.extend({},o.config,e),r.path=o.config.path||r.path,"string"==typeof e.extend&&(e.extend=[e.extend]),o.config.path&&r.ready(),e.extend?(a?layui.addcss("modules/layer/"+e.extend):r.link("skin/"+e.extend),this):this},link:function(t,n,a){if(r.path){var o=i("head")[0],s=document.createElement("link");"string"==typeof n&&(a=n);var l=(a||t).replace(/\.|\//g,""),f="layuicss-"+l,c=0;s.rel="stylesheet",s.href=r.path+t,s.id=f,i("#"+f)[0]||o.appendChild(s),"function"==typeof n&&!function u(){return++c>80?e.console&&console.error("layer.css: Invalid"):void(1989===parseInt(i("#"+f).css("width"))?n():setTimeout(u,100))}()}},ready:function(e){var t="skinlayercss",i="303";return a?layui.addcss("modules/layer/default/layer.css?v="+r.v+i,e,t):r.link("skin/default/layer.css?v="+r.v+i,e,t),this},alert:function(e,t,n){var a="function"==typeof t;return a&&(n=t),r.open(i.extend({content:e,yes:n},a?{}:t))},confirm:function(e,t,n,a){var s="function"==typeof t;return s&&(a=n,n=t),r.open(i.extend({content:e,btn:o.btn,yes:n,btn2:a},s?{}:t))},msg:function(e,n,a){var s="function"==typeof n,f=o.config.skin,c=(f?f+" "+f+"-msg":"")||"layui-layer-msg",u=l.anim.length-1;return s&&(a=n),r.open(i.extend({content:e,time:3e3,shade:!1,skin:c,title:!1,closeBtn:!1,btn:!1,resize:!1,end:a},s&&!o.config.skin?{skin:c+" layui-layer-hui",anim:u}:function(){return n=n||{},(n.icon===-1||n.icon===t&&!o.config.skin)&&(n.skin=c+" "+(n.skin||"layui-layer-hui")),n}()))},load:function(e,t){return r.open(i.extend({type:3,icon:e||0,resize:!1,shade:.01},t))},tips:function(e,t,n){return r.open(i.extend({type:4,content:[e,t],closeBtn:!1,time:3e3,shade:!1,resize:!1,fixed:!1,maxWidth:210},n))}},s=function(e){var t=this;t.index=++r.index,t.config=i.extend({},t.config,o.config,e),document.body?t.creat():setTimeout(function(){t.creat()},30)};s.pt=s.prototype;var l=["layui-layer",".layui-layer-title",".layui-layer-main",".layui-layer-dialog","layui-layer-iframe","layui-layer-content","layui-layer-btn","layui-layer-close"];l.anim=["layer-anim","layer-anim-01","layer-anim-02","layer-anim-03","layer-anim-04","layer-anim-05","layer-anim-06"],s.pt.config={type:0,shade:.3,fixed:!0,move:l[1],title:"&#x4FE1;&#x606F;",offset:"auto",area:"auto",closeBtn:1,time:0,zIndex:19891014,maxWidth:360,anim:0,isOutAnim:!0,icon:-1,moveType:1,resize:!0,scrollbar:!0,tips:2},s.pt.vessel=function(e,t){var n=this,a=n.index,r=n.config,s=r.zIndex+a,f="object"==typeof r.title,c=r.maxmin&&(1===r.type||2===r.type),u=r.title?'<div class="layui-layer-title" style="'+(f?r.title[1]:"")+'">'+(f?r.title[0]:r.title)+"</div>":"";return r.zIndex=s,t([r.shade?'<div class="layui-layer-shade" id="layui-layer-shade'+a+'" times="'+a+'" style="'+("z-index:"+(s-1)+"; background-color:"+(r.shade[1]||"#000")+"; opacity:"+(r.shade[0]||r.shade)+"; filter:alpha(opacity="+(100*r.shade[0]||100*r.shade)+");")+'"></div>':"",'<div class="'+l[0]+(" layui-layer-"+o.type[r.type])+(0!=r.type&&2!=r.type||r.shade?"":" layui-layer-border")+" "+(r.skin||"")+'" id="'+l[0]+a+'" type="'+o.type[r.type]+'" times="'+a+'" showtime="'+r.time+'" conType="'+(e?"object":"string")+'" style="z-index: '+s+"; width:"+r.area[0]+";height:"+r.area[1]+(r.fixed?"":";position:absolute;")+'">'+(e&&2!=r.type?"":u)+'<div id="'+(r.id||"")+'" class="layui-layer-content'+(0==r.type&&r.icon!==-1?" layui-layer-padding":"")+(3==r.type?" layui-layer-loading"+r.icon:"")+'">'+(0==r.type&&r.icon!==-1?'<i class="layui-layer-ico layui-layer-ico'+r.icon+'"></i>':"")+(1==r.type&&e?"":r.content||"")+'</div><span class="layui-layer-setwin">'+function(){var e=c?'<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>':"";return r.closeBtn&&(e+='<a class="layui-layer-ico '+l[7]+" "+l[7]+(r.title?r.closeBtn:4==r.type?"1":"2")+'" href="javascript:;"></a>'),e}()+"</span>"+(r.btn?function(){var e="";"string"==typeof r.btn&&(r.btn=[r.btn]);for(var t=0,i=r.btn.length;t<i;t++)e+='<a class="'+l[6]+t+'">'+r.btn[t]+"</a>";return'<div class="'+l[6]+" layui-layer-btn-"+(r.btnAlign||"")+'">'+e+"</div>"}():"")+(r.resize?'<span class="layui-layer-resize"></span>':"")+"</div>"],u,i('<div class="layui-layer-move"></div>')),n},s.pt.creat=function(){var e=this,t=e.config,a=e.index,s=t.content,f="object"==typeof s,c=i("body");if(!t.id||!i("#"+t.id)[0]){switch("string"==typeof t.area&&(t.area="auto"===t.area?["",""]:[t.area,""]),t.shift&&(t.anim=t.shift),6==r.ie&&(t.fixed=!1),t.type){case 0:t.btn="btn"in t?t.btn:o.btn[0],r.closeAll("dialog");break;case 2:var s=t.content=f?t.content:[t.content,"auto"];t.content='<iframe scrolling="'+(t.content[1]||"auto")+'" allowtransparency="true" id="'+l[4]+a+'" name="'+l[4]+a+'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="'+t.content[0]+'"></iframe>';break;case 3:delete t.title,delete t.closeBtn,t.icon===-1&&0===t.icon,r.closeAll("loading");break;case 4:f||(t.content=[t.content,"body"]),t.follow=t.content[1],t.content=t.content[0]+'<i class="layui-layer-TipsG"></i>',delete t.title,t.tips="object"==typeof t.tips?t.tips:[t.tips,!0],t.tipsMore||r.closeAll("tips")}e.vessel(f,function(n,r,u){c.append(n[0]),f?function(){2==t.type||4==t.type?function(){i("body").append(n[1])}():function(){s.parents("."+l[0])[0]||(s.data("display",s.css("display")).show().addClass("layui-layer-wrap").wrap(n[1]),i("#"+l[0]+a).find("."+l[5]).before(r))}()}():c.append(n[1]),i(".layui-layer-move")[0]||c.append(o.moveElem=u),e.layero=i("#"+l[0]+a),t.scrollbar||l.html.css("overflow","hidden").attr("layer-full",a)}).auto(a),2==t.type&&6==r.ie&&e.layero.find("iframe").attr("src",s[0]),4==t.type?e.tips():e.offset(),t.fixed&&n.on("resize",function(){e.offset(),(/^\d+%$/.test(t.area[0])||/^\d+%$/.test(t.area[1]))&&e.auto(a),4==t.type&&e.tips()}),t.time<=0||setTimeout(function(){r.close(e.index)},t.time),e.move().callback(),l.anim[t.anim]&&e.layero.addClass(l.anim[t.anim]),t.isOutAnim&&e.layero.data("isOutAnim",!0)}},s.pt.auto=function(e){function t(e){e=s.find(e),e.height(f[1]-c-u-2*(0|parseFloat(e.css("padding-top"))))}var a=this,o=a.config,s=i("#"+l[0]+e);""===o.area[0]&&o.maxWidth>0&&(r.ie&&r.ie<8&&o.btn&&s.width(s.innerWidth()),s.outerWidth()>o.maxWidth&&s.width(o.maxWidth));var f=[s.innerWidth(),s.innerHeight()],c=s.find(l[1]).outerHeight()||0,u=s.find("."+l[6]).outerHeight()||0;switch(o.type){case 2:t("iframe");break;default:""===o.area[1]?o.fixed&&f[1]>=n.height()&&(f[1]=n.height(),t("."+l[5])):t("."+l[5])}return a},s.pt.offset=function(){var e=this,t=e.config,i=e.layero,a=[i.outerWidth(),i.outerHeight()],o="object"==typeof t.offset;e.offsetTop=(n.height()-a[1])/2,e.offsetLeft=(n.width()-a[0])/2,o?(e.offsetTop=t.offset[0],e.offsetLeft=t.offset[1]||e.offsetLeft):"auto"!==t.offset&&("t"===t.offset?e.offsetTop=0:"r"===t.offset?e.offsetLeft=n.width()-a[0]:"b"===t.offset?e.offsetTop=n.height()-a[1]:"l"===t.offset?e.offsetLeft=0:"lt"===t.offset?(e.offsetTop=0,e.offsetLeft=0):"lb"===t.offset?(e.offsetTop=n.height()-a[1],e.offsetLeft=0):"rt"===t.offset?(e.offsetTop=0,e.offsetLeft=n.width()-a[0]):"rb"===t.offset?(e.offsetTop=n.height()-a[1],e.offsetLeft=n.width()-a[0]):e.offsetTop=t.offset),t.fixed||(e.offsetTop=/%$/.test(e.offsetTop)?n.height()*parseFloat(e.offsetTop)/100:parseFloat(e.offsetTop),e.offsetLeft=/%$/.test(e.offsetLeft)?n.width()*parseFloat(e.offsetLeft)/100:parseFloat(e.offsetLeft),e.offsetTop+=n.scrollTop(),e.offsetLeft+=n.scrollLeft()),i.attr("minLeft")&&(e.offsetTop=n.height()-(i.find(l[1]).outerHeight()||0),e.offsetLeft=i.css("left")),i.css({top:e.offsetTop,left:e.offsetLeft})},s.pt.tips=function(){var e=this,t=e.config,a=e.layero,o=[a.outerWidth(),a.outerHeight()],r=i(t.follow);r[0]||(r=i("body"));var s={width:r.outerWidth(),height:r.outerHeight(),top:r.offset().top,left:r.offset().left},f=a.find(".layui-layer-TipsG"),c=t.tips[0];t.tips[1]||f.remove(),s.autoLeft=function(){s.left+o[0]-n.width()>0?(s.tipLeft=s.left+s.width-o[0],f.css({right:12,left:"auto"})):s.tipLeft=s.left},s.where=[function(){s.autoLeft(),s.tipTop=s.top-o[1]-10,f.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color",t.tips[1])},function(){s.tipLeft=s.left+s.width+10,s.tipTop=s.top,f.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color",t.tips[1])},function(){s.autoLeft(),s.tipTop=s.top+s.height+10,f.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color",t.tips[1])},function(){s.tipLeft=s.left-o[0]-10,s.tipTop=s.top,f.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color",t.tips[1])}],s.where[c-1](),1===c?s.top-(n.scrollTop()+o[1]+16)<0&&s.where[2]():2===c?n.width()-(s.left+s.width+o[0]+16)>0||s.where[3]():3===c?s.top-n.scrollTop()+s.height+o[1]+16-n.height()>0&&s.where[0]():4===c&&o[0]+16-s.left>0&&s.where[1](),a.find("."+l[5]).css({"background-color":t.tips[1],"padding-right":t.closeBtn?"30px":""}),a.css({left:s.tipLeft-(t.fixed?n.scrollLeft():0),top:s.tipTop-(t.fixed?n.scrollTop():0)})},s.pt.move=function(){var e=this,t=e.config,a=i(document),s=e.layero,l=s.find(t.move),f=s.find(".layui-layer-resize"),c={};return t.move&&l.css("cursor","move"),l.on("mousedown",function(e){e.preventDefault(),t.move&&(c.moveStart=!0,c.offset=[e.clientX-parseFloat(s.css("left")),e.clientY-parseFloat(s.css("top"))],o.moveElem.css("cursor","move").show())}),f.on("mousedown",function(e){e.preventDefault(),c.resizeStart=!0,c.offset=[e.clientX,e.clientY],c.area=[s.outerWidth(),s.outerHeight()],o.moveElem.css("cursor","se-resize").show()}),a.on("mousemove",function(i){if(c.moveStart){var a=i.clientX-c.offset[0],o=i.clientY-c.offset[1],l="fixed"===s.css("position");if(i.preventDefault(),c.stX=l?0:n.scrollLeft(),c.stY=l?0:n.scrollTop(),!t.moveOut){var f=n.width()-s.outerWidth()+c.stX,u=n.height()-s.outerHeight()+c.stY;a<c.stX&&(a=c.stX),a>f&&(a=f),o<c.stY&&(o=c.stY),o>u&&(o=u)}s.css({left:a,top:o})}if(t.resize&&c.resizeStart){var a=i.clientX-c.offset[0],o=i.clientY-c.offset[1];i.preventDefault(),r.style(e.index,{width:c.area[0]+a,height:c.area[1]+o}),c.isResize=!0,t.resizing&&t.resizing(s)}}).on("mouseup",function(e){c.moveStart&&(delete c.moveStart,o.moveElem.hide(),t.moveEnd&&t.moveEnd(s)),c.resizeStart&&(delete c.resizeStart,o.moveElem.hide())}),e},s.pt.callback=function(){function e(){var e=a.cancel&&a.cancel(t.index,n);e===!1||r.close(t.index)}var t=this,n=t.layero,a=t.config;t.openLayer(),a.success&&(2==a.type?n.find("iframe").on("load",function(){a.success(n,t.index)}):a.success(n,t.index)),6==r.ie&&t.IE6(n),n.find("."+l[6]).children("a").on("click",function(){var e=i(this).index();if(0===e)a.yes?a.yes(t.index,n):a.btn1?a.btn1(t.index,n):r.close(t.index);else{var o=a["btn"+(e+1)]&&a["btn"+(e+1)](t.index,n);o===!1||r.close(t.index)}}),n.find("."+l[7]).on("click",e),a.shadeClose&&i("#layui-layer-shade"+t.index).on("click",function(){r.close(t.index)}),n.find(".layui-layer-min").on("click",function(){var e=a.min&&a.min(n);e===!1||r.min(t.index,a)}),n.find(".layui-layer-max").on("click",function(){i(this).hasClass("layui-layer-maxmin")?(r.restore(t.index),a.restore&&a.restore(n)):(r.full(t.index,a),setTimeout(function(){a.full&&a.full(n)},100))}),a.end&&(o.end[t.index]=a.end)},o.reselect=function(){i.each(i("select"),function(e,t){var n=i(this);n.parents("."+l[0])[0]||1==n.attr("layer")&&i("."+l[0]).length<1&&n.removeAttr("layer").show(),n=null})},s.pt.IE6=function(e){i("select").each(function(e,t){var n=i(this);n.parents("."+l[0])[0]||"none"===n.css("display")||n.attr({layer:"1"}).hide(),n=null})},s.pt.openLayer=function(){var e=this;r.zIndex=e.config.zIndex,r.setTop=function(e){var t=function(){r.zIndex++,e.css("z-index",r.zIndex+1)};return r.zIndex=parseInt(e[0].style.zIndex),e.on("mousedown",t),r.zIndex}},o.record=function(e){var t=[e.width(),e.height(),e.position().top,e.position().left+parseFloat(e.css("margin-left"))];e.find(".layui-layer-max").addClass("layui-layer-maxmin"),e.attr({area:t})},o.rescollbar=function(e){l.html.attr("layer-full")==e&&(l.html[0].style.removeProperty?l.html[0].style.removeProperty("overflow"):l.html[0].style.removeAttribute("overflow"),l.html.removeAttr("layer-full"))},e.layer=r,r.getChildFrame=function(e,t){return t=t||i("."+l[4]).attr("times"),i("#"+l[0]+t).find("iframe").contents().find(e)},r.getFrameIndex=function(e){return i("#"+e).parents("."+l[4]).attr("times")},r.iframeAuto=function(e){if(e){var t=r.getChildFrame("html",e).outerHeight(),n=i("#"+l[0]+e),a=n.find(l[1]).outerHeight()||0,o=n.find("."+l[6]).outerHeight()||0;n.css({height:t+a+o}),n.find("iframe").css({height:t})}},r.iframeSrc=function(e,t){i("#"+l[0]+e).find("iframe").attr("src",t)},r.style=function(e,t,n){var a=i("#"+l[0]+e),r=a.find(".layui-layer-content"),s=a.attr("type"),f=a.find(l[1]).outerHeight()||0,c=a.find("."+l[6]).outerHeight()||0;a.attr("minLeft");s!==o.type[3]&&s!==o.type[4]&&(n||(parseFloat(t.width)<=260&&(t.width=260),parseFloat(t.height)-f-c<=64&&(t.height=64+f+c)),a.css(t),c=a.find("."+l[6]).outerHeight(),s===o.type[2]?a.find("iframe").css({height:parseFloat(t.height)-f-c}):r.css({height:parseFloat(t.height)-f-c-parseFloat(r.css("padding-top"))-parseFloat(r.css("padding-bottom"))}))},r.min=function(e,t){var a=i("#"+l[0]+e),s=a.find(l[1]).outerHeight()||0,f=a.attr("minLeft")||181*o.minIndex+"px",c=a.css("position");o.record(a),o.minLeft[0]&&(f=o.minLeft[0],o.minLeft.shift()),a.attr("position",c),r.style(e,{width:180,height:s,left:f,top:n.height()-s,position:"fixed",overflow:"hidden"},!0),a.find(".layui-layer-min").hide(),"page"===a.attr("type")&&a.find(l[4]).hide(),o.rescollbar(e),a.attr("minLeft")||o.minIndex++,a.attr("minLeft",f)},r.restore=function(e){var t=i("#"+l[0]+e),n=t.attr("area").split(",");t.attr("type");r.style(e,{width:parseFloat(n[0]),height:parseFloat(n[1]),top:parseFloat(n[2]),left:parseFloat(n[3]),position:t.attr("position"),overflow:"visible"},!0),t.find(".layui-layer-max").removeClass("layui-layer-maxmin"),t.find(".layui-layer-min").show(),"page"===t.attr("type")&&t.find(l[4]).show(),o.rescollbar(e)},r.full=function(e){var t,a=i("#"+l[0]+e);o.record(a),l.html.attr("layer-full")||l.html.css("overflow","hidden").attr("layer-full",e),clearTimeout(t),t=setTimeout(function(){var t="fixed"===a.css("position");r.style(e,{top:t?0:n.scrollTop(),left:t?0:n.scrollLeft(),width:n.width(),height:n.height()},!0),a.find(".layui-layer-min").hide()},100)},r.title=function(e,t){var n=i("#"+l[0]+(t||r.index)).find(l[1]);n.html(e)},r.close=function(e){var t=i("#"+l[0]+e),n=t.attr("type"),a="layer-anim-close";if(t[0]){var s="layui-layer-wrap",f=function(){if(n===o.type[1]&&"object"===t.attr("conType")){t.children(":not(."+l[5]+")").remove();for(var a=t.find("."+s),r=0;r<2;r++)a.unwrap();a.css("display",a.data("display")).removeClass(s)}else{if(n===o.type[2])try{var f=i("#"+l[4]+e)[0];f.contentWindow.document.write(""),f.contentWindow.close(),t.find("."+l[5])[0].removeChild(f)}catch(c){}t[0].innerHTML="",t.remove()}"function"==typeof o.end[e]&&o.end[e](),delete o.end[e]};t.data("isOutAnim")&&t.addClass(a),i("#layui-layer-moves, #layui-layer-shade"+e).remove(),6==r.ie&&o.reselect(),o.rescollbar(e),t.attr("minLeft")&&(o.minIndex--,o.minLeft.push(t.attr("minLeft"))),r.ie&&r.ie<10||!t.data("isOutAnim")?f():setTimeout(function(){f()},200)}},r.closeAll=function(e){i.each(i("."+l[0]),function(){var t=i(this),n=e?t.attr("type")===e:1;n&&r.close(t.attr("times")),n=null})};var f=r.cache||{},c=function(e){return f.skin?" "+f.skin+" "+f.skin+"-"+e:""};r.prompt=function(e,t){var a="";if(e=e||{},"function"==typeof e&&(t=e),e.area){var o=e.area;a='style="width: '+o[0]+"; height: "+o[1]+';"',delete e.area}var s,l=2==e.formType?'<textarea class="layui-layer-input"'+a+">"+(e.value||"")+"</textarea>":function(){return'<input type="'+(1==e.formType?"password":"text")+'" class="layui-layer-input" value="'+(e.value||"")+'">'}(),f=e.success;return delete e.success,r.open(i.extend({type:1,btn:["&#x786E;&#x5B9A;","&#x53D6;&#x6D88;"],content:l,skin:"layui-layer-prompt"+c("prompt"),maxWidth:n.width(),success:function(e){s=e.find(".layui-layer-input"),s.focus(),"function"==typeof f&&f(e)},resize:!1,yes:function(i){var n=s.val();""===n?s.focus():n.length>(e.maxlength||500)?r.tips("&#x6700;&#x591A;&#x8F93;&#x5165;"+(e.maxlength||500)+"&#x4E2A;&#x5B57;&#x6570;",s,{tips:1}):t&&t(n,i,s)}},e))},r.tab=function(e){e=e||{};var t=e.tab||{},n=e.success;return delete e.success,r.open(i.extend({type:1,skin:"layui-layer-tab"+c("tab"),resize:!1,title:function(){var e=t.length,i=1,n="";if(e>0)for(n='<span class="layui-layer-tabnow">'+t[0].title+"</span>";i<e;i++)n+="<span>"+t[i].title+"</span>";return n}(),content:'<ul class="layui-layer-tabmain">'+function(){var e=t.length,i=1,n="";if(e>0)for(n='<li class="layui-layer-tabli xubox_tab_layer">'+(t[0].content||"no content")+"</li>";i<e;i++)n+='<li class="layui-layer-tabli">'+(t[i].content||"no  content")+"</li>";return n}()+"</ul>",success:function(t){var a=t.find(".layui-layer-title").children(),o=t.find(".layui-layer-tabmain").children();a.on("mousedown",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0;var n=i(this),a=n.index();n.addClass("layui-layer-tabnow").siblings().removeClass("layui-layer-tabnow"),o.eq(a).show().siblings().hide(),"function"==typeof e.change&&e.change(a)}),"function"==typeof n&&n(t)}},e))},r.photos=function(t,n,a){function o(e,t,i){var n=new Image;return n.src=e,n.complete?t(n):(n.onload=function(){n.onload=null,t(n)},void(n.onerror=function(e){n.onerror=null,i(e)}))}var s={};if(t=t||{},t.photos){var l=t.photos.constructor===Object,f=l?t.photos:{},u=f.data||[],d=f.start||0;s.imgIndex=(0|d)+1,t.img=t.img||"img";var y=t.success;if(delete t.success,l){if(0===u.length)return r.msg("&#x6CA1;&#x6709;&#x56FE;&#x7247;")}else{var p=i(t.photos),h=function(){u=[],p.find(t.img).each(function(e){var t=i(this);t.attr("layer-index",e),u.push({alt:t.attr("alt"),pid:t.attr("layer-pid"),src:t.attr("layer-src")||t.attr("src"),thumb:t.attr("src")})})};if(h(),0===u.length)return;if(n||p.on("click",t.img,function(){var e=i(this),n=e.attr("layer-index");r.photos(i.extend(t,{photos:{start:n,data:u,tab:t.tab},full:t.full}),!0),h()}),!n)return}s.imgprev=function(e){s.imgIndex--,s.imgIndex<1&&(s.imgIndex=u.length),s.tabimg(e)},s.imgnext=function(e,t){s.imgIndex++,s.imgIndex>u.length&&(s.imgIndex=1,t)||s.tabimg(e)},s.keyup=function(e){if(!s.end){var t=e.keyCode;e.preventDefault(),37===t?s.imgprev(!0):39===t?s.imgnext(!0):27===t&&r.close(s.index)}},s.tabimg=function(e){if(!(u.length<=1))return f.start=s.imgIndex-1,r.close(s.index),r.photos(t,!0,e)},s.event=function(){s.bigimg.hover(function(){s.imgsee.show()},function(){s.imgsee.hide()}),s.bigimg.find(".layui-layer-imgprev").on("click",function(e){e.preventDefault(),s.imgprev()}),s.bigimg.find(".layui-layer-imgnext").on("click",function(e){e.preventDefault(),s.imgnext()}),i(document).on("keyup",s.keyup)},s.loadi=r.load(1,{shade:!("shade"in t)&&.9,scrollbar:!1}),o(u[d].src,function(n){r.close(s.loadi),s.index=r.open(i.extend({type:1,id:"layui-layer-photos",area:function(){var a=[n.width,n.height],o=[i(e).width()-100,i(e).height()-100];if(!t.full&&(a[0]>o[0]||a[1]>o[1])){var r=[a[0]/o[0],a[1]/o[1]];r[0]>r[1]?(a[0]=a[0]/r[0],a[1]=a[1]/r[0]):r[0]<r[1]&&(a[0]=a[0]/r[1],a[1]=a[1]/r[1])}return[a[0]+"px",a[1]+"px"]}(),title:!1,shade:.9,shadeClose:!0,closeBtn:!1,move:".layui-layer-phimg img",moveType:1,scrollbar:!1,moveOut:!0,isOutAnim:!1,skin:"layui-layer-photos"+c("photos"),content:'<div class="layui-layer-phimg"><img src="'+u[d].src+'" alt="'+(u[d].alt||"")+'" layer-pid="'+u[d].pid+'"><div class="layui-layer-imgsee">'+(u.length>1?'<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>':"")+'<div class="layui-layer-imgbar" style="display:'+(a?"block":"")+'"><span class="layui-layer-imgtit"><a href="javascript:;">'+(u[d].alt||"")+"</a><em>"+s.imgIndex+"/"+u.length+"</em></span></div></div></div>",success:function(e,i){s.bigimg=e.find(".layui-layer-phimg"),s.imgsee=e.find(".layui-layer-imguide,.layui-layer-imgbar"),s.event(e),t.tab&&t.tab(u[d],e),"function"==typeof y&&y(e)},end:function(){s.end=!0,i(document).off("keyup",s.keyup)}},t))},function(){r.close(s.loadi),r.msg("&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;",{time:3e4,btn:["&#x4E0B;&#x4E00;&#x5F20;","&#x4E0D;&#x770B;&#x4E86;"],yes:function(){u.length>1&&s.imgnext(!0,!0)}})})}},o.run=function(t){i=t,n=i(e),l.html=i("html"),r.open=function(e){var t=new s(e);return t.index}},e.layui&&layui.define?(r.ready(),layui.define("jquery",function(t){r.path=layui.cache.dir,o.run(layui.jquery),e.layer=r,t("layer",r)})):"function"==typeof define&&define.amd?define(["jquery"],function(){return o.run(e.jQuery),r}):function(){o.run(e.jQuery),r.ready()}()}(window);;
///<jscompress sourcefile="WdatePicker.js" />
/*
 * My97 DatePicker 4.8
 * License: http://www.my97.net/license.asp
 */
var $dp, WdatePicker;
(function () {
    var l = {
        $langList: [
            {name: "en", charset: "UTF-8"},
            {name: "zh-cn", charset: "gb2312"},
            {name: "zh-tw", charset: "GBK"}
        ],
        $skinList: [
            {name: "default", charset: "gb2312"},
            {name: "whyGreen", charset: "gb2312"},
            {name: "blue", charset: "gb2312"},
            {name: "green", charset: "gb2312"},
            {name: "simple", charset: "gb2312"},
            {name: "ext", charset: "gb2312"},
            {name: "blueFresh", charset: "gb2312"},
            {name: "twoer", charset: "gb2312"},
            {name: "YcloudRed", charset: "gb2312"}],
        $wdate: true,
        $crossFrame: false,
        $preLoad: false,
        $dpPath: "",
        doubleCalendar: false,
        enableKeyboard: true,
        enableInputMask: true,
        autoUpdateOnChanged: null,
        weekMethod: "MSExcel",
        position: {},
        lang: "auto",
        skin: "default",
        dateFmt: "yyyy-MM-dd",
        realDateFmt: "yyyy-MM-dd",
        realTimeFmt: "HH:mm:ss",
        realFullFmt: "%Date %Time",
        minDate: "0001-01-01 00:00:00",
        maxDate: "9999-12-31 23:59:59",
        minTime: "00:00:00",
        maxTime: "23:59:59",
        startDate: "",
        alwaysUseStartDate: false,
        yearOffset: 1911,
        firstDayOfWeek: 0,
        isShowWeek: false,
        highLineWeekDay: true,
        isShowClear: true,
        isShowToday: true,
        isShowOK: true,
        isShowOthers: true,
        readOnly: false,
        errDealMode: 0,
        autoPickDate: null,
        qsEnabled: true,
        autoShowQS: false,
        hmsMenuCfg: {H: [1, 6], m: [5, 6], s: [15, 4]},

        opposite: false,
        specialDates: null,
        specialDays: null,
        disabledDates: null,
        disabledDays: null,
        onpicking: null,
        onpicked: null,
        onclearing: null,
        oncleared: null,
        ychanging: null,
        ychanged: null,
        Mchanging: null,
        Mchanged: null,
        dchanging: null,
        dchanged: null,
        Hchanging: null,
        Hchanged: null,
        mchanging: null,
        mchanged: null,
        schanging: null,
        schanged: null,
        eCont: null,
        vel: null,
        elProp: "",
        errMsg: "",
        quickSel: [],
        has: {},
        getRealLang: function () {
            var d = l.$langList;
            for (var e = 0; e < d.length; e++) {
                if (d[e].name == this.lang) {
                    return d[e]
                }
            }
            return d[0]
        }
    };
    WdatePicker = g;
    var n = window, i = {innerHTML: ""}, z = "document", B = "documentElement", H = "getElementsByTagName", E, u, h, f,
        D;
    var v = navigator.appName;
    if (v == "Microsoft Internet Explorer") {
        h = true
    } else {
        if (v == "Opera") {
            D = true
        } else {
            f = true
        }
    }
    u = l.$dpPath || q();
    if (l.$wdate) {
        m(u + "skin/WdatePicker.css")
    }
    E = n;
    if (l.$crossFrame) {
        try {
            while (E.parent != E && E.parent[z][H]("frameset").length == 0) {
                E = E.parent
            }
        } catch (y) {
        }
    }
    if (!E.$dp) {
        E.$dp = {ff: f, ie: h, opera: D, status: 0, defMinDate: l.minDate, defMaxDate: l.maxDate}
    }
    b();
    if (l.$preLoad && $dp.status == 0) {
        k(n, "onload", function () {
            g(null, true)
        })
    }
    if (!n[z].docMD) {
        k(n[z], "onmousedown", s, true);
        n[z].docMD = true
    }
    if (!E[z].docMD) {
        k(E[z], "onmousedown", s, true);
        E[z].docMD = true
    }
    k(n, "onunload", function () {
        if ($dp.dd) {
            r($dp.dd, "none")
        }
    });

    function b() {
        try {
            E[z], E.$dp = E.$dp || {}
        } catch (I) {
            E = n;
            $dp = $dp || {}
        }
        var w = {
            win: n, $: function (e) {
                return (typeof e == "string") ? n[z].getElementById(e) : e
            }, $D: function (J, e) {
                return this.$DV(this.$(J).value, e)
            }, $DV: function (J, e) {
                if (J != "") {
                    this.dt = $dp.cal.splitDate(J, $dp.cal.dateFmt);
                    if (e) {
                        for (var L in e) {
                            if (this.dt[L] === undefined) {
                                this.errMsg = "invalid property:" + L
                            } else {
                                this.dt[L] += e[L];
                                if (L == "M") {
                                    var M = e.M > 0 ? 1 : 0;
                                    var K = new Date(this.dt.y, this.dt.M, 0).getDate();
                                    this.dt.d = Math.min(K + M, this.dt.d)
                                }
                            }
                        }
                    }
                    if (this.dt.refresh()) {
                        return this.dt
                    }
                }
                return ""
            }, show: function () {
                var K = E[z].getElementsByTagName("div"), J = 100000;
                for (var e = 0; e < K.length; e++) {
                    var L = parseInt(K[e].style.zIndex);
                    if (L > J) {
                        J = L
                    }
                }
                this.dd.style.zIndex = J + 2;
                r(this.dd, "block");
                r(this.dd.firstChild, "")
            }, unbind: function (e) {
                e = this.$(e);
                if (e.initcfg) {
                    t(e, "onclick", function () {
                        g(e.initcfg)
                    });
                    t(e, "onfocus", function () {
                        g(e.initcfg)
                    })
                }
            }, hide: function () {
                r(this.dd, "none")
            }, attachEvent: k
        };
        for (var d in w) {
            E.$dp[d] = w[d]
        }
        $dp = E.$dp
    }

    function k(I, J, w, d) {
        if (I.addEventListener) {
            var e = J.replace(/on/, "");
            w._ieEmuEventHandler = function (K) {
                return w(K)
            };
            I.addEventListener(e, w._ieEmuEventHandler, d)
        } else {
            I.attachEvent(J, w)
        }
    }

    function t(w, I, e) {
        if (w.removeEventListener) {
            var d = I.replace(/on/, "");
            e._ieEmuEventHandler = function (J) {
                return e(J)
            };
            w.removeEventListener(d, e._ieEmuEventHandler, false)
        } else {
            w.detachEvent(I, e)
        }
    }

    function C(w, e, d) {
        if (typeof w != typeof e) {
            return false
        }
        if (typeof w == "object") {
            if (!d) {
                for (var I in w) {
                    if (typeof e[I] == "undefined") {
                        return false
                    }
                    if (!C(w[I], e[I], true)) {
                        return false
                    }
                }
            }
            return true
        } else {
            if (typeof w == "function" && typeof e == "function") {
                return w.toString() == e.toString()
            } else {
                return w == e
            }
        }
    }

    function q() {
        var I, w,J, d = n[z][H]("script");
        for (var e = 0; e < d.length; e++) {
            //叶明龙修改
            I = d[e].getAttribute("src") || "";
            if(!/base_common/.test(I.toLowerCase())) {
                continue;
            }
            J = I.toLowerCase().indexOf("base_common");
            I = I.substr(0, J);
            //叶明龙修改
            var w = I.lastIndexOf("/");
            if (w > 0) {
                I = I.substring(0, w + 1)
            }
            if (I) {
                break
            }
        }
        return I
    }

    function m(w, I, J) {
        var d = n[z][H]("HEAD").item(0), e = n[z].createElement("link");
        if (d) {
            e.href = w;
            e.rel = "stylesheet";
            e.type = "text/css";
            if (I) {
                e.title = I
            }
            if (J) {
                e.charset = J
            }
            d.appendChild(e)
        }
    }

    function p(I) {
        I = I || E;
        var L = 0, d = 0;
        while (I != E) {
            var N = I.parent[z][H]("iframe");
            for (var J = 0; J < N.length; J++) {
                try {
                    if (N[J].contentWindow == I) {
                        var K = o(N[J]);
                        L += K.left;
                        d += K.top;
                        break
                    }
                } catch (M) {
                }
            }
            I = I.parent
        }
        return {leftM: L, topM: d}
    }

    function o(I, w) {
        if (I.getBoundingClientRect) {
            return I.getBoundingClientRect()
        } else {
            var J = {ROOT_TAG: /^body|html$/i, OP_SCROLL: /^(?:inline|table-row)$/i};
            var e = false, M = null, P = I.offsetTop, K = I.offsetLeft, d = I.offsetWidth, O = I.offsetHeight;
            var L = I.offsetParent;
            if (L != I) {
                while (L) {
                    K += L.offsetLeft;
                    P += L.offsetTop;
                    if (c(L, "position").toLowerCase() == "fixed") {
                        e = true
                    } else {
                        if (L.tagName.toLowerCase() == "body") {
                            M = L.ownerDocument.defaultView
                        }
                    }
                    L = L.offsetParent
                }
            }
            L = I.parentNode;
            while (L.tagName && !J.ROOT_TAG.test(L.tagName)) {
                if (L.scrollTop || L.scrollLeft) {
                    if (!J.OP_SCROLL.test(r(L))) {
                        if (!D || L.style.overflow !== "visible") {
                            K -= L.scrollLeft;
                            P -= L.scrollTop
                        }
                    }
                }
                L = L.parentNode
            }
            if (!e) {
                var N = F(M);
                K -= N.left;
                P -= N.top
            }
            d += K;
            O += P;
            return {left: K, top: P, right: d, bottom: O}
        }
    }

    function x(e) {
        e = e || E;
        var J = e[z],
            I = (e.innerWidth) ? e.innerWidth : (J[B] && J[B].clientWidth) ? J[B].clientWidth : J.body.offsetWidth,
            d = (e.innerHeight) ? e.innerHeight : (J[B] && J[B].clientHeight) ? J[B].clientHeight : J.body.offsetHeight;
        return {width: I, height: d}
    }

    function F(e) {
        e = e || E;
        var J = e[z], d = J[B], I = J.body;
        J = (d && d.scrollTop != null && (d.scrollTop > I.scrollTop || d.scrollLeft > I.scrollLeft)) ? d : I;
        return {top: J.scrollTop, left: J.scrollLeft}
    }

    function s(d) {
        try {
            var w = d ? (d.srcElement || d.target) : null;
            if ($dp.cal && !$dp.eCont && $dp.dd && w != $dp.el && $dp.dd.style.display == "block") {
                $dp.cal.close()
            }
        } catch (d) {
        }
    }

    function A() {
        $dp.status = 2
    }

    var G, j;

    function g(M, d) {
        if (!$dp) {
            return
        }
        b();
        var J = {};
        for (var L in M) {
            J[L] = M[L]
        }
        for (var L in l) {
            if (L.substring(0, 1) != "$" && J[L] === undefined) {
                J[L] = l[L]
            }
        }
        if (d) {
            if (!w()) {
                j = j || setInterval(function () {
                    if (E[z].readyState == "complete") {
                        clearInterval(j)
                    }
                    g(null, true)
                }, 50);
                return
            }
            if ($dp.status == 0) {
                $dp.status = 1;
                J.el = i;
                a(J, true)
            } else {
                return
            }
        } else {
            if (J.eCont) {
                J.eCont = $dp.$(J.eCont);
                J.el = i;
                J.autoPickDate = true;
                J.qsEnabled = false;
                a(J)
            } else {
                if (l.$preLoad && $dp.status != 2) {
                    return
                }
                var I = N();
                if (n.event === I || I) {
                    J.srcEl = I.srcElement || I.target;
                    I.cancelBubble = true
                }
                J.el = J.el = $dp.$(J.el || J.srcEl);
                if (J.el == null) {
                    alert("WdatePicker:el is null!\nexample:onclick=\"WdatePicker({el:this})\"");
                    return;
                }
                try {
                    if (!J.el || J.el.My97Mark === true || J.el.disabled || ($dp.dd && r($dp.dd) != "none" && $dp.dd.style.left != "-970px")) {
                        if (J.el.My97Mark) {
                            J.el.My97Mark = false
                        }
                        return
                    }
                } catch (K) {
                }
                if (I && J.el.nodeType == 1 && !C(J.el.initcfg, M)) {
                    $dp.unbind(J.el);
                    k(J.el, I.type == "focus" ? "onclick" : "onfocus", function () {
                        g(M)
                    });
                    J.el.initcfg = M
                }
                a(J)
            }
        }

        function w() {
            if (h && E != n && E[z].readyState != "complete") {
                return false
            }
            return true
        }

        function N() {
            if (f) {
                try {
                    func = N.caller;
                    while (func != null) {
                        var O = func.arguments[0];
                        if (O && (O + "").indexOf("Event") >= 0) {
                            return O
                        }
                        func = func.caller
                    }
                } catch (P) {
                }
                return null
            }
            return event
        }
    }

    function c(e, d) {
        return e.currentStyle ? e.currentStyle[d] : document.defaultView.getComputedStyle(e, false)[d]
    }

    function r(e, d) {
        if (e) {
            if (d != null) {
                e.style.display = d
            } else {
                return c(e, "display")
            }
        }
    }

    function a(e, d) {
        var K = e.el ? e.el.nodeName : "INPUT";
        if (d || e.eCont || new RegExp(/input|textarea|div|span|p|a/ig).test(K)) {
            e.elProp = K == "INPUT" ? "value" : "innerHTML"
        } else {
            return
        }
        if (e.lang == "auto") {
            e.lang = h ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase()
        }
        if (!e.eCont) {
            for (var J in e) {
                $dp[J] = e[J]
            }
        }
        if (!$dp.dd || e.eCont || ($dp.dd && (e.getRealLang().name != $dp.dd.lang || e.skin != $dp.dd.skin))) {
            if (e.eCont) {
                w(e.eCont, e)
            } else {
                $dp.dd = E[z].createElement("DIV");
                $dp.dd.style.cssText = "position:absolute";
                E[z].body.appendChild($dp.dd);
                w($dp.dd, e);
                if (d) {
                    $dp.dd.style.left = $dp.dd.style.top = "-970px"
                } else {
                    $dp.show();
                    I($dp)
                }
            }
        } else {
            if ($dp.cal) {
                $dp.show();
                $dp.cal.init();
                if (!$dp.eCont) {
                    I($dp)
                }
            }
        }

        function w(V, P) {
            var O = E[z].domain, S = false,
                M = '<iframe hideFocus=true width=9 height=7 frameborder=0 border=0 scrolling=no src="about:blank"></iframe>';
            V.innerHTML = M;
            var L = l.$langList, U = l.$skinList, T;
            try {
                T = V.lastChild.contentWindow[z]
            } catch (Q) {
                S = true;
                V.removeChild(V.lastChild);
                var N = E[z].createElement("iframe");
                N.hideFocus = true;
                N.frameBorder = 0;
                N.scrolling = "no";
                N.src = "javascript:(function(){var d=document;d.open();d.domain='" + O + "';})()";
                V.appendChild(N);
                setTimeout(function () {
                    T = V.lastChild.contentWindow[z];
                    R()
                }, 97);
                return
            }
            R();

            function R() {
                var Y = P.getRealLang();
                V.lang = Y.name;
                V.skin = P.skin;
                var X = ["<head><script>", "", "var doc=document, $d, $dp, $cfg=doc.cfg, $pdp = parent.$dp, $dt, $tdt, $sdt, $lastInput, $IE=$pdp.ie, $FF = $pdp.ff,$OPERA=$pdp.opera, $ny, $cMark = false;", "if($cfg.eCont){$dp = {};for(var p in $pdp)$dp[p]=$pdp[p];}else{$dp=$pdp;};for(var p in $cfg){$dp[p]=$cfg[p];}", "doc.oncontextmenu=function(){return false;};", "<\/script><script src=", u, "lang/", Y.name, ".js charset=", Y.charset, "><\/script>"];
                if (S) {
                    X[1] = 'document.domain="' + O + '";'
                }
                for (var W = 0; W < U.length; W++) {
                    if (U[W].name == P.skin) {
                        X.push('<link rel="stylesheet" type="text/css" href="' + u + "skin/" + U[W].name + '/datepicker.css" charset="' + U[W].charset + '"/>')
                    }
                }
                X.push('<script src="' + u + 'calendar.js"><\/script>');
                X.push('</head><body leftmargin="0" topmargin="0" tabindex=0></body></html>');
                X.push('<script>var t;t=t||setInterval(function(){if((typeof(doc.ready)=="boolean"&&doc.ready)||doc.readyState=="complete"){new My97DP();$cfg.onload();$c.autoSize();$cfg.setPos($dp);clearInterval(t);}},20);<\/script>');
                P.setPos = I;
                P.onload = A;
                T.write("<html>");
                T.cfg = P;
                T.write(X.join(""));
                T.close()
            }
        }

        function I(O) {
            var M = O.position.left, V = O.position.top, L = O.el;
            if (L == i) {
                return
            }
            if (L != O.srcEl && (r(L) == "none" || L.type == "hidden")) {
                L = O.srcEl
            }
            var T = o(L), P = p(n), U = x(E), Q = F(E), N = $dp.dd.offsetHeight, S = $dp.dd.offsetWidth;
            if (isNaN(V)) {
                V = 0
            }
            if ((P.topM + T.bottom + N > U.height) && (P.topM + T.top - N > 0)) {
                V += Q.top + P.topM + T.top - N - 2
            } else {
                V += Q.top + P.topM + T.bottom;
                var R = V - Q.top + N - U.height;
                if (R > 0) {
                    V -= R
                }
            }
            if (isNaN(M)) {
                M = 0
            }
            M += Q.left + Math.min(P.leftM + T.left, U.width - S - 5) - (h ? 2 : 0);
            O.dd.style.top = V + "px";
            O.dd.style.left = M + "px";
            /**
             * @author :yeminglong
             * @update :2018/04/18
             * @description :增加了日期框的边框样式
             */
            O.dd.setAttribute("class","mydate-panel");
        }
    }
})();;
