import { Helmet } from "react-helmet-async";
import { ProfileView, Profile } from "src/sections/profile/view/profile-page";
import { useState, useEffect } from "react";
import { useRouter } from "src/routes/hooks";
import Api from "src/helpers/Api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileChanged, setProfileChanged] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    Api.getBusinessProfile()
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch profile");
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setProfile(data.business);
        } else {
          console.error(data.message);
          router.push("/sign-in");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        router.push("/sign-in");
      });
  }, [router, profileChanged]);

  if (!profile) {
    return null; // Render nothing while redirecting
  }

  return (
    <>
      <Helmet>
        <title>Business Profile - {profile.name}</title>
      </Helmet>
      <ProfileView profile={profile} setProfileChanged={setProfileChanged} />
    </>
  );
}
