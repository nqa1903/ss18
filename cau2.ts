function timingDecorator(target:any , propertyKey:string , descriptor:PropertyDescriptor){
    const originalMethod = descriptor.value;
    descriptor.value = function(...args : any[]){
        const start = Date.now();
        console.log(propertyKey);
        console.log(args);
        const result = originalMethod.apply(this, args);
        const end = Date.now();
        const executionTime = end - start;
        console.log(executionTime);
        console.log(result);
        return result;
    }
    return descriptor;
}

class Example1 {
    @timingDecorator
    add(a:number , b:number):number{
        const delay = Math.random() * 1000;
        const startTime =  Date.now();
        while(Date.now() - startTime < delay){}
        return a + b;
    }
}

const example1 = new Example1();
console.log(example1.add(5,6));
