import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/wordpress';

export const revalidate = 300;

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
