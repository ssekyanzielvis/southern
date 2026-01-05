'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';

interface FooterData {
  organization_name: string | null;
  location: string | null;
  director: string | null;
  email: string | null;
  phone: string | null;
  organization_type: string | null;
  primary_focus: string | null;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    const { data } = await supabase
      .from('footer_info')
      .select('*')
      .single();
    
    if (data) {
      setFooterData(data);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full mt-auto"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          {/* Organization Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {footerData?.organization_name || 'Organization'}
            </h3>
            <div className="space-y-2">
              {footerData?.organization_type && (
                <div className="flex items-start space-x-2">
                  <Building2 size={18} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">{footerData.organization_type}</span>
                </div>
              )}
              {footerData?.primary_focus && (
                <p className="text-sm opacity-90">{footerData.primary_focus}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              {footerData?.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={18} className="flex-shrink-0" />
                  <a
                    href={`mailto:${footerData.email}`}
                    className="text-sm hover:underline"
                  >
                    {footerData.email}
                  </a>
                </div>
              )}
              {footerData?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={18} className="flex-shrink-0" />
                  <a
                    href={`tel:${footerData.phone}`}
                    className="text-sm hover:underline"
                  >
                    {footerData.phone}
                  </a>
                </div>
              )}
              {footerData?.location && (
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">{footerData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <h3 className="text-xl font-bold mb-4">Leadership</h3>
            {footerData?.director && (
              <div>
                <p className="text-sm font-semibold">Director</p>
                <p className="text-sm opacity-90">{footerData.director}</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/programs" className="text-sm hover:underline">
                  Our Programs
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-sm hover:underline">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/donate" className="text-sm hover:underline">
                  Donate Now
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white">
          <p className="text-sm opacity-90">
            © {currentYear} {footerData?.organization_name || 'Southern Organization'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
