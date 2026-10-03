## ในบทนี้คุณจะได้เรียนอะไร

หลังจบบทนี้ คุณจะ

- เข้าใจว่า **เมธอด (method)** คืออะไร และช่วยให้โค้ดดีขึ้นอย่างไร
- เขียนเมธอดที่ไม่คืนค่า (`void`) และที่คืนค่า (`return`) ได้
- ส่งข้อมูลเข้าเมธอดผ่าน **พารามิเตอร์**
- เข้าใจว่าตัวแปรในเมธอดมีขอบเขต (scope) และการส่งค่าแบบ *pass by value*
- ใช้ **method overloading** (ชื่อเดียวกัน พารามิเตอร์ต่างกัน)
- แบ่งโปรแกรมใหญ่เป็นเมธอดเล็กๆ ที่เรียกใช้ซ้ำได้

> 📝 **ใช้เวลาประมาณ 30 นาที** ตั้งแต่ตอนนี้เป็นต้นไปโค้ดของเราจะเริ่ม "เป็นระเบียบ" ขึ้นมาก นี่คือทักษะที่แยกโค้ดมือสมัครเล่นออกจากโค้ดมืออาชีพ

## เมธอดคืออะไร

คุณใช้เมธอดมาตั้งแต่บทแรกแล้ว `System.out.println(...)` ก็คือเมธอดที่คนอื่นเขียนไว้ให้ เรียกชื่อแล้วมันก็ทำงานให้ **เมธอด = ชุดคำสั่งที่ตั้งชื่อไว้ แล้วเรียกใช้ซ้ำเมื่อไรก็ได้** เปรียบเหมือน "สูตรอาหาร" ที่เขียนไว้ครั้งเดียว แล้วทำอาหารจานนั้นกี่ครั้งก็ได้โดยไม่ต้องเขียนสูตรใหม่

ประโยชน์ของเมธอดมี 3 อย่างหลักๆ

