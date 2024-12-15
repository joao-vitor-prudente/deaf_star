import { ProfileImage } from "~/app/app/_components/profile-image";
import { api } from "~/trpc/server";
import { profileParamsSchema } from "./layout";

export default async function ProfilePage(props: PageProps): AsyncReactNode {
  const params = await props.params;
  const id = profileParamsSchema.parse(params).id;
  const user = await api.user.getById({ userId: id });

  return (
    <main>
      <header className="flex gap-4">
        <div>
          <h6 className="text-2xl">{user.name ?? "Usuário sem nome"}</h6>
          <p>{user.email}</p>
        </div>
        <ProfileImage size={80} image={user.profileImage} />
      </header>
      <p className="max-w-96 text-sm text-muted-foreground">{user.bio}</p>
    </main>
  );
}
