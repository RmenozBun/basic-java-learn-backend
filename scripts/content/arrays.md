## ในบทนี้คุณจะได้เรียนอะไร

หลังจบบทนี้ คุณจะ

- เข้าใจว่า **array** คืออะไร และแก้ปัญหาอะไร
- สร้าง array ได้ 2 แบบ เข้าถึงและแก้ไขสมาชิกด้วย **index**
- วนลูปผ่าน array ด้วย `for` และ `for-each`
- เขียนอัลกอริทึมพื้นฐาน: หาผลรวม ค่าเฉลี่ย ค่ามากที่สุด นับ และค้นหา
- อ่านข้อมูลหลายค่าจาก Scanner เข้า array
- รู้จัก `Arrays.toString` กับ `Arrays.sort` และเข้าใจ `ArrayIndexOutOfBoundsException`

> 📝 **ใช้เวลาประมาณ 30 นาที** บทนี้เอาทั้งลูปและเงื่อนไขมารวมกัน ถ้าบทที่ผ่านมายังไม่แน่น แนะนำให้กลับไปทวนก่อนจะเข้าใจง่ายขึ้นมาก

## ปัญหา: ข้อมูลหลายตัวที่เป็นกลุ่มเดียวกัน

สมมติต้องเก็บคะแนนของนักเรียน 5 คน ด้วยความรู้ที่มีตอนนี้ต้องสร้างตัวแปร `score1`, `score2`, `score3`, `score4`, `score5` แล้วถ้าเป็น 500 คนล่ะ? ทั้งเขียนยาก และวนลูปก็ไม่ได้เพราะแต่ละตัวมีชื่อต่างกัน

**Array (อาร์เรย์)** คือ **กลุ่มของตัวแปรชนิดเดียวกัน เรียงต่อกันเป็นแถว ใช้ชื่อเดียว** แต่ละช่องมีเลขลำดับที่เรียกว่า **index** และ **index เริ่มนับที่ 0** (ไม่ใช่ 1!)

```diagram
index:      0     1     2     3     4
         +-----+-----+-----+-----+-----+
scores   | 80  | 65  | 90  | 72  | 55  |
         +-----+-----+-----+-----+-----+
```

array ที่มี 5 ช่องจะมี index 0, 1, 2, 3, 4 **ช่องสุดท้ายคือ index 4 ไม่ใช่ 5** (จำให้ขึ้นใจ เพราะเป็นที่มาของบั๊กที่พบบ่อยที่สุดของ array)

## สร้างและใช้งาน array

วิธีที่ 1 **ระบุค่าตั้งต้นเลย** ใช้ปีกกาล้อมค่า คั่นด้วยจุลภาค

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = {80, 65, 90, 72, 55};

        System.out.println(scores[0]);      // ช่องแรก
        System.out.println(scores[4]);      // ช่องสุดท้าย
        System.out.println(scores.length);  // จำนวนช่องทั้งหมด

        scores[1] = 70;                      // แก้ค่าช่องที่ 1
        System.out.println(scores[1]);
    }
}
```

```output
80
55
5
70
```

- `int[]` แปลว่า "array ของ int" (ใช้ชนิดอื่นก็ได้ เช่น `String[]`, `double[]`)
- `scores[2]` คือการเข้าถึงช่อง index 2 ใช้ได้ทั้ง **อ่านค่า** และ **เขียนค่า**
- `scores.length` บอกจำนวนช่อง **ไม่มีวงเล็บ** ต่างจาก `.length()` ของ String ซึ่งมี (ความต่างที่มือใหม่สับสนบ่อย)

วิธีที่ 2 **จองจำนวนช่องก่อน** แล้วค่อยใส่ค่าทีหลัง ด้วย `new ชนิด[จำนวน]` ช่องที่ยังไม่ใส่ค่าจะมี **ค่าเริ่มต้น** ตามชนิดข้อมูลให้อัตโนมัติ

```java
public class Main {
    public static void main(String[] args) {
        int[] nums = new int[3];
        System.out.println(nums[0]);
        nums[0] = 7;
        nums[2] = 9;
        System.out.println(nums[0] + " " + nums[1] + " " + nums[2]);

        String[] names = new String[2];
        System.out.println(names[0]);

        double[] prices = new double[2];
        System.out.println(prices[1]);

        boolean[] flags = new boolean[1];
        System.out.println(flags[0]);
    }
}
```

```output
0
7 0 9
null
0.0
false
```

| ชนิด | ค่าเริ่มต้นของแต่ละช่อง |
|---|---|
| `int` | `0` |
| `double` | `0.0` |
| `boolean` | `false` |
| `String` (และ object อื่นๆ) | `null` (แปลว่า "ยังไม่มีอะไร") |

> 📝 **ขนาดของ array กำหนดแล้วเปลี่ยนไม่ได้** ถ้าต้องการให้ขยายได้ ต้องใช้ `ArrayList` ซึ่งจะเรียนในบทสุดท้าย

## วนลูปผ่าน array

array กับลูปเป็นคู่หูกัน เพราะ index เป็นตัวเลขเรียงกันตั้งแต่ 0 ถึง `length - 1` เราจึงใช้ตัวนับของ `for` เป็น index ได้เลย

```java
public class Main {
    public static void main(String[] args) {
        String[] fruits = {"apple", "banana", "cherry"};

        // แบบที่ 1: for ธรรมดา รู้ตำแหน่ง (index) ด้วย
        for (int i = 0; i < fruits.length; i++) {
            System.out.println(i + ": " + fruits[i]);
        }

        // แบบที่ 2: for-each อ่านง่ายกว่า เมื่อไม่ต้องใช้ตำแหน่ง
        for (String f : fruits) {
            System.out.println("I like " + f);
        }
    }
}
```

```output
0: apple
1: banana
2: cherry
I like apple
I like banana
I like cherry
```

`for (String f : fruits)` อ่านว่า "สำหรับ f แต่ละตัวใน fruits" ตัวแปร `f` จะเป็นสมาชิกตัวถัดไปทุกรอบ สะดวกมากถ้าแค่อยากอ่านค่าทีละตัว แต่ถ้าต้องการรู้ตำแหน่ง หรือต้องการแก้ค่าในช่อง ให้ใช้ `for` แบบมี index

> 💡 **สังเกตเงื่อนไข `i < fruits.length`:** ใช้ `<` ไม่ใช่ `<=` เพราะ index ตัวสุดท้ายคือ `length - 1` รูปแบบ `for (int i = 0; i < arr.length; i++)` คือ "ท่าพื้นฐาน" ที่ต้องจำ

## อัลกอริทึมพื้นฐานกับ array

ต่อไปคือสูตรที่ใช้บ่อยมากๆ ทุกสูตรคือ **ลูป + accumulator** จากบทที่แล้ว

### หาผลรวมและค่าเฉลี่ย

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = {80, 65, 90, 72, 55};

        int sum = 0;
        for (int s : scores) {
            sum += s;
        }
        double average = (double) sum / scores.length;

        System.out.println("Sum = " + sum);
        System.out.println("Average = " + average);
    }
}
```

