function LoadingSpinner({
  label = 'Loading',
  size = 'md',
  fullScreen = false,
  className = '',
}) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div className={`flex items-center justify-center gap-3 text-brand-navy ${className}`} role="status">
      <span
        className={`${sizes[size] || sizes.md} animate-spin rounded-full border-brand-gold border-t-transparent`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      <span className="text-sm font-medium text-brand-muted" aria-hidden="true">
        {label}
      </span>
    </div>
  );

  if (!fullScreen) {
    return spinner;
  }

  return <div className="flex min-h-screen items-center justify-center bg-brand-surface">{spinner}</div>;
}

export default LoadingSpinner;
