import { createFileRoute } from "@tanstack/react-router";
import { readListingImage } from "@/api/listing-images.server";

export const Route = createFileRoute("/api/listing-images/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const image = await readListingImage(params.id);
        if (!image) return new Response("Image not found", { status: 404 });

        return new Response(new Uint8Array(image.bytes), {
          headers: {
            "content-type": image.contentType,
            "cache-control": "public, max-age=31536000, immutable",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
