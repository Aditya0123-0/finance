import { Autoplay, A11y, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';

const defaultSlides = [
  {
    title: 'US Tax Filing & Accounting Services',
    description: 'Professional tax filing, ITIN, FBAR, FATCA, bookkeeping, payroll, and CPA support.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop',
    ctaLabel: 'Get Free Consultation',
    ctaHref: '#/contact',
  },
];

function HeroSlider({ slides = defaultSlides, heightClass = 'min-h-[560px]' }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy" aria-label="Featured services">
      <Swiper
        modules={[Autoplay, A11y, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop={slides.length > 1}
        className={heightClass}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              className={`relative flex ${heightClass} items-center bg-cover bg-center`}
              style={{ backgroundImage: `linear-gradient(rgba(11, 60, 109, 0.78), rgba(11, 60, 109, 0.68)), url(${slide.image})` }}
            >
              <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl text-white"
                >
                  {slide.eyebrow ? <p className="mb-4 font-semibold text-brand-gold">{slide.eyebrow}</p> : null}
                  <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{slide.title}</h1>
                  {slide.description ? <p className="mt-5 text-lg leading-8 text-blue-100">{slide.description}</p> : null}
                  {slide.ctaLabel && slide.ctaHref ? (
                    <a
                      href={slide.ctaHref}
                      className="mt-8 inline-flex rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                    >
                      {slide.ctaLabel}
                    </a>
                  ) : null}
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlider;
