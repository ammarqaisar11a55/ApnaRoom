export default function CTA({ onNavigate }) {
  const handleListHostel = () => {
    onNavigate('signup')
  }

  return (
    <section id="cta" className="py-20 px-6 bg-gradient-to-r from-primary-700 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-16 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Own a Student Hostel?<br />List It on ApnaRoom
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 500+ hostel owners across Pakistan. Reach thousands of students looking for rooms near their campus — completely free.
          </p>
          <button
            onClick={handleListHostel}
            className="px-8 py-4 bg-white text-primary-700 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 inline-block"
          >
            List Your Hostel Free →
          </button>
        </div>
      </div>
    </section>
  )
}
