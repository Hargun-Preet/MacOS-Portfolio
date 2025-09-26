"use client"

export default function Countdown({ value }: { value: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-live="polite" aria-atomic="true">
      <span
        key={value}
        className="select-none text-[12vw] font-bold leading-none text-white/95 drop-shadow"
        style={{
          animation: "count-pop 900ms ease-in-out both",
        }}
      >
        {value}
      </span>
      <style jsx>{`
        @keyframes count-pop {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
          70% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.7);
          }
        }
      `}</style>
    </div>
  )
}
