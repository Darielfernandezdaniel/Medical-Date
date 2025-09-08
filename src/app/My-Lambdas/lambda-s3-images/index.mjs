import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "eu-central-1" });

export const handler = async (event) => {
    const BUCKET = process.env.BUCKET;
    const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
    
    // Cabeceras CORS comunes
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token",
        "Access-Control-Max-Age": "86400" // Cache preflight por 24 horas
    };

    // Manejar petición OPTIONS (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    const query = event.queryStringParameters || {};
    const page = parseInt(query.page || "1"); // Cambiado de 3 a 1 por defecto
    const limit = parseInt(query.limit || "10");

    try {
        // Obtener lista de objetos de S3
        const command = new ListObjectsV2Command({ 
            Bucket: BUCKET,
            MaxKeys: 1000 // Limitar para evitar timeouts con buckets muy grandes
        });
        
        const data = await s3.send(command);
        
        if (!data.Contents) {
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                },
                body: JSON.stringify({ 
                    page, 
                    limit, 
                    total: 0, 
                    totalPages: 0,
                    images: [] 
                })
            };
        }

        // Filtrar solo imágenes (opcional)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
        const allKeys = data.Contents
            .map(obj => obj.Key)
            .filter(key => imageExtensions.some(ext => key.toLowerCase().endsWith(ext)))
            .sort(); // Ordenar alfabéticamente

        const total = allKeys.length;
        const totalPages = Math.ceil(total / limit);
        
        // Paginación
        const start = (page - 1) * limit;
        const pagedKeys = allKeys.slice(start, start + limit);

        // Generar URLs de CloudFront
        const urls = pagedKeys.map(key => `https://medicaltestimg.s3.eu-central-1.amazonaws.com/${key}`);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            },
            body: JSON.stringify({ 
                page, 
                limit, 
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                images: urls 
            })
        };

    } catch (err) {
        console.error('Error:', err); // Log para CloudWatch
        
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            },
            body: JSON.stringify({ 
                error: "Error interno del servidor",
                message: err.message 
            })
        };
    }
};