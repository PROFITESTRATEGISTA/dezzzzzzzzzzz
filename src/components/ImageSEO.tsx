import React from 'react';

interface ImageSEOProps {
  images: Array<{
    url: string;
    alt: string;
    title: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
  pageTitle: string;
  pageUrl: string;
}

export function ImageSEO({ images, pageTitle, pageUrl }: ImageSEOProps) {
  // Gerar sitemap de imagens
  const generateImageSitemap = () => {
    const sitemapImages = images.map(img => ({
      "@type": "ImageObject",
      "url": img.url,
      "name": img.title,
      "description": img.alt,
      "width": img.width,
      "height": img.height,
      "caption": img.caption,
      "contentUrl": img.url,
      "thumbnailUrl": img.url.replace(/\.(jpg|jpeg|png)/, '_thumb.$1'),
      "encodingFormat": img.url.includes('.webp') ? 'image/webp' : 'image/jpeg',
      "uploadDate": new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "Dez Saúde - Emergências Médicas"
      },
      "copyrightHolder": {
        "@type": "Organization",
        "name": "Dez Saúde"
      },
      "license": "https://dezsaudefarma.com.br/termos-uso",
      "acquireLicensePage": "https://dezsaudefarma.com.br/licenca-imagens"
    }));

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageTitle,
      "url": pageUrl,
      "image": sitemapImages,
      "mainEntity": {
        "@type": "MedicalBusiness",
        "name": "Dez Saúde - Emergências Médicas",
        "image": sitemapImages
      }
    };
  };

  // Schema para galeria de imagens
  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `Galeria de Imagens - ${pageTitle}`,
    "description": "Imagens do Plano Dez Saúde - Emergências Médicas em São Paulo",
    "image": images.map(img => ({
      "@type": "ImageObject",
      "url": img.url,
      "name": img.title,
      "description": img.alt,
      "width": img.width,
      "height": img.height,
      "thumbnail": {
        "@type": "ImageObject",
        "url": img.url.replace(/\.(jpg|jpeg|png)/, '_thumb.$1')
      }
    }))
  };

  return (
    <>
      {/* Schema para sitemap de imagens */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateImageSitemap())
        }}
      />

      {/* Schema para galeria */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageGallerySchema)
        }}
      />

      {/* Meta tags para imagens */}
      {images.length > 0 && (
        <>
          <meta property="og:image" content={images[0].url} />
          <meta property="og:image:alt" content={images[0].alt} />
          <meta property="og:image:width" content={images[0].width?.toString()} />
          <meta property="og:image:height" content={images[0].height?.toString()} />
          <meta name="twitter:image" content={images[0].url} />
          <meta name="twitter:image:alt" content={images[0].alt} />
        </>
      )}

      {/* Preload para imagens críticas */}
      {images.slice(0, 2).map((img, index) => (
        <link
          key={index}
          rel="preload"
          as="image"
          href={img.url}
          media="(min-width: 768px)"
        />
      ))}
    </>
  );
}