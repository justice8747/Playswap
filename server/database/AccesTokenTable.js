import client from "./connectDB.js";

export const createAccessTokenTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS access_tokens (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        access_token VARCHAR(255) NOT NULL,
        refresh_token VARCHAR(255),
        provider VARCHAR(50),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await client.query(query);
    console.log("Access token table created successfully");
  } catch (error) {
    console.error("Error creating access token table:", error);
  }
};
