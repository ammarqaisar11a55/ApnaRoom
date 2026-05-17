export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '🔍',
      title: 'Search Near Your Uni',
      description: 'Enter your university name or city. Filter by budget, distance, room type, and amenities.',
    },
    {
      number: '02',
      icon: '📋',
      title: 'Compare & Choose',
      description: 'Read student reviews, view verified photos, compare monthly rates, and pick your perfect room.',
    },
    {
      number: '03',
      icon: '🎉',
      title: 'Book & Move In',
      description: 'Book instantly online. Show up with your bags, check in, and start your semester stress-free!',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <span className="section-tag">Simple Process</span>
          <h2 className="section-title">How ApnaRoom Works</h2>
          <p className="section-subtitle">Get settled into your hostel in just 3 simple steps — easier than registering for a course.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all reveal">
              <span className="text-6xl font-bold text-blue-100 absolute top-4 right-6 font-display">{step.number}</span>
              <div className="text-5xl mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-primary-700 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
