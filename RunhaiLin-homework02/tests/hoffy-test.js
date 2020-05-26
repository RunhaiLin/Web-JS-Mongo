const chai = require('chai');
const expect = chai.expect; 
const path = require('path');
require('mocha-sinon');
Object.assign(global, require(path.join(__dirname, '../src/hoffy.js')));

// use to test console output while still allowing console.log
// to _actually_ output to screen
// source: http://stackoverflow.com/a/30626035
function mockConsoleOutput() {
    const log = console.log;
    this.sinon.stub(console, 'log').callsFake(function(...args) {
        return log(...args);
    });
}
describe('hoffy', function() {

    describe('sum', function() {
        it('returns the sum of all arguments passed in', function() {
            expect(sum(1, 2, 3)).to.equal(6);
            expect(sum(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)).to.equal(10);
            expect(sum(1)).to.equal(1);
        });
        it('returns 0 if there are no arguments passed in', function() {
            expect(sum()).to.equal(0);
        });
    });

    describe('callFn', function() {

        beforeEach(mockConsoleOutput);

        it('calls function n times', function() {
            const n = 2;
            callFn(console.log, n, "Hello!");
            expect(console.log.callCount).to.equal(n);
            expect(console.log.alwaysCalledWithExactly('Hello!')).to.be.true;
        });
    });

    describe('betterCallFn', function() {

        beforeEach(mockConsoleOutput);

        it('calls function n times, allows arbitrary number of arguments', function() {
            const n = 2;
            betterCallFn(console.log, n, "foo", "bar", "baz", "qux", "quxx", "corge");
            expect(console.log.callCount).to.equal(n);
            expect(console.log.alwaysCalledWithExactly('foo','bar', 'baz', 'qux', 'quxx', 'corge')).to.be.true;
        });
    });

    describe('opposite', function() {
        it('create a new function from an old function such that the new function returns the opposite value of what the original function would have returned', function() {
            const isUpper = s => s.toUpperCase() === s;
            const isLower = opposite(isUpper);

            const isSmol = s => s.length < 3;
            const isBig = opposite(isSmol);
            expect(isLower('ABSTENTIOUS') === !isUpper('ABSTENTIOUS')).to.be.true;
            expect(isBig('hi') === !isSmol('hi')).to.be.true;
        });
    });

    describe('bucket', function() {
        it('creates an array with two nested arrays containing elements that did and did not pass the test function', function() {
            const numbers = [1, 7, 2, 5, 30];
            const result = bucket(numbers, n => n % 2 === 0);
            expect(result).to.eql([[ 2, 30 ], [ 1, 7, 5 ]]);
        });
    });

    describe('addPermissions', function() {
        beforeEach(mockConsoleOutput);

        it('calls function if first argument has property, admin, that is exactly true', function() {
            const myParseInt = addPermissions(parseInt);
            expect(myParseInt({admin: true}, '101', 2)).to.equal(5);
        });
        it('does not call function (and returns undefined) if first argument does not have property, admin, that is exactly true', function() {
            const myParseInt = addPermissions(parseInt);
            expect(myParseInt({admin: 5}, '101', 2)).to.be.undefined;   
            expect(myParseInt(5, '101', 2)).to.be.undefined;   
        });
        it('does not call function (and returns undefined) if first argument is null or undefined', function() {
            const myParseInt = addPermissions(parseInt);
            expect(myParseInt(null, '101', 2)).to.be.undefined;
            expect(myParseInt(undefined, '101', 2)).to.be.undefined;
        });
    });

    describe('myReadFile', function() {
        it('calls a success function (passed as the 2nd argument) if the file is read successfully', function(done) {
            myReadFile('tests/words.txt', (data) => {
                expect(data).to.equal("ant bat\ncat dog emu\nfox\n");
                done();
            }, err => console.log('Error opening file:', err));
        });
        it('calls an error function (passed as the 3rd argument) if an error occurs while reading the file', function(done) {
            myReadFile('tests/fileDoesNotExist.txt', console.log, err => {
                expect(err).to.be.not.null;
                done();
            });
        });
    });

    describe('readAndExtractWith', function() {
        it('returns a function that can be used to extract data from file', function(done) {
            const getWords = (s) => s.trim().split('\n').reduce((words, line) => [...words, ...line.split(' ')], []);
            const f = readAndExtractWith(getWords);
            f('tests/words.txt', (data) => {
                expect(data).to.eql(['ant', 'bat', 'cat', 'dog',  'emu', 'fox']);
                done();            
            }, console.log.bind(null, 'ERROR'));
        });
        it('returned function calls an error function (passed as the 3rd argument) if an error occurs while reading the file', function(done) {
            const getWords = (s) => s.trim().split('\n').reduce((words, line) => [...words, ...line.split(' ')], []);
            const f = readAndExtractWith(getWords);
            f('tests/fileDoesNotExist.txt', console.log, err => {
                expect(err).to.be.not.null;
                done();
            });
        });
    });

    describe('rowsToObjects', function() {
        it('converts headers and rows (as arrays within an object) into a single array of objects', function() {
            const headers = ['a', 'b', 'c'];
            const rows = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
            const expected = [{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}, {a: 7, b: 8, c: 9}];
            expect(rowsToObjects({headers, rows})).to.eql(expected);
        });
    });
});


