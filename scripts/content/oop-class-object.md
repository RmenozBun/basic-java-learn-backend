## ในบทนี้คุณจะได้เรียนอะไร

หลังจบบทนี้ คุณจะ

- เข้าใจแนวคิด **OOP (Object-Oriented Programming)** และเหตุผลที่ต้องมี
- แยกความต่างระหว่าง **class** (พิมพ์เขียว) กับ **object** (ของจริง) ได้
- เขียนคลาสที่มี **field**, **constructor** และ **เมธอด** ได้
- เข้าใจ `this` และสร้าง object ด้วย `new`
- ใช้ `private` กับ getter/setter เพื่อปกป้องข้อมูล (**encapsulation**)
- เก็บ object หลายตัวใน array และรู้จัก `null`

> 📝 **ใช้เวลาประมาณ 35 นาที** บทนี้เป็นการเปลี่ยนวิธีคิดครั้งใหญ่ ถ้าตอนแรกรู้สึกงงถือว่าปกติมาก ลองกดรันตัวอย่างแล้วแก้ไปเรื่อยๆ จะค่อยๆ เห็นภาพ

## ปัญหาของการเขียนโปรแกรมแบบที่ผ่านมา

สมมติเราต้องจัดการข้อมูลนักเรียน แต่ละคนมีชื่อและคะแนน ด้วยความรู้เดิมเราอาจเขียนแบบนี้

```java run=no
String name1 = "Ploy";   int score1 = 85;
String name2 = "Beam";   int score2 = 70;
String name3 = "Kan";    int score3 = 92;
// ... ถ้ามี 100 คนล่ะ? แล้วข้อมูลของแต่ละคนก็กระจัดกระจายกัน
```

ข้อมูลของคนคนเดียวกัน (ชื่อ + คะแนน) ควร **อยู่ด้วยกันเป็นก้อนเดียว** และควรมี "ความสามารถ" ที่ผูกกับข้อมูลนั้น เช่น แสดงข้อมูลตัวเอง คำนวณเกรดของตัวเอง **OOP คือแนวคิดการจัดโปรแกรมให้เป็นกลุ่มของ "วัตถุ (object)" ที่รวมทั้งข้อมูลและพฤติกรรมไว้ด้วยกัน** เหมือนในโลกจริงที่ทุกสิ่งมีทั้งคุณสมบัติและสิ่งที่ทำได้

## Class และ Object

- **Class (คลาส)** คือ **พิมพ์เขียว / แม่แบบ** บอกว่าสิ่งนั้น *มีอะไร* (ข้อมูล) และ *ทำอะไรได้* (เมธอด) เช่น พิมพ์เขียวของบ้าน, แม่พิมพ์ทำขนม
- **Object (ออบเจ็กต์)** คือ **ของจริงที่สร้างจากพิมพ์เขียวนั้น** สร้างได้กี่ชิ้นก็ได้ แต่ละชิ้นมีข้อมูลเป็นของตัวเอง เช่น บ้านหลังที่ 1, 2, 3 จากพิมพ์เขียวเดียวกัน หรือขนมแต่ละชิ้นจากแม่พิมพ์เดียว

```diagram
        class Student (พิมพ์เขียว)
        +-------------------------+
        | fields : name, score    |
        | methods: printInfo()    |
        +-------------------------+
             |          |
        new  |          | new
             v          v
    +---------------+  +---------------+
    | s1            |  | s2            |
    | name = "Ploy" |  | name = "Beam" |
    | score = 85    |  | score = 70    |
    +---------------+  +---------------+
        object 1           object 2
```

## เขียนคลาสแรกของคุณ

```java
class Student {
    // 1) fields: ข้อมูลที่ object แต่ละตัวมี
    String name;
    int score;

    // 2) constructor: ทำงานตอนสร้าง object ใช้ตั้งค่าเริ่มต้น
    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    // 3) method: สิ่งที่ object ทำได้
    void printInfo() {
        System.out.println(name + ": " + score);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Ploy", 85);
        Student s2 = new Student("Beam", 70);

        s1.printInfo();
        s2.printInfo();

        s2.score = 75;      // แก้ข้อมูลของ s2 โดย s1 ไม่ได้รับผลกระทบ
        s2.printInfo();
    }
}
```

```output
Ploy: 85
Beam: 70
Beam: 75
```

### อธิบายทีละส่วน

**Field (ฟิลด์)** คือตัวแปรที่อยู่ในคลาส (นอกเมธอด) ทำหน้าที่เก็บข้อมูลของ object ทุก object จะมีสำเนาของ field เป็นของตัวเอง `s1.score` กับ `s2.score` เป็นคนละตัวกัน

**Constructor (คอนสตรัคเตอร์)** คือเมธอดพิเศษที่ **ชื่อเหมือนคลาสเป๊ะ และไม่มีชนิดที่คืนค่า** (ไม่มี `void`) มันถูกเรียกอัตโนมัติ *ตอนที่สร้าง object ด้วย `new`* ใช้ตั้งค่าเริ่มต้นให้ field

