// Pure lecture helpers shared by the browser player, the server (TTS allow-list) and the validator.

// Content-addressed id of one spoken line: the server only synthesizes ids it finds in the content.
export async function ttsId(voice, text) {
  const buf = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${voice}\n${text}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function lectureLines(modules) {
  const lines = new Set();
  for (const m of modules) for (const l of m.lessons || []) for (const b of l.lecture || []) { if (b.say) lines.add(b.say); for (const m of Object.values(b.moves || {})) lines.add(m); }
  return [...lines];
}

// How long a caption stays up when there is no audio.
export const readingMs = (text) => Math.max(2000, String(text).trim().split(/\s+/).length * 350);

export function boardBlock(lesson, beat) {
  if (typeof beat.show === 'number') return lesson.blocks?.[beat.show] || null;
  return beat.show && typeof beat.show === 'object' ? beat.show : null;
}
