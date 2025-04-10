import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  prevPageUrl?: string | null;
  nextPageUrl?: string | null;
  onPageChange?: (url: string) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  links,
  prevPageUrl,
  nextPageUrl,
  onPageChange,
}) => {
  const handleClick = (url: string) => {
    if (onPageChange) {
      onPageChange(url);
    }
  };

  return (
    <div className="flex items-center justify-between px-2 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page{' '}
            <span className="font-medium">
              {links.findIndex((link) => link.active) !== -1
                ? links.findIndex((link) => link.active)
                : 1}
            </span>{' '}
            of <span className="font-medium">{links.length - 2}</span> pages
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* Previous Page */}
            {prevPageUrl ? (
              <Link
                href={prevPageUrl}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={() => prevPageUrl && handleClick(prevPageUrl)}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </span>
            )}

            {/* Page Numbers */}
            {links
              .filter((link) => !link.label.includes('Previous') && !link.label.includes('Next'))
              .map((link, index) => {
                const label = link.label.replace('&laquo;', '').replace('&raquo;', '');
                return (
                  <React.Fragment key={index}>
                    {link.url ? (
                      <Link
                        href={link.url}
                        className={cn(
                          link.active
                            ? 'relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20'
                            : 'relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20',
                        )}
                        onClick={() => link.url && handleClick(link.url)}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}

            {/* Next Page */}
            {nextPageUrl ? (
              <Link
                href={nextPageUrl}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={() => nextPageUrl && handleClick(nextPageUrl)}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
