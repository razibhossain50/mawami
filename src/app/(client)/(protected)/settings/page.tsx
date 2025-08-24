"use client";
import { useState, useEffect } from "react";
import { Lock, User, Mail, AtSign } from "lucide-react";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useRegularAuth } from "@/context/RegularAuthContext";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user } = useRegularAuth();

  // Prefill form with current user data
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);



  const handleSaveChanges = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('regular_user_access_token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      const updateData: any = {
        fullName: name,
      };

      // Only include email if user has email (don't send empty email for username users)
      if (user.email || email) {
        updateData.email = email;
      }

      console.log('Updating user profile:', updateData);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage with new user data
      const updatedUser = { 
        ...user, 
        fullName: name,
        ...(updateData.email && { email: email })
      };
      localStorage.setItem('regular_user', JSON.stringify(updatedUser));

      setMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-neutral-50 to-neutral-100 p-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>
            <p className="text-sm text-gray-600">
              Manage your profile information and preferences
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Display Name</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  startContent={<User className="w-4 h-4 text-gray-400" />}
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "border-gray-200 hover:border-primary-300 focus-within:border-primary-500",
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "border-gray-200 hover:border-primary-300 focus-within:border-primary-500",
                  }}
                />
              </div>
            </div>
            
            {message && (
              <div className={`p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveChanges} 
                disabled={isLoading}
                color="primary"
                className="px-8"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <p className="text-sm text-gray-600">
              Manage your account security settings
            </p>
          </CardHeader>
          <CardBody>
            <Button
              variant="bordered"
              className="w-full"
              onClick={() => router.push('/settings/reset-password')}
            >
              Reset Password
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}