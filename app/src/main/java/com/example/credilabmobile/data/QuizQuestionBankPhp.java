package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionBankPhp {

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
                l.add(q(1, "What is the output?\necho 5 + 3;", "8", "53", "Error", "null", 0));
                l.add(q(2, "Which symbol starts a PHP variable?", "$", "@", "#", "&", 0));
                l.add(q(3, "What does this print?\n$x = \"Hello\";\necho strlen($x);", "5", "4", "6", "Error", 0));
                l.add(q(4, "What is the file extension for PHP?", ".php", ".ph", ".phtml", ".p", 0));
                l.add(q(5, "What is the output?\n$x = 10;\n$x += 5;\necho $x;", "15", "10", "5", "Error", 0));
                l.add(q(6, "Which tag opens PHP code?", "<?php", "<php>", "<?", "<script php>", 0));
                l.add(q(7, "What does this print?\n$arr = [1, 2, 3];\necho count($arr);", "3", "2", "4", "Error", 0));
                l.add(q(8, "What is a string in PHP?", "A sequence of characters", "A number", "A boolean", "An array",
                                0));
                l.add(q(9, "What is the output?\necho 10 / 3;", "3.3333...", "3", "4", "Error", 0));
                l.add(q(10, "Which function outputs text?", "echo", "print_text", "output", "display", 0));
                l.add(q(11, "What does this print?\n$a = \"Hello\";\n$b = \"World\";\necho $a . \" \" . $b;",
                                "Hello World", "HelloWorld", "Error", "null", 0));
                l.add(q(12, "What is the concatenation operator?", ". (dot)", "+ (plus)", "& (ampersand)", ", (comma)",
                                0));
                l.add(q(13, "What is the output?\n$x = true;\nvar_dump($x);", "bool(true)", "true", "1", "Error", 0));
                l.add(q(14, "Which function checks if a variable is set?", "isset()", "exists()", "defined()",
                                "check()", 0));
                l.add(q(15, "What does this print?\nfor ($i = 0; $i < 3; $i++) {\n  echo $i;\n}", "012", "123", "0123",
                                "Error", 0));
                l.add(q(16, "What is an associative array?", "Array with named keys", "A numbered array", "A string",
                                "A function", 0));
                l.add(q(17, "What is the output?\n$arr = [\"a\" => 1, \"b\" => 2];\necho $arr[\"a\"];", "1", "2", "a",
                                "Error", 0));
                l.add(q(18, "Which keyword defines a function?", "function", "def", "func", "method", 0));
                l.add(q(19, "What does this print?\nfunction add($a, $b) {\n  return $a + $b;\n}\necho add(3, 4);", "7",
                                "34", "Error", "null", 0));
                l.add(q(20, "What is the default value of an unset variable?", "null", "0", "false", "empty string",
                                0));
                l.add(q(21, "What is the output?\n$x = 7;\necho $x % 2;", "1", "0", "3", "Error", 0));
                l.add(q(22, "Which keyword creates a class?", "class", "define", "struct", "object", 0));
                l.add(q(23, "What does this print?\n$s = \"Hello\";\necho strtoupper($s);", "HELLO", "hello", "Hello",
                                "Error", 0));
                l.add(q(24, "What is the -> operator used for?", "Accessing object properties/methods", "Comparison",
                                "Assignment", "Concatenation", 0));
                l.add(q(25, "What is the output?\n$arr = [3, 1, 4, 1, 5];\nsort($arr);\necho $arr[0];", "1", "3", "5",
                                "Error", 0));
                l.add(q(26, "Which function checks if a key exists in an array?", "array_key_exists()", "key_exists()",
                                "has_key()", "in_array()", 0));
                l.add(q(27, "What does this print?\necho gettype(42);", "integer", "int", "number", "Error", 0));
                l.add(q(28, "What is the difference between == and ===?", "=== checks type and value, == only value",
                                "They are identical", "== checks type", "=== only checks value", 0));
                l.add(q(29, "What is the output?\necho (5 == \"5\") ? \"true\" : \"false\";", "true", "false", "Error",
                                "5", 0));
                l.add(q(30, "Which loop runs at least once?", "do-while", "for", "while", "foreach", 0));
                l.add(q(31, "What does this print?\n$x = 1;\ndo {\n  echo $x;\n  $x++;\n} while ($x <= 3);", "123",
                                "1234", "12", "Error", 0));
                l.add(q(32, "What is the 'static' keyword for methods?", "Method belongs to class, not instance",
                                "Is constant", "Is private", "Is abstract", 0));
                l.add(q(33, "What is the output?\n$arr = [1, 2, 3];\narray_push($arr, 4);\necho count($arr);", "4", "3",
                                "5", "Error", 0));
                l.add(q(34, "Which superglobal holds form data?", "$_POST / $_GET", "$_FORM", "$_DATA", "$_INPUT", 0));
                l.add(q(35, "What does this print?\n$s = \"Hello World\";\necho strpos($s, \"World\");", "6", "5", "7",
                                "Error", 0));
                l.add(q(36, "What is the null coalescing operator?", "??", "?:", "||", "&&", 0));
                l.add(q(37, "What is the output?\n$x = null;\necho $x ?? \"default\";", "default", "null", "Error", "0",
                                0));
                l.add(q(38, "Which function includes a file?", "include", "import", "require_file", "load", 0));
                l.add(q(39, "What does this print?\n$arr = [1, 2, 3, 4, 5];\necho array_sum($arr);", "15", "5", "Error",
                                "10", 0));
                l.add(q(40, "What is a constructor method called?", "__construct", "init", "create", "new", 0));
                l.add(q(41, "What is the output?\nclass Dog {\n  public $name;\n  function __construct($n) { $this->name = $n; }\n}\n$d = new Dog(\"Rex\");\necho $d->name;",
                                "Rex", "Dog", "Error", "null", 0));
                l.add(q(42, "What is the array_merge function?", "Combines two or more arrays", "Splits an array",
                                "Sorts an array", "Filters an array", 0));
                l.add(q(43, "What does this print?\n$a = [1, 2];\n$b = [3, 4];\n$c = array_merge($a, $b);\necho count($c);",
                                "4", "2", "6", "Error", 0));
                l.add(q(44, "What is a trait?", "Reusable code block for classes", "A class type", "An interface",
                                "A function", 0));
                l.add(q(45, "What is the output?\n$x = 5;\necho ++$x;", "6", "5", "4", "Error", 0));
                l.add(q(46, "Which function checks if value exists in array?", "in_array()", "array_has()",
                                "contains()", "has_value()", 0));
                l.add(q(47, "What does this print?\n$arr = [\"a\", \"b\", \"c\"];\necho implode(\"-\", $arr);", "a-b-c",
                                "abc", "a b c", "Error", 0));
                l.add(q(48, "What keyword prevents a class from being extended?", "final", "sealed", "static",
                                "abstract", 0));
                l.add(q(49, "What is the output?\necho (int) 3.7;", "3", "3.7", "4", "Error", 0));
                l.add(q(50, "What does 'return' do in a function?", "Returns a value and exits the function",
                                "Prints output", "Continues loop", "Defines variable", 0));
        }

        private static void addMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n$arr = [1, 2, 3, 4, 5];\n$filtered = array_filter($arr, fn($n) => $n > 2);\necho count($filtered);",
                                "3", "2", "5", "Error", 0));
                l.add(q(2, "What is a namespace in PHP?", "Organizes code and prevents name collisions", "A class",
                                "A function", "A variable", 0));
                l.add(q(3, "What does this print?\n$arr = [1, 2, 3];\n$mapped = array_map(fn($n) => $n * 2, $arr);\necho implode(',', $mapped);",
                                "2,4,6", "1,2,3", "3,6,9", "Error", 0));
                l.add(q(4, "What is PDO?", "PHP Data Objects for database access", "A PHP framework",
                                "A template engine", "A cache system", 0));
                l.add(q(5, "What is the output?\ntry {\n  throw new Exception(\"Error\");\n} catch (Exception $e) {\n  echo $e->getMessage();\n}",
                                "Error", "Exception", "null", "false", 0));
                l.add(q(6, "What is an abstract class?", "Class that cannot be instantiated directly", "A final class",
                                "An interface", "A trait", 0));
                l.add(q(7, "What does this print?\ninterface Shape {\n  public function area(): float;\n}\nclass Circle implements Shape {\n  public function area(): float { return 3.14; }\n}\necho (new Circle())->area();",
                                "3.14", "Error", "null", "Circle", 0));
                l.add(q(8, "What is Composer?", "PHP dependency manager", "A code editor", "A web server",
                                "A database tool", 0));
                l.add(q(9, "What is the output?\n$obj = new stdClass();\n$obj->name = \"PHP\";\necho $obj->name;",
                                "PHP", "Error", "null", "stdClass", 0));
                l.add(q(10, "What is the spread operator in PHP?", "... (three dots) for unpacking", "** for power",
                                "-> for access", "=> for arrow", 0));
                l.add(q(11, "What does this print?\nfunction sum(int ...$nums): int {\n  return array_sum($nums);\n}\necho sum(1, 2, 3);",
                                "6", "123", "Error", "null", 0));
                l.add(q(12, "What is type hinting?", "Specifying parameter/return types", "Adding comments",
                                "Creating classes", "Importing modules", 0));
                l.add(q(13, "What is the output?\n$x = match(2) {\n  1 => 'one',\n  2 => 'two',\n  default => 'other'\n};\necho $x;",
                                "two", "one", "other", "Error", 0));
                l.add(q(14, "What is the match expression?", "Strict comparison switch with return values",
                                "A regex function", "A loop", "An if statement", 0));
                l.add(q(15, "What does this print?\nenum Color { case Red; case Green; case Blue; }\necho Color::Green->name;",
                                "Green", "1", "Color", "Error", 0));
                l.add(q(16, "What are enums in PHP 8.1?", "First-class type-safe enumeration", "Constants", "Arrays",
                                "Classes", 0));
                l.add(q(17, "What is the output?\n$arr = [\"b\" => 2, \"a\" => 1, \"c\" => 3];\nksort($arr);\necho array_key_first($arr);",
                                "a", "b", "c", "Error", 0));
                l.add(q(18, "What is a generator?", "Function that yields values lazily", "A class type", "A constant",
                                "A template", 0));
                l.add(q(19, "What does this print?\nfunction gen() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\nforeach (gen() as $v)\n  echo $v;",
                                "123", "gen", "Error", "null", 0));
                l.add(q(20, "What is the Fiber class in PHP 8.1?", "Lightweight userland threading", "A string class",
                                "A file class", "A database class", 0));
                l.add(q(21, "What is the output?\n$arr = [3, 1, 4, 1, 5];\n$unique = array_unique($arr);\necho count($unique);",
                                "4", "5", "3", "Error", 0));
                l.add(q(22, "What is the nullsafe operator?", "?-> for chaining on nullable objects", "?? operator",
                                "?. operator", "?= operator", 0));
                l.add(q(23, "What does this print?\nclass User {\n  public ?Address $address = null;\n}\n$u = new User();\necho $u?->address?->city ?? 'none';",
                                "none", "null", "Error", "city", 0));
                l.add(q(24, "What is named arguments?", "Passing arguments by parameter name", "Positional args",
                                "Default args", "Optional args", 0));
                l.add(q(25, "What is the output?\nfunction greet(string $name, string $greeting = 'Hi') {\n  return \"$greeting $name\";\n}\necho greet(greeting: 'Hello', name: 'World');",
                                "Hello World", "Hi World", "Error", "World Hello", 0));
                l.add(q(26, "What is the readonly property?", "Property that can only be set once", "A constant",
                                "A static property", "A public property", 0));
                l.add(q(27, "What does this print?\n$a = [1, 2, 3];\n$b = array_reverse($a);\necho $b[0];", "3", "1",
                                "Error", "2", 0));
                l.add(q(28, "What is a closure in PHP?", "Anonymous function with bound variables", "A named function",
                                "A class method", "A trait", 0));
                l.add(q(29, "What is the output?\n$multiply = fn($x, $y) => $x * $y;\necho $multiply(3, 4);", "12",
                                "34", "7", "Error", 0));
                l.add(q(30, "What is the use keyword in closures?", "Imports variables from parent scope",
                                "Imports classes", "Imports namespaces", "Imports traits", 0));
                l.add(q(31, "What does this print?\n$x = 10;\n$f = function() use ($x) {\n  return $x * 2;\n};\necho $f();",
                                "20", "10", "Error", "null", 0));
                l.add(q(32, "What is array_reduce?", "Reduces array to single value using callback", "Removes elements",
                                "Sorts array", "Filters array", 0));
                l.add(q(33, "What is the output?\n$result = array_reduce([1,2,3,4], fn($c,$n) => $c+$n, 0);\necho $result;",
                                "10", "4", "Error", "24", 0));
                l.add(q(34, "What is the SplStack class?", "Stack data structure implementation", "An array type",
                                "A string class", "A file class", 0));
                l.add(q(35, "What does this print?\n$s = new SplStack();\n$s->push(1);\n$s->push(2);\n$s->push(3);\necho $s->pop();",
                                "3", "1", "2", "Error", 0));
                l.add(q(36, "What is PSR-4?", "Autoloading standard for PHP", "A coding standard",
                                "A database standard", "A security standard", 0));
                l.add(q(37, "What is the output?\n$json = json_encode(['a' => 1, 'b' => 2]);\necho $json;",
                                "{\"a\":1,\"b\":2}", "[a:1,b:2]", "Error", "null", 0));
                l.add(q(38, "What is the difference between include and require?",
                                "require causes fatal error on failure, include warns", "They are identical",
                                "include is fatal", "require warns", 0));
                l.add(q(39, "What does this print?\n$d = new DateTime('2024-01-15');\necho $d->format('Y');", "2024",
                                "15", "01", "Error", 0));
                l.add(q(40, "What is an interface?", "Contract defining method signatures", "A class",
                                "An abstract method", "A trait", 0));
                l.add(q(41, "What is the output?\necho str_repeat(\"ab\", 3);", "ababab", "ab3", "aaa", "Error", 0));
                l.add(q(42, "What is the array_column function?", "Returns values of a single column from an array",
                                "Creates columns", "Sorts columns", "Merges columns", 0));
                l.add(q(43, "What does this print?\n$data = [\n  ['name'=>'A', 'age'=>25],\n  ['name'=>'B', 'age'=>30]\n];\n$names = array_column($data, 'name');\necho implode(',', $names);",
                                "A,B", "25,30", "Error", "null", 0));
                l.add(q(44, "What is the spaceship operator?", "<=> for three-way comparison", "=> for arrow",
                                "-> for access", ":: for scope", 0));
                l.add(q(45, "What is the output?\necho 1 <=> 2;", "-1", "0", "1", "Error", 0));
                l.add(q(46, "What is an arrow function?", "Short closure with fn() => syntax", "A long function",
                                "A method", "A class", 0));
                l.add(q(47, "What does this print?\n$arr = [1, 2, 3];\necho array_pop($arr);\necho count($arr);", "32",
                                "31", "Error", "33", 0));
                l.add(q(48, "What is the list() function?", "Assigns array values to variables", "Creates a list",
                                "Sorts a list", "Filters a list", 0));
                l.add(q(49, "What is the output?\n[$a, $b, $c] = [10, 20, 30];\necho $b;", "20", "10", "30", "Error",
                                0));
                l.add(q(50, "What is the compact() function?", "Creates array from variables and their values",
                                "Compresses data", "Minifies code", "Merges arrays", 0));
        }

        private static void addHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\nenum Suit: string {\n  case Hearts = 'H';\n  case Diamonds = 'D';\n}\necho Suit::Hearts->value;",
                                "H", "Hearts", "0", "Error", 0));
                l.add(q(2, "What is PHP Fibers?", "Cooperative concurrency with suspend/resume", "Multi-threading",
                                "Forking", "Async I/O", 0));
                l.add(q(3, "What does this print?\n$fiber = new Fiber(function() {\n  Fiber::suspend('hello');\n});\necho $fiber->start();",
                                "hello", "Error", "null", "Fiber", 0));
                l.add(q(4, "What is intersection types?", "Value must satisfy all types (A&B)", "Union types",
                                "Generic types", "Nullable types", 0));
                l.add(q(5, "What is the output?\nfunction test(Iterator&Countable $x) {\n  echo 'valid';\n}\n// This demonstrates intersection type syntax",
                                "valid (if arg satisfies both)", "Error", "null", "false", 0));
                l.add(q(6, "What is the JIT compiler in PHP 8?", "Just-In-Time compiler for performance",
                                "A template engine", "A debugger", "A profiler", 0));
                l.add(q(7, "What does this print?\n$x = 0b1010;\necho $x;", "10", "1010", "Error", "2", 0));
                l.add(q(8, "What is the SplPriorityQueue?", "Priority queue data structure", "A regular array",
                                "A stack", "A linked list", 0));
                l.add(q(9, "What is the output?\n$pq = new SplPriorityQueue();\n$pq->insert('low', 1);\n$pq->insert('high', 10);\n$pq->insert('mid', 5);\necho $pq->extract();",
                                "high", "low", "mid", "Error", 0));
                l.add(q(10, "What is the WeakMap class?", "Map where keys are weakly referenced objects",
                                "A regular map", "A cache", "A session store", 0));
                l.add(q(11, "What does this print?\nclass MyClass {\n  public function __toString() { return 'hello'; }\n}\necho new MyClass();",
                                "hello", "Error", "MyClass", "null", 0));
                l.add(q(12, "What is the Reflections API?", "Runtime type introspection for classes/methods",
                                "A mirror library", "A testing tool", "A debugger", 0));
                l.add(q(13, "What is the output?\n$ref = new ReflectionClass('stdClass');\necho $ref->getName();",
                                "stdClass", "Error", "Class", "null", 0));
                l.add(q(14, "What is a union type?", "Parameter accepting multiple types (int|string)",
                                "An intersection type", "A generic type", "A nullable type", 0));
                l.add(q(15, "What does this print?\nfunction test(int|string $x): string {\n  return gettype($x);\n}\necho test(42);",
                                "integer", "int|string", "Error", "42", 0));
                l.add(q(16, "What is the readonly class in PHP 8.2?", "All properties are automatically readonly",
                                "A constant class", "A sealed class", "An abstract class", 0));
                l.add(q(17, "What is the output?\nreadonly class Point {\n  public function __construct(\n    public int $x,\n    public int $y\n  ) {}\n}\n$p = new Point(3, 4);\necho $p->x + $p->y;",
                                "7", "Error", "34", "null", 0));
                l.add(q(18, "What is the Attributes feature in PHP 8?",
                                "Structured metadata for classes/methods/functions", "Annotations", "Comments",
                                "Decorators", 0));
                l.add(q(19, "What does this print?\n#[Attribute]\nclass MyAttr {}\n\n#[MyAttr]\nclass Target {}\n$ref = new ReflectionClass(Target::class);\necho count($ref->getAttributes());",
                                "1", "0", "Error", "null", 0));
                l.add(q(20, "What is the never return type?", "Function never returns (throws or exits)",
                                "Returns null", "Returns void", "Returns false", 0));
                l.add(q(21, "What is the output?\n$arr = range(1, 5);\n$result = array_product($arr);\necho $result;",
                                "120", "15", "Error", "5", 0));
                l.add(q(22, "What is the Disjunctive Normal Form types?", "Combining union and intersection types",
                                "A boolean form", "A SQL feature", "A regex feature", 0));
                l.add(q(23, "What does this print?\nenum Status: int {\n  case Active = 1;\n  case Inactive = 0;\n  public function label(): string {\n    return match($this) {\n      self::Active => 'ON',\n      self::Inactive => 'OFF'\n    };\n  }\n}\necho Status::Active->label();",
                                "ON", "Active", "1", "Error", 0));
                l.add(q(24, "What is the SplObjectStorage?", "Map using objects as keys", "An array", "A queue",
                                "A stack", 0));
                l.add(q(25, "What is the output?\n$storage = new SplObjectStorage();\n$a = new stdClass();\n$storage[$a] = 'data';\necho $storage[$a];",
                                "data", "Error", "null", "stdClass", 0));
                l.add(q(26, "What is PHP-FPM?", "FastCGI Process Manager for PHP", "A framework", "A package manager",
                                "A compiler", 0));
                l.add(q(27, "What does this print?\n$gen = function() {\n  yield 'a' => 1;\n  yield 'b' => 2;\n};\nforeach ($gen() as $k => $v)\n  echo \"$k:$v \";",
                                "a:1 b:2", "1 2", "Error", "null", 0));
                l.add(q(28, "What is the Opcache?", "Bytecode caching for PHP performance", "A database cache",
                                "A file cache", "A session cache", 0));
                l.add(q(29, "What is the output?\n$x = 'test';\necho match(true) {\n  strlen($x) > 5 => 'long',\n  strlen($x) > 3 => 'medium',\n  default => 'short'\n};",
                                "medium", "long", "short", "Error", 0));
                l.add(q(30, "What is the PHP memory model?", "Copy-on-write with reference counting",
                                "Garbage collection only", "Manual allocation", "Stack-only allocation", 0));
                l.add(q(31, "What does this print?\n$a = [1, 2, 3];\n$b = $a;\n$b[] = 4;\necho count($a);", "3", "4",
                                "Error", "null", 0));
                l.add(q(32, "What is the ArrayAccess interface?", "Allows objects to be accessed as arrays",
                                "A collection interface", "A serialization interface", "An iterator interface", 0));
                l.add(q(33, "What is the output?\nclass Box implements ArrayAccess {\n  private $data = [];\n  public function offsetExists($k): bool { return isset($this->data[$k]); }\n  public function offsetGet($k): mixed { return $this->data[$k]; }\n  public function offsetSet($k, $v): void { $this->data[$k] = $v; }\n  public function offsetUnset($k): void { unset($this->data[$k]); }\n}\n$b = new Box();\n$b['x'] = 42;\necho $b['x'];",
                                "42", "Error", "null", "Box", 0));
                l.add(q(34, "What is the Generator return?", "Generators can return a final value via getReturn()",
                                "They can't return", "They return arrays", "They return objects", 0));
                l.add(q(35, "What does this print?\nfunction gen() {\n  yield 1;\n  yield 2;\n  return 'done';\n}\n$g = gen();\n$g->next(); $g->next();\necho $g->getReturn();",
                                "done", "2", "Error", "null", 0));
                l.add(q(36, "What is the random extension in PHP 8.2?", "Object-oriented random number generation",
                                "A crypto library", "A hash function", "A UUID generator", 0));
                l.add(q(37, "What is the output?\n$rng = new Random\\Randomizer();\n$arr = [1, 2, 3, 4, 5];\n$shuffled = $rng->shuffleArray($arr);\necho count($shuffled);",
                                "5", "Error", "0", "null", 0));
                l.add(q(38, "What is the Stringable interface?", "Guarantees __toString() is implemented",
                                "A string type", "A cast interface", "A format interface", 0));
                l.add(q(39, "What does this print?\nfunction test(Stringable|string $s): int {\n  return strlen((string)$s);\n}\necho test('hello');",
                                "5", "Error", "hello", "null", 0));
                l.add(q(40, "What is first-class callable syntax?", "Creating closure from callable using (...)",
                                "A lambda syntax", "An arrow function", "A method reference", 0));
                l.add(q(41, "What is the output?\n$f = strlen(...);\necho $f('hello');", "5", "Error", "hello", "null",
                                0));
                l.add(q(42, "What is the SensitiveParameter attribute?", "Hides parameter values in stack traces",
                                "Encrypts parameters", "Validates parameters", "Logs parameters", 0));
                l.add(q(43, "What does this print?\n$arr = [1, 2, 3, 4, 5];\necho array_reduce($arr, fn($c, $n) => $c + ($n > 2 ? $n : 0), 0);",
                                "12", "15", "6", "Error", 0));
                l.add(q(44, "What is the mixed type?", "Accepts any type including null", "A generic type",
                                "A union type", "An any type", 0));
                l.add(q(45, "What is the output?\nvar_dump(0 == 'foo');", "false (PHP 8+)", "true", "Error", "null",
                                0));
                l.add(q(46, "What is the constant in enum?", "Enums can have constants alongside cases",
                                "Cases are constants", "Enums can't have constants", "Only backed enums can", 0));
                l.add(q(47, "What does this print?\n$x = 0xFF;\necho $x;", "255", "FF", "Error", "15", 0));
                l.add(q(48, "What is the true/false/null standalone types?",
                                "Can be used as standalone type declarations", "Boolean values only", "Constants only",
                                "Literals only", 0));
                l.add(q(49, "What is the output?\nfunction test(): true {\n  return true;\n}\nvar_dump(test());",
                                "bool(true)", "true", "1", "Error", 0));
                l.add(q(50, "What is the Dynamic Properties deprecation?",
                                "Undeclared properties deprecated in PHP 8.2", "Properties removed",
                                "Classes deprecated", "Functions deprecated", 0));
        }
}
