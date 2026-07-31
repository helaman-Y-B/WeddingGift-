import { Link } from "react-router-dom";

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
          <p>
            Gostaria de participar deste momento conosco?{" "}
            <a href="http://">Save the Date!</a>
          </p>
          <p>
            Venha conhecer a nossa <Link to="/history">História!</Link>
          </p>
        </div>
      </div>
    </>
  );
}
