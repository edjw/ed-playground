import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
	const url = new URL(request.url);
	const path = url.pathname;

	// Only handle requests to /.netlify/blobs/medicine-data
	if (path !== "/.netlify/blobs/medicine-data") {
		return new Response("Not Found", { status: 404 });
	}

	const { blobs } = context;
	const store = blobs.getStore("medicine-data-store");

	try {
		if (request.method === "PUT") {
			// Save data to blob store
			const data = await request.json();
			await store.setJSON("data", data);
			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else if (request.method === "GET") {
			// Load data from blob store
			const data = await store.get("data", { type: "json" });
			if (data) {
				return new Response(JSON.stringify(data), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			} else {
				return new Response("Not Found", { status: 404 });
			}
		} else {
			return new Response("Method Not Allowed", { status: 405 });
		}
	} catch (error) {
		console.error("Blob handler error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

export const config = {
	path: "/.netlify/blobs/medicine-data",
};