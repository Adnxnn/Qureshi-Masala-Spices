import Image from 'next/image'

export default function AuthBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-[7%] top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      <div className="absolute left-[8%] top-0 hidden h-full w-px bg-gradient-to-b from-gold/25 via-gold/5 to-transparent lg:block" />
      <div className="absolute right-[8%] top-0 hidden h-full w-px bg-gradient-to-b from-gold/25 via-gold/5 to-transparent lg:block" />

      <div className="absolute -left-16 bottom-[-8%] hidden w-[25rem] -rotate-[12deg] opacity-35 blur-[0.2px] lg:block xl:-left-6 xl:w-[29rem]">
        <Image
          src="/images/Biryani Masala.png"
          alt=""
          width={700}
          height={700}
          className="h-auto w-full object-contain drop-shadow-[0_34px_32px_rgba(0,0,0,0.55)]"
          sizes="29rem"
        />
      </div>
      <div className="absolute -right-16 bottom-[-12%] hidden w-[23rem] rotate-[11deg] opacity-25 blur-[0.4px] lg:block xl:-right-2 xl:w-[27rem]">
        <Image
          src="/images/Green Chicken Masala.png"
          alt=""
          width={700}
          height={700}
          className="h-auto w-full object-contain drop-shadow-[0_34px_32px_rgba(0,0,0,0.55)]"
          sizes="27rem"
        />
      </div>

      <div className="absolute left-1/2 top-[18%] size-[34rem] -translate-x-1/2 rounded-full border border-gold/[0.06] sm:size-[45rem]" />
      <div className="absolute left-1/2 top-[28%] size-[22rem] -translate-x-1/2 rounded-full border border-oxblood/25 sm:size-[31rem]" />
      <div className="absolute left-1/2 top-[13%] -translate-x-1/2 font-display text-[18rem] leading-none text-gold/[0.025] sm:text-[28rem]">
        Q
      </div>
    </div>
  )
}
