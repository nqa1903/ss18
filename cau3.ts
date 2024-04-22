function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache: { [key: string]: any } = {};

    descriptor.value = function(...args: any[]) {
        const key = JSON.stringify(args);
        
        if (cache.hasOwnProperty(key)) {
            console.log(`Lấy kết quả từ cache cho tham số: ${key}`);
            return cache[key];
        }

        const result = originalMethod.apply(this, args);
        console.log(`Lưu kết quả vào cache cho tham số: ${key}`);
        cache[key] = result;
        return result;
    };

    return descriptor;
}

// Sử dụng decorator để caching kết quả của hàm add
class Example2 {
    @memoize
    add(a: number, b: number): number {
        return a + b;
    }
}

const example2 = new Example2();

// Gọi hàm add lần đầu tiên
console.log(example2.add(3, 4)); // Kết quả: 7, tính toán

// Gọi hàm add với cùng các tham số, kết quả sẽ được lấy từ cache
console.log(example2.add(3, 4)); // Kết quả: 7, lấy từ cache

// Gọi hàm add với các tham số khác, kết quả sẽ được tính toán lại
console.log(example2.add(4, 5)); // Kết quả: 9, tính toán
