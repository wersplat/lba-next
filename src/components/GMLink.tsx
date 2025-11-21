import Link from 'next/link';

interface GMLinkProps {
  gmId: string;
  gmName: string;
  className?: string;
}

export default function GMLink({ gmId, gmName, className = '' }: GMLinkProps) {
  return (
    <Link
      href={`/gm/${gmId}`}
      className={`text-legends-purple-600 dark:text-legends-purple-400 hover:text-legends-purple-800 dark:hover:text-legends-purple-300 underline transition-colors ${className}`}
    >
      {gmName}
    </Link>
  );
}

