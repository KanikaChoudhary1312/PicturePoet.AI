'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PoemHistoryItem } from './picture-poet-client';
import { Button } from './ui/button';
import { Clock, Trash2 } from 'lucide-react';

interface PoemHistoryProps {
  history: PoemHistoryItem[];
  onSelect: (item: PoemHistoryItem) => void;
  onClear: () => void;
}

interface HistoryItemProps {
    item: PoemHistoryItem;
    onSelect: (item: PoemHistoryItem) => void;
}

const HistoryItem = React.memo(function HistoryItem({ item, onSelect }: HistoryItemProps) {
    const handleSelect = () => onSelect(item);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSelect(item);
        }
    }
    
    return (
        <div
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary cursor-pointer"
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
              <Image src={item.image} alt="Poem history item" layout="fill" objectFit="cover" />
            </div>
            <p className="text-sm text-muted-foreground truncate font-headline">
              {item.poem.split('\n')[0]}
            </p>
        </div>
    );
});


export function PoemHistory({ history, onSelect, onClear }: PoemHistoryProps) {
  return (
    <Card className="shadow-lg flex-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
            <Clock className="text-primary" />
            History
        </CardTitle>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 -mx-6">
            <div className="px-6">
                {history.length === 0 ? (
                     <div className="text-center text-muted-foreground py-8">
                        <p>Your generated poems will appear here.</p>
                     </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <HistoryItem key={item.id} item={item} onSelect={onSelect} />
                        ))}
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
