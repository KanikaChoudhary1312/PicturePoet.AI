'use client';

import React, { useState, useRef, type DragEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon, Link, Upload, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PhotoUploaderProps {
  onGenerate: (data: { imageDataUri?: string; imageUrl?: string }) => void;
  isLoading: boolean;
}

export function PhotoUploader({ onGenerate, isLoading }: PhotoUploaderProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        onGenerate({ imageDataUri: dataUri });
      };
      reader.readAsDataURL(file);
      setImageUrl('');
    }
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
        setPreview(imageUrl);
        onGenerate({ imageUrl });
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ImageIcon className="text-primary" />
            Provide an Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link className="mr-2 h-4 w-4" /> URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-4">
             <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors",
                isDragging ? "border-primary bg-secondary" : "border-border"
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                className="hidden" 
                onChange={(e) => handleFileChange(e.target.files)}
                disabled={isLoading}
              />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Drag & drop an image here, or click to select a file</p>
            </div>
          </TabsContent>
          <TabsContent value="url" className="mt-4">
            <div className="flex flex-col gap-2">
                <Input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={isLoading}
                />
                <Button onClick={handleUrlSubmit} disabled={isLoading || !imageUrl}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate with URL
                </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {preview && !isLoading && (
            <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Image Preview:</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image src={preview} alt="Image preview" layout="fill" objectFit="cover" />
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
