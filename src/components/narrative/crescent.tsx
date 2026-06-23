export function Crescent({ size = 36 }: { size?: number }) {
  const id = "crescent-mask-" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden>
      <defs>
        <mask id={id}>
          <rect width="36" height="36" fill="black" />
          <circle cx="18" cy="18" r="13" fill="white" />
          <circle cx="22" cy="16" r="11" fill="black" />
        </mask>
      </defs>
      <rect
        width="36"
        height="36"
        fill="#D8B978"
        mask={`url(#${id})`}
      />
      <g transform="translate(28 9) rotate(45)">
        <rect
          x="-2.4"
          y="-2.4"
          width="4.8"
          height="4.8"
          fill="#D8B978"
        />
      </g>
    </svg>
  );
}
