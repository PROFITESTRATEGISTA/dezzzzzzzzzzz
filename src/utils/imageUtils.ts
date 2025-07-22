// Utilitários para otimização de imagens

export interface ImageConfig {
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
  sizes: number[];
  lazyLoad: boolean;
}

export const defaultImageConfig: ImageConfig = {
  quality: 85,
  format: 'webp',
  sizes: [320, 640, 768, 1024, 1280, 1920],
  lazyLoad: true
};

// Gerar nomes de arquivo SEO-friendly
export function generateSEOFileName(
  originalName: string, 
  alt: string, 
  location?: string
): string {
  // Remover extensão
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  // Criar slug SEO-friendly
  const seoSlug = alt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
  
  // Adicionar localização se fornecida
  const locationSlug = location 
    ? `-${location.toLowerCase().replace(/\s+/g, '-')}`
    : '';
  
  return `${seoSlug}${locationSlug}-dez-saude`;
}

// Gerar alt text otimizado
export function generateOptimizedAltText(
  baseAlt: string,
  context: string,
  location: string = 'São Paulo'
): string {
  const keywords = ['Dez Saúde', 'emergência médica', location];
  
  // Verificar se já contém keywords importantes
  const hasKeywords = keywords.some(keyword => 
    baseAlt.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (hasKeywords) {
    return baseAlt;
  }
  
  // Adicionar context e localização
  return `${baseAlt} - ${context} Dez Saúde ${location}`;
}

// Calcular tamanhos responsivos
export function calculateResponsiveSizes(
  breakpoints: { [key: string]: number } = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  }
): string {
  return [
    `(max-width: ${breakpoints.mobile}px) 100vw`,
    `(max-width: ${breakpoints.tablet}px) 50vw`,
    `(max-width: ${breakpoints.desktop}px) 33vw`,
    '25vw'
  ].join(', ');
}

// Validar formato de imagem
export function validateImageFormat(url: string): boolean {
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  return supportedFormats.some(format => 
    url.toLowerCase().includes(format)
  );
}

// Gerar structured data para imagem
export function generateImageStructuredData(
  url: string,
  alt: string,
  title: string,
  width?: number,
  height?: number
) {
  return {
    "@type": "ImageObject",
    "url": url,
    "name": title,
    "description": alt,
    "width": width,
    "height": height,
    "encodingFormat": url.includes('.webp') ? 'image/webp' : 'image/jpeg',
    "author": {
      "@type": "Organization",
      "name": "Dez Saúde - Emergências Médicas"
    },
    "copyrightHolder": {
      "@type": "Organization", 
      "name": "Dez Saúde"
    },
    "contentLocation": {
      "@type": "Place",
      "name": "São Paulo, SP, Brasil"
    }
  };
}

// Performance: Preload de imagens críticas
export function preloadCriticalImages(imageUrls: string[]): void {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

// Lazy loading com Intersection Observer
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Compressão de imagem (simulação)
export function getOptimizedImageUrl(
  originalUrl: string,
  width?: number,
  quality: number = 85,
  format: string = 'webp'
): string {
  // Para Pexels
  if (originalUrl.includes('pexels.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('auto', 'compress');
    params.set('cs', 'tinysrgb');
    params.set('fit', 'crop');
    params.set('q', quality.toString());
    
    return `${originalUrl}?${params.toString()}`;
  }
  
  // Para outras URLs, retornar original
  return originalUrl;
}