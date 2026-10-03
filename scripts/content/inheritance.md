## ในบทนี้คุณจะได้เรียนอะไร

หลังจบบทนี้ คุณจะ

- เข้าใจแนวคิด **การสืบทอด (inheritance)** และความสัมพันธ์แบบ "is-a"
- สร้างคลาสลูกด้วย `extends` และเรียก constructor แม่ด้วย `super(...)`
- **override** เมธอดของคลาสแม่ด้วย `@Override` และเรียกเวอร์ชันแม่ด้วย `super.method()`
- เข้าใจ **polymorphism** (ตัวแปรชนิดแม่ ชี้ไปที่ object ลูกได้)
- รู้ลำดับการทำงานของ constructor และข้อผิดพลาดที่พบบ่อย

> 📝 **ใช้เวลาประมาณ 35 นาที** บทนี้ต่อยอดจากบท OOP โดยตรง ถ้ายังไม่คล่องเรื่อง class, constructor และ `this` แนะนำให้ทวนบทที่แล้วก่อน

## ทำไมต้องมีการสืบทอด

ลองคิดถึงสัตว์หลายชนิด หมาและแมวต่างก็มีชื่อ กินอาหารได้ ส่งเสียงได้ ถ้าเขียนคลาส `Dog` กับ `Cat` แยกกัน เราต้องเขียนโค้ด "ชื่อ + กินอาหาร" **ซ้ำสองรอบ** ถ้ามีสัตว์ 20 ชนิดก็ซ้ำ 20 รอบ และถ้าอยากแก้วิธีกินอาหาร ก็ต้องแก้ 20 ที่

**Inheritance (การสืบทอด)** แก้ปัญหานี้ด้วยการเขียนส่วนที่เหมือนกันไว้ใน **คลาสแม่ (superclass / parent)** ครั้งเดียว แล้วให้ **คลาสลูก (subclass / child)** "รับสืบทอด" ทุกอย่างไปใช้ได้เลย คลาสลูกเพิ่มความสามารถของตัวเอง หรือปรับเปลี่ยนพฤติกรรมบางอย่างได้

```diagram
          Animal   (name, eat(), speak())
          /    \
        Dog    Cat      <-- ลูกได้ name, eat(), speak() ไปทั้งหมด
     (fetch)  (climb)       แล้วเพิ่มสิ่งที่เป็นของตัวเอง
```

ความสัมพันธ์ที่เหมาะกับการสืบทอดต้องอ่านแล้วได้ความว่า **"A คือ (is-a) B"** เช่น หมา **คือ** สัตว์ ✅ แต่ รถ **คือ** เครื่องยนต์ ❌ (รถ *มี* เครื่องยนต์ ซึ่งเป็นความสัมพันธ์แบบ has-a ที่ใช้ field แทน)

