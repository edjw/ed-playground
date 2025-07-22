import { getStore } from "@netlify/blobs";

export default async (req: Request, context: { params: { store: string; key: string; method: string } }) => {
  const { store: storeName, key, method } = context.params;
  
  // CORS headers and origin check
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const allowedOrigin = 'https://ed-playground.netlify.app';
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Check origin/referer for security
  if (origin !== allowedOrigin && !referer?.startsWith(allowedOrigin + '/')) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: corsHeaders
    });
  }
  
  if (!storeName || !key) {
    return new Response(JSON.stringify({ error: "Store name and key are required" }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const store = getStore(storeName);

  try {
    if (req.method === "GET" && method === "get") {
      // Load data
      const data = await store.get(key, { type: "json" });
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "POST" && method === "set") {
      // Save data
      const data = await req.json();
      await store.setJSON(key, data);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "DELETE" && method === "delete") {
      // Delete data
      await store.delete(key);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error("Blob function error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const config = {
  path: "/api/blobs/:store/:key/:method"
};