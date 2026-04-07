import { useState, useRef } from "react"

export default function ClipPathButton({ customFunction }) {
  const [isHeld, setIsHeld] = useState(false)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const holdStartTimeRef = useRef<number | null>(null)

  const handleMouseDown = () => {
    holdStartTimeRef.current = Date.now()
    holdTimerRef.current = setTimeout(() => {
      setIsHeld(true)
      if (customFunction) {
        customFunction()
      }
    }, 2000)
  }

  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setIsHeld(false)
    holdStartTimeRef.current = null
  }

  const handleMouseLeave = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setIsHeld(false)
    holdStartTimeRef.current = null
  }

  return (
    <button
      className="group relative flex h-10 items-center gap-2 rounded-full bg-[#f6f5f5] px-6 font-medium text-[#21201c] select-none transition-transform duration-160 ease-out active:scale-[0.97]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-[#ffdbdc] text-[#e5484d] [transition:clip-path_200ms_ease-out] [clip-path:inset(0px_100%_0px_0px)] group-active:[transition:clip-path_2s_linear] group-active:[clip-path:inset(0px_0px_0px_0px)]"
      >
        <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.9201H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.07988H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
            fill="currentColor"
          />
        </svg>
        Hold to Delete
      </div>
      <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.9201H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.07988H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
          fill="currentColor"
        />
      </svg>
      Hold to Delete
    </button>
  )
}
