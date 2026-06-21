"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CalendarDays, Clock } from "lucide-react"

export default function AgendaPage() {
  const agendaData = [
    {
      month: "JUNIO 2026",
      events: [
        { day: "Lunes 2", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Miércoles 4", title: "Reunión online", time: "20:30 hs" },
        { day: "Viernes 6", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Sábado 7", title: "Domingo de Santa Cena", time: "11 y 18 hs" },
        { day: "Lunes 9", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Miércoles 11", title: "Reunión online", time: "20:30 hs" },
        { day: "Jueves 12", title: "Nosotras", time: "19:30 hs" },
        { day: "Viernes 13", title: "Noche de adoración", time: "19:30 hs" },
        { day: "Sábado 14", title: "Reunión 11 y con Pr. Billy Bunster", time: "18 hs" },
        { day: "Domingo 15", title: "Proyecto Alcance", time: "14 hs" },
        { day: "Lunes 16", title: "Grupos de Conexión", time: "19:30 hs" },
        { day: "Miércoles 18", title: "Reunión online", time: "20:30 hs" },
        { day: "Sábado 20", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Domingo 21", title: "Reuniones especial Día del Padre", time: "11 y 18 hs" },
        { day: "Lunes 23", title: "Noche de Palabra y poder – Pr. Israel Barreto", time: "19:30 hs" },
        { day: "Miércoles 25", title: "Reunión online", time: "20:30 hs" },
        { day: "Viernes 27", title: "Invictos Kids, Teens e Invictos", time: "19:30 hs" },
        { day: "Sábado 28", title: "Reuniones presenciales", time: "11 y 18 hs" },
        { day: "Lunes 30", title: "Grupos de Conexión", time: "19:30 hs" },
      ]
    },
    {
      month: "AGOSTO 2026",
      events: [
        { day: "Dom. 16 y Lun. 17", title: "Inmersión", time: "" },
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
              <CalendarDays className="h-10 w-10 text-blue-600" />
              Nuestra Agenda
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mantente al tanto de todas nuestras próximas reuniones, eventos especiales y actividades de la iglesia a lo largo del año.
            </p>
          </div>

          <div className="space-y-12">
            {agendaData.map((monthData, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 border-b border-blue-950/20">
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    {monthData.month}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {monthData.events.map((event, eventIdx) => (
                    <div key={eventIdx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center hover:bg-slate-50 transition-colors">
                      <div className="md:w-1/4 mb-4 md:mb-0 flex-shrink-0">
                        <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-lg text-sm md:text-base border border-blue-200">
                          {event.day}
                        </span>
                      </div>
                      
                      <div className="md:w-3/4 md:pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {event.title}
                        </h3>
                        {event.time && (
                          <div className="flex items-center text-gray-600 font-medium">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            {event.time}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
