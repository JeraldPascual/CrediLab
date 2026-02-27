package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionBankCpp {

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
                l.add(q(1, "What is the output?\n```cpp\ncout << 5 + 3;\n```", "8", "53", "Error", "Undefined", 0));
                l.add(q(2, "Which header is needed for cout?", "<iostream>", "<stdio.h>", "<string>", "<cstdlib>", 0));
                l.add(q(3, "What does this print?\n```cpp\nstring s = \"Hello\";\ncout << s.length();\n```", "5", "4", "6", "Error",
                                0));
                l.add(q(4, "What is the C++ file extension?", ".cpp", ".c", ".cc", ".cxx", 0));
                l.add(q(5, "What is the output?\n```cpp\nint x = 10;\nx++;\ncout << x;\n```", "11", "10", "12", "Error", 0));
                l.add(q(6, "Which keyword defines a class?", "class", "struct", "define", "object", 0));
                l.add(q(7, "What does this print?\n```cpp\nbool a = true;\nbool b = false;\ncout << (a && b);\n```", "0", "1",
                                "Error", "false", 0));
                l.add(q(8, "What is the 'new' keyword used for?", "Dynamic memory allocation", "Creating classes",
                                "Importing modules", "Defining constants", 0));
                l.add(q(9, "What is the output?\n```cpp\nint arr[] = {10, 20, 30};\ncout << arr[2];\n```", "30", "20", "10", "Error",
                                0));
                l.add(q(10, "What is a reference in C++?", "An alias for another variable", "A pointer", "A copy",
                                "A constant", 0));
                l.add(q(11, "What does this print?\n```cpp\nint a = 5;\nint& b = a;\nb = 10;\ncout << a;\n```", "10", "5", "Error",
                                "0", 0));
                l.add(q(12, "What does 'endl' do?", "Outputs newline and flushes buffer", "Ends program", "Ends loop",
                                "Ends class", 0));
                l.add(q(13, "What is the output?\n```cpp\nfor (int i = 0; i < 3; i++)\n  cout << i;\n```", "012", "123", "0123",
                                "Error", 0));
                l.add(q(14, "What is a constructor?", "Special method called when object is created", "A destructor",
                                "A variable", "An operator", 0));
                l.add(q(15, "What does this print?\n```cpp\nstring s = \"World\";\ncout << \"Hello \" << s;\n```", "Hello World",
                                "HelloWorld", "Error", "Hello s", 0));
                l.add(q(16, "What is the scope resolution operator?", "::", "->", ".", ":=", 0));
                l.add(q(17, "What is the output?\n```cpp\nint x = 7;\ncout << x % 2;\n```", "1", "0", "3", "Error", 0));
                l.add(q(18, "What keyword makes a member inaccessible from outside?", "private", "public", "protected",
                                "internal", 0));
                l.add(q(19, "What does this print?\n```cpp\nvector<int> v = {1, 2, 3};\ncout << v.size();\n```", "3", "2", "4",
                                "Error", 0));
                l.add(q(20, "What is the 'delete' keyword used for?", "Freeing dynamically allocated memory",
                                "Removing classes", "Deleting files", "Removing variables", 0));
                l.add(q(21, "What is the output?\n```cpp\nint* p = new int(42);\ncout << *p;\ndelete p;\n```", "42", "Address",
                                "Error", "0", 0));
                l.add(q(22, "Which keyword prevents inheritance?", "final", "sealed", "static", "const", 0));
                l.add(q(23, "What does this print?\n```cpp\nstring s = \"Hello\";\ncout << s[0];\n```", "H", "e", "Error", "0", 0));
                l.add(q(24, "What is function overloading?", "Same name, different parameters",
                                "Same name, same parameters", "Different name", "A class", 0));
                l.add(q(25, "What is the output?\n```cpp\nint add(int a, int b) { return a+b; }\ncout << add(3, 4);\n```", "7", "34",
                                "Error", "12", 0));
                l.add(q(26, "What is the 'auto' keyword?", "Automatic type deduction", "A storage class",
                                "A loop keyword", "A constant", 0));
                l.add(q(27, "What does this print?\n```cpp\nauto x = 3.14;\ncout << typeid(x).name();\n```", "d (double)", "f", "i",
                                "Error", 0));
                l.add(q(28, "What is a namespace?", "Organizes code into logical groups", "A class type",
                                "A variable type", "A loop type", 0));
                l.add(q(29, "What is the output?\n```cpp\nint a = 10, b = 3;\ncout << a / b;\n```", "3", "3.33", "4", "Error", 0));
                l.add(q(30, "What is the default access modifier for class members?", "private", "public", "protected",
                                "internal", 0));
                l.add(q(31, "What does this print?\n```cpp\nvector<int> v = {5, 2, 8};\nsort(v.begin(), v.end());\ncout << v[0];\n```",
                                "2", "5", "8", "Error", 0));
                l.add(q(32, "What is a destructor?", "Called when object is destroyed", "Called when object is created",
                                "A type", "An operator", 0));
                l.add(q(33, "What is the output?\n```cpp\nstring s = \"abc\";\ns += \"def\";\ncout << s;\n```", "abcdef", "abc",
                                "def", "Error", 0));
                l.add(q(34, "What keyword creates a constant?", "const", "final", "static", "define", 0));
                l.add(q(35, "What does this print?\n```cpp\nint x = 5;\ncout << (x > 3 ? \"Yes\" : \"No\");\n```", "Yes", "No", "5",
                                "Error", 0));
                l.add(q(36, "What is the 'this' pointer?", "Pointer to current object", "A global variable",
                                "A null pointer", "A static variable", 0));
                l.add(q(37, "What is the output?\n```cpp\nchar c = 'A';\ncout << (int)c;\n```", "65", "A", "Error", "0", 0));
                l.add(q(38, "What is the STL?", "Standard Template Library", "System Template Layer",
                                "Static Type Library", "String Tool Library", 0));
                l.add(q(39, "What does this print?\n```cpp\nmap<string,int> m;\nm[\"a\"] = 1;\nm[\"b\"] = 2;\ncout << m[\"a\"];\n```",
                                "1", "2", "Error", "a", 0));
                l.add(q(40, "What is inheritance?", "Deriving new class from existing one", "Creating objects",
                                "Defining macros", "Importing headers", 0));
                l.add(q(41, "What is the output?\n```cpp\nint sum = 0;\nfor (int n : {1,2,3,4})\n  sum += n;\ncout << sum;\n```",
                                "10", "4", "Error", "24", 0));
                l.add(q(42, "What is polymorphism?", "Same interface, different implementations",
                                "Multiple inheritance", "Operator overloading only", "A container", 0));
                l.add(q(43, "What does this print?\n```cpp\nvector<int> v;\nv.push_back(1);\nv.push_back(2);\nv.push_back(3);\ncout << v.back();\n```",
                                "3", "1", "2", "Error", 0));
                l.add(q(44, "What is a virtual function?", "Function that can be overridden in derived classes",
                                "A static function", "A private function", "A template function", 0));
                l.add(q(45, "What is the output?\n```cpp\ntry {\n  throw 42;\n} catch (int e) {\n  cout << e;\n}\n```", "42",
                                "Error", "0", "Exception", 0));
                l.add(q(46, "What is a template?", "Generic programming with type parameters", "A class", "A function",
                                "A macro", 0));
                l.add(q(47, "What does this print?\n```cpp\nint x = 10;\nint& r = x;\nr = 20;\ncout << x;\n```", "20", "10", "Error",
                                "0", 0));
                l.add(q(48, "What is the difference between struct and class in C++?",
                                "Default access: struct public, class private", "No difference",
                                "Struct can't have methods", "Class can't inherit", 0));
                l.add(q(49, "What is the output?\n```cpp\nset<int> s = {3, 1, 4, 1, 5};\ncout << s.size();\n```", "4", "5", "3",
                                "Error", 0));
                l.add(q(50, "What does '#include' do?", "Includes header file contents", "Creates a class",
                                "Defines a variable", "Starts a loop", 0));
        }

        private static void addMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```cpp\nunique_ptr<int> p = make_unique<int>(42);\ncout << *p;\n```", "42",
                                "Address", "Error", "null", 0));
                l.add(q(2, "What is RAII?", "Resource Acquisition Is Initialization", "Runtime AI Interface",
                                "Reference Allocation Idiom", "Recursive Algorithm Init", 0));
                l.add(q(3, "What does this print?\n```cpp\nclass A {\npublic:\n  virtual void f() { cout << \"A\"; }\n};\nclass B : public A {\npublic:\n  void f() override { cout << \"B\"; }\n};\nA* p = new B();\np->f();\ndelete p;\n```",
                                "B", "A", "Error", "AB", 0));
                l.add(q(4, "What is move semantics?", "Transferring resources instead of copying", "Moving files",
                                "Moving memory", "Moving classes", 0));
                l.add(q(5, "What is the output?\n```cpp\nvector<int> v = {1,2,3,4,5};\nauto it = find(v.begin(), v.end(), 3);\ncout << *it;\n```",
                                "3", "2", "Error", "5", 0));
                l.add(q(6, "What is std::shared_ptr?", "Reference-counted smart pointer", "A raw pointer",
                                "A weak pointer", "A void pointer", 0));
                l.add(q(7, "What does this print?\n```cpp\nstring s = \"Hello World\";\ncout << s.substr(6, 5);\n```", "World",
                                "Hello", "Error", "orld", 0));
                l.add(q(8, "What is the Rule of Three?", "Define destructor, copy constructor, copy assignment",
                                "Three classes needed", "Three includes needed", "Three variables needed", 0));
                l.add(q(9, "What is the output?\n```cpp\nlambda:\nauto f = [](int x) { return x * 2; };\ncout << f(5);\n```", "10",
                                "5", "Error", "25", 0));
                l.add(q(10, "What is constexpr?", "Compile-time constant expression", "A variable type",
                                "A loop keyword", "A class modifier", 0));
                l.add(q(11, "What does this print?\n```cpp\nconstexpr int sq(int x) { return x*x; }\ncout << sq(5);\n```", "25",
                                "10", "Error", "5", 0));
                l.add(q(12, "What is type casting with static_cast?", "Compile-time checked type conversion",
                                "Runtime cast", "Dynamic cast", "Reinterpret cast", 0));
                l.add(q(13, "What is the output?\n```cpp\nint x = 10;\ndouble d = static_cast<double>(x) / 3;\ncout << d;\n```",
                                "3.33333", "3", "Error", "10", 0));
                l.add(q(14, "What is a pure virtual function?", "Virtual function with = 0, making class abstract",
                                "A static function", "A private function", "A template", 0));
                l.add(q(15, "What does this print?\n```cpp\nmap<string,int> m = {{\"a\",1},{\"b\",2}};\ncout << m.count(\"c\");\n```",
                                "0", "1", "Error", "null", 0));
                l.add(q(16, "What is std::optional?", "Wrapper that may or may not hold a value", "An array type",
                                "A pointer type", "A string type", 0));
                l.add(q(17, "What is the output?\n```cpp\noptional<int> o = 42;\ncout << o.value();\n```", "42", "Error", "null",
                                "0", 0));
                l.add(q(18, "What is operator overloading?", "Defining custom behavior for operators",
                                "Creating operators", "Deleting operators", "Importing operators", 0));
                l.add(q(19, "What does this print?\n```cpp\nstruct V {\n  int x, y;\n  V operator+(const V& o) { return {x+o.x, y+o.y}; }\n};\nV a{1,2}, b{3,4};\nV c = a + b;\ncout << c.x << c.y;\n```",
                                "46", "13", "Error", "12", 0));
                l.add(q(20, "What is std::variant?", "Type-safe union", "A regular union", "A struct", "A class", 0));
                l.add(q(21, "What is the output?\n```cpp\nvector<int> v = {3,1,4,1,5};\nsort(v.begin(), v.end());\ncout << v.back();\n```",
                                "5", "1", "3", "Error", 0));
                l.add(q(22, "What is decltype?", "Queries the type of an expression", "Declares a type",
                                "Defines a function", "Creates a class", 0));
                l.add(q(23, "What does this print?\n```cpp\nauto [a, b] = make_pair(1, 2);\ncout << a + b;\n```", "3", "12", "Error",
                                "pair", 0));
                l.add(q(24, "What is std::thread?", "Class for managing threads", "A function type", "A container",
                                "A smart pointer", 0));
                l.add(q(25, "What is the output?\n```cpp\nstring s = \"hello\";\ntransform(s.begin(), s.end(), s.begin(), ::toupper);\ncout << s;\n```",
                                "HELLO", "hello", "Error", "Hello", 0));
                l.add(q(26, "What is std::mutex?", "Synchronization primitive for thread safety", "A container",
                                "A smart pointer", "An algorithm", 0));
                l.add(q(27, "What does this print?\n```cpp\nvector<int> v = {1,2,3,4,5};\nint sum = accumulate(v.begin(), v.end(), 0);\ncout << sum;\n```",
                                "15", "10", "Error", "5", 0));
                l.add(q(28, "What is SFINAE?", "Substitution Failure Is Not An Error", "Standard Function Interface",
                                "Static File Interface", "System Function Init", 0));
                l.add(q(29, "What is the output?\n```cpp\nunordered_map<string,int> m;\nm[\"x\"] = 1;\nm[\"y\"] = 2;\ncout << m.size();\n```",
                                "2", "1", "Error", "0", 0));
                l.add(q(30, "What is std::function?", "Type-erased callable wrapper", "A regular function", "A lambda",
                                "A macro", 0));
                l.add(q(31, "What does this print?\n```cpp\nfunction<int(int)> f = [](int x) { return x * 3; };\ncout << f(7);\n```",
                                "21", "7", "Error", "3", 0));
                l.add(q(32, "What is emplace_back vs push_back?", "emplace constructs in-place, push copies",
                                "They are identical", "push is faster", "emplace copies", 0));
                l.add(q(33, "What is the output?\n```cpp\nvector<int> v;\nv.emplace_back(42);\ncout << v.front();\n```", "42", "0",
                                "Error", "null", 0));
                l.add(q(34, "What is aggregate initialization?", "Initializing struct/array with braces",
                                "A function call", "A constructor", "A macro", 0));
                l.add(q(35, "What does this print?\n```cpp\narray<int,3> a = {1, 2, 3};\ncout << a.at(2);\n```", "3", "2", "Error",
                                "1", 0));
                l.add(q(36, "What is the noexcept specifier?", "Promises function won't throw exceptions",
                                "Allows exceptions", "Catches exceptions", "Creates exceptions", 0));
                l.add(q(37, "What is the output?\n```cpp\ntuple<int,string,double> t(1, \"hi\", 3.14);\ncout << get<1>(t);\n```",
                                "hi", "1", "3.14", "Error", 0));
                l.add(q(38, "What is the difference between emplace and insert for map?",
                                "emplace constructs in-place, insert copies/moves", "They are identical",
                                "insert is faster", "emplace copies", 0));
                l.add(q(39, "What does this print?\n```cpp\ndeque<int> d = {1,2,3};\nd.push_front(0);\ncout << d[0];\n```", "0", "1",
                                "Error", "3", 0));
                l.add(q(40, "What is if constexpr?", "Compile-time if statement", "A runtime if", "A loop", "A macro",
                                0));
                l.add(q(41, "What is the output?\n```cpp\nvector<int> v = {1,2,3,4,5};\nauto it = remove(v.begin(), v.end(), 3);\nv.erase(it, v.end());\ncout << v.size();\n```",
                                "4", "5", "3", "Error", 0));
                l.add(q(42, "What is std::any?", "Type-safe container for any single value", "An array", "A template",
                                "A pointer", 0));
                l.add(q(43, "What does this print?\n```cpp\nstringstream ss;\nss << 42;\ncout << ss.str();\n```", "42", "Error", "0",
                                "null", 0));
                l.add(q(44, "What are fold expressions?", "Expanding parameter packs with operators", "A loop type",
                                "A class feature", "A cast type", 0));
                l.add(q(45, "What is the output?\n```cpp\nvector<int> v = {1,2,3};\nfor (auto it = v.rbegin(); it != v.rend(); ++it)\n  cout << *it;\n```",
                                "321", "123", "Error", "213", 0));
                l.add(q(46, "What is the spaceship operator <=>?", "Three-way comparison operator", "A shift operator",
                                "A pointer operator", "A cast operator", 0));
                l.add(q(47, "What does this print?\n```cpp\nint a = 5;\ncout << (a <=> 3 > 0);\n```", "1 (true)", "0", "Error", "5",
                                0));
                l.add(q(48, "What is std::span?", "Non-owning view over contiguous data", "A container",
                                "A smart pointer", "A string type", 0));
                l.add(q(49, "What is the output?\n```cpp\npriority_queue<int> pq;\npq.push(3);\npq.push(1);\npq.push(4);\ncout << pq.top();\n```",
                                "4", "1", "3", "Error", 0));
                l.add(q(50, "What is CTAD?", "Class Template Argument Deduction", "Compile Time Array Definition",
                                "Constant Type Alias Declaration", "Class Type Auto Define", 0));
        }

        private static void addHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```cpp\ncout << (3 <=> 5 < 0);\n```", "1 (true)", "0", "Error", "-2", 0));
                l.add(q(2, "What is the Curiously Recurring Template Pattern?",
                                "Class inherits from template of itself", "A design pattern", "A sorting algorithm",
                                "A memory pattern", 0));
                l.add(q(3, "What does this print?\n```cpp\ntemplate<typename T>\nT add(T a, T b) { return a + b; }\ncout << add(1.5, 2.5);\n```",
                                "4", "3", "Error", "1.52.5", 0));
                l.add(q(4, "What is expression SFINAE?", "Template overload resolution based on expression validity",
                                "A runtime check", "A loop type", "A cast type", 0));
                l.add(q(5, "What is the output?\n```cpp\nconstexpr auto fib(int n) -> int {\n  return n <= 1 ? n : fib(n-1) + fib(n-2);\n}\ncout << fib(10);\n```",
                                "55", "89", "34", "Error", 0));
                l.add(q(6, "What are concepts in C++20?", "Named constraints on template parameters",
                                "A design pattern", "A class type", "A container", 0));
                l.add(q(7, "What does this print?\n```cpp\ntemplate<typename T>\nrequires integral<T>\nT twice(T x) { return x * 2; }\ncout << twice(5);\n```",
                                "10", "5", "Error", "25", 0));
                l.add(q(8, "What is the Rule of Five?", "Destructor, copy/move constructors, copy/move assignment",
                                "Five design patterns", "Five STL containers", "Five smart pointers", 0));
                l.add(q(9, "What is the output?\n```cpp\nvector<int> v = {1,2,3,4,5};\nint sum = 0;\nfor_each(v.begin(), v.end(), [&sum](int x){ sum += x; });\ncout << sum;\n```",
                                "15", "10", "Error", "5", 0));
                l.add(q(10, "What is std::coroutine_handle?", "Low-level handle to a coroutine frame",
                                "A thread handle", "A file handle", "A memory handle", 0));
                l.add(q(11, "What does this print?\n```cpp\nauto f = []<typename T>(T x) { return x * x; };\ncout << f(4);\n```",
                                "16", "4", "Error", "8", 0));
                l.add(q(12, "What is the pimpl idiom?", "Pointer to implementation for ABI stability",
                                "A design pattern only", "A template technique", "A memory technique", 0));
                l.add(q(13, "What is the output?\n```cpp\nint x = 0;\nauto inc = [&x]() mutable { return ++x; };\ncout << inc() << inc();\n```",
                                "12", "11", "Error", "21", 0));
                l.add(q(14, "What is std::expected (C++23)?", "Value or error type", "A container", "A smart pointer",
                                "A thread type", 0));
                l.add(q(15, "What does this print?\n```cpp\nstruct S {\n  int x = 1;\n  int y = 2;\n};\nauto [a, b] = S{};\ncout << a + b;\n```",
                                "3", "12", "Error", "S", 0));
                l.add(q(16, "What is type erasure?", "Hiding concrete type behind abstract interface", "Deleting types",
                                "Casting types", "Creating types", 0));
                l.add(q(17, "What is the output?\n```cpp\nusing namespace std::literals;\nauto d = 5s;\ncout << d.count();\n```",
                                "5", "5000", "Error", "0", 0));
                l.add(q(18, "What is a memory_order in atomics?", "Specifies ordering constraints for atomic ops",
                                "A sorting algorithm", "A container", "A pointer type", 0));
                l.add(q(19, "What does this print?\n```cpp\natomic<int> a(0);\na.fetch_add(5);\ncout << a.load();\n```", "5", "0",
                                "Error", "1", 0));
                l.add(q(20, "What is ADL (Argument Dependent Lookup)?", "Finding functions based on argument types",
                                "A template feature", "A macro feature", "A loop feature", 0));
                l.add(q(21, "What is the output?\n```cpp\nvector<int> v = {1,2,3,4,5};\nauto r = v | views::filter([](int x){return x%2==0;});\nfor(int x : r) cout << x;\n```",
                                "24", "135", "12345", "Error", 0));
                l.add(q(22, "What are C++20 ranges?", "Composable algorithms over sequences", "A container type",
                                "A loop type", "A pointer type", 0));
                l.add(q(23, "What does this print?\n```cpp\nstruct A { virtual ~A() = default; };\nstruct B : A {};\nA* p = new B();\ncout << (dynamic_cast<B*>(p) != nullptr);\n```",
                                "1", "0", "Error", "null", 0));
                l.add(q(24, "What is std::source_location?", "Compile-time info about source code location",
                                "A file path", "A line number only", "A debug tool only", 0));
                l.add(q(25, "What is the output?\n```cpp\nstring s = \"Hello\";\nstring_view sv = s;\ncout << sv.substr(1, 3);\n```",
                                "ell", "Hel", "Error", "llo", 0));
                l.add(q(26, "What are modules in C++20?", "Compiled units replacing headers", "A namespace feature",
                                "A template feature", "A class feature", 0));
                l.add(q(27, "What does this print?\n```cpp\ncout << is_same_v<int, int32_t>;\n```", "1", "0", "Error", "true", 0));
                l.add(q(28, "What is std::jthread?", "Thread with auto-join and cancellation", "A regular thread",
                                "A coroutine", "A timer", 0));
                l.add(q(29, "What is the output?\n```cpp\nvector<pair<int,int>> v = {{1,2},{3,4}};\nauto& [a,b] = v[1];\ncout << a << b;\n```",
                                "34", "12", "Error", "13", 0));
                l.add(q(30, "What is tag dispatch?", "Using empty types for function overload selection",
                                "A design pattern only", "A runtime technique", "A loop technique", 0));
                l.add(q(31, "What does this print?\n```cpp\nconsteval int square(int n) { return n * n; }\ncout << square(7);\n```",
                                "49", "14", "Error", "7", 0));
                l.add(q(32, "What is the difference between constexpr and consteval?",
                                "consteval MUST be evaluated at compile time", "They are identical",
                                "constexpr must be compile-time", "consteval is runtime", 0));
                l.add(q(33, "What is the output?\n```cpp\narray<int,5> a = {5,4,3,2,1};\nranges::sort(a);\ncout << a.front();\n```",
                                "1", "5", "Error", "3", 0));
                l.add(q(34, "What is co_await?", "Suspends coroutine until operation completes", "A loop keyword",
                                "A cast operator", "A thread function", 0));
                l.add(q(35, "What does this print?\n```cpp\nauto gen = []() -> generator<int> {\n  co_yield 1;\n  co_yield 2;\n};\n// Conceptually prints first yielded value.\n```",
                                "1", "2", "Error", "generator", 0));
                l.add(q(36, "What is the small buffer optimization?", "Storing small objects in-place instead of heap",
                                "A sorting optimization", "A template optimization", "A compile optimization", 0));
                l.add(q(37, "What is the output?\n```cpp\nusing V = variant<int, string>;\nV v = 42;\ncout << get<int>(v);\n```",
                                "42", "Error", "0", "string", 0));
                l.add(q(38, "What is Niebloid?", "Callable object preventing ADL", "A design pattern", "A container",
                                "A smart pointer", 0));
                l.add(q(39, "What does this print?\n```cpp\nbitset<8> b(42);\ncout << b;\n```", "00101010", "42", "Error",
                                "10101010", 0));
                l.add(q(40, "What is a deduction guide?", "User-defined CTAD rule", "A template rule",
                                "A namespace rule", "A class rule", 0));
                l.add(q(41, "What is the output?\n```cpp\nconst char* s = R\"(Hello\nWorld)\";\ncout << strlen(s);\n```", "11", "10",
                                "12", "Error", 0));
                l.add(q(42, "What is the flat_map (C++23)?", "Sorted associative container using contiguous storage",
                                "A regular map", "A hash map", "A multimap", 0));
                l.add(q(43, "What does this print?\n```cpp\ncomplex<double> c(3.0, 4.0);\ncout << abs(c);\n```", "5", "3", "4",
                                "Error", 0));
                l.add(q(44, "What is the mdspan (C++23)?", "Multi-dimensional non-owning view", "A container",
                                "A smart pointer", "A string type", 0));
                l.add(q(45, "What is the output?\n```cpp\nvector v = {1, 2, 3};\ncout << v.size();\n```", "3", "Error (no template)",
                                "0", "Undefined", 0));
                l.add(q(46, "What is static reflection (proposed)?", "Inspect types and values at compile time",
                                "Runtime reflection", "A debug tool", "A profiler", 0));
                l.add(q(47, "What does this print?\n```cpp\nformat:\ncout << format(\"{} + {} = {}\", 1, 2, 3);\n```", "1 + 2 = 3",
                                "Error", "{} + {} = {}", "1 2 3", 0));
                l.add(q(48, "What is a PMR allocator?", "Polymorphic Memory Resource allocator", "A pool allocator",
                                "A stack allocator", "A heap allocator", 0));
                l.add(q(49, "What is the output?\n```cpp\nint x = 42;\ncout << bit_cast<float>(x);\n```",
                                "Implementation-defined float", "42", "Error", "0", 0));
                l.add(q(50, "What is contract programming (proposed)?",
                                "Preconditions/postconditions/assertions in code", "Design patterns", "Testing",
                                "Debugging", 0));
        }
}