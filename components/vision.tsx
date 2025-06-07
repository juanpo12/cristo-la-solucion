import { Heart, Users, Star } from "lucide-react"

export function Vision() {
  return (
    <section id="vision" className="py-20 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold church-text mb-10 animate-fade-in">NUESTRA VISIÓN</h2>
          <p className="text-xl church-text-muted leading-relaxed mb-16 max-w-4xl mx-auto animate-fade-in">
            Ser una iglesia que transforma vidas a través del amor de Cristo, formando discípulos comprometidos que
            impacten su comunidad y el mundo. Creemos en el poder de la fe para cambiar corazones y construir un futuro
            lleno de esperanza y propósito.
          </p>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            <div className="text-center group animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-r from-church-electric-500 to-church-electric-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 church-text">Amor</h3>
              <p className="church-text-muted text-lg">Vivimos y compartimos el amor incondicional de Dios</p>
            </div>
            <div className="text-center group animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-20 h-20 bg-gradient-to-r from-church-navy-600 to-church-navy-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 church-text">Comunidad</h3>
              <p className="church-text-muted text-lg">Construimos relaciones auténticas y duraderas</p>
            </div>
            <div className="text-center group animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="w-20 h-20 bg-gradient-to-r from-church-electric-600 to-church-navy-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 church-text">Propósito</h3>
              <p className="church-text-muted text-lg">Ayudamos a cada persona a descubrir su llamado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
