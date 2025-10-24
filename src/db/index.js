import { Sequelize } from "sequelize";
import pg from "pg";

// Database connection string Hostless does not allow env variables on free plans and no other sensitive data is used here.
export const sequelize = new Sequelize(
  "postgresql://postgres.nxdecqbnuyvkztahiemn:ZJitPQ8WYnbKy7HZ@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  {
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
