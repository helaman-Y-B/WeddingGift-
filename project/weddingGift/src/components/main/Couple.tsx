import { Link } from "react-router-dom";

export default function Couple() {

  const somethingImage = "/img/couple-large.jpeg";

  return (
    <>
      <div id="coupleInfo">
        <img src={somethingImage} alt="Couples image" />
        <div id="infos">
          <div id="brinca">
             <h2>Nicole e João</h2>
             <p>Nicão</p>
          </div>
          <p>Venha conhecer a nossa <Link to="/history">História!</Link></p>
        </div>
      </div>
    </>
  );
}
