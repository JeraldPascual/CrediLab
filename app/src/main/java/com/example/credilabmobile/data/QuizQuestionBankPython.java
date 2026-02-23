package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionBankPython {

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
                l.add(q(1, "What is the output?\nprint(2 + 3)", "5", "23", "Error", "None", 0));
                l.add(q(2, "Which keyword defines a function in Python?", "def", "function", "func", "define", 0));
                l.add(q(3, "What does this print?\nprint(type(42))", "<class 'int'>", "int", "integer", "Error", 0));
                l.add(q(4, "What is the correct file extension for Python?", ".py", ".python", ".pt", ".pn", 0));
                l.add(q(5, "What is the output?\nx = 'Hello'\nprint(len(x))", "5", "4", "6", "Error", 0));
                l.add(q(6, "Which symbol is used for comments in Python?", "#", "//", "--", "/*", 0));
                l.add(q(7, "What does this print?\nprint('Hello' + ' ' + 'World')", "Hello World", "HelloWorld",
                                "Error", "None", 0));
                l.add(q(8, "What is a list in Python?", "An ordered mutable collection", "An immutable sequence",
                                "A dictionary", "A set", 0));
                l.add(q(9, "What is the output?\nprint(10 // 3)", "3", "3.33", "4", "Error", 0));
                l.add(q(10, "Which keyword is used for conditional statements?", "if", "when", "switch", "case", 0));
                l.add(q(11, "What does this print?\na = [1, 2, 3]\nprint(a[0])", "1", "2", "3", "Error", 0));
                l.add(q(12, "What does 'None' represent?", "The absence of a value", "0", "False", "Empty string", 0));
                l.add(q(13, "What is the output?\nprint(10 % 3)", "1", "3", "0", "Error", 0));
                l.add(q(14, "Which method adds to the end of a list?", "append()", "add()", "push()", "insert()", 0));
                l.add(q(15, "What does this print?\nfor i in range(3):\n  print(i, end=' ')", "0 1 2", "1 2 3",
                                "0 1 2 3", "Error", 0));
                l.add(q(16, "What is a tuple?", "An immutable ordered sequence", "A mutable list", "A dictionary",
                                "A set", 0));
                l.add(q(17, "What is the output?\nx = [1, 2, 3]\nx.append(4)\nprint(len(x))", "4", "3", "5", "Error",
                                0));
                l.add(q(18, "Which keyword creates a loop?", "for", "loop", "repeat", "each", 0));
                l.add(q(19, "What does this print?\nprint('Python'[1:4])", "yth", "Pyt", "ytho", "Error", 0));
                l.add(q(20, "What is a dictionary in Python?", "A key-value pair collection", "An ordered list",
                                "A tuple", "A set", 0));
                l.add(q(21, "What is the output?\nd = {'a': 1, 'b': 2}\nprint(d['a'])", "1", "2", "a", "Error", 0));
                l.add(q(22, "Which operator is used for exponentiation?", "**", "^", "^^", "exp", 0));
                l.add(q(23, "What does this print?\nprint(2 ** 3)", "8", "6", "9", "Error", 0));
                l.add(q(24, "What is the 'in' keyword used for?", "Checking membership", "Importing modules",
                                "Creating loops only", "Defining variables", 0));
                l.add(q(25, "What is the output?\nprint(3 in [1, 2, 3])", "True", "False", "Error", "None", 0));
                l.add(q(26, "Which built-in function returns the length?", "len()", "size()", "length()", "count()",
                                0));
                l.add(q(27, "What does this print?\nx = 'hello'\nprint(x.upper())", "HELLO", "hello", "Hello", "Error",
                                0));
                l.add(q(28, "What does 'input()' do?", "Reads user input as a string", "Prints output",
                                "Creates a file", "Imports a module", 0));
                l.add(q(29, "What is the output?\na = [1, 2, 3]\nb = a[:]\nb.append(4)\nprint(len(a))", "3", "4",
                                "Error", "None", 0));
                l.add(q(30, "Which data type is immutable?", "tuple", "list", "dict", "set", 0));
                l.add(q(31, "What does this print?\nprint(bool(''))", "False", "True", "Error", "None", 0));
                l.add(q(32, "What is a set in Python?", "An unordered collection of unique elements", "An ordered list",
                                "A dictionary", "A tuple", 0));
                l.add(q(33, "What is the output?\ns = {1, 2, 2, 3}\nprint(len(s))", "3", "4", "2", "Error", 0));
                l.add(q(34, "Which keyword handles exceptions?", "try", "catch", "handle", "error", 0));
                l.add(q(35, "What does this print?\ntry:\n  x = 1/0\nexcept ZeroDivisionError:\n  print('caught')",
                                "caught", "Error", "None", "0", 0));
                l.add(q(36, "What is a f-string?", "Formatted string literal with f prefix", "A file operation",
                                "A float string", "A function string", 0));
                l.add(q(37, "What is the output?\nname = 'World'\nprint(f'Hello {name}')", "Hello World",
                                "Hello {name}", "Error", "None", 0));
                l.add(q(38, "Which function converts to integer?", "int()", "integer()", "toInt()", "parse()", 0));
                l.add(q(39, "What does this print?\nprint(list(range(1, 4)))", "[1, 2, 3]", "[1, 2, 3, 4]",
                                "[0, 1, 2, 3]", "Error", 0));
                l.add(q(40, "What is list comprehension?", "A concise way to create lists", "A sorting method",
                                "A loop type", "An import statement", 0));
                l.add(q(41, "What is the output?\nprint([x*2 for x in range(3)])", "[0, 2, 4]", "[2, 4, 6]",
                                "[1, 2, 3]", "Error", 0));
                l.add(q(42, "Which keyword imports a module?", "import", "include", "require", "use", 0));
                l.add(q(43, "What does this print?\na, b = 1, 2\nprint(a + b)", "3", "12", "Error", "None", 0));
                l.add(q(44, "What are *args?", "Variable number of positional arguments", "Keyword arguments", "A list",
                                "A decorator", 0));
                l.add(q(45, "What is the output?\ndef add(a, b):\n  return a + b\nprint(add(3, 4))", "7", "34", "Error",
                                "None", 0));
                l.add(q(46, "Which method removes an item by value from a list?", "remove()", "delete()", "pop()",
                                "discard()", 0));
                l.add(q(47, "What does this print?\nx = [3, 1, 4, 1, 5]\nx.sort()\nprint(x[0])", "1", "3", "5", "Error",
                                0));
                l.add(q(48, "What is Python's GIL?", "Global Interpreter Lock", "Global Import Library",
                                "General Input Layer", "Generic Interface Layer", 0));
                l.add(q(49, "What is the output?\nprint('abc' * 3)", "abcabcabc", "abc3", "Error", "None", 0));
                l.add(q(50, "What keyword returns a value from a function?", "return", "give", "send", "output", 0));
        }

        private static void addMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\nprint([i for i in range(10) if i % 2 == 0])", "[0, 2, 4, 6, 8]",
                                "[1, 3, 5, 7, 9]", "[2, 4, 6, 8, 10]", "Error", 0));
                l.add(q(2, "What is a decorator?", "A function that modifies another function", "A class attribute",
                                "A variable type", "An exception", 0));
                l.add(q(3, "What does this print?\ndef outer():\n  x = 10\n  def inner():\n    return x\n  return inner\nprint(outer()())",
                                "10", "Error", "None", "inner", 0));
                l.add(q(4, "What is *args vs **kwargs?", "*args for positional, **kwargs for keyword",
                                "They are the same", "*args for keyword", "**kwargs for positional", 0));
                l.add(q(5, "What is the output?\nd = {'a': 1, 'b': 2}\nd.update({'b': 3, 'c': 4})\nprint(d['b'])", "3",
                                "2", "Error", "None", 0));
                l.add(q(6, "What is a lambda function?", "An anonymous inline function", "A named function", "A class",
                                "A module", 0));
                l.add(q(7, "What does this print?\nf = lambda x, y: x + y\nprint(f(3, 4))", "7", "34", "Error", "None",
                                0));
                l.add(q(8, "What is the purpose of 'yield'?", "Creates a generator function", "Returns a value",
                                "Imports a module", "Creates a class", 0));
                l.add(q(9, "What is the output?\ndef gen():\n  yield 1\n  yield 2\ng = gen()\nprint(next(g))", "1", "2",
                                "Error", "None", 0));
                l.add(q(10, "What is a context manager?", "Manages setup/teardown with 'with' statement", "A variable",
                                "A loop", "A class type", 0));
                l.add(q(11, "What does this print?\nwith open('/dev/null', 'w') as f:\n  print(type(f).__name__)",
                                "TextIOWrapper", "file", "str", "Error", 0));
                l.add(q(12, "What is duck typing?", "Type determined by behavior, not declaration", "Static typing",
                                "Strong typing", "Weak typing", 0));
                l.add(q(13, "What is the output?\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))", "4", "3", "Error",
                                "None", 0));
                l.add(q(14, "What does @staticmethod do?", "Defines method that doesn't need self", "Creates a class",
                                "Imports a module", "Handles exceptions", 0));
                l.add(q(15, "What does this print?\nprint(list(map(lambda x: x**2, [1,2,3])))", "[1, 4, 9]",
                                "[2, 4, 6]", "[1, 2, 3]", "Error", 0));
                l.add(q(16, "What is __init__?", "Constructor method for classes", "A private method",
                                "A static method", "A module", 0));
                l.add(q(17, "What is the output?\nclass Dog:\n  def __init__(self, name):\n    self.name = name\nd = Dog('Rex')\nprint(d.name)",
                                "Rex", "Dog", "Error", "None", 0));
                l.add(q(18, "What is the difference between copy and deepcopy?", "deepcopy copies nested objects too",
                                "They are identical", "copy is deeper", "deepcopy is shallow", 0));
                l.add(q(19, "What does this print?\nfrom collections import Counter\nprint(Counter('abracadabra')['a'])",
                                "5", "4", "3", "Error", 0));
                l.add(q(20, "What is __str__ method?", "Returns human-readable string of object", "Creates a string",
                                "Compares strings", "Deletes strings", 0));
                l.add(q(21, "What is the output?\nprint(sorted([3,1,4,1,5], reverse=True))", "[5, 4, 3, 1, 1]",
                                "[1, 1, 3, 4, 5]", "Error", "None", 0));
                l.add(q(22, "What is a property decorator?", "Allows method to be accessed like attribute", "A loop",
                                "An import", "A class type", 0));
                l.add(q(23, "What does this print?\nprint(dict(zip(['a','b'], [1,2])))", "{'a': 1, 'b': 2}",
                                "[('a',1),('b',2)]", "Error", "None", 0));
                l.add(q(24, "What is multiple inheritance?", "A class inheriting from multiple classes",
                                "Multiple constructors", "Multiple methods", "Multiple modules", 0));
                l.add(q(25, "What is the output?\ndef f(x=[]):\n  x.append(1)\n  return x\nprint(f())\nprint(f())",
                                "[1]\n[1, 1]", "[1]\n[1]", "Error", "None", 0));
                l.add(q(26, "What is an abstract base class?", "A class that can't be instantiated directly",
                                "A regular class", "A module", "A function", 0));
                l.add(q(27, "What does this print?\nprint(any([False, False, True]))", "True", "False", "Error", "None",
                                0));
                l.add(q(28, "What is __slots__?", "Limits instance attributes for memory savings", "A list method",
                                "A string operation", "A module", 0));
                l.add(q(29, "What is the output?\nprint({x: x**2 for x in range(4)})", "{0:0, 1:1, 2:4, 3:9}",
                                "[0, 1, 4, 9]", "Error", "None", 0));
                l.add(q(30, "What does enumerate() do?", "Returns index-value pairs", "Counts elements",
                                "Sorts elements", "Filters elements", 0));
                l.add(q(31, "What does this print?\nfor i, v in enumerate(['a','b','c']):\n  print(i, end=' ')",
                                "0 1 2", "1 2 3", "a b c", "Error", 0));
                l.add(q(32, "What is namedtuple?", "Tuple subclass with named fields", "A regular tuple",
                                "A dictionary", "A list", 0));
                l.add(q(33, "What is the output?\nfrom functools import reduce\nprint(reduce(lambda a,b: a+b, [1,2,3,4]))",
                                "10", "24", "4", "Error", 0));
                l.add(q(34, "What is a metaclass?", "A class whose instances are classes", "A subclass", "A function",
                                "A module", 0));
                l.add(q(35, "What does this print?\nprint(all([True, True, False]))", "False", "True", "Error", "None",
                                0));
                l.add(q(36, "What is the walrus operator?", ":= for assignment expressions", "== for comparison",
                                "!= for inequality", "-> for type hints", 0));
                l.add(q(37, "What is the output?\nif (n := 10) > 5:\n  print(n)", "10", "True", "5", "Error", 0));
                l.add(q(38, "What does @classmethod do?", "Method that receives class as first argument",
                                "A static method", "A private method", "A constructor", 0));
                l.add(q(39, "What does this print?\nx = [1, 2, 3]\nprint(x[::-1])", "[3, 2, 1]", "[1, 2, 3]", "Error",
                                "None", 0));
                l.add(q(40, "What are type hints?", "Optional static type annotations", "Runtime type checks",
                                "Variable declarations", "Error handling", 0));
                l.add(q(41, "What is the output?\nprint(isinstance(True, int))", "True", "False", "Error", "None", 0));
                l.add(q(42, "What is __repr__?", "Returns unambiguous string for debugging", "Prints the object",
                                "Compares objects", "Deletes objects", 0));
                l.add(q(43, "What does this print?\na = (1, 2, 3)\nprint(a + (4, 5))", "(1, 2, 3, 4, 5)",
                                "(1, 2, 3, (4, 5))", "Error", "None", 0));
                l.add(q(44, "What is dataclass?", "Decorator that auto-generates boilerplate methods",
                                "A database class", "A data type", "A file handler", 0));
                l.add(q(45, "What is the output?\nfrom dataclasses import dataclass\n@dataclass\nclass Point:\n  x: int\n  y: int\np = Point(3, 4)\nprint(p.x + p.y)",
                                "7", "34", "Error", "None", 0));
                l.add(q(46, "What is asyncio?", "Library for async I/O programming", "A database library",
                                "A web framework", "A GUI toolkit", 0));
                l.add(q(47, "What does this print?\nprint(' '.join(['Hello', 'World']))", "Hello World", "HelloWorld",
                                "Error", "None", 0));
                l.add(q(48, "What is a coroutine?", "A function that can be paused and resumed", "A regular function",
                                "A class", "A module", 0));
                l.add(q(49, "What is the output?\nprint(list(filter(lambda x: x>2, [1,2,3,4])))", "[3, 4]", "[1, 2]",
                                "[1, 2, 3, 4]", "Error", 0));
                l.add(q(50, "What is __name__ == '__main__'?", "Checks if script is run directly", "Imports a module",
                                "Creates a class", "Starts a loop", 0));
        }

        private static void addHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\ndef f(a, b=[], c={}):\n  b.append(a)\n  c[a] = len(b)\n  return b, c\nprint(f(1))\nprint(f(2))",
                                "([1], {1:1})\n([1,2], {1:1, 2:2})", "([1], {1:1})\n([2], {2:1})", "Error", "None", 0));
                l.add(q(2, "What is the descriptor protocol?", "Objects defining __get__, __set__, __delete__",
                                "A string protocol", "A network protocol", "A file protocol", 0));
                l.add(q(3, "What does this print?\nclass Meta(type):\n  def __new__(cls, name, bases, dct):\n    dct['x'] = 42\n    return super().__new__(cls, name, bases, dct)\nclass A(metaclass=Meta): pass\nprint(A.x)",
                                "42", "Error", "None", "Meta", 0));
                l.add(q(4, "What is the MRO?", "Method Resolution Order for multiple inheritance",
                                "Module Resource Object", "Main Runtime Operation", "Memory Reference Order", 0));
                l.add(q(5, "What is the output?\nclass A:\n  def greet(self): return 'A'\nclass B(A):\n  def greet(self): return 'B'\nclass C(A):\n  def greet(self): return 'C'\nclass D(B, C): pass\nprint(D().greet())",
                                "B", "C", "A", "Error", 0));
                l.add(q(6, "What is __getattr__ vs __getattribute__?",
                                "__getattribute__ called always, __getattr__ on failure", "They are the same",
                                "__getattr__ called always", "Neither exists", 0));
                l.add(q(7, "What does this print?\nimport sys\nprint(sys.getrecursionlimit())", "1000", "100", "500",
                                "Error", 0));
                l.add(q(8, "What is a WeakReference?", "Reference that doesn't prevent GC", "A strong reference",
                                "A global variable", "A constant", 0));
                l.add(q(9, "What is the output?\ndef decorator(f):\n  def wrapper(*a):\n    print('before')\n    result = f(*a)\n    print('after')\n    return result\n  return wrapper\n\n@decorator\ndef say(x): print(x)\nsay('hello')",
                                "before\nhello\nafter", "hello", "before\nafter", "Error", 0));
                l.add(q(10, "What is functools.lru_cache?", "Memoization decorator for functions", "A sorting function",
                                "A file cache", "A database cache", 0));
                l.add(q(11, "What does this print?\nfrom functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n  if n < 2: return n\n  return fib(n-1) + fib(n-2)\nprint(fib(10))",
                                "55", "89", "34", "Error", 0));
                l.add(q(12, "What is the __del__ method?", "Called when object is about to be destroyed",
                                "Deletes an attribute", "Removes from list", "Closes a file", 0));
                l.add(q(13, "What is the output?\nx = {1, 2, 3}\ny = {2, 3, 4}\nprint(x & y)", "{2, 3}", "{1, 2, 3, 4}",
                                "{1, 4}", "Error", 0));
                l.add(q(14, "What is __enter__ and __exit__?", "Context manager protocol methods", "File operations",
                                "Class constructors", "Loop controls", 0));
                l.add(q(15, "What does this print?\nclass CM:\n  def __enter__(self): return 'hello'\n  def __exit__(self, *a): pass\nwith CM() as v:\n  print(v)",
                                "hello", "CM", "None", "Error", 0));
                l.add(q(16, "What is monkey patching?", "Dynamically modifying classes/modules at runtime",
                                "Testing technique", "Design pattern", "Build tool", 0));
                l.add(q(17, "What is the output?\na = [1, 2, 3]\nb = [1, 2, 3]\nprint(a is b)\nprint(a == b)",
                                "False\nTrue", "True\nTrue", "False\nFalse", "Error", 0));
                l.add(q(18, "What is __call__?", "Makes an object callable like a function", "Calls a method",
                                "Creates a class", "Imports a module", 0));
                l.add(q(19, "What does this print?\nclass Counter:\n  def __init__(self):\n    self.n = 0\n  def __call__(self):\n    self.n += 1\n    return self.n\nc = Counter()\nprint(c(), c(), c())",
                                "1 2 3", "0 1 2", "Error", "None", 0));
                l.add(q(20, "What is the Global Interpreter Lock (GIL)?",
                                "Lock preventing true multi-threaded Python execution", "A security feature",
                                "A memory manager", "A file lock", 0));
                l.add(q(21, "What is the output?\nimport threading\nresult = []\ndef add(x):\n  result.append(x)\nt1 = threading.Thread(target=add, args=(1,))\nt1.start()\nt1.join()\nprint(result)",
                                "[1]", "[]", "Error", "None", 0));
                l.add(q(22, "What are __slots__?", "Limits attributes and reduces memory", "A list operation",
                                "A tuple method", "A dictionary key", 0));
                l.add(q(23, "What does this print?\nclass A:\n  __slots__ = ['x']\na = A()\na.x = 1\ntry:\n  a.y = 2\nexcept AttributeError:\n  print('no y')",
                                "no y", "2", "Error", "None", 0));
                l.add(q(24, "What is a descriptor?", "Object controlling access to another attribute", "A string type",
                                "A list method", "A module", 0));
                l.add(q(25, "What is the output?\ngen = (x**2 for x in range(5))\nprint(sum(gen))", "30", "10", "Error",
                                "None", 0));
                l.add(q(26, "What is ABC (Abstract Base Class)?", "Defines interface that subclasses must implement",
                                "A collections type", "A string class", "A math module", 0));
                l.add(q(27, "What does this print?\nfrom abc import ABC, abstractmethod\nclass Shape(ABC):\n  @abstractmethod\n  def area(self): pass\ntry:\n  s = Shape()\nexcept TypeError:\n  print('cannot instantiate')",
                                "cannot instantiate", "Error", "None", "Shape", 0));
                l.add(q(28, "What is a memoryview?", "Object that exposes buffer protocol", "A cached view",
                                "A file reader", "A string view", 0));
                l.add(q(29, "What is the output?\ndef make_adder(n):\n  return lambda x: x + n\nadd5 = make_adder(5)\nprint(add5(3))",
                                "8", "5", "3", "Error", 0));
                l.add(q(30, "What is the purpose of __new__?", "Controls object creation before __init__",
                                "Deletes objects", "Compares objects", "Prints objects", 0));
                l.add(q(31, "What does this print?\nclass Singleton:\n  _inst = None\n  def __new__(cls):\n    if not cls._inst:\n      cls._inst = super().__new__(cls)\n    return cls._inst\na = Singleton()\nb = Singleton()\nprint(a is b)",
                                "True", "False", "Error", "None", 0));
                l.add(q(32, "What is the struct module?", "Packing/unpacking binary data", "Creating classes",
                                "Sorting lists", "File operations", 0));
                l.add(q(33, "What is the output?\nprint(sorted([3,1,2], key=lambda x: -x))", "[3, 2, 1]", "[1, 2, 3]",
                                "Error", "None", 0));
                l.add(q(34, "What is typing.Protocol?", "Structural subtyping for static type checkers",
                                "A network protocol", "A file protocol", "A class type", 0));
                l.add(q(35, "What does this print?\nfrom collections import defaultdict\nd = defaultdict(int)\nd['a'] += 1\nprint(d['a'], d['b'])",
                                "1 0", "1 Error", "Error", "None", 0));
                l.add(q(36, "What is multiprocessing vs threading?", "multiprocessing bypasses GIL, threading doesn't",
                                "They are identical", "threading is faster", "multiprocessing is slower", 0));
                l.add(q(37, "What is the output?\nprint({True: 'yes', 1: 'one', 1.0: 'float'})", "{True: 'float'}",
                                "{True: 'yes', 1: 'one'}", "Error", "None", 0));
                l.add(q(38, "What is __iter__ and __next__?", "Iterator protocol methods", "Loop controls",
                                "File operations", "String methods", 0));
                l.add(q(39, "What does this print?\nclass Count:\n  def __init__(self, n): self.n = n\n  def __iter__(self): return self\n  def __next__(self):\n    if self.n <= 0: raise StopIteration\n    self.n -= 1\n    return self.n + 1\nprint(list(Count(3)))",
                                "[3, 2, 1]", "[1, 2, 3]", "Error", "None", 0));
                l.add(q(40, "What is the match statement (Python 3.10+)?", "Structural pattern matching",
                                "A regex function", "A string compare", "A loop control", 0));
                l.add(q(41, "What is the output?\nmatch (1, 2):\n  case (x, y) if x < y:\n    print(f'{x} < {y}')",
                                "1 < 2", "Error", "(1, 2)", "None", 0));
                l.add(q(42, "What is __hash__?", "Returns hash value for use in sets/dicts", "Encrypts data",
                                "Compresses data", "Sorts data", 0));
                l.add(q(43, "What does this print?\na = frozenset([1, 2, 3])\nb = frozenset([1, 2, 3])\nprint(a == b, hash(a) == hash(b))",
                                "True True", "True False", "False True", "Error", 0));
                l.add(q(44, "What is ctypes?", "Library for calling C functions from Python", "A typing module",
                                "A testing tool", "A web framework", 0));
                l.add(q(45, "What is the output?\ndef f():\n  yield from range(3)\nprint(list(f()))", "[0, 1, 2]",
                                "[1, 2, 3]", "Error", "None", 0));
                l.add(q(46, "What is __mro_entries__?", "Customizes class bases during creation", "A list method",
                                "A file attribute", "A string operation", 0));
                l.add(q(47, "What does this print?\nprint(int('0b1010', 2))", "10", "1010", "Error", "None", 0));
                l.add(q(48, "What is the dis module?", "Disassembles Python bytecode", "A display module",
                                "A distance calculator", "A dictionary module", 0));
                l.add(q(49, "What is the output?\nx = [1]\nx.extend([2, 3])\nx.insert(0, 0)\nprint(x)", "[0, 1, 2, 3]",
                                "[1, 2, 3]", "[0, 1]", "Error", 0));
                l.add(q(50, "What is __prepare__?", "Returns namespace for class body execution", "Prepares a file",
                                "Initializes a variable", "Imports a module", 0));
        }
}
