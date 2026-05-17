export default function Testimonials() {
  const testimonials = [
    {
      quote: 'Found an amazing hostel near NUST within my budget. Clean rooms, great food, and the booking was super easy. Highly recommend for freshers!',
      author: 'Ahmed Khan',
      subtitle: 'BS CS, NUST Islamabad',
      initials: 'AK',
      rating: 5,
    },
    {
      quote: "As a female student from KPK, safety was my top concern. ApnaRoom's verified girls' hostels near PU gave me and my parents complete peace of mind.",
      author: 'Sara Fatima',
      subtitle: 'MBBS, Punjab University',
      initials: 'SF',
      rating: 5,
    },
    {
      quote: 'Switched from a terrible hostel to an ApnaRoom-verified one near IBA. Better food, Wi-Fi that actually works, and AC in Karachi summers. Life saver!',
      author: 'Zain Ali',
      subtitle: 'BBA, IBA Karachi',
      initials: 'ZA',
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <span className="section-tag">Student Reviews</span>
          <h2 className="section-title">Loved by Students</h2>
          <p className="section-subtitle">Don't take our word for it — hear from students who found their Apna Room.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="p-8 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all reveal">
              <div className="text-4xl text-blue-300 mb-4">"</div>
              <p className="text-gray-700 leading-relaxed mb-6">{testimonial.quote}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.author}</h4>
                  <span className="text-sm text-gray-500">{testimonial.subtitle}</span>
                </div>
              </div>

              <div className="text-lg text-yellow-400">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
