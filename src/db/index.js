
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const userRepository = prisma.user;

module.exports = { userRepository };