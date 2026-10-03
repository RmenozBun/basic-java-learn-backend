## ในบทนี้คุณจะได้เรียนอะไร

หลังจบบทนี้ คุณจะ

- ทำให้โปรแกรม **ตัดสินใจเองได้** ด้วย `if`, `else if`, `else`
- เข้าใจค่า `boolean` และตัวดำเนินการเปรียบเทียบ `== != > < >= <=`
- รวมหลายเงื่อนไขด้วย `&&` (และ), `||` (หรือ), `!` (ไม่)
- ใช้ `%` ตรวจเลขคู่-คี่ และตรวจว่าหารลงตัว
- เปรียบเทียบข้อความด้วย `.equals()` ให้ถูกวิธี
- รู้จัก `switch` และตัวดำเนินการ `? :` เป็นทางเลือกที่เขียนสั้นกว่า

> 📝 **ใช้เวลาประมาณ 25 นาที** ก่อนบทนี้โปรแกรมของเราทำงานเรียงจากบนลงล่างทุกบรรทัด หลังจากบทนี้โปรแกรมจะ "เลือกเส้นทาง" ได้ตามสถานการณ์ นี่คือก้าวแรกสู่การทำให้โปรแกรมฉลาด

## ชีวิตประจำวันก็เต็มไปด้วยเงื่อนไข

"**ถ้า** ฝนตก **ก็** พกร่ม **ไม่งั้น** ก็ไม่ต้องพก" เราตัดสินใจแบบนี้ทุกวัน โปรแกรมก็เช่นกัน เมื่อต้องการให้ทำสิ่งใดสิ่งหนึ่ง *เฉพาะเมื่อเงื่อนไขเป็นจริง* เราใช้คำสั่ง `if`

## คำสั่ง `if`

```java run=no
if (เงื่อนไข) {
    // โค้ดที่จะทำ เมื่อเงื่อนไขเป็นจริง (true)
}
```

**เงื่อนไขต้องเป็นค่า `boolean`** (ได้ผลเป็น `true` หรือ `false` เท่านั้น) ถ้าเป็น `true` โปรแกรมจะเข้าไปทำโค้ดในปีกกา ถ้าเป็น `false` จะข้ามไปทั้งก้อน

```java
public class Main {
    public static void main(String[] args) {
        int temperature = 35;
        if (temperature > 30) {
            System.out.println("It is hot today");
        }
        System.out.println("Done");
    }
}
```

```output
It is hot today
Done
```

`temperature > 30` คือ `35 > 30` ซึ่งเป็น `true` จึงพิมพ์ข้อความแรก ส่วนบรรทัด "Done" อยู่นอกปีกกาของ `if` จึงทำงานเสมอ ลองแก้ `temperature` เป็น `20` แล้วรันดู จะเหลือแค่ Done

## `if ... else`: เลือกอย่างใดอย่างหนึ่ง

เมื่อต้องการให้มี "ทางเลือกสำรอง" ใช้ `else` ซึ่งจะทำงานเมื่อเงื่อนไขของ `if` เป็นเท็จ

```java
public class Main {
    public static void main(String[] args) {
        int score = 45;
        if (score >= 50) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }
    }
}
```

```output
Fail
```

ในโปรแกรมนี้ **ต้องมีตัวใดตัวหนึ่งทำงานเสมอ และทำงานแค่ตัวเดียว** ไม่มีทางได้ทั้ง Pass และ Fail

## `else if`: หลายทางเลือก

ถ้ามีมากกว่า 2 ทางเลือก (เช่น ตัดเกรด A B C D) ใช้ `else if` ต่อกันเป็นลูกโซ่ Java จะไล่ตรวจจากบนลงล่าง **เจอเงื่อนไขแรกที่เป็นจริงก็ทำแล้วจบเลย** ไม่ตรวจข้อที่เหลือต่อ

