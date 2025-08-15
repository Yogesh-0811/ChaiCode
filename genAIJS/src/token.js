import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";

const enc = new Tiktoken(o200k_base);

const userQuery = 'Hey there, I am Yogesh Patil';
const tokens = enc.encode(userQuery);

console.log({tokens});

const inputTokens = [
    25216, 1354,    11,
      357,  939, 86916,
     8382, 6679,   311
  ];

const decoded = enc.decode(inputTokens);
console.log({decoded});