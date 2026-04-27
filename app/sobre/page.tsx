import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheca a historia, formacao e processo criativo de Djaya Levy.",
};

const portraitImage =
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80";

export default function SobrePage() {
  const portraitAlt = "Retrato feminino em preto e branco";

  return (
    <main className="bg-background">
      <section className="relative border-b border-border/50 bg-[#ccb2a6]">
        <div className="mx-auto flex min-h-[62svh] w-full max-w-screen-2xl items-center justify-center px-6 py-20 text-center">
          <div>
            <p className="text-[10px] font-medium tracking-[0.34em] text-white/80 uppercase">
              La Maison
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-[0.2em] text-white sm:text-5xl">
              DJAYA LEVY
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed tracking-[0.08em] text-white/85 uppercase">
              Historia, memoria e autoria.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-100/70 px-4 py-14 sm:px-6 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mx-auto mb-10 h-8 w-px bg-border/80" />

          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="relative min-h-[420px] overflow-hidden bg-muted sm:min-h-[560px] lg:min-h-[780px]">
              <Image
                src={portraitImage}
                alt={portraitAlt}
                fill
                className="object-cover object-top grayscale"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>

            <div className="flex items-start">
              <div className="max-w-xl space-y-6 text-[13px] leading-8 text-muted-foreground">
                <p>
                  O universo da joalheria e a maior heranca de Djaya Levy.
                  Influenciada pelo avo e pela mae, estudou na Fine Jewelry School em
                  Nova York e, em 2014, abriu seu atelie. Sua trajetoria combina
                  tradicao de ourivesaria, pesquisa estetica e um olhar autoral sobre
                  forma, proporcao e materia.
                </p>
                <p>
                  Alem do know how em joias, Djaya tambem herdou do avo uma colecao de
                  livros, em especial sobre Art Nouveau, que influencia seu repertorio
                  criativo. O processo acontece de forma organica e intuitiva: a partir
                  de uma pedra, ela visualiza a composicao, o metal e o gesto final da
                  peca.
                </p>
                <p>
                  Em sua visao, a joia vai alem do adorno. Ela carrega memoria, afeto e
                  presenca. O poder simbolico das pedras e a transformacao dos metais
                  formam uma linguagem pessoal que conecta tecnica e sensibilidade.
                </p>
                <p>
                  Por isso, o fazer manual e parte central de sua autoria: da selecao e
                  uniao das pedras a fundicao dos metais, cada etapa materializa uma
                  energia unica e irrepetivel em cada criacao.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 px-4 py-14 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-foreground">10+</p>
              <p className="mt-2 text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Anos de atelie
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">Formacao</p>
              <p className="mt-2 text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Fine Jewelry School NY
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">Manual</p>
              <p className="mt-2 text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
                Processo artesanal
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
