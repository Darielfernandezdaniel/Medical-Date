const CLOUDFRONT_URL = process.env.CLOUDFRONT_DOMAIN;

export const handler = async (event) => {
  try {
    const page = parseInt(event.queryStringParameters?.page || "1", 10);
    const limit = parseInt(event.queryStringParameters?.limit || "7", 10);

    const url = `${CLOUDFRONT_URL}/InfoSobrePruebas/TotalJson.Json`;
    const response = await fetch(url);
    const allImages = await response.json();

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedImages = allImages.slice(start, end);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page,
        limit,
        total: allImages.length,
        images: paginatedImages
      }),
    };

  } catch (error) {
    console.error("Lambda error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
