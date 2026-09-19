/**
 * Utility to sanitize rich text HTML content and prevent Stored XSS attacks.
 * Strips script tags, event handlers (e.g. onerror, onclick), and javascript: protocol URIs.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let clean = html;

  // 1. Remove script, style, object, embed, iframe, and form tags and their contents
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^>]*>/gi, '');
  clean = clean.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');
  clean = clean.replace(/<meta\b[^>]*>/gi, '');
  clean = clean.replace(/<link\b[^>]*>/gi, '');

  // 2. Remove all inline event handlers (e.g. onerror=..., onload=..., onclick=...)
  clean = clean.replace(/\son[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove dangerous protocols in href, src, or data attributes (e.g., javascript:, vbscript:, data:text/html)
  clean = clean.replace(/\b(href|src)\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, '$1="#"');
  clean = clean.replace(/\b(href|src)\s*=\s*(?:'vbscript:[^']*'|"vbscript:[^"]*"|vbscript:[^\s>]+)/gi, '$1="#"');
  clean = clean.replace(/\b(href|src)\s*=\s*(?:'data:text\/html[^']*'|"data:text\/html[^"]*"|data:text\/html[^\s>]+)/gi, '$1="#"');

  return clean;
}
