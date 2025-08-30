import React from 'react';
import { Link } from '@inertiajs/react';
import { Pagination as UIPagination } from '@/components/ui/pagination';

interface LinkProps {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: LinkProps[];
}

export function Pagination({ links }: PaginationProps) {
  // Filter out the links that are just "..." and get previous and next links
  const previousLink = links.find(link => link.label === "&laquo; Previous");
  const nextLink = links.find(link => link.label === "Next &raquo;");

  // Filter out previous and next links from the array for our numbered pages
  const pageLinks = links.filter(
    link => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;"
  );

  // Don't show pagination if there are no page links and no navigation links
  if (pageLinks.length === 0 && !previousLink && !nextLink) return null;

  return (
    <UIPagination>
      {previousLink && (
        <UIPagination.Prev
          href={previousLink.url || '#'}
          disabled={!previousLink.url}
        />
      )}

      {pageLinks.map((link) => {
        // Replace HTML entities in the label
        const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();

        return (
          <UIPagination.Item
            key={link.label}
            href={link.url || '#'}
            isActive={link.active}
            disabled={!link.url}
          >
            {label}
          </UIPagination.Item>
        );
      })}

      {nextLink && (
        <UIPagination.Next
          href={nextLink.url || '#'}
          disabled={!nextLink.url}
        />
      )}
    </UIPagination>
  );
}
