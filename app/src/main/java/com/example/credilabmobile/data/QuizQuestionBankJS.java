package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionBankJS {

        public static List<QuizQuestion> getQuestions(String difficulty) {
                List<QuizQuestion> list = new ArrayList<>();
                switch (difficulty) {
                        case "easy":
                                addEasy(list);
                                break;
                        case "medium":
                                addMedium(list);
                                break;
                        case "hard":
                                addHard(list);
                                break;
                }
                return list;
        }

        private static QuizQuestion q(int id, String question, String a, String b, String c, String d, int correct) {
                return new QuizQuestion(id, question, new String[] { a, b, c, d }, correct);
        }

        private static void addEasy(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```javascript\nconsole.log(typeof 42);\n```", "number", "integer", "int", "float", 0));
                l.add(q(2, "Which keyword declares a block-scoped variable?", "let", "var", "define", "set", 0));
                l.add(q(3, "What does this print?\n```javascript\nconsole.log('Hello' + ' ' + 'World');\n```", "Hello World", "HelloWorld",
                                "Error", "undefined", 0));
                l.add(q(4, "What is the file extension for JavaScript?", ".js", ".java", ".jsx", ".jscript", 0));
                l.add(q(5, "What is the output?\n```javascript\nlet x = 10;\nx += 5;\nconsole.log(x);\n```", "15", "10", "5", "Error", 0));
                l.add(q(6, "Which symbol is used for single-line comments in JS?", "//", "#", "--", "/*", 0));
                l.add(q(7, "What does this print?\n```javascript\nconsole.log(typeof 'hello');\n```", "string", "text", "str", "String",
                                0));
                l.add(q(8, "What does '===' check?", "Value and type equality", "Only value equality", "Only type",
                                "Reference", 0));
                l.add(q(9, "What is the output?\n```javascript\nlet arr = [1, 2, 3];\nconsole.log(arr.length);\n```", "3", "2", "4",
                                "Error", 0));
                l.add(q(10, "Which method adds an element to the end of an array?", "push()", "add()", "append()",
                                "insert()", 0));
                l.add(q(11, "What does this print?\n```javascript\nlet x = 5;\nlet y = '5';\nconsole.log(x == y);\n```", "true", "false",
                                "Error", "undefined", 0));
                l.add(q(12, "What value does 'null' represent?", "Intentional absence of value", "0", "undefined",
                                "false", 0));
                l.add(q(13, "What is the output?\n```javascript\nconsole.log(Math.max(3, 7, 1));\n```", "7", "3", "1", "Error", 0));
                l.add(q(14, "Which keyword defines a constant?", "const", "let", "var", "final", 0));
                l.add(q(15, "What does this print?\n```javascript\nlet s = 'JavaScript';\nconsole.log(s.slice(0, 4));\n```", "Java", "Jav",
                                "JavaS", "Error", 0));
                l.add(q(16, "What does 'undefined' mean?", "Variable declared but not assigned", "null", "0", "Error",
                                0));
                l.add(q(17, "What is the output?\n```javascript\nlet a = [1, 2, 3];\na.pop();\nconsole.log(a);\n```", "[1, 2]", "[2, 3]",
                                "[1, 2, 3]", "Error", 0));
                l.add(q(18, "How do you write an arrow function?", "const f = () => {}", "function f() =>", "def f():",
                                "fn f() {}", 0));
                l.add(q(19, "What does this print?\n```javascript\nconsole.log(3 + 4 + '5');\n```", "75", "345", "12", "Error", 0));
                l.add(q(20, "Which method converts a string to a number?", "parseInt()", "toNumber()", "Number.parse()",
                                "convert()", 0));
                l.add(q(21, "What is the output?\n```javascript\nlet x = true;\nlet y = false;\nconsole.log(x && y);\n```", "false", "true",
                                "Error", "null", 0));
                l.add(q(22, "What does JSON stand for?", "JavaScript Object Notation", "Java Standard Object Notation",
                                "JavaScript Online Network", "Java Syntax Object Naming", 0));
                l.add(q(23, "What does this print?\n```javascript\nlet obj = {a: 1, b: 2};\nconsole.log(obj.a);\n```", "1", "2",
                                "undefined", "Error", 0));
                l.add(q(24, "Which loop iterates over array values?", "for...of", "for...in", "while...of", "each", 0));
                l.add(q(25, "What is the output?\n```javascript\nlet s = 'hello';\nconsole.log(s.toUpperCase());\n```", "HELLO", "hello",
                                "Hello", "Error", 0));
                l.add(q(26, "How do you check if a variable is an array?", "Array.isArray()", "typeof === 'array'",
                                "isArray()", ".isArray", 0));
                l.add(q(27, "What does this print?\n```javascript\nfor (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n```", "0 1 2",
                                "1 2 3", "0 1 2 3", "Error", 0));
                l.add(q(28, "What is NaN?", "Not a Number", "Null and None", "Negative number", "New assigned null",
                                0));
                l.add(q(29, "What is the output?\n```javascript\nconsole.log('5' - 3);\n```", "2", "53", "Error", "NaN", 0));
                l.add(q(30, "Which method finds an element in an array?", "find()", "search()", "locate()", "get()",
                                0));
                l.add(q(31, "What does this print?\n```javascript\nlet a = [1, 2, 3];\nconsole.log(a.includes(2));\n```", "true", "false",
                                "Error", "undefined", 0));
                l.add(q(32, "What is a template literal?", "String with backticks allowing expressions",
                                "A regular string", "An HTML template", "A function", 0));
                l.add(q(33, "What is the output?\n```javascript\nlet x = 10;\nconsole.log(x > 5 ? 'big' : 'small');\n```", "big", "small",
                                "Error", "undefined", 0));
                l.add(q(34, "Which method joins array elements into a string?", "join()", "concat()", "merge()",
                                "combine()", 0));
                l.add(q(35, "What does this print?\n```javascript\nlet name = 'World';\nconsole.log(`Hello ${name}!`);\n```",
                                "Hello World!", "Hello ${name}!", "Error", "undefined", 0));
                l.add(q(36, "What does 'typeof null' return?", "object", "null", "undefined", "boolean", 0));
                l.add(q(37, "What is the output?\n```javascript\nlet a = [3, 1, 4, 1, 5];\na.sort();\nconsole.log(a[0]);\n```", "1", "3",
                                "5", "Error", 0));
                l.add(q(38, "How do you get the current date?", "new Date()", "Date.now()", "Date.current()",
                                "getDate()", 0));
                l.add(q(39, "What does this print?\n```javascript\nconsole.log(Boolean(''));\n```", "false", "true", "Error", "undefined",
                                0));
                l.add(q(40, "Which method removes the first array element?", "shift()", "pop()", "remove()", "delete()",
                                0));
                l.add(q(41, "What is the output?\n```javascript\nlet obj = {x: 1};\nconsole.log('x' in obj);\n```", "true", "false",
                                "Error", "1", 0));
                l.add(q(42, "What is the spread operator?", "... (three dots)", "** (double star)", "-> (arrow)",
                                "<< (shift)", 0));
                l.add(q(43, "What does this print?\n```javascript\nlet a = [1, 2, 3];\nlet b = [...a, 4];\nconsole.log(b);\n```",
                                "[1, 2, 3, 4]", "[1, 2, 3]", "[4, 1, 2, 3]", "Error", 0));
                l.add(q(44, "What is destructuring?", "Extracting values from arrays/objects", "Deleting variables",
                                "Creating classes", "Sorting data", 0));
                l.add(q(45, "What is the output?\n```javascript\nconst {a, b} = {a: 1, b: 2, c: 3};\nconsole.log(a + b);\n```", "3", "12",
                                "undefined", "Error", 0));
                l.add(q(46, "Which method creates a new array from calling a function on each element?", "map()",
                                "forEach()", "filter()", "reduce()", 0));
                l.add(q(47, "What does this print?\n```javascript\nlet nums = [1, 2, 3];\nlet doubled = nums.map(n => n * 2);\nconsole.log(doubled);\n```",
                                "[2, 4, 6]", "[1, 2, 3]", "[1, 4, 9]", "Error", 0));
                l.add(q(48, "What is an IIFE?", "Immediately Invoked Function Expression",
                                "Internal Interface For Events", "Inline If-Else", "Imported Item Function", 0));
                l.add(q(49, "What is the output?\n```javascript\nconsole.log([1,2,3].filter(n => n > 1));\n```", "[2, 3]", "[1]",
                                "[1, 2, 3]", "Error", 0));
                l.add(q(50, "What does 'use strict' do?", "Enables strict mode for safer code", "Imports modules",
                                "Creates classes", "Defines constants", 0));
        }

        private static void addMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```javascript\nconsole.log([] == false);\n```", "true", "false", "Error", "undefined", 0));
                l.add(q(2, "What is a closure?", "A function that remembers its lexical scope", "A class method",
                                "A loop type", "An error handler", 0));
                l.add(q(3, "What does this print?\n```javascript\nfunction outer() {\n  let x = 10;\n  return function() {\n    return x;\n  };\n}\nconsole.log(outer()());\n```",
                                "10", "undefined", "Error", "null", 0));
                l.add(q(4, "What is hoisting?", "Variables/functions moved to top of scope", "Importing modules",
                                "Creating classes", "Error handling", 0));
                l.add(q(5, "What is the output?\n```javascript\nconsole.log(foo);\nvar foo = 'bar';\n```", "undefined", "bar", "Error",
                                "null", 0));
                l.add(q(6, "What is the event loop?", "Mechanism that handles async callbacks", "A for loop",
                                "An HTML event", "A CSS animation", 0));
                l.add(q(7, "What does this print?\n```javascript\nconst p = new Promise((res) => res(42));\np.then(v => console.log(v));\n```",
                                "42", "undefined", "Error", "Promise", 0));
                l.add(q(8, "What is 'this' in a regular function call?", "The global object (or undefined in strict)",
                                "The function itself", "The parent scope", "null", 0));
                l.add(q(9, "What is the output?\n```javascript\nconst obj = {\n  name: 'JS',\n  greet() {\n    return `Hi ${this.name}`;\n  }\n};\nconsole.log(obj.greet());\n```",
                                "Hi JS", "Hi undefined", "Error", "Hi null", 0));
                l.add(q(10, "What does Object.freeze() do?", "Prevents modification of object properties",
                                "Copies an object", "Deletes an object", "Sorts properties", 0));
                l.add(q(11, "What does this print?\n```javascript\nconst a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);\n```",
                                "4", "3", "Error", "undefined", 0));
                l.add(q(12, "What is the prototype chain?", "Objects inheriting properties from prototypes",
                                "An array method", "A CSS selector", "A build tool", 0));
                l.add(q(13, "What is the output?\n```javascript\nconsole.log(0.1 + 0.2 === 0.3);\n```", "false", "true", "Error", "NaN",
                                0));
                l.add(q(14, "What does async/await do?", "Simplifies working with Promises", "Creates threads",
                                "Imports modules", "Defines classes", 0));
                l.add(q(15, "What does this print?\n```javascript\nasync function f() {\n  return 'hello';\n}\nf().then(v => console.log(v));\n```",
                                "hello", "undefined", "Error", "Promise", 0));
                l.add(q(16, "What is a Symbol?", "A unique immutable primitive", "A string type", "An object",
                                "A number", 0));
                l.add(q(17, "What is the output?\n```javascript\nconst s = new Set([1, 2, 2, 3, 3]);\nconsole.log(s.size);\n```", "3", "5",
                                "2", "Error", 0));
                l.add(q(18, "What does the nullish coalescing operator ?? do?",
                                "Returns right operand if left is null/undefined", "Logical OR", "Logical AND",
                                "Type check", 0));
                l.add(q(19, "What does this print?\n```javascript\nlet x = null;\nconsole.log(x ?? 'default');\n```", "default", "null",
                                "undefined", "Error", 0));
                l.add(q(20, "What is optional chaining?", "Safely access nested properties with ?.", "Ternary operator",
                                "Null check", "Exception handling", 0));
                l.add(q(21, "What is the output?\n```javascript\nconst obj = {a: {b: {c: 42}}};\nconsole.log(obj?.a?.b?.c);\n```", "42",
                                "undefined", "Error", "null", 0));
                l.add(q(22, "What is a WeakMap?", "Map where keys are weakly referenced", "A small Map", "A cached Map",
                                "A sorted Map", 0));
                l.add(q(23, "What does this print?\n```javascript\nconst [a, ...rest] = [1, 2, 3, 4];\nconsole.log(rest);\n```",
                                "[2, 3, 4]", "[1, 2, 3, 4]", "[1]", "Error", 0));
                l.add(q(24, "What is debouncing?", "Delays function execution until after quiet period",
                                "Canceling events", "Caching results", "Sorting data", 0));
                l.add(q(25, "What is the output?\n```javascript\n[1,2,3].reduce((acc, n) => acc + n, 0);\n// Returns:\n```", "6", "123",
                                "0", "Error", 0));
                l.add(q(26, "What does Object.keys() return?", "An array of property names", "An array of values",
                                "A Map", "An object", 0));
                l.add(q(27, "What does this print?\n```javascript\nconst m = new Map();\nm.set('a', 1);\nm.set('b', 2);\nconsole.log(m.get('a'));\n```",
                                "1", "2", "undefined", "Error", 0));
                l.add(q(28, "What is a generator function?", "Function that can pause and resume with yield",
                                "An async function", "A callback", "A class method", 0));
                l.add(q(29, "What is the output?\n```javascript\nfunction* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\nconsole.log(g.next().value);\n```",
                                "1", "2", "undefined", "Error", 0));
                l.add(q(30, "What is the purpose of Proxy?", "Intercept and customize operations on objects",
                                "Copy objects", "Delete objects", "Sort objects", 0));
                l.add(q(31, "What does this print?\n```javascript\nconsole.log(typeof function(){});\n```", "function", "object",
                                "undefined", "Error", 0));
                l.add(q(32, "What is memoization?", "Caching function results for efficiency", "Memory allocation",
                                "Garbage collection", "Sorting", 0));
                l.add(q(33, "What is the output?\n```javascript\nconst arr = [1, [2, [3]]];\nconsole.log(arr.flat(Infinity));\n```",
                                "[1, 2, 3]", "[1, [2, [3]]]", "[1, 2, [3]]", "Error", 0));
                l.add(q(34, "What does Object.assign() do?", "Copies properties from source to target object",
                                "Creates new object", "Deletes properties", "Freezes object", 0));
                l.add(q(35, "What does this print?\n```javascript\nconst {a: x, b: y} = {a: 1, b: 2};\nconsole.log(x, y);\n```", "1 2",
                                "a b", "undefined", "Error", 0));
                l.add(q(36, "What are tagged template literals?", "Functions called with template literal parts",
                                "HTML templates", "CSS selectors", "Regular expressions", 0));
                l.add(q(37, "What is the output?\n```javascript\nconsole.log([...'hello']);\n```", "['h','e','l','l','o']", "['hello']",
                                "Error", "undefined", 0));
                l.add(q(38, "What is tree shaking?", "Removing unused code during bundling", "Sorting imports",
                                "Caching modules", "Compressing files", 0));
                l.add(q(39, "What does this print?\n```javascript\nconst p = Promise.all([1, 2, 3].map(n =>\n  Promise.resolve(n * 2)\n));\np.then(v => console.log(v));\n```",
                                "[2, 4, 6]", "[1, 2, 3]", "Error", "6", 0));
                l.add(q(40, "What is the temporal dead zone?", "Period where let/const exists but can't be accessed",
                                "A memory region", "A time function", "A cache zone", 0));
                l.add(q(41, "What is the output?\n```javascript\nlet x = 1;\n{\n  let x = 2;\n}\nconsole.log(x);\n```", "1", "2", "Error",
                                "undefined", 0));
                l.add(q(42, "What does structuredClone() do?", "Deep copies objects", "Shallow copies objects",
                                "Freezes objects", "Deletes objects", 0));
                l.add(q(43, "What does this print?\n```javascript\nconsole.log(Number.isInteger(5.0));\n```", "true", "false", "Error",
                                "undefined", 0));
                l.add(q(44, "What is currying?", "Transforming function of n args into chain of single-arg functions",
                                "Caching", "Memoizing", "Sorting", 0));
                l.add(q(45, "What is the output?\n```javascript\nconst f = a => b => a + b;\nconsole.log(f(2)(3));\n```", "5", "23",
                                "Error", "undefined", 0));
                l.add(q(46, "What is the purpose of Reflect API?", "Provides methods for interceptable operations",
                                "DOM manipulation", "CSS styling", "HTTP requests", 0));
                l.add(q(47, "What does this print?\n```javascript\nconst obj = {a:1, b:2, c:3};\nconst entries = Object.entries(obj);\nconsole.log(entries.length);\n```",
                                "3", "6", "2", "Error", 0));
                l.add(q(48, "What is the difference between null and undefined?",
                                "null is intentional, undefined is unassigned", "They are identical",
                                "null is a number", "undefined is a string", 0));
                l.add(q(49, "What is the output?\n```javascript\nconsole.log([1,2,3].every(n => n > 0));\n```", "true", "false", "Error",
                                "undefined", 0));
                l.add(q(50, "What does Array.from() do?", "Creates array from iterable/array-like", "Copies an array",
                                "Sorts an array", "Filters an array", 0));
        }

        private static void addHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```javascript\nconsole.log([] + []);\n```", "'' (empty string)", "[]", "0", "Error", 0));
                l.add(q(2, "What is the event loop's microtask queue?", "Higher priority queue for Promises",
                                "A setTimeout queue", "A DOM event queue", "A CSS animation queue", 0));
                l.add(q(3, "What does this print?\n```javascript\nPromise.resolve()\n  .then(() => console.log(1))\n  .then(() => console.log(2));\nconsole.log(3);\n```",
                                "3 1 2", "1 2 3", "3 2 1", "Error", 0));
                l.add(q(4, "What is a SharedArrayBuffer?", "Memory shared between threads", "A regular array",
                                "A typed string", "A cached buffer", 0));
                l.add(q(5, "What does this print?\n```javascript\nconsole.log(typeof NaN);\n```", "number", "NaN", "undefined", "Error",
                                0));
                l.add(q(6, "What is tail call optimization?", "Reusing stack frame for tail position calls",
                                "Loop optimization", "Memory caching", "Variable hoisting", 0));
                l.add(q(7, "What is the output?\n```javascript\nconst a = {};\nconst b = {key: 'b'};\nconst c = {key: 'c'};\na[b] = 123;\na[c] = 456;\nconsole.log(a[b]);\n```",
                                "456", "123", "undefined", "Error", 0));
                l.add(q(8, "What is the Proxy handler trap for property access?", "get", "set", "apply", "has", 0));
                l.add(q(9, "What does this print?\n```javascript\nfunction Dog(name) {\n  this.name = name;\n}\nDog.prototype.bark = function() {\n  return `${this.name} barks`;\n};\nconsole.log(new Dog('Rex').bark());\n```",
                                "Rex barks", "undefined barks", "Error", "null", 0));
                l.add(q(10, "What is the Temporal API proposal for?", "Better date/time handling", "Memory management",
                                "Threading", "Networking", 0));
                l.add(q(11, "What is the output?\n```javascript\nconsole.log(+'');\n```", "0", "NaN", "undefined", "Error", 0));
                l.add(q(12, "What is a FinalizationRegistry?", "Callback when objects are garbage collected",
                                "A class registry", "A module cache", "An event listener", 0));
                l.add(q(13, "What does this print?\n```javascript\nconst handler = {\n  get(t, p) { return p in t ? t[p] : 37; }\n};\nconst p = new Proxy({}, handler);\np.a = 1;\nconsole.log(p.a, p.b);\n```",
                                "1 37", "1 undefined", "Error", "37 37", 0));
                l.add(q(14, "What is an AsyncIterator?", "Iterator that returns Promises", "A sync loop", "A callback",
                                "An event emitter", 0));
                l.add(q(15, "What is the output?\n```javascript\nasync function* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\ng.next().then(v => console.log(v.value));\n```",
                                "1", "2", "undefined", "Error", 0));
                l.add(q(16, "What is ECMA-262?", "The JavaScript language specification", "A browser API",
                                "A CSS standard", "An HTML version", 0));
                l.add(q(17, "What does this print?\n```javascript\nconst sym = Symbol('test');\nconsole.log(typeof sym);\n```", "symbol",
                                "string", "object", "Error", 0));
                l.add(q(18, "What is the purpose of WeakRef?", "Hold weak reference to object without preventing GC",
                                "Strong reference", "Copy reference", "Delete reference", 0));
                l.add(q(19, "What is the output?\n```javascript\nconsole.log(1 < 2 < 3);\nconsole.log(3 > 2 > 1);\n```", "true false",
                                "true true", "false false", "Error", 0));
                l.add(q(20, "What is import.meta?", "Metadata about the current module", "An import function",
                                "A class property", "A global variable", 0));
                l.add(q(21, "What does this print?\n```javascript\nconst arr = [1, 2, 3];\nObject.freeze(arr);\ntry { arr.push(4); } catch(e) {\n  console.log('frozen');\n}\n```",
                                "frozen", "undefined", "[1,2,3,4]", "Error", 0));
                l.add(q(22, "What is a Realm in JavaScript?", "A distinct global environment", "A variable scope",
                                "A class type", "An async context", 0));
                l.add(q(23, "What is the output?\n```javascript\nconsole.log(JSON.stringify({a: undefined, b: 1}));\n```", "{\"b\":1}",
                                "{\"a\":undefined,\"b\":1}", "Error", "{}", 0));
                l.add(q(24, "What does Atomics.wait() do?", "Blocks thread until notified", "Copies memory",
                                "Sorts array", "Creates buffer", 0));
                l.add(q(25, "What does this print?\n```javascript\nfunction foo() {\n  return\n  {\n    bar: 'hello'\n  };\n}\nconsole.log(foo());\n```",
                                "undefined", "{bar: 'hello'}", "Error", "hello", 0));
                l.add(q(26, "What is the TC39 process?", "Standardized proposal stages for JS features",
                                "A testing framework", "A build process", "A deployment pipeline", 0));
                l.add(q(27, "What is the output?\n```javascript\nconst a = [1, 2, 3];\nconst it = a[Symbol.iterator]();\nconsole.log(it.next().value);\n```",
                                "1", "[1,2,3]", "undefined", "Error", 0));
                l.add(q(28, "What is AbortController used for?", "Canceling fetch requests and other async operations",
                                "Creating controllers", "DOM manipulation", "CSS animations", 0));
                l.add(q(29, "What does this print?\n```javascript\nObject.is(NaN, NaN);\n```", "true", "false", "Error", "NaN", 0));
                l.add(q(30, "What is the V8 engine?", "Google's JavaScript runtime engine", "A CSS engine",
                                "An HTML parser", "A database engine", 0));
                l.add(q(31, "What is the output?\n```javascript\nconsole.log(void 0 === undefined);\n```", "true", "false", "Error", "null",
                                0));
                l.add(q(32, "What is the Intl API?", "Internationalization API for formatting dates/numbers/strings",
                                "An internal API", "A network API", "A database API", 0));
                l.add(q(33, "What does this print?\n```javascript\nconsole.log(\n  Object.getPrototypeOf([]) === Array.prototype\n);\n```",
                                "true", "false", "Error", "undefined", 0));
                l.add(q(34, "What is a Service Worker?", "Script that runs in background for caching/offline",
                                "A web thread", "A DOM element", "A CSS feature", 0));
                l.add(q(35, "What is the output?\n```javascript\nconst p1 = Promise.resolve(1);\nconst p2 = Promise.reject(2);\nPromise.allSettled([p1, p2])\n  .then(r => console.log(r.length));\n```",
                                "2", "1", "Error", "undefined", 0));
                l.add(q(36, "What is ArrayBuffer?", "Raw binary data buffer", "A typed array", "A regular array",
                                "A string buffer", 0));
                l.add(q(37, "What does this print?\n```javascript\nconst m = new Map();\nm.set(NaN, 'test');\nconsole.log(m.get(NaN));\n```",
                                "test", "undefined", "Error", "NaN", 0));
                l.add(q(38, "What is the difference between call() and apply()?",
                                "call takes args individually, apply takes array", "They are identical",
                                "apply is faster", "call is deprecated", 0));
                l.add(q(39, "What is the output?\n```javascript\n(function(){\n  var a = b = 3;\n})();\nconsole.log(typeof b);\n```",
                                "number", "undefined", "Error", "string", 0));
                l.add(q(40, "What is Structured Cloning?", "Algorithm for deep copying complex objects", "JSON parsing",
                                "Object freezing", "Property enumeration", 0));
                l.add(q(41, "What does this print?\n```javascript\nconsole.log(\n  Number.MAX_SAFE_INTEGER + 1 ===\n  Number.MAX_SAFE_INTEGER + 2\n);\n```",
                                "true", "false", "Error", "NaN", 0));
                l.add(q(42, "What is the Records & Tuples proposal?", "Immutable data structures for JS",
                                "A database feature", "A CSS feature", "A sorting algorithm", 0));
                l.add(q(43, "What is the output?\n```javascript\nconsole.log(typeof typeof 1);\n```", "string", "number", "object", "Error",
                                0));
                l.add(q(44, "What is ResizeObserver?", "API to observe element size changes", "A CSS property",
                                "A DOM event", "A window method", 0));
                l.add(q(45, "What does this print?\n```javascript\nconst a = [1,[2,3]];\nconst b = structuredClone(a);\nb[1].push(4);\nconsole.log(a[1].length);\n```",
                                "2", "3", "Error", "undefined", 0));
                l.add(q(46, "What is Top-Level Await?", "Using await outside async functions in modules",
                                "A loop feature", "A class method", "An error handler", 0));
                l.add(q(47, "What is the output?\n```javascript\nconst reg = /hello/gi;\nconsole.log(reg.test('Hello World'));\n```",
                                "true", "false", "Error", "undefined", 0));
                l.add(q(48, "What is a Tagged Template?", "Function receiving template literal parts separately",
                                "An HTML tag", "A CSS class", "A DOM element", 0));
                l.add(q(49, "What does this print?\n```javascript\nconsole.log(\n  'b' + 'a' + + 'a' + 'a'\n);\n```", "baNaNa", "baaa",
                                "baa", "Error", 0));
                l.add(q(50, "What is the Decorator proposal?", "Syntax for modifying classes/methods declaratively",
                                "A CSS feature", "An HTML attribute", "A testing tool", 0));
        }
}