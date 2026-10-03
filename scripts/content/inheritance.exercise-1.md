## prompt

คลาส `Shape` มีเมธอด `describe()` ที่คืนค่า `"This is a shape"` อยู่แล้ว ให้เติมในคลาส `Circle` (ซึ่ง `extends Shape`) โดย **override** เมธอด `describe()` ให้คืนค่า **`"This is a circle"`**

โค้ดใน `main` สร้าง `Circle` แล้วพิมพ์ `c.describe()` ไว้ให้เรียบร้อย ไม่มี input

**ผลลัพธ์ที่ต้องได้**

```output
This is a circle
```

## hint

ในคลาส `Circle` ให้เขียนเมธอดที่มีชื่อ ชนิดคืนค่า และพารามิเตอร์เหมือนของ `Shape` ทุกอย่าง โดยใส่ `@Override` นำหน้า:

`@Override String describe() { return "This is a circle"; }`

## explanation

```java run=no
static class Circle extends Shape {
    @Override
    String describe() {
        return "This is a circle";
    }
}
```

- `Circle extends Shape` ทำให้ `Circle` สืบทอดเมธอด `describe()` มาจาก `Shape` โดยอัตโนมัติ (ถ้าไม่ override จะได้ "This is a shape")
- การ **override** คือเขียนเมธอด **ชื่อและพารามิเตอร์เดียวกัน** ในคลาสลูก เพื่อเปลี่ยนพฤติกรรม
- `@Override` ไม่บังคับ แต่ช่วยให้ Java ตรวจให้ว่าเราเขียนทับเมธอดของแม่จริงๆ (ถ้าสะกดชื่อผิด จะ error ทันที)
- เมื่อ `c.describe()` ถูกเรียก Java เลือกเวอร์ชันของ `Circle` เพราะ object จริงๆ คือ `Circle`
- (ในโค้ดตั้งต้นคลาสเหล่านี้ใส่ `static` ไว้เพราะเขียนซ้อนอยู่ในคลาส `Main` ซึ่งเป็นแค่รูปแบบการเขียนในไฟล์เดียว ไม่ได้เปลี่ยนแนวคิดการสืบทอด)
