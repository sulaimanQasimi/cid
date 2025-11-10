# CID System - Translation System Documentation

## Overview

The CID system includes a comprehensive internationalization (i18n) system with support for multiple languages, Right-to-Left (RTL) text direction, and dynamic translation loading.

## Architecture

### Translation Storage

#### JSON Files
Translations are stored in JSON files:
- Location: `resources/js/lib/i18n/translations/{code}.json`
- Format: Flat key-value pairs or nested objects
- Supported languages: Persian (fa), English (en), Pashto (ps)

#### Database Storage
Translations are also stored in the database:
- `languages` table: Language definitions
- `translations` table: Translation key-value pairs
- Synchronization between JSON and database

### Translation Loading

#### Dynamic Loading
- Translations loaded from API on application start
- Fallback to JSON files if API unavailable
- Caching for performance
- Hot reloading support

#### Loading Process
1. Application starts
2. Load default language (Persian)
3. Load English as fallback
4. Cache translations in memory
5. Update UI with translations

## Language Management

### Supported Languages

#### Persian (fa)
- Default language
- RTL text direction
- Complete translation coverage
- Primary language for the system

#### English (en)
- Fallback language
- LTR text direction
- Complete translation coverage
- Used when Persian translation missing

#### Pashto (ps)
- Additional language support
- RTL text direction
- Partial translation coverage

### Language Configuration

#### Language Model
```php
// Language attributes
- id: Primary key
- name: Language name
- code: ISO 639-1 language code
- direction: Text direction (ltr/rtl)
- default: Default language flag
```

#### Default Language
- Persian (fa) is the default language
- RTL direction enforced globally
- Language switching disabled (RTL-only app)

## Translation System

### Translation Keys

#### Naming Convention
Translations use namespaced keys: `{namespace}.{key}`

**Examples:**
- `common.save` - Common save button
- `common.cancel` - Common cancel button
- `criminal.page_title` - Criminal page title
- `criminal.name` - Criminal name label
- `incidents.create` - Create incident button

#### Namespace Structure
- `common.*` - Common UI elements
- `criminal.*` - Criminal-related translations
- `incidents.*` - Incident-related translations
- `info.*` - Information-related translations
- `meeting.*` - Meeting-related translations
- `users.*` - User-related translations
- `permissions.*` - Permission-related translations

### Translation Function

#### useTranslation Hook

```typescript
import { useTranslation } from '@/lib/i18n/translate';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('criminal.page_title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

#### Parameter Replacement

```typescript
const { t } = useTranslation();

// Translation key: "criminal.welcome_message": "Welcome, {{name}}!"
t('criminal.welcome_message', { name: 'John' });
// Returns: "Welcome, John!"
```

### Translation Context

#### LanguageProvider Component

```typescript
import { LanguageProvider } from '@/lib/i18n/language-context';

function App() {
  return (
    <LanguageProvider initialLanguage={defaultLanguage}>
      {/* App content */}
    </LanguageProvider>
  );
}
```

#### Language Context API

```typescript
const {
  currentLanguage,    // Current language object
  languages,          // Available languages
  setLanguage,        // Change language (no-op in RTL-only app)
  t,                 // Translation function
  direction,         // Text direction (rtl/ltr)
  isLoading,         // Loading state
  reloadTranslations // Reload translations
} = useLanguage();
```

## Translation Management

### Admin Interface

#### Translation Management Page
- View all translations
- Edit translation values
- Add new translations
- Delete translations
- Search translations

#### Translation Import/Export
- Import from JSON files
- Export to JSON files
- Bulk translation updates
- Translation synchronization

### Translation API

#### Get Translations
```http
GET /api/languages/translations?language={code}
```

**Response:**
```json
{
  "success": true,
  "translations": {
    "common.save": "ذخیره",
    "common.cancel": "لغو",
    "criminal.page_title": "مدیریت مجرمان"
  },
  "language": "fa"
}
```

#### Update Translation
```http
PUT /api/translations/{key}
Content-Type: application/json

