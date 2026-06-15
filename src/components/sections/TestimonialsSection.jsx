import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import SectionTitle from '../common/SectionTitle.jsx';
import TestimonialCard from './TestimonialCard.jsx';

function TestimonialsSection({
  eyebrow = 'Testimonials',
  title = 'What Our Clients Say',
  description,
  testimonials = [],
}) {
  return (
    <section className="bg-brand-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10">
          <Swiper
            modules={[A11y, Autoplay, Pagination]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id || testimonial.clientName} className="h-auto pb-10">
                <TestimonialCard {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
