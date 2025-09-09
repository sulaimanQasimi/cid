import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface FooterButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  processing?: boolean;
  cancelText: string;
  submitText: string;
  savingText: string;
  disabled?: boolean;
}

export default function FooterButtons({
  onCancel,
  onSubmit,
  processing = false,
  cancelText,
  submitText,
  savingText,
  disabled = false
}: FooterButtonsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-9 px-4 text-sm border-gray-300 bg-gray-600 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {cancelText}
      </Button>
      <Button 
        type="submit" 
        disabled={processing || disabled}
        onClick={onSubmit}
        className="h-9 px-4 mr-2 text-sm bg-purple-600 hover:bg-purple-700 text-white"
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {savingText}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {submitText}
          </div>
        )}
      </Button>
    </div>
  );
}
