// Statements: Graph, BackTracking, Greedy, Dynamic Programming (450-sheet solutions).
export const part3 = {
  // ---------------------------------------------------------------- Graph
  'Number of islands': {
    text: `In a grid of "1" (land) and "0" (water), an island is a group of land cells connected up, down, left or right. Return the number of islands.`,
    ex: [{ in: '[["1","1","0","0"], ["1","1","0","0"], ["0","0","1","0"], ["0","0","0","1"]]', out: '3' }],
  },
  'Topological sort of a DAG': {
    text: `Given a directed acyclic graph (n nodes, with edges u → v meaning u must come before v), return any ordering of the nodes in which every edge points forward. In Course Schedule II the edges are prerequisites; return [] if a cycle makes an ordering impossible.`,
    ex: [{ in: 'n = 4, edges = [[1,0], [2,0], [3,1], [3,2]]  (course, prerequisite)', out: '[0, 1, 2, 3] or [0, 2, 1, 3]' }],
  },
  'Represent a graph; BFS and DFS': {
    text: `Build an adjacency list from an edge list, then print the nodes in breadth-first order (level by level from the source) and in depth-first order (go as deep as possible before backtracking).`,
    ex: [{ in: 'edges = [[0,1], [0,2], [1,3], [2,4]], source 0', out: 'BFS 0 1 2 3 4 · DFS 0 1 3 2 4' }],
  },
  'Detect a cycle — directed and undirected': {
    text: `Return true if the graph contains a cycle. Handle both cases: an undirected graph (a visited neighbour that is not your parent means a cycle) and a directed graph (reaching a node still on the current DFS path means a cycle).`,
    ex: [{ in: 'directed: 0→1, 1→2, 2→0', out: 'true' }, { in: 'undirected: 0–1, 1–2', out: 'false' }],
  },
  'Flood fill': {
    text: `Given an image grid, a start pixel (sr, sc) and a new colour, recolour the start pixel and every pixel connected to it (up, down, left or right) that has the same original colour. Return the image.`,
    ex: [{ in: 'image = [[1,1,1], [1,1,0], [1,0,1]], sr = 1, sc = 1, color = 2', out: '[[2,2,2], [2,2,0], [2,0,1]]' }],
  },
  'Clone a graph': {
    text: `Given a reference to one node of a connected undirected graph (each node has a value and a list of neighbours), return a deep copy of the whole graph.`,
    ex: [{ in: 'adjacency = [[2,4], [1,3], [2,4], [1,3]]', out: 'A new graph with the same structure' }],
  },
  'Shortest path on a grid — rat in a maze, knight moves, snake & ladder': {
    text: `Unweighted shortest-path problems, all solved with BFS:

Knight moves — the minimum number of knight moves from a source square to a target square on an n × n board. Snake & ladder — the minimum number of dice throws to go from square 1 to the last square, following snakes and ladders. Maze — the fewest steps from the start to the exit, moving through open cells only.`,
    ex: [{ in: 'knight: n = 6, from (4,5) to (1,1)', out: '3' }],
  },
  'Word Ladder (shortest transformation sequence)': {
    text: `Transform beginWord into endWord by changing one letter at a time, where every intermediate word must be in the word list. Return the number of words in the shortest such sequence (including both ends), or 0 if it is impossible.`,
    ex: [{ in: 'begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]', out: '5', why: 'hit → hot → dot → dog → cog.' }],
  },
  "Dijkstra's shortest paths": {
    text: `Given a weighted graph with non-negative edge weights and a source node, return the shortest distance from the source to every node. Network Delay Time asks for the largest of those distances, or −1 if some node is unreachable.`,
    ex: [{ in: 'edges (u, v, w) = [[2,1,1], [2,3,1], [3,4,1]], n = 4, source = 2', out: 'distances 1:1, 2:0, 3:1, 4:2 → network delay 2' }],
  },
  'Topological sort; job completion times & longest path in a DAG': {
    text: `Using a topological order: (1) print a valid ordering; (2) each job takes 1 unit of time and can start only after its prerequisites finish — find the earliest completion time of every job; (3) find the longest weighted path from a source in a DAG.`,
    ex: [{ in: 'jobs: n = 4, edges 1→2, 1→3, 2→4, 3→4', out: 'completion times: 1, 2, 2, 3' }],
  },
  'Alien dictionary — order of letters': {
    text: `An alien language uses English letters in an unknown order. Given a list of words sorted in that language's order, deduce an order of the letters that is consistent with it, or return "" if the list is contradictory.`,
    ex: [{ in: '["wrt", "wrf", "er", "ett", "rftt"]', out: '"wertf"' }],
  },
  'Minimum spanning tree — Kruskal and Prim': {
    text: `Given a connected, weighted, undirected graph, choose a subset of edges that connects every node with the minimum total weight (a spanning tree with no cycles). Return that weight. Min Cost to Connect All Points is the same problem with Manhattan distance as the edge weight.`,
    ex: [{ in: 'edges (u, v, w) = [[0,1,10], [0,2,6], [0,3,5], [1,3,15], [2,3,4]]', out: '19', why: 'Edges 2–3 (4), 0–3 (5) and 0–1 (10).' }],
  },
  'Bellman–Ford and detecting a negative cycle': {
    text: `Find the shortest distances from a source in a graph whose edges may have negative weights, and report whether the graph contains a negative-weight cycle (in which case shortest paths are undefined).`,
    ex: [{ in: 'edges = [[0,1,-1], [0,2,4], [1,2,3], [1,3,2], [1,4,2], [3,2,5], [3,1,1], [4,3,-3]], source 0', out: '[0, -1, 2, -2, 1], no negative cycle' }],
  },
  'Floyd–Warshall (all-pairs shortest paths)': {
    text: `Given a weighted adjacency matrix (∞ where there is no edge), return the shortest distance between every pair of nodes.`,
    ex: [{ in: '[[0,3,∞,7], [8,0,2,∞], [5,∞,0,1], [2,∞,∞,0]]', out: '[[0,3,5,6], [5,0,2,3], [3,6,0,1], [2,5,7,0]]' }],
  },
  'Check whether a graph is bipartite / the Two-Clique problem': {
    text: `(1) Return true if the nodes can be coloured with two colours so that every edge joins different colours. (2) Two-Clique: return true if the nodes can be split into two groups, each forming a complete subgraph — which holds exactly when the complement graph is bipartite.`,
    ex: [{ in: 'adjacency = [[1,3], [0,2], [1,3], [0,2]]', out: 'true' }, { in: '[[1,2,3], [0,2], [0,1,3], [0,2]]', out: 'false', why: 'The triangle 0–1–2 cannot be 2-coloured.' }],
  },
  'Bridges and articulation points': {
    text: `In an undirected graph, a bridge is an edge whose removal increases the number of connected components. An articulation point is a vertex whose removal does the same. Find them all in O(V + E).`,
    ex: [{ in: 'edges 1–0, 0–2, 2–1, 0–3, 3–4', out: 'bridges: 0–3, 3–4 · articulation points: 0, 3' }],
  },
  'Strongly connected components (Kosaraju)': {
    text: `In a directed graph, a strongly connected component is a maximal set of nodes where every node can reach every other. Count (or list) the SCCs.`,
    ex: [{ in: 'edges 1→0, 0→2, 2→1, 0→3, 3→4', out: '3 SCCs: {0, 1, 2}, {3}, {4}' }],
  },
  'Graph / m-colouring problem': {
    text: `Return true if the graph's vertices can be coloured with at most m colours so that no edge joins two vertices of the same colour.`,
    ex: [{ in: '4 vertices, edges 0–1, 1–2, 2–3, 3–0, 0–2, m = 3', out: 'true' }],
  },
  'Travelling Salesman Problem (exact)': {
    text: `Given a matrix of distances between n cities, return the length of the shortest tour that starts at city 0, visits every city exactly once, and returns to city 0. n is small (about 15 or fewer), so an exponential bitmask DP is expected.`,
    ex: [{ in: '[[0,10,15,20], [10,0,35,25], [15,35,0,30], [20,25,30,0]]', out: '80', why: '0 → 1 → 3 → 2 → 0.' }],
  },
  'Making wired connections / redundant connection (components)': {
    text: `(1) Making Wired Connections: n computers and a list of cables. You may unplug any cable and reconnect it elsewhere. Return the minimum number of moves needed to connect every computer, or −1 if there are too few cables (fewer than n − 1). (2) Redundant Connection: a tree had one extra edge added — return the edge that creates the cycle (the last such edge in the input).`,
    ex: [{ in: 'n = 4, connections = [[0,1], [0,2], [1,2]]', out: '1' }, { in: 'redundant: [[1,2], [1,3], [2,3]]', out: '[2, 3]' }],
  },
  'Journey to the Moon (count invalid pairs)': {
    text: `Astronauts from the same country are linked by the given pairs (and transitively). Count the pairs of astronauts from different countries.`,
    ex: [{ in: 'n = 5, pairs = [[0,1], [2,3], [0,4]]', out: '6', why: 'Countries {0,1,4} and {2,3}: 3 × 2 = 6.' }],
  },
  'Cheapest flights within K stops': {
    text: `Given flights [from, to, price], a source, a destination and k, return the cheapest price from source to destination using at most k stops (k + 1 flights), or −1 if there is no such route.`,
    ex: [{ in: 'n = 4, flights = [[0,1,100], [1,2,100], [2,0,100], [1,3,600], [2,3,200]], src = 0, dst = 3, k = 1', out: '700', why: '0 → 1 → 3. The cheaper 0 → 1 → 2 → 3 uses 2 stops.' }],
  },
  'Water jug problem (reach a target amount)': {
    text: `You have jugs of capacity m and n litres and unlimited water. Each step you may fill a jug, empty a jug, or pour one into the other until the source is empty or the target is full. Return the minimum number of steps to measure exactly d litres in either jug, or −1 if impossible.`,
    ex: [{ in: 'm = 3, n = 5, d = 4', out: '6' }],
  },
  'Minimum edges to reverse to make a path from source to destination': {
    text: `In a directed graph, return the minimum number of edges whose direction must be reversed so that a path exists from source to destination.`,
    ex: [{ in: 'edges 0→1, 2→1, 2→3, 5→1, 4→5, 6→4, 6→3, src = 0, dst = 6', out: '2', why: '0 → 1 → 2 (reverse 2→1) → 3 → 6 (reverse 6→3).' }],
  },
  'Count triangles in a graph': {
    text: `Count the triangles (sets of three mutually connected vertices) in a graph given as an adjacency matrix. Note the directed and undirected counts differ in how duplicates are divided out.`,
    ex: [{ in: 'undirected [[0,1,1,0], [1,0,1,1], [1,1,0,1], [0,1,1,0]]', out: '2', why: '{0,1,2} and {1,2,3}.' }],
  },
  'Minimise cash flow among friends': {
    text: `graph[i][j] is how much person i owes person j. Settle every debt using the fewest transactions (or the smallest total amount moved), by working out each person's net balance.`,
    ex: [{ in: '[[0,1000,2000], [0,0,5000], [0,0,0]]', out: 'Person 1 pays 4000 to person 2; person 0 pays 3000 to person 2' }],
  },
  'Euler path / circuit — Seven Bridges, Chinese Postman': {
    text: `(1) Decide whether an undirected graph has an Euler circuit (every edge used once, ending at the start: all degrees even) or an Euler path (exactly 0 or 2 odd-degree vertices). (2) Chinese Postman: the shortest closed walk that uses every edge at least once — pair up the odd-degree vertices and add the cheapest duplicate paths.`,
    ex: [{ in: 'edges 0–1, 0–2, 1–2, 2–3', out: 'Euler path (vertices 2 and 3 have odd degree), no circuit' }],
  },
  'Vertex Cover Problem': {
    text: `Find a smallest set of vertices such that every edge has at least one endpoint in the set. The problem is NP-hard in general: know the 2-approximation (take both ends of any uncovered edge) and the exact DP for trees.`,
    ex: [{ in: 'edges 0–1, 0–2, 1–3, 3–4, 4–5, 5–6', out: 'e.g. {0, 3, 5} or {0, 3, 4, 6}' }],
  },
  'Oliver and the Game (ancestor check on a rooted tree)': {
    text: `A tree of houses is rooted at 1 (the King's mansion). For each query (type, X, Y), Bob hides at Y. Type 0: can Oliver reach X by moving towards the root from Y? Type 1: can he reach X by moving away from the root from Y? Answer YES/NO. This reduces to "is X an ancestor of Y?" and can be answered with DFS entry/exit times.`,
    ex: [{ in: 'edges 1–2, 1–3, 2–6, 2–7, 6–9, 7–8, 3–4, 3–5, 5–10; query (0, 2, 8)', out: 'YES', why: '8 → 7 → 2 moves towards the root.' }],
  },

  // ---------------------------------------------------------------- BackTracking
  'Print all Subsequences of a string': {
    text: `Print all 2^n subsequences of the string (keep or skip each character, preserving order), including the empty one.`,
    ex: [{ in: '"abc"', out: '"", a, b, c, ab, ac, bc, abc' }],
  },
  'Print all the permutations of the given string': {
    text: `Print every ordering of the string's characters. If characters repeat, print each distinct permutation only once.`,
    ex: [{ in: '"abc"', out: 'abc, acb, bac, bca, cab, cba' }, { in: '"aab"', out: 'aab, aba, baa' }],
  },
  'Rat in a maze — print all paths': {
    text: `A rat starts at (0, 0) of an n × n grid (1 = open, 0 = blocked) and must reach (n−1, n−1). It moves U, D, L or R and cannot revisit a cell. Return every path as a string of moves, in lexicographic order.`,
    ex: [{ in: '[[1,0,0,0], [1,1,0,1], [1,1,0,0], [0,1,1,1]]', out: '["DDRDRR", "DRDDRR"]' }],
  },
  'N-Queens — all solutions': {
    text: `Place n queens on an n × n board so that no two attack each other (same row, column or diagonal). Return every distinct board.`,
    ex: [{ in: 'n = 4', out: '[".Q..","...Q","Q...","..Q."] and ["..Q.","Q...","...Q",".Q.."]' }],
  },
  'Sudoku solver': {
    text: `Fill the empty cells (".") of a 9 × 9 Sudoku so that each row, each column and each 3 × 3 box contains the digits 1–9 exactly once. The puzzle has exactly one solution.`,
    ex: [{ in: 'a partially filled 9 × 9 board', out: 'the completed board' }],
  },
  'Remove minimum invalid parentheses': {
    text: `Remove the minimum number of parentheses to make the string valid, and return every distinct valid result. The string may also contain letters.`,
    ex: [{ in: '"()())()"', out: '["(())()", "()()()"]' }, { in: '"(a)())()"', out: '["(a())()", "(a)()()"]' }],
  },
  'Print all palindromic partitions of a string': {
    text: `Split the string into pieces so that every piece is a palindrome. Return every such split.`,
    ex: [{ in: '"aab"', out: '[["a","a","b"], ["aa","b"]]' }],
  },
  'Subset sum — does any subset add up to the target?': {
    text: `Given non-negative integers and a target sum, return true if some subset of them adds up exactly to the target.`,
    ex: [{ in: 'arr = [3, 34, 4, 12, 5, 2], sum = 9', out: 'true', why: '4 + 5.' }, { in: 'same, sum = 30', out: 'false' }],
  },
  "The Knight's tour": {
    text: `Move a knight around an n × n board so that it visits every square exactly once. Return the board with each square numbered by its visiting order (the backtracking version is usually shown with n = 8).`,
    ex: [{ in: 'n = 5, start (0, 0)', out: 'a 5 × 5 grid numbered 0..24 in knight-move order' }],
  },
  'Combination Sum': {
    text: `Given distinct positive candidates and a target, return every unique combination of candidates that sums to target. Each candidate may be used any number of times, and combinations that differ only in order count once.`,
    ex: [{ in: 'candidates = [2, 3, 6, 7], target = 7', out: '[[2, 2, 3], [7]]' }],
  },
  'Maximum number by doing at most K swaps': {
    text: `Given a number as a string, swap any two digits at most k times to make the largest possible number. Return it.`,
    ex: [{ in: 's = "1234567", k = 4', out: '"7654321"' }, { in: 's = "3435335", k = 3', out: '"5543333"' }],
  },
  'Longest route in a matrix with hurdles / all paths top-left to bottom-right': {
    text: `(1) Longest route: in a grid of 1 (open) and 0 (hurdle), return the length of the longest path from source to destination that never revisits a cell, or −1 if there is none. (2) All paths: print every path from the top-left to the bottom-right corner of an m × n grid, moving only right or down.`,
    ex: [{ in: 'all paths in [[1,2,3], [4,5,6]]', out: '1 4 5 6, 1 2 5 6, 1 2 3 6' }],
  },
  'Kth permutation sequence of 1..N': {
    text: `The n! permutations of [1..n] are listed in lexicographic order. Return the kth one (1-indexed) without generating the others.`,
    ex: [{ in: 'n = 3, k = 3', out: '"213"', why: '123, 132, 213, …' }, { in: 'n = 4, k = 9', out: '"2314"' }],
  },

  // ---------------------------------------------------------------- Greedy
  'Activity selection / N meetings in one room / maximum trains': {
    text: `Given activities (or meetings) with start and end times, select as many as possible that do not overlap, for a single person or room. Maximum Trains applies the same idea separately to each platform.`,
    ex: [{ in: 'start = [1, 3, 0, 5, 8, 5], end = [2, 4, 6, 7, 9, 9]', out: '4', why: 'Meetings 1, 2, 4, 5 (by 1-based index).' }],
  },
  'Job sequencing with deadlines (maximise profit)': {
    text: `Each job takes one unit of time and has a deadline and a profit. Schedule jobs, one at a time, so that each finishes by its deadline and the total profit is maximised. Return the number of jobs done and the profit.`,
    ex: [{ in: 'jobs (deadline, profit) = [(4,20), (1,10), (1,40), (1,30)]', out: '2 jobs, profit 60' }],
  },
  'Huffman coding': {
    text: `Given characters and their frequencies, build an optimal prefix-free binary code: frequent characters get shorter codes, and no code is a prefix of another. Print each character's code, for example in preorder of the Huffman tree.`,
    ex: [{ in: 'chars = "abcdef", freq = [5, 9, 12, 13, 16, 45]', out: 'f: 0, c: 100, d: 101, a: 1100, b: 1101, e: 111' }],
  },
  'Fractional knapsack': {
    text: `Items have values and weights, and the knapsack has capacity W. You may take any fraction of an item. Return the maximum total value you can carry.`,
    ex: [{ in: 'values = [60, 100, 120], weights = [10, 20, 30], W = 50', out: '240', why: 'Take items 1 and 2 whole and 2/3 of item 3.' }],
  },
  'Minimum number of coins / minimum cost of ropes / connect n ropes': {
    text: `(1) Minimum coins: using Indian currency denominations (1, 2, 5, 10, 20, 50, 100, 500, 2000), make change for V with the fewest notes and coins — greedy works for this canonical system. (2) Connect ropes: joining two ropes costs the sum of their lengths; minimise the total cost of joining them all.`,
    ex: [{ in: 'V = 70', out: '[50, 20]' }, { in: 'ropes [4, 3, 2, 6]', out: '29' }],
  },
  'Minimum number of platforms': {
    text: `Given the arrival and departure times of trains at a station, return the minimum number of platforms needed so that no train has to wait.`,
    ex: [{ in: 'arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]', out: '3' }],
  },
  'Array-value greedy tricks — k negations, arr[i]*i, abs-diff sum, three-stack equal sum': {
    text: `Four short greedy problems:

Maximise the array sum after exactly k negations (you may negate the same element more than once). Maximise Σ arr[i]·i by rearranging the array. Arrange the array to maximise the sum of absolute differences between neighbours, treated as a circle. Remove top elements from three stacks until their sums are equal and as large as possible.`,
    ex: [{ in: 'k negations: [-2, 0, 5, -1, 2], k = 4', out: '10' }, { in: 'arr[i]*i: [3, 5, 6, 1]', out: '31', why: 'Sorted [1, 3, 5, 6]: 0 + 3 + 10 + 18.' }],
  },
  'Smallest number with N digits and digit sum S': {
    text: `Return the smallest number that has exactly n digits (no leading zero) whose digits add up to s, or −1 if none exists.`,
    ex: [{ in: 'n = 2, s = 9', out: '18' }, { in: 'n = 3, s = 20', out: '299' }],
  },
  'Minimum cost to cut a board / chocolate into pieces': {
    text: `An m × n board must be cut into 1 × 1 squares. Each horizontal and vertical cut line has its own cost, and a cut's cost is multiplied by the number of pieces it passes through at that moment. Return the minimum total cost.`,
    ex: [{ in: 'x (vertical) = [2, 1, 3, 1, 4], y (horizontal) = [4, 1, 2], board 6 × 4', out: '42' }],
  },
  'Water connection problem': {
    text: `n houses are joined by one-way pipes (at most one pipe in and one out per house, each with a diameter). Put a tank at every house with an outgoing pipe but no incoming one, and a tap at the house where that chain ends. For each tank–tap pair, report the smallest diameter along the chain.`,
    ex: [{ in: 'n = 9, pipes (from, to, d) = [(7,4,98), (5,9,72), (4,6,10), (2,8,22), (9,7,17), (3,1,66)]', out: '(2,8,22), (3,1,66), (5,6,10)' }],
  },
  'Other classic greedy — buy max stocks, candy cost, survive on island, wine trading, amplifiers, K centers, defense of a kingdom': {
    text: `A set of short greedy puzzles:

Buy maximum stocks — on day i you may buy at most i shares at price[i] with a fixed budget. Candy store — for every candy you buy, you get up to k others free; find the minimum and maximum total cost. Survive on an island — food lasts s days and the shop is shut on Sundays. Wine trading (GERGOVIA) — houses buy or sell wine, and moving one bottle one house costs 1. Arranging amplifiers — order the numbers to maximise a tower of powers. K centres — choose k cities to minimise the largest distance to the nearest centre. Defense of a kingdom — find the largest rectangle with no tower in its row or column.`,
    ex: [{ in: 'buy stocks: price = [10, 7, 19], budget = 45', out: '4', why: 'Buy 1 at 10 (day 1) and 2 at 7 (day 2) = 24, then 1 at 19.' }],
  },

  // ---------------------------------------------------------------- Dynamic Programming
  'Nth Fibonacci Number': {
    text: `Return the nth Fibonacci number, where F(0) = 0, F(1) = 1 and F(n) = F(n−1) + F(n−2). It is the standard way to show naive recursion → memoisation → tabulation → O(1) space.`,
    ex: [{ in: 'n = 10', out: '55' }],
  },
  'Coin Change Problem': {
    text: `Given coin denominations (unlimited supply) and an amount, return the fewest coins that make up the amount, or −1 if it cannot be made. Coin Change II asks instead for the number of distinct combinations.`,
    ex: [{ in: 'coins = [1, 2, 5], amount = 11', out: '3', why: '5 + 5 + 1.' }, { in: 'coins = [2], amount = 3', out: '-1' }],
  },
  '0-1 Knapsack Problem': {
    text: `n items each have a weight and a value, and the knapsack has capacity W. Take each item whole or not at all. Return the maximum total value whose total weight is at most W.`,
    ex: [{ in: 'values = [60, 100, 120], weights = [10, 20, 30], W = 50', out: '220', why: 'Items 2 and 3.' }],
  },
  'Longest Common Subsequence': {
    text: `Return the length of the longest sequence of characters that appears, in order but not necessarily contiguously, in both strings.`,
    ex: [{ in: 'a = "abcde", b = "ace"', out: '3', why: '"ace".' }, { in: 'a = "abc", b = "def"', out: '0' }],
  },
  'Longest Increasing Subsequence': {
    text: `Return the length of the longest strictly increasing subsequence (not necessarily contiguous). The O(n log n) solution is the expected follow-up.`,
    ex: [{ in: '[10, 9, 2, 5, 3, 7, 101, 18]', out: '4', why: '[2, 3, 7, 101].' }],
  },
  'Combinatorial DP — binomial coefficient, Catalan number, derangements, count balanced BSTs of height h': {
    text: `Counting problems solved with recurrences, usually modulo 1e9 + 7:

Binomial coefficient C(n, r) (and the permutation coefficient P(n, r)). The nth Catalan number — the number of BSTs with n keys, or of valid parenthesis strings. Derangements — permutations where no element stays in its original position. The number of balanced binary trees of height h.`,
    ex: [{ in: 'C(5, 2), Catalan(4), derangements(4)', out: '10, 14, 9' }],
  },
  'Matrix Chain Multiplication': {
    text: `Matrix i has dimensions p[i−1] × p[i]. Choose where to put the parentheses in the product so that the total number of scalar multiplications is as small as possible. Return that minimum.`,
    ex: [{ in: 'p = [40, 20, 30, 10, 30]', out: '26000', why: '(A(BC))D.' }],
  },
  'Fence / tiling recurrences — painting the fence, friends pairing, cut segments, keypad, coin game, score-ways, ways to reach a score': {
    text: `Short 1-D recurrences:

Painting the fence — n posts and k colours, with no more than two adjacent posts the same colour. Friends pairing — each of n friends stays single or pairs with one other. Maximise cut segments — cut a length n into as many pieces of lengths x, y or z as possible. Mobile keypad — count the n-digit numbers where each next digit is the same key or an adjacent one. Ways to reach a score — using moves of 3, 5 and 10, counting combinations.`,
    ex: [{ in: 'fence n = 3, k = 2', out: '6' }, { in: 'friends pairing n = 3', out: '4' }],
  },
  'Grid path DP — Gold Mine, Min Cost Path, max square submatrix of 1s, maximum sum rectangle': {
    text: `Grid DP problems:

Gold mine — start anywhere in the first column and move right, up-right or down-right, collecting as much gold as possible. Minimum cost path (Minimum Path Sum) — from the top-left to the bottom-right moving right or down, minimise the sum. Largest square of 1s (Maximal Square). Maximum sum rectangle — the submatrix with the largest sum (Kadane's algorithm over column pairs).`,
    ex: [{ in: 'min path sum [[1,3,1], [1,5,1], [4,2,1]]', out: '7', why: '1→3→1→1→1.' }, { in: 'maximal square [["1","0","1","0","0"], ["1","0","1","1","1"], ["1","1","1","1","1"], ["1","0","0","1","0"]]', out: '4' }],
  },
  'Subsequence DP — max sum increasing, longest with adjacent diff one, no three consecutive, alternating, product < K, chain of pairs': {
    text: `Variations on LIS and House Robber:

Maximum sum increasing subsequence. The longest subsequence where adjacent elements differ by exactly 1. The maximum sum with no three consecutive elements taken. The longest alternating (zig-zag) subsequence. The number of subsequences with product less than k. The longest chain of pairs, where (a, b) can be followed by (c, d) only if b < c.`,
    ex: [{ in: 'max sum increasing: [1, 101, 2, 3, 100, 4, 5]', out: '106', why: '1 + 2 + 3 + 100.' }],
  },
  'String DP — longest common substring, LCS of three strings, space-optimised LCS, interleaving, boolean parenthesization': {
    text: `Two-string (and three-string) DPs:

Longest common substring — must be contiguous in both strings. LCS of three strings. LCS in O(min(m, n)) space. Interleaving String — can s3 be formed by interleaving s1 and s2 while keeping each string's order? Boolean parenthesization — count the ways to parenthesise a T/F expression with & | ^ so that it evaluates to true.`,
    ex: [{ in: 'interleave s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', out: 'true' }, { in: 'longest common substring "ABCDGH", "ACDGHR"', out: '4 ("CDGH")' }],
  },
  'Knapsack family — 0/1 partition, unbounded, min cost to fill a bag, min removals for range': {
    text: `Knapsack variations:

Partition Equal Subset Sum — can the array be split into two parts with equal sums? Unbounded knapsack — each item can be taken any number of times. Minimum cost to fill a bag of exactly W kg, where cost[i] is the price of an i kg packet (−1 means unavailable). Minimum removals so that max − min ≤ k.`,
    ex: [{ in: 'partition [1, 5, 11, 5]', out: 'true', why: '[1, 5, 5] and [11].' }, { in: 'partition [1, 2, 3, 5]', out: 'false' }],
  },
  'Egg dropping': {
    text: `You have e eggs and a building with f floors. An egg breaks when dropped from any floor above an unknown threshold. Return the minimum number of drops that guarantees you find the threshold, in the worst case.`,
    ex: [{ in: 'e = 2, f = 10', out: '4' }, { in: 'e = 2, f = 100', out: '14' }],
  },
  'Game DP — optimal strategy for a game, coin game winner': {
    text: `(1) Optimal strategy: coins are in a row, and two players alternately take a coin from either end. Both play optimally. Return the maximum amount the first player can guarantee. (2) Coin game winner: from a pile of n coins, a player removes 1, x or y coins per turn, and whoever takes the last coin wins. Decide whether the first player wins.`,
    ex: [{ in: 'optimal strategy [5, 3, 7, 10]', out: '15', why: 'Take 10, then 5.' }],
  },
  'Optimal BST': {
    text: `Sorted keys have search frequencies. Build a BST that minimises the total search cost Σ frequency × depth (the root is at depth 1). Return that cost.`,
    ex: [{ in: 'keys = [10, 12, 20], freq = [34, 8, 50]', out: '142' }],
  },
  'Palindrome partitioning — minimum cuts': {
    text: `Return the minimum number of cuts needed to split the string into pieces that are all palindromes.`,
    ex: [{ in: '"aab"', out: '1', why: '"aa" | "b".' }, { in: '"ababbbabbababa"', out: '3' }],
  },
  'Largest Independent Set in a tree': {
    text: `Return the size of the largest set of tree nodes in which no two nodes are connected by an edge (no parent–child pair). With node values instead of counts, this is House Robber III.`,
    ex: [{ in: '10 with children 20, 30; 20 has children 40, 50; 30 has right child 60; 50 has children 70, 80', out: '5', why: '{10, 40, 60, 70, 80}.' }],
  },
  'Best time to buy and sell a stock at most K times': {
    text: `prices[i] is the price on day i. Complete at most k transactions, never holding more than one share at a time. Return the maximum profit.`,
    ex: [{ in: 'k = 2, prices = [3, 2, 6, 5, 0, 3]', out: '7', why: 'Buy at 2, sell at 6; buy at 0, sell at 3.' }],
  },
  'Smallest sum contiguous subarray / max difference of zeros and ones in a binary string': {
    text: `(1) Return the smallest sum of any contiguous subarray (Kadane's algorithm with min). (2) In a binary string, find the substring that maximises (number of 0s) − (number of 1s), or −1 if the string is all 1s.`,
    ex: [{ in: 'smallest sum [3, -4, 2, -3, -1, 7, -5]', out: '-6', why: '[-4, 2, -3, -1].' }, { in: 'zeros − ones "11000010001"', out: '6' }],
  },
  'Longest Palindromic Subsequence': {
    text: `Return the length of the longest subsequence (not necessarily contiguous) that is a palindrome.`,
    ex: [{ in: '"bbbab"', out: '4', why: '"bbbb".' }, { in: '"cbbd"', out: '2' }],
  },
  'Optimum location of a point to minimise total distance': {
    text: `Given points and a line ax + by + c = 0, find the point on the line that minimises the sum of Euclidean distances to all the points. Return that minimum sum. The sum is unimodal along the line, so ternary search works.`,
    ex: [{ in: 'line x − y − 3 = 0, points [(-3,-2), (-1,0), (-1,2), (1,2), (3,4)]', out: '≈ 20.77' }],
  },
  'Rasta and Kheshtak (largest common square submatrix pattern)': {
    text: `Given two matrices of integers, return the side length of the largest square pattern that appears in both. Binary-search the side length and compare 2-D rolling hashes of the squares.`,
    ex: [{ in: 'two small matrices sharing a 2 × 2 block', out: '2' }],
  },
  'Maximum sum such that no two elements are adjacent (House Robber)': {
    text: `Pick elements of the array so that no two chosen elements are adjacent, maximising their sum. In House Robber the values are money in houses along a street.`,
    ex: [{ in: '[2, 7, 9, 3, 1]', out: '12', why: '2 + 9 + 1.' }],
  },
};
