import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

import { ReadonlyURLSearchParams } from "next/navigation";

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

import { Image as ShopifyImage } from "lib/shopify/types";

export function ensureStartsWith(text: string, startsWith: string): string {
  const startsWithLen = startsWith.length;
  if (text.length >= startsWithLen && text.slice(0, startsWithLen) === startsWith) {
    return text;
  }
  return `${startsWith}${text}`;
}

export const imageLoader = (image: ShopifyImage) => {
  const src = image.url;
  const isPassthrough = src.startsWith("http") || src.startsWith("//");
  const url = isPassthrough ? src : `${process.env.NEXT_PUBLIC_IMAGES_CDN_URL}${src}`;
  return `${url}?w=${image.width}&h=${image.height}&auto=format&lossless=true`;
}