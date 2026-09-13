type IconName = 'drop' | 'search' | 'flask' | 'leaf' | 'book' | 'chart' | 'trophy' | 'bell' | 'message' | 'like' | 'bookmark' | 'image' | 'send' | 'close' | 'filter' | 'arrow' | 'users' | 'check'

const paths: Record<IconName, string> = {
  drop: 'M12 3C9 7 5 10 5 14a7 7 0 0 0 14 0c0-4-4-7-7-11Z M8 14a4 4 0 0 0 4 4',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  flask: 'M9 3h6 M10 3v6L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3 M8 14h8',
  leaf: 'M20 3C9 2 3 7 5 14s15 5 15-11Z M4 21 15 10',
  book: 'M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1v15',
  chart: 'M4 3v17h17 M8 15l4-5 4 2 5-7',
  trophy: 'M8 3h8v6a4 4 0 0 1-8 0V3Z M8 5H4v3a4 4 0 0 0 4 4 M16 5h4v3a4 4 0 0 1-4 4 M12 13v7 M8 21h8',
  bell: 'M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10 M10 21h4',
  message: 'M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z',
  like: 'M8 10 12 3c2 0 3 1 2 2l-1 4h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H8V10Z M3 10h5v11H3Z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  image: 'M3 3h18v18H3Z m0 13 5-5 4 4 3-3 6 6 M15 7h.01',
  send: 'm21 3-7 18-4-7-7-4L21 3Z M10 14 21 3',
  close: 'm6 6 12 12 M6 18 18 6',
  filter: 'M4 7h16 M7 12h10 M10 17h4',
  arrow: 'M4 12h16 m-6-6 6 6-6 6',
  users: 'M16 21v-2a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v2 M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 3a4 4 0 0 1 0 8 M22 21v-2a5 5 0 0 0-4-5',
  check: 'm5 12 4 4L19 6',
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
