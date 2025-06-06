import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "playswap",
  password: "jussy8747",
  port: 5432,
});

export default client;
