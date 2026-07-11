export function getVideoGridClass(count) {
    if (count <= 0) return 'grid0';
    if (count === 1) return 'grid1';
    if (count === 2) return 'grid2';
    if (count <= 4) return `grid${count}`;
    if (count <= 6) return `grid${count}`;
    return 'grid9';
}