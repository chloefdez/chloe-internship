import axios from "axios";

const http = axios.create({
  baseURL: "https://us-central1-nft-cloud-functions.cloudfunctions.net/",
});

export async function fetchHotCollections(signal) {
  const res = await http.get("hotCollections", { signal });
  return res.data;
}

export async function fetchNewItems(signal) {
  const res = await http.get("newItems", { signal });
  return res.data || [];
}

export async function fetchTopSellers(signal) {
  const res = await http.get("topSellers", { signal });
  return res.data || [];
}

export async function fetchExploreItems(signal) {
  const res = await http.get("explore", { signal });
  return res.data || [];
}

export async function fetchAuthor(authorId, signal) {
  if (!authorId) throw new Error("authorId is required");
  const res = await http.get(`authors?author=${authorId}&t=${Date.now()}`, { signal });
  return res.data || null;
}

export async function fetchAuthorItems(authorId, signal) {
  if (!authorId) throw new Error("authorId is required");

  const res = await http.get("authors", {
    signal,
    params: { author: authorId, t: Date.now() }, 
  });

  const d = res.data;

  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.nftItems)) return d.nftItems;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.nftCollection)) return d.nftCollection; 
  if (Array.isArray(d?.author?.nftItems)) return d.author.nftItems;
  if (Array.isArray(d?.author?.items)) return d.author.items;
  if (Array.isArray(d?.author?.nftCollection)) return d.author.nftCollection; 
  if (Array.isArray(d?.data?.nftItems)) return d.data.nftItems;
  if (Array.isArray(d?.data?.items)) return d.data.items;
  if (Array.isArray(d?.data?.nftCollection)) return d.data.nftCollection; 

  if (d?.nft) return [d.nft];
  if (d?.item) return [d.item];

  return [];
}



export async function fetchItemDetails(nftId, signal) {
  if (!nftId) throw new Error("nftId is required");

  const res = await http.get("itemDetails", {
    signal,
    params: { nftId, t: Date.now() },
  });

  const d = res.data || null;
  if (!d) return null;

  // sanitize image fields so UI won't crash
  const fixUrl = (u) => {
    if (!u) return null;
    if (typeof u !== "string") return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return null; // reject invalid/relative URLs
  };

  return {
    ...d,
    nftImage: fixUrl(d.nftImage) || null,
    image: fixUrl(d.image) || null,
    img: fixUrl(d.img) || null,
  };
}
