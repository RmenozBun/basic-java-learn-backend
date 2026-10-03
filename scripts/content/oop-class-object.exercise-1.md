## prompt

คลาส `Rectangle` (สี่เหลี่ยมผืนผ้า) มี field `width` กับ `height` และ constructor เขียนไว้ให้แล้ว หน้าที่ของคุณคือเติมเมธอด **`area()`** ให้คืนค่า **พื้นที่** (กว้าง x ยาว)

โค้ดใน `main` อ่านค่า `width` และ `height` (คนละบรรทัด) สร้าง object แล้วพิมพ์ `r.area()` ไว้ให้เรียบร้อย

**ตัวอย่าง**

| Input (คนละบรรทัด) | ผลลัพธ์ที่ต้องได้ |
|---|---|
| `3` `4` | `12` |
| `5` `6` | `30` |

## hint

ในเมธอด `area()` ให้เปลี่ยน `return 0;` เป็น `return width * height;` เมธอดในคลาสเข้าถึง field ของ object ตัวเองได้ตรงๆ ไม่ต้องรับพารามิเตอร์

## explanation

```java run=no
int area() {
    return width * height;
}
```

- `area()` เป็นเมธอดของ `Rectangle` จึงใช้ field `width` และ `height` **ของ object ที่เรียกมันอยู่** ได้เลย
- เมื่อ `main` สั่ง `r.area()` Java จะใช้ค่า width/height ที่เก็บไว้ใน object `r` (ซึ่ง constructor ตั้งไว้ตอน `new Rectangle(w, h)`)
- ถ้าสร้าง `Rectangle` อีกอัน เช่น `r2` ที่ขนาดต่างกัน `r2.area()` ก็จะได้พื้นที่ของ `r2` เอง ไม่ปนกัน นี่คือหัวใจของ OOP: ข้อมูลและพฤติกรรมอยู่รวมกันใน object
- ชนิดที่คืนค่าเป็น `int` เพราะ width/height เป็น `int` และผลคูณของ int สองตัวก็เป็น `int`
