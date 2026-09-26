// Promise practice — from fundamentals to polyfills.
// Fill in each `// your implementation` / `// your code` spot, then check
// against the notes below it. Run with:  npx tsx src/problems/promises.ts

// ── 1. Make your own Promise from scratch (no Promise constructor) ──
// Create a promise that resolves with 42 after 500ms, and log it.
// your code:

// Answer:
// new Promise((resolve) => setTimeout(() => resolve(42), 500)).then((v) =>
//   console.log("1. resolved:", v),
// );

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 100);
});
const p1 = Promise.reject(1)
console.log(p2.then(val=>console.log(val,'kkkkk')),'kkk')
console.log("========== 2. chaining — each .then gets the PREVIOUS return value ==========");
Promise.resolve(1)
  .then((n) => n + 1)
  .then((n) => n * 10)
  .then((n) => console.log("2. chained result:", n));
// Your guess before running: ____________________
// Answer: 20  ->  (1+1)=2, then 2*10=20

console.log("========== 3. returning a promise INSIDE .then flattens it ==========");
function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
Promise.resolve("start")
  .then((v) => delay(v + "-A", 100)) // returning a promise here...
  .then((v) => console.log("3. flattened:", v)); // ...is auto-unwrapped, not nested
// Your guess: ____________________
// Answer: "3. flattened: start-A"  (NOT a Promise object — .then() automatically
// waits for and unwraps a promise returned from the previous .then)

console.log("========== 4. error propagation — .catch skips to the nearest handler ==========");
Promise.resolve()
  .then(() => {
    throw new Error("boom");
  })
  .then(() => console.log("4. this .then is SKIPPED"))
  .catch((err) => console.log("4. caught:", err.message))
  .then(() => console.log("4. this runs normally after catch"));
// Your guess: ____________________
// Answer: "4. caught: boom" then "4. this runs normally after catch"
// (the middle .then is skipped entirely once an error is thrown upstream)

// ── 5. Implement your own Promise.all ──
// myPromiseAll(promises) should resolve with an array of results IN THE
// SAME ORDER as the input, once ALL resolve. If ANY rejects, it should
// reject immediately with that reason.
function myPromiseAll(promises: Promise<any>[]): Promise<any[]> {
  // your implementation
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return resolve([]);
    const results: any[] = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = value;
          remaining--;
          if (remaining === 0) resolve(results);
        },
        (err) => reject(err),
      );
    });
  });
}

myPromiseAll([p1, delay("b", 100), delay("c", 200)]).then((r) =>
  console.log("5. myPromiseAll:", r), // ["a", "b", "c"] — order preserved
).catch(r=>console.log('rrrr',r));

// ── 6. Implement your own Promise.race ──
// Resolves/rejects with whichever input settles FIRST (win or lose).
function myPromiseRace(promises: Promise<any>[]): Promise<any> {
  // your implementation
  return new Promise((resolve, reject) => {
    promises.forEach((p) => Promise.resolve(p).then(resolve, reject));
  });
}

myPromiseRace([delay("slow", 300), delay("fast", 50)]).then((r) =>
  console.log("6. myPromiseRace:", r), // "fast"
);

// ── 7. Implement your own Promise.allSettled ──
// Never rejects — resolves with an array of { status, value } or
// { status, reason } for EVERY input, once all have settled.
function myPromiseAllSettled(promises: Promise<any>[]): Promise<any[]> {
  // your implementation
  return new Promise((resolve) => {
    if (promises.length === 0) return resolve([]);
    const results: any[] = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          results[i] = { status: "fulfilled", value };
          if (--remaining === 0) resolve(results);
        },
        (reason) => {
          results[i] = { status: "rejected", reason };
          if (--remaining === 0) resolve(results);
        },
      );
    });
  });
}

myPromiseAllSettled([
  delay("ok", 100),
  Promise.reject(new Error("fail")),
]).then((r) => console.log("7. myPromiseAllSettled:", r));

