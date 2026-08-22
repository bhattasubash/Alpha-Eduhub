"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Lock, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfileNavigation from "@/components/student/ProfileNavigation";

interface StudentProfile {
  id: string;
  username: string;
  name: string;
  surname: string;
  email?: string | null;
  phone?: string | null;
  address?: string;
  img?: string | null;
  admissionNumber?: string | null;
  rollNumber?: string | null;
  birthday: string;
  bloodType: string;
  sex: string;
  class?: { name: string } | null;
  grade?: { level: number } | null;
  section?: string | null;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/student/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setMessage({ type: "success", text: "Password changed successfully!" });
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while changing password" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <ProfileNavigation />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <ProfileNavigation />
        <div className="p-6">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="p-8 text-center">
              Failed to load profile
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ProfileNavigation />
      
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Profile Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">View your profile information and change your password</p>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <Card className="border-slate-200 dark:border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                {profile.img ? (
                  <img
                    src={profile.img}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  `${profile.name[0]}${profile.surname[0]}`
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {profile.name} {profile.surname}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {profile.username}
                </p>
                {profile.class && profile.grade && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Grade {profile.grade.level} · {profile.class.name}
                    {profile.section && ` · ${profile.section}`}
                  </p>
                )}
              </div>
            </div>

            {/* Read-only fields */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <Label className="text-slate-600 dark:text-slate-400">Admission Number</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {profile.admissionNumber || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-slate-600 dark:text-slate-400">Roll Number</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {profile.rollNumber || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-slate-600 dark:text-slate-400">Birthday</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {new Date(profile.birthday).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-slate-600 dark:text-slate-400">Blood Type</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {profile.bloodType}
                </p>
              </div>
              <div>
                <Label className="text-slate-600 dark:text-slate-400">Email</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {profile.email || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-slate-600 dark:text-slate-400">Phone</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {profile.phone || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-slate-600 dark:text-slate-400">Address</Label>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {profile.address || "N/A"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                Note: Personal information can only be updated by school administration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordForm ? (
              <Button
                onClick={() => setShowPasswordForm(true)}
                variant="outline"
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
