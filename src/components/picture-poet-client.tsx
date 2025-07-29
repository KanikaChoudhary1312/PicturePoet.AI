'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { generatePoemAction } from '@/app/actions';
import { PhotoUploader } from './photo-uploader';
import { PoemDisplay } from './poem-display';
import { PoemHistory } from './poem-history';

export type PoemHistoryItem = {
  id: string;
  image: string;
  poem: string;
};

export function PicturePoetClient() {
  const { toast } = useToast();
  const [history, setHistory] = useLocalStorage<PoemHistoryItem[]>('poem-history', []);
  const [activePoem, setActivePoem] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePoem = async (data: { imageDataUri?: string; imageUrl?: string }) => {
    setIsLoading(true);
    setActivePoem(null);
    if(data.imageDataUri) {
      setActiveImage(data.imageDataUri);
    }

    const result = await generatePoemAction(data);
    setIsLoading(false);

    if (result.success && result.poem && result.image) {
      setActivePoem(result.poem);
      setActiveImage(result.image);
      const newHistoryItem: PoemHistoryItem = {
        id: new Date().toISOString(),
        image: result.image,
        poem: result.poem,
      };
      setHistory([newHistoryItem, ...history]);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Poem',
        description: result.error || 'An unknown error occurred.',
      });
      setActiveImage(null);
    }
  };

  const handleSelectFromHistory = (item: PoemHistoryItem) => {
    setActiveImage(item.image);
    setActivePoem(item.poem);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    toast({
        title: "History Cleared",
        description: "Your poem history has been successfully cleared.",
    });
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center justify-center gap-4 text-primary-foreground/80">
          <BookOpen className="w-10 h-10 text-accent" />
          Picture Poet
        </h1>
        <p className="text-muted-foreground mt-2">Generate beautiful poems from your favorite photos.</p>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <PhotoUploader onGenerate={handleGeneratePoem} isLoading={isLoading} />
          <PoemHistory history={history} onSelect={handleSelectFromHistory} onClear={handleClearHistory} />
        </div>

        <div className="lg:col-span-2">
          <PoemDisplay poem={activePoem} image={activeImage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
