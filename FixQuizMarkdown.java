import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

public class FixQuizMarkdown {
    public static void main(String[] args) throws Exception {
        String dirPath = "app/src/main/java/com/example/credilabmobile/data";
        File dir = new File(dirPath);
        if(!dir.exists()) {
            System.out.println("Directory not found.");
            return;
        }
        
        Map<String, String> langMap = new HashMap<>();
        langMap.put("C", "c");
        langMap.put("CSharp", "csharp");
        langMap.put("Cpp", "cpp");
        langMap.put("Java", "java");
        langMap.put("JS", "javascript");
        langMap.put("Php", "php");
        langMap.put("Python", "python");
        
        // Match q( ID, " string " ,
        // where string can contain escaped quotes.
        Pattern pattern = Pattern.compile("q\\(\\s*\\d+\\s*,\\s*\"((?:\\\\.|[^\"\\\\])*)\"\\s*,");

        for(File f : dir.listFiles()) {
            if(f.getName().startsWith("QuizQuestionBank") && f.getName().endsWith(".java") && !f.getName().equals("QuizQuestionBank.java")) {
                String key = f.getName().replace("QuizQuestionBank", "").replace(".java", "");
                if(langMap.containsKey(key)) {
                    String lang = langMap.get(key);
                    List<String> lines = Files.readAllLines(f.toPath());
                    for(int i = 0; i < lines.size(); i++) {
                        String line = lines.get(i);
                        if(line.contains("l.add(q(")) {
                            Matcher m = pattern.matcher(line);
                            if(m.find()) {
                                String qStr = m.group(1);
                                if(qStr.contains("\\n") && !qStr.contains("```")) {
                                    // Split at the first \n only
                                    String[] parts = qStr.split("\\\\n", 2);
                                    if(parts.length == 2) {
                                        String newQ = parts[0] + "\\n```" + lang + "\\n" + parts[1] + "\\n```";
                                        // Replace the exactly matched group 1 with the new string
                                        String replaced = line.substring(0, m.start(1)) + newQ + line.substring(m.end(1));
                                        lines.set(i, replaced);
                                    }
                                }
                            }
                        }
                    }
                    Files.write(f.toPath(), String.join("\n", lines).getBytes());
                    System.out.println("Fixed " + f.getName());
                }
            }
        }
    }
}
