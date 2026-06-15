function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4 py-10">
      {children}
    </div>
  );
}

export default AuthLayout;
