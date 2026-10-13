/* The brand sign-up form, the same one as "Display your products" in the footer. */
const JOIN_URL = 'https://forms.gle/8iwsiXAjbwh27qg49'

/** A "Display With Us" button pinned to the bottom-right corner on every screen size. */
export function JoinButton() {
  return (
    <a className="join-fab" href={JOIN_URL} target="_blank" rel="noopener">
      Display With Us
    </a>
  )
}
