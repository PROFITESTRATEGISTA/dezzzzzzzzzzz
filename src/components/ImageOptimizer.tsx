import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  title,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  quality = 85,
  placeholder = 'empty',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Gerar srcset para diferentes tamanhos
  const generateSrcSet = (baseSrc: string, baseWidth?: number) => {
    if (!baseWidth) return '';
    
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    return sizes
      .filter(size => size <= baseWidth * 2)
      .map(size => {
        const optimizedSrc = optimizeImageUrl(baseSrc, size, quality);
        return `${optimizedSrc} ${size}w`;
      })
      .join(', ');
  };

  // Otimizar URL da imagem (simulação - em produção usar serviço como Cloudinary)
  const optimizeImageUrl = (url: string, width?: number, qual?: number) => {
    // Para imagens do Pexels, adicionar parâmetros de otimização
    if (url.includes('pexels.com')) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (qual) params.set('q', qual.toString());
      params.set('auto', 'compress');
      params.set('cs', 'tinysrgb');
      
      return `${url}?${params.toString()}`;
    }
    return url;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder enquanto carrega
  const PlaceholderDiv = () => (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ width, height }}
      aria-label="Carregando imagem..."
    />
  );

  // Imagem de erro
  const ErrorDiv = () => (
    <div 
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <span className="text-gray-400 text-sm">Erro ao carregar imagem</span>
    </div>
  );

  if (hasError) {
    return <ErrorDiv />;
  }

  if (!isInView) {
    return <PlaceholderDiv />;
  }

  const optimizedSrc = optimizeImageUrl(src, width, quality);
  const srcSet = width ? generateSrcSet(src, width) : '';

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // Schema.org para imagens
      itemProp="image"
    />
  );
}

// Hook para otimização de imagens
export function useImageOptimization() {
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());

  const preloadImage = (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  };

  const preloadCriticalImages = async (images: string[]) => {
    try {
      await Promise.all(images.map(preloadImage));
    } catch (error) {
      console.warn('Erro ao pré-carregar imagens:', error);
    }
  };

  return {
    imageCache,
    preloadImage,
    preloadCriticalImages
  };
}