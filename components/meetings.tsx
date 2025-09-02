import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

const meetings = [
  {
    day: "Martes",
    time: "19:00 HS",
    description: "Reunión en YouTube para líderes y servidores. Impulsamos juntos la visión.",
  },	
  {
    day: "JUEVES",
    time: "20:30 HS",
    description: "Día del Señor. Nos congregamos para adorar en uno de los dos horarios disponibles.",
  },
  {
    day: "DOMINGO",
    time: "11 Y 18 HS",
    description: "Día del Señor. Nos congregamos para adorar en uno de los dos horarios disponibles.",
  },
  {
    day: "SABADO",
    time: "19:30 HS",
    description: "Día del Señor. Nos congregamos para adorar en uno de los dos horarios disponibles.",
  }
]

export function Meetings() {
  return (
    <section id="reuniones" className="py-20 bg-[#171747] text-white relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-bold text-center mb-16">NUESTRAS REUNIONES</h2>
        <div className="grid md:grid-cols-4 gap-8  mx-auto">
          {meetings.map((meeting, index) => (
            <Card
              key={index}
              className="bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <CardContent className="p-10 text-center">
                <Clock className="w-16 h-16 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">{meeting.day}</h3>
                <p className="text-4xl font-bold mb-6 text-blue-200">{meeting.time}</p>
                <p className="opacity-90 leading-relaxed text-lg">{meeting.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
