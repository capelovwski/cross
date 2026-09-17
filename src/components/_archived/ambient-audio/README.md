# Trilha ambiente (arquivada)

Arquivada em 17/09/2026. O código funciona, só não está ligado no site.
Commit original: `891a17f` (tag `arquivo/musica-ambiente`).

## Como reativar

1. Mover `AmbientAudio.tsx` de volta para `src/components/fx/`.
2. Em `src/app/layout.tsx`, importar `AmbientAudioProvider` e envolver o conteúdo:
   `<AmbientAudioProvider>{children}</AmbientAudioProvider>`.
3. Em `src/components/layout/Header.tsx`, importar `AudioToggle` e colocar
   `<AudioToggle dark={dark} />` antes do botão amarelo do header.
4. Colar a animação abaixo em `src/app/globals.css`.
5. Colocar o arquivo em `public/audio/ambient.mp3` (ou `.m4a` / `.wav`).
   Usar a gravação original do cover, não um áudio baixado do YouTube.

```css
@keyframes eq {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}
.animate-eq { height: 4px; animation: eq 0.9s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .animate-eq { animation: none; height: 10px; }
}
```

## Comportamento

- Começa mudo; o botão liga com fade até 12% de volume.
- A escolha fica salva e retoma no primeiro toque em visitas seguintes.
- Continua tocando entre a home e a Cross Store.
- Sem arquivo de áudio, o botão não aparece.
