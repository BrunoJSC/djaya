import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Onde Estamos",
  description:
    "Visite o ateliê da Djaya Levy na Casa Quartzo, em São Paulo. Agende seu horário.",
};

const atelierImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

export default function OndeEstamosPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative border-b border-border/50 bg-[#ccb2a6]">
        <div className="mx-auto flex min-h-[55svh] w-full max-w-screen-2xl items-center justify-center px-6 py-20 text-center">
          <div>
            <p className="text-[10px] font-medium tracking-[0.34em] text-white/80 uppercase">
              Ateliê
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-[0.2em] text-white sm:text-5xl">
              ONDE ESTAMOS
            </h1>
            <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed tracking-[0.08em] text-white/85 uppercase">
              Um espaço dedicado à criação e ao encontro com as joias.
            </p>
          </div>
        </div>
      </section>

      {/* Location Details */}
      <section className="px-4 py-20 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mx-auto mb-12 h-8 w-px bg-border/80" />

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative min-h-[400px] overflow-hidden bg-muted sm:min-h-[520px] lg:min-h-[600px]">
              <Image
                src={atelierImage}
                alt="Ateliê Djaya Levy na Casa Quartzo"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center lg:py-12">
              <p className="text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Nosso Espaço
              </p>

              <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
                Casa Quartzo
              </h2>

              <div className="mt-8 space-y-5 text-[13px] leading-8 text-muted-foreground">
                <p>
                  O ateliê funciona dentro da Casa Quartzo, um espaço
                  colaborativo que reúne designers, artistas e criadores
                  independentes em São Paulo.
                </p>
                <p>
                  Aqui, cada peça é pensada, desenhada e finalizada à mão.
                  Visitantes podem conhecer o processo criativo de perto,
                  experimentar as coleções e encomendar peças sob medida.
                </p>
              </div>

              <div className="mt-10 border-t border-border/60 pt-10">
                <dl className="space-y-6">
                  <div>
                    <dt className="text-[10px] font-medium tracking-[0.3em] text-foreground uppercase">
                      Endereço
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Casa Quartzo
                      <br />
                      São Paulo, SP
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-medium tracking-[0.3em] text-foreground uppercase">
                      Atendimento
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Com agendamento prévio
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-medium tracking-[0.3em] text-foreground uppercase">
                      Contato
                    </dt>
                    <dd className="mt-2 space-y-1">
                      <a
                        href="mailto:atelier@djayalevy.com"
                        className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        atelier@djayalevy.com
                      </a>
                      <a
                        href="https://instagram.com/djayalevy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        @djayalevy
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10">
                <a
                  href="mailto:atelier@djayalevy.com?subject=Agendamento%20de%20visita"
                  className="inline-flex border border-foreground/70 px-8 py-3 text-[10px] font-medium tracking-[0.34em] text-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
                >
                  Agende seu horário
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border/60 px-4 py-14 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-foreground">São Paulo</p>
              <p className="mt-2 text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Localização
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">Agendamento</p>
              <p className="mt-2 text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Visitas com hora marcada
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">Sob Medida</p>
              <p className="mt-2 text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Peças exclusivas sob encomenda
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
