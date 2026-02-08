import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Space, Command, CheckCircle2, XCircle } from 'lucide-react';

interface KeyboardShortcutsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsOverlay({ open, onClose }: KeyboardShortcutsOverlayProps) {
  const shortcuts = [
    {
      keys: ['Space', 'Enter'],
      description: 'Flip card',
      icon: <Space className="h-4 w-4" />,
    },
    {
      keys: ['←'],
      description: 'Previous card',
      icon: <ArrowLeft className="h-4 w-4" />,
    },
    {
      keys: ['→'],
      description: 'Next card',
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      keys: ['1'],
      description: 'I knew this (when flipped)',
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    },
    {
      keys: ['2'],
      description: "I didn't know this (when flipped)",
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    },
    {
      keys: ['?'],
      description: 'Show this help',
      icon: <Command className="h-4 w-4" />,
    },
  ];

  const mobileGestures = [
    {
      gesture: 'Swipe Up/Down',
      description: 'Flip card',
    },
    {
      gesture: 'Swipe Left',
      description: 'Previous card',
    },
    {
      gesture: 'Swipe Right',
      description: 'Next card',
    },
    {
      gesture: 'Tap Card',
      description: 'Flip card',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts & Gestures</DialogTitle>
          <DialogDescription>Learn the shortcuts to study more efficiently</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">⌨️ Keyboard Shortcuts</h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {shortcut.icon}
                    <span className="text-sm">{shortcut.description}</span>
                  </div>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono text-xs px-2 py-1">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Gestures */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">📱 Touch Gestures</h3>
            <div className="space-y-2">
              {mobileGestures.map((gesture, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{gesture.description}</span>
                  <Badge variant="secondary" className="text-xs">
                    {gesture.gesture}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
            <p className="font-semibold mb-1">💡 Pro Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use arrow keys for faster navigation</li>
              <li>Press numbers 1 or 2 to quickly assess your knowledge</li>
              <li>Press ? anytime to see these shortcuts</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
