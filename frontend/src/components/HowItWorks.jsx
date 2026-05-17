function StepIcon({ type }) {
  const paths = {
    search: 'M21 21l-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z',
    compare: 'M7 7h10M7 12h10M7 17h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z',
    book: 'M8 7V5a4 4 0 0 1 8 0v2M6.5 7h11l-.8 12H7.3L6.5 7Z',
  }

  return (
    <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: 'search',
      title: 'Search Near Your Uni',
      description: 'Enter your university name or city. Filter by budget, distance, room type, and amenities.',
    },
    {
      number: '02',
      icon: 'compare',
      title: 'Compare & Choose',
      description: 'Read student reviews, view verified photos, compare monthly rates, and pick your perfect room.',
    },
    {
      number: '03',
      icon: 'book',
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
            <div key={step.number} className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg reveal">
              <span className="text-6xl font-bold text-blue-100 absolute top-4 right-6 font-display">{step.number}</span>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <StepIcon type={step.icon} />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
