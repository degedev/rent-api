import { hash } from "bcryptjs";
import request from "supertest";
import { createConnection, Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";

let connection: Connection;

describe("CreateCategoryController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, username, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@admin', 'useradmin', '${password}', true, 'now()', 'XXXXXX')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it("[CreateCategoryController] should be able to create a new category", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@admin",
      password: "admin",
    });

    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "category_name",
        description: "category_description",
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    expect(response.status).toBe(201);
  });

  it("[CreateCategoryController] should not be able to create a new category if name already exists", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "admin@admin",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "category_name",
        description: "category_description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
