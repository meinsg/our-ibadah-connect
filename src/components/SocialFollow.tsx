interface SocialFollowProps {
  className?: string;
}

const SocialFollow = ({ className = "" }: SocialFollowProps) => {
  const socialLinks = [
    {
      platform: 'facebook',
      url: 'https://facebook.com/ouribadah',
      icon: 'fab fa-facebook',
      label: 'Ouribadah on Facebook'
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/ouribadah',
      icon: 'fab fa-x-twitter',
      label: 'Ouribadah on X'
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/ouribadah',
      icon: 'fab fa-instagram',
      label: 'Ouribadah on Instagram'
    },
    {
      platform: 'telegram',
      url: 'https://t.me/ouribadah',
      icon: 'fab fa-telegram',
      label: 'Ouribadah on Telegram'
    }
  ];

  return (
    <div className={`oi-social-follow flex justify-center gap-6 ${className}`} role="navigation" aria-label="Follow Ouribadah">
      {socialLinks.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="text-2xl text-primary hover:text-primary-dark transition-colors touch-manipulation"
        >
          <i className={social.icon}></i>
        </a>
      ))}
    </div>
  );
};

export default SocialFollow;