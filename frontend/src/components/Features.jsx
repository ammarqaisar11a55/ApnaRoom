function FeatureIcon({ type }) {
  const paths = {
    shield: 'M12 3 5 6v5c0 4.5 2.9 8.5 7 10 4.1-1.5 7-5.5 7-10V6l-7-3Z M9.5 12l1.7 1.7 3.5-3.7',
    wallet: 'M4 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm0 0V5a2 2 0 0 1 2-2h10v4M16 13h.01',
    location: 'M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z M12 10.5h.01',
    support: 'M4 12a8 8 0 0 1 16 0v3a2 2 0 0 1-2 2h-2v-6h4M4 15a2 2 0 0 0 2 2h2v-6H4v4Zm8 4h3',
    amenities: 'M4 4h16M6 4v7a6 6 0 0 0 12 0V4M8 21h8M12 17v4',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  }

  return (
    <svg className="h-7 w-7 text-blue-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Features() {
  const features = [
    {
      icon: 'shield',
      title: 'Verified & Safe',
      description: 'Every hostel is personally inspected. We check security, cleanliness, and student-friendliness.',
    },
    {
      icon: 'wallet',
      title: 'Student Budgets',
      description: 'Hostels starting from PKR 5,000/month. No hidden charges. Transparent monthly pricing.',
    },
    {
      icon: 'location',
      title: 'Near Your Campus',
      description: 'Filter by distance to your university. Walking distance hostels for every major campus.',
    },
    {
      icon: 'support',
      title: '24/7 Support',
      description: 'Need help? Our support team is always a message away — in Urdu or English.',
    },
    {
      icon: 'amenities',
      title: 'Meals & Amenities',
      description: 'Filter by Wi-Fi, AC, laundry, meals included, study rooms, and more student essentials.',
    },
    {
      icon: 'users',
      title: 'Roommate Matching',
      description: 'Find compatible roommates from your university. Share rooms and split costs easily.',
    },
  ]

  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <span className="section-tag">Why Choose Us</span>
          <h2 className="section-title">Built for Pakistani Students</h2>
          <p className="section-subtitle">We know the student hostel struggle. That's why we built ApnaRoom — by students, for students.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg reveal"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <FeatureIcon type={feature.icon} />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
