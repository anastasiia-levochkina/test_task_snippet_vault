export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

export function parseTags(tags: string) {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
