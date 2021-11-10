
// Requires https or localhost
export async function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}