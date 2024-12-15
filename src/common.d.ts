type PageProps = Readonly<{
  params: Promise<Record<string, string | undefined>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

type ChildrenProps = Readonly<{ children?: React.ReactNode }>;

type LayoutProps = Readonly<{
  children?: React.ReactNode;
  params: Promise<Record<string, string | string[] | undefined>>;
}>;

type AsyncReactNode = Promise<Awaited<React.ReactNode>>;

type ReactNode = React.JSX.Element;

type ComponentProps<T extends React.ElementType> = Readonly<
  React.ComponentPropsWithoutRef<T>
>;
