// #can/view/animations/animations.js
//
// This file defines the can-animation attributes for
// animating elements on certain events. These are usable
// in any mustache template, but are documented primarily
// for use within can.Component

// ## can-aninimation
// 
// ### Usage
// 
//    <div can-animation="{ANIMATIONKEY}"></div>
//    
// Animationkey should either specify:
//  * A set of CSS properties to animate toward
//  * An jQuery `animate` object
//  
//  This can be used to specify all animation options in a
//  single object instead of specifying individual attributes.
//  It also exposes certain options in jQuery's `animate` function
//  not exposed as a can-attribute.

// ## can-animation-duration
// 
// ### Usage
// 
//    <div can-animation-duration="slow" can-animation="{ANIMATIONKEY}"></div>
//    
// Specify the duration of the animation as:
//  * A string
//    * slow: 600ms
//    * fast: 200ms
//  * A number, specifying duration in milliseconds
//  
//  If not specified, the duration will be 400ms.

// ## can-animation-WHEN
// 
// ### Usage
// 
//    <div can-animation-inserted="{animationkey}"></div>
//    <div can-animation-removed="{animationkey}"></div>
//    <div can-animation-when="{truthyProperty}"></div>
//    <div can-animation-when="{scope} property"></div>
//    <ul can-animation-when="li click"></ul>
//    
// Specify when the animation should take place.
// 
// #### can-animation-inserted
// 
//    The animation will be performed when the element is inserted into
//    the document. By default, the element will be visible when
//    the animation concludes.
// 
// #### can-animation-removed
// 
//    The animation will be performed when the element is removed from
//    the document. At the end of the animation, the element
//    will be removed (and no longer displayed).

// ## can-animation-style
// 
// ### Usage
// 
//    <div can-animation-style="color: green" can-animation-inserted></div>
//    
// Instead of specifying an object of properties in `ANIMATIONKEY`, 
// `can-animation-style` specifies CSS properties to animate toward.

// ## can-animation-start
// 
// ### Usage
// 
//    <div can-animation-start="scopeMethod" can-animation="{ANIMATIONKEY}"></div>
//    
// Specify a method to call when the animation starts.

// ## can-animation-complete
// 
// ### Usage
// 
//    <div can-animation-complete="scopeMethod" can-animation="{ANIMATIONKEY}"></div>
//    
// Specify a method to call when the animation completes. This method will not
// be called if the animation fails or is interrupted.

// Predefined Animations

// ## can-fade-in
// 
// ### Usage
// 
//    <div can-fade-in="slow"></div>
//    
// Perform a fade in animation, at the end of which the element will be visible.
// By default, this will be performed on insertion.
// 
// Optionally, specify a duration.

// ## can-fade-out
// 
// ### Usage
// 
//    <div can-fade-out="fast"></div>
//    
// Perform a fade out animation, at the end of which the element will be hidden.
// By default, this will be performed on removal.
// 
// Optionally, specify a duration.

// ## can-fade-toggle
// 
// ### Usage
// 
//    <div can-fade-toggle="fast" can-animation-when="{property}"></div>
//    
// Perform a fade in if hidden or fade out if visible. Requires use of can-animation-when.

// ## can-slide-down
// 
// ### Usage
// 
//    <div can-slide-down="slow"></div>
//    
// Perform a slide down animation, at the end of which the element will be visible.
// By default, this will be performed on insertion.

// ## can-slide-up
// 
// ### Usage
// 
//    <div can-slide-up="fast"></div>
//    
// Perform a slide up animation, at the end of which the element will be hidden.
// By default, this will be performed on removal.

// ## can-slide-toggle
// 
// ### Usage
// 
//    <div can-slide-toggle="fast" can-animation-when="{slideChange}"></div>
//    
// Perform a slide in if hidden or slide up if isible. Requires use of can-animation-when.

