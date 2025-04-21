import Link from 'next/link';

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const domainRegex = /http[s]*:\/\/[www.]*domain\.com[/]?/;

export default function Anchor({ href, ...rest }: Props) {
  const sameDomain = domainRegex.test(href);
  let h = href;
  if (sameDomain) {
    h = h.replace(domainRegex, '/');
  }

  if (href.startsWith('/')) {
    return <Link href={h} {...rest} />;
  }

  if (!h.startsWith('http')) {
    return <a href={h} {...rest} />;
  }

  return <a href={h} target="_blank" rel="noopener noreferrer nofollow" {...rest} />;
}
