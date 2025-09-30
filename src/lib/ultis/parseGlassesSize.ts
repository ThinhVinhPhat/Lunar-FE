import { GlassesSize } from "@/shared/types/product-varitant";

/**
 * Parse glasses size string to GlassesSize object
 * Input format: '{\r\n  lens: "54mm",\r\n  bridge: "19mm",\r\n  overallWidth: "144mm",\r\n  temple: "145mm",\r\n};'
 * Output: { lens: 54, bridge: 19, overallWidth: 144, temple: 145 }
 */
export function parseGlassesSize(sizeString: string | GlassesSize | undefined | null): GlassesSize {
  // Default values
  const defaultSize: GlassesSize = {
    lens: 0,
    bridge: 0,
    overallWidth: 0,
    temple: 0
  };

  if (!sizeString) {
    return defaultSize;
  }

  // If already an object, return as is
  if (typeof sizeString === 'object' && !Array.isArray(sizeString)) {
    return sizeString as GlassesSize;
  }

  // If it's a string, parse it
  if (typeof sizeString === 'string') {
    try {
      // Remove semicolon at the end and any extra whitespace
      const cleanedString = sizeString.trim().replace(/;$/, '');
      
      // Try to extract values using regex
      const lensMatch = cleanedString.match(/lens:\s*"?(\d+)mm?"?/);
      const bridgeMatch = cleanedString.match(/bridge:\s*"?(\d+)mm?"?/);
      const overallWidthMatch = cleanedString.match(/overallWidth:\s*"?(\d+)mm?"?/);
      const templeMatch = cleanedString.match(/temple:\s*"?(\d+)mm?"?/);

      return {
        lens: lensMatch ? parseInt(lensMatch[1], 10) : 0,
        bridge: bridgeMatch ? parseInt(bridgeMatch[1], 10) : 0,
        overallWidth: overallWidthMatch ? parseInt(overallWidthMatch[1], 10) : 0,
        temple: templeMatch ? parseInt(templeMatch[1], 10) : 0
      };
    } catch (error) {
      console.error('Error parsing glasses size:', error);
      return defaultSize;
    }
  }

  return defaultSize;
}


export function formatGlassesSize(size: GlassesSize | string | undefined | null): string {
  const parsedSize = parseGlassesSize(size);
  
  if (!parsedSize || (parsedSize.lens === 0 && parsedSize.bridge === 0 && parsedSize.overallWidth === 0 && parsedSize.temple === 0)) {
    return 'N/A';
  }

  return `${parsedSize.lens}mm-${parsedSize.bridge}mm-${parsedSize.overallWidth}mm-${parsedSize.temple}mm`;
}


export function formatGlassesSizeWithLabels(size: GlassesSize | string | undefined | null): string {
  const parsedSize = parseGlassesSize(size);
  
  if (!parsedSize || (parsedSize.lens === 0 && parsedSize.bridge === 0 && parsedSize.overallWidth === 0 && parsedSize.temple === 0)) {
    return 'Size not available';
  }

  return `Lens: ${parsedSize.lens}mm | Bridge: ${parsedSize.bridge}mm | Width: ${parsedSize.overallWidth}mm | Temple: ${parsedSize.temple}mm`;
}
