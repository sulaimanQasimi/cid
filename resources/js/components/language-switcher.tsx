import React from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'sidebar' | 'minimal';
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const { currentLanguage, languages, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Globe className="h-5 w-5" />
            <span className="sr-only">Switch language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages
            .filter(lang => lang.active)
            .map(language => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setLanguage(language.code)}
                className={cn(
                  "cursor-pointer",
                  language.code === currentLanguage.code && "font-medium bg-accent"
                )}
              >
                {language.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={cn("flex flex-col space-y-1", className)}>
        {languages
          .filter(lang => lang.active)
          .map(language => (
            <Button
              key={language.code}
              variant={language.code === currentLanguage.code ? "secondary" : "ghost"}
              className={cn(
                "justify-start w-full text-left",
                language.direction === 'rtl' ? "text-right" : "text-left"
              )}
              onClick={() => setLanguage(language.code)}
            >
              <Globe className="h-4 w-4 mr-2" />
              <span>{language.name}</span>
            </Button>
          ))}
      </div>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("flex items-center gap-2", className)}
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages
          .filter(lang => lang.active)
          .map(language => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language.code)}
              className={cn(
                "cursor-pointer",
                language.code === currentLanguage.code && "font-medium bg-accent"
              )}
            >
              {language.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}