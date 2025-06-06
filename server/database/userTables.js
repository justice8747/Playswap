import client from "./connectDB.js";
const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        password VARCHAR(255),
        email VARCHAR(100) NOT NULL UNIQUE,
        is_google_user BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

  try {
    await client.query(query);
    console.log("table created successfully");
  } catch (error) {
    console.log(error);
  }
};

export { createUserTable };