// ── 8. Implement your own simplified Promise (from scratch) ──
// Support: new MyPromise(executor), .then(onFulfilled, onRejected), and
// basic chaining. This is the deep-dive version — skip if short on time,
// but it's a common senior-level "build a Promise" ask.
type Executor = (
  resolve: (value: any) => void,
  reject: (reason: any) => void,
) => void;

class MyPromise {
  private state: "pending" | "fulfilled" | "rejected" = "pending";
  private value: any;
  private callbacks: Array<{
    onFulfilled?: (value: any) => void;
    onRejected?: (reason: any) => void;
  }> = [];

  constructor(executor: Executor) {
    const resolve = (value: any) => {
      if (this.state !== "pending") return;
      // if resolved with another thenable, chain onto it
      if (value && typeof value.then === "function") {
        value.then(resolve, reject);
        return;
      }
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((cb) => cb.onFulfilled?.(value));
    };
    const reject = (reason: any) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.callbacks.forEach((cb) => cb.onRejected?.(reason));
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = (value: any) => {
        try {
          resolve(onFulfilled ? onFulfilled(value) : value);
        } catch (err) {
          reject(err);
        }
      };
      const handleRejected = (reason: any) => {
        try {
          if (onRejected) resolve(onRejected(reason));
          else reject(reason);
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === "fulfilled") {
        queueMicrotask(() => handleFulfilled(this.value));
      } else if (this.state === "rejected") {
        queueMicrotask(() => handleRejected(this.value));
      } else {
        this.callbacks.push({
          onFulfilled: handleFulfilled,
          onRejected: handleRejected,
        });
      }
    });
  }

  catch(onRejected: (reason: any) => any) {
    return this.then(undefined, onRejected);
  }
}

new MyPromise((resolve) => setTimeout(() => resolve("hi"), 100))
  .then((v) => v + " there")
  .then((v) => console.log("8. MyPromise chained:", v)); // "hi there"

new MyPromise((_resolve, reject) => reject(new Error("nope"))).catch((err) =>
  console.log("8. MyPromise caught:", err.message),
);

// ── 9. async/await is sugar over promises — rewrite one as the other ──
// Given this async function:
async function getUserData(id: number) {
  const user = await delay({ id, name: "Ada" }, 100);
  const posts = await delay([`post-${id}-1`, `post-${id}-2`], 100);
  return { user, posts };
}
// ...rewrite it using raw .then() chains (no async/await) that produce the
// SAME result:
function getUserDataPromiseStyle(id: number) {
  return delay({ id, name: "Ada" }, 100).then((user) =>
    delay([`post-${id}-1`, `post-${id}-2`], 100).then((posts) => ({
      user,
      posts,
    })),
  );
}

getUserData(1).then((r) => console.log("9. async/await version:", r));
getUserDataPromiseStyle(1).then((r) =>
  console.log("9. .then() version:    ", r),
);

// ── 10. sequential vs parallel await — a common perf mistake ──
// SLOW: each await blocks the next from starting (serial, ~300ms total)
async function sequential() {
  const a = await delay("a", 100);
  const b = await delay("b", 100);
  const c = await delay("c", 100);
  return [a, b, c];
}
// FAST: kick all three off first, THEN await (parallel, ~100ms total)
async function parallel() {
  const pa = delay("a", 100);
  const pb = delay("b", 100);
  const pc = delay("c", 100);
  return [await pa, await pb, await pc];
}

(async () => {
  const t0 = Date.now();
  await sequential();
  console.log("10. sequential took ~", Date.now() - t0, "ms (expect ~300)");

  const t1 = Date.now();
  await parallel();
  console.log("10. parallel took ~  ", Date.now() - t1, "ms (expect ~100)");
})();




const john = {
  age: 42,
  getAge: function () {
    console.log(this,'this');
    // return this.age;
  },
};

const unboundGetAge = john.getAge;
console.log(unboundGetAge(),'unboundGetAge');