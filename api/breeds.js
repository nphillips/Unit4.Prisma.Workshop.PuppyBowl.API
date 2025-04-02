const router = require("express").Router();
const prisma = require("../prisma");
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const breeds = await prisma.breed.findMany();
    res.json(breeds);
  } catch {
    next();
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { breed } = req.body;

    if (!breed) {
      return next({
        status: 400,
        message: "Breed must have a name.",
      });
    }

    const newBreed = await prisma.breed.create({
      data: { breed },
    });
    res.status(201).json(newBreed);
  } catch {
    next();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const breed = await prisma.breed.findUnique({ where: { id } });

    if (!breed) {
      return next({
        status: 404,
        message: `Could not find breed with id ${id}.`,
      });
    }

    res.json(breed);
  } catch {
    next();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const breedExists = await prisma.breed.findUnique({ where: { id } });
    if (!breedExists) {
      return next({
        status: 404,
        message: `Could not find breed with id ${id}.`,
      });
    }

    const { breed } = req.body;
    if (!breed) {
      return next({
        status: 400,
        message: "Breed must have a name.",
      });
    }

    const updatedBreed = await prisma.breed.update({
      where: { id },
      data: { breed },
    });

    res.json(updatedBreed);
  } catch {
    next();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const breedExists = await prisma.breed.findUnique({ where: { id } });
    if (!breedExists) {
      return next({
        status: 404,
        message: `Could not find breed with id ${id}.`,
      });
    }

    await prisma.breed.delete({ where: { id } });
    res.sendStatus(204);
  } catch {
    next();
  }
});
