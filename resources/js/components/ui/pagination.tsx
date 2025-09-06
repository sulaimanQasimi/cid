import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  children: ReactNode;
  className?: string;
}

interface PaginationItemProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}

export function Pagination({ children, className }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        {children}
      </ul>
    </nav>
  );
}

Pagination.Item = function PaginationItem({
  href,
  children,
  isActive,
  disabled
}: PaginationItemProps) {
  const className = cn(
    "h-9 w-9 rounded-md flex items-center justify-center text-sm",
    isActive
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "text-foreground hover:bg-accent hover:text-accent-foreground",
    disabled && "pointer-events-none opacity-50"
  );

  return (
    <li>
      {disabled ? (
        <span className={className}>{children}</span>
      ) : (
        <Link
          href={href}
          className={className}
          aria-current={isActive ? "page" : undefined}
        >
          {children}
        </Link>
      )}
    </li>
  );
};

Pagination.Prev = function PaginationPrev({
  href,
  disabled
}: {
  href: string;
  disabled?: boolean
}) {
  return (
    <li>
      {disabled ? (
        <Button variant="outline" className="h-9 w-9 p-0" disabled>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
      ) : (
        <Button asChild variant="outline" className="h-9 w-9 p-0">
          <Link href={href}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Link>
        </Button>
      )}
    </li>
  );
};

Pagination.Next = function PaginationNext({
  href,
  disabled
}: {
  href: string;
  disabled?: boolean
}) {
  return (
    <li>
      {disabled ? (
        <Button variant="outline" className="h-9 w-9 p-0" disabled>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      ) : (
        <Button asChild variant="outline" className="h-9 w-9 p-0">
          <Link href={href}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Link>
        </Button>
      )}
    </li>
  );
};
