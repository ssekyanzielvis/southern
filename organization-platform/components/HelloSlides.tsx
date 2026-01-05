'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';

interface Slide {
  id: string;
  image_url: string;
  description: string | null;
  direction: string;
}

export default function HelloSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hello_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse"></div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  // Determine the animation class based on first slide's direction
  const animationClass = slides.length > 0 && slides[0].direction === 'right' 
    ? 'animate-scroll-right' 
    : 'animate-scroll-left';

  return (
    <section className="w-full overflow-hidden bg-gray-100 py-8">
      <div className="relative">
        {/* Scrolling Container */}
        <div className={`flex gap-6 ${animationClass} hover:pause-animation`}>
          {/* Duplicate slides for infinite scroll effect */}
          {[...slides, ...slides, ...slides].map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="relative flex-shrink-0 w-80 h-64 md:w-96 md:h-80 rounded-lg overflow-hidden shadow-lg group"
            >
              <Image
                src={slide.image_url || '/placeholder.jpg'}
                alt={slide.description || 'Slide image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Description overlay on hover */}
              {slide.description && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <p className="text-white text-center text-sm md:text-base">
                    {slide.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
