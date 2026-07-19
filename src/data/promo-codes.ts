export const PROMO_CODES: string[] = [
  "8lrd-yfsr", "tsmc-7qhd", "6jsy-wns7", "kb4n-hah5", "uasl-vbar",
  "m9qh-6cud", "fyrh-yxah", "wuvs-bv35", "cmge-c9cf", "erkb-wt4a",
  "rx3m-c2jb", "acv9-xc9w", "rpbk-ecy4", "hnj7-x5za", "hw9d-e3y7",
  "jstc-7snv", "f4ne-5lp9", "mcd9-babt", "gj4z-w7s7", "yfsu-heh5",
  "3a4x-v3ar", "a6es-6wud", "ry7c-g4ah", "d25c-3q35", "6l7l-gncr",
  "kc54-uj4d", "nj7j-e6ec", "l9w7-3yfw", "4ysa-cuv4", "cuqb-hpza",
  "cl8w-5ry7", "esz4-7dnv", "rh2q-5hp9", "acl6-bebt", "8psk-wus7",
  "v4v8-hw6w", "7eby-est4", "l7x3-us3m", "4mcm-jld6", "qrjf-kawy",
  "gxbx-g7cr", "ycvh-uv4d", "3pfp-ekec", "d6db-b8fw", "sy45-wfv4",
  "s2pf-haza", "7zf4-yl5h", "x3ah-bj25", "4v9j-wksf", "qfyr-cyha",
  "fdu5-crqb", "5h5g-xs6w", "be7z-edt4", "wrwn-ud3m", "smhv-jhd6",
  "pbe7-kewy", "8drd-gucr", "v4lg-bprt", "6esy-wfc7", "z74n-ha45",
  "nmsl-v25r",
]

export const RELEASE_DATE = new Date("2025-01-01T00:00:00Z") // TODO: volver a 2026-09-04 antes del deploy
export const ALBUM_TITLE = "Inesperado contratiempo"

export function isReleased(): boolean {
  return new Date() >= RELEASE_DATE
}
