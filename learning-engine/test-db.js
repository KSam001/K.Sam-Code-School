require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Testing database connection...");

  try {
    const newUser = await prisma.user.create({
      data: {
        email: "test_user@portfolio.com",
        password: "hashed_password_placeholder",
        name: "Test User",
      },
    });
    console.log("Success: User created:", newUser);

    const fetchedUser = await prisma.user.findUnique({
      where: { email: "test_user@portfolio.com" },
    });
    console.log("Success: User fetched:", fetchedUser);

    const deletedUser = await prisma.user.delete({
      where: { email: "test_user@portfolio.com" },
    });
    console.log("Success: Test user deleted. Database connection is fully functional.");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();