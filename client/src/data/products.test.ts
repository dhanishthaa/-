import { describe, expect, it } from "vitest";
import { getProductGalleryMedia, getProductImageFallback, MAX_PRODUCT_MEDIA_ITEMS, normalizeProductMedia, type Product } from "./products";

const product = (overrides: Partial<Product> = {}): Product => ({
  id: "eclat-courinne",
  name: "First Love",
  notes: "aqua · lavender · citrus",
  description: "A bright composition.",
  collection: "Signature",
  color: "#AAB9B0",
  image: "https://media.example/first-love-cover.webp",
  ...overrides,
});

const image = (id: string, url: string) => ({ id, kind: "image" as const, url });

describe("product image management helpers", () => {
  it("keeps the primary image_url separate from supplementary gallery media", () => {
    const normalized = normalizeProductMedia(product({ media: [] }));

    expect(normalized.image).toBe("https://media.example/first-love-cover.webp");
    expect(normalized.media).toEqual([]);
  });

  it("prefers the explicit primary cover over a different gallery image", () => {
    const item = product({ media: [image("gallery", "https://media.example/detail.webp")] });

    expect(getProductImageFallback(item)).toBe("https://media.example/first-love-cover.webp");
    expect(getProductGalleryMedia(item).map((entry) => entry.url)).toEqual([
      "https://media.example/first-love-cover.webp",
      "https://media.example/detail.webp",
    ]);
  });

  it("moves an existing cover to the first slide without duplicating it", () => {
    const item = product({ media: [image("detail", "https://media.example/detail.webp"), image("cover", "https://media.example/first-love-cover.webp")] });
    const gallery = getProductGalleryMedia(item);

    expect(gallery.map((entry) => entry.id)).toEqual(["cover", "detail"]);
    expect(gallery.filter((entry) => entry.url === item.image)).toHaveLength(1);
  });

  it("uses the first saved gallery image as the cover when image_url is empty", () => {
    const item = product({ image: undefined, media: [image("gallery-cover", "https://media.example/gallery-cover.webp")] });

    expect(getProductImageFallback(item)).toBe("https://media.example/gallery-cover.webp");
    expect(getProductGalleryMedia(item).map((entry) => entry.url)).toEqual(["https://media.example/gallery-cover.webp"]);
  });

  it("preserves an empty remote image field so Admin can display a deleted cover as empty", () => {
    const remote = normalizeProductMedia(product({ image: undefined, media: [] }));

    expect(remote.image).toBeUndefined();
    expect(remote.media).toEqual([]);
    expect(getProductImageFallback(remote)).toBe("/assets/firstlove.png");
  });

  it("retains the database-supported 12-item supplementary gallery limit", () => {
    expect(MAX_PRODUCT_MEDIA_ITEMS).toBe(12);
  });
});
