'use client'

import { Tab } from '@headlessui/react';
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  className?: string;
}

export default function Tabs({ items, defaultIndex = 0, className = '' }: TabsProps) {
  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List className={`flex space-x-1 rounded-lg bg-theme-tertiary p-1 ${className}`}>
        {items.map((item) => (
          <Tab
            key={item.id}
            className={({ selected }) =>
              `w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-colors focus:outline-none focus:ring-2 focus:ring-legends-purple-500 focus:ring-offset-2 ${
                selected
                  ? 'bg-theme-primary text-legends-purple-600 dark:text-legends-purple-400 shadow'
                  : 'text-theme-secondary hover:bg-theme-hover hover:text-legends-purple-600 dark:hover:text-legends-purple-400'
              }`
            }
          >
            {item.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {items.map((item) => (
          <Tab.Panel
            key={item.id}
            className="rounded-lg bg-theme-primary p-4 focus:outline-none focus:ring-2 focus:ring-legends-purple-500 focus:ring-offset-2"
          >
            {item.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}

