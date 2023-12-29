import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
