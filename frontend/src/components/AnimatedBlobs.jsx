export default function AnimatedBlobs() {
  return (
    <>
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-7 -z-10 animate-blob-slow"></div>
      <div className="fixed bottom-10 right-0 w-80 h-80 bg-blue-300 rounded-full filter blur-3xl opacity-7 -z-10 animate-blob"></div>
      <div className="fixed top-1/2 left-1/3 w-72 h-72 bg-primary-700 rounded-full filter blur-3xl opacity-7 -z-10 animate-blob"></div>
    </>
  )
}
