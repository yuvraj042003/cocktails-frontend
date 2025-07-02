import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-8">
        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  First Name
                </label>
                <Input type="text" placeholder="John" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Last Name
                </label>
                <Input type="text" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input type="tel" placeholder="+91 1234567890" />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </section>

        {/* Password Change */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Current Password
              </label>
              <Input type="password" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                New Password
              </label>
              <Input type="password" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Confirm New Password
              </label>
              <Input type="password" />
            </div>
            <Button variant="outline">Change Password</Button>
          </form>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <Button variant="outline" size="sm">
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          <div className="border border-red-200 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile; 