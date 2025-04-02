const router = require("express").Router();
console.log("Creating API router...");

// Test route in API router
router.get("/test", (req, res) => {
  console.log("API test route hit!");
  res.json({ message: "API test route working!" });
});

console.log("Mounting puppies route...");
router.use("/puppies", require("./puppies"));
console.log("Mounting breeds route...");
router.use("/breeds", require("./breeds"));
console.log("All API routes mounted");

module.exports = router;
