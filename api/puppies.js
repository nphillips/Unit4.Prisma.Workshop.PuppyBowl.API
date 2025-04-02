const router = require("express").Router();
const prisma = require("../prisma");
console.log("Creating puppies router...");
module.exports = router;

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

router.post("/", async (req, res, next) => {
  try {
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

router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const puppyExists = await prisma.puppy.findUnique({ where: { id } });
    if (!puppyExists) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

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

router.get("/:id/breed", async (req, res, next) => {
  try {
    const id = +req.params.id;

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

router.post("/:id/breed", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const puppy = await prisma.puppy.findUnique({ where: { id } });
    if (!puppy) {
      return next({
        status: 404,
        message: `Could not find puppy with id ${id}.`,
      });
    }

    const { breed } = req.body;
    if (!breed) {
      return next({
        status: 400,
        message: "Breed must have a name.",
      });
    }

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