1. **ไม่เขียนซ้ำ (DRY: Don't Repeat Yourself)** เขียนครั้งเดียว เรียกกี่ครั้งก็ได้ ถ้าต้องแก้ ก็แก้ที่เดียว
2. **อ่านง่าย** ชื่อเมธอดบอกว่าทำอะไร (`calculateTax()` อ่านง่ายกว่าโค้ดคำนวณภาษี 10 บรรทัด)
3. **แบ่งงานใหญ่เป็นงานเล็ก** ทดสอบทีละชิ้นได้

## เมธอดแบบง่ายที่สุด

```java
public class Main {
    static void sayHello() {
        System.out.println("Hello from a method!");
    }

    public static void main(String[] args) {
        sayHello();
        sayHello();
    }
}
```

```output
Hello from a method!
Hello from a method!
```

เราสร้างเมธอด `sayHello` ไว้นอก `main` (แต่ยังอยู่ในคลาส `Main`) แล้ว **เรียกใช้** จาก `main` ด้วยการเขียนชื่อตามด้วย `()` สองครั้ง จึงพิมพ์สองรอบ โปรแกรมเริ่มทำงานที่ `main` เสมอ เมธอดอื่นจะทำงานก็ต่อเมื่อถูกเรียก

### ส่วนประกอบของเมธอด

```diagram
static   int    add   ( int a, int b )   {  return a + b;  }
  |       |      |        |                      |
  |       |      |        |                      +-- ตัวเมธอด (โค้ดที่ทำงาน)
  |       |      |        +-- พารามิเตอร์ (ข้อมูลที่รับเข้ามา)
  |       |      +-- ชื่อเมธอด (camelCase เป็นคำกริยา)
  |       +-- ชนิดของค่าที่ส่งกลับ (void = ไม่ส่งอะไรกลับ)
  +-- ตอนนี้ใส่ static ไว้ก่อน (จะเข้าใจเต็มๆ ในบท OOP)
```

> 💡 **ทำไมต้องมี `static`?** เมธอด `main` เป็น `static` ดังนั้นเมธอดที่ `main` เรียกตรงๆ ก็ต้องเป็น `static` ด้วย ในบทนี้ให้ใส่ `static` หน้าเมธอดทุกตัวไปก่อน ส่วนความหมายจริงจังของมันจะอธิบายในบท OOP

## พารามิเตอร์และการคืนค่า

เมธอดที่มีประโยชน์จริงๆ มักรับข้อมูลเข้ามาคำนวณ แล้วส่งผลลัพธ์กลับ

- **พารามิเตอร์** คือตัวแปรที่เขียนในวงเล็บตอนประกาศเมธอด (ช่องรับข้อมูล) ส่วนค่าที่ส่งเข้าไปตอนเรียกใช้เรียกว่า **อาร์กิวเมนต์**
- **`return`** คือการส่งค่ากลับไปให้ที่เรียกใช้ และ **จบการทำงานของเมธอดทันที**
- ชนิดหน้าชื่อเมธอด (`int`, `double`, `boolean`...) ต้องตรงกับค่าที่ `return`

```java
public class Main {
    static int add(int a, int b) {
        return a + b;
    }

    static double average(int a, int b) {
        return (a + b) / 2.0;
    }

    public static void main(String[] args) {
        int total = add(3, 4);              // เก็บค่าที่ส่งกลับมาไว้ในตัวแปร
        System.out.println(total);
        System.out.println(add(10, 20));    // เอาไปใช้ตรงๆ เลยก็ได้
        System.out.println(average(3, 4));
    }
}
```

```output
7
30
3.5
```

เมื่อเขียน `add(3, 4)` โปรแกรมจะส่ง 3 ไปให้พารามิเตอร์ `a` และส่ง 4 ให้ `b` (**ตามลำดับ**) คำนวณ `a + b` ได้ 7 แล้ว `return` ค่า 7 กลับมา แทนที่ตัว `add(3, 4)` ตรงนั้น เหมือนเอา 7 ไปวางแทนนั่นเอง

| ประเภท | ประกาศ | เรียกใช้ |
|---|---|---|
| ไม่คืนค่า | `static void greet(String name)` | `greet("Ploy");` (ทำงานเฉยๆ) |
| คืนค่า | `static int square(int x)` | `int y = square(5);` (ต้องเอาค่ามาใช้) |

### เมธอดที่คืนค่า `boolean`

เมธอดที่ตอบคำถามแบบ ใช่/ไม่ใช่ มักตั้งชื่อขึ้นต้นด้วย `is` หรือ `has` และใช้ใน `if` ได้ทันที

```java
public class Main {
    static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 4; i++) {
            if (isEven(i)) {
                System.out.println(i + " is even");
            } else {
                System.out.println(i + " is odd");
            }
        }
    }
}
```

```output
1 is odd
2 is even
3 is odd
4 is even
```

สังเกตว่าโค้ดใน `main` อ่านเหมือนภาษาคน เพราะเรายกรายละเอียดการตรวจเลขคู่ไปซ่อนไว้ในเมธอด นี่คือพลังของการตั้งชื่อดีๆ

## ตัวแปรในเมธอดและ Scope

ตัวแปรที่สร้างในเมธอด (รวมถึงพารามิเตอร์) เป็น **ตัวแปรท้องถิ่น (local variable)** ใช้ได้เฉพาะในเมธอดนั้น พอเมธอดจบก็หายไป เมธอดอื่นมองไม่เห็น

```java expect=compile-error
public class Main {
    static void calculate() {
        int result = 42;
    }

    public static void main(String[] args) {
        calculate();
        System.out.println(result);   // main มองไม่เห็นตัวแปร result
    }
}
```

จะได้ error `cannot find symbol` เพราะ `result` อยู่ในอาณาเขตของ `calculate` เท่านั้น ถ้าอยากได้ค่ากลับมาใช้ใน `main` ต้องให้เมธอด `return` ค่านั้นออกมา

### Pass by Value: ส่งไปเป็น "ก๊อปปี้"

เมื่อส่งตัวแปรเข้าเมธอด Java ส่ง **สำเนาของค่า** ไป เมธอดแก้ค่าในสำเนาได้ แต่ **ตัวแปรเดิมไม่เปลี่ยน**

```java
public class Main {
    static void tryToChange(int x) {
        x = 100;
        System.out.println("inside: " + x);
    }

    public static void main(String[] args) {
        int number = 5;
        tryToChange(number);
        System.out.println("outside: " + number);
    }
}
```

```output
inside: 100
outside: 5
```

ค่า `number` ยังเป็น 5 เหมือนเดิม เพราะ `x` ในเมธอดเป็นแค่สำเนา ถ้าต้องการให้ค่าใหม่ออกมาข้างนอก ให้ `return` แล้วเก็บใส่ตัวแปรเอง เช่น `number = change(number);`

## Method Overloading: ชื่อเดียวกัน ทำงานต่างกัน

Java อนุญาตให้มีหลายเมธอดที่ **ชื่อเดียวกัน** ถ้า **พารามิเตอร์ต่างกัน** (จำนวนหรือชนิดต่างกัน) Java จะเลือกเมธอดที่ตรงที่สุดให้เองตามค่าที่ส่งเข้าไป

```java
public class Main {
    static int max(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    static double max(double a, double b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(max(3, 8));       // เรียกตัวที่รับ int
        System.out.println(max(2.5, 1.5));   // เรียกตัวที่รับ double
    }
}
```

```output
8
2.5
```

`System.out.println` เองก็คือ overloading: มีเวอร์ชันที่รับ `int`, `String`, `double`, `boolean` ฯลฯ ทั้งที่ชื่อเดียวกัน

## ส่ง array เข้าเมธอด

ส่ง array เป็นพารามิเตอร์ได้ ทำให้เขียนเมธอดจัดการข้อมูลทั้งกลุ่มได้ (เชื่อมโยงกับบทที่แล้ว)

```java
public class Main {
    static int sumArray(int[] data) {
        int total = 0;
        for (int v : data) {
            total += v;
        }
        return total;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4};
        System.out.println(sumArray(nums));
    }
}
```

```output
10
```

## ข้อผิดพลาดที่เจอบ่อย

**1. ลืม `return`** เมธอดที่ประกาศว่าคืนค่า ต้อง `return` ให้ครบทุกเส้นทาง

```java expect=compile-error
public class Main {
    static int double2(int x) {
        int result = x * 2;
    }

    public static void main(String[] args) {
        System.out.println(double2(4));
    }
}
```

จะได้ `missing return statement` แก้โดยเติม `return result;` ท้ายเมธอด

**2. ลืมใส่ `static`** ในตอนนี้ ถ้าเมธอดที่เรียกจาก `main` ไม่มี `static` จะได้ error ประมาณ `non-static method ... cannot be referenced from a static context`

```java expect=compile-error
public class Main {
    void sayHi() {
        System.out.println("Hi");
    }

    public static void main(String[] args) {
        sayHi();
    }
}
```

**3. ส่งอาร์กิวเมนต์ผิดจำนวนหรือผิดชนิด** เช่น `add(1)` ทั้งที่เมธอดต้องการ 2 ตัว จะได้ error `method add in class Main cannot be applied to given types` ให้ตรวจจำนวนและชนิดข้อมูลที่ส่งให้ตรงกับพารามิเตอร์

**4. เรียกเมธอดที่คืนค่าแต่ไม่เอาค่ามาใช้** `add(3, 4);` เฉยๆ ไม่ผิด แต่ผลลัพธ์หายไปเปล่าๆ ต้องเก็บใส่ตัวแปรหรือพิมพ์ออกมา

## 🧪 ลองทำดู

> 🧪 **โจทย์ฝึกมือ (ไม่นับคะแนน)**
>
> 1. เขียนเมธอด `static int square(int x)` คืนค่ากำลังสอง แล้วลองเรียกกับ 1 ถึง 5 ในลูป
> 2. เขียน `static boolean isPrime(int n)` ตรวจจำนวนเฉพาะ (คำใบ้: ลองหาร n ด้วย 2 ถึง n-1 ถ้าหารลงตัวสักตัวก็ไม่ใช่ จำนวนเฉพาะต้องมากกว่า 1) แล้วพิมพ์จำนวนเฉพาะ 1 ถึง 20 ควรได้ 2, 3, 5, 7, 11, 13, 17, 19
> 3. เขียน `static int factorial(int n)` โดยใช้ลูป แล้วลองหา 5! ควรได้ 120
> 4. เขียน `static int maxOf(int[] arr)` คืนค่ามากที่สุดใน array โดยใช้สูตรจากบทที่ 5

## สรุปบทที่ 6

| เรื่อง | สิ่งที่ต้องจำ |
|---|---|
| เมธอด | ชุดคำสั่งที่ตั้งชื่อไว้ เรียกใช้ซ้ำได้ |
| โครงสร้าง | `static ชนิดที่คืน ชื่อ(พารามิเตอร์) { ... return ค่า; }` |
| `void` | ไม่คืนค่า ไม่ต้อง `return ค่า` |
| `return` | ส่งค่ากลับ และจบเมธอดทันที |
| พารามิเตอร์/อาร์กิวเมนต์ | ช่องรับข้อมูล / ค่าที่ส่งเข้าไป (ต้องตรงลำดับและชนิด) |
| Scope | ตัวแปรในเมธอดใช้ได้เฉพาะในเมธอดนั้น |
| Pass by value | ส่งสำเนาค่า ตัวแปรเดิมไม่เปลี่ยน |
| Overloading | ชื่อเดียวกันได้ ถ้าพารามิเตอร์ต่างกัน |
| ตอนนี้ | ใส่ `static` ให้เมธอดที่ `main` เรียก |

ถัดไปลองทำแบบฝึกหัดเขียนเมธอดหาผลบวกได้เลย
