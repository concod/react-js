// // JS utility-function drills. Implement one at a time; we'll test each.
// // Run with:  npx tsx src/problems/playground.ts   (from project root)

// // ── 1. flatten ──
// // flatten([1, [2, [3, [4]], 5]]) => [1, 2, 3, 4, 5]  (any depth)
// export function flatten(arr: any[]): any[] {
//   const result: any[] = [];
//   arr.forEach((item) => {
//     Array.isArray(item) ? result.push(...flatten(item)) : result.push(item);
//   });
//   return result;
// }

// // console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
// // console.log(flatten([[1], [2, [3]], 4])); // [1, 2, 3, 4]

// // ── 2. curry ──
// // Turn f(a, b, c) into a chain callable one arg at a time: f(a)(b)(c).
// // Collect args until there are enough, THEN run the original function.
// //   const add = (a, b, c) => a + b + c;
// //   curry(add)(1)(2)(3) === 6
// // BASIC version: nested functions, one per argument. Works for exactly 3 args.
// function curry(fn: (a: number, b: number, c: number) => number) {
//   return (a: number) => (b: number) => (c: number) => fn(a, b, c);
// }

// const add = (a: number, b: number, c: number) => a + b + c;
// const cadd = curry(add);
// console.log(cadd(1)(2)(3)); // 6

// // ── 3. memoize ──
// // Return a version of fn that CACHES results by its arguments, so calling it
// // again with the same args returns the cached value instead of recomputing.
// function memoize(fn: (...args: any[]) => any) {
//   // your implementation
//   const cache: Record<string, any> = {};

//   return (...args: any[]) => {
//     const key = JSON.stringify(args);

//     if (key in cache) return cache[key];
//     else {
//       cache[key] = fn(...args);
//       return cache[key];
//     }
//   };
// }

// const square = (n: number) => {
//   console.log("computing", n);
//   return n * n;
// };
// const fastSquare = memoize(square);
// console.log(fastSquare(4)); // "computing 4" then 16
// console.log(fastSquare(4)); // 16 (NO "computing" log — served from cache)
// console.log(fastSquare(5)); // "computing 5" then 25

// // ── 4. throttle ──
// // Return a version of fn that runs AT MOST once every `delay` ms, no matter how
// // often it's called. (Contrast: debounce waits for a pause; throttle fires at a
// // steady max rate DURING a burst.)
// function throttle(fn: (...args: any[]) => void, delay: number) {
//   // your implementation
//   let last = 0;

//   return (...args: any[]) => {
//     const now = Date.now();
//     if (now - last >= delay) {
//       last = now;
//       fn(...args);
//     }
//   };
// }

// // Test: fire every 100ms for ~500ms. With throttle(300) you should see the
// // callback run far fewer times than it's called (roughly at 0ms, ~300ms...).
// const throttled = throttle(
//   (n: number) => console.log("throttled run:", n),
//   300,
// );
// let i = 0;
// const testId = setInterval(() => {
//   i++;
//   throttled(i);
//   if (i >= 6) clearInterval(testId);
// }, 100);

// // ── 5. deepClone ──
// // Return a deep copy: no shared references to nested arrays/objects.
// // Input is JSON-safe: null, boolean, number, string, array, or plain object.
// // No cycles, no Date/Map/Set. Primitives returned as-is.
// function deepClone(value: any): any {
//   // 1. primitives (and null) -> return as-is
//   if (typeof value !== "object" || value === null) return value;

//   // 2. array -> new array, deep-clone each element
//   if (Array.isArray(value)) return value.map((item) => deepClone(item));

//   // 3. plain object -> new object, deep-clone each own value
//   const result: Record<string, any> = {};
//   for (const key in value) {
//     if (Object.prototype.hasOwnProperty.call(value, key)) {
//       result[key] = deepClone(value[key]);
//     }
//   }
//   return result;
// }

// // Test: mutating the clone must NOT affect the original.
// const original = { user: { name: "Ada", tags: ["admin"] }, active: true };
// const copy = deepClone(original);
// copy.user.tags.push("owner");
// copy.user.name = "Grace";
// console.log("original:", JSON.stringify(original)); // tags: ["admin"], name: "Ada"
// console.log("copy:    ", JSON.stringify(copy)); // tags: ["admin","owner"], name: "Grace"
// console.log("shared ref?", original.user === copy.user); // false
// console.log(twoSum(nums))

