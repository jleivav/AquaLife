import type { Member } from '../types/community'

export function Avatar({ member, small = false }: { member: Member; small?: boolean }) {
  return (
    <span className={`avatar avatar--${member.tone}${small ? ' avatar--small' : ''}`} aria-hidden="true">
      {member.initials}
    </span>
  )
}
