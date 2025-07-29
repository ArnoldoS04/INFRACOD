import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "192.168.68.253",
  port: "5000",
  user: "asantos",
  password: "Explorador30",
  database: "INFRACOD",
});
