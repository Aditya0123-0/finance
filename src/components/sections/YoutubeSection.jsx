import { FaPlay } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle.jsx';

function YoutubeSection({
  eyebrow = 'Client Stories',
  title = 'Client Video Testimonials',
  description,
  videos = [],
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article key={video.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[9/16] overflow-hidden bg-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label={`Watch ${video.title}`}
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.thumbnailAlt || `${video.title} thumbnail`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute inset-0 bg-brand-navy/35" aria-hidden="true" />
                <span className="absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold text-brand-ink shadow-soft">
                  <FaPlay className="ml-1 h-5 w-5" aria-hidden="true" />
                </span>
              </a>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-brand-navy">{video.title}</h3>
                {video.description ? <p className="mt-2 text-sm leading-6 text-brand-muted">{video.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default YoutubeSection;
