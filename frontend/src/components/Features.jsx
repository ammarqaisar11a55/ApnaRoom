export default function Features() {
  const features = [
    {
      icon: '🛡️',
      title: 'Verified & Safe',
      description: 'Every hostel is personally inspected. We check security, cleanliness, and student-friendliness.',
    },
    {
      icon: '💰',
      title: 'Student Budgets',
      description: 'Hostels starting from PKR 5,000/month. No hidden charges. Transparent monthly pricing.',
    },
    {
      icon: '📍',
      title: 'Near Your Campus',
      description: 'Filter by distance to your university. Walking distance hostels for every major campus.',
    },
    {
      icon: '📱',
      title: '24/7 Support',
      description: 'Need help? Our support team is always a message away — in Urdu or English.',
    },
    {
      icon: '🍽️',
      title: 'Meals & Amenities',
      description: 'Filter by Wi-Fi, AC, laundry, meals included, study rooms, and more student essentials.',
    },
    {
      icon: '🤝',
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
              className="p-8 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all reveal"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-primary-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