## `extends`: สร้างคลาสลูก

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void eat() {
        System.out.println(name + " is eating");
    }

    String speak() {
        return name + " makes a sound";
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);           // เรียก constructor ของคลาสแม่
    }

    @Override
    String speak() {           // เขียนทับ speak() ของแม่
        return name + " barks";
    }

    void fetch() {             // ความสามารถใหม่ที่มีเฉพาะ Dog
        System.out.println(name + " fetches the ball");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Animal("Generic");
        Dog d = new Dog("Rex");

        System.out.println(a.speak());
        System.out.println(d.speak());
        d.eat();
        d.fetch();
    }
}
```

```output
Generic makes a sound
Rex barks
Rex is eating
Rex fetches the ball
```

### อธิบายทีละส่วน

- **`class Dog extends Animal`** แปลว่า "Dog สืบทอดจาก Animal" Dog จึงมี field `name` และเมธอด `eat()` โดยไม่ต้องเขียนซ้ำ (สังเกตว่า `d.eat()` ใช้ได้ทั้งที่ใน Dog ไม่มีเมธอด `eat`)
- **`super(name)`** คือการเรียก constructor ของคลาสแม่ เพื่อให้แม่ตั้งค่า `name` ให้ ต้องเขียนเป็น **บรรทัดแรก** ใน constructor ของลูกเสมอ
- **`@Override`** คือป้ายบอกว่า "ฉันตั้งใจเขียนทับเมธอดของแม่" ลูกเขียนเมธอดชื่อและพารามิเตอร์เดียวกับแม่ แต่ใส่พฤติกรรมของตัวเอง เมื่อสั่ง `d.speak()` Java จึงเลือกเวอร์ชันของ `Dog` (ได้ "Rex barks")
- **`fetch()`** เป็นความสามารถใหม่ ที่มีเฉพาะ `Dog` ส่วน `Animal` ทั่วไปไม่มี

> 💡 **ทำไมต้องเขียน `@Override`?** ไม่เขียนก็ทำงานได้ แต่ป้ายนี้ช่วยเรามากเพราะถ้าเราพิมพ์ชื่อเมธอดผิด (เช่น `speek`) Java จะฟ้อง error ให้ทันทีว่า "ไม่ได้ override อะไรเลย" ถ้าไม่มีป้ายนี้ มันจะกลายเป็นเมธอดใหม่เงียบๆ แล้วเรางงว่าทำไมไม่ทำงาน

## ลำดับการทำงานของ constructor

เมื่อสร้าง object ของคลาสลูก **constructor ของแม่จะทำงานก่อนเสมอ** แล้วจึงถึง constructor ของลูก เพราะต้องสร้างส่วนที่เป็นแม่ให้เสร็จก่อนจึงจะต่อเติมส่วนของลูกได้

```java
class Parent {
    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    Child() {
        System.out.println("Child constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        new Child();
    }
}
```

```output
Parent constructor
Child constructor
```

ในตัวอย่างนี้เราไม่ได้เขียน `super()` เลย แต่ Java แอบใส่ `super();` ให้เองที่บรรทัดแรกของ constructor ลูก (เฉพาะกรณีที่แม่มี constructor ที่ไม่รับพารามิเตอร์) ดังนั้นลำดับจึงเป็นแม่ก่อนลูก

## เรียกเวอร์ชันของแม่ด้วย `super.method()`

บางครั้งเราไม่ได้อยากเขียนทับทั้งหมด แต่อยากให้ "ทำตามแม่ แล้วเพิ่มของเรา" ใช้ `super.ชื่อเมธอด()` เรียกเวอร์ชันของแม่ได้

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    String speak() {
        return name + " makes a sound";
    }
}

class Cat extends Animal {
    Cat(String name) {
        super(name);
    }

    @Override
    String speak() {
        return super.speak() + " (meow)";
    }
}

public class Main {
    public static void main(String[] args) {
        Cat c = new Cat("Tom");
        System.out.println(c.speak());
    }
}
```

```output
Tom makes a sound (meow)
```

## Polymorphism: ตัวแปรชนิดแม่ ชี้ไปที่ object ลูกได้

เนื่องจาก "หมาคือสัตว์" เราจึงเก็บ `Dog` ไว้ในตัวแปรชนิด `Animal` ได้ และเมื่อเรียก `speak()` **Java จะเลือกเวอร์ชันของ object ตัวจริงให้เอง** ณ ตอนรัน นี่เรียกว่า **polymorphism (พหุสัณฐาน แปลว่า "หลายรูปแบบ")** ทำให้จัดการ object ต่างชนิดเป็นกลุ่มเดียวกันได้

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    String speak() {
        return name + " makes a sound";
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }

    @Override
    String speak() {
        return name + " barks";
    }
}

class Cat extends Animal {
    Cat(String name) {
        super(name);
    }

    @Override
    String speak() {
        return super.speak() + " (meow)";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] zoo = {
            new Dog("Rex"),
            new Cat("Tom"),
            new Animal("Thing")
        };

