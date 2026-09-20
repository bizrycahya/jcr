import React from 'react';
import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import JcrPdfDocument from '@/lib/pdf/jcr';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = body?.data ?? body;

    const pdfElement = <JcrPdfDocument data={data} /> as React.ReactElement;
    const buffer = await renderToBuffer(pdfElement);
    const pdfBytes = new Uint8Array(buffer);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="jcr-report.pdf"',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate PDF',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}