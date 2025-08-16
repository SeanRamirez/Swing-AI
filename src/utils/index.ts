export function createPageUrl(pageName: string): string {
  const pageMap: Record<string, string> = {
    'Dashboard': '/',
    'Upload': '/upload',
    'Analysis': '/analysis',
    'Progress': '/progress',
    'Profile': '/profile'
  };
  
  return pageMap[pageName] || '/';
}
