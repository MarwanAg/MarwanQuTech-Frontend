"use client";

import { useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Button, Field, inputClass, Notice, PageHeader, useNotice } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage, fieldErrors, formatDateTime } from "@/lib/admin/messages";
import type { AdminProfile, AuthResponse } from "@/lib/admin/types";

export default function AccountPage() {
  const { state, applySession, setAdmin, logout } = useAuth();
  if (state.status !== "authenticated") return null;
  const admin = state.admin;

  return (
    <>
      <PageHeader title="الحساب" />
      <p className="-mt-4 mb-8 text-sm text-slate">آخر دخول: {formatDateTime(admin.lastLoginAt)}</p>
      <div className="grid max-w-xl gap-12">
        <ProfileForm admin={admin} onSaved={setAdmin} />
        <PasswordForm onChanged={applySession} />
        <section>
          <h2 className="font-semibold">الجلسات</h2>
          <p className="mt-1 text-sm text-slate">إذا سجّلت الدخول من جهاز آخر ولم تعد تستخدمه، أنهِ كل الجلسات.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => logout()}>تسجيل الخروج</Button>
            <Button variant="danger" onClick={() => confirm("تسجيل الخروج من كل الأجهزة؟") && logout(true)}>
              الخروج من كل الأجهزة
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

function ProfileForm({ admin, onSaved }: { admin: AdminProfile; onSaved: (a: AdminProfile) => void }) {
  const [email, setEmail] = useState(admin.email);
  const [displayName, setDisplayName] = useState(admin.displayName);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const notice = useNotice();

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    try {
      onSaved(await api.put<AdminProfile>("/api/auth/me", { email, displayName }));
      notice.ok("حُفظ الملف الشخصي.");
    } catch (error) {
      setErrors(fieldErrors(error));
      notice.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      <h2 className="font-semibold">الملف الشخصي</h2>
      <Field label="الاسم الظاهر" htmlFor="displayName" error={errors.DisplayName}>
        <input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass(errors.DisplayName)} />
      </Field>
      <Field label="البريد الإلكتروني" hint="تستخدمه لتسجيل الدخول" htmlFor="profileEmail" error={errors.Email}>
        <input id="profileEmail" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass(errors.Email)} />
      </Field>
      <Notice notice={notice.notice} />
      <div><Button type="submit">حفظ</Button></div>
    </form>
  );
}

function PasswordForm({ onChanged }: { onChanged: (s: AuthResponse) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const notice = useNotice();

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    if (next !== confirmValue) {
      setErrors({ Confirm: "كلمتا المرور غير متطابقتين." });
      return;
    }
    try {
      onChanged(await api.put<AuthResponse>("/api/auth/me/password", { currentPassword: current, newPassword: next }));
      setCurrent(""); setNext(""); setConfirmValue("");
      notice.ok("تغيّرت كلمة المرور، وخرجت الأجهزة الأخرى من الحساب.");
    } catch (error) {
      setErrors(fieldErrors(error));
      notice.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      <h2 className="font-semibold">تغيير كلمة المرور</h2>
      <Field label="كلمة المرور الحالية" htmlFor="currentPassword" error={errors.CurrentPassword}>
        <input id="currentPassword" type="password" autoComplete="current-password" dir="ltr" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass(errors.CurrentPassword)} />
      </Field>
      <Field label="كلمة المرور الجديدة" hint="12 حرفاً على الأقل، فيها أحرف وأرقام" htmlFor="newPassword" error={errors.NewPassword}>
        <input id="newPassword" type="password" autoComplete="new-password" dir="ltr" value={next} onChange={(e) => setNext(e.target.value)} className={inputClass(errors.NewPassword)} />
      </Field>
      <Field label="تأكيد كلمة المرور الجديدة" htmlFor="confirmPassword" error={errors.Confirm}>
        <input id="confirmPassword" type="password" autoComplete="new-password" dir="ltr" value={confirmValue} onChange={(e) => setConfirmValue(e.target.value)} className={inputClass(errors.Confirm)} />
      </Field>
      <Notice notice={notice.notice} />
      <div><Button type="submit">تغيير كلمة المرور</Button></div>
    </form>
  );
}