```java stdin=75
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();

        if (score >= 80) {
            System.out.println("Grade A");
        } else if (score >= 70) {
            System.out.println("Grade B");
        } else if (score >= 60) {
            System.out.println("Grade C");
        } else {
            System.out.println("Grade D");
        }
    }
}
```

```output
Grade B
```

ลอง **ไล่ทีละขั้น** ตอนที่ป้อน `75`

| ลำดับ | ตรวจเงื่อนไข | ผล | ทำอะไร |
|---|---|---|---|
| 1 | `75 >= 80` | false | ข้าม ไปตรวจข้อถัดไป |
| 2 | `75 >= 70` | **true** | พิมพ์ `Grade B` แล้ว **จบทั้งลูกโซ่** |
| 3 | `75 >= 60` | (ไม่ถูกตรวจ) | |

> ⚠️ **ลำดับของเงื่อนไขสำคัญมาก!** ถ้าเขียนเรียงจากน้อยไปมาก คะแนน 90 จะได้เกรดผิด เพราะเข้าเงื่อนไขแรกที่ `>= 60` ทันที ลองรันดู

```java
public class Main {
    public static void main(String[] args) {
        int score = 90;
        if (score >= 60) {
            System.out.println("Grade C");
        } else if (score >= 80) {
            System.out.println("Grade A");
        }
    }
}
```

```output
Grade C
```

กฎจำง่าย: เวลาตรวจแบบช่วงตัวเลข ให้ **ตรวจเงื่อนไขที่เข้มที่สุดก่อน** (ค่าสูงสุดก่อน)

## ตัวดำเนินการเปรียบเทียบ

| ตัวดำเนินการ | ความหมาย | ตัวอย่าง | ผลลัพธ์ |
|---|---|---|---|
| `==` | เท่ากับ | `5 == 5` | `true` |
| `!=` | ไม่เท่ากับ | `5 != 3` | `true` |
| `>` | มากกว่า | `3 > 5` | `false` |
| `<` | น้อยกว่า | `3 < 5` | `true` |
| `>=` | มากกว่าหรือเท่ากับ | `5 >= 5` | `true` |
| `<=` | น้อยกว่าหรือเท่ากับ | `6 <= 5` | `false` |

> ⚠️ **`=` กับ `==` ไม่เหมือนกัน!** `=` คือ "เก็บค่า" ส่วน `==` คือ "เปรียบเทียบว่าเท่ากันไหม" นี่คือความผิดพลาดอันดับต้นๆ ของมือใหม่ ลองรันโค้ดนี้เพื่อดู error

```java expect=compile-error
public class Main {
    public static void main(String[] args) {
        int x = 3;
        if (x = 5) {
            System.out.println("five");
        }
    }
}
```

Java จะฟ้องว่า `incompatible types: int cannot be converted to boolean` แปลว่า "ในวงเล็บของ if ต้องเป็น true/false แต่คุณใส่ตัวเลขมา" ซึ่งช่วยจับความผิดพลาดนี้ให้เราได้ดี

## ตัวดำเนินการตรรกะ: `&&`, `||`, `!`

เมื่อต้องตรวจ **หลายเงื่อนไขพร้อมกัน** เช่น "อายุมากกว่า 18 **และ** มีบัตรประชาชน"

| ตัวดำเนินการ | อ่านว่า | เป็น `true` เมื่อ |
|---|---|---|
| `a && b` | a **และ** b | ทั้งสองเป็นจริง |
| `a \|\| b` | a **หรือ** b | อย่างน้อยหนึ่งเป็นจริง |
| `!a` | **ไม่** a | a เป็นเท็จ (กลับค่า) |

ตารางความจริง (truth table) ของ `&&` และ `||`

| a | b | `a && b` | `a \|\| b` |
|---|---|---|---|
| true | true | true | true |
| true | false | false | true |
| false | true | false | true |
| false | false | false | false |

```java
public class Main {
    public static void main(String[] args) {
        int age = 20;
        boolean hasTicket = true;

        if (age >= 18 && hasTicket) {
            System.out.println("Welcome");
        }
        if (age < 12 || age > 60) {
            System.out.println("Discount");
        }
        if (!hasTicket) {
            System.out.println("Please buy a ticket");
        }
    }
}
```

