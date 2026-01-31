// animals.js - Vercel serverless function
import Cors from "cors";

// CORS middleware
const cors = Cors({
  origin: "*", // hamma domenlardan ruxsat
  methods: ["GET", "POST", "PATCH", "DELETE"],
});

// Helper function for middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// In-memory “database”
let animals = [
  {
    id: 1,
    name: "Lion",
    habitat: "Savannah",
    category: "Mammal",
    soundText: "Roar",
    isWild: true,
  },
  {
    id: 2,
    name: "Dog",
    habitat: "Home",
    category: "Mammal",
    soundText: "Bark",
    isWild: false,
  },
];

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { method } = req;
  if (method === "GET") {
    return res.status(200).json(animals);
  } else if (method === "POST") {
    const newAnimal = { id: Date.now(), ...req.body };
    animals.push(newAnimal);
    return res.status(201).json(newAnimal);
  } else if (method === "PATCH") {
    const { id, ...data } = req.body;
    const index = animals.findIndex((a) => a.id === Number(id));
    if (index === -1) return res.status(404).json({ error: "Not found" });
    animals[index] = { ...animals[index], ...data };
    return res.status(200).json(animals[index]);
  } else if (method === "DELETE") {
    const id = Number(req.query.id);
    animals = animals.filter((a) => a.id !== id);
    return res.status(200).json({ message: "Deleted" });
  } else {
    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
