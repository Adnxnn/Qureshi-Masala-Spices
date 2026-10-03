# Password recovery email setup

The website uses Supabase's built-in `resetPasswordForEmail`, `verifyOtp` with
`type: 'recovery'`, and `updateUser`. Supabase issues and validates the code.

For **email code entry**, paste the contents of `recovery.html` into the hosted
Supabase project at **Authentication → Email Templates → Reset Password** and
save it. This adds `{{ .Token }}` to the email while retaining a working reset
link. Supabase's default reset email contains a link only; the on-site code
entry cannot work until this template is installed. The reset link works with
the default template.

The reset email redirects to the existing `/auth/confirmed` URL used for email
confirmation, which forwards a verified recovery session to `/forgot-password`.
Ensure `https://www.qureshismasalaspices.com/auth/confirmed` is allowed in
Supabase **Authentication → URL Configuration → Redirect URLs**. If customers
also use another domain, allow its exact `/auth/confirmed` URL as well.
# Passwordless sign-in and phone accounts

To send numeric email sign-in codes, replace the **Magic Link** template in
Supabase Dashboard → Authentication → Email Templates with `magic-link.html`.
The default template sends a link only; this one includes `{{ .Token }}` as well.
Keep the site's `/auth/confirmed` URL in the allowed redirect URLs.

To enable phone registration and sign-in, run `006_phone_only_accounts.sql` in
the Supabase SQL Editor, then enable the **Phone** auth provider and configure
an SMS provider in Authentication → Providers. Existing email accounts must
verify their number in **Account → Phone code sign-in** before using SMS login.
The contact number typed during password registration is not a verified
authentication factor.

## Admin sign-in

The small footer link opens `/admin/login`. Admins request a fresh code using
the email of an existing `public.users.is_admin = true` account. The code is
verified by Supabase Auth and the admin flag is checked again before access.
The Magic Link template above must be installed to show a numeric code in the
email; with the default template, the secure link can be used instead.
"Reset / send new code" requests a new one-time code after the provider's
rate limit. There is deliberately no fixed or reusable admin PIN in the
repository or in the browser.
