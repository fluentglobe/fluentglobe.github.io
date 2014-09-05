!function() {

var testCmd = ProtectedPresentation.byId["test-cmd"];
testCmd.addSpoken("one", {
	mp3: "one.mp3",
	ogg: "one.ogg"
}, "main");

testCmd.addSpoken("two", {
	mp3: "two.mp3",
	ogg: "two.ogg"
}, "main");


testCmd.addSpoken("one", {
	mp3: "one.mp3",
	ogg: "one.ogg"
}, "a");

testCmd.addSpoken("two", {
	mp3: "two.mp3",
	ogg: "two.ogg"
}, "a");


testCmd.addSpoken("one", {
	mp3: "one.mp3",
	ogg: "one.ogg"
}, "b");

testCmd.addSpoken("two", {
	mp3: "two.mp3",
	ogg: "two.ogg"
}, "b");


}();