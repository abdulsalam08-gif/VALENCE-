import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Scale, Trophy, ShoppingBag } from 'lucide-react';
import { useAuth, useCart, usePublicData, useUi } from '../../context/PlatformContext';

const TABS = [
  { label: 'Home', to: '/', icon: Home, exact: true },
  { label: 'Programmes', to: '/programmes', icon: BookOpen },
  { label: 'Exemptions', to: '/programmes/ican/exemptions', icon: Scale },
  { label: 'Compete', to: '/competitions', icon: Trophy },
  { label: 'Store', to: '/store', icon: ShoppingBag, showCart: true },
];

export default function MobileBottomNav() {
  const { cartSummary } = useCart();
  const location = useLocation();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 v-glass border-t border-white/[0.09] safe-bottom"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.exact
            ? location.pathname === tab.to
            : location.pathname.startsWith(tab.to);

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.exact}
              className="relative flex flex-col items-center justify-center gap-1 text-[10.5px] font-medium transition-colors"
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[#16C784] shadow-glow-sm" />
              )}
              <span className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? 'text-[#16C784]' : 'text-[#7A8596]'
                  }`}
                />
                {tab.showCart && cartSummary.totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#16C784] px-1 text-[9px] font-bold text-[#06130D] tabular-nums-display">
                    {cartSummary.totalQuantity}
                  </span>
                )}
              </span>
              <span className={active ? 'text-[#16C784] font-semibold' : 'text-[#7A8596]'}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
