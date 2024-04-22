function typeCheck(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);

        if (paramTypes.length !== args.length) {
            throw new Error(`Incorrect number of arguments for method ${propertyKey}`);
        }

        for (let i = 0; i < paramTypes.length; i++) {
            if (typeof args[i] !== paramTypes[i].name.toLowerCase()) {
                throw new Error(`Argument ${i + 1} of method ${propertyKey} has incorrect type`);
            }
        }

        return originalMethod.apply(this, args);
    };

    return descriptor;
}

function type(target: any, key: string | symbol, index: number) {
    const types = Reflect.getMetadata("design:paramtypes", target, key) || [];
    types[index] = Reflect.getMetadata("design:type", target, key);
    Reflect.defineMetadata("design:paramtypes", types, target, key);
}

class Example {
    @typeCheck
    processNumbers(@type number1: number, @type number2: number): number {
        return number1 + number2;
    }
}

const example = new Example();
console.log(example.processNumbers(5, 10)); 
console.log(example.processNumbers("5", 10)); 
console.log(example.processNumbers(5, "10"));