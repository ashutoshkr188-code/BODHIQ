import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BODHIQ — Luxury Timepieces",
    short_name: "BODHIQ",
    description:
      "Luxury handcrafted timepieces that blend ancient wisdom with modern engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#d4a853",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
