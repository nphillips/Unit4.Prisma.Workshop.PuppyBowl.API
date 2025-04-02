const router = require("express").Router();
const prisma = require("../prisma");
console.log("Creating puppies router...");
module.exports = router;

/** Returns an array of all puppies in the database. */
router.get("/", async (req, res, next) => {
  console.log("GET /api/puppies route hit");
  try {
    console.log("Attempting to fetch puppies from database...");
    const puppies = await prisma.puppy.findMany();
    console.log("Successfully fetched puppies:", puppies);
    res.json(puppies);
  } catch (error) {
    console.error("Error in GET /api/puppies:", error);
    next(error);
  }
});

/** Creates a new puppy as provided by the request body. */
router.post("/", async (req, res, next) => {
  try {
    // Extract and validate the required fields
    const { name, breedId, imageUrl } = req.body;

    if (!name || !breedId || !imageUrl) {
      return next({
        status: 400,
        message: "Puppy must have a name, breedId, and imageUrl.",
      });
    }

    const puppy = await prisma.puppy.create({
      data: { name, breedId, imageUrl },
    });
    res.status(201).json(puppy);
  } catch {
    next();
  }
});

/** Returns a single puppy with the specified id. */
router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const puppy = await prisma.puppy.findUnique({ where: { id } });

    if (!puppy) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

    res.json(puppy);
  } catch {
    next();
  }
});

/** Overwrites the specified puppy's name as provided by the request body. */
router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    // Check if the puppy exists first
    const puppyExists = await prisma.puppy.findUnique({ where: { id } });
    if (!puppyExists) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

    // Validate request body (here, only the name is updated)
    const { name } = req.body;
    if (!name) {
      return next({
        status: 400,
        message: "Puppy must have a name.",
      });
    }

    const puppy = await prisma.puppy.update({
      where: { id },
      data: { name },
    });

    res.json(puppy);
  } catch {
    next();
  }
});

/** Deletes the puppy with the specified id. */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const puppyExists = await prisma.puppy.findUnique({ where: { id } });
    if (!puppyExists) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

    await prisma.puppy.delete({ where: { id } });
    res.sendStatus(204);
  } catch {
    next();
  }
});

/** Returns the breed for the puppy with the specified id. */
router.get("/:id/breed", async (req, res, next) => {
  try {
    const id = +req.params.id;

    // Fetch the puppy along with its breed
    const puppy = await prisma.puppy.findUnique({
      where: { id },
      include: { breed: true },
    });

    if (!puppy) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

    res.json(puppy.breed);
  } catch {
    next();
  }
});

/**
 * Creates a new breed and assigns it to the puppy with the specified id.
 * Note: This route creates a new breed record and updates the puppy to reference it.
 */
router.post("/:id/breed", async (req, res, next) => {
  try {
    const id = +req.params.id;

    // Check if puppy exists
    const puppy = await prisma.puppy.findUnique({ where: { id } });
    if (!puppy) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

    // Validate request body (using the correct field name 'breed')
    const { breed } = req.body;
    if (!breed) {
      return next({
        status: 400,
        message: "Breed must have a name.",
      });
    }

    // Create a new breed and connect it to the puppy.
    // Since the relation is maintained on the Puppy model, you can either:
    // (a) Create a breed and update the puppy's breedId in one go, or
    // (b) Create the breed and then update the puppy.
    // Here, we'll create the breed and then update the puppy:
    const newBreed = await prisma.breed.create({ data: { breed } });

    const updatedPuppy = await prisma.puppy.update({
      where: { id },
      data: { breedId: newBreed.id },
      include: { breed: true },
    });

    res.status(201).json(updatedPuppy.breed);
  } catch {
    next();
  }
});
