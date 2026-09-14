import { useId } from 'react'

// Ilustración local: no usa imágenes externas ni representa una simulación real.
export function AquariumScene() {
  const id = useId()

  return (
    <svg className="aquarium-scene" viewBox="0 0 720 250" preserveAspectRatio="none" role="img"
      aria-label="Acuario ilustrado de agua dulce, con peces, plantas y rocas. Vista de ejemplo.">
      <defs>
        <linearGradient id={id} x2="0" y2="1">
          <stop stopColor="#e6f4ee" />
          <stop offset="1" stopColor="#beded1" />
        </linearGradient>
      </defs>
      <rect width="720" height="250" rx="8" fill={`url(#${id})`} />
      <path d="M0 30Q90 20 180 30T360 30T540 30T720 30" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" />
      <path d="M0 222Q130 210 270 226T540 220T720 221V250H0Z" fill="#d5d5b9" />
      <path d="M0 240Q200 226 380 238T720 237V250H0Z" fill="#bdbfa5" />
      <g fill="none" strokeLinecap="round">
        <path d="M102 221Q85 151 104 111M114 220Q145 167 126 125M91 222Q57 179 66 157" stroke="#5f9879" strokeWidth="8" />
        <path d="M594 225Q570 164 590 107M610 225Q638 153 619 81M629 225Q648 183 643 144" stroke="#60947d" strokeWidth="7" />
        <path d="M555 225Q544 199 549 168M661 227Q680 188 670 154" stroke="#88ae86" strokeWidth="6" />
      </g>
      <g fill="#80aa83">
        <path d="M103 159Q72 145 87 119Q111 126 103 159ZM107 181Q136 159 142 139Q111 141 107 181Z" />
        <path d="M592 167Q552 143 564 126Q595 136 592 167ZM614 157Q645 128 649 110Q619 118 614 157Z" />
      </g>
      <path d="M122 232Q137 179 168 190Q185 169 208 203L222 233Z" fill="#8da99a" />
      <path d="M68 233Q72 207 95 203Q121 203 135 233Z" fill="#a2b7a4" />
      <path d="M512 232Q521 204 542 207Q563 207 571 232Z" fill="#9eb1a0" />
      <g fill="#e5b970" stroke="#a88756" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M306 109Q331 81 360 108Q331 132 306 109L291 96V121Z" />
        <path d="M452 158Q430 137 408 158Q430 177 452 158L466 147V169Z" fill="#80aeab" stroke="#598c88" />
        <path d="M237 169Q252 153 270 169Q252 184 237 169L226 160V179Z" />
      </g>
      <circle cx="349" cy="105" r="2.4" fill="#35554b" />
      <circle cx="419" cy="155" r="2.2" fill="#35554b" />
      <circle cx="262" cy="167" r="1.8" fill="#35554b" />
      <g fill="none" stroke="#fff" strokeWidth="1.6" opacity=".8">
        <circle cx="391" cy="77" r="4" /><circle cx="401" cy="51" r="3" />
        <circle cx="476" cy="115" r="3" /><circle cx="486" cy="87" r="5" />
      </g>
      <g fill="#a3aa8c">
        <ellipse cx="268" cy="238" rx="7" ry="3" /><ellipse cx="483" cy="230" rx="8" ry="3" />
        <ellipse cx="349" cy="232" rx="4" ry="2" /><ellipse cx="689" cy="239" rx="8" ry="3" />
      </g>
    </svg>
  )
}
