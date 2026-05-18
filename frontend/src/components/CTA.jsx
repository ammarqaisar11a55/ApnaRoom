import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section id="cta" className="py-20 px-6 bg-gradient-to-r from-primary-700 to-primary-600">
      <div className="max-w-4xl mx-auto text-center">
        <div className="px-4 py-12 sm:p-16 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Own a Student Hostel?<br />List It on ApnaRoom
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join 500+ hostel owners across Pakistan. Reach thousands of students looking for rooms near their campus — completely free.
          </p>
          <Link
            to="/signup"
            className="inline-block rounded-xl bg-white px-8 py-4 font-bold text-primary-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            List Your Hostel Free
          </Link>
        </div>
      </div>
    </section>
  )
}
