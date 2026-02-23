package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class QuizQuestionBank {

        public static List<QuizQuestion> getQuestions(String language, String difficulty) {
                switch (language.toLowerCase()) {
                        case "java":
                                return getJavaQuestions(difficulty);
                        case "python":
                                return getPythonQuestions(difficulty);
                        case "c":
                                return getCQuestions(difficulty);
                        case "cpp":
                                return getCppQuestions(difficulty);
                        case "csharp":
                                return getCSharpQuestions(difficulty);
                        case "php":
                                return getPhpQuestions(difficulty);
                        case "javascript":
                                return getJSQuestions(difficulty);
                        case "devchallenge":
                                return getMixedQuestions(difficulty);
                        default:
                                return new ArrayList<>();
                }
        }

        private static QuizQuestion q(int id, String question, String a, String b, String c, String d, int correct) {
                return new QuizQuestion(id, question, new String[] { a, b, c, d }, correct);
        }

        // ============================== JAVA ==============================
        private static List<QuizQuestion> getJavaQuestions(String difficulty) {
                List<QuizQuestion> list = new ArrayList<>();
                switch (difficulty) {
                        case "easy":
                                addJavaEasy(list);
                                break;
                        case "medium":
                                addJavaMedium(list);
                                break;
                        case "hard":
                                addJavaHard(list);
                                break;
                }
                return list;
        }

        private static void addJavaEasy(List<QuizQuestion> l) {
                l.add(q(1, "What is the correct way to declare a variable in Java?", "int x = 5;", "x = 5 int;",
                                "variable x = 5;", "declare x = 5;", 0));
                l.add(q(2, "What is the output?\nSystem.out.println(5 + 3);", "8", "53", "Error", "null", 0));
                l.add(q(3, "Which keyword is used to define a class in Java?", "class", "define", "struct", "object",
                                0));
                l.add(q(4, "What does this print?\nString s = \"Hello\";\nSystem.out.println(s.length());", "5", "4",
                                "6", "Error", 0));
                l.add(q(5, "Which data type stores true/false values?", "boolean", "int", "String", "char", 0));
                l.add(q(6, "What is the output?\nint x = 10;\nint y = 3;\nSystem.out.println(x / y);", "3", "3.33", "4",
                                "Error", 0));
                l.add(q(7, "What is the size of an int in Java?", "32 bits", "16 bits", "64 bits", "8 bits", 0));
                l.add(q(8, "What does this code print?\nboolean a = true;\nboolean b = false;\nSystem.out.println(a && b);",
                                "false", "true", "Error", "null", 0));
                l.add(q(9, "Which symbol is used for single-line comments?", "//", "#", "--", "/*", 0));
                l.add(q(10, "What is the output?\nString a = \"Hello\";\nString b = \"World\";\nSystem.out.println(a + \" \" + b);",
                                "Hello World", "HelloWorld", "Error", "null", 0));
                l.add(q(11, "What is the entry point of a Java program?", "main method", "start method", "init method",
                                "run method", 0));
                l.add(q(12, "What does this code print?\nint[] arr = {1, 2, 3};\nSystem.out.println(arr[1]);", "2", "1",
                                "3", "Error", 0));
                l.add(q(13, "Which of these is a valid String declaration?", "String s = \"hello\";",
                                "string s = 'hello';", "String s = 'hello';", "str s = \"hello\";", 0));
                l.add(q(14, "What is the output?\nint x = 5;\nx++;\nSystem.out.println(x);", "6", "5", "4", "Error",
                                0));
                l.add(q(15, "What does the '+' operator do with Strings?", "Concatenates", "Adds numerically",
                                "Compares", "Nothing", 0));
                l.add(q(16, "What does this print?\nfor (int i = 0; i < 3; i++) {\n  System.out.print(i);\n}", "012",
                                "123", "0123", "Error", 0));
                l.add(q(17, "Which keyword creates a new object?", "new", "create", "make", "init", 0));
                l.add(q(18, "What is the output?\nString s = \"Java\";\nSystem.out.println(s.charAt(0));", "J", "a",
                                "v", "Error", 0));
                l.add(q(19, "What is a constructor?", "Special method to initialize objects", "A variable type",
                                "A loop structure", "An import statement", 0));
                l.add(q(20, "What does this code print?\nint a = 10;\nint b = 20;\nSystem.out.println(a > b);", "false",
                                "true", "Error", "10", 0));
                l.add(q(21, "Which loop runs at least once?", "do-while", "for", "while", "foreach", 0));
                l.add(q(22, "What is the output?\nint x = 7;\nSystem.out.println(x % 2);", "1", "0", "3", "Error", 0));
                l.add(q(23, "What keyword exits a loop?", "break", "exit", "stop", "end", 0));
                l.add(q(24, "What does this print?\nchar c = 'A';\nSystem.out.println(c + 1);", "66", "B", "A1",
                                "Error", 0));
                l.add(q(25, "What is an array in Java?", "A fixed-size collection of elements", "A single variable",
                                "A method", "A class", 0));
                l.add(q(26, "What is the output?\nString s = \"hello\";\nSystem.out.println(s.toUpperCase());", "HELLO",
                                "hello", "Hello", "Error", 0));
                l.add(q(27, "What does '==' compare for objects?", "Reference equality", "Value equality",
                                "Type equality", "Nothing", 0));
                l.add(q(28, "What does this print?\nint[] nums = new int[3];\nSystem.out.println(nums[0]);", "0",
                                "null", "Error", "undefined", 0));
                l.add(q(29, "Which access modifier makes a member accessible everywhere?", "public", "private",
                                "protected", "default", 0));
                l.add(q(30, "What is the output?\ndouble d = 5.5;\nint i = (int) d;\nSystem.out.println(i);", "5",
                                "5.5", "6", "Error", 0));
                l.add(q(31, "What does 'void' mean as a return type?", "Returns nothing", "Returns null", "Returns 0",
                                "Returns empty string", 0));
                l.add(q(32, "What does this code print?\nString s1 = \"abc\";\nString s2 = \"abc\";\nSystem.out.println(s1.equals(s2));",
                                "true", "false", "Error", "null", 0));
                l.add(q(33, "What package is automatically imported?", "java.lang", "java.util", "java.io", "java.net",
                                0));
                l.add(q(34, "What is the output?\nint x = 10;\nif (x > 5) {\n  System.out.println(\"Big\");\n} else {\n  System.out.println(\"Small\");\n}",
                                "Big", "Small", "Error", "null", 0));
                l.add(q(35, "Which keyword prevents a variable from being changed?", "final", "const", "static",
                                "fixed", 0));
                l.add(q(36, "What does this print?\nSystem.out.println(\"5\" + 3);", "53", "8", "Error", "null", 0));
                l.add(q(37, "What is the default value of an int field?", "0", "null", "-1", "undefined", 0));
                l.add(q(38, "What is the output?\nint x = 3;\nswitch(x) {\n  case 3: System.out.print(\"Three\"); break;\n  default: System.out.print(\"Other\");\n}",
                                "Three", "Other", "ThreeOther", "Error", 0));
                l.add(q(39, "Which is NOT a primitive type?", "String", "int", "char", "boolean", 0));
                l.add(q(40, "What does this code print?\nint sum = 0;\nfor (int i = 1; i <= 3; i++) {\n  sum += i;\n}\nSystem.out.println(sum);",
                                "6", "3", "10", "Error", 0));
                l.add(q(41, "How do you read input from the user?", "Scanner", "Printer", "Reader", "Input", 0));
                l.add(q(42, "What is the output?\nint a = 5, b = 10;\nint temp = a;\na = b;\nb = temp;\nSystem.out.println(a + \" \" + b);",
                                "10 5", "5 10", "Error", "10 10", 0));
                l.add(q(43, "What does 'static' mean?", "Belongs to the class, not instances", "Cannot change",
                                "Is private", "Runs first", 0));
                l.add(q(44, "What does this print?\nString s = \"Hello World\";\nSystem.out.println(s.indexOf(\"World\"));",
                                "6", "5", "7", "Error", 0));
                l.add(q(45, "Which operator checks inequality?", "!=", "<>", "=/=", "!==", 0));
                l.add(q(46, "What is the output?\nint x = 1;\nwhile (x < 4) {\n  System.out.print(x);\n  x++;\n}",
                                "123", "1234", "234", "Error", 0));
                l.add(q(47, "What is the correct file extension for Java source?", ".java", ".jav", ".class", ".j", 0));
                l.add(q(48, "What does this print?\nboolean b = (10 > 5) && (3 < 1);\nSystem.out.println(b);", "false",
                                "true", "Error", "null", 0));
                l.add(q(49, "What does ArrayList provide over arrays?", "Dynamic sizing", "Faster speed", "Less memory",
                                "Type safety", 0));
                l.add(q(50, "What is the output?\nString s = \"Java\";\nSystem.out.println(s.substring(1, 3));", "av",
                                "Ja", "ava", "Error", 0));
        }

        private static void addJavaMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\nSystem.out.println(1 + \"2\" + 3);", "123", "6", "15", "Error", 0));
                l.add(q(2, "Which collection does NOT allow duplicates?", "HashSet", "ArrayList", "LinkedList",
                                "Vector", 0));
                l.add(q(3, "What does this print?\nString s = null;\ntry {\n  s.length();\n} catch (NullPointerException e) {\n  System.out.println(\"Caught!\");\n}",
                                "Caught!", "Error", "null", "0", 0));
                l.add(q(4, "What is autoboxing?", "Auto conversion of primitives to wrappers", "Auto casting",
                                "Auto importing", "Auto compiling", 0));
                l.add(q(5, "What is the output?\nList<Integer> list = new ArrayList<>();\nlist.add(1);\nlist.add(2);\nlist.add(3);\nlist.remove(1);\nSystem.out.println(list);",
                                "[1, 3]", "[2, 3]", "[1, 2]", "Error", 0));
                l.add(q(6, "What is method overriding?", "Subclass redefines parent method",
                                "Same name different params", "Creating two methods", "Deleting a method", 0));
                l.add(q(7, "What does this code print?\nint x = 5;\nSystem.out.println(x == 5 ? \"Yes\" : \"No\");",
                                "Yes", "No", "5", "Error", 0));
                l.add(q(8, "What does 'super' keyword do?", "Calls parent class methods", "Creates objects",
                                "Exits program", "Imports packages", 0));
                l.add(q(9, "What is the output?\nStringBuilder sb = new StringBuilder(\"Hello\");\nsb.append(\" World\");\nSystem.out.println(sb);",
                                "Hello World", "HelloWorld", "Error", "null", 0));
                l.add(q(10, "What is polymorphism?", "Same method behaves differently based on object",
                                "Multiple inheritance", "Multiple constructors", "Multiple variables", 0));
                l.add(q(11, "What does this print?\nMap<String,Integer> m = new HashMap<>();\nm.put(\"a\", 1);\nm.put(\"a\", 2);\nSystem.out.println(m.get(\"a\"));",
                                "2", "1", "Error", "null", 0));
                l.add(q(12, "What is an abstract class?", "A class that cannot be instantiated directly",
                                "A final class", "An interface", "A static class", 0));
                l.add(q(13, "What is the output?\nint[] a = {5, 2, 8, 1};\nArrays.sort(a);\nSystem.out.println(a[0]);",
                                "1", "5", "2", "8", 0));
                l.add(q(14, "What is the difference between == and .equals()?",
                                "== checks reference, .equals() checks value", "They are identical", "== checks value",
                                ".equals() checks reference", 0));
                l.add(q(15, "What does this code return?\npublic int calc(int x) {\n  return x > 0 ? x * 2 : x * -1;\n}\n// calc(-3) returns:",
                                "3", "-3", "-6", "6", 0));
                l.add(q(16, "What keyword makes a class non-extendable?", "final", "static", "abstract", "sealed", 0));
                l.add(q(17, "What is the output?\ntry {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n  System.out.print(\"A\");\n} finally {\n  System.out.print(\"B\");\n}",
                                "AB", "A", "B", "Error", 0));
                l.add(q(18, "What is an enum in Java?", "A type with fixed set of constants", "A collection type",
                                "A loop type", "An exception type", 0));
                l.add(q(19, "What does this print?\nString s = \"Hello\";\nString t = new String(\"Hello\");\nSystem.out.println(s == t);",
                                "false", "true", "Error", "null", 0));
                l.add(q(20, "What is the purpose of 'instanceof'?", "Checks if object is of given type",
                                "Creates instances", "Counts instances", "Deletes instances", 0));
                l.add(q(21, "What is the output?\nint x = 0;\nfor (int i = 0; i < 5; i++) {\n  if (i % 2 == 0) x += i;\n}\nSystem.out.println(x);",
                                "6", "10", "4", "Error", 0));
                l.add(q(22, "What does Collections.unmodifiableList() return?", "A read-only list view",
                                "A sorted list", "A new list", "An empty list", 0));
                l.add(q(23, "What does this code print?\nint a = 10;\nint b = ++a;\nSystem.out.println(a + \" \" + b);",
                                "11 11", "10 11", "11 10", "Error", 0));
                l.add(q(24, "What is a lambda expression?", "An anonymous function", "A named function", "A class",
                                "A variable", 0));
                l.add(q(25, "What is the output?\nString s = \"abcdef\";\nSystem.out.println(s.replace('c', 'z'));",
                                "abzdef", "abcdef", "Error", "azbdef", 0));
                l.add(q(26, "What is the diamond problem?", "Ambiguity from multiple inheritance", "A syntax error",
                                "A runtime exception", "A design pattern", 0));
                l.add(q(27, "What does this code output?\nint[] arr = {3, 1, 4, 1, 5};\nSystem.out.println(arr.length);",
                                "5", "4", "6", "Error", 0));
                l.add(q(28, "What is a checked exception?", "Exception that must be caught or declared",
                                "A runtime exception", "An error", "A warning", 0));
                l.add(q(29, "What does this print?\nList<String> list = Arrays.asList(\"A\",\"B\",\"C\");\nSystem.out.println(list.contains(\"B\"));",
                                "true", "false", "Error", "null", 0));
                l.add(q(30, "What is the 'transient' keyword used for?", "Prevents field from being serialized",
                                "Makes field final", "Makes field static", "Makes field public", 0));
                l.add(q(31, "What is the output?\nint x = 10;\nint y = x--;\nSystem.out.println(x + \" \" + y);",
                                "9 10", "10 10", "9 9", "Error", 0));
                l.add(q(32, "What is the iterator pattern?", "Traversing elements without exposing internal structure",
                                "Sorting elements", "Creating elements", "Deleting elements", 0));
                l.add(q(33, "What does this print?\nString[] arr = {\"X\",\"Y\",\"Z\"};\nfor (String s : arr) {\n  System.out.print(s);\n}",
                                "XYZ", "X Y Z", "Error", "null", 0));
                l.add(q(34, "What is a wrapper class?", "Object representation of a primitive", "A design pattern",
                                "A collection type", "An exception type", 0));
                l.add(q(35, "What is the output?\nint result = 0;\nfor (int i = 1; i <= 5; i++) {\n  if (i == 3) continue;\n  result += i;\n}\nSystem.out.println(result);",
                                "12", "15", "10", "Error", 0));
                l.add(q(36, "What is a Stream in Java?", "Pipeline for processing collections", "An I/O class",
                                "A thread type", "A data type", 0));
                l.add(q(37, "What does this print?\nOptional<String> o = Optional.of(\"Hi\");\nSystem.out.println(o.isPresent());",
                                "true", "false", "Hi", "Error", 0));
                l.add(q(38, "What is the Builder pattern?", "Step-by-step object construction", "A sorting algorithm",
                                "A loop type", "A collection type", 0));
                l.add(q(39, "What does this code print?\nint x = 5;\nSystem.out.println(x << 1);", "10", "5", "2",
                                "Error", 0));
                l.add(q(40, "What is a functional interface?", "An interface with exactly one abstract method",
                                "Any interface", "A class", "An annotation", 0));
                l.add(q(41, "What is the output?\nString s = \"Hello\";\nchar[] c = s.toCharArray();\nSystem.out.println(c.length);",
                                "5", "4", "6", "Error", 0));
                l.add(q(42, "What does @Override annotation do?", "Indicates method overrides parent method",
                                "Creates new method", "Deletes method", "Hides method", 0));
                l.add(q(43, "What does this print?\nint[][] m = {{1,2},{3,4}};\nSystem.out.println(m[1][0]);", "3", "1",
                                "2", "4", 0));
                l.add(q(44, "What is the singleton pattern?", "Ensures a class has only one instance",
                                "Creates multiple instances", "A factory method", "An observer", 0));
                l.add(q(45, "What is the output?\nList<Integer> nums = new ArrayList<>(List.of(1,2,3));\nnums.set(1, 9);\nSystem.out.println(nums);",
                                "[1, 9, 3]", "[9, 2, 3]", "[1, 2, 9]", "Error", 0));
                l.add(q(46, "What is type erasure?", "Generic types removed at runtime", "Type casting",
                                "Type creation", "Type checking", 0));
                l.add(q(47, "What does this code print?\nint a = 0b1010;\nSystem.out.println(a);", "10", "1010",
                                "Error", "2", 0));
                l.add(q(48, "What is the Comparator interface used for?", "Custom sorting logic", "String comparison",
                                "Number formatting", "Object creation", 0));
                l.add(q(49, "What does this print?\nString s = String.join(\"-\", \"A\", \"B\", \"C\");\nSystem.out.println(s);",
                                "A-B-C", "ABC", "A B C", "Error", 0));
                l.add(q(50, "What does peek() do in streams?", "Performs action without consuming", "Removes elements",
                                "Adds elements", "Sorts elements", 0));
        }

        private static void addJavaHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\nSystem.out.println(0.1 + 0.2 == 0.3);", "false", "true", "Error",
                                "0.3", 0));
                l.add(q(2, "What causes a StackOverflowError?", "Infinite recursion", "Null pointer", "Array overflow",
                                "Memory leak", 0));
                l.add(q(3, "What does this print?\nInteger a = 127;\nInteger b = 127;\nSystem.out.println(a == b);",
                                "true", "false", "Error", "null", 0));
                l.add(q(4, "What is the Java Memory Model?", "Rules for thread-shared memory visibility",
                                "Heap allocation", "Stack allocation", "GC algorithm", 0));
                l.add(q(5, "What is the output?\nInteger c = 128;\nInteger d = 128;\nSystem.out.println(c == d);",
                                "false", "true", "Error", "null", 0));
                l.add(q(6, "What is the happens-before relationship?", "Guarantees memory visibility ordering",
                                "A sorting order", "A thread priority", "A method call order", 0));
                l.add(q(7, "What does this code print?\nString s = \"Hello\";\ns.concat(\" World\");\nSystem.out.println(s);",
                                "Hello", "Hello World", "Error", "null", 0));
                l.add(q(8, "What does ClassLoader do?", "Loads class files into JVM", "Compiles code",
                                "Runs garbage collection", "Manages threads", 0));
                l.add(q(9, "What is the output?\nint x = 5;\nSystem.out.println(x++ + ++x);", "12", "11", "10", "Error",
                                0));
                l.add(q(10, "What is covariant return type?", "Subclass can return subtype of parent's return type",
                                "Returning void", "Returning Object only", "Returning primitives only", 0));
                l.add(q(11, "What does this print?\nfinal int[] arr = {1, 2, 3};\narr[0] = 99;\nSystem.out.println(arr[0]);",
                                "99", "1", "Error", "null", 0));
                l.add(q(12, "Why can't you override static methods?", "They are bound at compile time",
                                "They are final", "They are private", "They don't exist", 0));
                l.add(q(13, "What is the output?\nList<String> list = new ArrayList<>();\nlist.add(\"A\");\nlist.add(\"B\");\nIterator<String> it = list.iterator();\nwhile(it.hasNext()) {\n  String s = it.next();\n  if(s.equals(\"A\")) it.remove();\n}\nSystem.out.println(list);",
                                "[B]", "[A]", "Error", "[A, B]", 0));
                l.add(q(14, "What is the Liskov Substitution Principle?",
                                "Subtypes must be substitutable for base types", "Classes must be final",
                                "All methods must be abstract", "No inheritance allowed", 0));
                l.add(q(15, "What does this code print?\nObject obj = \"Hello\";\nif (obj instanceof String s) {\n  System.out.println(s.length());\n}",
                                "5", "Error", "Hello", "null", 0));
                l.add(q(16, "What does invokedynamic bytecode do?", "Enables dynamic method dispatch (lambdas)",
                                "Creates objects", "Loads classes", "Handles exceptions", 0));
                l.add(q(17, "What is the output?\nMap<String,Integer> m = new HashMap<>();\nm.put(\"x\", 1);\nm.put(\"y\", 2);\nm.putIfAbsent(\"x\", 99);\nSystem.out.println(m.get(\"x\"));",
                                "1", "99", "null", "Error", 0));
                l.add(q(18, "What is the ForkJoinPool?", "Work-stealing thread pool for parallel tasks",
                                "A collection type", "A synchronization tool", "A serialization format", 0));
                l.add(q(19, "What does this code print?\nStream.of(1,2,3,4,5)\n  .filter(n -> n % 2 == 0)\n  .map(n -> n * 10)\n  .forEach(System.out::print);",
                                "2040", "12345", "1030", "Error", 0));
                l.add(q(20, "What is a memory leak in Java?", "Objects referenced but no longer needed",
                                "Null pointers", "Stack overflow", "Compilation error", 0));
                l.add(q(21, "What is the output?\nString s1 = \"abc\";\nString s2 = new String(\"abc\");\nSystem.out.println(s1 == s2.intern());",
                                "true", "false", "Error", "null", 0));
                l.add(q(22, "What is the @SuppressWarnings annotation for?", "Silences compiler warnings",
                                "Creates warnings", "Logs warnings", "Fixes warnings", 0));
                l.add(q(23, "What does this code print?\nint[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\nSystem.out.println(a[0]);",
                                "99", "1", "Error", "null", 0));
                l.add(q(24, "What is a CyclicBarrier?", "Synchronization point where threads wait for each other",
                                "A lock", "A queue", "A map", 0));
                l.add(q(25, "What is the output?\nvar list = List.of(3, 1, 4, 1, 5);\nlong count = list.stream()\n  .distinct()\n  .count();\nSystem.out.println(count);",
                                "4", "5", "3", "Error", 0));
                l.add(q(26, "What is the observer pattern?", "Object notifies dependents of state change",
                                "Creating singletons", "Sorting objects", "Building objects", 0));
                l.add(q(27, "What does this print?\nString s = \"Hello\";\nSystem.out.println(s.chars()\n  .filter(c -> c == 'l')\n  .count());",
                                "2", "1", "3", "Error", 0));
                l.add(q(28, "What is double-checked locking?",
                                "Singleton pattern with two null checks for thread safety", "Two locks", "Two threads",
                                "Two classes", 0));
                l.add(q(29, "What is the output?\ntry {\n  System.out.print(\"A\");\n  int x = 1/0;\n  System.out.print(\"B\");\n} catch (Exception e) {\n  System.out.print(\"C\");\n} finally {\n  System.out.print(\"D\");\n}",
                                "ACD", "ABCD", "AD", "AB", 0));
                l.add(q(30, "What is the proxy pattern?", "Object acting as placeholder for another", "A singleton",
                                "A factory", "An observer", 0));
                l.add(q(31, "What does this code print?\nrecord Point(int x, int y) {}\nPoint p = new Point(3, 4);\nSystem.out.println(p.x() + p.y());",
                                "7", "34", "Error", "null", 0));
                l.add(q(32, "What is Java's ServiceLoader?", "Discovers and loads service implementations",
                                "A class loader", "A thread pool", "A file loader", 0));
                l.add(q(33, "What is the output?\nCompletableFuture<String> cf =\n  CompletableFuture.supplyAsync(() -> \"Hello\")\n    .thenApply(s -> s + \" World\");\nSystem.out.println(cf.join());",
                                "Hello World", "Hello", "Error", "null", 0));
                l.add(q(34, "What does @Retention(RUNTIME) mean for annotations?",
                                "Available via reflection at runtime", "Only at compile time", "Only in source",
                                "Never available", 0));
                l.add(q(35, "What does this code print?\nvar m = Map.of(\"a\", 1, \"b\", 2);\nm.getOrDefault(\"c\", 99);\nSystem.out.println(m.size());",
                                "2", "3", "Error", "null", 0));
                l.add(q(36, "What is an AtomicInteger?", "Thread-safe integer without locks", "A regular int",
                                "A volatile int", "A synchronized int", 0));
                l.add(q(37, "What is the output?\nString result = Stream.of(\"a\",\"b\",\"c\")\n  .reduce(\"\", (a, b) -> a + b);\nSystem.out.println(result);",
                                "abc", "a", "Error", "null", 0));
                l.add(q(38, "What is the strategy pattern?", "Encapsulates algorithms to be interchangeable",
                                "A sorting algorithm", "A search algorithm", "A creation pattern", 0));
                l.add(q(39, "What does this print?\nenum Day { MON, TUE, WED }\nSystem.out.println(Day.values().length);",
                                "3", "2", "Error", "null", 0));
                l.add(q(40, "What is tail-call optimization in Java?", "Java does NOT support it",
                                "Java supports it fully", "It's a GC feature", "It's a compilation step", 0));
                l.add(q(41, "What is the output?\nint[] arr = {1, 2, 3, 4, 5};\nint sum = Arrays.stream(arr)\n  .reduce(0, Integer::sum);\nSystem.out.println(sum);",
                                "15", "10", "Error", "null", 0));
                l.add(q(42, "What is the difference between Runnable and Callable?",
                                "Callable returns a result and can throw exceptions", "They are identical",
                                "Runnable returns a result", "Callable cannot throw", 0));
                l.add(q(43, "What does this code output?\nvar list = new ArrayList<>(List.of(3,1,4));\nCollections.sort(list);\nSystem.out.println(list.get(0));",
                                "1", "3", "4", "Error", 0));
                l.add(q(44, "What is a PhantomReference used for?", "Post-mortem cleanup actions", "Strong referencing",
                                "Direct access", "Caching", 0));
                l.add(q(45, "What is the output?\nString s = \"abc\";\nbyte[] b = s.getBytes();\nSystem.out.println(b.length);",
                                "3", "6", "Error", "null", 0));
                l.add(q(46, "What is a sealed class?", "Restricts which classes can extend it",
                                "Prevents instantiation", "Makes class final", "Hides class", 0));
                l.add(q(47, "What does this print?\nvar map = new HashMap<String,List<Integer>>();\nmap.computeIfAbsent(\"k\", k -> new ArrayList<>()).add(1);\nSystem.out.println(map.get(\"k\"));",
                                "[1]", "null", "Error", "[]", 0));
                l.add(q(48, "What is the var keyword?", "Local variable type inference", "A new data type",
                                "A global variable", "A constant", 0));
                l.add(q(49, "What is the output?\nSystem.out.println(\n  \"Hello\\nWorld\".lines().count()\n);", "2",
                                "1", "Error", "11", 0));
                l.add(q(50, "What is a CompletableFuture?", "Async computation with chaining", "A thread pool",
                                "A lock", "A semaphore", 0));
        }

        // ============================== OTHER LANGUAGES ==============================
        private static List<QuizQuestion> getPythonQuestions(String difficulty) {
                return QuizQuestionBankPython.getQuestions(difficulty);
        }

        private static List<QuizQuestion> getCQuestions(String difficulty) {
                return QuizQuestionBankC.getQuestions(difficulty);
        }

        private static List<QuizQuestion> getCppQuestions(String difficulty) {
                return QuizQuestionBankCpp.getQuestions(difficulty);
        }

        private static List<QuizQuestion> getCSharpQuestions(String difficulty) {
                return QuizQuestionBankCSharp.getQuestions(difficulty);
        }

        private static List<QuizQuestion> getPhpQuestions(String difficulty) {
                return QuizQuestionBankPhp.getQuestions(difficulty);
        }

        private static List<QuizQuestion> getJSQuestions(String difficulty) {
                return QuizQuestionBankJS.getQuestions(difficulty);
        }

        /** Mixed mode: pulls from ALL language banks, shuffles, and caps at 50 */
        private static List<QuizQuestion> getMixedQuestions(String difficulty) {
                List<QuizQuestion> all = new ArrayList<>();
                all.addAll(getJavaQuestions(difficulty));
                all.addAll(getPythonQuestions(difficulty));
                all.addAll(getCQuestions(difficulty));
                all.addAll(getCppQuestions(difficulty));
                all.addAll(getCSharpQuestions(difficulty));
                all.addAll(getPhpQuestions(difficulty));
                all.addAll(getJSQuestions(difficulty));
                Collections.shuffle(all);
                if (all.size() > 50) {
                        all = new ArrayList<>(all.subList(0, 50));
                }
                return all;
        }
}
