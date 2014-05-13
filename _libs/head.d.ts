declare var Modernizr;

declare function Resolver() : any;
declare function Resolver(expr : String) : any;
declare function Resolver(name : String,ns) : any;

declare module Resolver {
	function config(el : Element) : void;
	function config(el : Element,expr : String) : void;	
	function functionProxy(src) : Function;
	function docMethod(name,fn) : void;
	function exists(name) : Boolean;
	function hasGenerator(subject) : Boolean;

	function getByUniqueID(map,el,forceID) : any;
	function setByUniqueID(map,el,value) : void;
}

declare function Generator(fn) : Function;

interface Document  { //TODO extends HTMLDocument
	essential:any;
}

declare var angular;

// require
declare var module;
declare function require(path) : any;