```output
Welcome
```

อายุ 20 และมีตั๋ว จึงเข้าเงื่อนไขแรก (`true && true`) ส่วนเงื่อนไขที่สองอายุ 20 ไม่ได้ต่ำกว่า 12 และไม่ได้เกิน 60 จึงเป็นเท็จทั้งคู่ และเงื่อนไขที่สาม `!hasTicket` คือ `!true` ได้ `false`

> 💡 **ข้อควรระวัง:** เขียนช่วงตัวเลขต้องแยกเป็นสองเงื่อนไข เช่น `10 < x < 20` เขียนแบบนี้ใน Java ไม่ได้ ต้องเขียนเป็น `x > 10 && x < 20`

## ใช้ `%` ตรวจเลขคู่-คี่และการหารลงตัว

จำตัวดำเนินการ `%` (หารเอาเศษ) จากบทที่แล้วได้ไหม? ตอนนี้เราจะเอามาใช้จริง

- ถ้า `n % 2 == 0` แปลว่า n หารด้วย 2 ลงตัว เศษเป็น 0 นั่นคือ **เลขคู่**
- ถ้า `n % 2 == 1` แปลว่าเหลือเศษ 1 นั่นคือ **เลขคี่** (กรณีเลขลบใช้ `!= 0` ปลอดภัยกว่า)
- ถ้า `n % 3 == 0` แปลว่าหารด้วย 3 ลงตัว

```java stdin=7
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }

        if (n % 3 == 0 && n % 5 == 0) {
            System.out.println("Divisible by both 3 and 5");
        }
    }
}
```

```output
Odd
```

ลองป้อน `30` ใน Playground จะได้ `Even` และ `Divisible by both 3 and 5`

## เปรียบเทียบข้อความ: ใช้ `.equals()`

กับตัวเลขเราใช้ `==` ได้ แต่ **กับข้อความ (String) ต้องใช้ `.equals()`** เสมอ เพราะ `==` เปรียบเทียบว่าเป็น "ก้อนข้อมูลเดียวกันในหน่วยความจำหรือเปล่า" ไม่ได้เทียบเนื้อหาของข้อความ ซึ่งบางครั้งให้ผลผิดโดยไม่มี error บอก

```java
public class Main {
    public static void main(String[] args) {
        String answer = "java";
        if (answer.equals("java")) {
            System.out.println("Correct");
        }
        if (answer.equalsIgnoreCase("JAVA")) {
            System.out.println("Correct (ignore case)");
        }
    }
}
```

```output
Correct
Correct (ignore case)
```

`equalsIgnoreCase` ใช้เมื่อไม่สนตัวพิมพ์เล็ก-ใหญ่ ซึ่งสะดวกมากเวลาเช็คคำตอบของผู้ใช้

## ทางเลือกที่เขียนสั้นกว่า

### ตัวดำเนินการ `? :` (ternary)

เมื่อ if-else ทำแค่ "เลือกค่าหนึ่งในสองค่า" เขียนบรรทัดเดียวได้ รูปแบบ `เงื่อนไข ? ค่าถ้าจริง : ค่าถ้าเท็จ`

```java
public class Main {
    public static void main(String[] args) {
        int number = 8;
        String result = (number % 2 == 0) ? "even" : "odd";
        System.out.println(number + " is " + result);
    }
}
```

```output
8 is even
```

### `switch`: เลือกตามค่าที่ตรงเป๊ะ

เมื่อต้องเทียบตัวแปรตัวเดียวกับค่าคงที่หลายๆ ค่า (เช่น วันในสัปดาห์ เมนูตัวเลือก) `switch` อ่านง่ายกว่า `else if` ยาวๆ

```java stdin=3
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int day = sc.nextInt();

        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            default:
                System.out.println("Other day");
        }
    }
}
```

```output
Wednesday
```

