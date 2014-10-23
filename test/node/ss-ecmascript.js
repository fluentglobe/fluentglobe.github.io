var expect = require('chai').expect,
    path = require('path'),
    es = require('../../lib/ss/amdclean'),
    _ = require('lodash');

var FNs = {
            "describeEnum": function(name) {
                var values = [];
                switch(name) {
                    case 'NUMS':
                        values = ['1','2','3','4','5'];
                        break;
                }
                return {
                    name: name,
                    values: values
                };
            },

            "list1": function(a,b) {
                var r = [];
                for(var i=0,arg; arg = arguments[i]; ++i) r.push("_"+arg+"_");
                return r
            }
        };


describe('SS ECMAScript',function() {

    var formatter = es.init(path.join(__dirname,'..'))

    it('should render blank ES file', function(done) {
        var filePath = path.join(__dirname,'../blank.js'),
            options = {};
        debugger;
        formatter.compile(filePath, options, function(output) {

            expect(output).to.equal('');
            done();
        });
    });
});

