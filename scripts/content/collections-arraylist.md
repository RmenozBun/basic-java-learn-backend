## ในบทนี้คุณจะได้เรียนอะไร

หลังจบบทนี้ คุณจะ

- เข้าใจข้อจำกัดของ array และเหตุผลที่ต้องมี **`ArrayList`**
- สร้าง `ArrayList` เพิ่ม ลบ แก้ ค้นหา และวนลูปข้อมูลได้
- เข้าใจ **generics** (`<String>`, `<Integer>`) และ wrapper class
- รู้กับดักของ `remove()` กับ `ArrayList<Integer>`
- เรียงลำดับและหาค่าสูงสุด/ต่ำสุดด้วย `Collections`
- รู้จัก `HashMap` ที่เก็บข้อมูลเป็นคู่ **key → value** เบื้องต้น

> 📝 **ใช้เวลาประมาณ 30 นาที** นี่คือบทสุดท้ายของคอร์สพื้นฐาน เครื่องมือในบทนี้คือสิ่งที่โปรแกรมเมอร์ Java ใช้ทุกวันในงานจริง

## ปัญหาของ array: ขนาดตายตัว

array มีขนาดที่กำหนดตอนสร้างแล้ว **เปลี่ยนไม่ได้** ถ้าจอง 5 ช่องแล้วมีข้อมูลที่ 6 ก็ใส่ไม่ได้ หรือถ้าอยากลบสมาชิกตรงกลาง ก็ต้องเขียนโค้ดขยับสมาชิกเองทีละตัว ในงานจริงเรามักไม่รู้ล่วงหน้าว่าจะมีข้อมูลกี่ตัว เช่น รายชื่อผู้ใช้ที่เพิ่มเข้ามาเรื่อยๆ

**`ArrayList`** คือ "array ที่ยืดหดได้" ที่ Java เตรียมไว้ให้ ขยายขนาดเองอัตโนมัติเมื่อเพิ่มข้อมูล และมีเมธอดสำเร็จรูปสำหรับ เพิ่ม ลบ ค้นหา ให้ใช้เลย

## สร้างและใช้ ArrayList

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();

        names.add("Ploy");
        names.add("Beam");
        names.add("Kan");

        System.out.println(names);
        System.out.println(names.size());
        System.out.println(names.get(1));
    }
}
```

```output
[Ploy, Beam, Kan]
3
Beam
```

- **`import java.util.ArrayList;`** ต้องใส่ไว้บนสุดเสมอ (เหมือน `Scanner`)
- **`ArrayList<String>`** วงเล็บ `< >` เรียกว่า **generics** บอกว่ารายการนี้เก็บ *ข้อมูลชนิดไหน* (ที่นี่คือ `String`) Java จะไม่ยอมให้ใส่ข้อมูลผิดชนิดเข้าไป ช่วยกันความผิดพลาด
- **`new ArrayList<>()`** สร้างรายการว่างๆ
- สั่ง `System.out.println(names)` ได้เลย พิมพ์ออกมาสวยๆ เป็น `[Ploy, Beam, Kan]` (ต่างจาก array ธรรมดาที่ได้ข้อความประหลาด)
- index เริ่มที่ 0 เหมือน array: `names.get(1)` คือ `"Beam"`

## เมธอดที่ใช้บ่อย

| เมธอด | ทำอะไร | เปรียบเทียบกับ array |
|---|---|---|
| `add(x)` | เพิ่ม x ต่อท้ายรายการ | array เพิ่มไม่ได้ |
| `add(i, x)` | แทรก x ที่ตำแหน่ง i (ตัวอื่นขยับไปให้) | ต้องขยับเอง |
| `get(i)` | อ่านค่าที่ตำแหน่ง i | `arr[i]` |
| `set(i, x)` | เปลี่ยนค่าที่ตำแหน่ง i | `arr[i] = x` |
| `remove(i)` | ลบตัวที่ตำแหน่ง i | ลบไม่ได้ |
| `remove(x)` | ลบตัวแรกที่มีค่าเท่ากับ x | ลบไม่ได้ |
| `size()` | จำนวนสมาชิก | `arr.length` (ไม่มีวงเล็บ) |
| `contains(x)` | มี x อยู่ไหม (`true`/`false`) | ต้องวนลูปหาเอง |
| `indexOf(x)` | ตำแหน่งของ x (ไม่เจอได้ `-1`) | ต้องวนลูปหาเอง |
| `isEmpty()` | รายการว่างไหม | `arr.length == 0` |
| `clear()` | ลบทั้งหมด | |

ลองดูหลายเมธอดทำงานร่วมกัน ลองไล่ตามด้วยตัวเองว่าหลังแต่ละบรรทัดรายการเป็นอย่างไร

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");          // [A, B, C]
        list.add(1, "X");       // [A, X, B, C]  แทรกที่ตำแหน่ง 1
        list.set(0, "Z");       // [Z, X, B, C]  เปลี่ยนตำแหน่ง 0
        list.remove(2);         // [Z, X, C]     ลบตำแหน่ง 2 (คือ B)
        list.remove("X");       // [Z, C]        ลบค่า "X"

        System.out.println(list);
        System.out.println(list.contains("C"));
        System.out.println(list.indexOf("C"));
        System.out.println(list.isEmpty());
    }
}
```

