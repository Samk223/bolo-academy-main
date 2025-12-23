import { BookOpen, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/', label: 'Twitter' },
  { icon: Linkedin, href: 'https://in.linkedin.com/', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://www.youtube.com/', label: 'YouTube' },
];

const footerLinks = {
  courses: [
    { name: 'Basic Boost Plan', href: '#courses' },
    { name: 'Speaker Combo Plan', href: '#courses' },
    { name: 'Fluency Fast-Track Plan', href: '#courses' },
    { name: 'Gold Master Plan', href: '#courses' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
    { name: 'Home', href: '#home' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-background">
                Bolo<span className="text-primary">Academy</span>
              </span>
            </a>
            <p className="text-background/70 max-w-md mb-6 leading-relaxed">
              Transforming lives through the power of spoken English. Join Mumbai's premier 
              English speaking academy and unlock your true potential.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-background/70 group-hover:text-primary-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Courses Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Our Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} Bolo Academy. All rights reserved.
          </p>
          <p className="text-background/50 text-sm">
            Made with ❤️ in Sangli
          </p>
        </div>
      </div>
    </footer>
  );
}