```output
Sum = 362
Average = 72.4
```

สังเกต `(double) sum` ที่แปลงเป็นทศนิยมก่อนหาร เพื่อไม่ให้ตกกับดักการหารจำนวนเต็มจากบทที่ 2 (ถ้าไม่แปลง จะได้ 72 แทน 72.4)

### หาค่ามากที่สุด (Maximum)

แนวคิดคือ **สมมติว่าตัวแรกมากที่สุดไปก่อน** แล้วไล่ดูตัวที่เหลือ ถ้าเจอตัวที่มากกว่า ก็อัปเดตค่าที่จำไว้

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = {80, 65, 90, 72, 55};

        int max = scores[0];                       // สมมติตัวแรกมากสุดไว้ก่อน
        for (int i = 1; i < scores.length; i++) {  // ไล่ตั้งแต่ตัวที่สอง
            if (scores[i] > max) {
                max = scores[i];                   // เจอตัวที่ใหญ่กว่า จำค่าใหม่
            }
        }
        System.out.println("Max = " + max);
    }
}
```

```output
Max = 90
```

| i | `scores[i]` | `scores[i] > max`? | `max` หลังรอบนี้ |
|---|---|---|---|
| (เริ่ม) | | | 80 |
| 1 | 65 | 65 > 80 เท็จ | 80 |
| 2 | 90 | 90 > 80 **จริง** | **90** |
| 3 | 72 | 72 > 90 เท็จ | 90 |
| 4 | 55 | 55 > 90 เท็จ | 90 |

> 💡 **ทำไมเริ่ม `max` ที่ `scores[0]` ไม่ใช่ `0`?** ถ้าทุกค่าเป็นเลขติดลบ (เช่น -5, -2, -9) เมื่อตั้ง `max = 0` คำตอบจะเป็น 0 ซึ่งผิด เพราะ 0 ไม่ได้อยู่ใน array เลย เริ่มจากสมาชิกตัวแรกจึงปลอดภัยที่สุด สูตรหาค่าน้อยสุด (minimum) ก็เหมือนกัน แค่เปลี่ยน `>` เป็น `<`

### นับและค้นหา

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = {80, 65, 90, 72, 55};

        // นับจำนวนคนที่ได้ตั้งแต่ 70 ขึ้นไป
        int count = 0;
        for (int s : scores) {
            if (s >= 70) {
                count++;
            }
        }
        System.out.println("Scores >= 70: " + count);

        // ค้นหาว่า 90 อยู่ index ไหน (-1 แปลว่าไม่เจอ)
        int target = 90;
        int found = -1;
        for (int i = 0; i < scores.length; i++) {
            if (scores[i] == target) {
                found = i;
                break;          // เจอแล้วไม่ต้องหาต่อ
            }
        }
        System.out.println("Found at index " + found);
    }
}
```

