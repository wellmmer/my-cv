/** Small flags for the language list and switch. Spain without its coat of arms. */
export function Flag({ code, size = 20 }: { code: "br" | "us" | "es"; size?: number }) {
  const h = Math.round((size * 2) / 3);
  return (
    <svg viewBox="0 0 30 20" width={size} height={h} aria-hidden="true" focusable="false" style={{ borderRadius: 3 }}>
      {code === "br" ? (
        <>
          <rect width="30" height="20" fill="#009C3B" />
          <path d="M15 2.5 27 10 15 17.5 3 10Z" fill="#FFDF00" />
          <circle cx="15" cy="10" r="4.2" fill="#002776" />
          <path d="M11 9.2c2.6-.6 5.6-.2 7.9 1.2" stroke="#fff" strokeWidth="0.9" fill="none" />
        </>
      ) : code === "us" ? (
        <>
          <rect width="30" height="20" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
          ))}
          <rect width="13" height={(20 / 13) * 7} fill="#3C3B6E" />
        </>
      ) : (
        <>
          <rect width="30" height="20" fill="#AA151B" />
          <rect y="5" width="30" height="10" fill="#F1BF00" />
        </>
      )}
    </svg>
  );
}