```output
[Z, C]
true
1
false
```

## ArrayList กับตัวเลข: Wrapper Class

generics ใช้ได้กับ **คลาสเท่านั้น** ไม่ใช้ชนิดพื้นฐานอย่าง `int` โดยตรง เราต้องใช้ **wrapper class** ที่เป็นเวอร์ชัน "ห่อ" ของชนิดพื้นฐานแต่ละชนิด

| ชนิดพื้นฐาน | Wrapper class |
|---|---|
| `int` | `Integer` |
| `double` | `Double` |
| `boolean` | `Boolean` |
| `char` | `Character` |

ข่าวดีคือ Java แปลงไปมาให้อัตโนมัติ (เรียกว่า *autoboxing*) เราจึงเขียน `nums.add(10)` และ `for (int n : nums)` ได้ตามปกติ

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(10);
        nums.add(20);
        nums.add(30);

        int total = 0;
        for (int n : nums) {
            total += n;
        }
        System.out.println("Total = " + total);
        System.out.println("Average = " + (double) total / nums.size());
    }
}
```

```output
Total = 60
Average = 20.0
```

การวนลูปทำได้ทั้ง `for-each` แบบนี้ หรือ `for` ธรรมดาด้วย `nums.get(i)` และ `i < nums.size()` ผลเหมือนกัน

### กับดัก: `remove(index)` ปะทะ `remove(value)`

พอเป็น `ArrayList<Integer>` ปัญหาจะเกิดขึ้น เพราะ `remove(1)` ไม่ชัดเจนว่าหมายถึง "ลบ**ตำแหน่ง** 1" หรือ "ลบ**ค่า** 1" Java ตีความตัวเลข `int` เป็น **ตำแหน่ง** เสมอ

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(3);
        nums.add(1);

        nums.remove(1);                     // ลบตำแหน่ง 1 (ค่า 3) ไม่ใช่ลบค่า 1!
        System.out.println(nums);

        nums.remove(Integer.valueOf(5));    // ลบ "ค่า" 5 ต้องห่อเป็น Integer
        System.out.println(nums);
    }
}
```

```output
[5, 1]
[1]
```

> ⚠️ **ถ้าอยากลบ "ค่า" ที่เป็นตัวเลขจาก `ArrayList<Integer>`** ให้เขียน `list.remove(Integer.valueOf(ค่า))` แต่ถ้าเป็น `ArrayList<String>` ไม่มีปัญหานี้ เพราะ String ไม่ใช่ตัวเลข Java เลยรู้ว่าเป็นการลบตามค่า

## เรียงลำดับและหาค่าสูงสุด/ต่ำสุด