`break` สำคัญมาก มันสั่ง "ออกจาก switch ทันที" ถ้าลืม `break` โปรแกรมจะ **ไหลต่อ (fall-through)** ลงไปทำ case ถัดไปด้วย ลองดู

```java
public class Main {
    public static void main(String[] args) {
        int x = 1;
        switch (x) {
            case 1:
                System.out.println("one");
            case 2:
                System.out.println("two");
                break;
            case 3:
                System.out.println("three");
        }
    }
}
```

```output
one
two
```

`default` คือทางเลือกสำรอง ทำงานเมื่อไม่ตรงกับ case ไหนเลย (เหมือน `else`)

## ข้อผิดพลาดที่เจอบ่อย

**1. ใส่ `;` หลัง `if (...)`** โปรแกรมไม่ error แต่ทำงานผิด เพราะ `;` ตัวเดียวถือเป็นคำสั่งว่างที่ if ควบคุมอยู่ ส่วนปีกกาที่ตามมาจะทำงานเสมอ

```java
public class Main {
    public static void main(String[] args) {
        int x = 1;
        if (x > 5); {
            System.out.println("Always prints!");
        }
    }
}
```

```output
Always prints!
```

`x = 1` ไม่มากกว่า 5 แต่ข้อความยังถูกพิมพ์ ถ้าเจอบั๊กลักษณะนี้ ให้ตรวจดูว่ามี `;` เกินหลัง `if` หรือเปล่า

**2. ไม่ใส่ปีกกา** `if (x > 5) System.out.println("a");` ใช้ได้ถ้ามีคำสั่งเดียว แต่เมื่อเพิ่มบรรทัดที่สอง บรรทัดนั้นจะ **ไม่ได้อยู่ใน if** แนะนำให้ใส่ปีกกาทุกครั้งแม้มีบรรทัดเดียว

**3. เรียงเงื่อนไขใน else-if ผิดลำดับ** ดูตัวอย่างเกรด 90 ที่ได้ C ด้านบน

**4. ใช้ `==` กับ String** ให้ใช้ `.equals()` แทนเสมอ

## 🧪 ลองทำดู

> 🧪 **โจทย์ฝึกมือ (ไม่นับคะแนน)**
>
> 1. อ่านเลขสามตัว (`nextInt()` สามครั้ง) แล้วพิมพ์ตัวที่มากที่สุด
> 2. อ่านปี ค.ศ. แล้วบอกว่าเป็นปีอธิกสุรทิน (leap year) หรือไม่ กฎ: หารด้วย 4 ลงตัว **และ** ไม่หารด้วย 100 ลงตัว **หรือ** หารด้วย 400 ลงตัว (ทดสอบ: 2024 เป็น, 1900 ไม่เป็น, 2000 เป็น)
> 3. อ่านอายุ แล้วพิมพ์ `Child` (ต่ำกว่า 13), `Teen` (13-19), `Adult` (20-59) หรือ `Senior` (60 ขึ้นไป)

## สรุปบทที่ 3

| เรื่อง | สิ่งที่ต้องจำ |
|---|---|
| `if` | ทำเมื่อเงื่อนไขเป็น `true` |
| `if-else` | เลือกอย่างใดอย่างหนึ่ง |
| `else if` | หลายทางเลือก เจอข้อแรกที่จริงแล้วจบ **เรียงเงื่อนไขที่เข้มที่สุดก่อน** |
| เปรียบเทียบ | `== != > < >= <=` และ `=` ไม่ใช่ `==` |
| ตรรกะ | `&&` และ, `\|\|` หรือ, `!` ไม่ |
| `%` | เลขคู่: `n % 2 == 0`, หารลงตัว: `n % k == 0` |
| String | ใช้ `.equals()` ไม่ใช้ `==` |
| ทางลัด | `? :` เลือกค่า, `switch` เทียบค่าคงที่ (อย่าลืม `break`) |

ถัดไปลองทำแบบฝึกหัดตรวจเลขคู่-คี่ได้เลย
