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
      className={`group relative aspect-[1080/2400] w-full rounded-[2.5rem] bg-[#1A1F1C] p-2 sm:p-2.5 transition-transform duration-500 ease-out hover:-translate-y-1 ${className}`}
    >
      {/* Centered micro-camera punch-hole in the top status bar center dead-zone */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0B0E0C] z-20 pointer-events-none flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1A2520]" />
      </div>

      {/* Screen container: pristine 1:1 reproduction of the authentic app screenshot */}
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#FAF9F5]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 85vw, 420px"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          priority={priority}
        />
        {/* Specular soft ambient reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
