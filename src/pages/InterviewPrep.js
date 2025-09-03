import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Added Link import for navigation
import './InterviewPrep.css';

const mockQuestions = [
  {
    id: 1,
    title: "Two Sum Problem",
    company: "Amazon",
    topic: "DSA",
    difficulty: "Easy",
    description: "Find two numbers that add up to target",
    solution: "Use hashmap to store complement and index",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: [2,7,11,15], target=9 → Output: [0,1]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 2,
    title: "Reverse a Linked List",
    company: "Google",
    topic: "DSA",
    difficulty: "Medium",
    description: "Reverse a singly linked list",
    solution: "Iterate through the list and reverse pointers",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: 1 -> 2 -> 3 → Output: 3 -> 2 -> 1",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 3,
    title: "Find the Longest Substring Without Repeating Characters",
    company: "Microsoft",
    topic: "DSA",
    difficulty: "Medium",
    description: "Given a string, find the length of the longest substring without repeating characters.",
    solution: "Use sliding window technique with a set to track characters.",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: 'abcabcbb' → Output: 3 ('abc')",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 4,
    title: "Implement a LRU Cache",
    company: "Amazon",
    topic: "DSA",
    difficulty: "Hard",
    description: "Design and implement a data structure for Least Recently Used (LRU) cache.",
    solution: "Use a combination of a hashmap and a doubly linked list to maintain order.",
    complexity: "Time: O(1) for get/put, Space: O(n)",
    io: "Input: [get, put, get, put, get, get, get], [1, 1, 2, 2, 3, 4, 5] → Output: [1, null, 2, null, 3, 4]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 5,
    title: "Binary Search Tree Validation",
    company: "Google",
    topic: "DSA",
    difficulty: "Medium",
    description: "Check if a binary tree is a valid binary search tree.",
    solution: "Use in-order traversal to check if values are in sorted order.",
    complexity: "Time: O(n), Space: O(h) where h is height of tree",
    io: "Input: [2,1,3] → Output: true; Input: [5,1,4,null,null,3,6] → Output: false",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 6,
    title: "Merge Intervals",
    company: "Microsoft",
    topic: "DSA",
    difficulty: "Medium",
    description: "Merge overlapping intervals in a list of intervals.",
    solution: "Sort intervals by start time and merge overlapping ones.",
    complexity: "Time: O(n log n), Space: O(n)",
    io: "Input: [[1,3],[2,6],[8,10],[15,18]] → Output: [[1,6],[8,10],[15,18]]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 7,
    title: "Find Median from Data Stream",
    company: "Amazon",
    topic: "DSA",
    difficulty: "Hard",
    description: "Design a data structure that supports adding numbers and finding the median efficiently.",
    solution: "Use two heaps (max-heap and min-heap) to maintain the lower and upper halves of the data.",
    complexity: "Time: O(log n) for addNum, O(1) for findMedian; Space: O(n)",
    io: "Input: [addNum(1), addNum(2), findMedian(), addNum(3), findMedian()] → Output: [1.5, 2]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 8,
    title: "Kth Largest Element in an Array",
    company: "Google",
    topic: "DSA",
    difficulty: "Medium",
    description: "Find the kth largest element in an unsorted array.",
    solution: "Use Quickselect algorithm or a min-heap to find the kth largest element.",
    complexity: "Time: O(n) on average, O(n^2) worst case; Space: O(1) or O(k) for heap",
    io: "Input: [3,2,1,5,6,4], k=2 → Output: 5",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 9,
    title: "Top K Frequent Elements",
    company: "Microsoft",
    topic: "DSA",
    difficulty: "Medium",
    description: "Given a non-empty array of integers, return the k most frequent elements.",
    solution: "Use a hash map to count the frequency of each element, then use a min-heap to find the top k elements.",
    complexity: "Time: O(n log k), Space: O(n)",
    io: "Input: [1,1,1,2,2,3], k=2 → Output: [1,2]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 10,
    title: "Valid Parentheses",
    company: "Amazon",
    topic: "DSA",
    difficulty: "Easy",
    description: "Check if a string of parentheses is valid.",
    solution: "Use a stack to track opening parentheses and ensure they are closed in the correct order.",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: '()[]{}' → Output: true; Input: '(]' → Output: false",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 11,
    title: "Longest Palindromic Substring",
    company: "Google",
    topic: "DSA",
    difficulty: "Medium",
    description: "Given a string, find the longest palindromic substring.",
    solution: "Use a helper function to check if a substring is palindromic, then iterate through all substrings.",
    complexity: "Time: O(n^2), Space: O(1)",
    io: "Input: 'babad' → Output: 'bab' or 'aba'",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 12,
    title: "Search in Rotated Sorted Array",
    company: "Microsoft",
    topic: "DSA",
    difficulty: "Medium",
    description: "Search for a target value in a rotated sorted array.",
    solution: "Use binary search to find the target, adjusting for the rotation.",
    complexity: "Time: O(log n), Space: O(1)",
    io: "Input: [4,5,6,7,0,1,2], target=0 → Output: 4; Input: [4,5,6,7,0,1,2], target=3 → Output: -1",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 13,
    title: "Find All Anagrams in a String",
    company: "Amazon",
    topic: "DSA",
    difficulty: "Medium",
    description: "Given a string s and a non-empty string p, find all the start indices of p's anagrams in s.",
    solution: "Use a sliding window approach with character counts to find anagrams.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: s = \"abxaba\", p = \"ab\" → Output: [0, 3, 4]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 14,
    title: "Maximum Subarray",
    company: "Google",
    topic: "DSA",
    difficulty: "Easy",
    description: "Find the contiguous subarray within an array which has the largest sum.",
    solution: "Use Kadane's algorithm to keep track of the maximum sum and the current sum.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6 (subarray [4,-1,2,1])",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 15,
    title: "Climbing Stairs",
    company: "Facebook",
    topic: "DSA",
    difficulty: "Easy",
    description: "You can either climb 1 or 2 steps at a time, find the number of distinct ways to climb to the top.",
    solution: "Use dynamic programming to build up the number of ways to reach each step.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: n = 4 → Output: 5",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 16,
    title: "Longest Increasing Subsequence",
    company: "Amazon",
    topic: "DSA",
    difficulty: "Medium",
    description: "Given an unsorted array of integers, find the length of the longest increasing subsequence.",
    solution: "Use dynamic programming to find the longest increasing subsequence.",
    complexity: "Time: O(n^2), Space: O(n)",
    io: "Input: [10,9,2,5,3,7,101,18] → Output: 4 (subsequence [2,3,7,101])",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 17,
    title: "Course Schedule",
    company: "Google",
    topic: "DSA",
    difficulty: "Medium",
    description: "Determine if you can finish all courses given prerequisites.",
    solution: "Use topological sorting to check for cycles in the directed graph of courses.",
    complexity: "Time: O(n + m), Space: O(n + m)",
    io: "Input: numCourses = 2, prerequisites = [[1,0]] → Output: true; Input: numCourses = 2, prerequisites = [[1,0],[0,1]] → Output: false",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 18,
    title: "Binary Tree Level Order Traversal",
    company: "Microsoft",
    topic: "DSA",
    difficulty: "Medium",
    description: "Return the level order traversal of a binary tree's nodes' values.",
    solution: "Use a queue to perform a breadth-first traversal of the tree.",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: [3,9,20,null,null,15,7] → Output: [[3],[9,20],[15,7]]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 19,
    title: "Word Ladder",
    company: "Facebook",
    topic: "DSA",
    difficulty: "Hard",
    description: "Find the length of shortest transformation sequence from beginWord to endWord.",
    solution: "Use BFS to find the shortest path between words.",
    complexity: "Time: O(M^2 * N), Space: O(M^2 * N)",
    io: "Input: beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog'] → Output: 5",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 20,
    title: "Trapping Rain Water",
    company: "Apple",
    topic: "DSA",
    difficulty: "Hard",
    description: "Calculate how much water can be trapped after raining.",
    solution: "Use two pointers or dynamic programming to find trapped water.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 101,
    title: "Design URL Shortener",
    company: "Google",
    topic: "System Design",
    difficulty: "Medium",
    description: "Design a scalable URL shortening service.",
    solution: "Use hash functions and distributed database to store mappings.",
    complexity: "Depends on scale",
    io: "Input: long URL → Output: short URL",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 102,
    title: "Design a Cache System",
    company: "Amazon",
    topic: "System Design",
    difficulty: "Medium",
    description: "Design a cache system with eviction policies.",
    solution: "Use LRU or LFU algorithms to manage cache entries.",
    complexity: "Depends on cache size",
    io: "Input: key-value pairs → Output: cached value",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 103,
    title: "Design a Messaging System",
    company: "Facebook",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a real-time messaging system that supports millions of users.",
    solution: "Use message queues, WebSockets, and a distributed database for scalability.",
    complexity: "Depends on scale",
    io: "Input: user messages → Output: delivered messages",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 104,
    title: "Design a Social Media Feed",
    company: "Microsoft",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a news feed system for a social media platform.",
    solution: "Use push/pull models with fanout strategies and caching.",
    complexity: "Depends on scale",
    io: "Input: user posts → Output: personalized feed",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 105,
    title: "Design a Video Streaming Service",
    company: "Netflix",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a scalable video streaming platform like Netflix.",
    solution: "Use CDN, video encoding, and distributed storage systems.",
    complexity: "Depends on scale",
    io: "Input: video content → Output: streamed video",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 106,
    title: "Design a Search Engine",
    company: "Google",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a web search engine with indexing and ranking.",
    solution: "Use web crawlers, inverted index, and PageRank algorithm.",
    complexity: "Depends on scale",
    io: "Input: search query → Output: ranked results",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 107,
    title: "Design a Ride Sharing Service",
    company: "Apple",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a ride-sharing platform like Uber.",
    solution: "Use geospatial indexing, real-time matching, and payment processing.",
    complexity: "Depends on scale",
    io: "Input: ride request → Output: matched driver",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 108,
    title: "Design a Chat Application",
    company: "Amazon",
    topic: "System Design",
    difficulty: "Medium",
    description: "Design a real-time chat application.",
    solution: "Use WebSockets, message queues, and database partitioning.",
    complexity: "Depends on scale",
    io: "Input: chat messages → Output: delivered messages",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 109,
    title: "Design a File Storage System",
    company: "Facebook",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a distributed file storage system like Dropbox.",
    solution: "Use data deduplication, metadata service, and sync protocols.",
    complexity: "Depends on scale",
    io: "Input: files → Output: stored and synced files",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 110,
    title: "Design a Payment System",
    company: "Microsoft",
    topic: "System Design",
    difficulty: "Hard",
    description: "Design a secure payment processing system.",
    solution: "Use transaction logs, encryption, and fraud detection.",
    complexity: "Depends on scale",
    io: "Input: payment request → Output: processed payment",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 201,
    title: "Normalize Database Schema",
    company: "Microsoft",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Given tables, normalize them to 3NF to avoid redundancy.",
    solution: "Decompose tables into smaller tables without losing data.",
    complexity: "Depends on schema",
    io: "Input: Denormalized tables → Output: Normalized tables",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 202,
    title: "Write SQL Query to Find Top N Employees",
    company: "Google",
    topic: "DBMS",
    difficulty: "Easy",
    description: "Write a SQL query to find the top N employees by salary.",
    solution: "Use ORDER BY and LIMIT clauses to get the top N records.",
    complexity: "Time: O(n log n) for sorting, Space: O(n)",
    io: "Input: Employee table with salary column, N=5 → Output: Top 5 employees by salary",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 203,
    title: "Design a Database for E-commerce",
    company: "Amazon",
    topic: "DBMS",
    difficulty: "Hard",
    description: "Design a database schema for an e-commerce platform.",
    solution: "Use tables for users, products, orders, and reviews with appropriate relationships.",
    complexity: "Depends on features",
    io: "Input: Requirements → Output: Database schema",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 204,
    title: "Find Duplicate Records",
    company: "Facebook",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Write a SQL query to find duplicate records in a table.",
    solution: "Use GROUP BY and HAVING clauses to identify duplicates.",
    complexity: "Time: O(n log n), Space: O(n)",
    io: "Input: Table with duplicate records → Output: Duplicate records",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 205,
    title: "Database Indexing Strategy",
    company: "Apple",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Design indexing strategy for a large database.",
    solution: "Use B-tree indexes for range queries and hash indexes for equality queries.",
    complexity: "Depends on query patterns",
    io: "Input: Query patterns → Output: Index strategy",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 206,
    title: "SQL Query Optimization",
    company: "Netflix",
    topic: "DBMS",
    difficulty: "Hard",
    description: "Optimize a slow-running SQL query.",
    solution: "Analyze execution plan, add indexes, and rewrite query structure.",
    complexity: "Depends on query complexity",
    io: "Input: Slow query → Output: Optimized query",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 207,
    title: "Design Database Partitioning",
    company: "Google",
    topic: "DBMS",
    difficulty: "Hard",
    description: "Design a partitioning strategy for a large table.",
    solution: "Use horizontal or vertical partitioning based on access patterns.",
    complexity: "Depends on data size",
    io: "Input: Large table → Output: Partitioned tables",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 208,
    title: "Transaction Management",
    company: "Microsoft",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Handle concurrent transactions with ACID properties.",
    solution: "Use locking mechanisms and transaction isolation levels.",
    complexity: "Depends on concurrency",
    io: "Input: Concurrent transactions → Output: Consistent state",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 209,
    title: "Database Backup Strategy",
    company: "Amazon",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Design a backup and recovery strategy for a database.",
    solution: "Use full, incremental, and differential backups with point-in-time recovery.",
    complexity: "Depends on data size",
    io: "Input: Database → Output: Backup strategy",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 210,
    title: "NoSQL vs SQL Decision",
    company: "Facebook",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Choose between SQL and NoSQL databases for a specific use case.",
    solution: "Analyze consistency, scalability, and query requirements.",
    complexity: "Depends on use case",
    io: "Input: Requirements → Output: Database choice",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 211,
    title: "Database Indexing",
    company: "Google",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Explain how indexing works in databases and its benefits.",
    solution: "Indexes are data structures that improve query performance by allowing faster lookups.",
    complexity: "Time: O(log n) for indexed queries, Space: O(n) for index storage",
    io: "Input: Table with indexed column → Output: Faster query performance",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 212,
    title: "Database Normalization",
    company: "Microsoft",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Explain the process of database normalization and its advantages.",
    solution: "Normalization is the process of organizing data to reduce redundancy and improve data integrity.",
    complexity: "Time: O(n) for normalization, Space: O(n) for normalized tables",
    io: "Input: Denormalized table → Output: Normalized tables",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 213,
    title: "Database Denormalization",
    company: "Amazon",
    topic: "DBMS",
    difficulty: "Medium",
    description: "Explain the process of database denormalization and its advantages.",
    solution: "Denormalization is the process of combining tables to improve read performance at the cost of write performance.",
    complexity: "Time: O(n) for denormalization, Space: O(n) for denormalized tables",
    io: "Input: Normalized tables → Output: Denormalized tables",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 301,
    title: "Rotate Array",
    company: "Google",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Rotate an array to the right by k steps.",
    solution: "Use a temporary array to store the rotated elements.",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: [1,2,3,4,5], k=2 → Output: [4,5,1,2,3]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 302,
    title: "Find Missing Number",
    company: "Amazon",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the missing number in an array containing n distinct numbers from 0 to n.",
    solution: "Use the formula n(n+1)/2 to find the expected sum and subtract the actual sum.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [0,1,2,3,5] → Output: 4",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 303,
    title: "Find Duplicate in Array",
    company: "Microsoft",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the duplicate number in an array containing n+1 integers where each integer is between 1 and n.",
    solution: "Use Floyd's Tortoise and Hare algorithm to detect cycle.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [1,3,4,2,2] → Output: 2",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 304,
    title: "Maximum Product Subarray",
    company: "Facebook",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find the contiguous subarray within an array which has the largest product.",
    solution: "Use dynamic programming to keep track of maximum and minimum products at each step.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [2,3,-2,4] → Output: 6 (subarray [2,3])",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 305,
    title: "Container With Most Water",
    company: "Apple",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find two lines that together with the x-axis form a container that holds the most water.",
    solution: "Use two pointers to find the maximum area between lines.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [1,8,6,2,5,4,8,3,7] → Output: 49",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 306,
    title: "3Sum Problem",
    company: "Netflix",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find all unique triplets in the array that sum to zero.",
    solution: "Sort array and use two pointers for each element.",
    complexity: "Time: O(n^2), Space: O(1)",
    io: "Input: [-1,0,1,2,-1,-4] → Output: [[-1,-1,2],[-1,0,1]]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 307,
    title: "Product of Array Except Self",
    company: "Google",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Return an array such that output[i] is equal to the product of all elements except nums[i].",
    solution: "Use left and right product arrays or optimize with single pass.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [1,2,3,4] → Output: [24,12,8,6]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 308,
    title: "Best Time to Buy and Sell Stock",
    company: "Amazon",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the maximum profit from buying and selling stock once.",
    solution: "Track minimum price and maximum profit in single pass.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [7,1,5,3,6,4] → Output: 5",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 309,
    title: "Sliding Window Maximum",
    company: "Microsoft",
    topic: "Arrays",
    difficulty: "Hard",
    description: "Find the maximum element in each sliding window of size k.",
    solution: "Use deque to maintain elements in decreasing order.",
    complexity: "Time: O(n), Space: O(k)",
    io: "Input: [1,3,-1,-3,5,3,6,7], k=3 → Output: [3,3,5,5,6,7]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 310,
    title: "Subarray Sum Equals K",
    company: "Facebook",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find the total number of continuous subarrays whose sum equals to k.",
    solution: "Use hashmap to store cumulative sums and their frequencies.",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: [1,1,1], k=2 → Output: 2",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 311,
    title: "Maximum Subarray Sum Circular",
    company: "Google",
    topic: "Arrays",
    difficulty: "Hard",
    description: "Find the maximum subarray sum in a circular array.",
    solution: "Calculate maximum subarray sum using Kadane's algorithm and also consider the case of circular subarrays.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [1,-2,3,-2] → Output: 3 (subarray [3])",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 312,
    title: "Find All Pairs with a Given Sum",
    company: "Amazon",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find all pairs in an array that sum up to a specific target.",
    solution: "Use a hashmap to store the elements and check for complements.",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: [1,2,3,4,5], target=7 → Output: [[2,5],[3,4]]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 313,
    title: "Maximum Consecutive Ones",
    company: "Facebook",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find the maximum number of consecutive 1s in a binary array.",
    solution: "Use a counter to track the length of consecutive 1s.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [1,1,0,1,1,1] → Output: 3",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 314,
    title: "Two Sum II - Input Array is Sorted",
    company: "Google",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find two elements in a sorted array that sum up to a target value.",
    solution: "Use two pointers, one at the start and one at the end of the array.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: [2,7,11,15], target=9 → Output: [1,2] (1-based index)",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 401,
    title: "Check Anagram",
    company: "Google",
    topic: "Strings",
    difficulty: "Easy",
    description: "Check if two strings are anagrams of each other.",
    solution: "Sort both strings and compare them.",
    complexity: "Time: O(n log n), Space: O(1)",
    io: "Input: 'listen', 'silent' → Output: true",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 402,
    title: "Longest Common Prefix",
    company: "Amazon",
    topic: "Strings",
    difficulty: "Easy",
    description: "Find the longest common prefix among an array of strings.",
    solution: "Iterate through characters of the first string and compare with others.",
    complexity: "Time: O(n * m), Space: O(1) where n is number of strings and m is length of shortest string",
    io: "Input: ['flower', 'flow', 'flight'] → Output: 'fl'",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 403,
    title: "Valid Palindrome",
    company: "Microsoft",
    topic: "Strings",
    difficulty: "Easy",
    description: "Check if a string is a valid palindrome, ignoring non-alphanumeric characters.",
    solution: "Use two pointers to compare characters from both ends.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: 'A man, a plan, a canal: Panama' → Output: true",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 404,
    title: "String to Integer (atoi)",
    company: "Facebook",
    topic: "Strings",
    difficulty: "Medium",
    description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
    solution: "Handle whitespace, signs, and integer overflow carefully.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: '42' → Output: 42; Input: '   -42' → Output: -42",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 405,
    title: "Group Anagrams",
    company: "Google",
    topic: "Strings",
    difficulty: "Medium",
    description: "Group an array of strings into anagrams.",
    solution: "Use a hashmap to group strings by their sorted character representation.",
    complexity: "Time: O(n * m log m), Space: O(n) where n is number of strings and m is average length of string",
    io: "Input: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] → Output: [['eat','tea','ate'],['tan','nat'],['bat']]",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 406,
    title: "Longest Substring Without Repeating Characters",
    company: "Amazon",
    topic: "Strings",
    difficulty: "Medium",
    description: "Find the length of the longest substring without repeating characters.",
    solution: "Use a sliding window approach with a hashmap to track characters and their indices.",
    complexity: "Time: O(n), Space: O(min(n, m)) where n is length of string and m is character set size",
    io: "Input: 'abcabcbb' → Output: 3 (substring 'abc')",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 407,
    title: "Validate IP Address",
    company: "Microsoft",
    topic: "Strings",
    difficulty: "Medium",
    description: "Validate a given IP address.",
    solution: "Check if the IP address is in valid IPv4 or IPv6 format.",
    complexity: "Time: O(n), Space: O(1)",
    io: "Input: '192.168.1.1' → Output: true",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 408,
    title: "Implement strStr()",
    company: "Google",
    topic: "Strings",
    difficulty: "Easy",
    description: "Return the index of the first occurrence of substring in string, or -1 if not found.",
    solution: "Use the KMP algorithm or a simple sliding window approach.",
    complexity: "Time: O(n * m), Space: O(1) where n is length of string and m is length of substring",
    io: "Input: 'hello', 'll' → Output: 2; Input: 'aaaaa', 'bba' → Output: -1",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 501,
    title: "Implement Producer-Consumer",
    company: "Amazon",
    topic: "OS",
    difficulty: "Medium",
    description: "Implement producer-consumer problem with synchronization.",
    solution: "Use semaphores or mutex locks to avoid race conditions.",
    complexity: "Depends on implementation",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 502,
    title: "Design a File System",
    company: "Google",
    topic: "OS",
    difficulty: "Hard",
    description: "Design a file system that supports basic operations like create, read, write, delete.",
    solution: "Use data structures like trees or hash maps to manage files and directories.",
    complexity: "Depends on features",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 503,
    title: "Implement a Memory Manager",
    company: "Microsoft",
    topic: "OS",
    difficulty: "Hard",
    description: "Design a memory manager that allocates and deallocates memory blocks.",
    solution: "Use data structures like linked lists or trees to manage memory blocks.",
    complexity: "Depends on features",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 504,
    title: "Design a Cache",
    company: "Facebook",
    topic: "OS",
    difficulty: "Medium",
    description: "Design a cache system that stores frequently accessed data.",
    solution: "Use a combination of LRU (Least Recently Used) and LFU (Least Frequently Used) algorithms.",
    complexity: "Depends on cache size and eviction policy",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 505,
    title: "Implement a Thread Pool",
    company: "Apple",
    topic: "OS",
    difficulty: "Medium",
    description: "Design a thread pool to manage a fixed number of threads for executing tasks.",
    solution: "Use a queue to hold tasks and a fixed number of worker threads to execute them.",
    complexity: "Depends on number of threads and tasks",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 601,
    title: "Dijkstra's Algorithm",
    company: "Google",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Implement Dijkstra's algorithm to find the shortest path in a graph.",
    solution: "Use a priority queue to keep track of the shortest distances.",
    complexity: "Time: O((V + E) log V), Space: O(V) where V is vertices and E is edges",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 602,
    title: "Merge Sort",
    company: "Amazon",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Implement merge sort algorithm to sort an array.",
    solution: "Use divide and conquer approach to recursively sort and merge arrays.",
    complexity: "Time: O(n log n), Space: O(n)",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 603,
    title: "Binary Search",
    company: "Microsoft",
    topic: "Algorithms",
    difficulty: "Easy",
    description: "Implement binary search algorithm to find an element in a sorted array.",
    solution: "Use divide and conquer approach to find the middle element and recursively search.",
    complexity: "Time: O(log n), Space: O(1)",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 604,
    title: "Quick Sort",
    company: "Facebook",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Implement quick sort algorithm to sort an array.",
    solution: "Use partitioning to recursively sort elements around a pivot.",
    complexity: "Time: O(n log n) on average, O(n^2) in worst case, Space: O(log n)",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 605,
    title: "Fibonacci Sequence",
    company: "Google",
    topic: "Algorithms",
    difficulty: "Easy",
    description: "Implement Fibonacci sequence using recursion and memoization.",
    solution: "Use dynamic programming to store previously computed values.",
    complexity: "Time: O(n), Space: O(n)",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 606,
    title: "Knapsack Problem",
    company: "Amazon",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Solve the 0/1 knapsack problem using dynamic programming.",
    solution: "Use a 2D array to store maximum values for each weight capacity.",
    complexity: "Time: O(n * W), Space: O(n * W) where n is number of items and W is maximum weight",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 607,
    title: "Breadth-First Search (BFS)",
    company: "Microsoft",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Implement BFS algorithm to traverse a graph.",
    solution: "Use a queue to explore nodes level by level.",
    complexity: "Time: O(V + E), Space: O(V) where V is vertices and E is edges",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 608,
    title: "Depth-First Search (DFS)",
    company: "Facebook",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Implement DFS algorithm to traverse a graph.",
    solution: "Use recursion or stack to explore nodes deeply before backtracking.",
    complexity: "Time: O(V + E), Space: O(V) where V is vertices and E is edges",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 609,
    title: "Topological Sort",
    company: "Google",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Implement topological sort for a directed acyclic graph (DAG).",
    solution: "Use Kahn's algorithm or DFS to find a linear ordering of vertices.",
    complexity: "Time: O(V + E), Space: O(V) where V is vertices and E is edges",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 610,
    title: "Longest Increasing Subsequence",
    company: "Amazon",
    topic: "Algorithms",
    difficulty: "Medium",
    description: "Find the length of the longest increasing subsequence in an array.",
    solution: "Use dynamic programming with binary search for optimization.",
    complexity: "Time: O(n log n), Space: O(n)",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 701,
    title: "Design a Parking Lot System",
    company: "Facebook",
    topic: "OOP",
    difficulty: "Medium",
    description: "Design classes and interfaces for a parking lot system.",
    solution: "Use inheritance, encapsulation, and polymorphism to model vehicles and slots.",
    complexity: "Depends on design",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 702,
    title: "Implement a Library Management System",
    company: "Google",
    topic: "OOP",
    difficulty: "Medium",
    description: "Design classes for books, members, and transactions in a library.",
    solution: "Use classes to represent entities and relationships between them.",
    complexity: "Depends on features",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 703,
    title: "Design an Online Shopping Cart",
    company: "Amazon",
    topic: "OOP",
    difficulty: "Medium",
    description: "Design classes for products, users, and shopping cart operations.",
    solution: "Use composition and aggregation to model relationships between products and users.",
    complexity: "Depends on features",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 704,
    title: "Design a Social Media Platform",
    company: "Microsoft",
    topic: "OOP",
    difficulty: "Hard",
    description: "Design classes for users, posts, comments, and friendships.",
    solution: "Use classes to represent entities and their interactions, focusing on relationships.",
    complexity: "Depends on features",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 705,
    title: "Design a Chatbot",
    company: "Facebook",
    topic: "OOP",
    difficulty: "Medium",
    description: "Design classes for a chatbot that can handle user queries.",
    solution: "Use classes to represent the chatbot's state and behavior.",
    complexity: "Depends on features",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 801,
    title: "Behavioral Question: Teamwork",
    company: "Amazon",
    topic: "HR",
    difficulty: "Easy",
    description: "Describe a time you worked successfully in a team.",
    solution: "Use STAR method: Situation, Task, Action, Result.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 802,
    title: "Behavioral Question: Leadership",
    company: "Microsoft",
    topic: "HR",
    difficulty: "Medium",
    description: "Give an example of how you demonstrated leadership.",
    solution: "Focus on specific actions and outcomes using STAR method.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 803,
    title: "Behavioral Question: Conflict Resolution",
    company: "Google",
    topic: "HR",
    difficulty: "Easy",
    description: "Describe a time you handled a conflict in a team.",
    solution: "STAR method: Situation, Task, Action, Result.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 804,
    title: "Behavioral Question: Failure",
    company: "Facebook",
    topic: "HR",
    difficulty: "Medium",
    description: "Tell me about a time you failed and what you learned.",
    solution: "Use STAR method to explain the situation, your actions, and the lessons learned.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 805,
    title: "Behavioral Question: Time Management",
    company: "Apple",
    topic: "HR",
    difficulty: "Easy",
    description: "How do you prioritize tasks when you have multiple deadlines?",
    solution: "Discuss your approach to prioritization, such as using a task matrix or deadlines.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 806,
    title: "Behavioral Question: Adaptability",
    company: "Netflix",
    topic: "HR",
    difficulty: "Medium",
    description: "Describe a situation where you had to adapt to a significant change at work.",
    solution: "Use STAR method to explain how you adapted and the outcome.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 807,
    title: "Behavioral Question: Initiative",
    company: "Google",
    topic: "HR",
    difficulty: "Easy",
    description: "Give an example of a time you took initiative at work.",
    solution: "Use STAR method to describe the situation, your actions, and the results.",
    complexity: "N/A",
    io: "N/A",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 901,
    title: "Time and Work Problem",
    company: "Amazon",
    topic: "Aptitude",
    difficulty: "Easy",
    description: "If A can do a job in 10 days and B in 15 days, find time when both work together.",
    solution: "Use formula: 1/T = 1/A + 1/B",
    complexity: "Simple arithmetic",
    io: "Input: 10, 15 → Output: 6 days",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 902,
    title: "Probability Problem",
    company: "Google",
    topic: "Aptitude",
    difficulty: "Medium",
    description: "What is the probability of drawing a red card from a standard deck?",
    solution: "There are 26 red cards in a deck of 52 cards, so probability = 26/52 = 1/2.",
    complexity: "Basic probability",
    io: "Input: N/A → Output: 0.5",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 903,
    title: "Number Series Problem",
    company: "Microsoft",
    topic: "Aptitude",
    difficulty: "Medium",
    description: "Find the next number in the series: 2, 4, 8, 16, ?",
    solution: "The series is powers of 2, so next number is 32.",
    complexity: "Pattern recognition",
    io: "Input: N/A → Output: 32",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 1001,
    title: "Syllogism Problem",
    company: "Amazon",
    topic: "Reasoning",
    difficulty: "Easy",
    description: "All cats are animals. Some animals are dogs. Are some cats dogs?",
    solution: "No, the premises do not imply that some cats are dogs.",
    complexity: "Logical reasoning",
    io: "Input: N/A → Output: No",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 1002,
    title: "Blood Relation Problem",
    company: "Google",
    topic: "Reasoning",
    difficulty: "Medium",
    description: "If A is B's father and B is C's mother, what is the relation between A and C?",
    solution: "A is C's grandfather.",
    complexity: "Logical reasoning",
    io: "Input: N/A → Output: Grandfather",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 1003,
    title: "Direction Sense Problem",
    company: "Microsoft",
    topic: "Reasoning",
    difficulty: "Easy",
    description: "If you are facing North and turn 90 degrees to your right, which direction are you facing?",
    solution: "You will be facing East.",
    complexity: "Basic direction sense",
    io: "Input: N/A → Output: East",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 1004,
    title: "Coding Problem: Simple Addition",
    company: "Facebook",
    topic: "Reasoning",
    difficulty: "Easy",
    description: "Write a simple program to add two numbers.",
    solution: "def add(a, b): return a + b",
    complexity: "Time: O(1), Space: O(1)",
    io: "Input: 2, 3 → Output: 5",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
  {
    id: 1005,
    title: "Coding Problem: Factorial",
    company: "Google",
    topic: "Reasoning",
    difficulty: "Medium",
    description: "Write a program to compute the factorial of a number.",
    solution: "def factorial(n): return 1 if n==0 else n*factorial(n-1)",
    complexity: "Time: O(n), Space: O(n)",
    io: "Input: 5 → Output: 120",
    bookmarked: false,
    flagged: false,
    notes: ""
  },
];

const companies = ["All", "Amazon", "Google", "Microsoft", "Facebook", "Apple", "Netflix", "Tesla", "Adobe", "IBM", "Oracle"];
const topics = ["All", "DSA", "System Design", "DBMS", "OS", "OOP", "HR", "Aptitude", "Algorithms", "Strings", "Arrays", "Reasoning"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

// Question Card Component
const QuestionCard = ({ question, toggleBookmark, toggleFlag }) => {
  return (
    <div className="question-card" role="article" tabIndex="0" aria-labelledby={`question-${question.id}`}>
      <h2 id={`question-${question.id}`}>{question.title}</h2>
      <p className="desc"><strong>Company:</strong> {question.company}</p>
      <p className="desc"><strong>Topic:</strong> {question.topic}</p>
      <p className="desc">
        <strong>Difficulty:</strong>
        <span className={`dot ${question.difficulty.toLowerCase()}`}></span>
        {question.difficulty}
      </p>
      <p className="desc"><strong>Description:</strong> {question.description}</p>
      <p className="desc"><strong>Example I/O:</strong> {question.io}</p>
      <details>
        <summary>Show Solution</summary>
        <p>{question.solution}</p>
        <p><strong>Complexity:</strong> {question.complexity}</p>
      </details>
      <div className="actions">
        <button
          onClick={() => toggleBookmark(question.id)}
          aria-pressed={question.bookmarked}
          aria-label={question.bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {question.bookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
        </button>
        <button
          onClick={() => toggleFlag(question.id)}
          aria-pressed={question.flagged}
          aria-label={question.flagged ? "Remove flag" : "Add flag"}
        >
          {question.flagged ? "🚩 Flagged" : "🚩 Flag"}
        </button>
        <Link to="/codepad">
          <button
            className="bg-[#ff004c] text-white px-4 py-2 rounded-lg hover:bg-[#ff3366] transition-transform transform hover:scale-105"
            aria-label="Try this question in Codepad"
          >
            🚀 Try in Codepad
          </button>
        </Link>
      </div>
    </div>
  );
};

// Filter Component
const FilterBar = ({ companies, topics, difficulties, filterCompany, setCompany, filterTopic, setTopic, filterDifficulty, setDifficulty, search, setSearch }) => {
  return (
    <div className="filters">
      <select
        value={filterCompany}
        onChange={(e) => setCompany(e.target.value)}
        aria-label="Filter by company"
      >
        {companies.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        value={filterTopic}
        onChange={(e) => setTopic(e.target.value)}
        aria-label="Filter by topic"
      >
        {topics.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={filterDifficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        aria-label="Filter by difficulty"
      >
        {difficulties.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search questions"
      />
    </div>
  );
};

// Main Interview Prep Component
const InterviewPrep = () => {
  const [filterCompany, setCompany] = useState("All");
  const [filterTopic, setTopic] = useState("All");
  const [filterDifficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState(mockQuestions);

  const toggleBookmark = useCallback((id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, bookmarked: !q.bookmarked } : q));
  }, []);

  const toggleFlag = useCallback((id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, flagged: !q.flagged } : q));
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q =>
      (filterCompany === "All" || q.company === filterCompany) &&
      (filterTopic === "All" || q.topic === filterTopic) &&
      (filterDifficulty === "All" || q.difficulty === filterDifficulty) &&
      q.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [questions, filterCompany, filterTopic, filterDifficulty, search]);

  return (
    <div className="interview-prep-container">
      <h1>🎯 Interview Prep</h1>
      <FilterBar
        companies={companies}
        topics={topics}
        difficulties={difficulties}
        filterCompany={filterCompany}
        setCompany={setCompany}
        filterTopic={filterTopic}
        setTopic={setTopic}
        filterDifficulty={filterDifficulty}
        setDifficulty={setDifficulty}
        search={search}
        setSearch={setSearch}
      />
      <div className="questions">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              toggleBookmark={toggleBookmark}
              toggleFlag={toggleFlag}
            />
          ))
        ) : (
          <p className="desc">No questions match your filters.</p>
        )}
      </div>
    </div>
  );
};
export default InterviewPrep;