type ValidationFunction<T extends any[]> = (...args: T) => boolean;

function parameterValidator<T extends any[]>(validationFunc: ValidationFunction<T>): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: T) {
            if (validationFunc(...args)) {
                return originalMethod.apply(this, args);
            } else {
                throw new Error("Invalid parameters passed to function");
            }
        };

        return descriptor;
    };
}

function checkPositive(...args: number[]): boolean {
    return args.every(arg => arg > 0);
}

class Calculator {
    @parameterValidator(checkPositive)
    divide(a: number, b: number): number {
        return a / b;
    }
}

const calculator = new Calculator();

try {
    const result = calculator.divide(10, 2);
    console.log("Result of division:", result);
} catch (error) {
    console.error("Error:", error.message);
}

try {
    const result = calculator.divide(10, 0);
    console.log("Result of division:", result);
} catch (error) {
    console.error("Error:", error.message);
}
