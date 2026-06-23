import { useEffect, useState } from "react";
import { fetchProfile, uploadAvatar, Profile } from "./api";

export function ProfilePanel({ userId }: { userId: number }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile(userId).then(setProfile);
  }, [userId]);

  const handleUpload = () => {
    uploadAvatar(userId, "base64data").then(() => fetchProfile(userId).then(setProfile));
  };

  return (
    <div>
      {profile && (
        <p>
          {profile.display_name} ({profile.email})
        </p>
      )}
      <button onClick={handleUpload}>Upload avatar</button>
    </div>
  );
}
