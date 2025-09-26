import { S3 } from "@aws-sdk/client-s3";
import Fuse from "fuse.js";

const s3 = new S3({ region: "eu-central-1" });
const BUCKET_NAME = process.env.BUCKET;

let cachedData = null;
let fuse = null;

async function loadData() {
  if (cachedData && fuse) return fuse;

  const obj = await s3.getObject({
    Bucket: BUCKET_NAME,
    Key: "InfoSobrePruebas/TotalJson.json"
  });

  const body = await streamToString(obj.Body);
  cachedData = JSON.parse(body);

  // Configuración de Fuse
  fuse = new Fuse(cachedData, {
    keys: ["id", "titulo", "descripcion"], // campos donde buscar
    threshold: 0.4, // tolerancia (0 = exacto, 1 = muy permisivo)
  });

  return fuse;
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters?.q || "";
    if (!query) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing query" }) };
    }

    const fuse = await loadData();
    const results = fuse.search(query, { limit: 4 });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results.map(r => r.item)) // devolver solo los items
    };

  } catch (error) {
    console.error("Lambda error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
