'use client';

import React from 'react';
import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import JcrPdfDocument from '@/components/pdf/JcrPdfDocument';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = body?.data || body;
  const buffer = await renderToBuffer(<JcrPdfDocument data={data} />);
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    },
  });
}