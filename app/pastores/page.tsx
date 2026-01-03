import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function PastoresPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header mejorado con imagen que no se estira */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center py-24 md:py-32">
            {/* Texto del header */}
            <div className="text-white z-10 order-2 md:order-1">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                NUESTROS PASTORES
              </h1>
              <p className="text-2xl md:text-3xl font-light mb-4 text-blue-200">
                Alfredo y Celina Dimiro
              </p>
              <div className="h-1 w-24 bg-blue-400 mb-6"></div>
            </div>

            {/* Imagen con mejor manejo */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md">
                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
                  <Image
                    src="/pastor1.jpg"
                    alt="Pastores Alfredo y Celina"
                    fill
                    className="object-cover object-[80%_center]"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Decoración */}
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-blue-500/20 rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Historia y Ministerio */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Su historia y ministerio
              </h2>
              <div className="h-1 w-24 bg-blue-600 mx-auto"></div>
            </div>

            <div className="space-y-6">
              <p className="text-xl text-slate-700 leading-relaxed text-justify">
                Pastorean la iglesia{" "}
                <strong className="text-slate-900">
                  Cristo La Solución, San Justo,
                </strong>{" "}
                hace más de treinta años. Alfredo es un maestro de las
                Escrituras, le apasiona desmenuzar los versos bíblicos y
                estudiarlos detalladamente para enseñárselo a las personas.
                Algunos de sus estudios pueden encontrarse en los libros que
                escribió: <em>&quot;El poder de la pasión&quot;</em>;{" "}
                <em>&quot;Desechando maldiciones&quot;</em>;{" "}
                <em>&quot;Administración financiera&quot;</em>; entre otros.
              </p>

              <p className="text-xl text-slate-700 leading-relaxed text-justify">
                Por otro lado, Celina lo acompaña siendo usada por Dios en
                oración y consejería. Ambos, dedican sus vidas al ministerio y a
                la iglesia local, ya que el deseo de sus corazones es vivir por
                y para Él. Están agradecidos por el llamado que recibieron sus
                vidas y por haber visto la bondad de Dios para con ellos, su
                familia e iglesia.
              </p>
            </div>

           

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-slate-700 rounded-2xl p-12 text-white mt-16 shadow-xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                ¿Quieres conocer más?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-center">
                Te invitamos a ser parte de nuestra comunidad
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contacto">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Visítanos
                  </Button>
                </Link>
                <Link href="/tienda">
                  <Button
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold transition-all duration-300"
                  >
                    Ver libros del pastor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}