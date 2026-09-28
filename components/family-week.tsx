import Image from "next/image"
import { Download, CalendarHeart } from "lucide-react"

const PDF_URL = "/semana-familia/devocional-semana-de-la-familia.pdf"

export function FamilyWeek() {
  return (
    <section id="semana-familia" className="relative isolate overflow-hidden scroll-mt-20">
      <Image
        src="/semana-familia/fondo.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover -z-10"
        aria-hidden
      />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-end">
          <div className="py-16 md:py-24 self-center text-center md:text-left">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[#8a6a52] mb-4">
              <CalendarHeart className="h-4 w-4" />
              Semana de la Familia
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3f3029] mb-6 leading-tight">
              Yo y mi casa
            </h2>
            <p className="text-lg md:text-xl text-[#5c4a3f] leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
              Descargá el devocional de la Semana de la Familia y acompañanos cada día con una lectura y reflexión
              para compartir en casa.
            </p>
            <a
              href={PDF_URL}
              download
              className="inline-flex items-center gap-2 rounded-full bg-[#3f3029] px-7 py-3.5 text-white font-semibold shadow-lg hover:bg-[#5c4a3f] hover:scale-105 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              Descargar devocional (PDF)
            </a>
            <p className="mt-3 text-sm text-[#8a6a52]">
              <a href={`${PDF_URL}?ver`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[#3f3029]">
                o leelo online
              </a>
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/semana-familia/mockup.png"
              alt="Vista previa del devocional Yo y mi casa en un celular"
              width={570}
              height={830}
              sizes="(min-width: 768px) 420px, 80vw"
              className="w-4/5 max-w-[420px] h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
