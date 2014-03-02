steal(
	"can/view/parser",
	"can/view/target",
	"./html_section.js",
	"./text_section.js",
	"./mustache_core.js",
	"./mustache_helpers.js",
	"can/view/callbacks",
	function(parser, target,  HTMLSection, TextSection, mustacheCore, mustacheHelpers, elementCallback ){
	
	
	var stache = can.stache = function(template){
		
		// Remove line breaks according to mustache's specs.
		template = mustacheCore.cleanLineEndings(template);
		
		// The HTML section that is the root section for the entire template.
		var section = new HTMLSection(),
		
			// This function is a catch all for taking a section and figuring out
			// how to create a "renderer" that handles the functionality for a 
			// given section and modify the section to use that renderer.
			// For example, if an HTMLSection is passed with mode `#` it knows to 
			// create a liveBindingBranchRenderer and pass that to section.add.
			makeRendererAndUpdateSection = function(section, mode, stache){
				
				if(mode === ">") {
					// Partials use liveBindingPartialRenderers
					section.add(mustacheCore.makeLiveBindingPartialRenderer(stache));
					
				} else if(mode === "/") {
					
					section.endSection();
					
				} else if(mode === "else") {
					
					section.inverse();
					
				} else {
					
					// If we are an HTMLSection, we will generate a 
					// a LiveBindingBranchRenderer; otherwise, a StringBranchRenderer.
					// A LiveBindingBranchRenderer function processes
					// the mustache text, and sets up live binding if an observable is read.
					// A StringBranchRenderer function processes the mustache text and returns a 
					// text value.  
					var makeRenderer = section instanceof HTMLSection ?
						
						mustacheCore.makeLiveBindingBranchRenderer:
						mustacheCore.makeStringBranchRenderer;
						
					
					if(mode === "{" || mode === "&") {
					
						// Adds a renderer function that just reads a value or calls a helper.
						section.add( makeRenderer(null,stache, copyState() ));
					
					} else if(mode === "#" || mode === "^") {
					
						// Adds a renderer function and starts a section.
						section.startSection(makeRenderer(mode,stache, copyState()  ));
						
					} else {
						// Adds a renderer function that only updates text.
						section.add( makeRenderer(null,stache, copyState({text: true}) ));
					}
					
				}
			},
			// Tracks the state of the parser.
			state = {
				node: null,
				attr: null,
				section: null,
				// If text should be inserted and HTML escaped
				text: false
			},
			// Copys the state object for use in renderers.
			copyState = function(overwrites){
				var cur = {
					tag: state.node && state.node.tag,
					attr: state.attr && state.attr.name
				};
				return overwrites ? can.simpleExtend(cur, overwrites) : cur;
			};
		
		parser(template,{
			start: function(tagName, unary){
				state.node = {
					tag: tagName,
					children: []
				};
				
			},
			end: function(tagName, unary){
				if(unary){
					section.add(state.node);
				} else {
					section.push(state.node);
				}
				
				if( elementCallback.tag(tagName) ) {
					section.startSubSection();
				}
				
				state.node =null;
			},
			close: function( tagName ) {
				
				if( elementCallback.tag(tagName) ) {
					
					var renderer = section.endSubSection();
				}
				
				var oldNode = section.pop();
				if( renderer ) {
					if( !oldNode.attributes ) {
						oldNode.attributes = [];
					}
					oldNode.attributes.push(function(scope, options){
						elementCallback.tagHandler(this,tagName, {
							scope: scope,
							options: options,
							subtemplate: renderer
						});
					});
				}
				
				
			},
			attrStart: function(attrName){
				if(state.node.section) {
					state.node.section.add(attrName+"=\"")
				} else {
					state.attr = {
						name: attrName,
						value: ""
					};
				}
				
			},
			attrEnd: function(attrName){
				if(state.node.section) {
					state.node.section.add("\" ");
				} else {
					if(!state.node.attrs) {
						state.node.attrs = {};
					}
					
					state.node.attrs[state.attr.name] = 
						state.attr.section ? state.attr.section.compile(copyState()) : state.attr.value;
					
					var attrCallback = elementCallback.attr(attrName);
					if(attrCallback) {
						if( !state.node.attributes ) {
							state.node.attributes = [];
						}
						state.node.attributes.push(function(scope, options){
							attrCallback(this,{
								attributeName: attrName,
								scope: scope,
								options: options
							});
						})
					}
					
					
					
					state.attr = null;
				}
			},
			attrValue: function(value){
				var section = state.node.section || state.attr.section;
				if(section){
					section.add(value)
				} else {
					state.attr.value += value;
				}
			},
			chars: function( text ) {
				section.add(text)
			},
			special: function( text ){
				
				
				var firstAndText = mustacheCore.getModeAndText(text, state),
					first = firstAndText.mode,
					text = firstAndText.text;
				
				
				if(text === "else") {
					section.inverse();
					return;
				}
				
				if(first === "!") {
					return;
				}

				if(state.node && state.node.section) {
					
					makeRendererAndUpdateSection(state.node.section, first, text);
					
					if(state.node.section.subSectionDepth() === 0){
						state.node.attributes.push( state.node.section.compile(copyState()) );
						delete state.node.section;
					}
					
				}
				// `{{}}` in an attribute like `class="{{}}"`
				else if(state.attr) {
					
					if(!state.attr.section) {
						state.attr.section = new TextSection();
						if(state.attr.value) {
							state.attr.section.add(state.attr.value)
						}
					}
					makeRendererAndUpdateSection(state.attr.section, first, text );
				} 
				// `{{}}` in a tag like `<div {{}}>`
				else if(state.node) {
					
					if(!state.node.attributes) {
						state.node.attributes = [];
					}
					if(!first) {
						state.node.attributes.push( mustacheCore.makeLiveBindingBranchRenderer( null,text, copyState() ) );
					} else if( first === "#" ) {
						if(!state.node.section) {
							state.node.section = new TextSection();
						}
						makeRendererAndUpdateSection(state.node.section, first, text );
					} else {
						throw first+" is currently not supported within a tag."
					}
					
					
					
				} else {
					makeRendererAndUpdateSection(section, first, text );
				}
			},
			comment: function( text ) {
				// create comment node
				section.add({
					comment: text
				})
			},
			done: function(){}
		});

		return section.compile();
	};
	

	

	can.extend(stache, mustacheHelpers)
	
	stache.safeString = function(text){
		return {
				toString: function () {
					return text;
				}
			};
	}
	
	can.view.register({
		suffix: "stache",

		contentType: "x-stache-template",

		// Returns a `function` that renders the view.

		renderer: function (id, text) {
			return stache(text);
		}
	});
	can.view.ext = ".stache";
	
	return can.stache;
	
})
