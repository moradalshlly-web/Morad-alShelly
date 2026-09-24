/**
 * Source File Parser Architecture
 * Clean abstraction for extracting text from uploaded creative source files.
 *
 * Currently implemented:
 *   - TXT  → fully parsed via File.text()
 *
 * Not yet implemented (interface exists, parser returns 'not-implemented'):
 *   - PDF  → requires a PDF text-extraction library (e.g. pdf-parse)
 *   - DOCX → requires a DOCX parser (e.g. mammoth)
 *
 * Images are NOT parsed here — they are visual references, not text sources.
 * Real parsing for PDF/DOCX can be added by implementing the SourceFileParser
 * interface and registering it in the PARSER_REGISTRY below.
 */

import { ParsedFileResult } from '../../types/content-understanding';

export interface SourceFileParser {
  readonly name: string;
  readonly supportedExtensions: string[];
  canParse(file: File): boolean;
  parse(file: File, fileId: string): Promise<ParsedFileResult>;
}

// ── TXT Parser (fully implemented) ──────────────────────────────

class TxtFileParser implements SourceFileParser {
  readonly name = 'TxtFileParser';
  readonly supportedExtensions = ['txt'];

  canParse(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return this.supportedExtensions.includes(ext) || file.type === 'text/plain';
  }

  async parse(file: File, fileId: string): Promise<ParsedFileResult> {
    const text = await file.text();
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const preview = text.slice(0, 500);

    return {
      fileId,
      fileName: file.name,
      extension: 'txt',
      mimeType: file.type || 'text/plain',
      status: 'parsed',
      extractedText: text,
      textPreview: preview,
      wordCount,
      parserName: this.name,
    };
  }
}

// ── PDF Parser (interface only — not yet implemented) ──────────

class PdfFileParser implements SourceFileParser {
  readonly name = 'PdfFileParser';
  readonly supportedExtensions = ['pdf'];

  canParse(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return ext === 'pdf' || file.type === 'application/pdf';
  }

  async parse(file: File, fileId: string): Promise<ParsedFileResult> {
    return {
      fileId,
      fileName: file.name,
      extension: 'pdf',
      mimeType: file.type || 'application/pdf',
      status: 'not-implemented',
      errorMessage:
        'PDF text extraction is not yet connected. The file is accepted and tracked; a parser can be added via the SourceFileParser interface.',
      parserName: this.name,
    };
  }
}

// ── DOCX Parser (interface only — not yet implemented) ─────────

class DocxFileParser implements SourceFileParser {
  readonly name = 'DocxFileParser';
  readonly supportedExtensions = ['docx'];

  canParse(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  async parse(file: File, fileId: string): Promise<ParsedFileResult> {
    return {
      fileId,
      fileName: file.name,
      extension: 'docx',
      mimeType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      status: 'not-implemented',
      errorMessage:
        'DOCX text extraction is not yet connected. The file is accepted and tracked; a parser can be added via the SourceFileParser interface.',
      parserName: this.name,
    };
  }
}

// ── Parser Registry ────────────────────────────────────────────

const PARSER_REGISTRY: SourceFileParser[] = [
  new TxtFileParser(),
  new PdfFileParser(),
  new DocxFileParser(),
];

/**
 * Finds and runs the appropriate parser for a file.
 * If no parser matches, returns an 'error' result — never fakes parsing.
 */
export async function parseSourceFile(file: File, fileId: string): Promise<ParsedFileResult> {
  const parser = PARSER_REGISTRY.find((p) => p.canParse(file));

  if (!parser) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    return {
      fileId,
      fileName: file.name,
      extension: ext,
      mimeType: file.type || 'application/octet-stream',
      status: 'error',
      errorMessage: `No parser registered for .${ext} files.`,
      parserName: 'none',
    };
  }

  try {
    return await parser.parse(file, fileId);
  } catch (err) {
    return {
      fileId,
      fileName: file.name,
      extension: parser.supportedExtensions[0] || 'unknown',
      mimeType: file.type || 'application/octet-stream',
      status: 'error',
      errorMessage: err instanceof Error ? err.message : 'Parser error',
      parserName: parser.name,
    };
  }
}

/**
 * Parses multiple source files in parallel.
 */
export async function parseSourceFiles(files: File[], fileIds: string[]): Promise<ParsedFileResult[]> {
  return Promise.all(files.map((file, i) => parseSourceFile(file, fileIds[i])));
}
