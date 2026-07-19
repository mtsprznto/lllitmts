import type { APIRoute } from "astro"
import { albums } from "@/data/albums"

const SITE_URL = "https://lllitmts.vercel.app"

export const GET: APIRoute = async () => {
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/album", priority: "0.8", changefreq: "weekly" },
    { loc: "/formulario", priority: "0.6", changefreq: "monthly" },
    { loc: "/prices", priority: "0.7", changefreq: "monthly" },
    { loc: "/redeem", priority: "0.5", changefreq: "monthly" },
  ]

  const albumPages = albums.map((a) => ({
    loc: `/album/${a.slug}`,
    priority: "0.9",
    changefreq: "weekly",
  }))

  const allPages = [...staticPages, ...albumPages]

  const LAST_MOD = new Date().toISOString().split("T")[0]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map((p) => {
  const isAlbum = p.loc.startsWith("/album/")
  return `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    ${isAlbum ? `    <image:image>
      <image:loc>${SITE_URL}/images/album/cover-small.webp</image:loc>
      <image:title>${albums.find(a => `/album/${a.slug}` === p.loc)?.title || "LLLIT album"}</image:title>
    </image:image>` : ""}
  </url>`
}).join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
