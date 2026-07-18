import { Volunteering } from "@/components/volunteering"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Voluntariado | Cristo la Solución",
  description: "¿No servís en ningún área de la iglesia y te interesa ser parte? Dejanos tu contacto y nos comunicamos con vos.",
}

export default function VoluntariadoPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Volunteering />
    </div>
  )
}
