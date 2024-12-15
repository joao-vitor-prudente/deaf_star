import { User } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type ProfileImageProps = Readonly<{
  image: { data: string; format: string } | null;
  size: number;
  expandedSize?: number;
}>;

export function ProfileImage(props: ProfileImageProps): ReactNode {
  const size = { width: props.size, height: props.size };
  if (!props.image) return <User className="rounded-full border" {...size} />;
  if (!props.expandedSize) return <Inner image={props.image} {...size} />;

  const expanded = { width: props.expandedSize, height: props.expandedSize };

  return (
    <Dialog>
      <DialogTrigger>
        <Inner image={props.image} {...size} />
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogTitle hidden>Profile image</DialogTitle>
        <DialogDescription hidden>Expanded profile image</DialogDescription>
        <Inner image={props.image} {...expanded} />
      </DialogContent>
    </Dialog>
  );
}

type InnerProps = Readonly<{
  width: number;
  height: number;
  image: { data: string; format: string };
}>;

function Inner(props: InnerProps): ReactNode {
  return (
    <Image
      src={`data:${props.image.format};base64,${props.image.data}`}
      alt="profile image"
      className="rounded-full border"
      width={props.width}
      height={props.height}
    />
  );
}