**`this`** แปลว่า "ตัว object นี้เอง" ใน constructor ด้านบน มีชื่อซ้ำกันสองที่ คือ field `name` กับพารามิเตอร์ `name` เราจึงใช้ `this.name` เพื่อชี้ว่า "field ของ object นี้" ส่วน `name` เฉยๆ คือพารามิเตอร์ ดังนั้น `this.name = name;` อ่านว่า "เอาค่าจากพารามิเตอร์ ไปใส่ field ของตัวเอง"

**`new Student("Ploy", 85)`** คือการสร้าง object ใหม่จากพิมพ์เขียว `Student` โดยส่งค่า "Ploy" กับ 85 ให้ constructor แล้วเก็บ "ที่อยู่" ของ object ไว้ในตัวแปร `s1`

**เครื่องหมายจุด `.`** ใช้ "เข้าถึงของที่อยู่ใน object" ได้ทั้ง field (`s2.score`) และเมธอด (`s1.printInfo()`) อ่านว่า "ของ s1 ... "

> ⚠️ **จำไว้: ลืม `this` แล้วจะเงียบ ไม่ error!** ถ้าเขียน `name = name;` ใน constructor มันจะเอาพารามิเตอร์ไปใส่พารามิเตอร์ตัวเอง และ field ไม่ถูกตั้งค่า ลองรันดู

```java
class Bad {
    String name;

    Bad(String name) {
        name = name;        // ผิด! ควรเป็น this.name = name;
    }
}

public class Main {
    public static void main(String[] args) {
        Bad b = new Bad("Ploy");
        System.out.println(b.name);
    }
}
```

```output
null
```

## เมธอดที่ใช้ข้อมูลของ object ตัวเอง

เมธอดในคลาสเข้าถึง field ของ object ตัวเองได้ตรงๆ ไม่ต้องรับเป็นพารามิเตอร์ ทำให้ใช้งานง่ายมาก ลองเพิ่มเมธอดคำนวณเกรด

```java
class Student {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    String grade() {
        if (score >= 80) {
            return "A";
        } else if (score >= 70) {
            return "B";
        }
        return "C";
    }

    void printInfo() {
        System.out.println(name + " got grade " + grade());
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Ploy", 85);
        Student s2 = new Student("Beam", 70);
        Student s3 = new Student("Kan", 55);
        s1.printInfo();
        s2.printInfo();
        s3.printInfo();
    }
}
```

```output
Ploy got grade A
Beam got grade B
Kan got grade C
```

`printInfo()` เรียก `grade()` ซึ่งอยู่ในคลาสเดียวกันได้เลย และแต่ละ object ใช้ `score` ของตัวเองคำนวณ

## Encapsulation: ซ่อนข้อมูล ปกป้องด้วย `private`

ตอนนี้ใครๆ ก็แก้ `s2.score = -999` ได้ ซึ่งไม่สมเหตุสมผล OOP จึงมีหลักการ **encapsulation (การห่อหุ้ม)** คือ ซ่อน field ไว้ด้วย `private` แล้วเปิดให้เข้าถึงผ่านเมธอดที่เราควบคุมกฎได้ (เช่น ห้ามฝากเงินติดลบ)

```java
class Account {
    private int balance;           // private: เข้าถึงได้เฉพาะภายในคลาสนี้

    Account(int balance) {
        this.balance = balance;
    }

    int getBalance() {             // getter: อ่านค่า
        return balance;
    }

    void deposit(int amount) {     // เมธอดที่มีกฎควบคุม
        if (amount > 0) {
            balance = balance + amount;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Account acc = new Account(100);
        acc.deposit(50);
        acc.deposit(-20);          // ถูกปฏิเสธ เพราะไม่ใช่จำนวนบวก
        System.out.println(acc.getBalance());
    }
}
```

```output
150
```

ถ้าพยายามเข้าถึง field `private` จากข้างนอกตรงๆ เช่น `acc.balance = 999;` ในเมธอด `main` Java จะไม่ยอมคอมไพล์ พร้อมข้อความ `balance has private access in Account` สรุปธรรมเนียมที่โปรแกรมเมอร์ Java ใช้กันทั่วไปคือ **field เป็น `private` เมธอดเป็น `public`/ปกติ และเขียน getter (`getXxx`) / setter (`setXxx`) สำหรับเข้าถึง**

## เก็บ object ไว้ใน array

object ก็เป็นข้อมูลชนิดหนึ่ง เก็บใน array ได้เหมือนข้อมูลอื่น แล้ว **ใช้ลูปจัดการทีละตัว** ซึ่งรวมทั้งสิ่งที่เรียนมาทั้งหมดเข้าด้วยกัน

```java
class Student {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

public class Main {
    public static void main(String[] args) {
        Student[] students = {
            new Student("Ploy", 85),
            new Student("Beam", 70),
            new Student("Kan", 92)
        };

        Student best = students[0];
        for (int i = 1; i < students.length; i++) {
            if (students[i].score > best.score) {
                best = students[i];
            }
        }
        System.out.println("Top: " + best.name + " (" + best.score + ")");
    }
}
```

