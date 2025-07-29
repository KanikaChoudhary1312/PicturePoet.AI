
'use server';

import { generatePoemFromImage, type GeneratePoemFromImageInput } from '@/ai/flows/generate-poem-from-image';
import { z } from 'zod';

const poemGenerationInput = z.object({
  imageDataUri: z.string().optional(),
  imageUrl: z.string().url().optional(),
}).refine(data => data.imageDataUri || data.imageUrl, {
  message: "Either imageDataUri or imageUrl must be provided.",
});


async function urlToDataUri(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to a valid image type.');
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
}

export async function generatePoemAction(input: z.infer<typeof poemGenerationInput>) {
  try {
    const validation = poemGenerationInput.safeParse(input);
    if (!validation.success) {
      return { success: false, error: "Invalid input." };
    }

    let photoDataUri: string | undefined = input.imageDataUri;
    let imageForHistory: string | undefined = photoDataUri;
    
    if (input.imageUrl && !photoDataUri) {
        photoDataUri = await urlToDataUri(input.imageUrl);
        imageForHistory = photoDataUri;
    }
    
    if (!photoDataUri) {
        return { success: false, error: 'No image provided.' };
    }

    const genkitInput: GeneratePoemFromImageInput = { photoDataUri };
    const result = await generatePoemFromImage(genkitInput);

    return { success: true, poem: result.poem, image: imageForHistory };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to generate poem.' };
  }
}
