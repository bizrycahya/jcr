
import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { JcrPdfDocument } from '@/lib/pdf/jcr';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = body?.data || body;
  const buffer = await renderToBuffer(<JcrPdfDocument data={data} />);
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="jcr-report.pdf"',
    },
  });
}
