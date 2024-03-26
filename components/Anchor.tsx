import Link from 'next/link';

interface AnchorProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}

const domainRegex = /http[s]*:\/\/[www.]*domain\.com[/]?/;

const Anchor: React.FC<AnchorProps> = ({ href, children, ...rest }) => {
  const sameDomain = domainRegex.test(href);
  let h = href;
  if (sameDomain) {
    h = h.replace(domainRegex, '/');
  }

  if (href.startsWith('/')) {
    return (
      <Link href={h} {...rest}>
        {children}
      </Link>
    );
  }

  if (!h.startsWith('http')) {
    return (
      <a href={h} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a href={h} target="_blank" rel="noopener noreferrer nofollow" {...rest}>
      {children}
    </a>
  );
};

export default Anchor;
