"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PaymentData {
  paymentId: string | null;
  status: string | null;
  externalReference: string | null;
}

export default function FailurePage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const externalReference = searchParams.get("external_reference");

    setPaymentData({
      paymentId,
      status,
      externalReference,
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Mensaje de error */}
          <Card className="text-center p-8 mb-8 border-0 shadow-lg">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  Pago No Procesado
                </h1>
                <p className="text-xl text-gray-600">
                  Hubo un problema al procesar tu pago
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  Posibles causas:
                </h3>
                <ul className="text-sm text-red-700 space-y-1 text-left">
                  <li>• Fondos insuficientes en la tarjeta</li>
                  <li>• Datos de la tarjeta incorrectos</li>
                  <li>• Límite de compra excedido</li>
                  <li>• Problema temporal del banco</li>
                  <li>• Pago cancelado por el usuario</li>
                </ul>
              </div>

              {paymentData?.paymentId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>ID de referencia:</strong> {paymentData.paymentId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button asChild className="flex-1 church-button-primary h-12">
              <Link href="/tienda">
                <RefreshCw className="w-5 h-5 mr-2" />
                Intentar Nuevamente
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
