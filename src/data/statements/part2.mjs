// Statements: LinkedList, Stacks & Queues, Binary Trees, BSTs, Heap, Trie, Bit Manipulation.
export const part2 = {
  // ---------------------------------------------------------------- LinkedList
  'Reverse a linked list': {
    text: `Given the head of a singly linked list, reverse it and return the new head. Be ready to write it both iteratively and recursively.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5', out: '5 → 4 → 3 → 2 → 1' }],
  },
  'Detect Loop in linked list': {
    text: `Return true if the linked list has a cycle, meaning some node's next pointer points back to an earlier node. Aim for O(1) extra space.`,
    ex: [{ in: '3 → 2 → 0 → -4 → (back to 2)', out: 'true' }, { in: '1 → 2 → null', out: 'false' }],
  },
  'Merge 2 sorted Linked Lists': {
    text: `Merge two sorted linked lists into one sorted list by relinking their nodes (do not create new nodes). Return the head of the merged list.`,
    ex: [{ in: '1 → 2 → 4 and 1 → 3 → 4', out: '1 → 1 → 2 → 3 → 4 → 4' }],
  },
  'Remove Nth node from end of Linked List': {
    text: `Remove the nth node from the end of the list and return the head. Try to do it in one pass.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5, n = 2', out: '1 → 2 → 3 → 5' }, { in: '1, n = 1', out: 'empty list' }],
  },
  'Reverse a linked list in groups of size k': {
    text: `Reverse the nodes of the list k at a time and return the new head. In the GfG version a final group shorter than k is also reversed. In the LeetCode version it is left as it is — confirm which one is meant.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5, k = 2', out: '2 → 1 → 4 → 3 → 5' }, { in: '1 → 2 → 3 → 4 → 5, k = 3', out: '3 → 2 → 1 → 4 → 5 (LeetCode) or 3 → 2 → 1 → 5 → 4 (GfG)' }],
  },
  'Delete the loop in a linked list': {
    text: `The list may contain a cycle. Find the node where the cycle starts and break the loop by setting the last node's next to null, leaving a plain list.`,
    ex: [{ in: '1 → 3 → 4 → (back to 3)', out: '1 → 3 → 4 → null', why: 'The cycle starts at node 3.' }],
  },
  'Remove duplicates from a sorted linked list': {
    text: `Given a sorted linked list, delete nodes so that each value appears only once.`,
    ex: [{ in: '1 → 1 → 2 → 3 → 3', out: '1 → 2 → 3' }],
  },
  'Remove duplicates from an unsorted linked list': {
    text: `Given an unsorted linked list, keep the first occurrence of each value and delete later duplicates.`,
    ex: [{ in: '5 → 2 → 2 → 4 → 5', out: '5 → 2 → 4' }],
  },
  'Move the last element to the front': {
    text: `Move the last node of the linked list to the front and return the new head.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5', out: '5 → 1 → 2 → 3 → 4' }],
  },
  'Add 1 to a number represented as a linked list': {
    text: `A non-negative number is stored one digit per node, most significant digit first. Add 1 to it and return the resulting list.`,
    ex: [{ in: '4 → 5 → 6', out: '4 → 5 → 7' }, { in: '9 → 9 → 9', out: '1 → 0 → 0 → 0' }],
  },
  'Add two numbers represented by linked lists': {
    text: `Two non-negative numbers are stored as linked lists, one digit per node. Return their sum as a linked list in the same format. Confirm the digit order: LeetCode stores the digits in reverse (least significant first), GfG stores them most significant first.`,
    ex: [{ in: '2 → 4 → 3 + 5 → 6 → 4 (reverse order)', out: '7 → 0 → 8', why: '342 + 465 = 807.' }],
  },
  'Intersection of two sorted linked lists (by value)': {
    text: `Given two sorted linked lists, return a new list of the values present in both, in sorted order.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 6 and 2 → 4 → 6 → 8', out: '2 → 4 → 6' }],
  },
  'Intersection point of two linked lists (shared node)': {
    text: `Two singly linked lists merge at some node and share every node after it (a Y shape). Return that first shared node, or null if they never meet. Compare nodes by identity, not by value.`,
    ex: [{ in: 'A: 4 → 1 ↘ 8 → 4 → 5,  B: 5 → 6 → 1 ↗ (same 8)', out: 'node 8' }],
  },
  'Merge sort for linked lists': {
    text: `Sort a linked list in O(n log n) time using merge sort: split at the middle, sort both halves, and merge them.`,
    ex: [{ in: '4 → 2 → 1 → 3', out: '1 → 2 → 3 → 4' }],
  },
  'Quicksort for linked lists': {
    text: `Sort a linked list using quicksort, partitioning the nodes around a pivot by relinking them.`,
    ex: [{ in: '10 → 30 → 3 → 4 → 20 → 5', out: '3 → 4 → 5 → 10 → 20 → 30' }],
  },
  'Find the middle element of a linked list': {
    text: `Return the middle node of the list. If there are two middle nodes, return the second one.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5', out: '3' }, { in: '1 → 2 → 3 → 4 → 5 → 6', out: '4' }],
  },
  'Check if a linked list is circular': {
    text: `Return true if the list is circular: following next pointers from the head eventually leads back to the head itself (not to some other node).`,
    ex: [{ in: '1 → 2 → 3 → (back to 1)', out: 'true' }, { in: '1 → 2 → 3 → null', out: 'false' }],
  },
  'Split a circular linked list into two halves': {
    text: `Split a circular linked list into two circular lists of equal size. If the length is odd, the first list gets one extra node.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5 → (1)', out: '1 → 2 → 3 → (1) and 4 → 5 → (4)' }],
  },
  'Check whether a singly linked list is a palindrome': {
    text: `Return true if the list's values read the same forwards and backwards. Aim for O(n) time and O(1) extra space.`,
    ex: [{ in: '1 → 2 → 2 → 1', out: 'true' }, { in: '1 → 2', out: 'false' }],
  },
  'Reverse a doubly linked list': {
    text: `Reverse a doubly linked list by swapping each node's prev and next pointers, and return the new head.`,
    ex: [{ in: '1 ⇄ 2 ⇄ 3 ⇄ 4', out: '4 ⇄ 3 ⇄ 2 ⇄ 1' }],
  },
  'Find pairs with a given sum in a sorted doubly linked list': {
    text: `Given a sorted doubly linked list of distinct values and a target x, return every pair of nodes whose values sum to x. Use O(1) extra space.`,
    ex: [{ in: '1 ⇄ 2 ⇄ 4 ⇄ 5 ⇄ 6 ⇄ 8 ⇄ 9, x = 7', out: '(1, 6), (2, 5)' }],
  },
  'Count triplets in a sorted DLL with a given sum': {
    text: `Given a sorted doubly linked list of distinct values and a target x, count the triplets of nodes whose values sum to x.`,
    ex: [{ in: '1 ⇄ 2 ⇄ 4 ⇄ 5 ⇄ 6 ⇄ 8 ⇄ 9, x = 17', out: '2', why: '(2, 6, 9) and (4, 5, 8).' }],
  },
  'Sort a k-sorted doubly linked list': {
    text: `Every node in the doubly linked list is at most k positions away from where it belongs in sorted order. Sort the list efficiently.`,
    ex: [{ in: '3 ⇄ 6 ⇄ 2 ⇄ 12 ⇄ 56 ⇄ 8, k = 2', out: '2 ⇄ 3 ⇄ 6 ⇄ 8 ⇄ 12 ⇄ 56' }],
  },
  'Rotate a doubly linked list by N nodes': {
    text: `Rotate the doubly linked list counter-clockwise by N nodes: the first N nodes move to the end, in order.`,
    ex: [{ in: 'a ⇄ b ⇄ c ⇄ d ⇄ e, N = 2', out: 'c ⇄ d ⇄ e ⇄ a ⇄ b' }],
  },
  'Delete nodes that have a greater value on the right side': {
    text: `Delete every node that has some node with a greater value anywhere to its right. Return the resulting list.`,
    ex: [{ in: '12 → 15 → 10 → 11 → 5 → 6 → 2 → 3', out: '15 → 11 → 6 → 3' }],
  },
  'Segregate even and odd nodes in a linked list': {
    text: `Rearrange the list so that all even-valued nodes come before all odd-valued nodes, keeping the original relative order within each group.`,
    ex: [{ in: '17 → 15 → 8 → 12 → 10 → 5 → 4', out: '8 → 12 → 10 → 4 → 17 → 15 → 5' }],
  },
  'Sort a linked list of 0s, 1s and 2s': {
    text: `The list's values are only 0, 1 and 2. Sort it.`,
    ex: [{ in: '1 → 2 → 2 → 1 → 2 → 0 → 2 → 2', out: '0 → 1 → 1 → 2 → 2 → 2 → 2 → 2' }],
  },
  'Flatten a linked list (each node has a bottom sub-list)': {
    text: `Each node of a main list has a next pointer (to the next head) and a bottom pointer (to a sorted sub-list). The heads are also in sorted order. Flatten everything into a single sorted list linked through bottom.`,
    ex: [{ in: '5(→7→8→30) → 10(→20) → 19(→22→50) → 28(→35→40→45)', out: '5 7 8 10 19 20 22 28 30 35 40 45 50' }],
  },
  'Clone a linked list with next and random pointers': {
    text: `Each node has next and a random pointer that points to any node in the list, or to null. Create a deep copy: new nodes whose next and random pointers point to the new nodes in the matching positions.`,
    ex: [{ in: '[[7,null], [13,0], [11,4], [10,2], [1,0]]  (value, random index)', out: 'An identical structure made of new nodes' }],
  },
  'Merge K sorted linked lists': {
    text: `Given k sorted linked lists, merge them into one sorted list and return its head.`,
    ex: [{ in: '[1→4→5, 1→3→4, 2→6]', out: '1 → 1 → 2 → 3 → 4 → 4 → 5 → 6' }],
  },
  'Multiply two numbers represented by linked lists': {
    text: `Two numbers are stored as linked lists, most significant digit first. Return their product, usually modulo 1e9 + 7 because the numbers can be huge.`,
    ex: [{ in: '3 → 2 and 2', out: '64' }],
  },
  "Program for n'th node from the end of a linked list": {
    text: `Return the value of the nth node from the end of the list, or −1 if the list has fewer than n nodes.`,
    ex: [{ in: '1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9, n = 2', out: '8' }],
  },
  'First non-repeating character in a stream': {
    text: `Characters arrive one at a time. After each one, report the first character so far that has appeared exactly once, or "#" if there is none.`,
    ex: [{ in: '"aabc"', out: '"a#bb"', why: 'After a → a; after aa → #; after aab → b; after aabc → b.' }],
  },
  'Can we reverse a linked list in less than O(n)? / Why quicksort for arrays, merge sort for lists?': {
    text: `Two conceptual questions. (1) Can a singly linked list be reversed faster than O(n)? (2) Why is quicksort preferred for arrays but merge sort for linked lists? Answer each with the reasoning an interviewer expects.`,
  },
  'Deletion from a circular linked list': {
    text: `Delete the node with a given value from a circular linked list. Handle the special cases: deleting the head, deleting the only node, and a value that is not present.`,
    ex: [{ in: '2 → 5 → 7 → 8 → 10 → (2), delete 5', out: '2 → 7 → 8 → 10 → (2)' }],
  },

  // ---------------------------------------------------------------- Stacks & Queues
  'Next Greater Element': {
    text: `For each element, find the first element to its right that is strictly greater. Use −1 when there is none.`,
    ex: [{ in: '[4, 5, 2, 25]', out: '[5, 25, 25, -1]' }, { in: '[13, 7, 6, 12]', out: '[-1, 12, 12, -1]' }],
  },
  'Implement Queue using Stack': {
    text: `Implement a FIFO queue with push, pop, peek and empty, using only two stacks. Every operation should be O(1) amortised.`,
    ex: [{ in: 'push(1), push(2), peek(), pop(), empty()', out: '1, 1, false' }],
  },
  'Design a stack that supports getMin in O(1)': {
    text: `Design a stack that supports push, pop, top and getMin (return the current minimum), each in O(1) time. The hard version allows only O(1) extra space.`,
    ex: [{ in: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', out: '-3, 0, -2' }],
  },
  'Implement a stack from scratch': {
    text: `Implement a stack (LIFO) with push, pop, peek, isEmpty and size, backed by an array or a linked list. Handle popping from an empty stack.`,
    ex: [{ in: 'push(1), push(2), pop(), peek()', out: '2, 1' }],
  },
  'Implement a queue from scratch': {
    text: `Implement a queue (FIFO) with enqueue, dequeue, front, isEmpty and size, where every operation is O(1). A plain array with shift() is O(n) per dequeue.`,
    ex: [{ in: 'enqueue(1), enqueue(2), dequeue(), front()', out: '1, 2' }],
  },
  'Implement two stacks in one array': {
    text: `Implement two independent stacks inside a single fixed-size array so that neither overflows while free space remains anywhere in the array.`,
    ex: [{ in: 'size 5: push1(1), push2(5), push2(4), pop1(), pop2()', out: '1, 4' }],
  },
  'Find the middle element of a stack in O(1)': {
    text: `Design a stack that supports push, pop, findMiddle and deleteMiddle, each in O(1) time.`,
    ex: [{ in: 'push 1, 2, 3, 4, 5 → findMiddle()', out: '3' }],
  },
  'The celebrity problem': {
    text: `At a party of n people, a celebrity is someone everyone knows but who knows nobody. M[i][j] = 1 means person i knows person j. Return the celebrity's index, or −1 if there is none. Aim for O(n).`,
    ex: [{ in: 'M = [[0,1,0], [0,0,0], [0,1,0]]', out: '1', why: 'Everyone knows person 1, and person 1 knows nobody.' }],
  },
  'Evaluate a postfix expression': {
    text: `Evaluate an expression in postfix (Reverse Polish) notation, where every operator comes after its two operands. Integer division truncates toward zero.`,
    ex: [{ in: '["2", "1", "+", "3", "*"]', out: '9', why: '(2 + 1) × 3.' }, { in: '["4", "13", "5", "/", "+"]', out: '6', why: '4 + (13 / 5) = 4 + 2.' }],
  },
  'Evaluate an infix arithmetic expression': {
    text: `Evaluate a normal (infix) expression string with non-negative integers, + − * /, parentheses and spaces, respecting operator precedence. Integer division truncates.`,
    ex: [{ in: '"3 + 2 * 2"', out: '7' }, { in: '"(1 + (4 + 5 + 2) - 3) + (6 + 8)"', out: '23' }],
  },
  'Insert an element at the bottom of a stack using recursion': {
    text: `Push x to the bottom of a stack using only push, pop and recursion — no other data structure.`,
    ex: [{ in: 'stack (bottom → top) [1, 2, 3], x = 0', out: '[0, 1, 2, 3]' }],
  },
  'Reverse a stack using recursion': {
    text: `Reverse a stack using only its push and pop operations and recursion — no extra array or stack.`,
    ex: [{ in: '(bottom → top) [1, 2, 3, 4]', out: '[4, 3, 2, 1]' }],
  },
  'Sort a stack using recursion': {
    text: `Sort a stack so the largest element is on top, using only push, pop, peek and recursion.`,
    ex: [{ in: '(bottom → top) [34, 3, 31, 98, 92, 23]', out: '[3, 23, 31, 34, 92, 98]' }],
  },
  'Largest rectangular area in a histogram': {
    text: `heights[i] is the height of a bar of width 1. Return the area of the largest rectangle that fits entirely inside the histogram.`,
    ex: [{ in: '[2, 1, 5, 6, 2, 3]', out: '10', why: 'The bars of height 5 and 6 give a 5 × 2 rectangle.' }],
  },
  'Length of the longest valid parentheses substring': {
    text: `Given a string of "(" and ")", return the length of its longest substring that is well-formed (balanced).`,
    ex: [{ in: '"(()"', out: '2' }, { in: '")()())"', out: '4', why: '"()()".' }],
  },
  'Check if an expression has redundant brackets': {
    text: `Return true if the expression contains a pair of parentheses with no operator directly inside it, such as "((a+b))" or "(a)".`,
    ex: [{ in: '"((a+b))"', out: 'true' }, { in: '"(a+(b)/c)"', out: 'true', why: '"(b)" is redundant.' }, { in: '"(a+b*(c-d))"', out: 'false' }],
  },
  'Implement a stack using queues': {
    text: `Implement a LIFO stack with push, pop, top and empty using only queue operations (enqueue to the back, dequeue from the front, size).`,
    ex: [{ in: 'push(1), push(2), top(), pop(), empty()', out: '2, 2, false' }],
  },
  'Check if an array is a valid stack permutation of another': {
    text: `Elements of the input array are pushed onto a stack in order, and you may pop at any time. Return true if the output array can be produced as the sequence of popped values.`,
    ex: [{ in: 'input = [1, 2, 3], output = [2, 1, 3]', out: 'true' }, { in: 'input = [1, 2, 3], output = [3, 1, 2]', out: 'false' }],
  },
  'Implement a circular queue': {
    text: `Implement a fixed-capacity circular queue (ring buffer) with enQueue, deQueue, Front, Rear, isEmpty and isFull. The front and rear indices wrap around the array.`,
    ex: [{ in: 'k = 3: enQueue 1, 2, 3, 4 → Rear() → isFull() → deQueue() → enQueue(4) → Rear()', out: 'true, true, true, false, 3, true, true, true, 4' }],
  },
  'LRU Cache': {
    text: `Design a Least Recently Used cache with a fixed capacity. get(key) returns the value, or −1 if absent, and marks the key as recently used. put(key, value) inserts or updates the key; when the cache is full, it first evicts the least recently used key. Both operations must be O(1).`,
    ex: [{ in: 'capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)', out: '1, -1, -1, 3, 4' }],
  },
  'Reverse the first K elements of a queue': {
    text: `Reverse the order of the first k elements of a queue and leave the rest in their original order.`,
    ex: [{ in: '[1, 2, 3, 4, 5], k = 3', out: '[3, 2, 1, 4, 5]' }],
  },
  'Interleave the first half of a queue with the second half': {
    text: `Given a queue of even length, interleave its first half with its second half: first[0], second[0], first[1], second[1], …`,
    ex: [{ in: '[11, 12, 13, 14, 15, 16, 17, 18, 19, 20]', out: '[11, 16, 12, 17, 13, 18, 14, 19, 15, 20]' }],
  },
  'First circular tour that visits all petrol pumps': {
    text: `Petrol pumps sit on a circular road. Pump i gives petrol[i] litres, and reaching the next pump costs distance[i] litres. Starting with an empty tank, return the first pump index from which you can complete the whole circle, or −1 if none works.`,
    ex: [{ in: 'petrol = [4, 6, 7, 4], distance = [6, 5, 3, 5]', out: '1' }],
  },
  'Rotten oranges (minimum time to rot all)': {
    text: `In the grid, 0 is empty, 1 is a fresh orange and 2 is a rotten orange. Every minute, a fresh orange next to a rotten one (up, down, left or right) becomes rotten. Return the minimum number of minutes until no fresh orange remains, or −1 if that never happens.`,
    ex: [{ in: '[[2,1,1], [1,1,0], [0,1,1]]', out: '4' }, { in: '[[2,1,1], [0,1,1], [1,0,1]]', out: '-1', why: 'The bottom-left orange can never be reached.' }],
  },
  'Distance of the nearest 1 in a binary matrix': {
    text: `For every cell of a binary matrix, return the distance (in up/down/left/right steps) to the nearest cell containing 1. The LeetCode variant, 01 Matrix, asks for the nearest 0 instead — same method.`,
    ex: [{ in: '[[0,1,1,0], [1,1,0,0], [0,0,1,1]]', out: '[[1,0,0,1], [0,0,1,1], [1,1,0,0]]' }],
  },
  'First negative integer in every window of size k': {
    text: `For every contiguous window of size k, report its first negative number, or 0 if the window has none.`,
    ex: [{ in: 'arr = [-8, 2, 3, -6, 10], k = 2', out: '[-8, 0, -6, -6]' }],
  },
  'Sum of minimum and maximum of all subarrays of size k': {
    text: `For every contiguous window of size k, add its minimum and its maximum. Return the total over all windows.`,
    ex: [{ in: 'arr = [2, 5, -1, 7, -3, -1, -2], k = 4', out: '18', why: 'Windows give (−1+7) + (−3+7) + (−3+7) + (−3+7) = 18.' }],
  },
  'Minimum sum of squares of character counts after removing k characters': {
    text: `Remove exactly k characters from the string so that the sum of the squares of the remaining character counts is as small as possible. Return that sum.`,
    ex: [{ in: 's = "abccc", k = 1', out: '6', why: 'Remove one c: counts 1, 1, 2 → 1 + 1 + 4.' }],
  },
  'Next Smaller Element': {
    text: `For each element, find the first element to its right that is strictly smaller. Use −1 when there is none.`,
    ex: [{ in: '[4, 8, 5, 2, 25]', out: '[2, 5, 2, -1, -1]' }],
  },
  'Reverse a string / queue using a stack; check balanced parentheses': {
    text: `Three warm-ups that show how a stack works: reverse a string with a stack; reverse a queue with a stack; check that a string of brackets is balanced.`,
    ex: [{ in: 'reverse "stack"', out: '"kcats"' }, { in: 'balanced? "[()]{}"', out: 'true' }],
  },

  // ---------------------------------------------------------------- Binary Trees
  'Level order traversal': {
    text: `Return the tree's node values level by level, from top to bottom and left to right within each level, as a list of levels.`,
    ex: [{ in: 'root = [3, 9, 20, null, null, 15, 7]', out: '[[3], [9, 20], [15, 7]]' }],
  },
  'Check whether a binary tree is a BST or not': {
    text: `Return true if the binary tree is a valid binary search tree: every value in a node's left subtree is strictly smaller than the node, every value in its right subtree is strictly larger, and both subtrees are valid BSTs.`,
    ex: [{ in: '[2, 1, 3]', out: 'true' }, { in: '[5, 1, 4, null, null, 3, 6]', out: 'false', why: '3 is in 5’s right subtree but is smaller than 5.' }],
  },
  'Find the Lowest Common Ancestor in a Binary Tree': {
    text: `Given a binary tree (not a BST) and two nodes p and q, return their lowest common ancestor: the deepest node that has both p and q as descendants. A node counts as a descendant of itself.`,
    ex: [{ in: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', out: '3' }, { in: 'same tree, p = 5, q = 4', out: '5' }],
  },
  'Diameter of a Binary Tree': {
    text: `Return the diameter of the tree: the number of edges on the longest path between any two nodes. The path does not have to pass through the root.`,
    ex: [{ in: '[1, 2, 3, 4, 5]', out: '3', why: 'The path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3).' }],
  },
  'All tree traversals — inorder, preorder, postorder (recursive & iterative), level order, zig-zag': {
    text: `Produce the standard traversals of a binary tree:

Inorder (left, node, right), preorder (node, left, right) and postorder (left, right, node) — both recursively and iteratively with an explicit stack.

Level order (top to bottom), reverse level order, and zig-zag (alternate left→right and right→left on each level).`,
    ex: [{ in: 'root = [1, 2, 3, 4, 5]  (2 has children 4, 5)', out: 'in: 4 2 5 1 3 · pre: 1 2 4 5 3 · post: 4 5 2 3 1 · zig-zag: [[1], [3, 2], [4, 5]]' }],
  },
  'Height, balance check, and mirror of a tree': {
    text: `Three basic recursions. Height (maximum depth): the number of nodes on the longest root-to-leaf path. Balanced: at every node, the heights of the two subtrees differ by at most 1. Mirror (invert): swap every node's left and right children.`,
    ex: [{ in: '[3, 9, 20, null, null, 15, 7]', out: 'height 3, balanced true' }, { in: 'mirror of [4, 2, 7, 1, 3, 6, 9]', out: '[4, 7, 2, 9, 6, 3, 1]' }],
  },
  'Tree views — left, right, top, bottom, diagonal, boundary': {
    text: `Return what is visible from different sides of the tree:

Left / right view — the first / last node on each level. Top / bottom view — the first / last node seen in each vertical column (horizontal distance: root 0, left −1, right +1). Diagonal traversal — group nodes along lines of slope −1. Boundary traversal — the left boundary, then the leaves, then the right boundary in reverse, going anticlockwise.`,
    ex: [{ in: 'root = [1, 2, 3, 4, 5, 6, 7]', out: 'left [1,2,4] · right [1,3,7] · top [4,2,1,3,7] · bottom [4,2,6,3,7] (5 and 6 share a column; the later one wins)' }],
  },
  'Construct a binary tree from inorder + preorder': {
    text: `Given the preorder and inorder traversals of a binary tree with unique values, rebuild the tree and return its root.`,
    ex: [{ in: 'preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]', out: '[3, 9, 20, null, null, 15, 7]' }],
  },
  'Construct a binary tree from its bracket string representation': {
    text: `The string encodes a tree as a value followed by zero, one or two parenthesised subtrees: the first pair is the left child, the second is the right. Build the tree.`,
    ex: [{ in: '"4(2(3)(1))(6(5))"', out: '4 with left 2 (children 3, 1) and right 6 (left child 5)' }],
  },
  'Convert a binary tree to a doubly linked list (in-order)': {
    text: `Convert the tree into a doubly linked list in place, using left as prev and right as next, so that the list follows the in-order sequence. Return the head.`,
    ex: [{ in: '10 with left 12 (children 25, 30) and right 15 (left 36)', out: '25 ⇄ 12 ⇄ 30 ⇄ 10 ⇄ 36 ⇄ 15' }],
  },
  'Convert a binary tree to a sum tree / check if it is a sum tree': {
    text: `(1) Convert: replace each node's value with the sum of all values in its left and right subtrees (the original values); leaves become 0. (2) Check: return true if every non-leaf node already equals the sum of all nodes in its two subtrees.`,
    ex: [{ in: 'convert [10, -2, 6, 8, -4, 7, 5]', out: '[20, 4, 12, 0, 0, 0, 0]' }, { in: 'check [26, 10, 3, 4, 6, null, 3]', out: 'true' }],
  },
  'LCA, distance between two nodes, and Kth ancestor in a binary tree': {
    text: `Three related queries on a binary tree: (1) the lowest common ancestor of two nodes; (2) the number of edges between two nodes, which is depth(a) + depth(b) − 2·depth(LCA); (3) the kth ancestor of a node, or −1 if the node is fewer than k levels deep.`,
    ex: [{ in: 'root = [1, 2, 3, 4, 5, 6, 7]: dist(4, 5), dist(4, 6), 2nd ancestor of 4', out: '2, 4, 1' }],
  },
  'Path sums — longest root-to-leaf sum, largest subtree sum, max non-adjacent sum, K-sum paths': {
    text: `Four sum problems on a binary tree:

Sum of the longest root-to-leaf path — if two paths are equally long, take the larger sum. Largest subtree sum — the maximum sum of any node plus all its descendants. Maximum non-adjacent sum — pick nodes to maximise the sum, never picking both a parent and its child (House Robber III). K-sum paths — count the downward paths (starting and ending anywhere) whose values sum to k.`,
    ex: [{ in: 'K-sum: root = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], k = 8', out: '3', why: '5→3, 5→2→1 and −3→11.' }],
  },
  'Checks — leaves at same level, duplicate subtrees, is-a-tree (graph), min swaps to BST': {
    text: `Four checks:

All leaves at the same level? Does the tree contain two identical subtrees with 2 or more nodes (find all duplicate subtrees)? Is an undirected graph a tree — connected, with no cycle? Minimum swaps to turn a complete binary tree (given as an array) into a BST — this is the minimum number of swaps to sort its in-order sequence.`,
    ex: [{ in: 'min swaps: [5, 6, 7, 8, 9, 10, 11]', out: '3', why: 'In-order is [8, 6, 9, 5, 10, 7, 11]; sorting it takes 3 swaps.' }],
  },
  'Check if all levels of two trees are anagrams': {
    text: `Given two binary trees, return true if, for every level, the multiset of values on that level is the same in both trees.`,
    ex: [{ in: 'tree1 = [1, 3, 2, 5, 4], tree2 = [1, 2, 3, 4, 5]', out: 'true' }],
  },

  // ---------------------------------------------------------------- BSTs
  'BST basics — search, insert, min/max': {
    text: `Implement the core BST operations: search for a value, insert a value while keeping the BST property, and find the minimum and maximum values. Each takes O(h) time, where h is the tree height.`,
    ex: [{ in: 'BST [8, 3, 10, 1, 6, null, 14]: search 6, insert 7, min, max', out: 'found, 7 becomes the right child of 6, 1, 14' }],
  },
  'Delete a node from a BST': {
    text: `Delete the node with a given key from a BST and return the root, keeping the BST property. There are three cases: the node is a leaf, it has one child, or it has two children (replace it with its in-order successor or predecessor).`,
    ex: [{ in: 'root = [5, 3, 6, 2, 4, null, 7], key = 3', out: '[5, 4, 6, 2, null, null, 7]' }],
  },
  'Inorder successor and predecessor in a BST': {
    text: `Given a BST and a key (which may or may not be in the tree), return the in-order predecessor (the largest value smaller than the key) and successor (the smallest value larger than the key).`,
    ex: [{ in: 'BST [50, 30, 70, 20, 40, 60, 80], key = 65', out: 'predecessor 60, successor 70' }],
  },
  'Construct a BST from preorder / validate a preorder sequence': {
    text: `(1) Build the BST whose preorder traversal is the given array. (2) Given an array, return true if it could be the preorder traversal of some BST.`,
    ex: [{ in: 'build from [8, 5, 1, 7, 10, 12]', out: '[8, 5, 10, 1, 7, null, 12]' }, { in: 'valid? [2, 4, 1]', out: 'false' }],
  },
  'Convert a binary tree to a BST / balance a BST / flatten a BST to a sorted list': {
    text: `Three reshaping tasks. (1) Convert a binary tree into a BST while keeping its exact shape. (2) Turn a skewed BST into a height-balanced BST with the same values. (3) Flatten a BST into a sorted list that runs through right pointers, with every left pointer null.`,
    ex: [{ in: 'balance the skewed BST 1 → 2 → 3 → 4 (right children)', out: '[3, 2, 4, 1] or [2, 1, 3, null, null, null, 4]' }],
  },
  'Merge two BSTs': {
    text: `Given two BSTs, return all of their values combined in sorted order, or build a single balanced BST from them. Aim for O(m + n) time.`,
    ex: [{ in: 'BST1 = [3, 1, 5], BST2 = [4, 2, 6]', out: '[1, 2, 3, 4, 5, 6]' }],
  },
  'Kth smallest / Kth largest element in a BST': {
    text: `Return the kth smallest (or kth largest) value in a BST, with k counted from 1.`,
    ex: [{ in: 'root = [5, 3, 6, 2, 4, null, null, 1], k = 3', out: 'kth smallest = 3' }],
  },
  'Count pairs from two BSTs whose sum equals X': {
    text: `Count pairs (a from the first BST, b from the second) with a + b = x.`,
    ex: [{ in: 'BST1 = {1, 3, 5, 6, 7, 8, 10}, BST2 = {2, 3, 4, 5, 6, 8, 9, 11}, x = 16', out: '3', why: '(5, 11), (7, 9) and (8, 8).' }],
  },
  'Median of a BST in O(n) time, O(1) space / count nodes in a range': {
    text: `(1) Return the median of all values in a BST using O(n) time and O(1) extra space (no recursion stack, so use Morris traversal). (2) Count the nodes whose values lie in the range [low, high].`,
    ex: [{ in: 'BST {1, 3, 4, 6, 7, 8, 9}', out: 'median 6' }, { in: 'count in [5, 45] for BST {10, 5, 50, 1, 40, 100}', out: '3' }],
  },
  'Replace each element with the least greater element on its right': {
    text: `Replace each element with the smallest element to its right that is greater than it, or −1 if none exists.`,
    ex: [{ in: '[8, 58, 71, 18, 31, 32, 63, 92, 43, 3, 91, 93, 25, 80, 28]', out: '[18, 63, 80, 25, 32, 43, 80, 93, 80, 25, 93, -1, 28, -1, -1]' }],
  },
  'Find conflicting appointments': {
    text: `Appointments [start, end] arrive in order. Print every appointment that overlaps with any earlier one.`,
    ex: [{ in: '[[1,5], [3,7], [2,6], [10,15], [5,6], [4,100]]', out: '[3,7] conflicts with [1,5]; [2,6] with [1,5]; [5,6] with [3,7]; [4,100] with [1,5]' }],
  },
  'Check whether a BST contains a dead end': {
    text: `The BST holds positive integers. A dead end is a leaf where no new value can be inserted, because both value − 1 and value + 1 are already taken (treat 0 as taken). Return true if the BST contains a dead end.`,
    ex: [{ in: 'BST {8, 5, 2, 3, 7, 11, 4}', out: 'true', why: 'Leaf 4: 3 and 5 are both present.' }],
  },
  'Largest BST subtree in a binary tree': {
    text: `Return the number of nodes in the largest subtree that is itself a valid BST.`,
    ex: [{ in: '[10, 5, 15, 1, 8, null, 7]', out: '3', why: 'The subtree rooted at 5: {5, 1, 8}.' }],
  },

  // ---------------------------------------------------------------- Heap
  'Kth largest element in an array': {
    text: `Return the kth largest element of an unsorted array — by sorted position, not the kth distinct value.`,
    ex: [{ in: 'nums = [3, 2, 1, 5, 6, 4], k = 2', out: '5' }, { in: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', out: '4' }],
  },
  'Implement a binary heap (min & max) with array + sift up/down': {
    text: `Implement a binary heap stored in an array (parent at (i−1)/2, children at 2i+1 and 2i+2) with insert, extractMin (or extractMax), peek and heapify, using sift-up and sift-down.`,
    ex: [{ in: 'insert 5, 3, 8, 1 → extractMin() → peek()', out: '1, 3' }],
  },
  'Heap sort': {
    text: `Sort an array in place by building a max-heap and then repeatedly swapping the maximum to the end and sifting down. O(n log n) time, O(1) space, not stable.`,
    ex: [{ in: '[12, 11, 13, 5, 6, 7]', out: '[5, 6, 7, 11, 12, 13]' }],
  },
  'Maximum of all subarrays of size k (sliding window maximum)': {
    text: `For every contiguous window of size k, return its maximum. Aim for O(n) overall.`,
    ex: [{ in: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', out: '[3, 3, 5, 5, 6, 7]' }],
  },
  'Kth smallest and largest element in an unsorted array': {
    text: `Given an unsorted array of distinct values and k, return the kth smallest and the kth largest element.`,
    ex: [{ in: 'arr = [7, 10, 4, 3, 20, 15], k = 3', out: 'kth smallest 7, kth largest 10' }],
  },
  'Merge K sorted arrays': {
    text: `Given k sorted arrays, return one sorted array containing all their elements. Aim for O(N log k), where N is the total number of elements.`,
    ex: [{ in: '[[1, 3, 5, 7], [2, 4, 6, 8], [0, 9, 10, 11]]', out: '[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]' }],
  },
  'Merge two binary max heaps': {
    text: `Given two max-heaps stored as arrays, return a single valid max-heap array containing all their elements.`,
    ex: [{ in: 'a = [10, 5, 6, 2], b = [12, 7, 9]', out: '[12, 10, 9, 2, 5, 7, 6] (any valid max-heap)' }],
  },
  'Kth largest sum of contiguous subarrays': {
    text: `Consider the sums of all contiguous subarrays. Return the kth largest of these sums.`,
    ex: [{ in: 'arr = [20, -5, -1], k = 3', out: '14', why: 'Sums: 20, 15, 14, −5, −6, −1. The 3rd largest is 14.' }],
  },
  'Smallest range covering elements from K lists': {
    text: `Given k sorted lists, find the smallest range [a, b] that includes at least one number from each list. A range is smaller if it is narrower, or equally wide with a smaller a.`,
    ex: [{ in: '[[4,10,15,24,26], [0,9,12,20], [5,18,22,30]]', out: '[20, 24]' }],
  },
  'Median in a stream of integers': {
    text: `Numbers arrive one at a time. After each insertion, report the median of everything seen so far. Insertion should be O(log n) and reading the median O(1).`,
    ex: [{ in: 'stream 5, 15, 1, 3', out: '5, 10, 5, 4' }],
  },
  'Check whether a binary tree is a heap': {
    text: `Return true if the binary tree is a max-heap: it is complete (every level full except possibly the last, which is filled from the left), and every node is at least as large as its children.`,
    ex: [{ in: '[97, 46, 37, 12, 3, 7, 31, 6, 9]', out: 'true' }],
  },
  'Connect n ropes with minimum cost': {
    text: `Connecting two ropes of lengths a and b costs a + b and produces a rope of length a + b. Return the minimum total cost to connect all the ropes into one.`,
    ex: [{ in: '[4, 3, 2, 6]', out: '29', why: '2+3=5, 4+5=9, 6+9=15 → 5 + 9 + 15.' }],
  },
  'Convert a BST to a min-heap': {
    text: `Given a BST that is a complete binary tree, rearrange its values in place so it becomes a min-heap in which every left subtree's values are smaller than every right subtree's values (preorder = sorted order).`,
    ex: [{ in: 'BST [4, 2, 6, 1, 3, 5, 7]', out: '[1, 2, 5, 3, 4, 6, 7]' }],
  },
  'Minimum sum of two numbers formed from digits of an array': {
    text: `Use every digit in the array exactly once to form two numbers whose sum is as small as possible. Return that sum.`,
    ex: [{ in: '[6, 8, 4, 5, 2, 3]', out: '604', why: '246 + 358.' }],
  },

  // ---------------------------------------------------------------- Trie
  'Construct a trie (insert / search / startsWith)': {
    text: `Implement a prefix tree with insert(word), search(word) (is this exact word stored?) and startsWith(prefix) (does any stored word begin with this prefix?).`,
    ex: [{ in: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', out: 'true, false, true, true' }],
  },
  'Shortest unique prefix for every word': {
    text: `Given a list of words where no word is a prefix of another, return for each word the shortest prefix that identifies it uniquely.`,
    ex: [{ in: '["zebra", "dog", "duck", "dove"]', out: '["z", "dog", "du", "dov"]' }],
  },
  'Word Break (trie solution)': {
    text: `Same as Word Break — can s be split into dictionary words? — but store the dictionary in a trie, so that from each start index you walk forward only along real word prefixes.`,
    ex: [{ in: 's = "ilikesamsung", dict = ["i", "like", "sam", "sung", "samsung"]', out: 'true' }],
  },
  'Implement a phone directory (prefix search)': {
    text: `Given a list of contacts and a query string, return for each prefix of the query (its first 1, 2, … characters) the sorted list of matching contacts, or "0" if none match.`,
    ex: [{ in: 'contacts = ["geeikistest", "geeksforgeeks", "geeksfortest"], query = "geeips"', out: 'g, ge, gee → all three; geei → [geeikistest]; geeip, geeips → 0' }],
  },
  'Print unique rows in a boolean matrix': {
    text: `Print each distinct row of a binary matrix once, in order of first appearance.`,
    ex: [{ in: '[[1,1,0,1], [1,0,0,1], [1,1,0,1]]', out: '1 1 0 1, 1 0 0 1' }],
  },

  // ---------------------------------------------------------------- Bit Manipulation
  'Count set bits in an integer': {
    text: `Return the number of 1 bits in the binary form of a non-negative integer (its Hamming weight).`,
    ex: [{ in: 'n = 11 (1011)', out: '3' }],
  },
  'Find the two non-repeating elements (all others appear twice)': {
    text: `Every element appears exactly twice, except two elements that appear once. Return those two, in O(n) time and O(1) space.`,
    ex: [{ in: '[1, 2, 1, 3, 2, 5]', out: '[3, 5]' }],
  },
  'Count bits to flip to convert A to B': {
    text: `Return how many bits must be flipped to turn integer a into integer b — the number of positions where their bits differ.`,
    ex: [{ in: 'a = 10 (1010), b = 20 (10100)', out: '4' }],
  },
  'Count total set bits in all numbers from 1 to n': {
    text: `Return the total number of 1 bits across the binary forms of every integer from 1 to n. Aim for better than looping over each number.`,
    ex: [{ in: 'n = 4', out: '5', why: '1 (1) + 10 (1) + 11 (2) + 100 (1).' }],
  },
  'Check whether a number is a power of two / find the position of its only set bit': {
    text: `(1) Return true if n is a power of two. (2) If n has exactly one set bit, return that bit's position (counting from 1 at the rightmost bit); otherwise return −1.`,
    ex: [{ in: 'n = 16', out: 'power of two: true; position 5' }, { in: 'n = 12', out: 'false; −1' }],
  },
  'Copy set bits in a given range from one number to another': {
    text: `For every bit position from l to r (1-indexed from the right) that is set in y, set the same bit in x. Return the new x.`,
    ex: [{ in: 'x = 44 (101100), y = 3 (000011), l = 1, r = 5', out: '47 (101111)' }],
  },
  'Divide two integers without *, / or %': {
    text: `Divide dividend by divisor without using multiplication, division or mod, and truncate the result toward zero. Clamp the result to the 32-bit signed range.`,
    ex: [{ in: 'dividend = 10, divisor = 3', out: '3' }, { in: 'dividend = 7, divisor = -3', out: '-2' }],
  },
  'Square a number without *, / or pow()': {
    text: `Return n² without using multiplication, division or pow().`,
    ex: [{ in: 'n = 5', out: '25' }, { in: 'n = -4', out: '16' }],
  },
  'Power set of a set': {
    text: `Return all 2^n subsets of a set of distinct elements, including the empty set.`,
    ex: [{ in: '[a, b, c]', out: '[], [a], [b], [c], [a,b], [a,c], [b,c], [a,b,c]' }],
  },
};
