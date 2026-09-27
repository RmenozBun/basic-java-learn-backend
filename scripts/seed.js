import mongoose from "mongoose";
import { connectDB } from "../src/connect.js";
import LessonModel from "../src/model/lesson.model.js";
import ExerciseModel from "../src/model/exercise.model.js";

// เนื้อหาบทเรียน — เขียนขึ้นใหม่ทั้งหมด ไม่ได้คัดลอกจาก w3schools
// โครงสร้างหัวข้อได้แรงบันดาลใจจาก w3schools Java Tutorial เท่านั้น
const lessons = [
  {
    slug: "hello-world",
    level: "easy",
    order: 1,
    title: "เริ่มต้นกับ Java: Hello World",
    summary: "รู้จักโครงสร้างพื้นฐานของโปรแกรม Java และคำสั่งพิมพ์ข้อความ",
    contentMarkdown: `
## ทุกโปรแกรม Java เริ่มต้นจากที่ไหน?

โปรแกรม Java ทุกโปรแกรมต้องมีอย่างน้อยหนึ่ง **class** และเมธอด **main** ซึ่งเป็นจุดที่โปรแกรมเริ่มทำงาน

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

- \`public class Main\` คือการประกาศคลาสชื่อ Main (ในระบบนี้ไฟล์ที่รันต้องชื่อคลาส Main เสมอ)
- \`public static void main(String[] args)\` คือเมธอดหลักที่ JVM จะเรียกใช้เป็นอันดับแรก
- \`System.out.println(...)\` ใช้พิมพ์ข้อความออกทางหน้าจอ แล้วขึ้นบรรทัดใหม่
- ถ้าไม่ต้องการขึ้นบรรทัดใหม่ ใช้ \`System.out.print(...)\` แทน

ลองแก้ไขข้อความใน \`println\` แล้วกด **รัน** ทางด้านล่างเพื่อดูผลลัพธ์ทันที
`,
    exercises: [
      {
        order: 1,
        title: "พิมพ์ข้อความทักทาย",
        prompt: "จงเขียนโปรแกรมพิมพ์ข้อความ `Hello, Java!` ออกทางหน้าจอ",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // เขียนโค้ดของคุณตรงนี้

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
    title: "ตัวแปรและชนิดข้อมูล",
    summary: "การประกาศตัวแปร ชนิดข้อมูลพื้นฐาน และการรับค่าจากผู้ใช้",
    contentMarkdown: `
## ตัวแปร (Variables)

ตัวแปรใช้เก็บข้อมูลไว้ใช้งานในโปรแกรม ต้องระบุ **ชนิดข้อมูล (type)** ตอนประกาศเสมอ

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int age = 19;              // จำนวนเต็ม
        double gpa = 3.75;         // ทศนิยม
        String name = "Ploy";      // ข้อความ
        boolean isStudent = true;  // จริง/เท็จ

        System.out.println(age);
        System.out.println(gpa);
        System.out.println(name);
        System.out.println(isStudent);
    }
}
\`\`\`

## การอ่านค่าจากผู้ใช้ (Scanner)

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Hi " + name);
    }
}
\`\`\`

ตัวอย่างข้างต้นอ่านข้อความหนึ่งบรรทัดจาก stdin แล้วนำมาต่อ (concatenate) กับสตริงด้วยเครื่องหมาย \`+\`
`,
    exercises: [
      {
        order: 1,
        title: "ทักทายตามชื่อ",
        prompt: "อ่านชื่อจาก input หนึ่งบรรทัด แล้วพิมพ์ `Hello, <ชื่อ>!` (เช่น input `Ploy` ต้องพิมพ์ `Hello, Ploy!`)",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        // เขียนโค้ดพิมพ์ผลลัพธ์ตรงนี้

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
    title: "เงื่อนไข if-else",
    summary: "การตัดสินใจในโปรแกรมด้วย if, else if, else",
    contentMarkdown: `
## คำสั่งเงื่อนไข

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int score = 75;

        if (score >= 80) {
            System.out.println("Grade A");
        } else if (score >= 60) {
            System.out.println("Grade B");
        } else {
            System.out.println("Grade C");
        }
    }
}
\`\`\`

เงื่อนไขในวงเล็บต้องเป็นค่า \`boolean\` (true/false) เท่านั้น ตัวดำเนินการเปรียบเทียบที่ใช้บ่อยคือ \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\` และรวมเงื่อนไขด้วย \`&&\` (และ), \`||\` (หรือ)

## ตัวดำเนินการ % (modulo)

\`%\` คือตัวดำเนินการหาเศษจากการหาร เช่น \`7 % 2\` ได้ \`1\` (7 หาร 2 เหลือเศษ 1)

ใช้เช็คเลขคู่-คี่ได้ทันที: ถ้า \`n % 2 == 0\` แปลว่า n หารด้วย 2 ลงตัว (เลขคู่)
`,
    exercises: [
      {
        order: 1,
        title: "ตรวจสอบเลขคู่-คี่",
        prompt:
          "อ่านจำนวนเต็มหนึ่งค่า ถ้าเป็นเลขคู่ให้พิมพ์ `Even` ถ้าเป็นเลขคี่ให้พิมพ์ `Odd`\n\n" +
          "คำใบ้: เช็คด้วย if (n % 2 == 0)",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // เขียนโค้ดตรวจสอบเลขคู่-คี่ตรงนี้

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
    title: "ลูป for และ while",
    summary: "การทำงานซ้ำด้วย for loop และ while loop",
    contentMarkdown: `
## for loop

\`\`\`java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}
\`\`\`

## while loop

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 5) {
            System.out.println(i);
            i++;
        }
    }
}
\`\`\`

ใช้ \`for\` เมื่อรู้จำนวนรอบที่แน่นอน และใช้ \`while\` เมื่อเงื่อนไขการหยุดขึ้นกับสถานะระหว่างทาง
`,
    exercises: [
      {
        order: 1,
        title: "ผลรวม 1 ถึง N",
        prompt:
          "อ่านจำนวนเต็ม N แล้วพิมพ์ผลรวมของเลข 1 ถึง N (เช่น N=5 ต้องพิมพ์ 15 เพราะ 1+2+3+4+5=15)\n\n" +
          "คำใบ้: ใช้ for loop ให้ i วิ่งจาก 1 ถึง N ทุกรอบให้บวก i เข้าไปใน sum (เขียนว่า sum = sum + i;)",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        // เขียนลูปคำนวณผลรวมตรงนี้

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
    title: "Array พื้นฐาน",
    summary: "การประกาศ เข้าถึง และวนลูปผ่านอาร์เรย์",
    contentMarkdown: `
## การประกาศ Array

\`\`\`java
public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};

        for (int i = 0; i < numbers.length; i++) {
            System.out.println(numbers[i]);
        }
    }
}
\`\`\`

- ดัชนี (index) ของ array เริ่มที่ 0 เสมอ
- \`numbers.length\` คือจำนวนสมาชิกทั้งหมดใน array
- เข้าถึงสมาชิกลำดับที่เกินขอบเขตจะทำให้เกิด \`ArrayIndexOutOfBoundsException\`
`,
    exercises: [
      {
        order: 1,
        title: "หาค่ามากที่สุดใน Array",
        prompt:
          "อ่านจำนวนเต็ม 5 ค่าจากแต่ละบรรทัด (ทั้งหมด 5 บรรทัด) แล้วพิมพ์ค่าที่มากที่สุด\n\n" +
          "คำใบ้: สร้างตัวแปร max เก็บค่ามากที่สุด เริ่มต้นด้วย max = numbers[0] แล้ว loop ไล่เทียบ numbers[i] กับ max ทีละตัว ถ้า numbers[i] มากกว่า max ให้อัปเดต max = numbers[i]",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] numbers = new int[5];
        for (int i = 0; i < 5; i++) {
            numbers[i] = sc.nextInt();
        }
        // หาค่ามากที่สุดแล้วพิมพ์ผลลัพธ์ตรงนี้

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
    title: "เมธอด (Methods)",
    summary: "การสร้างและเรียกใช้เมธอดเพื่อแบ่งโค้ดเป็นส่วนย่อย",
    contentMarkdown: `
## การประกาศเมธอด

\`\`\`java
public class Main {
    static int square(int x) {
        return x * x;
    }

    public static void main(String[] args) {
        System.out.println(square(4)); // 16
    }
}
\`\`\`

- \`static\` จำเป็นสำหรับเมธอดที่เรียกจาก \`main\` โดยตรงในตัวอย่างนี้
- เมธอดที่มี return type ไม่ใช่ \`void\` ต้องมีคำสั่ง \`return\` เสมอ
- การแบ่งโค้ดเป็นเมธอดช่วยให้นำกลับมาใช้ซ้ำได้และอ่านง่ายขึ้น
`,
    exercises: [
      {
        order: 1,
        title: "เมธอดหาผลบวก",
        prompt:
          "สร้างเมธอด `sum(int a, int b)` คืนค่าผลบวก แล้วอ่านเลขสองจำนวนจาก input (คนละบรรทัด) มาพิมพ์ผลลัพธ์จากการเรียกเมธอดนี้\n\n" +
          "คำใบ้: ในเมธอด sum ให้เขียน return a + b; แทนที่ return 0;",
        starterCode: `import java.util.Scanner;

public class Main {
    static int sum(int a, int b) {
        // เขียนโค้ดคืนค่าผลบวกตรงนี้
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
    title: "OOP เบื้องต้น: Class และ Object",
    summary: "แนวคิด Object-Oriented Programming เบื้องต้นด้วย class, field, constructor",
    contentMarkdown: `
## Class คือพิมพ์เขียว, Object คือของจริง

\`\`\`java
class Student {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    void printInfo() {
        System.out.println(name + ": " + score);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Ploy", 85);
        s1.printInfo(); // Ploy: 85
    }
}
\`\`\`

- \`class Student\` กำหนดโครงสร้างข้อมูล (field) และพฤติกรรม (method) ของ Student
- \`Student(String name, int score)\` คือ **constructor** ทำงานตอนสร้าง object ด้วย \`new\`
- \`this.name\` หมายถึง field ของ object ตัวเอง แยกจากพารามิเตอร์ \`name\`
`,
    exercises: [
      {
        order: 1,
        title: "คลาส Rectangle",
        prompt:
          "สร้างคลาส Rectangle มี field width และ height (int) และเมธอด area() คืนค่าพื้นที่ (width*height) จากนั้นอ่านค่า width และ height จาก input (คนละบรรทัด) มาสร้าง object แล้วพิมพ์ผลลัพธ์จาก area()\n\n" +
          "คำใบ้: ในเมธอด area() ให้เขียน return width * height; แทนที่ return 0;",
        starterCode: `import java.util.Scanner;

class Rectangle {
    int width;
    int height;

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    int area() {
        // เขียนโค้ดคืนค่าพื้นที่ตรงนี้
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
    title: "การสืบทอด (Inheritance)",
    summary: "การสืบทอดคุณสมบัติระหว่างคลาสด้วย extends และ super",
    contentMarkdown: `
## extends และ super

\`\`\`java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    String speak() { return name + " makes a sound"; }
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override
    String speak() { return name + " barks"; }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog("Rex");
        System.out.println(a.speak()); // Rex barks
    }
}
\`\`\`

- \`Dog extends Animal\` ทำให้ Dog ได้รับ field/method จาก Animal มาด้วย
- \`super(name)\` เรียก constructor ของคลาสแม่
- \`@Override\` บอกว่ากำลังเขียนทับ (override) เมธอดเดิมของคลาสแม่ด้วยพฤติกรรมใหม่
`,
    exercises: [
      {
        order: 1,
        title: "สืบทอดคลาส Shape",
        prompt:
          "กำหนดคลาส Shape มีเมธอด describe() คืนค่า \"This is a shape\" และคลาส Circle ที่ extends Shape แล้ว override describe() ให้คืนค่า \"This is a circle\" จากนั้นสร้าง object Circle แล้วพิมพ์ผลลัพธ์จาก describe()\n\n" +
          "คำใบ้: ในคลาส Circle ให้เขียนเมธอดใหม่ทับของเดิม: @Override ตามด้วย String describe() { return \"This is a circle\"; }",
        starterCode: `public class Main {
    static class Shape {
        String describe() {
            return "This is a shape";
        }
    }

    static class Circle extends Shape {
        // เขียนโค้ด override describe() ตรงนี้

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
    title: "ArrayList และ Collections เบื้องต้น",
    summary: "การใช้งาน ArrayList เก็บข้อมูลแบบยืดหยุ่นขนาดได้",
    contentMarkdown: `
## ArrayList

\`\`\`java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Ploy");
        names.add("Beam");
        names.remove("Ploy");

        for (String name : names) {
            System.out.println(name);
        }
    }
}
\`\`\`

- ต่างจาก array ปกติตรงที่ \`ArrayList\` เปลี่ยนขนาดได้ระหว่างการทำงาน
- ใช้ \`add()\`, \`remove()\`, \`get(index)\`, \`size()\` จัดการข้อมูล
- \`<String>\` คือ generic type ระบุว่าตัวเก็บนี้เก็บเฉพาะ String
`,
    exercises: [
      {
        order: 1,
        title: "รวมตัวเลขคู่ใน ArrayList",
        prompt:
          "อ่านจำนวนเต็ม N แล้วตามด้วยตัวเลข N ค่า (คนละบรรทัด) เก็บลง ArrayList<Integer> จากนั้นพิมพ์ผลรวมเฉพาะเลขคู่เท่านั้น\n\n" +
          "คำใบ้: ใช้ for-each loop (for (int num : numbers)) วนดูทีละตัว เช็คว่าเลขคู่ด้วย num % 2 == 0 ถ้าใช่ให้บวกเข้า sum",
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
        // เขียนโค้ดรวมเฉพาะเลขคู่ตรงนี้

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

const run = async () => {
  await connectDB();

  for (const lesson of lessons) {
    const { exercises, ...lessonData } = lesson;
    const savedLesson = await LessonModel.findOneAndUpdate({ slug: lessonData.slug }, lessonData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    await ExerciseModel.deleteMany({ lessonId: savedLesson._id });
    await ExerciseModel.insertMany(
      exercises.map((exercise) => ({ ...exercise, lessonId: savedLesson._id })),
    );

    console.log(`Seeded lesson: ${savedLesson.slug} (${exercises.length} exercises)`);
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