/**
 *        A
         / \
        B   C
       / \
      D   E
 */

const graph = new Map();

function addNode(node) {
  graph.set(node, []);
}

function addEdge(node1, node2) {
  graph.get(node1).push(node2);
  graph.get(node2).push(node1);
}

addNode("A");
addNode("B");
addNode("C");
addNode("D");
addNode("E");

addEdge("A", "B");
addEdge("A", "C");
addEdge("B", "D");
addEdge("B", "E");
// console.log(graph);
//A que-b,c
// c,d

function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);

  while (queue.length) {
    const curr = queue.shift();
    console.log(curr);

    for (const neighbor of graph.get(curr)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

// bfs(graph, "A");

function dfs(graph, start, visited) {
  let count = 0;
  const stack = [start]; // a,b,c
  visited.add(start);
  while (stack.length) {
    let curr = stack.pop();
    count++;

    console.log(curr);
    for (const neighbor of graph.get(curr)) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        visited.add(neighbor);
      }
    }
  }
  return count;
}

// dfs(graph,"A",new Set()) b,[a,]   [a,b,d,e,e]

function dfsRecursion(graph, start, visited) {
  if (visited.has(start)) return;
  visited.add(start);
  console.log(start);
  for (const neighbor of graph.get(start)) {
    dfsRecursion(graph, neighbor, visited);
  }
}

// dfsRecursion(graph, "A", new Set());

const graph2 = new Map([
  ["A", ["B", "C"]],
  ["B", ["A", "D"]],
  ["C", ["A", "E"]],
  ["D", ["B"]],
  ["E", ["C", "F"]],
  ["F", ["E"]],
]);

function hasPath(graph, source, dest) {
  // a,d
  const visited = new Set([source]);
  const stack = [source];

  while (stack.length) {
    const curr = stack.pop();
    if (curr === dest) return true;
    for (const neighbor of graph.get(curr)) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        visited.add(neighbor);
      }
    }
  }
  return false;
}

// console.log(hasPath(graph2, "B", "C"));

function shortestPath(graph, source, dest) {
  const visited = new Set([source]);
  const que = [[source, 0]];

  while (que.length) {
    const [curr, dist] = que.shift();
    if (curr === dest) return dist;
    for (const neighbor of graph.get(curr)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        que.push([neighbor, dist + 1]);
      }
    }
  }
  return -1;
}
// console.log(shortestPath(graph2, "B", "F"));

const graph3 = new Map([
  ["A", ["B"]],
  ["B", ["A"]],

  ["C", []],

  ["D", ["E"]],
  ["E", ["D"]],

  ["F", ["G"]],
  ["G", ["F"]],
]);

function countComponents(graph) {
  const visited = new Set();
  let count = 0;
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(graph, node, visited);
      count++;
    }
  }
  return count;
}

// console.log(countComponents(graph3));

const graph4 = new Map([
  ["A", ["B", "D"]],
  ["B", ["A", "C", "E"]],
  ["C", ["B"]],
  ["D", ["A", "E"]],
  ["E", ["B", "D"]],

  ["F", ["G", "H"]],
  ["G", ["F"]],
  ["H", ["F"]],

  ["I", ["J"]],
  ["J", ["I", "K"]],
  ["K", ["J"]],

  ["L", []],
]);

function largestComponent(graph) {
  const visited = new Set();
  let largest = 0;

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      const totalVisited = dfs(graph, node, visited);
      largest = Math.max(largest, totalVisited);
    }
  }
}

const grid = [
  ["1", "1", "0", "0", "0"], // no. of island = 2
  ["1", "1", "1", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];

function dfsGrid(grid, row, col, visited) {
  // console.log("gone");
  // check if outside grid
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;
  // no land
  if (grid[row][col] === "0") return;

  const key = `${row},${col}`;

  console.log(key, "key");
  if (visited.has(key)) return;
  // mark the land as visited
  visited.add(key);
  // [0, 0];1,

  // 5. explore its 4 neighbors
  dfsGrid(grid, row - 1, col, visited); // up
  dfsGrid(grid, row + 1, col, visited); // down
  dfsGrid(grid, row, col - 1, visited); // left
  dfsGrid(grid, row, col + 1, visited); // right
}

function numIslands(grid) {
  const visited = new Set();
  let count = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const key = `${row},${col}`;
      // console.log(key);
      if (grid[row][col] === "1" && !visited.has(key)) {
        dfsGrid(grid, row, col, visited);
        count++;
      }
    }
  }
  return count;
}

