export const TOP_10_QUESTIONS_DATA = {
  "dsa": {
    "title": "Data Structures & Algorithms",
    "description": "Essential core algorithmic problems frequently asked in Tier-1 technical coding rounds.",
    "questions": [
      {
        "id": "dsa_1",
        "title": "Two Sum (Array Hashing)",
        "difficulty": "Easy",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Each input has exactly one solution and you may not use the same element twice.",
        "hint": "Use a Hash Map to store elements and their indices as you traverse. Check if `target - currentNum` exists in the map in O(1) time.",
        "approach": "```javascript\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n// Time: O(N), Space: O(N)\n```"
      },
      {
        "id": "dsa_2",
        "title": "Longest Substring Without Repeating Characters (Sliding Window)",
        "difficulty": "Medium",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
        "hint": "Maintain a dynamic sliding window `[left, right]` and a Set/Map of seen characters. When a duplicate character is found at `right`, increment `left` until the duplicate is removed.",
        "approach": "```javascript\nfunction lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {\n      seen.delete(s[left]);\n      left++;\n    }\n    seen.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n// Time: O(N), Space: O(min(N, M))\n```"
      },
      {
        "id": "dsa_3",
        "title": "Merge Intervals (Intervals Sorting)",
        "difficulty": "Medium",
        "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "hint": "Sort intervals primarily by start time. If `current.start <= previous.end`, merge them by setting `previous.end = max(previous.end, current.end)`.",
        "approach": "```javascript\nfunction merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const result = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const prev = result[result.length - 1];\n    const curr = intervals[i];\n    if (curr[0] <= prev[1]) {\n      prev[1] = Math.max(prev[1], curr[1]);\n    } else {\n      result.push(curr);\n    }\n  }\n  return result;\n}\n// Time: O(N log N), Space: O(N)\n```"
      },
      {
        "id": "dsa_4",
        "title": "Lowest Common Ancestor in Binary Tree (Tree DFS)",
        "difficulty": "Medium",
        "description": "Given a binary tree, find the lowest common ancestor (LCA) node of two given nodes `p` and `q` in the tree.",
        "hint": "Perform recursive DFS. If root is null or matches `p` or `q`, return root. If both left and right recursive calls return non-null, root is the LCA.",
        "approach": "```javascript\nfunction lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left ? left : right;\n}\n// Time: O(N), Space: O(H) where H is tree height\n```"
      },
      {
        "id": "dsa_5",
        "title": "LRU Cache Implementation (Doubly LinkedList + Hash Map)",
        "difficulty": "Hard",
        "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache supporting `get(key)` and `put(key, value)` in O(1) average time complexity.",
        "hint": "Combine a Doubly Linked List (for O(1) node removal and adding to head) with a Hash Map (mapping key to Doubly LinkedList Node).",
        "approach": "```javascript\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map(); // Map preserves insertion order in JS\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val); // refresh recency\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldestKey = this.map.keys().next().value;\n      this.map.delete(oldestKey);\n    }\n  }\n}\n// Get: O(1), Put: O(1)\n```"
      },
      {
        "id": "dsa_6",
        "title": "Coin Change Problem (Dynamic Programming)",
        "difficulty": "Medium",
        "description": "Given an integer array `coins` representing coins of different denominations and an integer `amount`, return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.",
        "hint": "Use 1D Dynamic Programming. Define `dp[i]` as the minimum coins needed for amount `i`. `dp[i] = min(dp[i], 1 + dp[i - coin])`.",
        "approach": "```javascript\nfunction coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n// Time: O(amount * len(coins)), Space: O(amount)\n```"
      },
      {
        "id": "dsa_7",
        "title": "Trapping Rain Water (Two Pointers)",
        "difficulty": "Hard",
        "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        "hint": "Use two pointers `left` and `right` with `maxLeft` and `maxRight`. The water trapped above a bar depends on `min(maxLeft, maxRight) - height[i]`.",
        "approach": "```javascript\nfunction trap(height) {\n  let left = 0, right = height.length - 1;\n  let maxL = 0, maxR = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= maxL) maxL = height[left];\n      else water += maxL - height[left];\n      left++;\n    } else {\n      if (height[right] >= maxR) maxR = height[right];\n      else water += maxR - height[right];\n      right--;\n    }\n  }\n  return water;\n}\n// Time: O(N), Space: O(1)\n```"
      },
      {
        "id": "dsa_8",
        "title": "Clone Graph (Graph BFS / DFS)",
        "difficulty": "Medium",
        "description": "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
        "hint": "Use a Map to track visited original nodes to their cloned node counterparts to avoid infinite loops during cycle traversal.",
        "approach": "```javascript\nfunction cloneGraph(node, visited = new Map()) {\n  if (!node) return null;\n  if (visited.has(node)) return visited.get(node);\n  const clone = { val: node.val, neighbors: [] };\n  visited.set(node, clone);\n  for (const neighbor of node.neighbors) {\n    clone.neighbors.push(cloneGraph(neighbor, visited));\n  }\n  return clone;\n}\n// Time: O(V + E), Space: O(V)\n```"
      },
      {
        "id": "dsa_9",
        "title": "Find Median from Data Stream (Two Heaps)",
        "difficulty": "Hard",
        "description": "Design a data structure that supports adding numbers from a data stream and finding the median of all elements in O(1) time.",
        "hint": "Maintain two heaps: a Max-Heap for the lower half of numbers, and a Min-Heap for the upper half. Balance sizes so they differ by at most 1.",
        "approach": "```javascript\n// Conceptual Approach: MaxHeap (lower half) + MinHeap (upper half)\n// Insert number into MaxHeap, balance to MinHeap.\n// If MaxHeap.size > MinHeap.size => median is MaxHeap.top()\n// If sizes equal => median is (MaxHeap.top() + MinHeap.top()) / 2.0\n// Time: addNum O(log N), findMedian O(1)\n```"
      },
      {
        "id": "dsa_10",
        "title": "Reverse Linked List (Pointers Manipulation)",
        "difficulty": "Easy",
        "description": "Given the head of a singly linked list, reverse the list, and return the reversed list's head.",
        "hint": "Iterate using three pointers: `prev` (null), `curr` (head), and `next` (curr.next). Update `curr.next = prev` at each step.",
        "approach": "```javascript\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}\n// Time: O(N), Space: O(1)\n```"
      }
    ]
  },
  "webdev": {
    "title": "Web Development & Full Stack",
    "description": "High-frequency Frontend & Backend interview concepts, architectures, and JS fundamentals.",
    "questions": [
      {
        "id": "web_1",
        "title": "Debounce & Throttle Implementation in JavaScript",
        "difficulty": "Medium",
        "description": "Explain and implement custom Debounce and Throttle functions from scratch in pure JavaScript. What are their primary use cases in web applications?",
        "hint": "Debounce delays function execution until `delay` ms of inactivity (e.g. search autocomplete). Throttle limits execution to at most once every `limit` ms (e.g. window resize/scroll).",
        "approach": "```javascript\n// Debounce\nfunction debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Throttle\nfunction throttle(fn, limit) {\n  let lastCall = 0;\n  return function (...args) {\n    const now = Date.now();\n    if (now - lastCall >= limit) {\n      lastCall = now;\n      fn.apply(this, args);\n    }\n  };\n}\n```"
      },
      {
        "id": "web_2",
        "title": "Event Loop, Microtasks & Macrotasks Execution Order",
        "difficulty": "Medium",
        "description": "Explain how the JavaScript Event Loop coordinates the Call Stack, Microtask Queue (Promises, queueMicrotask), and Macrotask Queue (setTimeout, setInterval, I/O).",
        "hint": "Synchronous code runs first. When the call stack empties, the event loop drains ALL microtasks before picking the next macrotask.",
        "approach": "```javascript\n// Execution Order Example:\nconsole.log('1'); // Synchronous -> 1\nsetTimeout(() => console.log('2'), 0); // Macrotask Queue\nPromise.resolve().then(() => console.log('3')); // Microtask Queue\nconsole.log('4'); // Synchronous -> 4\n// Output: 1 -> 4 -> 3 -> 2\n```"
      },
      {
        "id": "web_3",
        "title": "React Virtual DOM & Reconciliation (Fiber Architecture)",
        "difficulty": "Medium",
        "description": "How does React Fiber diffing and reconciliation work? Why are keys critical in list rendering and what happens if indices are used as keys?",
        "hint": "React creates a lightweight JS representation of the DOM. Diffing has O(N) heuristic complexity based on element types and unique stable keys.",
        "approach": "```markdown\n1. Fiber Tree: Linked list structure allowing incremental, interruptible rendering.\n2. Diffing Algorithm:\n   - Different element types destroy and rebuild subtrees.\n   - Same element types only update changed attributes/props.\n3. Keys in Lists:\n   - Keys provide stable identity across re-renders.\n   - Using array index as key breaks state during reordering/deletion.\n```"
      },
      {
        "id": "web_4",
        "title": "JWT Authentication vs. Session-Based Cookies & Security (XSS/CSRF)",
        "difficulty": "Medium",
        "description": "Compare JSON Web Tokens (JWT) with server-side sessions. How do you mitigate Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?",
        "hint": "JWT is stateless; sessions are stateful stored in Redis/DB. Store sensitive auth tokens in `HttpOnly, Secure, SameSite=Strict` cookies to block XSS access.",
        "approach": "```markdown\n- Storage Best Practice: HttpOnly, Secure cookie prevents JS document.cookie theft (XSS).\n- CSRF Defense: Use SameSite=Lax/Strict and anti-CSRF token headers for state-changing requests.\n- Refresh Tokens: Use short-lived Access Token (15m) and rotating Refresh Token (7d).\n```"
      },
      {
        "id": "web_5",
        "title": "REST API vs. GraphQL Design Principles",
        "difficulty": "Easy",
        "description": "What problems does GraphQL solve compared to traditional REST APIs? Explain over-fetching and under-fetching with examples.",
        "hint": "REST has fixed endpoints per resource (causing over-fetching or multiple roundtrips). GraphQL has a single endpoint where client queries exact schema fields.",
        "approach": "```markdown\n- Over-fetching: REST `/users/1` returns 30 fields when UI only needs `name`.\n- Under-fetching: Need user details + their latest 3 orders -> requires 2 roundtrips in REST.\n- GraphQL Solution: Client sends single POST with query `{ user(id: 1) { name, orders(limit: 3) { id, total } } }`.\n```"
      },
      {
        "id": "web_6",
        "title": "CORS (Cross-Origin Resource Sharing) & Preflight Requests",
        "difficulty": "Easy",
        "description": "Why do browsers enforce CORS? What triggers an `OPTIONS` preflight request and what response headers must the server return?",
        "hint": "Non-simple requests (custom headers like `Authorization`, content-type `application/json`, or `PUT/DELETE` methods) trigger an `OPTIONS` preflight check.",
        "approach": "```http\n// Preflight Request:\nOPTIONS /api/data HTTP/1.1\nOrigin: https://frontend.com\nAccess-Control-Request-Method: POST\nAccess-Control-Request-Headers: Authorization, Content-Type\n\n// Required Server Response Headers:\nAccess-Control-Allow-Origin: https://frontend.com\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\nAccess-Control-Allow-Headers: Authorization, Content-Type\nAccess-Control-Allow-Credentials: true\n```"
      },
      {
        "id": "web_7",
        "title": "Optimizing Core Web Vitals (LCP, FID/INP, CLS)",
        "difficulty": "Medium",
        "description": "Define Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). How do you optimize them in production?",
        "hint": "LCP: preload hero image and use CDN; INP: break long tasks and avoid main thread blocking; CLS: reserve explicit width/height dimensions on images and dynamic ads.",
        "approach": "```markdown\n1. LCP (< 2.5s): Preload critical assets (`<link rel='preload'>`), compress to WebP/AVIF, use edge caching.\n2. INP (< 200ms): Defer non-critical JS (`defer/async`), web workers for heavy computation.\n3. CLS (< 0.1): Always set `aspect-ratio` or `width/height` on media, avoid inserting DOM elements above existing content.\n```"
      },
      {
        "id": "web_8",
        "title": "Database Connection Pooling & Node.js Concurrency",
        "difficulty": "Hard",
        "description": "Why is database connection pooling necessary in backend servers? What happens if every API request opens a fresh DB connection?",
        "hint": "Creating TCP/TLS handshakes and DB worker processes per request exhausts DB memory and CPU. Connection pools maintain reusable warm connections.",
        "approach": "```javascript\n// Example with pg pool in Node.js:\nconst { Pool } = require('pg');\nconst pool = new Pool({\n  max: 20, // maximum active connections in pool\n  idleTimeoutMillis: 30000,\n  connectionTimeoutMillis: 2000,\n});\n// Reuses existing connection from pool without creating new TCP sockets\n```"
      },
      {
        "id": "web_9",
        "title": "WebSockets vs Server-Sent Events (SSE) vs Long Polling",
        "difficulty": "Medium",
        "description": "Compare bidirectional WebSockets, unidirectional SSE, and HTTP Long Polling for real-time applications like live chat and stock tickers.",
        "hint": "WebSockets: full-duplex TCP connection (chat, gaming). SSE: unidirectional server-to-client over standard HTTP (notifications, AI token streaming).",
        "approach": "```markdown\n- WebSockets: Full-duplex `ws://` protocol, low latency, requires sticky sessions or socket cluster.\n- Server-Sent Events (SSE): Unidirectional text streaming over HTTP, automatic reconnection, ideal for ChatGPT/Gemini LLM token streaming.\n- Long Polling: Fallback where client holds open request until server responds.\n```"
      },
      {
        "id": "web_10",
        "title": "Frontend Caching & Service Workers (PWA & HTTP Cache-Control)",
        "difficulty": "Medium",
        "description": "Explain how `Cache-Control: max-age`, `ETag`, and Service Worker Cache API collaborate to provide offline-first web performance.",
        "hint": "`Cache-Control: immutable, max-age=31536000` for content-hashed bundles. `Cache-Control: no-cache` with `ETag` for `index.html` to validate new deployments.",
        "approach": "```markdown\n- Static Assets (`main.a8b1c2.js`): `Cache-Control: public, max-age=31536000, immutable`.\n- HTML (`index.html`): `Cache-Control: no-cache` (browser sends `If-None-Match: ETag` -> receives 304 Not Modified if unchanged).\n- Service Worker: Intercepts `fetch` events to serve cached offline fallback.\n```"
      }
    ]
  },
  "dbms": {
    "title": "DBMS & SQL Queries",
    "description": "Essential relational database concepts, B+ Tree indexing, ACID properties, and complex queries.",
    "questions": [
      {
        "id": "dbms_1",
        "title": "Find the N-th Highest Salary in SQL",
        "difficulty": "Medium",
        "description": "Write a SQL query to find the N-th highest salary from an Employee table without using sub-optimal full table scans.",
        "hint": "Use the `DENSE_RANK()` window function or `LIMIT 1 OFFSET N-1` after ordering by salary descending.",
        "approach": "```sql\n-- Method 1: Using Window Function (Standard)\nWITH RankedSalaries AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_no\n  FROM Employee\n)\nSELECT salary FROM RankedSalaries WHERE rank_no = 2 LIMIT 1;\n\n-- Method 2: Using LIMIT / OFFSET\nSELECT DISTINCT salary \nFROM Employee \nORDER BY salary DESC \nLIMIT 1 OFFSET 1; -- for 2nd highest\n```"
      },
      {
        "id": "dbms_2",
        "title": "ACID Properties & Transaction Isolation Levels",
        "difficulty": "Medium",
        "description": "Explain Atomicity, Consistency, Isolation, and Durability. What anomalies (Dirty Read, Non-repeatable Read, Phantom Read) occur at different isolation levels?",
        "hint": "Read Uncommitted (dirty reads) -> Read Committed -> Repeatable Read (prevents non-repeatable read) -> Serializable (strict serial execution, prevents phantoms).",
        "approach": "```markdown\n- Dirty Read: Reading uncommitted data that might rollback.\n- Non-repeatable Read: Re-reading row in same transaction returns different values due to another commit.\n- Phantom Read: Re-running range query returns newly inserted rows.\n- Isolation Levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable.\n```"
      },
      {
        "id": "dbms_3",
        "title": "B-Tree vs B+ Tree Indexing Architecture",
        "difficulty": "Hard",
        "description": "Why do relational database engines (PostgreSQL, MySQL InnoDB) choose B+ Trees over standard B-Trees or Binary Search Trees for disk storage?",
        "hint": "B+ Trees store actual record pointers only at leaf nodes, linked sequentially via doubly linked lists. Internal nodes only store keys, maximizing fan-out and minimizing disk I/O.",
        "approach": "```markdown\n1. Higher Fan-Out: Smaller internal nodes mean more keys fit into a single disk page (4KB/16KB), reducing tree height to 3-4 levels for millions of rows.\n2. Range Query Efficiency: Leaves are linked sequentially, allowing sequential range scans without traversing parent nodes.\n3. Predictable O(log N) Lookup: Every lookup always reaches leaf level in constant disk reads.\n```"
      },
      {
        "id": "dbms_4",
        "title": "Database Normalization (1NF to BCNF) & Denormalization",
        "difficulty": "Easy",
        "description": "Explain 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), and BCNF. When is denormalization preferred in production?",
        "hint": "Normalization eliminates insertion/deletion/update anomalies. Denormalization is used in Read-Heavy Data Warehouses / OLAP to avoid expensive multi-table joins.",
        "approach": "```markdown\n- 1NF: Column values are atomic; no repeating groups.\n- 2NF: In 1NF and all non-key attributes fully dependent on primary key.\n- 3NF: In 2NF and no non-key attribute transitively depends on primary key.\n- BCNF: For every functional dependency X -> Y, X must be a super key.\n- Denormalization: Pre-joining tables or caching aggregates for high-speed read queries.\n```"
      },
      {
        "id": "dbms_5",
        "title": "SQL Query: Find Duplicate Emails and Delete Duplicates",
        "difficulty": "Medium",
        "description": "Given a `Person` table with `id` and `email`, write SQL to find duplicate emails, and a query to delete all duplicate emails keeping only the smallest `id`.",
        "hint": "Group by email with `HAVING count(*) > 1`. For deletion, use a self-join where `p1.email = p2.email AND p1.id > p2.id`.",
        "approach": "```sql\n-- 1. Find duplicate emails:\nSELECT email, COUNT(email) as occurrences\nFROM Person\nGROUP BY email\nHAVING COUNT(email) > 1;\n\n-- 2. Delete duplicates keeping lowest id:\nDELETE p1 FROM Person p1\nJOIN Person p2 \n  ON p1.email = p2.email AND p1.id > p2.id;\n```"
      },
      {
        "id": "dbms_6",
        "title": "Clustered vs Non-Clustered Indexes",
        "difficulty": "Easy",
        "description": "What is the architectural difference between a Clustered Index and a Non-Clustered (Secondary) Index in a database table?",
        "hint": "A table can have only ONE clustered index because it dictates the physical on-disk order of data rows. Non-clustered index stores index keys with pointers to clustered index.",
        "approach": "```markdown\n- Clustered Index: The leaf pages ARE the data pages. Dictates physical table sort order (default is Primary Key).\n- Non-Clustered Index: Separate B+ tree structure. Leaf nodes hold secondary key and pointer/Primary Key to locate the actual row.\n```"
      },
      {
        "id": "dbms_7",
        "title": "SQL Window Functions: RANK(), DENSE_RANK(), and ROW_NUMBER()",
        "difficulty": "Medium",
        "description": "Explain the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` when assigning rankings to tied scores.",
        "hint": "Scores [100, 100, 90]: ROW_NUMBER => [1, 2, 3]; RANK => [1, 1, 3] (gaps); DENSE_RANK => [1, 1, 2] (no gaps).",
        "approach": "```sql\nSELECT student_id, score,\n  ROW_NUMBER() OVER (ORDER BY score DESC) as row_num,\n  RANK()       OVER (ORDER BY score DESC) as rnk,\n  DENSE_RANK() OVER (ORDER BY score DESC) as dense_rnk\nFROM ExamScores;\n```"
      },
      {
        "id": "dbms_8",
        "title": "SQL Self Join & CTE for Organizational Hierarchy",
        "difficulty": "Hard",
        "description": "Given an Employee table with `emp_id`, `name`, and `manager_id`, write a Recursive Common Table Expression (CTE) to find the reporting hierarchy of all employees under a manager.",
        "hint": "Use `WITH RECURSIVE Hierarchy AS (...)` with an anchor member selecting the top manager, unioned with recursive query joining on `manager_id = emp_id`.",
        "approach": "```sql\nWITH RECURSIVE OrgChart AS (\n  -- Anchor member: top level executive\n  SELECT emp_id, name, manager_id, 1 as level\n  FROM Employee\n  WHERE manager_id IS NULL\n  \n  UNION ALL\n  \n  -- Recursive member\n  SELECT e.emp_id, e.name, e.manager_id, o.level + 1\n  FROM Employee e\n  INNER JOIN OrgChart o ON e.manager_id = o.emp_id\n)\nSELECT * FROM OrgChart ORDER BY level, manager_id;\n```"
      },
      {
        "id": "dbms_9",
        "title": "Database Sharding vs Partitioning vs Replication",
        "difficulty": "Medium",
        "description": "Explain Horizontal Partitioning, Vertical Partitioning, Horizontal Sharding, and Read/Write Master-Slave Replication.",
        "hint": "Partitioning is on a single database instance. Sharding distributes partitions across multiple autonomous server nodes. Replication copies data for redundancy/read scaling.",
        "approach": "```markdown\n- Partitioning: Splitting a 100M row table into monthly partitions on the same DB instance.\n- Sharding: Distributing chunks across independent database clusters using a Shard Key (e.g., hash(user_id) % N).\n- Master-Slave Replication: Primary handles writes and replicates binary logs to Read Replicas.\n```"
      },
      {
        "id": "dbms_10",
        "title": "SQL Query: Consecutive Available Numbers / Active Days",
        "difficulty": "Medium",
        "description": "Write a SQL query to find all numbers or users who logged in for at least 3 consecutive days.",
        "hint": "Use `LEAD()` and `LAG()` window functions to check if `date + 1` and `date + 2` match for the same user.",
        "approach": "```sql\nSELECT DISTINCT user_id\nFROM (\n  SELECT user_id, log_date,\n    LAG(log_date, 1) OVER (PARTITION BY user_id ORDER BY log_date) as prev_date,\n    LEAD(log_date, 1) OVER (PARTITION BY user_id ORDER BY log_date) as next_date\n  FROM UserLogins\n) t\nWHERE DATEDIFF(log_date, prev_date) = 1 \n  AND DATEDIFF(next_date, log_date) = 1;\n```"
      }
    ]
  },
  "os": {
    "title": "Operating Systems & Networking",
    "description": "Core OS concurrency, memory management, TCP/IP networking, and process scheduling.",
    "questions": [
      {
        "id": "os_1",
        "title": "Process vs. Thread & Context Switching Overhead",
        "difficulty": "Easy",
        "description": "What is the difference between a Process and a Thread? Why is thread context switching faster than process context switching?",
        "hint": "Processes have isolated virtual memory spaces and PCB. Threads within a process share memory space (heap, code segment, open file descriptors), avoiding TLB cache invalidation.",
        "approach": "```markdown\n- Process: Independent address space, heavy creation and context-switch overhead (requires flushing CPU caches and TLB).\n- Thread: Unit of CPU execution sharing parent process memory; lighter context switch (only CPU registers and program counter saved).\n```"
      },
      {
        "id": "os_2",
        "title": "Deadlocks: 4 Coffman Conditions & Banker's Algorithm",
        "difficulty": "Medium",
        "description": "List the 4 necessary Coffman conditions for a Deadlock to occur. How does the Banker's Algorithm avoid deadlocks?",
        "hint": "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Banker's Algorithm tests for safety by simulating resource allocation before granting.",
        "approach": "```markdown\n1. Mutual Exclusion: Resources cannot be shared simultaneously.\n2. Hold & Wait: Process holding a resource requests additional resources.\n3. No Preemption: Resources cannot be forcibly taken.\n4. Circular Wait: P1 waits for P2, P2 waits for P1.\n- Prevention: Break any of the 4 conditions (e.g. acquire all resources at once, or enforce global lock ordering).\n```"
      },
      {
        "id": "os_3",
        "title": "Virtual Memory, Paging, and Page Fault Handling",
        "difficulty": "Medium",
        "description": "How does Virtual Memory map addresses to physical RAM? Explain what happens step-by-step during a Page Fault.",
        "hint": "MMU looks up the Page Table. If the valid bit is 0, a Page Fault Interrupt is triggered; OS locates the page on disk/swap, loads into free frame, updates Page Table, and restarts instruction.",
        "approach": "```markdown\n1. CPU generates Virtual Address -> MMU checks TLB (Translation Lookaside Buffer).\n2. TLB Miss -> checks Page Table in RAM.\n3. If valid bit is 0 -> Page Fault hardware trap to OS kernel.\n4. OS finds requested page in secondary storage swap space.\n5. OS reads page into free physical frame (runs page replacement LRU if RAM full).\n6. Updates Page Table, sets valid bit, resumes suspended process.\n```"
      },
      {
        "id": "os_4",
        "title": "TCP 3-Way Handshake & 4-Way Teardown (SYN/ACK & FIN/ACK)",
        "difficulty": "Medium",
        "description": "Explain the step-by-step TCP 3-Way Handshake to establish a connection, and the 4-Way Termination handshake including TIME_WAIT state.",
        "hint": "Establish: SYN -> SYN-ACK -> ACK. Teardown: FIN -> ACK -> FIN -> ACK. TIME_WAIT ensures last ACK is received and old duplicate packets expire.",
        "approach": "```markdown\n- Handshake: Client sends SYN (seq=x) -> Server replies SYN-ACK (seq=y, ack=x+1) -> Client sends ACK (ack=y+1).\n- Teardown: Client sends FIN -> Server sends ACK -> Server sends FIN -> Client sends ACK and waits 2*MSL in TIME_WAIT.\n```"
      },
      {
        "id": "os_5",
        "title": "Mutex vs. Semaphore & Producer-Consumer Problem",
        "difficulty": "Medium",
        "description": "What is the difference between a Binary Semaphore, Counting Semaphore, and Mutex? How do you solve the Producer-Consumer problem?",
        "hint": "Mutex has ownership (only locking thread can unlock). Semaphore is a signaling mechanism with counter. Use `empty`, `full` semaphores and a mutex.",
        "approach": "```c\n// Producer-Consumer Solution Outline:\nsemaphore mutex = 1; // binary lock for buffer access\nsemaphore empty = N; // counts empty slots\nsemaphore full = 0;  // counts filled items\n\n// Producer: wait(empty); wait(mutex); insert(); signal(mutex); signal(full);\n// Consumer: wait(full); wait(mutex); remove(); signal(mutex); signal(empty);\n```"
      },
      {
        "id": "os_6",
        "title": "CPU Scheduling: FCFS, SJF, Round Robin, and Priority Inversion",
        "difficulty": "Easy",
        "description": "Compare Shortest Job First (SJF) and Round Robin scheduling. What is Priority Inversion and how does Priority Inheritance solve it?",
        "hint": "Priority Inversion: Low priority task holds resource needed by High priority task, but gets preempted by Medium priority task. Priority Inheritance temporarily boosts Low task's priority.",
        "approach": "```markdown\n- Round Robin: Preemptive time quantum slice per process, prevents starvation.\n- SJF / SRTF: Optimal average waiting time but susceptible to long process starvation.\n- Priority Inheritance Protocol: When High-priority task waits on lock held by Low-priority task, Low task inherits High priority until lock release.\n```"
      },
      {
        "id": "os_7",
        "title": "HTTPS, TLS Handshake & Certificate Verification",
        "difficulty": "Medium",
        "description": "Explain how HTTPS encrypts traffic using Asymmetric and Symmetric cryptography during a TLS 1.3 handshake.",
        "hint": "Asymmetric encryption (RSA/ECC) securely exchanges/generates the symmetric session key (AES-GCM), which is then used for fast data encryption.",
        "approach": "```markdown\n1. ClientHello: Sends supported cipher suites and random bytes.\n2. ServerHello: Returns chosen cipher, server certificate (with public key), and Key Share.\n3. Client verifies Certificate signature against trusted Root CA certificates.\n4. Both generate shared Symmetric Session Key via Diffie-Hellman Key Exchange.\n5. Encrypted Application Data begins using fast AES symmetric cipher.\n```"
      },
      {
        "id": "os_8",
        "title": "DNS Lookup Resolution Step-by-Step",
        "difficulty": "Easy",
        "description": "Explain what happens when you type `https://google.com` in a browser and how the DNS resolver resolves the IP address.",
        "hint": "Browser cache -> OS cache -> Router cache -> ISP Recursive Resolver -> Root Server (.) -> TLD Server (.com) -> Authoritative Nameserver.",
        "approach": "```markdown\n1. Check Local Caches (Browser DNS cache -> OS hosts/cache).\n2. Query Recursive Resolver (e.g. 8.8.8.8).\n3. Root DNS Server directs to `.com` TLD Nameserver.\n4. TLD Nameserver directs to `google.com` Authoritative Nameserver.\n5. Authoritative Nameserver returns IP `142.250.190.46` (A/AAAA record).\n```"
      },
      {
        "id": "os_9",
        "title": "Inter-Process Communication (IPC): Pipes, Sockets, Shared Memory",
        "difficulty": "Hard",
        "description": "Compare IPC mechanisms: Anonymous Pipes, Named Pipes (FIFO), Message Queues, Shared Memory, and Unix Domain Sockets.",
        "hint": "Shared Memory is the fastest IPC because it avoids kernel copying, but requires synchronization primitives (semaphores/mutexes).",
        "approach": "```markdown\n- Shared Memory: Fastest IPC; processes map same physical RAM region; requires semaphores to avoid race conditions.\n- Sockets: Works across network boundaries and between local processes.\n- Pipes: Unidirectional byte stream between related parent-child processes.\n```"
      },
      {
        "id": "os_10",
        "title": "TCP Flow Control (Sliding Window) vs Congestion Control (AIMD)",
        "difficulty": "Hard",
        "description": "Explain how TCP prevents receiver buffer overflow (Flow Control) and network congestion (Slow Start, Congestion Avoidance, Fast Retransmit).",
        "hint": "Flow control uses Receiver Window (rwnd). Congestion control uses Congestion Window (cwnd) with AIMD (Additive Increase, Multiplicative Decrease).",
        "approach": "```markdown\n- Flow Control: Receiver advertises available buffer `rwnd` in ACK headers. Sender never transmits more than `min(cwnd, rwnd)`.\n- Congestion Control:\n  1. Slow Start: Exponential growth of `cwnd` until `ssthresh`.\n  2. Congestion Avoidance: Linear growth (+1 MSS per RTT).\n  3. Fast Recovery / Retransmit: On 3 duplicate ACKs, halve `cwnd` without dropping to 1.\n```"
      }
    ]
  }
};