{
  "value": "New translation value",
  "language_code": "fa"
}
```

## RTL Support

### Text Direction

#### Global RTL
- RTL direction enforced globally
- Applied to `document.documentElement.dir`
- All UI components respect RTL
- No direction conditionals needed

#### RTL Configuration
```typescript
// Applied automatically
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'fa';
```

### UI Components

#### RTL-Aware Components
- All Radix UI components support RTL
- Tailwind CSS RTL utilities
- Automatic layout adjustments
- Icon and text alignment

## Translation Workflow

### Adding New Translations

#### Step 1: Add Translation Key
Add the translation key to `resources/js/lib/i18n/translations/fa.json`:

```json
{
  "criminal": {
    "new_feature": "ویژگی جدید"
  }
}
```

#### Step 2: Use in Component
```typescript
import { useTranslation } from '@/lib/i18n/translate';

function MyComponent() {
  const { t } = useTranslation();
  return <div>{t('criminal.new_feature')}</div>;
}
```

#### Step 3: Add to Database (Optional)
Use the admin interface to add the translation to the database for management.

### Translation Best Practices

#### Key Naming
- Use descriptive namespaces
- Keep keys concise but clear
- Follow existing patterns
- Group related translations

#### Translation Content
- Keep translations concise
- Use proper grammar
- Maintain consistency
- Test with actual content

## Translation Files

### File Structure

```
resources/js/lib/i18n/translations/
├── fa.json    # Persian translations
├── en.json   # English translations
└── ps.json    # Pashto translations
```

### JSON Format

#### Flat Structure
```json
{
  "common.save": "ذخیره",
  "common.cancel": "لغو",
  "criminal.page_title": "مدیریت مجرمان"
}
```

#### Nested Structure
```json
{
  "common": {
    "save": "ذخیره",
    "cancel": "لغو"
  },
  "criminal": {
    "page_title": "مدیریت مجرمان",
    "name": "نام"
  }
}
```

## Translation Commands

### Artisan Commands

#### Load Translations
```bash
php artisan translations:load
```
Loads translations from JSON files to database.

#### Export Translations
```bash
php artisan translations:export {language}
```
Exports translations from database to JSON file.

## Translation Caching

### Performance Optimization

#### Caching Strategy
- Translations cached in memory
- Cache cleared on translation updates
- Fast lookup for translation keys
- Minimal performance impact

#### Cache Invalidation
- Automatic cache clearing on updates
- Manual cache clearing available
- Hot reloading for development

## Translation Testing

### Testing Translations

#### Language Test Page
- Route: `/language-test`
- View all translations
- Test translation loading
- Verify RTL support
- Check parameter replacement

### Translation Coverage

#### Coverage Tracking
- Track missing translations
- Identify untranslated keys
- Generate coverage reports
- Prioritize translation work

## Translation Maintenance

### Regular Maintenance

#### Translation Updates
- Regular review of translations
- Update outdated translations
- Add missing translations
- Remove unused translations

#### Translation Quality
- Grammar and spelling checks
- Consistency reviews
- Cultural appropriateness
- User feedback integration

## Integration with Components

### Component Usage

#### Page Components
All React pages must:
- Import `useTranslation` from `@/lib/i18n/translate`
- Use `const { t } = useTranslation()` at component top
- Replace all user-facing strings with `t('namespace.key')`
- Use parameter replacement for dynamic content

#### Example Implementation
```typescript
import { useTranslation } from '@/lib/i18n/translate';
import { Head } from '@inertiajs/react';

function CriminalIndex() {
  const { t } = useTranslation();
  
  return (
    <>
      <Head title={t('criminal.page_title')} />
      <div>
        <h1>{t('criminal.page_title')}</h1>
        <button>{t('common.save')}</button>
      </div>
    </>
  );
}
```

## Translation Guidelines

### Development Guidelines

#### Cursor Rules
The system enforces translation consistency through `.cursorrules`:
- All React pages must use `useTranslation`
- All user-facing strings must use `t()` function
- Prefer namespaced keys per feature
- Use parameter replacement for dynamic content
- Do not import translation JSON directly

#### Code Examples
```typescript
// ✅ Good
const { t } = useTranslation();
<Button>{t('common.save')}</Button>

// ❌ Bad
<Button>Save</Button>
```

## Troubleshooting

### Common Issues

#### Missing Translations
- Check JSON files for key
- Verify database has translation
- Check namespace structure
- Review translation loading

#### Translation Not Updating
- Clear browser cache
- Reload translations via API
- Check translation file syntax
- Verify database updates

#### RTL Issues
- Verify direction is set to 'rtl'
- Check component RTL support
- Review CSS RTL utilities
- Test with different content

---

**Document Version**: 1.0  
**Last Updated**: January 2025

