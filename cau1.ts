function decorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {    
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        console.log(propertyKey);
        console.log(args);
        return originalMethod.apply(this, args);
    };

    return descriptor;
}

class Example {
    @decorator
    add(a: number, b: number): number {
        return a + b;
    }
}

const example = new Example();
console.log(example.add(3, 4));
