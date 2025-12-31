import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { WatersLabLogo } from './WatersLabLogo'
import { cn } from '@/lib/utils'

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <WatersLabLogo className="h-10 w-10" />
            <span className="text-xl font-bold">WatersLab</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={cn(
                  'p-2 rounded-full',
                  'bg-white/10 hover:bg-white/20',
                  'transition-colors duration-200',
                )}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; {currentYear} WatersLab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
