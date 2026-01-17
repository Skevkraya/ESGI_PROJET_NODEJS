import app from "./app.ts";
import { connectDB } from "./db.ts";

import "dotenv/config";

console.log(process.env.ADMIN_API_KEY);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
