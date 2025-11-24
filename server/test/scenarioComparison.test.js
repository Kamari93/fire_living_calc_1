// filepath: /Users/kamarimoore/Desktop/MERN AI Practice/cost-of-living-fi-calculator/server/tests/scenarioComparison.test.js
const request = require("supertest");
const app = require("../index"); // Your Express app

describe("Scenario Comparison API", () => {
  it("should fetch all scenario comparisons for a user", async () => {
    const token = "YOUR_TEST_JWT_TOKEN";
    const res = await request(app)
      .get("/api/scenario-comparisons")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test for creating a new scenario comparison with valid input
  it("should create a scenario comparison with valid input", async () => {
    const token = "YOUR_TEST_JWT_TOKEN";
    // Replace these with real scenario IDs from your test DB
    const scenarioIds = ["id1", "id2"];
    const res = await request(app)
      .post("/api/scenario-comparisons")
      .set("Authorization", `Bearer ${token}`)
      .send({
        scenarioIds,
        title: "Test Comparison",
        notes: "Testing create",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Comparison");
  });

  // Add more tests: create, view, delete, error cases, etc.
});

/**
What to test:

Fetching comparisons
Creating a comparison (valid/invalid input)
Deleting a comparison
Error handling (unauthorized, not found, etc.)
 */