// numIslands(grid);

/*
        A
      /   \
     B     C
    / \     \
   D   E     F
*/

class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const A = new TreeNode("A");
const B = new TreeNode("B");
const C = new TreeNode("C");
const D = new TreeNode("D");
const E = new TreeNode("E");
const F = new TreeNode("F");

A.left = B;
A.right = C;

B.left = D;
B.right = E;

C.right = F;

console.log(A, "lll");

function preorder(node) {
  /// leftmost node first then right most
  if (node === null) {
    return;
  }

  console.log(node.value); //A,B,D,E,C,F
  preorder(node.left);
  preorder(node.right);
}

function bfsTree(root) {
  if (root === null) return;
  const que = [root];

  while (que.length) {
    const curr = que.shift();
    console.log(curr.value);
    if (curr.left) que.push(curr.left);
    if (curr.right) que.push(curr.right);
  }
}

function maxDepth(node) {
  if (node === null) return 0;

  const leftDepth = maxDepth(node.left);
  const rightDepth = maxDepth(node.right);

  return 1 + Math.max(leftDepth, rightDepth);
}

function isSameTree(tree1, tree2) {
  if (tree1 === null && tree2 === null) return true;
  if (tree1 === null || tree2 === null) return false;
  if (tree1.value !== tree2.value) return false;

  return (
    isSameTree(tree1.left, tree2.left) && isSameTree(tree1.right, tree2.right)
  );
}

function reverseTree(tree) {
  if (tree === null) return;

  [tree.left, tree.right] = [tree.right, tree.left];

  reverseTree(tree.left);
  reverseTree(tree.right);
  return tree;
}

// preorder(A);

// nums = [2, 7, 11, 15];
// target = 9;
// output = [0, 1];

function twoSum(nums, target) {
  const map = new Map();

  for (const [index, num] of nums.entries()) {
    const needed = target - num;

    if (map.has(needed)) {
      return [map.get(needed), num];
    }

    map.set(num, index);
  }
  return [];
}

function anagram(s1 = "rrraatt", s2 = "ttaarrrr") {
  const charMap = new Map();

  if (s1.length !== s2.length) return false;
  for (const char of s1) {
    // if (charMap.has(char)) {
    //   charMap.set(char, charMap.get(char) + 1);
    // } else {
    //   charMap.set(char, 1);
    // }
    charMap.set(char, charMap.has(char) ? charMap.get(char) + 1 : 1);
  }

  for (const char of s2) {
    if (!charMap.has(char)) return false;

    charMap.set(char, charMap.get(char) - 1);

    if (charMap.get(char) < -1) {
      return false;
    }
  }
  return true;
  console.log(charMap);
}

// anagram();

// const words = ["eat", "tea", "tan", "ate", "nat", "bat"];

// function groupAnagrams(){
// const ana

// }

const nums = [100, 4, 200, 1, 3, 2];
function longestConsecutive(nums) {
  const set = new Set(nums);

  let longest = 0;

  for (const num of nums) {
    if (!set.has(num - 1)) {
      // impp: if smaller no.exist then its is not the sub seq start
      let curr = num;
      let len = 1;

      while (set.has(curr + 1)) {
        curr = curr + 1;
        len++;
      }

      longest = Math.max(len, longest);
    }
  }
  return longest;
}

longestConsecutive(nums);

// fdvdf
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;

    left++;
    right--;
  }

  return true;
}

///nums = [1, 2, 4, 6, 10, 15]; // sorted array
//target = 12;
function sum2(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    let sum = nums[left] + nums[right];
    if (sum === target) return [left, right];

    if (sum < target) {
      right--;
    }
    if (sum > target) {
      left++;
    }
  }
  return [];
}

function moveZeroes(nums = [1, 0, 0, 3, 12]) {
  // fast, slow pointer
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
  return nums;
}

//maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]);
function maxArea(height = []) {
  let left = 0;
  let right = height.length - 1;

  let maxWater = 0;
  while (left < right) {
    const width = right - left;

    const containerHeight = Math.min(height[left], height[right]);

    maxWater = Math.max(maxWater, width * containerHeight);

    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}
