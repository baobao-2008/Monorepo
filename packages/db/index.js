const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");
const path = require("path");
const { pathToFileURL } = require("url");

// 1. Tìm đúng đường dẫn file dev.db và đổi sang chuẩn URL quốc tế
const dbPath = path.join(__dirname, "dev.db");
const connectionUrl = pathToFileURL(dbPath).toString();

// 2. Chuyển thẳng đường dẫn cho Adapter (Cú pháp mới toanh của bản 7)
const adapter = new PrismaLibSql({ url: connectionUrl });

// 3. Khởi tạo Prisma sạch sẽ
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
