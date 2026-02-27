import os
import re

QUIZ_DIR = r"c:\Users\Jerson\AndroidStudioProjects\CrediLabMobile\app\src\main\java\com\example\credilabmobile\data"

language_map = {
    "C": "c",
    "CSharp": "csharp",
    "Cpp": "cpp",
    "Java": "java",
    "JS": "javascript",
    "Php": "php",
    "Python": "python"
}

def fix_code_blocks(content, language_code):
    # We look for "Text?\ncode" or "Text:\ncode" inside the question string.
    # The question string is the second argument to q(), like q(id, "Question", "A", "B", ...
    # We can use a regex to find strings containing \n and wrap everything after the first \n in ```lang ... ```
    
    # A safer regex: find all strings that contain \n
    # Since they are exactly "Question line 1\nCode line 1\nCode line 2", we can replace the first \n with \n```lang\n
    # and add \n``` at the end of the string.
    
    def replacer(match):
        q_string = match.group(1)
        if "\\n" in q_string and not "\\`\\`\\`" in q_string:
            # Check if it already has backticks (though user said they don't)
            parts = q_string.split("\\n", 1)
            if len(parts) == 2:
                new_q = f"{parts[0]}\\n```{language_code}\\n{parts[1]}\\n```"
                return f'"{new_q}"'
        return match.group(0)

    # Match string literals like "..." taking care of escaped quotes
    # Actually, it's easier to just match the `q(..., "question", ` pattern.
    
    def replacer_q(match):
        # match.group(1) is the question string contents.
        q_string = match.group(1)
        if "\\n" in q_string and "```" not in q_string:
            parts = q_string.split("\\n", 1)
            # parts[0] is like "What is the output?"
            # parts[1] is the code
            # Add ``` language to code
            formatted = f'{parts[0]}\\n```{language_code}\\n{parts[1]}\\n```'
            return f'q({match.group(0)[2:match.group(0).index(",")]}, "{formatted}"'
        return match.group(0)

    # Let's cleanly match q(Number, "QuestionString", 
    pattern = re.compile(r'q\(\s*\d+\s*,\s*"((?:\\.|[^"\\])*)",')
    
    def repl(m):
        full_match = m.group(0)
        q_str = m.group(1)
        if "\\n" in q_str and "```" not in q_str:
            parts = q_str.split("\\n", 1)
            # Add ```
            new_q_str = f'{parts[0]}\\n```\\n{parts[1]}\\n```'
            return full_match.replace(f'"{q_str}"', f'"{new_q_str}"')
        return full_match

    # Let me do it safely
    lines = content.split('\n')
    for i in range(len(lines)):
        if "l.add(q(" in lines[i]:
            match = re.search(r'q\(\s*\d+\s*,\s*"((?:\\.|[^"\\])*)"\s*,', lines[i])
            if match:
                q_str = match.group(1)
                if "\\n" in q_str and "```" not in q_str:
                    # Special case for QuizQuestionBank*.java
                    # Some questions just have \n for layout but mostly they are code snippets.
                    # It's safe to wrap everything after the first \n in ```
                    parts = q_str.split("\\n", 1)
                    new_q_str = f'{parts[0]}\\n```{language_code}\\n{parts[1]}\\n```'
                    lines[i] = lines[i].replace(f'"{q_str}"', f'"{new_q_str}"')
    
    return '\n'.join(lines)


for filename in os.listdir(QUIZ_DIR):
    if filename.startswith("QuizQuestionBank") and filename.endswith(".java") and filename != "QuizQuestionBank.java":
        lang_key = filename.replace("QuizQuestionBank", "").replace(".java", "")
        if lang_key in language_map:
            filepath = os.path.join(QUIZ_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = fix_code_blocks(content, language_map[lang_key])
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Fixed {filename}")

