import React, { useEffect } from 'react';

interface ShareButtonsProps {
  className?: string;
}

const ShareButtons = ({ className = "" }: ShareButtonsProps) => {
  useEffect(() => {
    const initializeShareButtons = () => {
      const currentUrlWithUTM = () => {
        const url = window.location.origin + window.location.pathname + window.location.search;
        const joiner = url.indexOf('?') > -1 ? '&' : '?';
        return url + joiner + 'utm_source=website&utm_medium=social&utm_campaign=share';
      };

      const encodedUrl = encodeURIComponent(currentUrlWithUTM());
      const title = document.title || 'Ouribadah';
      const text = 'Discover Ouribadah – Prayer times, Qibla, Masjid & Halal finder, and community events.';
      const encodedText = encodeURIComponent(text);
      const encodedTitle = encodeURIComponent(title);

      const shareUrls: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
      };

      document.querySelectorAll('.oi-share a[data-net]').forEach((element) => {
        const anchor = element as HTMLAnchorElement;
        const network = anchor.getAttribute('data-net');
        if (network && shareUrls[network]) {
          anchor.setAttribute('href', shareUrls[network]);
        }
      });
    };

    initializeShareButtons();
  }, []);

  return (
    <div className={`oi-share flex gap-3 flex-wrap ${className}`} role="group" aria-label="Share this page">
      <a 
        className="oi-btn inline-flex items-center justify-center w-11 h-11 rounded-full bg-spiritual hover:bg-accent text-primary hover:text-primary-dark transition-colors touch-manipulation" 
        data-net="facebook" 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on Facebook"
      >
        <i className="fab fa-facebook text-xl"></i>
      </a>
      <a 
        className="oi-btn inline-flex items-center justify-center w-11 h-11 rounded-full bg-spiritual hover:bg-accent text-primary hover:text-primary-dark transition-colors touch-manipulation" 
        data-net="twitter" 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on X"
      >
        <i className="fab fa-x-twitter text-xl"></i>
      </a>
      <a 
        className="oi-btn inline-flex items-center justify-center w-11 h-11 rounded-full bg-spiritual hover:bg-accent text-primary hover:text-primary-dark transition-colors touch-manipulation" 
        data-net="linkedin" 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on LinkedIn"
      >
        <i className="fab fa-linkedin text-xl"></i>
      </a>
      <a 
        className="oi-btn inline-flex items-center justify-center w-11 h-11 rounded-full bg-spiritual hover:bg-accent text-primary hover:text-primary-dark transition-colors touch-manipulation" 
        data-net="whatsapp" 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on WhatsApp"
      >
        <i className="fab fa-whatsapp text-xl"></i>
      </a>
      <a 
        className="oi-btn inline-flex items-center justify-center w-11 h-11 rounded-full bg-spiritual hover:bg-accent text-primary hover:text-primary-dark transition-colors touch-manipulation" 
        data-net="telegram" 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Share on Telegram"
      >
        <i className="fab fa-telegram text-xl"></i>
      </a>
    </div>
  );
};

export default ShareButtons;