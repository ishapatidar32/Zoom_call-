const RESERVED_PATHS = ['auth', 'home', 'history'];

export function getMeetingLink(code) {
    const meetingCode = code || window.location.pathname.replace(/^\//, '');
    return `${window.location.origin}/${meetingCode}`;
}

export async function copyMeetingLink(code) {
    const link = getMeetingLink(code);
    await navigator.clipboard.writeText(link);
    return link;
}

export function parseMeetingInput(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;

    try {
        if (trimmed.includes('://') || trimmed.startsWith('/')) {
            const url = trimmed.startsWith('/')
                ? new URL(trimmed, window.location.origin)
                : new URL(trimmed);
            const code = url.pathname.replace(/^\//, '').split('/')[0];
            if (code && !RESERVED_PATHS.includes(code.toLowerCase())) {
                return code;
            }
            return null;
        }
    } catch {
        // treat as plain meeting code
    }

    if (RESERVED_PATHS.includes(trimmed.toLowerCase())) return null;
    return trimmed;
}