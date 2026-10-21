import Image from 'next/image'

/**
 * Ultra-modern, precision-crafted flagship device silhouette:
 * - Exact 1080/2400 aspect ratio matching native Android release build screenshots 1:1.
 * - Aerospace-grade titanium chassis with micro-chamfer and precision perimeter bevel.
 * - Centered micro-camera aperture aligned in the top dead-space without clipping status bar icons.
 * - Gentle screen corner radius so headers, action icons, and text are 100% unclipped.
 * - Subtle specular glass reflection overlay.
 */
export function PhoneFrame({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={`group relative aspect-[1080/2400] w-full rounded-[2.5rem] bg-gradient-to-b from-[#2E2D2A] via-[#1C1B19] to-[#121110] p-[8px] sm:p-[10px] border border-white/10 ring-1 ring-black/40 shadow-[0_24px_55px_-12px_rgba(20,19,17,0.35),0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out hover:-translate-y-1.5 ${className}`}
    >
      {/* Centered micro-camera punch-hole in the top status bar center dead-zone */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#080808] border border-white/15 ring-1 ring-black/80 z-20 pointer-events-none flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1e293b]/80" />
      </div>

      {/* Screen container: pristine 1:1 reproduction of the authentic app screenshot */}
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#FAF9F5]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 85vw, 420px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          priority={priority}
        />
        {/* Specular glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
