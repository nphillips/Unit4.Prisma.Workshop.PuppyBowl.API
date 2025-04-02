const prisma = require("../prisma");

const seed = async () => {
  const breedsData = [
    { breed: "Breed 1" },
    { breed: "Breed 2" },
    { breed: "Breed 3" },
    { breed: "Breed 4" },
    { breed: "Breed 5" },
  ];
  await prisma.breed.createMany({ data: breedsData });

  const puppiesData = [
    { name: "Puppy 1", breedId: 1, imageUrl: "https://example.com/puppy1.jpg" },
    { name: "Puppy 2", breedId: 2, imageUrl: "https://example.com/puppy2.jpg" },
    { name: "Puppy 3", breedId: 3, imageUrl: "https://example.com/puppy3.jpg" },
    { name: "Puppy 4", breedId: 4, imageUrl: "https://example.com/puppy4.jpg" },
    { name: "Puppy 5", breedId: 5, imageUrl: "https://example.com/puppy5.jpg" },
  ];
  await prisma.puppy.createMany({ data: puppiesData });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
