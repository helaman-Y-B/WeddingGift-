export default function Footer() {
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      <footer>
        <p>&copy; - WeddingGift - Helamã Y. Barbour - PR/BR</p>
        <p>
          Last Modified: <span id="lastModified">{currentDate}</span>
        </p>
      </footer>
    </>
  );
}