```output
Scores >= 70: 3
Found at index 2
```

## อ่านข้อมูลหลายค่าจาก Scanner เข้า array

รูปแบบมาตรฐาน: อ่านจำนวนข้อมูลก่อน สร้าง array ขนาดเท่านั้น แล้ววนลูปอ่านเข้าทีละช่อง

```java stdin=3%0A10%0A20%0A30
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();              // จำนวนข้อมูล
        int[] data = new int[n];           // จองจำนวนช่องตามที่อ่านมา

        for (int i = 0; i < n; i++) {
            data[i] = sc.nextInt();        // อ่านเข้าช่อง i
        }

        int total = 0;
        for (int v : data) {
            total += v;
        }
        System.out.println("Total = " + total);
    }
}
```

```output
Total = 60
```

ข้อมูลที่ป้อนมี 4 บรรทัด คือ `3` (จำนวน) ตามด้วย `10`, `20`, `30` แต่ละบรรทัดถูกอ่านด้วย `nextInt()` ตามลำดับ

## เครื่องมือช่วย: `Arrays.toString` และ `Arrays.sort`

ถ้าสั่ง `System.out.println(arr)` ตรงๆ จะได้ข้อความประหลาดอย่าง `[I@1b6d3586` (ที่อยู่ในหน่วยความจำ ไม่ใช่ค่าข้างใน) ให้ใช้ `Arrays.toString(arr)` แทน และ `Arrays.sort(arr)` เรียงจากน้อยไปมาก ทั้งสองต้อง `import java.util.Arrays;`

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1};
        System.out.println(Arrays.toString(a));
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));
    }
}
```

```output
[5, 2, 9, 1]
[1, 2, 5, 9]
```

## ข้อผิดพลาดที่เจอบ่อย

**1. `ArrayIndexOutOfBoundsException`** คือเข้าถึง index ที่ไม่มีอยู่ เช่น array มี 3 ช่อง (index 0-2) แต่ไปอ่าน index 3 นี่เป็น error ที่เกิดตอน *รันโปรแกรม* (ไม่ใช่ตอนคอมไพล์) ลองรันดู

```java expect=error
public class Main {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        System.out.println(a[3]);
    }
}
```

```error
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
```

ข้อความ error บอกชัดเจนว่า "index 3 อยู่นอกขอบเขต สำหรับ array ที่มีความยาว 3" แก้โดยตรวจว่าเงื่อนไขลูปเป็น `i < a.length` ไม่ใช่ `<=`

**2. ลืมว่า index เริ่มที่ 0** ทำให้คิดว่าช่องสุดท้ายคือ `arr[arr.length]` ที่ถูกคือ `arr[arr.length - 1]`

**3. จำนวนช่องไม่พอ** จองไว้ `new int[5]` แต่ใส่ข้อมูล 6 ตัว ให้ใช้ `new int[n]` ตามจำนวนข้อมูลจริง

**4. พิมพ์ array ตรงๆ** ได้ข้อความประหลาด ให้ใช้ `Arrays.toString()`

## 🧪 ลองทำดู

> 🧪 **โจทย์ฝึกมือ (ไม่นับคะแนน)**
>
> 1. อ่านตัวเลข 5 ตัวเข้า array แล้วพิมพ์ **ย้อนกลับ** จากตัวสุดท้ายไปตัวแรก (คำใบ้: ลูปที่ i เริ่มจาก `length - 1` ลดลงถึง 0)
> 2. นับว่าใน array มีเลขคู่กี่ตัว
> 3. หาค่า **น้อยที่สุด** และตำแหน่ง (index) ของมัน
> 4. ถ้า array มีตัวเลข 5 ตัว ให้พิมพ์ผลต่างระหว่างค่ามากที่สุดกับน้อยที่สุด

## สรุปบทที่ 5

| เรื่อง | สิ่งที่ต้องจำ |
|---|---|
| array | กลุ่มตัวแปรชนิดเดียวกัน ชื่อเดียว เรียงเป็นแถว ขนาดคงที่ |
| index | เริ่มที่ **0** ช่องสุดท้ายคือ `length - 1` |
| สร้าง | `int[] a = {1, 2, 3};` หรือ `int[] a = new int[5];` |
| ขนาด | `a.length` (ไม่มีวงเล็บ) |
| วนลูป | `for (int i = 0; i < a.length; i++)` หรือ `for (int x : a)` |
| หาค่ามากสุด | เริ่ม `max = a[0]` แล้วไล่เทียบตัวที่เหลือ |
| พิมพ์ทั้ง array | `Arrays.toString(a)` และเรียงด้วย `Arrays.sort(a)` |
| error ที่พบบ่อย | `ArrayIndexOutOfBoundsException` ตรวจเงื่อนไขลูป `<` vs `<=` |

ถัดไปลองทำแบบฝึกหัดหาค่ามากที่สุดใน array ได้เลย ใช้สูตรที่เพิ่งเรียนเมื่อกี้
