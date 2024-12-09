import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { SubmitButton } from "~/components/ui/submit-button";

export default function SearchLoading(): React.JSX.Element {
  return (
    <main className="flex max-w-md flex-col gap-4 p-4">
      <form className="flex gap-4">
        <Input type="text" name="searchString" />
        <input type="hidden" name="currentRoute" value="/app/search" readOnly />
        <SubmitButton>Procurar</SubmitButton>
      </form>
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index}>
            <Skeleton className="h-14" />
          </li>
        ))}
      </ul>
    </main>
  );
}
