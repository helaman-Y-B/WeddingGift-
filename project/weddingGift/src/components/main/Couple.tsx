import { Link } from "react-router-dom";

export default function Couple() {

  const somethingImage = "/img/something.webp";

  return (
    <>
      <div id="coupleInfo">
        <img src={somethingImage} alt="Couples image" />
        <div id="infos">
          <h2>Couples name</h2>
          <p>Venha conhecer a nossa <Link to="/history">História!</Link></p>
        </div>
      </div>
    </>
  );
}
