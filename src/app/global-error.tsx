'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  const onReset = () => {
    reset();
  };

  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <body>
        <h2>Something went wrong!</h2>
        <button type="button" onClick={onReset}>
          Try again
        </button>
      </body>
    </html>
  );
}
