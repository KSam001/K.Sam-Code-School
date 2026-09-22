require('dotenv').config();
const db = require('../prisma/client');

const primerContent = `
# What Is Code, Actually

Before writing a single line of JavaScript, it helps to understand what code actually is.

## A Program Is a Recipe

A computer program is a sequence of instructions the computer follows, literally, one at a time, top to bottom, the same way a recipe tells you what to do first, second, and third. The computer doesn't understand your intent, it only understands instructions written in a very specific, unambiguous grammar. That grammar is what we call syntax.

## Syntax vs Logic

Syntax is the grammar of the language, the exact spelling and punctuation the computer expects. Logic is your actual thinking, the plan for solving the problem. You can have perfect logic and still fail if your syntax is wrong, and you can have perfect syntax and still fail if your logic is flawed. Both matter, and they're genuinely different skills.

## What a Variable Actually Is

A variable is a named container for a value. Think of it like a labeled box, you put something inside it, and later you can look inside the box by using its label instead of remembering the actual contents. This is why we use variables at all, they let us refer to a value by a meaningful name instead of repeating the raw value everywhere.

## What a Function Actually Is

A function is a reusable block of instructions, given a name, that you can trigger by calling that name whenever you need those instructions to run. Instead of writing the same steps over and over, you write them once, inside a function, and call the function whenever you need them.

## What "Running" Code Means

When you run a program, the computer starts at the top and executes each instruction, one at a time, in order, unless something explicitly tells it to skip, repeat, or jump elsewhere. Everything you'll learn from here forward is really just different ways of controlling that order: when to skip something, when to repeat something, when to store something for later.

By the end of this module, you should be able to explain what a variable is, what a function is, and what actually happens when code runs, all without writing a single line of JavaScript yet.
`.trim();

async function seedModuleZero() {
  const existing = await db.module.findFirst({
    where: { isCurriculum: true, stage: 0, order: 0 },
  });

  if (existing) {
    console.log('Module 0 already exists, skipping seed.');
    return;
  }

  const moduleZero = await db.module.create({
    data: {
      title: 'Module 0: What Is Code, Actually',
      description: 'Before writing any JavaScript, understand what a program, a variable, and a function actually are.',
      primerContent,
      stage: 0,
      order: 0,
      isCurriculum: true,
    },
  });

  console.log('Seeded Module 0:', moduleZero.id);
}

seedModuleZero()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());