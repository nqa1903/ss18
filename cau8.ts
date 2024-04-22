type CacheKey = string | number;

interface Cache {
    get(key: CacheKey): any | undefined;
    set(key: CacheKey, value: any): void;
}

class SimpleCache implements Cache {
    private cache: Map<CacheKey, any> = new Map();

    get(key: CacheKey): any | undefined {
        return this.cache.get(key);
    }

    set(key: CacheKey, value: any): void {
        this.cache.set(key, value);
    }
}

function caching(cache: Cache, condition: (args: any[]) => boolean = () => true): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const cacheKey = propertyKey.toString() + JSON.stringify(args);
            if (cache.get(cacheKey) !== undefined && condition(args)) {
                return cache.get(cacheKey);
            }

            const result = originalMethod.apply(this, args);
            cache.set(cacheKey, result);
            return result;
        };
    };
}

const cache = new SimpleCache();

class Example {
    @caching(cache, (args) => args[0] > 5)
    calculate(num: number): number {
        console.log("Calculating...");
        return num * 2;
    }
}

const example = new Example();
console.log(example.calculate(5)); 
console.log(example.calculate(5)); 
console.log(example.calculate(10)); 
console.log(example.calculate(10)); 
