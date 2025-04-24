export const createCSS = (iconName: string, iconContent: string) => {
  // Encode the SVG content for use in a data URL
  const encodedContent = encodeURIComponent(iconContent)
    .replace(/%0A/g, "") // Remove newlines
    .replace(/%20/g, " "); // Replace %20 with space for better readability

  return `.di-${iconName} { content: url('data:image/svg+xml;utf8,${encodedContent}'); };\n`;
};
