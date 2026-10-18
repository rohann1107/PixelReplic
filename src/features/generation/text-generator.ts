export function convertMarkdownToPlainText(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+(.*)$/gm, '$1\n========================================')
    // Remove blockquotes
    .replace(/^>\s+(.*)$/gm, 'NOTE: $1')
    // Format bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Format inline code
    .replace(/`([^`]+)`/g, '$1')
    // Format code blocks
    .replace(/```[a-z]*\n([\s\S]*?)```/g, '\n--- CODE BLOCK ---\n$1\n------------------\n')
    // Format tables loosely into tabbed text
    .replace(/\|/g, '  ')
    .replace(/-{3,}/g, '')
    // Remove links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .trim();
}