คลาส `Collections` มีเครื่องมือสำเร็จรูปให้ใช้กับ list (ต้อง `import java.util.Collections;`)

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(2);
        nums.add(9);
        nums.add(1);

        Collections.sort(nums);
        System.out.println(nums);

        Collections.reverse(nums);
        System.out.println(nums);

        System.out.println(Collections.max(nums));
        System.out.println(Collections.min(nums));
    }
}
```

```output
[1, 2, 5, 9]
[9, 5, 2, 1]
9
1
```

ลองนึกถึงบทที่ 5 ที่เราเขียนลูปหาค่ามากที่สุดเอง ตอนนี้ `Collections.max(nums)` ทำให้บรรทัดเดียว แต่การเข้าใจว่ามันทำงานอย่างไรข้างใน (ที่เราเรียนมา) ยังสำคัญมาก

## ArrayList ของ object

ArrayList เก็บ object ได้ (เช่น `Student` จากบท OOP) ซึ่งสะดวกกว่า array เพราะเพิ่มเรื่อยๆ ได้โดยไม่ต้องกำหนดขนาด

```java
import java.util.ArrayList;

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
        ArrayList<Student> list = new ArrayList<>();
        list.add(new Student("Ploy", 85));
        list.add(new Student("Beam", 70));
        list.add(new Student("Kan", 92));

        System.out.println("Passed 75+:");
        for (Student s : list) {
            if (s.score >= 75) {
                System.out.println(s.name);
            }
        }
    }
}
```

```output
Passed 75+:
Ploy
Kan
```

## อ่านข้อมูลเข้า ArrayList

เมื่อไม่รู้จำนวนข้อมูลล่วงหน้า ArrayList สะดวกมาก ตัวอย่างนี้อ่านตัวเลข N ตัว แล้วรวมเฉพาะเลขที่มากกว่า 10 (ลองเทียบกับโจทย์แบบฝึกหัดด้านล่าง ซึ่งใช้รูปแบบเดียวกัน)

```java stdin=4%0A5%0A12%0A30%0A8
import java.util.ArrayList;
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
            if (num > 10) {
                sum += num;
            }
        }
        System.out.println(sum);
    }
}
```

```output
42
```

ตัวเลขที่ป้อนคือ 5, 12, 30, 8 (มี 4 ตัว) เลขที่มากกว่า 10 คือ 12 กับ 30 รวมกันได้ 42

## แนะนำ `HashMap`: เก็บเป็นคู่ key → value

บางครั้งข้อมูลไม่เหมาะกับการเรียงเป็นลำดับ แต่เหมาะกับการ **"ค้นหาด้วยชื่อ"** เช่น สมุดโทรศัพท์ (ชื่อ → เบอร์) หรือพจนานุกรม (คำ → ความหมาย) **`HashMap`** เก็บข้อมูลเป็นคู่ `key → value` และค้นหาด้วย key ได้เร็วมาก

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("Ploy", 85);
        scores.put("Beam", 70);

        System.out.println(scores.get("Ploy"));
        System.out.println(scores.containsKey("Kan"));

        scores.put("Beam", 75);            // key เดิม = เขียนทับค่าเดิม
        System.out.println(scores.get("Beam"));
        System.out.println(scores.size());
    }
}
```

```output
85
false
75
2
```

- `HashMap<String, Integer>` ระบุชนิดของ key (`String`) และ value (`Integer`)
- `put(key, value)` เพิ่มคู่ใหม่ หรือเปลี่ยนค่า ถ้า key นี้มีอยู่แล้ว
- `get(key)` ดึงค่า (ถ้าไม่มี key นั้นจะได้ `null`)
- `containsKey(key)` ตรวจว่ามี key นี้ไหม

> 📝 **ลำดับของข้อมูลใน `HashMap` ไม่รับประกัน** อย่าคาดหวังว่าวนลูปแล้วจะได้ตามลำดับที่ `put` ไว้ HashMap ออกแบบมาเพื่อ "ค้นหาเร็ว" ไม่ใช่ "เรียงลำดับ"

## ข้อผิดพลาดที่เจอบ่อย

**1. `IndexOutOfBoundsException`** `get(i)` ที่ i ไม่มีอยู่ (เหมือน array แต่ชื่อ error ต่างกัน)

```java expect=error
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        System.out.println(list.get(3));
    }
}
```

```error
Exception in thread "main" java.lang.IndexOutOfBoundsException: Index 3 out of bounds for length 3
```

