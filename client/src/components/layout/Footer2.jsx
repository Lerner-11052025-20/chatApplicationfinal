import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Github, Linkedin, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Pricing', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Roadmap', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Cookies', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer>
      {/* Background Elements */}
      <div>
        <motion.div
        />
      </div>

      <div>
        {/* Main Footer Content */}
        <div>
          {/* Brand Column */}
          <motion.div
          >
            <div>
              <div>
                <MessageSquare size={22} />
              </div>
              <h3>
                ChatHub
              </h3>
            </div>
            <p>
              Modern messaging platform for seamless communication and real-time collaboration.
            </p>
            <div>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          {footerLinks.map((column, idx) => (
            <motion.div
              key={column.title}
            >
              <h4>
                {column.title}
              </h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div />

        {/* Bottom Footer */}
        <motion.div
        >
          <div>
            <span>© {currentYear} ChatHub. Made with</span>
            <Heart size={16} />
            <span>by our team.</span>
          </div>

          <div>
            <a href="#privacy">
              Privacy Policy
            </a>
            <div />
            <a href="#terms">
              Terms of Service
            </a>
            <div />
            <a href="#cookies">
              Cookie Settings
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;