import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const allowedOrigin = process.env.REVALIDATE_ORIGIN ?? "http://localhost:5173";

type RequestPage = string | { page?: string; slug?: string };

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    ...(origin === allowedOrigin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "Content-Type, x-revalidate-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function targetFor(page: RequestPage) {
  const name = typeof page === "string" ? page : page.page;
  const slug = typeof page === "string" ? "" : (page.slug ?? "").trim();

  if (name === "home") {
    return { tag: "home-page", paths: ["/", "/ar"] };
  }

  if (name === "shop") {
    return { tag: "all-product", paths: ["/shop", "/ar/shop"] };
  }

  if (name === "products") {
    return { tag: "products", paths: [] };
  }

  if (name === "categories") {
    return { tag: "categories", paths: [] };
  }

  if (name === "category") {
    if (slug && !slug.includes("/") && !slug.includes("..")) {
      return {
        tag: `category:${slug}`,
        paths: [`/product-category/${slug}`, `/ar/product-category/${slug}`],
      };
    }

    return { tag: "category", paths: [] };
  }

  if (name === "product" && slug && !slug.includes("/") && !slug.includes("..")) {
    return {
      tag: `product:${slug}`,
      paths: [`/product/${slug}`, `/ar/product/${slug}`],
    };
  }

  return null;
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const headers = corsHeaders(request);
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401, headers });
  }

  let pages: RequestPage[] = ["home"];

  try {
    const body = await request.json();
    if (Array.isArray(body?.pages) && body.pages.length > 0) pages = body.pages;
  } catch {
    pages = ["home"];
  }

  const tags: string[] = [];
  const paths: string[] = [];

  for (const page of pages) {
    const target = targetFor(page);
    if (!target) {
      return NextResponse.json({ message: "Invalid page" }, { status: 400, headers });
    }
    tags.push(target.tag);
    paths.push(...target.paths);
  }

  for (const tag of new Set(tags)) revalidateTag(tag, { expire: 0 });
  for (const path of new Set(paths)) revalidatePath(path);

  return NextResponse.json({ revalidated: true, paths: [...new Set(paths)] }, { headers });
}
