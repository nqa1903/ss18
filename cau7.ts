type Middleware<T> = (input: T) => T;

class MiddlewareManager {
    private middlewares: Middleware<any>[] = [];

    use(middleware: Middleware<any>): void {
        this.middlewares.push(middleware);
    }

    applyMiddlewares(target: Function, methodName: string): void {
        const originalMethod = target[methodName];

        target[methodName] = function (...args: any[]) {
            let result = originalMethod.apply(this, args);
            for (const middleware of this.middlewares) {
                result = middleware(result);
            }
            return result;
        };
    }
}

const middlewareManager = new MiddlewareManager();

function loggerMiddleware(input: number): number {
    console.log(`Logging input: ${input}`);
    return input;
}

function doubleMiddleware(input: number): number {
    return input * 2;
}

class Example {
    @middlewareManager.use(loggerMiddleware)
    @middlewareManager.use(doubleMiddleware)
    calculate(num: number): number {
        return num + 1;
    }
}

middlewareManager.applyMiddlewares(Example.prototype, "calculate");

const example = new Example();
const result = example.calculate(5); 
console.log(result);
