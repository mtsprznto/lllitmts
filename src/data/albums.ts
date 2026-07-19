export interface Track {
  num: string
  name: string
  bpm: number | string
  pct: number
  previewUrl?: string
}

export interface Credit {
  role: string
  name: string
}

export interface Album {
  slug: string
  title: string
  artist: string
  releaseDate: string
  label: string
  description: string
  descriptionEn: string
  coverUrl: string
  visualBgUrl: string
  bandcampUrl: string
  instagramUrl: string
  instagramHandle: string
  youtubeUrl: string
  soundcloudUrl: string
  tracks: Track[]
  credits: Credit[]
  genres: string[]
  price: string
  releaseType: string
  campaignDate: string
}

export const albums: Album[] = [
  {
    slug: "inesperado-contratiempo",
    title: "Inesperado contratiempo",
    artist: "LLLIT",
    releaseDate: "2026-09-04",
    label: "LLLIT Records",
    description: "Minimal dub, psychedelic ambient y electrónica experimental. El regreso de LLLIT tras 18 meses de silencio. Arte de tapa por Camila Bravo.",
    descriptionEn: "Minimal dub, psychedelic ambient, and experimental electronics. LLLIT returns after 18 months of silence. Artwork by Camila Bravo.",
    coverUrl: "/images/album/cover-small.png",
    visualBgUrl: "/images/album/visual-bg.webp",
    bandcampUrl: "https://lllit3.bandcamp.com",
    instagramUrl: "https://instagram.com/lllit_3",
    instagramHandle: "@lllit_3",
    youtubeUrl: "https://youtube.com/channel/UC6wQ3-lBuQLiYK32uUVhHcw",
    soundcloudUrl: "https://soundcloud.com/lllit_3",
    tracks: [
      { num: "01", name: "Desvío sin aviso", bpm: 103, pct: 63 },
      { num: "02", name: "Deriva", bpm: 95, pct: 52 },
      { num: "03", name: "Umbral", bpm: "99.9", pct: 58 },
      { num: "04", name: "Fractura", bpm: 114, pct: 85 },
      { num: "05", name: "Latencia resiDual", bpm: 113, pct: 82 },
    ],
    credits: [
      { role: "Música / Producción", name: "LLLIT (Matias)" },
      { role: "Arte de tapa", name: "Camila Bravo" },
      { role: "Voz", name: "Camila Bravo + Ignacia" },
      { role: "Visuales", name: "LLLIT (TouchDesigner)" },
    ],
    genres: ["Minimal dub", "Psychedelic ambient", "Experimental electronic"],
    price: "$8 USD",
    releaseType: "Bandcamp Friday",
    campaignDate: "04 · 09 · 2026",
  },
]

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug)
}
