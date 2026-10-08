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

export interface FocusTrack {
  num: string
  name: string
  blurb: string
}

export interface PressItem {
  outlet: string
  quote?: string
  url: string
  date?: string
  kind: "review" | "feature" | "share"
}

export interface StreamLink {
  label: string
  url: string
  primary?: boolean
  note?: string
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
  bandcampAlbumId?: string
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
  focusTracks?: FocusTrack[]
  press?: PressItem[]
  streamLinks?: StreamLink[]
}

export const albums: Album[] = [
  {
    slug: "inesperado-contratiempo",
    title: "Inesperado contratiempo",
    artist: "LLLIT",
    releaseDate: "2026-10-02",
    label: "LLLIT Records",
    description:
      "Inesperado contratiempo es un EP de cinco pistas del artista chileno LLLIT que trata el dub techno como una historia lenta y sin palabras. El álbum recorre ritmos dub casi tribales y un diseño de sonido profundamente textural, con sutiles rastros vocales que emergen como recuerdos en la niebla. Construido a partir de pulsos contenidos e hipnóticos en lugar de grandes caídas, el EP se siente narrativo: cada pista es un giro distinto de un «inesperado contratiempo», pasando de la deriva al impacto y a las imágenes persistentes. Es lento, ahumado y espacioso — dub / dub techno y downtempo al borde del ambient y la electrónica experimental, pensado más para la escucha profunda que para la pista de baile.",
    descriptionEn:
      "Inesperado Contratiempo is a five-track EP from Chilean shadow-figure LLLIT that treats dub techno like a slow, wordless story. The album moves through dubby, almost tribal rhythms and deeply textural sound design, with subtle vocal traces surfacing like memories in the fog. Built from restrained, hypnotic pulses rather than big drops, the EP feels narrative: each track is a different twist in an “unexpected setback,” shifting from drift to impact to lingering after-images. It’s slow, smoky and spacious – dub / dub techno and downtempo on the edge of ambient and experimental electronica, designed more for deep listening than the dancefloor.",
    coverUrl: "/images/album/cover-small.png",
    visualBgUrl: "/images/album/visual-bg.webp",
    bandcampUrl: "https://lllit3.bandcamp.com/album/inesperado-contratiempo",
    bandcampAlbumId: "1060409196",
    instagramUrl: "https://instagram.com/lllit_3",
    instagramHandle: "@lllit_3",
    youtubeUrl:
      "https://www.youtube.com/watch?v=3r_SNm6Hp74&list=OLAK5uy_mL3vajcG7ukfjr5iQA-qi1lgVeCDU5QQM",
    soundcloudUrl: "https://soundcloud.com/lllit_3",
    tracks: [
      { num: "01", name: "Desvío sin aviso", bpm: 103, pct: 63 },
      { num: "02", name: "Deriva", bpm: 95, pct: 52 },
      { num: "03", name: "Umbral", bpm: "99.9", pct: 58 },
      { num: "04", name: "Fractura", bpm: 114, pct: 85 },
      { num: "05", name: "Latencia resiDual", bpm: 113, pct: 82 },
    ],
    credits: [
      { role: "Escrito, producido y masterizado por", name: "LLLIT" },
      { role: "Diseño (TouchDesigner)", name: "LLLIT" },
      { role: "Collage", name: "Camola Bravo" },
      { role: "Voz", name: "Camila Bravo" },
      { role: "Voz adicional", name: "Groovidub" },
    ],
    genres: [
      "Downtempo",
      "Dub techno",
      "Ambient",
      "Experimental electronic",
      "Techno (minimal / deep)",
    ],
    price: "$8 USD",
    releaseType: "Bandcamp Friday",
    campaignDate: "02 · 10 · 2026",
    focusTracks: [
      {
        num: "03",
        name: "Umbral",
        blurb:
          "One of the deepest cuts on the EP – a very bass-driven track that evolves slowly across five minutes of minimal dub, psychedelic ambient and experimental electronics. Spanish vocal fragments appear near the beginning like ghosts, then sink back under the low-end and echo. It’s slow, heavy and hypnotic: built for deep listening, somewhere between dub techno, downtempo and spaced-out electronica.",
      },
      {
        num: "05",
        name: "Latencia resiDual",
        blurb:
          "Closes the EP on its most melodic, techno-leaning note. Still rooted in LLLIT’s smoky dub atmosphere, the track brings a stronger pulse and a more defined lead line, slowly rising out of the fog. It feels like the emotional after-image of the record: deep, driving and hypnotic, somewhere between dub techno and melodic, late-night techno.",
      },
    ],
    press: [
      {
        outlet: "Parkett Channel",
        quote:
          "LLLIT’s new track is a beautifully crafted piece of minimalist experimentation that instantly recalls the golden era of Matthew Herbert, Perlon and Ricardo Villalobos. It’s a solid, credible production with a strong sense of identity and a deep understanding of that aesthetic.",
        url: "https://www.parkettchannel.it/",
        kind: "feature",
      },
      {
        outlet: "Doozy Magazine",
        quote:
          "Lovely deep and low tempo dub techno goodness with a good dose of trippy vocal across this. The spirit of Villalobos can be felt!",
        url: "https://doozymagazine0.wordpress.com/",
        kind: "feature",
      },
      {
        outlet: "Hominiscanidae",
        quote:
          "A very solid electronic instrumental – the synth work is strong, the production is tight, and the track evolves smoothly from start to finish. I especially like the way the spoken-word vocals are woven into the arrangement.",
        url: "https://www.hominiscanidae.org/",
        kind: "feature",
      },
      {
        outlet: "Sykonee",
        url: "https://emcritic.blogspot.com/2026/10/lllit-inesperado-contratiempo.html",
        kind: "review",
      },
      {
        outlet: "909Originals",
        url: "https://909originals.com/2026/09/02/chilean-producer-lllit-releases-inesperado-contratiempo-ep/",
        date: "2026-09-02",
        kind: "review",
      },
      {
        outlet: "Choonreview",
        url: "https://choonreview.com/lllit-inesperado-contratiempo-self-released-album-review/",
        date: "2026-09-02",
        kind: "review",
      },
      {
        outlet: "MixCult",
        url: "https://soundcloud.com/mixcult/lllit-desvi-o-sin-aviso",
        date: "2026-09-29",
        kind: "share",
      },
    ],
    streamLinks: [
      {
        label: "Bandcamp",
        url: "https://lllit3.bandcamp.com/album/inesperado-contratiempo",
        primary: true,
      },
      {
        label: "Spotify",
        url: "https://open.spotify.com/album/1RhKnCw5drwsGGzAMm0AZC",
      },
      {
        label: "Apple Music",
        url: "https://music.apple.com/us/artist/lllit/1625115702",
      },
      {
        label: "YouTube",
        url: "https://www.youtube.com/watch?v=3r_SNm6Hp74&list=OLAK5uy_mL3vajcG7ukfjr5iQA-qi1lgVeCDU5QQM",
        note: "Desvío Sin Aviso (playlist)",
      },
      {
        label: "Download",
        url: "https://dlcm.app/ec-underground/lllit-linesperado-contratiempo",
      },
    ],
  },
]

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug)
}
