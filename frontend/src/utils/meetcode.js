export function generateMeetingCode() {
    return Math.random().toString(36).substring(2, 8);
}

export async function copyMeetingCode(code) {
    await navigator.clipboard.writeText(code);
    return code;
}