package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.List;

public class QuizQuestionBankC {

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
                l.add(q(1, "What is the output?\n```c\nprintf(\"%d\", 5 + 3);\n```", "8", "53", "Error", "Undefined", 0));
                l.add(q(2, "Which header file is required for printf()?", "stdio.h", "stdlib.h", "string.h", "math.h",
                                0));
                l.add(q(3, "What does this print?\n```c\nint x = 10;\nprintf(\"%d\", x / 3);\n```", "3", "3.33", "4", "Error", 0));
                l.add(q(4, "What is the size of char in C?", "1 byte", "2 bytes", "4 bytes", "8 bytes", 0));
                l.add(q(5, "What is the output?\n```c\nint a = 5;\nprintf(\"%d\", a++);\n```", "5", "6", "4", "Error", 0));
                l.add(q(6, "Which keyword is used to define a constant?", "const", "final", "constant", "define", 0));
                l.add(q(7, "What does this print?\n```c\nchar c = 'A';\nprintf(\"%d\", c);\n```", "65", "A", "Error", "0", 0));
                l.add(q(8, "What is a pointer in C?", "A variable storing memory address", "A data type", "A function",
                                "A loop", 0));
                l.add(q(9, "What is the output?\n```c\nint arr[] = {10, 20, 30};\nprintf(\"%d\", arr[1]);\n```", "20", "10", "30",
                                "Error", 0));
                l.add(q(10, "Which function reads input from the user?", "scanf()", "input()", "read()", "get()", 0));
                l.add(q(11, "What does this print?\n```c\nprintf(\"%d\", sizeof(int));\n```", "4", "2", "8", "1", 0));
                l.add(q(12, "What is the null terminator in C strings?", "'\\0'", "'\\n'", "NULL", "0", 0));
                l.add(q(13, "What is the output?\n```c\nchar s[] = \"Hello\";\nprintf(\"%d\", strlen(s));\n```", "5", "6", "4",
                                "Error", 0));
                l.add(q(14, "What does 'void' mean as a return type?", "Function returns nothing", "Returns 0",
                                "Returns null", "Returns empty", 0));
                l.add(q(15, "What does this print?\n```c\nint x = 7;\nprintf(\"%d\", x % 2);\n```", "1", "0", "3", "Error", 0));
                l.add(q(16, "Which operator gets the address of a variable?", "&", "*", "@", "#", 0));
                l.add(q(17, "What is the output?\n```c\nfor (int i = 0; i < 3; i++)\n  printf(\"%d\", i);\n```", "012", "123",
                                "0123", "Error", 0));
                l.add(q(18, "What is a struct in C?", "User-defined data type grouping variables", "A function",
                                "A loop", "A pointer", 0));
                l.add(q(19, "What does this print?\n```c\nint a = 10, b = 20;\nprintf(\"%d\", a > b);\n```", "0", "1", "Error",
                                "false", 0));
                l.add(q(20, "Which function allocates memory dynamically?", "malloc()", "alloc()", "new()", "create()",
                                0));
                l.add(q(21, "What is the output?\n```c\nint x = 5;\nint *p = &x;\nprintf(\"%d\", *p);\n```", "5", "Address",
                                "Error", "0", 0));
                l.add(q(22, "What is the difference between '=' and '=='?", "'=' assigns, '==' compares",
                                "They are the same", "'==' assigns", "'=' compares", 0));
                l.add(q(23, "What does this print?\n```c\nint a = 3;\nswitch(a) {\n  case 3: printf(\"Three\"); break;\n  default: printf(\"Other\");\n}\n```",
                                "Three", "Other", "ThreeOther", "Error", 0));
                l.add(q(24, "What is the correct way to declare a function?", "int add(int a, int b);",
                                "add(a, b) int;", "function add(a, b);", "def add(a, b):", 0));
                l.add(q(25, "What is the output?\n```c\nint arr[5] = {0};\nprintf(\"%d\", arr[3]);\n```", "0", "Garbage", "Error",
                                "5", 0));
                l.add(q(26, "What keyword breaks out of a loop?", "break", "exit", "stop", "end", 0));
                l.add(q(27, "What does this print?\n```c\nprintf(\"%c\", 72);\n```", "H", "72", "Error", "7", 0));
                l.add(q(28, "What is an array in C?", "A fixed-size collection of same-type elements", "A dynamic list",
                                "A pointer", "A struct", 0));
                l.add(q(29, "What is the output?\n```c\nint x = -5;\nprintf(\"%d\", x > 0 ? x : -x);\n```", "5", "-5", "0",
                                "Error", 0));
                l.add(q(30, "Which function frees allocated memory?", "free()", "delete()", "release()", "dealloc()",
                                0));
                l.add(q(31, "What does this print?\n```c\nint sum = 0;\nfor (int i = 1; i <= 3; i++)\n  sum += i;\nprintf(\"%d\", sum);\n```",
                                "6", "3", "10", "Error", 0));
                l.add(q(32, "What is a header file?", "File containing function declarations", "An executable",
                                "A data file", "A compiler", 0));
                l.add(q(33, "What is the output?\n```c\nchar s1[] = \"Hi\";\nchar s2[] = \"Hi\";\nprintf(\"%d\", strcmp(s1, s2));\n```",
                                "0", "1", "-1", "Error", 0));
                l.add(q(34, "What does 'static' mean for a local variable?", "Retains value between function calls",
                                "Can't change", "Is public", "Is deleted", 0));
                l.add(q(35, "What does this print?\n```c\nint a = 5;\nif (a == 5)\n  printf(\"Yes\");\nelse\n  printf(\"No\");\n```",
                                "Yes", "No", "Error", "5", 0));
                l.add(q(36, "What is the preprocessor directive #define?", "Creates a macro/constant", "Imports a file",
                                "Declares a variable", "Creates a function", 0));
                l.add(q(37, "What is the output?\n```c\n#define MAX 100\nprintf(\"%d\", MAX);\n```", "100", "MAX", "Error", "0",
                                0));
                l.add(q(38, "Which loop checks condition after execution?", "do-while", "for", "while", "switch", 0));
                l.add(q(39, "What does this print?\n```c\nint x = 1;\ndo {\n  printf(\"%d\", x);\n  x++;\n} while (x <= 3);\n```",
                                "123", "1234", "12", "Error", 0));
                l.add(q(40, "What is a typedef?", "Creates an alias for a data type", "Defines a function",
                                "Creates a variable", "Imports a module", 0));
                l.add(q(41, "What is the output?\n```c\nint a = 10, b = 3;\nprintf(\"%d\", a % b);\n```", "1", "3", "0", "Error",
                                0));
                l.add(q(42, "What is the main() function?", "Entry point of a C program", "A library function",
                                "A preprocessor", "A header file", 0));
                l.add(q(43, "What does this print?\n```c\nint x = 0xFF;\nprintf(\"%d\", x);\n```", "255", "FF", "Error", "15", 0));
                l.add(q(44, "What is calloc()?", "Allocates and zeroes memory", "Just allocates", "Frees memory",
                                "Resizes memory", 0));
                l.add(q(45, "What is the output?\n```c\nint x = 5;\nprintf(\"%d\", ++x);\n```", "6", "5", "4", "Error", 0));
                l.add(q(46, "What is the scope of a local variable?", "Within the function/block", "Entire program",
                                "Other files", "Everywhere", 0));
                l.add(q(47, "What does this print?\n```c\nfloat f = 3.14;\nprintf(\"%d\", (int)f);\n```", "3", "3.14", "4",
                                "Error", 0));
                l.add(q(48, "What is a function prototype?", "Declaration of function before definition", "A class",
                                "A pointer", "A struct", 0));
                l.add(q(49, "What is the output?\n```c\nchar s[] = \"ABC\";\nprintf(\"%c\", s[2]);\n```", "C", "A", "B", "Error",
                                0));
                l.add(q(50, "What does return 0 in main() indicate?", "Successful program execution", "Error occurred",
                                "Program crashed", "Nothing", 0));
        }

        private static void addMedium(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```c\nint *p = NULL;\nprintf(\"%p\", (void*)p);\n```", "0 or (nil)", "Error",
                                "NULL", "Undefined", 0));
                l.add(q(2, "What is a dangling pointer?", "Points to freed memory", "A null pointer", "A void pointer",
                                "A function pointer", 0));
                l.add(q(3, "What does this print?\n```c\nint a[] = {1,2,3,4,5};\nint *p = a + 2;\nprintf(\"%d\", *p);\n```", "3",
                                "2", "1", "Error", 0));
                l.add(q(4, "What is pointer arithmetic?", "Operations on pointers based on data type size",
                                "Math with integers", "String operations", "Memory allocation", 0));
                l.add(q(5, "What is the output?\n```c\nstruct Point { int x; int y; };\nstruct Point p = {3, 4};\nprintf(\"%d\", p.x + p.y);\n```",
                                "7", "34", "Error", "0", 0));
                l.add(q(6, "What is a union in C?", "Members share same memory location", "Like a struct",
                                "An array type", "A function type", 0));
                l.add(q(7, "What does this print?\n```c\nunion Data { int i; float f; };\nunion Data d;\nd.i = 42;\nprintf(\"%d\", d.i);\n```",
                                "42", "0", "Error", "Garbage", 0));
                l.add(q(8, "What is the volatile keyword?", "Prevents compiler from optimizing variable access",
                                "Makes variable constant", "Allocates memory", "Frees memory", 0));
                l.add(q(9, "What is the output?\n```c\nchar *s = \"Hello\";\nprintf(\"%c\", *(s+1));\n```", "e", "H", "l", "Error",
                                0));
                l.add(q(10, "What is a function pointer?", "A pointer that stores function address",
                                "A regular pointer", "A struct member", "A macro", 0));
                l.add(q(11, "What does this print?\n```c\nint add(int a, int b) { return a+b; }\nint (*f)(int,int) = add;\nprintf(\"%d\", f(3,4));\n```",
                                "7", "Error", "34", "Undefined", 0));
                l.add(q(12, "What is the difference between stack and heap?", "Stack is auto-managed, heap is manual",
                                "They are the same", "Stack is bigger", "Heap is faster", 0));
                l.add(q(13, "What is the output?\n```c\nint x = 10;\nint *p = &x;\n*p = 20;\nprintf(\"%d\", x);\n```", "20", "10",
                                "Error", "Address", 0));
                l.add(q(14, "What is the extern keyword?", "Declares variable defined in another file",
                                "Creates variable", "Deletes variable", "Casts variable", 0));
                l.add(q(15, "What does this print?\n```c\nenum Color { RED, GREEN, BLUE };\nprintf(\"%d\", GREEN);\n```", "1", "0",
                                "2", "Error", 0));
                l.add(q(16, "What is bitwise AND operator?", "&", "&&", "|", "^", 0));
                l.add(q(17, "What is the output?\n```c\nint a = 12, b = 10;\nprintf(\"%d\", a & b);\n```", "8", "10", "12",
                                "Error", 0));
                l.add(q(18, "What is a void pointer?", "Generic pointer without specific type", "A null pointer",
                                "An integer pointer", "A constant pointer", 0));
                l.add(q(19, "What does this print?\n```c\nvoid *p;\nint x = 42;\np = &x;\nprintf(\"%d\", *(int*)p);\n```", "42",
                                "Error", "0", "Address", 0));
                l.add(q(20, "What is realloc()?", "Resizes previously allocated memory", "Allocates new memory",
                                "Frees memory", "Zeroes memory", 0));
                l.add(q(21, "What is the output?\n```c\nint a[2][2] = {{1,2},{3,4}};\nprintf(\"%d\", a[1][0]);\n```", "3", "1",
                                "2", "4", 0));
                l.add(q(22, "What is the register keyword?", "Hints compiler to store in CPU register",
                                "Creates a variable", "Allocates memory", "Imports file", 0));
                l.add(q(23, "What does this print?\n```c\nchar s[20];\nstrcpy(s, \"Hello\");\nstrcat(s, \" World\");\nprintf(\"%s\", s);\n```",
                                "Hello World", "HelloWorld", "Error", "Hello", 0));
                l.add(q(24, "What is the difference between struct and union?",
                                "Struct allocates all members, union shares memory", "They are identical",
                                "Union is bigger", "Struct shares memory", 0));
                l.add(q(25, "What is the output?\n```c\nint x = 5;\nint y = (x > 3) && (x < 10);\nprintf(\"%d\", y);\n```", "1",
                                "0", "Error", "true", 0));
                l.add(q(26, "What is a macro vs inline function?", "Macro is text substitution, inline is compiled",
                                "They are identical", "Inline is substitution", "Macro is compiled", 0));
                l.add(q(27, "What does this print?\n```c\n#define SQUARE(x) ((x)*(x))\nprintf(\"%d\", SQUARE(3+1));\n```", "16",
                                "10", "7", "Error", 0));
                l.add(q(28, "What does the restrict keyword do?", "Hints pointer is only reference to memory",
                                "Creates pointer", "Frees memory", "Allocates memory", 0));
                l.add(q(29, "What is the output?\n```c\nint a = 0;\nfor (int i = 0; i < 5; i++) {\n  if (i == 3) continue;\n  a += i;\n}\nprintf(\"%d\", a);\n```",
                                "7", "10", "6", "Error", 0));
                l.add(q(30, "What is the difference between #include <> and \"\"?",
                                "<> searches system dirs, \"\" searches local first", "They are identical",
                                "\"\" is for system headers", "<> is for local files", 0));
                l.add(q(31, "What does this print?\n```c\nint x = 0xA;\nprintf(\"%d\", x);\n```", "10", "A", "Error", "16", 0));
                l.add(q(32, "What is the comma operator?", "Evaluates all operands, returns last",
                                "Separates arguments", "Creates arrays", "Joins strings", 0));
                l.add(q(33, "What is the output?\n```c\nint x = (1, 2, 3);\nprintf(\"%d\", x);\n```", "3", "1", "Error", "6", 0));
                l.add(q(34, "What is a static function?", "Function visible only in its translation unit",
                                "A constant function", "A recursive function", "A pointer function", 0));
                l.add(q(35, "What does this print?\n```c\nint arr[] = {5,4,3,2,1};\nint *p = arr;\nprintf(\"%d\", *(p+4));\n```",
                                "1", "5", "Error", "4", 0));
                l.add(q(36, "What is undefined behavior?", "Code with unpredictable results per C standard",
                                "A compile error", "A runtime warning", "A syntax error", 0));
                l.add(q(37, "What is the output?\n```c\nint x = 1;\nprintf(\"%d\", x << 3);\n```", "8", "3", "1", "Error", 0));
                l.add(q(38, "What is a linked list?", "Data structure with nodes containing data and pointer",
                                "An array", "A string", "A tree", 0));
                l.add(q(39, "What does this print?\n```c\nchar *p = \"Hello\";\nprintf(\"%c\", p[4]);\n```", "o", "l", "H",
                                "Error", 0));
                l.add(q(40, "What is the assert() macro?", "Checks condition and aborts if false", "Allocates memory",
                                "Prints output", "Creates variable", 0));
                l.add(q(41, "What is the output?\n```c\nint a = ~0;\nprintf(\"%d\", a);\n```", "-1", "0", "1", "Error", 0));
                l.add(q(42, "What is the size_t type?", "Unsigned integer for sizes and indices", "A float type",
                                "A signed integer", "A pointer", 0));
                l.add(q(43, "What does this print?\n```c\nint a = 5, b = 3;\na ^= b;\nb ^= a;\na ^= b;\nprintf(\"%d %d\", a, b);\n```",
                                "3 5", "5 3", "Error", "0 0", 0));
                l.add(q(44, "What is the difference between malloc and calloc?", "calloc zeroes memory, malloc doesn't",
                                "They are identical", "malloc zeroes", "calloc is slower", 0));
                l.add(q(45, "What is the output?\n```c\nchar s[] = \"Hello\";\nprintf(\"%lu\", sizeof(s));\n```", "6", "5", "4",
                                "Error", 0));
                l.add(q(46, "What is a file pointer?", "Pointer used for file I/O operations", "A regular pointer",
                                "A string", "An integer", 0));
                l.add(q(47, "What does this print?\n```c\nFILE *f = fopen(\"test.txt\", \"w\");\nif (f != NULL)\n  printf(\"opened\");\nelse\n  printf(\"failed\");\n```",
                                "opened (if writable)", "Error", "NULL", "failed", 0));
                l.add(q(48, "What is an inline function?", "Suggestion to compiler to expand at call site", "A macro",
                                "A recursive function", "A pointer function", 0));
                l.add(q(49, "What is the output?\n```c\nint x = 0;\nwhile (x++ < 3)\n  printf(\"%d\", x);\n```", "123", "012",
                                "1234", "Error", 0));
                l.add(q(50, "What is a segmentation fault?", "Accessing memory not owned by program", "A syntax error",
                                "A compile error", "A warning", 0));
        }

        private static void addHard(List<QuizQuestion> l) {
                l.add(q(1, "What is the output?\n```c\nchar *s = \"Hello\";\nchar t[] = \"Hello\";\nprintf(\"%d %d\", sizeof(s), sizeof(t));\n```",
                                "8 6 (or 4 6)", "5 5", "6 5", "Error", 0));
                l.add(q(2, "What is sequence point in C?", "Point where side effects are complete", "A breakpoint",
                                "A loop end", "A function call", 0));
                l.add(q(3, "What does this print?\n```c\nint a = 1;\nint b = a++ + ++a;\nprintf(\"%d\", b);\n```",
                                "Undefined behavior", "4", "3", "5", 0));
                l.add(q(4, "What is strict aliasing?", "Compiler assumes pointers of different types don't alias",
                                "A casting rule", "A loop optimization", "A memory model", 0));
                l.add(q(5, "What is the output?\n```c\nint x = -1;\nprintf(\"%u\", x);\n```", "4294967295 (or max uint)", "-1",
                                "0", "Error", 0));
                l.add(q(6, "What is the restrict qualifier?", "Promise that pointer is the only reference",
                                "Creates pointer", "Frees memory", "Casts type", 0));
                l.add(q(7, "What does this print?\n```c\nchar a[] = \"Hello\";\nchar *p = a;\nwhile (*p) {\n  printf(\"%c\", *p);\n  p++;\n}\n```",
                                "Hello", "H", "Error", "Garbage", 0));
                l.add(q(8, "What is the offsetof macro?", "Returns byte offset of member in struct", "Size of struct",
                                "Number of members", "Alignment of struct", 0));
                l.add(q(9, "What is the output?\n```c\nstruct { int a:4; int b:4; } s;\ns.a = 5;\ns.b = 3;\nprintf(\"%d\", s.a + s.b);\n```",
                                "8", "Error", "53", "Undefined", 0));
                l.add(q(10, "What are bit fields?", "Struct members with specified bit widths", "An array type",
                                "A pointer type", "A macro", 0));
                l.add(q(11, "What does this print?\n```c\ntypedef void (*Func)(int);\nvoid print_num(int n) { printf(\"%d\", n); }\nFunc f = print_num;\nf(42);\n```",
                                "42", "Error", "Undefined", "0", 0));
                l.add(q(12, "What is the flexible array member?", "Array at end of struct without fixed size",
                                "A dynamic array", "A pointer array", "A fixed array", 0));
                l.add(q(13, "What is the output?\n```c\nint arr[] = {1,2,3,4,5};\nprintf(\"%d\", *arr + 2);\n```", "3", "1",
                                "Error", "5", 0));
                l.add(q(14, "What is memory alignment?", "Data placed at address multiples for performance",
                                "Memory allocation", "Memory freeing", "Memory copying", 0));
                l.add(q(15, "What does this print?\n```c\nint x = 42;\nint *p = &x;\nint **pp = &p;\nprintf(\"%d\", **pp);\n```",
                                "42", "Address", "Error", "0", 0));
                l.add(q(16, "What is the _Generic keyword?", "Type-generic selection expression (C11)",
                                "A preprocessor directive", "A loop keyword", "A cast operator", 0));
                l.add(q(17, "What is the output?\n```c\nint a = 5;\nint b = 3;\nprintf(\"%d\", a > b ? a-- : ++b);\n```", "5", "4",
                                "3", "Error", 0));
                l.add(q(18, "What is a translation unit?", "Source file after preprocessing", "A compiled object",
                                "A linked executable", "A header file", 0));
                l.add(q(19, "What does this print?\n```c\nint x = 0;\nswitch(x) {\n  case 0: printf(\"A\");\n  case 1: printf(\"B\");\n  case 2: printf(\"C\");\n}\n```",
                                "ABC", "A", "AB", "Error", 0));
                l.add(q(20, "What is the setjmp/longjmp mechanism?", "Non-local goto for error handling",
                                "Thread creation", "Memory allocation", "File I/O", 0));
                l.add(q(21, "What is the output?\n```c\nchar s[] = \"12345\";\nprintf(\"%c\", '0' + strlen(s));\n```", "5",
                                "Error", "0", "53", 0));
                l.add(q(22, "What is the _Atomic qualifier?", "Ensures atomic operations on variable (C11)",
                                "A constant qualifier", "A volatile qualifier", "A register hint", 0));
                l.add(q(23, "What does this print?\n```c\nint a = 0;\nint b = (a = 5, a + 3);\nprintf(\"%d\", b);\n```", "8", "5",
                                "3", "Error", 0));
                l.add(q(24, "What is incomplete type?", "Type whose size is unknown", "A null type", "A void type",
                                "A pointer type", 0));
                l.add(q(25, "What is the output?\n```c\nint *p = malloc(3 * sizeof(int));\np[0]=10; p[1]=20; p[2]=30;\nprintf(\"%d\", *(p+1));\nfree(p);\n```",
                                "20", "10", "Error", "30", 0));
                l.add(q(26, "What is the difference between const int* and int* const?",
                                "const int*: value can't change; int* const: pointer can't change",
                                "They are identical", "Both are constant", "Neither is constant", 0));
                l.add(q(27, "What does this print?\n```c\nconst int *p;\nint x = 10;\np = &x;\nprintf(\"%d\", *p);\n```", "10",
                                "Error", "0", "Address", 0));
                l.add(q(28, "What is the _Noreturn specifier?", "Indicates function never returns", "Returns void",
                                "Returns null", "Returns -1", 0));
                l.add(q(29, "What is the output?\n```c\nchar c = 255;\nprintf(\"%d\", c);\n```", "-1 (or 255 if unsigned)", "255",
                                "0", "Error", 0));
                l.add(q(30, "What is the container_of macro?", "Gets pointer to struct from member pointer",
                                "Creates a container", "Allocates memory", "Frees memory", 0));
                l.add(q(31, "What does this print?\n```c\nint x = 5;\nprintf(\"%d\", x >> 1);\n```", "2", "5", "10", "Error", 0));
                l.add(q(32, "What is an opaque pointer?", "Pointer to incomplete type for data hiding",
                                "A null pointer", "A void pointer", "A function pointer", 0));
                l.add(q(33, "What is the output?\n```c\nint a = 1, b = 2, c = 3;\nint *ptrs[] = {&a, &b, &c};\nprintf(\"%d\", *ptrs[2]);\n```",
                                "3", "1", "Error", "2", 0));
                l.add(q(34, "What is the purpose of sigaction()?", "Sets signal handlers", "Creates signals",
                                "Blocks signals", "Sends signals", 0));
                l.add(q(35, "What does this print?\n```c\nchar s1[] = \"abc\";\nchar s2[] = \"abd\";\nprintf(\"%d\", strcmp(s1, s2) < 0);\n```",
                                "1", "0", "Error", "-1", 0));
                l.add(q(36, "What is an alignment requirement?", "Minimum address divisor for a type", "Maximum memory",
                                "Minimum memory", "Cache size", 0));
                l.add(q(37, "What is the output?\n```c\nint x = 0;\nfor (;;) {\n  if (x >= 3) break;\n  x++;\n}\nprintf(\"%d\", x);\n```",
                                "3", "0", "Error", "Infinite", 0));
                l.add(q(38, "What does __attribute__((packed)) do?", "Removes padding from struct", "Adds padding",
                                "Aligns struct", "Caches struct", 0));
                l.add(q(39, "What does this print?\n```c\nlong long x = 1LL << 40;\nprintf(\"%lld\", x);\n```", "1099511627776",
                                "40", "Error", "Overflow", 0));
                l.add(q(40, "What is a VLA (Variable Length Array)?", "Array whose size is determined at runtime",
                                "A linked list", "A dynamic pointer", "A fixed array", 0));
                l.add(q(41, "What is the output?\n```c\nint n = 5;\nint arr[n];\narr[0] = 42;\nprintf(\"%d\", arr[0]);\n```", "42",
                                "Error", "0", "Undefined", 0));
                l.add(q(42, "What is the purpose of errno?", "Reports error codes from library functions",
                                "A return value", "A function name", "A header file", 0));
                l.add(q(43, "What does this print?\n```c\nprintf(\"%d\", !0);\n```", "1", "0", "Error", "true", 0));
                l.add(q(44, "What is mmap()?", "Maps files/devices into memory", "Allocates memory", "Frees memory",
                                "Copies memory", 0));
                l.add(q(45, "What is the output?\n```c\nint (*arr)[3];\nint data[2][3] = {{1,2,3},{4,5,6}};\narr = data;\nprintf(\"%d\", arr[1][2]);\n```",
                                "6", "3", "Error", "5", 0));
                l.add(q(46, "What is the designated initializer?", "Initializing specific array/struct members by name",
                                "A macro", "A function", "A pointer", 0));
                l.add(q(47, "What does this print?\n```c\nint arr[] = {[2]=5, [0]=1};\nprintf(\"%d %d %d\", arr[0], arr[1], arr[2]);\n```",
                                "1 0 5", "5 0 1", "Error", "1 5 0", 0));
                l.add(q(48, "What is the compound literal?", "Unnamed object created inline", "A string literal",
                                "A numeric constant", "A macro", 0));
                l.add(q(49, "What is the output?\n```c\nstruct P { int x, y; };\nstruct P p = (struct P){3, 4};\nprintf(\"%d\", p.x + p.y);\n```",
                                "7", "Error", "34", "Undefined", 0));
                l.add(q(50, "What is the purpose of pragma once?", "Prevents header from being included twice",
                                "Includes all headers", "Creates a macro", "Defines a constant", 0));
        }
}