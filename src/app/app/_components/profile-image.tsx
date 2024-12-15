import { User } from "lucide-react";
import Image from "next/image";

type ProfileImageProps = Readonly<{
  image: { data: string; format: string } | null;
  size: number;
}>;

export function ProfileImage(props: ProfileImageProps): ReactNode {
  const size = { width: props.size, height: props.size };
  if (!props.image) return <User className="rounded-full border" {...size} />;

  return (
    <Image
      src={`data:${props.image.format};base64,${props.image.data}`}
      alt="user image"
      className="rounded-full border"
      {...size}
    />
  );
}
