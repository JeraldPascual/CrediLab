package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionBankCSharp {

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
                l.add(q(1, "What is the output?\nConsole.WriteLine(5 + 3);", "8", "53", "Error", "null", 0));
                l.add(q(2, "Which keyword defines a class in C#?", "class", "define", "struct", "object", 0));
                l.add(q(3, "What does this print?\nstring s = \"Hello\";\nConsole.WriteLine(s.Length);", "5", "4", "6",
                                "Error", 0));
                l.add(q(4, "What is the file extension for C# source files?", ".cs", ".c#", ".csharp", ".sharp", 0));
                l.add(q(5, "What is the output?\nint x = 10;\nx += 5;\nConsole.WriteLine(x);", "15", "10", "5", "Error",
                                0));
                l.add(q(6, "Which type stores true/false?", "bool", "boolean", "bit", "flag", 0));
                l.add(q(7, "What does this print?\nint[] arr = {1, 2, 3};\nConsole.WriteLine(arr[1]);", "2", "1", "3",
                                "Error", 0));
                l.add(q(8, "What is a namespace?", "Organizes classes into logical groups", "A class", "A method",
                                "A variable", 0));
                l.add(q(9, "What is the output?\nfor (int i = 0; i < 3; i++)\n  Console.Write(i);", "012", "123",
                                "0123", "Error", 0));
                l.add(q(10, "Which keyword creates a new object?", "new", "create", "make", "init", 0));
                l.add(q(11, "What does this print?\nstring a = \"Hello\";\nstring b = \"World\";\nConsole.WriteLine(a + \" \" + b);",
                                "Hello World", "HelloWorld", "Error", "null", 0));
                l.add(q(12, "What is the default value of int?", "0", "null", "-1", "undefined", 0));
                l.add(q(13, "What is the output?\ndouble d = 7.5;\nint i = (int)d;\nConsole.WriteLine(i);", "7", "7.5",
                                "8", "Error", 0));
                l.add(q(14, "What does 'void' mean?", "Method returns nothing", "Returns null", "Returns 0",
                                "Returns empty", 0));
                l.add(q(15, "What does this print?\nbool x = (5 > 3) && (2 > 4);\nConsole.WriteLine(x);", "False",
                                "True", "Error", "0", 0));
                l.add(q(16, "What is a property in C#?", "Member with get/set accessors", "A field", "A method",
                                "A class", 0));
                l.add(q(17, "What is the output?\nstring s = \"C#\";\nConsole.WriteLine(s.ToUpper());", "C#", "c#",
                                "Error", "CS", 0));
                l.add(q(18, "Which keyword handles exceptions?", "try-catch", "handle", "error", "except", 0));
                l.add(q(19, "What does this print?\ntry {\n  int x = 10 / 0;\n} catch (DivideByZeroException) {\n  Console.Write(\"caught\");\n}",
                                "caught", "Error", "null", "0", 0));
                l.add(q(20, "What is the 'var' keyword?", "Implicit type declaration", "A void type", "A variant type",
                                "A global type", 0));
                l.add(q(21, "What is the output?\nvar list = new List<int> {1, 2, 3};\nConsole.WriteLine(list.Count);",
                                "3", "2", "4", "Error", 0));
                l.add(q(22, "What is the difference between '==' and '.Equals()'?",
                                "'==' checks reference by default, .Equals() checks value", "They are identical",
                                "'==' checks value always", ".Equals() checks reference", 0));
                l.add(q(23, "What does this print?\nint x = 7;\nConsole.WriteLine(x % 2);", "1", "0", "3", "Error", 0));
                l.add(q(24, "What is an interface?", "Contract defining methods without implementation", "A class",
                                "A struct", "A namespace", 0));
                l.add(q(25, "What is the output?\nstring s = \"Hello\";\nConsole.WriteLine(s.Substring(1, 3));", "ell",
                                "Hel", "Hello", "Error", 0));
                l.add(q(26, "Which keyword makes a member accessible only within the class?", "private", "public",
                                "protected", "internal", 0));
                l.add(q(27, "What does this print?\nint[] nums = {3, 1, 4};\nArray.Sort(nums);\nConsole.WriteLine(nums[0]);",
                                "1", "3", "4", "Error", 0));
                l.add(q(28, "What is a constructor?", "Special method for initializing objects", "A destructor",
                                "A property", "A delegate", 0));
                l.add(q(29, "What is the output?\nint a = 10, b = 3;\nConsole.WriteLine(a / b);", "3", "3.33", "4",
                                "Error", 0));
                l.add(q(30, "What is the 'static' keyword?", "Belongs to the class, not instances", "Is private",
                                "Is constant", "Is abstract", 0));
                l.add(q(31, "What does this print?\nConsole.WriteLine(\"5\" + 3);", "53", "8", "Error", "null", 0));
                l.add(q(32, "What is an enum?", "Named set of constants", "A collection", "A function", "A class", 0));
                l.add(q(33, "What is the output?\nenum Color { Red, Green, Blue }\nConsole.WriteLine((int)Color.Green);",
                                "1", "0", "2", "Error", 0));
                l.add(q(34, "What is the 'readonly' keyword?", "Field can only be assigned in constructor",
                                "Is constant", "Is public", "Is static", 0));
                l.add(q(35, "What does this print?\nvar dict = new Dictionary<string,int>();\ndict[\"a\"] = 1;\ndict[\"b\"] = 2;\nConsole.WriteLine(dict[\"a\"]);",
                                "1", "2", "Error", "a", 0));
                l.add(q(36, "What is boxing in C#?", "Converting value type to reference type", "Creating a box object",
                                "Wrapping a class", "Casting types", 0));
                l.add(q(37, "What is the output?\nobject o = 42;\nint x = (int)o;\nConsole.WriteLine(x);", "42",
                                "Error", "0", "null", 0));
                l.add(q(38, "Which keyword defines a constant?", "const", "final", "constant", "define", 0));
                l.add(q(39, "What does this print?\nint x = 5;\nif (x > 3)\n  Console.Write(\"A\");\nelse\n  Console.Write(\"B\");",
                                "A", "B", "Error", "AB", 0));
                l.add(q(40, "What is a delegate?", "Type-safe function pointer", "A class", "A property", "An event",
                                0));
                l.add(q(41, "What is the output?\nstring s = \"Hello World\";\nConsole.WriteLine(s.Contains(\"World\"));",
                                "True", "False", "Error", "null", 0));
                l.add(q(42, "What is the 'override' keyword?", "Replaces virtual method in derived class",
                                "Creates new method", "Deletes method", "Hides method", 0));
                l.add(q(43, "What does this print?\nvar x = new int[] {1, 2, 3, 4, 5};\nConsole.WriteLine(x.Length);",
                                "5", "4", "6", "Error", 0));
                l.add(q(44, "What is the 'out' parameter?", "Method parameter that must be assigned before returning",
                                "Input parameter", "Optional parameter", "Constant parameter", 0));
                l.add(q(45, "What is the output?\nint sum = 0;\nforeach (int n in new[] {1,2,3})\n  sum += n;\nConsole.WriteLine(sum);",
                                "6", "3", "Error", "10", 0));
                l.add(q(46, "What is string interpolation?", "$\"text {expression}\" syntax for inline expressions",
                                "Concatenation", "Formatting", "Parsing", 0));
                l.add(q(47, "What does this print?\nint x = 42;\nConsole.WriteLine($\"Value: {x}\");", "Value: 42",
                                "Value: {x}", "Error", "null", 0));
                l.add(q(48, "Which keyword prevents a class from being inherited?", "sealed", "final", "static",
                                "abstract", 0));
                l.add(q(49, "What is the output?\nchar c = 'A';\nConsole.WriteLine((int)c);", "65", "A", "Error", "0",
                                0));
                l.add(q(50, "What is the 'using' statement?", "Ensures proper resource disposal",
                                "Imports namespaces only", "Creates variables", "Handles exceptions", 0));
        }

        private static void addMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\nint? x = null;\nConsole.WriteLine(x ?? 42);", "42", "null", "Error",
                                "0", 0));
                l.add(q(2, "What is LINQ?", "Language Integrated Query for data manipulation", "A database library",
                                "A UI framework", "A network protocol", 0));
                l.add(q(3, "What does this print?\nvar nums = new[] {1,2,3,4,5};\nvar evens = nums.Where(n => n % 2 == 0);\nConsole.WriteLine(evens.Count());",
                                "2", "3", "5", "Error", 0));
                l.add(q(4, "What is async/await?", "Asynchronous programming pattern", "Threading",
                                "Parallel processing", "Event handling", 0));
                l.add(q(5, "What is the output?\nasync Task<int> GetValue() {\n  await Task.Delay(1);\n  return 42;\n}\nvar result = await GetValue();\nConsole.WriteLine(result);",
                                "42", "Error", "Task", "null", 0));
                l.add(q(6, "What is the 'is' keyword used for?", "Pattern matching and type checking", "Assignment",
                                "Comparison", "Casting", 0));
                l.add(q(7, "What does this print?\nobject obj = \"Hello\";\nif (obj is string s)\n  Console.WriteLine(s.Length);",
                                "5", "Error", "Hello", "null", 0));
                l.add(q(8, "What are extension methods?", "Static methods that extend existing types",
                                "Virtual methods", "Abstract methods", "Override methods", 0));
                l.add(q(9, "What is the output?\nvar list = new List<int> {3,1,4,1,5};\nlist.Sort();\nConsole.WriteLine(list[0]);",
                                "1", "3", "5", "Error", 0));
                l.add(q(10, "What is a generic class?", "Class that works with any type parameter", "A base class",
                                "An interface", "A delegate", 0));
                l.add(q(11, "What does this print?\nvar dict = new Dictionary<string,int>\n{ {\"a\",1}, {\"b\",2} };\nConsole.WriteLine(dict.ContainsKey(\"c\"));",
                                "False", "True", "Error", "null", 0));
                l.add(q(12, "What is an event?", "Publisher-subscriber notification mechanism", "A delegate",
                                "A method", "A property", 0));
                l.add(q(13, "What is the output?\nvar s = new Stack<int>();\ns.Push(1);\ns.Push(2);\ns.Push(3);\nConsole.WriteLine(s.Pop());",
                                "3", "1", "2", "Error", 0));
                l.add(q(14, "What is the 'partial' keyword?", "Splits class definition across files",
                                "Makes class incomplete", "Creates abstract class", "Defines interface", 0));
                l.add(q(15, "What does this print?\nstring s = \"Hello\\nWorld\";\nConsole.WriteLine(s.Split('\\n').Length);",
                                "2", "1", "11", "Error", 0));
                l.add(q(16, "What is a record in C#?", "Reference type with value-based equality", "A struct",
                                "A class only", "A delegate", 0));
                l.add(q(17, "What is the output?\nrecord Point(int X, int Y);\nvar p1 = new Point(1, 2);\nvar p2 = new Point(1, 2);\nConsole.WriteLine(p1 == p2);",
                                "True", "False", "Error", "null", 0));
                l.add(q(18, "What is the null-conditional operator?", "?. - returns null instead of throwing",
                                "?? operator", "! operator", "= operator", 0));
                l.add(q(19, "What does this print?\nstring s = null;\nConsole.WriteLine(s?.Length ?? 0);", "0", "null",
                                "Error", "-1", 0));
                l.add(q(20, "What is the Span<T> type?", "Memory-safe view over contiguous data", "An array", "A list",
                                "A queue", 0));
                l.add(q(21, "What is the output?\nvar nums = Enumerable.Range(1, 5);\nConsole.WriteLine(nums.Sum());",
                                "15", "5", "Error", "10", 0));
                l.add(q(22, "What is pattern matching?", "Checking value against patterns with switch/is",
                                "Regex matching", "String matching", "File matching", 0));
                l.add(q(23, "What does this print?\nint x = 42;\nvar result = x switch {\n  < 0 => \"negative\",\n  0 => \"zero\",\n  _ => \"positive\"\n};\nConsole.WriteLine(result);",
                                "positive", "zero", "negative", "Error", 0));
                l.add(q(24, "What is tuple deconstruction?", "Extracting tuple elements into variables",
                                "Creating tuples", "Sorting tuples", "Deleting tuples", 0));
                l.add(q(25, "What is the output?\nvar (a, b) = (1, 2);\nConsole.WriteLine(a + b);", "3", "12", "Error",
                                "tuple", 0));
                l.add(q(26, "What is IDisposable?", "Interface for releasing unmanaged resources",
                                "A collection interface", "A generic interface", "A threading interface", 0));
                l.add(q(27, "What does this print?\nvar q = new Queue<int>();\nq.Enqueue(1);\nq.Enqueue(2);\nq.Enqueue(3);\nConsole.WriteLine(q.Dequeue());",
                                "1", "3", "2", "Error", 0));
                l.add(q(28, "What is a struct vs class?", "Struct is value type, class is reference type",
                                "They are identical", "Class is value type", "Struct is reference type", 0));
                l.add(q(29, "What is the output?\nvar hs = new HashSet<int>{1,2,2,3,3};\nConsole.WriteLine(hs.Count);",
                                "3", "5", "2", "Error", 0));
                l.add(q(30, "What is dependency injection?", "Providing dependencies through constructor/methods",
                                "Creating dependencies", "Deleting dependencies", "Copying dependencies", 0));
                l.add(q(31, "What does this print?\nConsole.WriteLine(string.Join(\",\", new[]{1,2,3}));", "1,2,3",
                                "123", "Error", "1 2 3", 0));
                l.add(q(32, "What is the 'with' expression for records?", "Creates copy with modified properties",
                                "With statement", "Using statement", "Try statement", 0));
                l.add(q(33, "What is the output?\nrecord Point(int X, int Y);\nvar p1 = new Point(1, 2);\nvar p2 = p1 with { X = 5 };\nConsole.WriteLine(p2.X);",
                                "5", "1", "Error", "null", 0));
                l.add(q(34, "What is the yield keyword?", "Returns elements one at a time from iterator",
                                "Stops execution", "Returns null", "Creates thread", 0));
                l.add(q(35, "What does this print?\nIEnumerable<int> Gen() {\n  yield return 1;\n  yield return 2;\n}\nforeach(var x in Gen())\n  Console.Write(x);",
                                "12", "1", "Error", "Gen", 0));
                l.add(q(36, "What is covariance?", "Allows more derived type where less derived expected",
                                "Type casting", "Type erasure", "Type checking", 0));
                l.add(q(37, "What is the output?\nint x = 0b1010;\nConsole.WriteLine(x);", "10", "1010", "Error", "2",
                                0));
                l.add(q(38, "What are indexers?", "Allow objects to be indexed like arrays", "Array types",
                                "Properties", "Methods", 0));
                l.add(q(39, "What does this print?\nvar arr = new[] {1,2,3,4,5};\nConsole.WriteLine(arr[^1]);", "5",
                                "1", "Error", "4", 0));
                l.add(q(40, "What is the 'ref' keyword?", "Passes variable by reference", "By value", "Creates copy",
                                "Creates new", 0));
                l.add(q(41, "What is the output?\nvoid Swap(ref int a, ref int b) {\n  int t = a; a = b; b = t;\n}\nint x = 1, y = 2;\nSwap(ref x, ref y);\nConsole.WriteLine($\"{x} {y}\");",
                                "2 1", "1 2", "Error", "0 0", 0));
                l.add(q(42, "What is the init accessor?", "Property setter only available during initialization",
                                "A regular setter", "A getter", "A constructor", 0));
                l.add(q(43, "What does this print?\nvar nums = new[] {1,2,3,4,5};\nvar result = nums.Aggregate((a,b) => a + b);\nConsole.WriteLine(result);",
                                "15", "5", "Error", "10", 0));
                l.add(q(44, "What is the CancellationToken?", "Cooperative cancellation for async operations",
                                "A security token", "An auth token", "A session token", 0));
                l.add(q(45, "What is the output?\nReadOnlySpan<char> span = \"Hello\";\nConsole.WriteLine(span[1]);",
                                "e", "H", "Error", "l", 0));
                l.add(q(46, "What are top-level statements?", "Code outside class/method in C# 9+", "Main method",
                                "Static class", "Namespace", 0));
                l.add(q(47, "What does this print?\nvar list = new List<int>{1,2,3};\nlist.ForEach(n => Console.Write(n));",
                                "123", "1 2 3", "Error", "null", 0));
                l.add(q(48, "What is the discard variable?", "_ for unused values", "null", "void", "empty", 0));
                l.add(q(49, "What is the output?\n_ = int.TryParse(\"42\", out int result);\nConsole.WriteLine(result);",
                                "42", "0", "Error", "null", 0));
                l.add(q(50, "What is the global using directive?", "Applies using to all files in project",
                                "Local using", "Static using", "Alias using", 0));
        }

        private static void addHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\nSpan<int> s = stackalloc int[3] {1,2,3};\nConsole.WriteLine(s[2]);",
                                "3", "Error", "0", "null", 0));
                l.add(q(2, "What is Roslyn?", "C# compiler platform and API", "A web framework", "A database",
                                "A testing tool", 0));
                l.add(q(3, "What does this print?\nvar ch = Channel.CreateBounded<int>(1);\nawait ch.Writer.WriteAsync(42);\nvar val = await ch.Reader.ReadAsync();\nConsole.WriteLine(val);",
                                "42", "Error", "null", "0", 0));
                l.add(q(4, "What is the difference between Task and ValueTask?",
                                "ValueTask avoids allocation for sync results", "They are identical", "Task is faster",
                                "ValueTask always allocates", 0));
                l.add(q(5, "What is the output?\nvar list = new List<int>{1,2,3,4,5};\nvar result = list.AsParallel()\n  .Where(n => n > 2)\n  .Count();\nConsole.WriteLine(result);",
                                "3", "2", "5", "Error", 0));
                l.add(q(6, "What is expression-bodied members?", "Members defined with => syntax", "Lambda expressions",
                                "LINQ queries", "Anonymous methods", 0));
                l.add(q(7, "What does this print?\ninterface IGreet {\n  void Greet() => Console.Write(\"Hi\");\n}\nclass A : IGreet {}\n((IGreet)new A()).Greet();",
                                "Hi", "Error", "null", "A", 0));
                l.add(q(8, "What is source generation?", "Compile-time code generation via analyzers",
                                "Runtime reflection", "Dynamic compilation", "Interpretation", 0));
                l.add(q(9, "What is the output?\nstring s = \"Hello\";\nReadOnlySpan<char> span = s.AsSpan(1, 3);\nConsole.WriteLine(new string(span));",
                                "ell", "Hel", "Error", "Hello", 0));
                l.add(q(10, "What is a ref struct?", "Stack-only struct that can't be boxed", "A regular struct",
                                "A class", "An interface", 0));
                l.add(q(11, "What does this print?\nvar sw = new StringWriter();\nConsole.SetOut(sw);\nConsole.Write(\"test\");\nConsole.SetOut(Console.Out);\n// sw.ToString() contains:",
                                "test", "null", "Error", "empty", 0));
                l.add(q(12, "What is the ConfigureAwait(false)?", "Avoids capturing synchronization context",
                                "Configures threading", "Sets timeout", "Handles errors", 0));
                l.add(q(13, "What is the output?\nvar x = new { Name=\"Test\", Value=42 };\nConsole.WriteLine(x.Value);",
                                "42", "Error", "Test", "null", 0));
                l.add(q(14, "What is the Memory<T> type?", "Heap-compatible memory-safe buffer", "An array", "A span",
                                "A pointer", 0));
                l.add(q(15, "What does this print?\nvar arr = new[] {\n  new { N=\"A\", V=3 },\n  new { N=\"B\", V=1 },\n  new { N=\"C\", V=2 }\n};\nvar sorted = arr.OrderBy(x => x.V).First();\nConsole.WriteLine(sorted.N);",
                                "B", "A", "C", "Error", 0));
                l.add(q(16, "What is the Unsafe class?", "Low-level memory manipulation without safety checks",
                                "A testing class", "A debug class", "A config class", 0));
                l.add(q(17, "What is the output?\nvar buf = new ArrayBufferWriter<byte>();\nbuf.Write(new byte[]{1,2,3});\nConsole.WriteLine(buf.WrittenCount);",
                                "3", "0", "Error", "null", 0));
                l.add(q(18, "What are interceptors (C# 12)?", "Methods that replace other method calls at compile time",
                                "Event handlers", "Exception filters", "Middleware", 0));
                l.add(q(19, "What does this print?\nvar list = ImmutableList.Create(1, 2, 3);\nvar list2 = list.Add(4);\nConsole.WriteLine(list.Count);",
                                "3", "4", "Error", "null", 0));
                l.add(q(20, "What is the System.Text.Json source generator?",
                                "Compile-time JSON serialization for performance", "Runtime reflection JSON",
                                "A file format", "A database driver", 0));
                l.add(q(21, "What is the output?\nvar sb = new StringBuilder();\nsb.Append(\"Hello\").Append(\" World\");\nConsole.WriteLine(sb.Length);",
                                "11", "10", "Error", "5", 0));
                l.add(q(22, "What is IAsyncEnumerable?", "Async version of IEnumerable for streaming data",
                                "A regular collection", "A database interface", "A file reader", 0));
                l.add(q(23, "What does this print?\nasync IAsyncEnumerable<int> Gen() {\n  for (int i = 0; i < 3; i++) {\n    await Task.Delay(1);\n    yield return i;\n  }\n}\nawait foreach (var x in Gen())\n  Console.Write(x);",
                                "012", "123", "Error", "Gen", 0));
                l.add(q(24, "What is the ArrayPool<T>?", "Shared pool of reusable arrays", "A regular array",
                                "A memory pool", "A thread pool", 0));
                l.add(q(25, "What is the output?\nvar timer = System.Diagnostics.Stopwatch.StartNew();\nThread.Sleep(100);\ntimer.Stop();\nConsole.WriteLine(timer.ElapsedMilliseconds >= 100);",
                                "True", "False", "Error", "null", 0));
                l.add(q(26, "What are primary constructors (C# 12)?", "Constructor parameters on class declaration",
                                "Default constructors", "Static constructors", "Private constructors", 0));
                l.add(q(27, "What does this print?\nclass Point(int x, int y) {\n  public int Sum => x + y;\n}\nConsole.WriteLine(new Point(3, 4).Sum);",
                                "7", "34", "Error", "null", 0));
                l.add(q(28, "What is the volatile keyword?", "Prevents compiler optimization on field access",
                                "Makes field constant", "Makes field static", "Makes field readonly", 0));
                l.add(q(29, "What is the output?\nvar ch = new ConcurrentDictionary<string,int>();\nch.TryAdd(\"a\", 1);\nch.TryAdd(\"a\", 2);\nConsole.WriteLine(ch[\"a\"]);",
                                "1", "2", "Error", "null", 0));
                l.add(q(30, "What is the Interlocked class?", "Atomic operations for multi-threaded code",
                                "A lock class", "A monitor class", "A semaphore class", 0));
                l.add(q(31, "What does this print?\nint x = 0;\nInterlocked.Add(ref x, 5);\nConsole.WriteLine(x);", "5",
                                "0", "Error", "null", 0));
                l.add(q(32, "What is the ObjectPool pattern?", "Reusing objects to reduce allocation",
                                "Creating objects", "Deleting objects", "Sorting objects", 0));
                l.add(q(33, "What is the output?\nvar regex = new Regex(@\"\\d+\");\nvar match = regex.Match(\"abc123def\");\nConsole.WriteLine(match.Value);",
                                "123", "abc", "Error", "null", 0));
                l.add(q(34, "What is the DynamicObject class?", "Allows customizing dynamic member access",
                                "A regular class", "A static class", "An interface", 0));
                l.add(q(35, "What does this print?\nvar json = JsonSerializer.Serialize(new { x = 1 });\nConsole.WriteLine(json);",
                                "{\"x\":1}", "x=1", "Error", "null", 0));
                l.add(q(36, "What is the MemoryMarshal class?", "Low-level memory operations without copies",
                                "A serializer", "A formatter", "A compressor", 0));
                l.add(q(37, "What is the output?\nvar pipe = new System.IO.Pipelines.Pipe();\nawait pipe.Writer.WriteAsync(\n  new ReadOnlyMemory<byte>(new byte[]{1,2,3}));\nConsole.WriteLine(\"written\");",
                                "written", "Error", "null", "3", 0));
                l.add(q(38, "What are file-scoped types (C# 11)?", "Types visible only within the file",
                                "Namespace types", "Global types", "Partial types", 0));
                l.add(q(39, "What does this print?\nvar x = (1, 2, 3);\nConsole.WriteLine(x.Item2);", "2", "1", "3",
                                "Error", 0));
                l.add(q(40, "What is NativeAOT?", "Ahead-of-time compilation to native code", "JIT compilation",
                                "Interpretation", "Bytecode", 0));
                l.add(q(41, "What is the output?\nvar list = new List<string>{\"a\",\"bb\",\"ccc\"};\nvar longest = list.MaxBy(s => s.Length);\nConsole.WriteLine(longest);",
                                "ccc", "a", "bb", "Error", 0));
                l.add(q(42, "What is the BenchmarkDotNet library?", "Micro-benchmarking framework for .NET",
                                "A testing framework", "A logging library", "A profiler", 0));
                l.add(q(43, "What does this print?\nReadOnlySpan<int> span = new[] {1,2,3,4,5};\nConsole.WriteLine(span[^2]);",
                                "4", "5", "3", "Error", 0));
                l.add(q(44, "What is the required modifier (C# 11)?", "Forces property initialization in constructor",
                                "Makes property optional", "Makes property readonly", "Makes property static", 0));
                l.add(q(45, "What is the output?\nvar range = 1..4;\nvar arr = new[] {0,1,2,3,4,5};\nConsole.WriteLine(arr[range].Length);",
                                "3", "4", "5", "Error", 0));
                l.add(q(46, "What is the FrozenDictionary?", "Immutable optimized dictionary for read-heavy scenarios",
                                "A regular dictionary", "A concurrent dictionary", "A sorted dictionary", 0));
                l.add(q(47, "What does this print?\nvar arr = new[] {1,2,3};\nvar reversed = arr.Reverse();\nConsole.Write(reversed.First());",
                                "3", "1", "Error", "null", 0));
                l.add(q(48, "What is the CallerMemberName attribute?", "Auto-fills calling member's name",
                                "A security attribute", "A validation attribute", "A serialization attribute", 0));
                l.add(q(49, "What is the output?\nvar x = Math.Clamp(15, 0, 10);\nConsole.WriteLine(x);", "10", "15",
                                "0", "Error", 0));
                l.add(q(50, "What is the collection expression (C# 12)?",
                                "Simplified syntax for creating collections with []", "LINQ query", "Array literal",
                                "Tuple literal", 0));
        }
}
