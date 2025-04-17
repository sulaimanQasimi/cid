import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'sidebar' | 'minimal';
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const { currentLanguage, languages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    setOpen(false); // Close the dropdown after selection
  };

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
              onClick={() => handleLanguageChange(language.code)}
            >
              <Globe className="h-4 w-4 mr-2" />
              <span>{language.name}</span>
            </Button>
          ))}
      </div>
    );
  }

  // For minimal and default variants, use controlled dropdown
  const dropdownContent = (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className="bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1"
        align="end"
        sideOffset={5}
        onEscapeKeyDown={() => setOpen(false)}
        onInteractOutside={() => setOpen(false)}
      >
        {languages
          .filter(lang => lang.active)
          .map(language => (
            <DropdownMenuPrimitive.Item
              key={language.code}
              onSelect={() => handleLanguageChange(language.code)}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                language.code === currentLanguage.code && "font-medium bg-accent"
              )}
            >
              {language.name}
            </DropdownMenuPrimitive.Item>
          ))}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );

  if (variant === 'minimal') {
    return (
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Globe className="h-5 w-5" />
            <span className="sr-only">Switch language</span>
          </Button>
        </DropdownMenuPrimitive.Trigger>
        {dropdownContent}
      </DropdownMenuPrimitive.Root>
    );
  }

  // Default variant
  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("flex items-center gap-2", className)}
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.name}</span>
        </Button>
      </DropdownMenuPrimitive.Trigger>
      {dropdownContent}
    </DropdownMenuPrimitive.Root>
  );
}