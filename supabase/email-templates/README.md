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
