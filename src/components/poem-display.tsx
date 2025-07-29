'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Copy, Minus, Plus, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface PoemDisplayProps {
  poem: string | null;
  image: string | null;
  isLoading: boolean;
}

export function PoemDisplay({ poem, image, isLoading }: PoemDisplayProps) {
  const [fontSize, setFontSize] = useState(16);
  const { toast } = useToast();

  const handleCopy = () => {
    if (poem) {
      navigator.clipboard.writeText(poem);
      toast({
        title: 'Copied to Clipboard',
        description: 'The poem has been copied successfully.',
      });
    }
  };

  const PoemSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-4/5" />
    </div>
  );
  
  const Placeholder = () => (
    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
        <Wand2 className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-headline">Your poem will appear here</h3>
        <p>Upload an image to begin your poetic journey.</p>
    </div>
  )

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Generated Poem</CardTitle>
        {poem && (
           <div className="flex items-center gap-2">
             <Button variant="outline" size="icon" onClick={() => setFontSize(s => Math.max(10, s - 1))}>
               <Minus className="h-4 w-4" />
             </Button>
             <span className="w-6 text-center text-sm">{fontSize}px</span>
             <Button variant="outline" size="icon" onClick={() => setFontSize(s => Math.min(32, s + 1))}>
               <Plus className="h-4 w-4" />
             </Button>
             <Button variant="outline" size="icon" onClick={handleCopy}>
               <Copy className="h-4 w-4" />
             </Button>
           </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
            <div className="h-full pr-4">
                {isLoading && image && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                        <Image src={image} alt="Generating poem from this image" layout="fill" objectFit="cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-white text-center">
                                <Wand2 className="animate-pulse h-8 w-8 mx-auto mb-2"/>
                                <p>Our AI is writing your poem...</p>
                            </div>
                        </div>
                    </div>
                )}
                {isLoading ? <PoemSkeleton /> :
                !poem ? <Placeholder /> :
                (
                    <div className="space-y-4">
                        {image && (
                             <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                                <Image src={image} alt="Poem inspiration" layout="fill" objectFit="cover" />
                            </div>
                        )}
                        <p 
                            className="whitespace-pre-wrap font-headline leading-relaxed transition-all"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {poem}
                        </p>
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
