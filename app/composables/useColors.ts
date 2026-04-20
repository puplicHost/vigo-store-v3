export function useColors() {
  const standardColors: Record<string, string> = {
    'Obsidian': '#000000',
    'Charcoal': '#333333',
    'Sandstone': '#d2b48c',
    'Ecru': '#c2b280',
    'White': '#ffffff',
    'Cream': '#f5f5f5',
    'Sky Blue': '#87ceeb',
    'Red': '#ff0000',
    'Green': '#00ff00',
    'Blue': '#0000ff',
    'Yellow': '#ffff00',
    'Cyan': '#00ffff',
    'Magenta': '#ff00ff',
    'Silver': '#c0c0c0',
    'Gray': '#808080',
    'Maroon': '#800000',
    'Olive': '#808000',
    'Purple': '#800080',
    'Teal': '#008080',
    'Navy': '#000080',
    'Brown': '#a52a2a',
    'Pink': '#ffc0cb',
    'Orange': '#ffa500',
    'Gold': '#ffd700',
    'Beige': '#f5f5dc',
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const getColorName = (color: string | undefined | null) => {
    if (!color) return ''
    const clr = color.toLowerCase();
    
    // Exact name matches for basic text strings (fallback)
    if (clr === 'black') return 'Obsidian';
    if (clr === 'white') return 'White';
    
    const rgb = hexToRgb(clr);
    if (!rgb) return color;

    let closestColor = '';
    let minDistance = Infinity;

    Object.entries(standardColors).forEach(([name, cHex]) => {
      let cRgb = hexToRgb(cHex);
      if(cRgb) {
          let distance = Math.sqrt(
            Math.pow(rgb.r - cRgb.r, 2) +
            Math.pow(rgb.g - cRgb.g, 2) +
            Math.pow(rgb.b - cRgb.b, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
          }
      }
    });

    return closestColor || color;
  }

  return {
    getColorName,
    standardColors
  }
}
