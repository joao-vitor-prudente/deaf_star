type PageProps = Readonly<{
  params: Promise<Record<string, string | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

type LayoutProps = Readonly<{
  children?: React.ReactNode;
}>;

type AsyncReactNode = Promise<Awaited<React.ReactNode>>;
