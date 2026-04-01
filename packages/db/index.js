const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");
const path = require("path");

// 1. Tìm đường dẫn file database
const dbPath = path.join(__dirname, "dev.db");

// 2. Khởi tạo lõi kết nối SQLite
const libsql = createClient({ url: `file:${dbPath}` });

// 3. Lắp lõi vào Adapter của Prisma
const adapter = new PrismaLibSql(libsql);

// 4. Khởi tạo Prisma bằng Adapter (Không dùng datasourceUrl nữa)
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
