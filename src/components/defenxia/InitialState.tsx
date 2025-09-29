import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Shield } from 'lucide-react';

export default function InitialState() {
  const placeholder = PlaceHolderImages.find(p => p.id === 'defenxia-logo');

  return (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
      {placeholder ? (
        <Image
          src={placeholder.imageUrl}
          alt={placeholder.description}
          width={150}
          height={150}
          className="rounded-full opacity-50"
          data-ai-hint={placeholder.imageHint}
        />
      ) : (
        <Shield className="h-32 w-32 opacity-50" />
      )}
      <h3 className="font-headline text-2xl font-semibold text-foreground/80">Ready to Secure</h3>
      <p>Enter a URL and start the scan to see the magic happen.</p>
    </div>
  );
}
