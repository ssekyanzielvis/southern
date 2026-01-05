'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

interface FooterInfo {
  organization_name: string | null;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orgName, setOrgName] = useState('Southern Hemisphere Organization');
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    fetchOrgName();
  }, []);

  const fetchOrgName = async () => {
    const { data } = await supabase
      .from('footer_info')
      .select('organization_name')
      .single();
    
    if (data?.organization_name) {
      setOrgName(data.organization_name);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/news', label: 'News' },
    { href: '/leadership', label: 'Leadership' },
    { href: '/contact', label: 'Contact' },
    { href: '/donate', label: 'Donate' },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-md"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Organization Name */}
          <Link href="/" className="flex items-center space-x-2">
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ color: '#FFFFFF' }}
            >
              {orgName}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
