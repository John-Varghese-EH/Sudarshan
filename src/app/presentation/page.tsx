
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PresentationPage = () => {
  const presentationUrl = "https://onedrive.live.com/embed?resid=18233C07AEB2E5BB%21124&authkey=%21ATFFayyv5AuvZTA&em=2&wdAr=1.7777777777777777";
  const externalLink = "https://1drv.ms/p/c/18233c07aeb2e5bb/ESFYIOYIOq0W9GlfjHWkSVy6kBTFFayyv5AuvZTA5inWuo1g?e=1wavBm";

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold">Kavach Presentation</h1>
            <Link href={externalLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Externally
              </Button>
            </Link>
          </div>
      </div>
      <div className="flex-1 w-full">
        <iframe
          src={presentationUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen={true}
          title="Kavach Presentation"
        ></iframe>
      </div>
    </div>
  );
};

export default PresentationPage;