```output
Top: Kan (92)
```

นี่คือสูตรหาค่ามากที่สุดจากบทที่ 5 แต่ใช้กับ object แทนตัวเลข `best` ก็เป็นตัวแปรที่ชี้ไปยัง object ได้เช่นกัน

## `null` และ NullPointerException

ตัวแปรของ object (เช่น `Student s`) ไม่ได้เก็บตัว object แต่เก็บ **"ที่อยู่" (reference)** ที่ชี้ไปหา object ถ้ายังไม่ได้ชี้ไปหาอะไร ค่าจะเป็น `null` (แปลว่า "ไม่ชี้ไปที่ไหนเลย") ถ้าไปสั่งเรียกเมธอดผ่านตัวแปรที่เป็น `null` โปรแกรมจะล้มด้วย **`NullPointerException`** ซึ่งเป็น error ที่นักพัฒนา Java เจอบ่อยที่สุดในโลก

```java expect=error
class Student {
    String name = "Ploy";

    void printInfo() {
        System.out.println(name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = null;      // ยังไม่ได้สร้าง object ด้วย new
        s.printInfo();         // ล้ม! เพราะ s ไม่ได้ชี้ไปที่ object ไหนเลย
    }
}
```

```error
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Student.printInfo()" because "<local1>" is null
```

ข้อความ error บอกว่า "ไม่สามารถเรียก `printInfo()` ได้ เพราะตัวแปรเป็น `null`" (ชื่อตัวแปรอาจถูกแสดงเป็น `<local1>` แทนชื่อจริง `s` ขึ้นกับวิธีคอมไพล์ แต่ความหมายเหมือนกัน) แก้โดยตรวจว่าสร้าง object ด้วย `new` แล้ว

## ข้อผิดพลาดที่เจอบ่อย

| ข้อผิดพลาด | อาการ | วิธีแก้ |
|---|---|---|
| ลืม `new` / ยังไม่สร้าง object | `NullPointerException` | `Student s = new Student(...)` |
| ลืม `this.` ใน constructor | field เป็นค่าเริ่มต้น (`null`, `0`) ไม่ error | ใช้ `this.name = name;` |
| constructor มีชนิดคืนค่า (เช่น `void Student(...)`) | กลายเป็นเมธอดธรรมดา ไม่ใช่ constructor | constructor ไม่มี `void` และชื่อตรงกับคลาส |
| เข้าถึง field `private` จากนอกคลาส | `has private access` | ใช้ getter/setter |
| ส่งอาร์กิวเมนต์ให้ constructor ไม่ตรงจำนวน/ชนิด | `constructor ... cannot be applied to given types` | ส่งให้ครบตามที่ constructor ต้องการ |

> 📝 **ไฟล์เดียวมีได้หลายคลาส** แต่มี `public class` ได้แค่คลาสเดียว (ในเว็บนี้คือ `Main`) คลาสอื่นเขียนแบบไม่มี `public` ไว้ในไฟล์เดียวกันได้เลย ตามตัวอย่างทั้งหมดในบทนี้

## 🧪 ลองทำดู

> 🧪 **โจทย์ฝึกมือ (ไม่นับคะแนน)**
>
> 1. สร้างคลาส `Book` มี field `title` และ `pages` มีเมธอด `describe()` ที่พิมพ์ `<title> has <pages> pages` แล้วสร้างหนังสือ 2 เล่ม
> 2. เพิ่มเมธอด `isLong()` ใน `Book` คืนค่า `true` ถ้าเกิน 300 หน้า
> 3. สร้างคลาส `Circle` มี field `radius` และเมธอด `area()` ที่คืน `Math.PI * radius * radius`
> 4. สร้างคลาส `Counter` ที่มี field `private int count` เมธอด `increment()` และ `getCount()` ลองเรียก `increment()` สามครั้งแล้วพิมพ์ค่า

## สรุปบทที่ 7

| เรื่อง | สิ่งที่ต้องจำ |
|---|---|
| OOP | จัดโปรแกรมเป็น object ที่รวมข้อมูลและพฤติกรรมไว้ด้วยกัน |
| class / object | พิมพ์เขียว / ของจริงที่สร้างจากพิมพ์เขียว (สร้างได้หลายชิ้น) |
| field | ตัวแปรของ object (แต่ละ object มีของตัวเอง) |
| constructor | ชื่อเหมือนคลาส ไม่มีชนิดคืนค่า ทำงานตอน `new` |
| `this` | ตัว object นี้เอง ใช้แยก field ออกจากพารามิเตอร์ที่ชื่อซ้ำ |
| `new` | สร้าง object ใหม่ |
| `.` | เข้าถึง field/เมธอดของ object |
| encapsulation | field เป็น `private` เข้าถึงผ่าน getter/setter ที่ควบคุมกฎได้ |
| `null` | ตัวแปร object ที่ยังไม่ชี้ไปที่ object ไหน เรียกเมธอดแล้วจะเกิด NullPointerException |

ถัดไปลองทำแบบฝึกหัดสร้างคลาส Rectangle ได้เลย