**2. ใช้ชนิดพื้นฐานใน generics** `ArrayList<int>` ใช้ไม่ได้ ต้องใช้ `ArrayList<Integer>`

```java expect=compile-error
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<int> nums = new ArrayList<>();
    }
}
```

จะได้ error `unexpected type ... required: reference, found: int` (แปลว่า generics ต้องการคลาส ไม่ใช่ชนิดพื้นฐาน)

**3. ลบสมาชิกระหว่าง `for-each`** เป็นการแก้ list ขณะที่กำลังไล่อ่านมันอยู่ จะเกิด `ConcurrentModificationException` วิธีที่ปลอดภัยคือใช้ `for` ธรรมดาที่ **วนจากท้ายมาหน้า**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("A");
        list.add("C");

        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i).equals("A")) {
                list.remove(i);
            }
        }
        System.out.println(list);
    }
}
```

```output
[B, C]
```

ที่วนจากท้ายมาหน้าก็เพราะ เวลาลบสมาชิกตัวหนึ่ง ตัวที่อยู่ข้างหลังจะขยับมาแทนที่ ถ้าวนจากหน้าไปหลังจะข้ามสมาชิกบางตัวไป แต่ถ้าวนจากท้าย ตำแหน่งที่ยังไม่ได้ตรวจจะไม่ถูกกระทบ

**4. ใช้ `.length` กับ ArrayList** array ใช้ `.length` (ไม่มีวงเล็บ) แต่ ArrayList ใช้ `.size()` (มีวงเล็บ)

## 🧪 ลองทำดู

> 🧪 **โจทย์ฝึกมือ (ไม่นับคะแนน)**
>
> 1. อ่านคำ N คำ (`next()` N ครั้ง) เก็บเข้า `ArrayList<String>` แล้วพิมพ์ **ย้อนกลับ** จากคำสุดท้ายไปคำแรก
> 2. อ่านตัวเลขจนกว่าจะเจอ `0` (ใช้ `while`) เก็บเข้า ArrayList ที่ไม่ใช่ 0 แล้วพิมพ์ผลรวม ค่ามากสุด และค่าน้อยสุด
> 3. ลบตัวเลขที่ซ้ำออกจาก list (คำใบ้: ใช้ `contains()` ตรวจก่อน `add()` เข้า list ใหม่)
> 4. ใช้ `HashMap<String, Integer>` นับว่าแต่ละคำปรากฏกี่ครั้ง (คำใบ้: ถ้า `containsKey` ให้ `put(word, get(word) + 1)` ไม่งั้น `put(word, 1)`)

## สรุปบทที่ 9

| เรื่อง | สิ่งที่ต้องจำ |
|---|---|
| `ArrayList` | array ที่ยืดหดได้ ต้อง `import java.util.ArrayList;` |
| generics | `ArrayList<String>` ระบุชนิดข้อมูลที่เก็บ |
| wrapper | ตัวเลขใช้ `Integer`, `Double` (ไม่ใช่ `int`, `double`) |
| เมธอดหลัก | `add`, `get`, `set`, `remove`, `size`, `contains`, `indexOf`, `isEmpty`, `clear` |
| `remove` | `remove(int)` ลบตามตำแหน่ง, ลบ "ค่า" ของ `Integer` ใช้ `remove(Integer.valueOf(x))` |
| ลบตอนวนลูป | ห้ามใช้ for-each ให้วนจากท้ายมาหน้า |
| `Collections` | `sort`, `reverse`, `max`, `min` |
| `HashMap` | เก็บคู่ key → value: `put`, `get`, `containsKey` ลำดับไม่รับประกัน |

🎉 **ยินดีด้วย!** คุณเรียนจบครบทั้ง 9 บทแล้ว ตอนนี้คุณมีพื้นฐานของ Java ที่แน่นพอจะเรียนต่อ (เช่น interface, exception handling, file I/O, หรือเริ่มทำโปรเจกต์เล็กๆ ของตัวเอง) ลองกลับไปที่หน้า Playground แล้วเขียนโปรแกรมที่คุณสนใจดูนะ

ถัดไปคือแบบฝึกหัดสุดท้าย: รวมเลขคู่ใน ArrayList
