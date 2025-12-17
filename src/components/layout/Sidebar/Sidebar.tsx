'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Sidebar.module.css';

import { PiSidebar } from 'react-icons/pi';
import {
  FiHome,
  FiBookOpen,
  FiLayers,
  FiBarChart2,
  FiAward,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiBookmark,
} from 'react-icons/fi';

import { useAuthStore, useUserStore } from '@/store';
import { toast } from 'sonner';

export interface SidebarProps {
  toggleSidebar: () => void;
}

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const Sidebar: FC<SidebarProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();

  const logoutAuth = useAuthStore((s) => s.logout);
  const profile = useUserStore((s) => s.profile);
  const displayName = profile?.name ?? "Guest User";
  const displayEmail = profile?.email; 

  const mainLinks: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <FiHome size={16} /> },
    {
      id: 'pyq',
      label: 'Previous Year Questions',
      href: '/previous-year-questions',
      icon: <FiBookOpen size={16} />,
    },
    {
      id: 'chapter',
      label: 'Chapter wise Questions',
      href: '/chapter-wise-questions',
      icon: <FiLayers size={16} />,
    },
    { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <FiBarChart2 size={16} /> },
    {
      id: 'leaderboard',
      label: 'Leaderboards',
      href: '/leaderboards',
      icon: <FiAward size={16} />,
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      href: '/bookmarks',
      icon: <FiBookmark />,
    }
  ];

  const secondaryLinks: NavItem[] = [
    { id: 'profile', label: 'Profile', href: '/profile', icon: <FiUser size={16} /> },
    { id: 'settings', label: 'Settings', href: '/settings', icon: <FiSettings size={16} /> },
    { id: 'help', label: 'Help & Support', href: '/help-&-support', icon: <FiHelpCircle size={16} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) {
      return true;
    }
    return pathname === href;
  };

  const initials =
    profile?.name
      ?.split(' ')
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join('') || 'GU';

  const handleLogout = () => {
    logoutAuth();     // clear accessToken from auth store
    toast.success('Logged out.');
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <button
        onClick={toggleSidebar}
        className={styles.sidebarIcon}
        aria-label="Toggle Sidebar"
      >
        <PiSidebar size={18} />
      </button>

      <div className={styles.sidebarInner}>
        {/* Brand */}
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo.png"
            alt="JEEArchive Logo"
            width={32}
            height={32}
            className={styles.logo}
          />
          <div className={styles.logoTextBlock}>
            <span className={styles.logoText}>JEE Archive</span>
            <span className={styles.logoSubText}>Ace your JEE</span>
          </div>
        </div>

        {/* Nav sections */}
        <nav className={styles.nav}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Practice</span>
              <span className={styles.sectionDivider} />
            </div>
            <ul>
              {mainLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`${styles.navItem} ${
                      isActive(link.href) ? styles.navItemActive : ''
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Account</span>
              <span className={styles.sectionDivider} />
            </div>
            <ul>
              {secondaryLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`${styles.navItem} ${
                      isActive(link.href) ? styles.navItemActive : ''
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerProfile}>
          <div className={styles.footerAvatar}>
            <span>{initials}</span>
          </div>
          <div className={styles.footerInfo}>
            <span className={styles.footerName}>{displayName}</span>
            <span className={styles.footerTag}>{displayEmail}</span>
          </div>
        </div>
        <button
          className={styles.footerAction}
          aria-label="Logout"
          onClick={handleLogout}
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
