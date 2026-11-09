export default function Couple() {
  return (
    <>
      <div id="coupleInfo">
        <picture>
          <source
            srcSet="/img/couple-large-l.webp"
            media="(min-width: 800px)"
          />
          <source
            srcSet="/img/couple-large-m.webp"
            media="(min-width: 700px)"
          />
          <source
            srcSet="/img/couple-large-s.webp"
            media="(min-width: 520px)"
          />
          <img src="/img/couple-small.webp" alt="Couples image" />
        </picture>
        <div id="infos">
          <div id="brinca">
            <h2>Nicole e João</h2>
            <p>Nicão</p>
          </div>
          <h3>Informações do casamento:</h3>
          <ul>
            <li>Data: 19/02/2027</li>
            <li>Horário: Chegada 17:30, começo da cerimônia 18h.</li>
            <li>Local: Espaço Floratta - Av. José Bonifácio, número 2029 - Cambé</li>
          </ul>
        </div>
      </div>
    </>
  );
}
