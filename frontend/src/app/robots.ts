import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/", "/account/", "/checkout/", "/cart"],
      },
    ],
    sitemap: "https://bodhiq.in/sitemap.xml",
  };
}
