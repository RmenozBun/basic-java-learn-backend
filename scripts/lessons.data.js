import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// เนื้อหาบทเรียนทั้งหมดเขียนขึ้นใหม่ ไม่ได้คัดลอกจาก w3schools (ได้แรงบันดาลใจเรื่องลำดับหัวข้อเท่านั้น)
// - เนื้อหาบทเรียน:     scripts/content/<slug>.md
// - โจทย์แบบฝึกหัด:     scripts/content/<slug>.exercise-<order>.md  (หัวข้อ ## prompt / ## hint / ## explanation)
const contentDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "content");

export const readFile = (name) => fs.readFileSync(path.join(contentDir, name), "utf8").trim();

export const readExerciseTexts = (slug, order) => {
  const sections = {};
  readFile(`${slug}.exercise-${order}.md`)
    .split(/^## /m)
    .slice(1)
    .forEach((block) => {
      const newline = block.indexOf("\n");
      sections[block.slice(0, newline).trim()] = block.slice(newline + 1).trim();
    });
  return sections;
};

export const lessons = [
  {
    slug: "hello-world",
    level: "easy",
    order: 1,
    icon: "👋",
    minutes: 15,
    title: "เริ่มต้นกับ Java: โปรแกรมแรกของคุณ",
    summary: "รู้จัก Java เขียนและรันโปรแกรมแรก ใช้ println, อักขระพิเศษ, comment และอ่านข้อความ error เบื้องต้น",
    exercises: [
      {
        order: 1,
        title: "พิมพ์ข้อความทักทาย",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: เขียนคำสั่งพิมพ์ข้อความ Hello, Java! ตรงนี้

    }
}
`,
        solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`,
        testCases: [{ stdin: "", expectedOutput: "Hello, Java!" }],
      },
    ],
  },
  {
    slug: "variables-and-types",
    level: "easy",
    order: 2,
    icon: "📦",
    minutes: 25,
    title: "ตัวแปร ชนิดข้อมูล และการรับค่า",
    summary: "ตัวแปร ชนิดข้อมูลพื้นฐาน ตัวดำเนินการคำนวณ การแปลงชนิด และรับข้อมูลจากผู้ใช้ด้วย Scanner",
    exercises: [
      {
        order: 1,
        title: "ทักทายตามชื่อ",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        // TODO: พิมพ์คำทักทายในรูปแบบ Hello, <ชื่อ>! ตรงนี้

    }
}
`,
        solutionCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}
`,
        testCases: [
          { stdin: "Ploy", expectedOutput: "Hello, Ploy!" },
          { stdin: "Beam", expectedOutput: "Hello, Beam!" },
        ],
      },
    ],
  },
  {
    slug: "if-else",
    level: "easy",
    order: 3,
    icon: "🔀",
    minutes: 25,
    title: "เงื่อนไข if-else",
    summary: "ให้โปรแกรมตัดสินใจเองด้วย if / else if / else ตัวดำเนินการเปรียบเทียบและตรรกะ รวมถึง switch",
    exercises: [
      {
        order: 1,
        title: "ตรวจสอบเลขคู่-คี่",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: ตรวจว่า n เป็นเลขคู่หรือเลขคี่ แล้วพิมพ์ Even หรือ Odd

    }
}
`,
        solutionCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}
`,
        testCases: [
          { stdin: "4", expectedOutput: "Even" },
          { stdin: "7", expectedOutput: "Odd" },
        ],
      },
    ],
  },
  {
    slug: "loops",
    level: "medium",
    order: 1,
    icon: "🔁",
    minutes: 30,
    title: "ลูป for และ while",
    summary: "ทำงานซ้ำด้วย for / while / do-while รูปแบบสะสมค่า (accumulator) ลูปซ้อนลูป และ break / continue",
    exercises: [
      {
        order: 1,
        title: "ผลรวม 1 ถึง N",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        // TODO: เขียน for loop บวกเลข 1 ถึง n สะสมเข้า sum

        System.out.println(sum);
    }
}
`,
        solutionCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum = sum + i;
        }
        System.out.println(sum);
    }
}
`,
        testCases: [
          { stdin: "5", expectedOutput: "15" },
          { stdin: "10", expectedOutput: "55" },
        ],
      },
    ],
  },
  {
    slug: "arrays",
    level: "medium",
    order: 2,
    icon: "🗂️",
    minutes: 30,
    title: "Array พื้นฐาน",
    summary: "เก็บข้อมูลหลายตัวในชื่อเดียว เข้าถึงด้วย index วนลูป และอัลกอริทึมพื้นฐาน (ผลรวม ค่าสูงสุด ค้นหา)",
    exercises: [
      {
        order: 1,
        title: "หาค่ามากที่สุดใน Array",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] numbers = new int[5];
        for (int i = 0; i < 5; i++) {
            numbers[i] = sc.nextInt();
        }
        // TODO: หาค่ามากที่สุดใน numbers แล้วพิมพ์ผลลัพธ์

    }
}
`,
        solutionCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] numbers = new int[5];
        for (int i = 0; i < 5; i++) {
            numbers[i] = sc.nextInt();
        }
        int max = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        System.out.println(max);
    }
}
`,
        testCases: [
          { stdin: "3\n7\n2\n9\n5", expectedOutput: "9" },
          { stdin: "10\n20\n5\n1\n8", expectedOutput: "20" },
        ],
      },
    ],
  },
  {
    slug: "methods",
    level: "medium",
    order: 3,
    icon: "🧩",
    minutes: 30,
    title: "เมธอด (Methods)",
    summary: "แบ่งโค้ดเป็นเมธอดที่เรียกใช้ซ้ำได้ พารามิเตอร์ การคืนค่า scope และ method overloading",
    exercises: [
      {
        order: 1,
        title: "เมธอดหาผลบวก",
        starterCode: `import java.util.Scanner;

public class Main {
    static int sum(int a, int b) {
        // TODO: คืนค่าผลบวกของ a และ b
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(sum(a, b));
    }
}
`,
        solutionCode: `import java.util.Scanner;

public class Main {
    static int sum(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(sum(a, b));
    }
}
`,
        testCases: [
          { stdin: "3\n4", expectedOutput: "7" },
          { stdin: "10\n25", expectedOutput: "35" },
        ],
      },
    ],
  },
  {
    slug: "oop-class-object",
    level: "hard",
    order: 1,
    icon: "🏗️",
    minutes: 35,
    title: "OOP เบื้องต้น: Class และ Object",
    summary: "แนวคิด OOP: class กับ object, field, constructor, this, encapsulation และการเก็บ object ใน array",
    exercises: [
      {
        order: 1,
        title: "คลาส Rectangle",
        starterCode: `import java.util.Scanner;

class Rectangle {
    int width;
    int height;

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int area() {
        // TODO: คืนค่าพื้นที่ (กว้าง x ยาว)
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int w = sc.nextInt();
        int h = sc.nextInt();
        Rectangle r = new Rectangle(w, h);
        System.out.println(r.area());
    }
}
`,
        solutionCode: `import java.util.Scanner;

class Rectangle {
    int width;
    int height;

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int area() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int w = sc.nextInt();
        int h = sc.nextInt();
        Rectangle r = new Rectangle(w, h);
        System.out.println(r.area());
    }
}
`,
        testCases: [
          { stdin: "3\n4", expectedOutput: "12" },
          { stdin: "5\n6", expectedOutput: "30" },
        ],
      },
    ],
  },
  {
    slug: "inheritance",
    level: "hard",
    order: 2,
    icon: "🧬",
    minutes: 35,
    title: "การสืบทอด (Inheritance)",
    summary: "สืบทอดคลาสด้วย extends / super, override เมธอด, ลำดับ constructor และ polymorphism",
    exercises: [
      {
        order: 1,
        title: "สืบทอดคลาส Shape",
        starterCode: `public class Main {
    static class Shape {
        String describe() {
            return "This is a shape";
        }
    }

    static class Circle extends Shape {
        // TODO: override เมธอด describe() ให้คืนค่า "This is a circle"

    }

    public static void main(String[] args) {
        Circle c = new Circle();
        System.out.println(c.describe());
    }
}
`,
        solutionCode: `public class Main {
    static class Shape {
        String describe() {
            return "This is a shape";
        }
    }

    static class Circle extends Shape {
        @Override
        String describe() {
            return "This is a circle";
        }
    }

    public static void main(String[] args) {
        Circle c = new Circle();
        System.out.println(c.describe());
    }
}
`,
        testCases: [{ stdin: "", expectedOutput: "This is a circle" }],
      },
    ],
  },
  {
    slug: "collections-arraylist",
    level: "hard",
    order: 3,
    icon: "📚",
    minutes: 30,
    title: "ArrayList และ Collections เบื้องต้น",
    summary: "ArrayList ที่ยืดหดได้ generics, wrapper class, Collections.sort และแนะนำ HashMap",
    exercises: [
      {
        order: 1,
        title: "รวมตัวเลขคู่ใน ArrayList",
        starterCode: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            numbers.add(sc.nextInt());
        }
        int sum = 0;
        // TODO: บวกเฉพาะเลขคู่ใน numbers เข้า sum

        System.out.println(sum);
    }
}
`,
        solutionCode: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            numbers.add(sc.nextInt());
        }
        int sum = 0;
        for (int num : numbers) {
            if (num % 2 == 0) {
                sum = sum + num;
            }
        }
        System.out.println(sum);
    }
}
`,
        testCases: [
          { stdin: "5\n1\n2\n3\n4\n5", expectedOutput: "6" },
          { stdin: "4\n2\n4\n6\n8", expectedOutput: "20" },
        ],
      },
    ],
  },
];
