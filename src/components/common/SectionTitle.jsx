function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
  titleClassName = '',
}) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={`mx-auto flex max-w-3xl flex-col gap-3 ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase text-brand-gold">{eyebrow}</p>
      ) : null}
      {title ? (
        <h2 className={`text-3xl font-bold text-brand-navy sm:text-4xl ${titleClassName}`}>
          {title}
        </h2>
      ) : null}
      {description ? <p className="text-base leading-7 text-brand-muted">{description}</p> : null}
    </div>
  );
}

export default SectionTitle;
