type Func<T> = (input: T) => T;

function chainFunctions<T>(...functions: Func<T>[]): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let result = originalMethod.apply(this, args);
            for (const func of functions) {
                result = func(result);
            }
            return result;
        };

        return descriptor;
    };
}

class Example {
    @chainFunctions<string>(str => str.trim(), str => str.toUpperCase())
    processString(str: string): string {
        return str + " ";
    }
}

const example = new Example();
const result = example.processString("   hello world   ");
console.log(result);
