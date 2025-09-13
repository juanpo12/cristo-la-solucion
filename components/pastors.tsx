
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Pastors = () => {
    return(
        <section id="pastores" className="py-20 bg-white text-black relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-16">ALFREDO DANIEL DIMIRO Y CELINA DEL VALLE LÓPEZ</h2>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/sedesv2.jpg"
                            alt="Pastores Alfredo y Celina"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800">Su historia y ministerio</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Pastorean la iglesia Cristo La Solución, San Justo, hace más de treinta años. Alfredo es un maestro de las Escrituras, le apasiona desmenuzar los versos bíblicos y estudiarlos detalladamente para enseñárselo a las personas. Algunos de sus estudios pueden encontrarse en los libros que escribió: &ldquo;El poder de la pasión&rdquo;; &ldquo;Desechando maldiciones&rdquo;; &ldquo;Administración financiera&rdquo;; entre otros.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Por otro lado, Celina lo acompaña siendo usada por Dios en oración y consejería. Ambos, dedican sus vidas al ministerio y a la iglesia local, ya que el deseo de sus corazones es vivir por y para Él. Están agradecidos por el llamado que recibieron sus vidas y por haber visto la bondad de Dios para con ellos, su familia e iglesia.
                        </p>
                        <Link href="/tienda">
                            <Button className="bg-church-electric-600 hover:bg-church-electric-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2">
                                <BookOpen className="w-5 h-5" />
                                <span>Ver libros del pastor</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}