        for (Animal a : zoo) {
            System.out.println(a.speak());
        }
    }
}
```

```output
Rex barks
Tom makes a sound (meow)
Thing makes a sound
```

ลูปเดียวสั่ง `a.speak()` กับสัตว์ทุกตัว โดยไม่ต้องรู้ว่าแต่ละตัวเป็นชนิดไหน และแต่ละตัวตอบสนองตามแบบของตัวเอง ถ้าวันหน้าเพิ่ม `Bird` เข้ามา ลูปนี้ไม่ต้องแก้เลย

> 📝 **ข้อจำกัดที่ต้องรู้:** ตัวแปรชนิด `Animal` จะ "เห็น" เฉพาะสิ่งที่ `Animal` มีเท่านั้น ดังนั้น `a.fetch()` จะ error ถึงแม้ object จริงจะเป็น `Dog` ก็ตาม เพราะ `Animal` ไม่มีเมธอด `fetch`

## ข้อผิดพลาดที่เจอบ่อย

**1. คลาสแม่ไม่มี constructor ว่าง แต่คลาสลูกลืมเรียก `super(...)`** Java จะพยายามแอบเรียก `super()` ที่ไม่มีพารามิเตอร์ แล้วหาไม่เจอ

```java expect=compile-error
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }
}

class Dog extends Animal {
    Dog(String name) {
        // ลืมเรียก super(name)
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("Rex");
    }
}
```

จะได้ error ประมาณ `constructor Animal in class Animal cannot be applied to given types` แก้โดยเติม `super(name);` ที่บรรทัดแรกของ constructor ลูก

**2. พิมพ์ชื่อเมธอดผิดตอน override** ถ้าใส่ `@Override` ไว้ Java จะช่วยจับให้

```java expect=compile-error
class Animal {
    String speak() {
        return "sound";
    }
}

class Dog extends Animal {
    @Override
    String speek() {          // พิมพ์ผิด ไม่ตรงกับเมธอดของแม่
        return "woof";
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Dog().speak());
    }
}
```

จะได้ `method does not override or implement a method from a supertype` ตรงนี้แหละที่ `@Override` ช่วยชีวิตเรา

**3. ใช้การสืบทอดผิดที่** ถ้าอ่านแล้วไม่เป็นประโยค "A คือ B" อย่าใช้ `extends` เช่น `Car extends Engine` ผิดความหมาย ควรให้ `Car` มี field ชนิด `Engine` แทน

**4. เรียกเมธอดของลูกผ่านตัวแปรชนิดแม่** ดูหัวข้อ polymorphism ด้านบน

## 🧪 ลองทำดู

> 🧪 **โจทย์ฝึกมือ (ไม่นับคะแนน)**
>
> 1. สร้างคลาส `Vehicle` มี field `brand` และเมธอด `info()` แล้วสร้าง `Car` กับ `Bike` ที่สืบทอดมา โดย override `info()` ให้พิมพ์ข้อความต่างกัน
> 2. สร้างคลาส `Employee` (ชื่อ, เงินเดือน, เมธอด `bonus()` ที่คืน 10% ของเงินเดือน) แล้วสร้าง `Manager` ที่ override `bonus()` ให้ได้ 20%
> 3. เก็บ `Employee` และ `Manager` ปนกันใน array เดียว แล้วลูปพิมพ์โบนัสของทุกคน สังเกตว่าลูปเดียวทำงานถูกกับทั้งสองชนิด
> 4. ลองสร้างคลาสลูกสามระดับ `A` → `B` → `C` แล้วดูลำดับการพิมพ์ของ constructor

## สรุปบทที่ 8

| เรื่อง | สิ่งที่ต้องจำ |
|---|---|
| inheritance | ลูกรับสืบทอด field และเมธอดจากแม่ ใช้ความสัมพันธ์ "is-a" |
| `extends` | `class Dog extends Animal` |
| `super(...)` | เรียก constructor แม่ ต้องเป็นบรรทัดแรกใน constructor ลูก |
| ลำดับ constructor | แม่ทำงานก่อน แล้วค่อยลูก |
| override | ลูกเขียนเมธอดชื่อ/พารามิเตอร์เดียวกับแม่เพื่อเปลี่ยนพฤติกรรม ใส่ `@Override` เสมอ |
| `super.method()` | เรียกเวอร์ชันของแม่จากในลูก |
| polymorphism | ตัวแปรชนิดแม่ชี้ object ลูกได้ และ Java เลือกเมธอดของ object จริงตอนรัน |
| ข้อจำกัด | ตัวแปรชนิดแม่เห็นเฉพาะสิ่งที่แม่มี |

ถัดไปลองทำแบบฝึกหัดสืบทอดคลาส Shape ได้เลย
