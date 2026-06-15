function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
  className = '',
}) {
  return (
    <header className={`bg-brand-navy text-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {breadcrumbs ? <div className="mb-6 text-sm text-blue-100">{breadcrumbs}</div> : null}
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase text-brand-gold">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {description ? <p className="mt-5 text-lg leading-8 text-blue-100">{description}</p> : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
