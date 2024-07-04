export function convertFirstLetterUpperCase(string: string): string {
    return string.charAt(0).toUpperCase + string.slice(1);
}

export function arrayIncludes(array: any[], string: any): boolean {
    return array.includes(string);
}