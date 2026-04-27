"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-12 flex max-w-xl flex-col items-center px-6 py-16 text-center">
      <p className="text-[10px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
        Erro
      </p>
      <h2 className="mt-4 text-3xl font-bold text-foreground">
        Algo deu errado
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Ocorreu um problema com nossa loja. Isso pode ser temporário, por favor
        tente novamente.
      </p>
      <button
        className="mt-8 inline-flex items-center justify-center bg-foreground px-8 py-3 text-[10px] font-medium tracking-[0.2em] text-background uppercase transition-colors hover:bg-foreground/90"
        onClick={() => reset()}
      >
        Tentar Novamente
      </button>
    </div>
  );
}
