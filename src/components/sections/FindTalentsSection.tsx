export default function FindTalentsSection() {
  const skills = [
    "Administration", "Brand Identity Design", "Content Writing", 
    "Creative Writing", "Customer Support", "Digital Marketing", 
    "Graphics Design", "Product Management", "Prompt Engineering", 
    "Social Media Management", "Video Creation", "Website Development"
  ].sort(); // Ensures alphabetical order

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 text-center">
      <h2 className="font-header text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-tight tracking-tight">
        Find Vetted Creative and Tech Talent for...
      </h2>
      
      <div className="flex flex-wrap justify-center items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
        {skills.map((skill) => (
          <div 
            key={skill}
            className="px-3.5 py-2 xs:px-4 xs:py-2 sm:px-5 sm:py-2.5 rounded-full bg-brand-ash/30 border border-brand-ash/50 text-brand-dark text-xs sm:text-sm md:text-base font-medium cursor-default transition-all duration-300 hover:bg-brand-orange hover:text-brand-white hover:border-brand-orange hover:shadow-brand-glow active:scale-95 select-none"
          >
            {skill}
          </div>
        ))}
        {/* The "+ More" Pill */}
        <div className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-brand-dark text-brand-white text-xs sm:text-sm md:text-base font-medium cursor-default active:scale-95 select-none">
          + More
        </div>
      </div>
    </section>
  );
}