require('dotenv').config();
const db = require('../prisma/client');

const MODULE_0_ID = 'ed8d8e7e-6c05-47f4-95e1-6ccce7aaefd2';

const exercises = [
  {
    questionText: "A recipe tells you to crack two eggs, then whisk them, then pour into a pan. In programming terms, is this closer to what we'd call a variable or an instruction? Explain your answer in one sentence.",
    correctAnswer: "Instruction. Each step, crack, whisk, pour, is a single command being followed in order, which is what an instruction is.",
    type: 'PRACTICE',
  },
  {
    questionText: "You label a box 'Age' and put the number 25 inside it. Later, you take out 25 and put 26 in instead, same box, same label. What programming concept does this box represent?",
    correctAnswer: "A variable. It's a named container whose contents can change over time while the name stays the same.",
    type: 'PRACTICE',
  },
  {
    questionText: "Two friends are both learning to cook. One follows a recipe exactly, step by step, getting the same dish every time. The other improvises based on what's in the fridge, getting a slightly different dish each time. Which one is more like how your JavaScript code runs, and which is more like how an AI model generates a response?",
    correctAnswer: "The exact recipe-follower is like JavaScript, deterministic, same input produces the same output every time. The improviser is like an AI model, probabilistic, producing a different but plausible result each time.",
    type: 'PRACTICE',
  },
  {
    questionText: "You write one set of folding instructions once, then reuse those same instructions every time you need to fold a shirt, instead of re-explaining folding from scratch each time. What programming concept does this represent?",
    correctAnswer: "A function. It's a reusable block of instructions you define once and can call again whenever you need it.",
    type: 'PRACTICE',
  },
  {
    questionText: "Describe what happens, step by step, when a very simple program runs: it stores your name, then prints out 'Hello, [your name]'. Use the words instruction, variable, and running somewhere in your explanation.",
    correctAnswer: "When the program runs, the computer executes each instruction in order. First it stores your name in a variable. Then it follows the next instruction, which prints a greeting using the value held in that variable.",
    type: 'CHECKPOINT',
  },
];

async function seedExercises() {
  const moduleExists = await db.module.findUnique({ where: { id: MODULE_0_ID } });

  if (!moduleExists) {
    console.error('Module 0 not found. Run seed-module-0.js first.');
    process.exit(1);
  }

  for (const ex of exercises) {
    const existing = await db.exercise.findFirst({
      where: { moduleId: MODULE_0_ID, questionText: ex.questionText },
    });

    if (existing) {
      console.log('Skipping, already exists:', ex.questionText.slice(0, 40));
      continue;
    }

    const created = await db.exercise.create({
      data: {
        moduleId: MODULE_0_ID,
        questionText: ex.questionText,
        correctAnswer: ex.correctAnswer,
        type: ex.type,
      },
    });

    console.log('Created:', ex.type, created.id);
  }
}

seedExercises()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
