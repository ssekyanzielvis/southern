'use client';

import Image from 'next/image';

interface ImageCardProps {
  imageUrl: string;
  title?: string;
  description: string;
  className?: string;
}

export default function ImageCard({ imageUrl, title, description, className = '' }: ImageCardProps) {
  return (
    <div className={`relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="relative w-full h-64 md:h-80">
        <Image
          src={imageUrl || '/placeholder.jpg'}
          alt={title || 'Image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with description on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          {title && (
            <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
          )}
          <p className="text-white text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
